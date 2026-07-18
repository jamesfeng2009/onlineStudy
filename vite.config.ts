import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv 读取 .env / .env.{mode} / .env.local，第三个参数 '' 表示
  // 加载所有变量（不只 VITE_ 前缀），这样 vite.config.ts 内可见。
  // 注意：只有 VITE_ 前缀变量会暴露给客户端 import.meta.env。
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      sourcemap: 'hidden',
    },
    server: {
      watch: {
        // Vite 默认会 watch 整个项目目录。沙箱里 .pnpm-store 含海量
        // 小文件，会耗尽 inotify watcher 上限（ENOSPC）让 dev 崩溃。
        // 这里把不需要触发热重载的大目录显式排除。
        ignored: [
          '**/.pnpm-store/**',
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/.cache/**',
          '**/.trae/**',
          '**/coverage/**',
        ],
      },
    },
    plugins: [
      react({
        babel: {
          plugins: [
            // react-dev-locator 仅用于 Trae IDE 开发期元素定位。
            // 生产构建必须排除：它会给每个元素注入 trae-inspector-*
            // 属性，与预渲染的干净 HTML 产生 hydration mismatch。
            ...(mode === 'development' ? ['react-dev-locator'] : []),
          ],
        },
      }),
      tsconfigPaths(),
      /**
       * HTML env 占位替换插件。
       *
       * Vite 默认不会在 index.html 中替换 %VITE_xxx% 字面量，
       * 这里手动做一次替换，让 GSC/Bing Webmaster 验证 meta 和
       * Cloudflare Web Analytics token 能从 .env 注入。
       *
       * 未设置时替换为空字符串，避免出现 %VITE_xxx% 字面量污染 HTML。
       */
      {
        name: 'html-env-replace',
        transformIndexHtml(html: string) {
          return html
            .replace(/%VITE_GOOGLE_SITE_VERIFICATION%/g, env.VITE_GOOGLE_SITE_VERIFICATION || '')
            .replace(/%VITE_BING_SITE_VERIFICATION%/g, env.VITE_BING_SITE_VERIFICATION || '')
            .replace(/%VITE_CF_WEB_ANALYTICS_TOKEN%/g, env.VITE_CF_WEB_ANALYTICS_TOKEN || '');
        },
      },
    ],
  };
});
