// Vercel Serverless Function — 所有 /api/* 路由通过 vercel.json rewrite 集中到此处
// 底层用 Fastify 的 inject() 方法处理请求，不需要独立服务器

import type { IncomingMessage, ServerResponse } from "http";
import { buildApp } from "../server/app.js";

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
  const originalUrl = req.url || "/";
  const method = (req.method || "GET").toUpperCase();

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

    // 通过 vercel.json rewrite，实际路径在 __path 查询参数里
    // 例如 /api/auth/register 会被重写成 /api/handler?__path=auth/register
    const urlObj = new URL(originalUrl, "http://localhost");
    const pathParam = urlObj.searchParams.get("__path") || "";
    let url = "/api";
    if (pathParam) {
      url += "/" + pathParam;
    }

    console.log(`[vercel-handler] ${method} ${originalUrl} -> ${url}`);

    // Fastify inject 返回一个 LightMyRequest Response
    const response = await fastify.inject({
      method: method as any,
      url,
      headers,
      payload: rawBody as any,
    });

    console.log(`[vercel-handler] response ${response.statusCode} ${url}`);
    if (response.statusCode === 404) {
      console.log(`[vercel-handler] 404 body: ${response.body}`);
      console.log(`[vercel-handler] routes: ${fastify.printRoutes()}`);
    }

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
    console.error(`[vercel-handler] ${method} ${originalUrl} failed:`, err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
