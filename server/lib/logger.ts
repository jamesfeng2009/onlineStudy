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
 * logger 实际访问的 request/reply 最小结构。
 * 用结构化类型而非 FastifyRequest/FastifyReply，避免 fastify() 的
 * options 重载推断因 serializers 参数类型而落到 http2 分支。
 */
interface LoggableRequest {
  id: string | number;
  method: string;
  url: string;
  user?: { userId?: string };
  log: {
    info(obj: object, msg?: string): void;
    warn(obj: object, msg?: string): void;
    error(obj: object, msg?: string): void;
    debug(obj: object, msg?: string): void;
  };
}

interface LoggableReply {
  statusCode: number;
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req(req: any) {
    return {
      method: req.method,
      url: req.url,
      // trace_id 来自 Fastify 的 reqId（genReqId 生成）
      trace_id: req.id,
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export function extractUserId(request: LoggableRequest): string | undefined {
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
export function buildRequestLogContext(request: LoggableRequest, reply: LoggableReply, durationMs: number) {
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
    info(request: LoggableRequest, msg: string, extra?: Record<string, unknown>) {
      request.log.info(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
    warn(request: LoggableRequest, msg: string, extra?: Record<string, unknown>) {
      request.log.warn(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
    error(request: LoggableRequest, msg: string, extra?: Record<string, unknown>) {
      request.log.error(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
    debug(request: LoggableRequest, msg: string, extra?: Record<string, unknown>) {
      request.log.debug(
        { module, trace_id: request.id, user_id: extractUserId(request) ?? "-", ...extra },
        msg,
      );
    },
  };
}
