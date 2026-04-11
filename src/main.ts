import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './styles/global.scss'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')

// 注册全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

// 性能监控（生产环境）
if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    console.log('Page Load Time:', perf.loadEventEnd - perf.fetchStart, 'ms')
  })
}
