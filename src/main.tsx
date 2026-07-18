import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './lib/i18n'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// 预渲染页面（dist/<route>/index.html）已经在 root 内带有服务端渲染的
// 静态 HTML —— 用 hydrateRoot 复用现有 DOM，避免整页重绘闪烁；
// 普通 SPA 入口（dist/index.html）root 为空，走 createRoot 首次渲染。
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
