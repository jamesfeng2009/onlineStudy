/**
 * 结构化日志工具 — 基于 Fastify 内置 pino 封装
 *
 * 核心能力：
 *   - 每条日志自动携带 trace_id（请求级追踪）和 user_id（用户级追踪）
 *   - JSON 结构化输出，便于 ELK / Datadog / Vercel Logs 采集
 *   - 提供 createRouteLogger() 供路由级业务日志使用
 *
 * 用法：
 *   // 在路由中
 *   import { createRouteLogger } from "../lib/logger.js";
 *   const log = createRouteLogger("auth");
 *   log.info(request, "user login attempt", { email });
 */

import { randomUUID } from "crypto";

/**
 * 生成 trace_id（UUID v4，去掉连字符更短）
 * 用于唯一标识一个请求的全链路
 */
export function generateTraceId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 16);
}

/**
 * pino 自定义序列化器 — 控制日志中 request 对象的输出字段
 * 避免把整个 request 对象打进去（可能含敏感 header）
 */
export const pinoSerializers = {
  req(req: any) {
    return {
      method: req.method,
      url: req.url,
      // trace_id 来自 Fastify 的 reqId（genReqId 生成）
      trace_id: req.id,
    };
  },
  res(res: any) {
    return {
      statusCode: res.statusCode,
    };
  },
};

/**
 * 从 FastifyRequest 中提取 user_id（如果 JWT 已验证）
 * Fastify JWT 插件验证后会把 payload 挂到 request.user 上
 */
export function extractUserId(request: any): string | undefined {
  try {
    return request.user?.userId;
  } catch {
    return undefined;
  }
}

/**
 * 构建请求级日志上下文 — 包含 trace_id + user_id
 * 供 onResponse hook 使用
 */
export function buildRequestLogContext(request: any, reply: any, durationMs: number) {
  return {
    trace_id: request.id,
    user_id: extractUserId(request) ?? "-",
    method: request.method,
    url: request.url,
    status: reply.statusCode,
    duration_ms: durationMs,
  };
}

/**
 * 路由级日志工厂 — 供各路由文件使用
 *
 * 用法：
 *   const log = createRouteLogger("auth");
 *   log.info(request, "user registered", { userId });
 *   log.error(request, "db write failed", err);
 *
 * 每条日志自动带 trace_id（从 request.id 取）+ user_id（从 request.user 取）
 */
export function createRouteLogger(module: string) {
  return {
    info(request: any, msg: string, extra?: Record<string, unknown>) {
      request.log.info(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
    warn(request: any, msg: string, extra?: Record<string, unknown>) {
      request.log.warn(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
    error(request: any, msg: string, extra?: Record<string, unknown>) {
      request.log.error(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
    debug(request: any, msg: string, extra?: Record<string, unknown>) {
      request.log.debug(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
  };
}
