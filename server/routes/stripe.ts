import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";
import { stripe, STRIPE_PUBLISHABLE_KEY } from "../lib/stripe";
import { withStripeIdempotency } from "../lib/idempotency";

interface TierConfig {
  priceIdEnv?: string;
  lookupKey: string;
  fallbackAmount: number;
  currency: string;
  tier: "basic" | "vip";
  title: string;
}

const tierConfigs: TierConfig[] = [
  {
    priceIdEnv: process.env.STRIPE_PRICE_BASIC,
    lookupKey: "basic_monthly",
    fallbackAmount: 900,
    currency: "usd",
    tier: "basic",
    title: "LinguaVerse Basic Monthly",
  },
  {
    priceIdEnv: process.env.STRIPE_PRICE_VIP,
    lookupKey: "vip_monthly",
    fallbackAmount: 2900,
    currency: "usd",
    tier: "vip",
    title: "LinguaVerse VIP Monthly",
  },
];

async function resolvePrice(config: TierConfig): Promise<
  | { priceId: string; kind: "price_id" | "lookup" | "adhoc" }
  | { priceData: { currency: string; unit_amount: number; product_data: { name: string } }; kind: "adhoc_data" }
> {
  if (config.priceIdEnv && config.priceIdEnv.startsWith("price_")) {
    return { priceId: config.priceIdEnv, kind: "price_id" };
  }

  try {
    const prices = await stripe.prices.list({
      lookup_keys: [config.lookupKey],
      active: true,
      limit: 1,
    });
    if (prices.data.length > 0) {
      return { priceId: prices.data[0].id, kind: "lookup" };
    }
  } catch {
    // ignore; fall through
  }

  return {
    priceData: {
      currency: config.currency,
      unit_amount: config.fallbackAmount,
      product_data: { name: config.title },
    },
    kind: "adhoc_data",
  };
}

const stripeRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    await request.jwtVerify();
  };

  // ====== Checkout Session 创建 ======
  fastify.post<{
    Body: { tier: "basic" | "vip" };
  }>("/stripe/checkout-session", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { tier } = request.body;

    const config = tierConfigs.find((c) => c.tier === tier);
    if (!config) return reply.status(400).send({ error: "无效的 tier" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return reply.status(404).send({ error: "User not found" });

    // 获取或创建 Stripe customer（幂等）
    let stripeCustomerId: string | undefined;
    const existingSub = await prisma.subscription.findUnique({ where: { userId } });
    if (existingSub?.stripeCustomerId) {
      stripeCustomerId = existingSub.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    const priceInfo = await resolvePrice(config);
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

    const sessionParams: any = {
      customer: stripeCustomerId,
      mode: "subscription",
      success_url: `${frontendUrl}/?stripe=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pricing`,
      metadata: { userId, tier: config.tier },
      line_items: [],
    };

    if ("priceId" in priceInfo) {
      sessionParams.line_items.push({ price: priceInfo.priceId, quantity: 1 });
    } else {
      sessionParams.line_items.push({ price_data: priceInfo.priceData, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // 使用事务更新 subscription（幂等 upsert）
    await prisma.$transaction(async (tx) => {
      await tx.subscription.upsert({
        where: { userId },
        update: { stripeCustomerId },
        create: {
          userId,
          stripeCustomerId,
          tier: config.tier,
          status: "pending",
          amountTotal: "priceId" in priceInfo ? 0 : priceInfo.priceData.unit_amount,
          currency: "priceId" in priceInfo ? config.currency : priceInfo.priceData.currency,
        },
      });
    });

    return reply.send({ sessionId: session.id, url: session.url });
  });

  // ====== Webhook 处理（幂等 + 事务） ======
  fastify.post<{ Body: Buffer }>(
    "/stripe/webhook",
    {
      preParsing: [
        (req: any, payload: any, done: any) => {
          done(null, payload);
        },
      ],
      config: { rawBody: true },
    },
    async (request, reply) => {
      const sigHeader = (request.headers["stripe-signature"] as string) ?? "";
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

      // 解析 raw body
      let rawBuffer: Buffer;
      try {
        const body = (request as unknown as { raw?: { body?: Buffer } }).raw?.body;
        rawBuffer =
          body instanceof Buffer
            ? body
            : typeof body === "string"
              ? Buffer.from(body)
              : Buffer.from(JSON.stringify(request.body));
      } catch {
        return reply.status(400).send({ error: "无法获取原始 body" });
      }

      // 验证 webhook 签名
      let event;
      try {
        event = stripe.webhooks.constructEvent(rawBuffer, sigHeader, webhookSecret);
      } catch (err) {
        return reply.status(400).send({ error: `Webhook Error: ${(err as Error).message}` });
      }

      const eventId = event.id;
      const eventType = event.type;
      const eventPayload = event.data.object as any;
      const userId = (eventPayload.metadata?.userId as string) ?? undefined;

      // ====== 幂等处理：使用 withStripeIdempotency ======
      const result = await withStripeIdempotency(
        eventId,
        eventType,
        event as Record<string, unknown>,
        userId,
        async (tx) => {
          // 根据事件类型处理
          if (eventType === "checkout.session.completed") {
            const tier = (eventPayload.metadata?.tier as "basic" | "vip" | undefined) ?? "basic";
            const subscriptionId = typeof eventPayload.subscription === "string" ? eventPayload.subscription : undefined;
            const customerId = typeof eventPayload.customer === "string" ? eventPayload.customer : undefined;
            const amountTotal = eventPayload.amount_total ?? 0;
            const currency = eventPayload.currency ?? "usd";

            if (!userId) return; // 无 userId，跳过

            // 获取 Stripe subscription 详情
            let currentPeriodStart: Date | null = null;
            let currentPeriodEnd: Date | null = null;
            let cancelAtPeriodEnd = false;

            if (subscriptionId) {
              try {
                const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
                if (stripeSub?.current_period_start) {
                  currentPeriodStart = new Date(stripeSub.current_period_start * 1000);
                }
                if (stripeSub?.current_period_end) {
                  currentPeriodEnd = new Date(stripeSub.current_period_end * 1000);
                }
                cancelAtPeriodEnd = !!stripeSub?.cancel_at_period_end;
              } catch {
                // ignore
              }
            }

            // ====== 事务内更新 subscription + user ======
            await tx.subscription.upsert({
              where: { userId },
              update: {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                status: "active",
                tier,
                currentPeriodStart,
                currentPeriodEnd,
                cancelAtPeriodEnd,
                amountTotal,
                currency,
                updatedAt: new Date(),
              },
              create: {
                userId,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                status: "active",
                tier,
                currentPeriodStart,
                currentPeriodEnd,
                cancelAtPeriodEnd,
                amountTotal,
                currency,
              },
            });

            await tx.user.update({
              where: { id: userId },
              data: { role: tier === "vip" ? "vip" : "user" },
            });
          } else if (eventType === "customer.subscription.updated") {
            const sub = eventPayload;
            const subscriptionId = sub.id as string;
            const customerId = typeof sub.customer === "string" ? sub.customer : undefined;
            const status = sub.status as string | undefined;
            const cancelAtPeriodEnd = !!sub.cancel_at_period_end;
            const currentPeriodStart = sub.current_period_start ? new Date(sub.current_period_start * 1000) : null;
            const currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

            // 查找关联的 subscription
            const existing = await tx.subscription.findFirst({
              where: {
                OR: [{ stripeSubscriptionId: subscriptionId }, { stripeCustomerId: customerId ?? "" }],
              },
            });

            if (existing) {
              const tier = existing.tier;
              await tx.subscription.update({
                where: { id: existing.id },
                data: {
                  status: status ?? existing.status,
                  currentPeriodStart,
                  currentPeriodEnd,
                  cancelAtPeriodEnd,
                },
              });

              // 更新用户角色
              if (status === "canceled" || status === "incomplete_expired" || status === "unpaid") {
                await tx.user.update({ where: { id: existing.userId }, data: { role: "user" } });
              } else if (status === "active") {
                await tx.user.update({
                  where: { id: existing.userId },
                  data: { role: tier === "vip" ? "vip" : "user" },
                });
              }
            }
          } else if (eventType === "customer.subscription.deleted") {
            const sub = eventPayload;
            const subscriptionId = sub.id as string;

            const existing = await tx.subscription.findFirst({
              where: { stripeSubscriptionId: subscriptionId },
            });

            if (existing) {
              await tx.subscription.update({
                where: { id: existing.id },
                data: { status: "canceled", cancelAtPeriodEnd: true },
              });
              await tx.user.update({ where: { id: existing.userId }, data: { role: "user" } });
            }
          }
        }
      );

      // 如果已处理，返回成功但不重复执行
      if (result.processed) {
        return reply.send({ received: true, duplicate: true });
      }

      return reply.send({ received: true });
    }
  );

  // ====== Current Plan 查询 ======
  fastify.get("/stripe/current-plan", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };

    const [user, subscription] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.subscription.findUnique({ where: { userId } }),
    ]);

    if (!user) return reply.status(404).send({ error: "User not found" });

    return reply.send({
      role: user.role,
      tier: subscription?.tier ?? "free",
      status: subscription?.status ?? "none",
      stripeSubscriptionId: subscription?.stripeSubscriptionId ?? null,
      currentPeriodStart: subscription?.currentPeriodStart?.toISOString() ?? null,
      currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    });
  });
};

export default stripeRoutes;