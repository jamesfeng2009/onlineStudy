import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './lib/i18n'
import { extractLocaleFromPath } from './lib/i18n'
import { ensureLearnNamespace } from './lib/learn-i18n'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

async function bootstrap() {
  // /languages/* 页面使用独立的 "learn" i18n 命名空间（按需加载）。
  // 预渲染 HTML 已带本地化内容，水合前必须确保同一命名空间已就绪，
  // 否则首渲染会把已渲染的本地文案替换成 key/英文，造成内容闪烁与
  // hydration mismatch。
  const { locale, strippedPath } = extractLocaleFromPath(window.location.pathname)
  if (strippedPath.startsWith('/languages')) {
    await ensureLearnNamespace(locale)
  }

  // 预渲染页面（dist/<route>/index.html）已经在 root 内带有服务端渲染的
  // 静态 HTML —— 用 hydrateRoot 复用现有 DOM，避免整页重绘闪烁；
  // 普通 SPA 入口（dist/index.html）root 为空，走 createRoot 首次渲染。
  if (container.hasChildNodes()) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
}

void bootstrap()
