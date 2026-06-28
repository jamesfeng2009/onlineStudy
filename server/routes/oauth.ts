import type { FastifyPluginAsync } from "fastify";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { sendError } from "../lib/response.js";
import { computeStreakFromLastActive } from "../lib/level.js";

// ====== OAuth 配置 ======
// 后端外部可访问 URL：OAuth provider 需要能重定向到这个地址
// 本地开发默认 http://localhost:3001，生产环境必须设置 BACKEND_URL
const BACKEND_URL = process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? "3001"}`;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET!;
const STATE_TTL_MS = 10 * 60 * 1000; // state 有效期 10 分钟

type Provider = "google" | "github";

interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  scope: string;
  authUrl: string; // 授权页 URL
  tokenUrl: string; // 换 token 的 URL
  userInfoUrl: string; // 拿用户信息的 URL
}

function getProviderConfig(provider: Provider): ProviderConfig | null {
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    return {
      clientId,
      clientSecret,
      scope: "openid email profile",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    };
  }
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    scope: "user:email",
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
  };
}

// ====== State CSRF 防护（无状态，用 HMAC 签名） ======
function generateState(provider: Provider): string {
  const ts = Date.now().toString(36);
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${provider}.${ts}.${nonce}`;
  const hmac = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${hmac}`).toString("base64url");
}

function verifyState(state: string, expectedProvider: Provider): boolean {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length !== 4) return false;
    const [provider, ts, nonce, hmac] = parts;
    if (provider !== expectedProvider) return false;
    const payload = `${provider}.${ts}.${nonce}`;
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("hex");
    if (hmac !== expected) return false;
    const age = Date.now() - parseInt(ts, 36);
    return age >= 0 && age < STATE_TTL_MS;
  } catch {
    return false;
  }
}

// ====== 拿到 provider profile 后的统一处理 ======
async function handleOAuthProfile(
  fastify: import("fastify").FastifyInstance,
  reply: import("fastify").FastifyReply,
  provider: Provider,
  profile: { id: string; email: string | null; name: string | null; avatar: string | null }
) {
  if (!profile.email) {
    return sendError(reply, "BAD_REQUEST", `${provider} 未返回邮箱，无法登录`);
  }

  const normalizedEmail = profile.email.toLowerCase().trim();
  const providerUserId = String(profile.id);

  // 1. 先按 provider+providerId 找现有绑定
  let user = await prisma.user.findUnique({
    where: { oauthProvider_oauthId: { oauthProvider: provider, oauthId: providerUserId } },
  });

  // 2. 若无绑定，看邮箱是否已被注册（密码用户转 OAuth）
  if (!user) {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: provider,
          oauthId: providerUserId,
          emailVerified: true,
          avatar: user.avatar ?? profile.avatar,
        },
      });
    }
  }

  // 3. 全新用户：创建
  if (!user) {
    const lang = await prisma.language.findUnique({ where: { code: "en" } });
    if (!lang) {
      return sendError(reply, "INTERNAL_ERROR", "默认语言 en 不存在，无法注册");
    }
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: profile.name ?? normalizedEmail.split("@")[0] ?? `user_${providerUserId.slice(-6)}`,
        avatar: profile.avatar,
        oauthProvider: provider,
        oauthId: providerUserId,
        emailVerified: true,
        targetLanguage: "en",
        uiLanguage: "en",
        nativeLanguage: "en",
        jwtVersion: 1,
      },
    });
  } else {
    // 已有用户：更新 streak / lastActive
    const { streak, lastActive } = computeStreakFromLastActive(user.lastActive, user.streak);
    user = await prisma.user.update({
      where: { id: user.id },
      data: { lastActive, streak },
    });
  }

  // 签发 JWT
  const token = fastify.jwt.sign(
    { userId: user.id, version: user.jwtVersion },
    { expiresIn: "7d" }
  );

  // 重定向回前端，token 用 URL fragment 传给前端，避免出现在 server log / referrer
  const redirect = new URL(`${FRONTEND_URL}/auth/callback`);
  redirect.hash = `token=${token}`;
  return reply.redirect(redirect.toString(), 302);
}

// ====== 换 token + 拿 profile ======
async function exchangeCodeForProfile(
  config: ProviderConfig,
  code: string,
  redirectUri: string
): Promise<{ id: string; email: string | null; name: string | null; avatar: string | null }> {
  // 换 access_token
  const tokenRes = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`token exchange failed: ${tokenRes.status}`);
  }
  const tokenBody = (await tokenRes.json()) as {
    access_token: string;
    id_token?: string; // Google 返回
  };

  // Google: id_token 里有 profile，直接解析
  if (tokenBody.id_token) {
    const payload = JSON.parse(
      Buffer.from(tokenBody.id_token.split(".")[1], "base64").toString("utf8")
    ) as { sub: string; email?: string; name?: string; picture?: string };
    return {
      id: payload.sub,
      email: payload.email ?? null,
      name: payload.name ?? null,
      avatar: payload.picture ?? null,
    };
  }

  // GitHub / Google（无 id_token 时）：用 access_token 拉 userinfo
  const userRes = await fetch(config.userInfoUrl, {
    headers: { Authorization: `Bearer ${tokenBody.access_token}` },
  });
  if (!userRes.ok) {
    throw new Error(`userinfo fetch failed: ${userRes.status}`);
  }
  const userInfo = (await userRes.json()) as {
    id?: number | string;
    sub?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
    avatar_url?: string | null;
    login?: string;
  };

  // GitHub 邮箱可能为 null，单独拉 emails API
  let email = userInfo.email ?? null;
  if (!email && config.userInfoUrl.includes("github.com")) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenBody.access_token}` },
    });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>;
      email = emails.find((e) => e.primary && e.verified)?.email ?? null;
    }
  }

  return {
    id: String(userInfo.id ?? userInfo.sub ?? ""),
    email,
    name: userInfo.name ?? userInfo.login ?? null,
    avatar: userInfo.picture ?? userInfo.avatar_url ?? null,
  };
}

