import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "./prisma.js";
import { sendError } from "./response.js";

export async function adminOnly(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return sendError(reply, "UNAUTHORIZED", "未登录或 token 无效");
  }

  const payload = request.user;
  if (!payload || !payload.userId) {
    return sendError(reply, "UNAUTHORIZED", "未登录");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.role !== "admin") {
    return sendError(reply, "FORBIDDEN", "需要管理员权限");
  }
}
