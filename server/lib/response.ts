/**
 * 统一 API 响应格式
 *
 * 格式: { code: string, message: string, data: any }
 *
 * code 规则:
 *   OK              -> 业务成功
 *   BAD_REQUEST     -> 参数错误 / 业务校验失败
 *   UNAUTHORIZED    -> 未登录 / token 无效
 *   FORBIDDEN       -> 无权限
 *   NOT_FOUND       -> 资源不存在
 *   CONFLICT        -> 资源冲突（如邮箱已注册）
 *   INTERNAL_ERROR  -> 服务器内部错误
 */

import type { FastifyReply } from "fastify";

export type ApiCode =
  | "OK"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface ApiResponse<T = unknown> {
  code: ApiCode;
  message: string;
  data: T;
}

const codeToStatus: Record<ApiCode, number> = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export function sendSuccess<T>(reply: FastifyReply, data: T, message = "success"): FastifyReply {
  return reply.status(codeToStatus.OK).send({ code: "OK", message, data } as ApiResponse<T>);
}

export function sendError(
  reply: FastifyReply,
  code: ApiCode,
  message: string,
  data: unknown = null
): FastifyReply {
  const status = codeToStatus[code] ?? 500;
  return reply.status(status).send({ code, message, data } as ApiResponse<typeof data>);
}