const oauthRoutes: FastifyPluginAsync = async (fastify) => {
  // 调试：打印 env 读取状态（不泄露值，只打印是否存在 + 长度）
  console.log("[oauth] env check:", {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `len=${process.env.GOOGLE_CLIENT_ID.length}` : "MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? `len=${process.env.GOOGLE_CLIENT_SECRET.length}` : "MISSING",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? `len=${process.env.GITHUB_CLIENT_ID.length}` : "MISSING",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? `len=${process.env.GITHUB_CLIENT_SECRET.length}` : "MISSING",
    BACKEND_URL: process.env.BACKEND_URL ?? "MISSING",
  });

  const enabledProviders: Provider[] = [];
  if (getProviderConfig("google")) enabledProviders.push("google");
  if (getProviderConfig("github")) enabledProviders.push("github");

  fastify.log.info(`[oauth] enabled providers: ${enabledProviders.join(", ") || "none"}`);

  if (enabledProviders.length === 0) {
    fastify.log.warn("[oauth] No OAuth provider configured (GOOGLE_*/GITHUB_* env vars missing). OAuth disabled.");
    return;
  }

  // ====== 发起 OAuth 跳转：GET /auth/oauth/:provider ======
  fastify.get("/auth/oauth/:provider", async (request, reply) => {
    const provider = (request.params as { provider: string }).provider as Provider;
    const config = getProviderConfig(provider);
    if (!config || !enabledProviders.includes(provider)) {
      return sendError(reply, "NOT_FOUND", `OAuth provider '${provider}' 未启用`);
    }

    const redirectUri = `${BACKEND_URL}/api/auth/oauth/${provider}/callback`;
    const state = generateState(provider);
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: config.scope,
      state,
    });
    return reply.redirect(`${config.authUrl}?${params.toString()}`, 302);
  });

  // ====== OAuth 回调：GET /auth/oauth/:provider/callback?code=xxx&state=xxx ======
  fastify.get("/auth/oauth/:provider/callback", async (request, reply) => {
    const provider = (request.params as { provider: string }).provider as Provider;
    const config = getProviderConfig(provider);
    if (!config || !enabledProviders.includes(provider)) {
      return sendError(reply, "NOT_FOUND", `OAuth provider '${provider}' 未启用`);
    }

    const { code, state } = request.query as { code?: string; state?: string };
    if (!code || !state) {
      return sendError(reply, "BAD_REQUEST", "缺少 code 或 state 参数");
    }
    if (!verifyState(state, provider)) {
      return sendError(reply, "BAD_REQUEST", "state 校验失败，请重试");
    }

    const redirectUri = `${BACKEND_URL}/api/auth/oauth/${provider}/callback`;
    try {
      const profile = await exchangeCodeForProfile(config, code, redirectUri);
      return await handleOAuthProfile(fastify, reply, provider, profile);
    } catch (err) {
      fastify.log.error({ err, provider }, "OAuth callback failed");
      return sendError(reply, "UNAUTHORIZED", `${provider} 登录失败，请重试`);
    }
  });
};

export default oauthRoutes;
