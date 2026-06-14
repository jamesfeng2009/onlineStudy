// Vercel Serverless Function — 所有 /api/* 以及 /health 都走这里
// 底层用 Fastify 的 inject() 方法处理请求，不需要独立服务器

import type { IncomingMessage, ServerResponse } from "http";
import { buildApp } from "../server/app";

// 单例模式：同一份实例在冷启动后可被复用（Vercel warm start）
let app: Awaited<ReturnType<typeof buildApp>> | null = null;

async function getApp() {
  if (!app) {
    app = await buildApp();
  }
  return app;
}

// Vercel Node.js runtime: 导出 handler(req, res)
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const fastify = await getApp();

    // 读取 body（Vercel 可能会解析成字符串/对象；我们需要原始 payload）
    let rawBody: string | Buffer | undefined = undefined;
    const reqAny = req as any;
    if (reqAny.body !== undefined && reqAny.body !== null) {
      const b = reqAny.body;
      if (Buffer.isBuffer(b)) rawBody = b;
      else if (typeof b === "string") rawBody = b;
      else rawBody = JSON.stringify(b);
    }

    // headers 转换为小写-key 字典（Fastify inject 需要）
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers ?? {})) {
      if (v === undefined) continue;
      headers[k.toLowerCase()] = Array.isArray(v) ? v.join(",") : String(v);
    }

    const method = (req.method || "GET").toUpperCase() as any;
    const url = req.url || "/";

    // Fastify inject 返回一个 LightMyRequest Response
    const response = await fastify.inject({
      method,
      url,
      headers,
      payload: rawBody as any,
    });

    // 把 Fastify 返回的 headers 写到 res
    for (const [k, v] of Object.entries(response.headers)) {
      if (v === undefined || v === null) continue;
      if (k.toLowerCase() === "content-length") continue; // 让 Node 自动计算
      if (Array.isArray(v)) {
        for (const val of v) res.setHeader(k, String(val));
      } else {
        res.setHeader(k, String(v));
      }
    }

    res.statusCode = response.statusCode;
    res.end(Buffer.from(response.rawPayload));
  } catch (err) {
    console.error("[handler] request failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
