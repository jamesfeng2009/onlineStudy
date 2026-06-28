import type { FastifyPluginAsync } from "fastify";
import fastifyOauth2 from "@fastify/oauth2";
import { prisma } from "../lib/prisma.js";
import { sendError } from "../lib/response.js";
import { computeStreakFromLastActive } from "../lib/level.js";

// 复用 auth.ts 里的 user 序列化逻辑（独立实现一份避免循环依赖）
function serializeUser(user: {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  level: number;
  exp: number;
  streak: number;
  lastActive: Date;
  uiLanguage: string;
  nativeLanguage: string;
  targetLanguage: string;
  createdAt: Date;
  role: string;
  goalMinutesPerDay: number;
}) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    level: user.level,
    exp: user.exp,
    streak: user.streak,
    lastActive: user.lastActive.toISOString().slice(0, 10),
    uiLanguage: user.uiLanguage,
    nativeLanguage: user.nativeLanguage,
    targetLanguage: user.targetLanguage,
    createdAt: user.createdAt.toISOString(),
    role: user.role,
    goalMinutesPerDay: user.goalMinutesPerDay,
  };
}

const oauthRoutes: FastifyPluginAsync = async (fastify) => {
  const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  const providers: Array<"google" | "github"> = [];
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) providers.push("google");
  if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) providers.push("github");

  // 未配置任何 OAuth provider 时直接跳过注册流程
  if (providers.length === 0) {
    fastify.log.warn("[oauth] No OAuth provider configured (GOOGLE_*/GITHUB_* env vars missing). OAuth disabled.");
    return;
  }

  // 注册 OAuth provider
  if (providers.includes("google")) {
    await fastify.register(fastifyOauth2, {
      name: "googleOAuth",
      scope: ["openid", "email", "profile"],
      credentials: {
        client: { id: GOOGLE_CLIENT_ID!, secret: GOOGLE_CLIENT_SECRET! },
        auth: fastifyOauth2.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: "/api/auth/oauth/google",
      callbackUri: `${FRONTEND_URL}/auth/callback/google`,
    });
  }

  if (providers.includes("github")) {
    await fastify.register(fastifyOauth2, {
      name: "githubOAuth",
      scope: ["user:email"],
      credentials: {
        client: { id: GITHUB_CLIENT_ID!, secret: GITHUB_CLIENT_SECRET! },
        auth: fastifyOauth2.GITHUB_CONFIGURATION,
      },
      startRedirectPath: "/api/auth/oauth/github",
      callbackUri: `${FRONTEND_URL}/auth/callback/github`,
    });
  }

  // 通用 OAuth 回调处理
  async function handleOAuthCallback(
    reply: import("fastify").FastifyReply,
    provider: "google" | "github",
    profile: {
      id: string;
      email: string | null;
      name: string | null;
      avatar: string | null;
    }
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
        // 补绑 OAuth
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
      // 默认目标语言 en，UI 语言从 URL query 带（前端跳转用），这里保守取 en
      // 若 languages 表里没有 en 则报错
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
      // 已有用户：更新 streak / lastActive（与密码登录一致）
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

  // ====== Google 回调 ======
  if (providers.includes("google")) {
    fastify.get("/auth/oauth/google/callback", async (request, reply) => {
      const googleToken = await (fastify as unknown as {
        googleOAuth: { getAccessTokenFromAuthorizationCodeFlow: (req: typeof request) => Promise<{ id_token?: string; token: { access_token: string } }> };
      }).googleOAuth.getAccessTokenFromAuthorizationCodeFlow(request);
      const idToken = googleToken.id_token;
      if (!idToken) {
        return sendError(reply, "UNAUTHORIZED", "Google 未返回 id_token");
      }
      // 解析 id_token payload（JWT 第二段）
      const payload = JSON.parse(
        Buffer.from(idToken.split(".")[1], "base64").toString("utf8")
      ) as {
        sub: string;
        email?: string;
        name?: string;
        picture?: string;
      };
      return handleOAuthCallback(reply, "google", {
        id: payload.sub,
        email: payload.email ?? null,
        name: payload.name ?? null,
        avatar: payload.picture ?? null,
      });
    });
  }

  // ====== GitHub 回调 ======
  if (providers.includes("github")) {
    fastify.get("/auth/oauth/github/callback", async (request, reply) => {
      const ghToken = await (fastify as unknown as {
        githubOAuth: { getAccessTokenFromAuthorizationCodeFlow: (req: typeof request) => Promise<{ token: { access_token: string } }> };
      }).githubOAuth.getAccessTokenFromAuthorizationCodeFlow(request);
      const accessToken = ghToken.token.access_token;

      // 拿 user profile
      const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userRes.ok) {
        return sendError(reply, "UNAUTHORIZED", "GitHub 获取用户信息失败");
      }
      const ghUser = (await userRes.json()) as {
        id: number;
        email: string | null;
        name: string | null;
        avatar_url: string | null;
        login: string;
      };

      // GitHub 用户邮箱可能为 null，单独拉 emails API
      let email = ghUser.email;
      if (!email) {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}` },
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

      return handleOAuthCallback(reply, "github", {
        id: String(ghUser.id),
        email,
        name: ghUser.name ?? ghUser.login,
        avatar: ghUser.avatar_url,
      });
    });
  }
};

export default oauthRoutes;
