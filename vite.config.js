import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // 天地图 Web 服务 API 跨域转发（生产环境用 Nginx 同规则反代）
      '/tdt-api': {
        target: 'https://api.tianditu.gov.cn',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/tdt-api/, '')
      }
    }
  }
})
