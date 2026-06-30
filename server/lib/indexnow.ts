/**
 * IndexNow 提交模块
 *
 * IndexNow 是 Bing / Yandex / Naver 联合支持的主动推送协议：
 * 当博客文章发布或更新时，POST 一个 urlList 到 api.indexnow.org，
 * 让搜索引擎在数小时内（而非数周）抓取新内容。
 *
 * 文档: https://www.indexnow.org/documentation
 *
 * - Key 文件: public/{INDEXNOW_KEY}.txt — Vite 会原样拷到 dist/
 * - 触发点: server/routes/blog.ts 的 create / update handler
 * - 批量提交: server/routes/seo.ts 的 POST /seo/indexnow
 *
 * 失败时只 log 不阻断主流程（fire-and-forget）。
 */

const INDEXNOW_KEY = "04507e3f9af5e9fcaf36e0302f7aeb4a";
const INDEXNOW_API = "https://api.indexnow.org/indexnow";
const SITE_HOST = "lang-oria.com";
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

/**
 * 提交一批 URL 到 IndexNow。
 *
 * @param urls 要提交的完整 URL 列表（必须包含 https:// 前缀）
 * @returns IndexNow 返回的 HTTP 状态码
 *   - 200: 已接受并处理
 *   - 202: 已接受，稍后处理
 *   - 422: 验证失败（通常是 key 文件不可访问）
 *   - 429: 超出速率限制
 */
export async function submitToIndexNow(urls: string[]): Promise<number> {
  if (urls.length === 0) return 0;
  // IndexNow 单次最多 10000 URL，超出会拒绝
  const batch = urls.slice(0, 10000);

  try {
    const body = JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    });

    const res = await fetch(INDEXNOW_API, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
      // 不要让单次提交卡住构建或请求超过 10s
      signal: AbortSignal.timeout(10_000),
    });

    if (res.ok) {
      console.log(
        `[indexnow] submitted ${batch.length} URL(s): ${res.status} ${res.statusText}`
      );
    } else {
      console.warn(
        `[indexnow] submission failed: ${res.status} ${res.statusText}`
      );
    }
    return res.status;
  } catch (err) {
    console.warn(
      `[indexnow] network error:`,
      err instanceof Error ? err.message : String(err)
    );
    return 0;
  }
}

/**
 * 为单篇博客文章生成完整 URL 并提交。
 *
 * @param slug 文章 slug
 * @param locale 文章语言代码（如 en/zh/ja）
 */
export async function submitBlogPost(slug: string, locale = "en"): Promise<void> {
  const path = `/blog/${slug}`;
  const url =
    locale === "en"
      ? `https://${SITE_HOST}${path}`
      : `https://${SITE_HOST}/${locale}${path}`;
  await submitToIndexNow([url]);
}
