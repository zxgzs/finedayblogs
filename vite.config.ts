import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-imports.d.ts'
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // 环境变量注入
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_BLOG_TITLE || '我的个人博客'),
      __APP_AUTHOR__: JSON.stringify(env.VITE_BLOG_AUTHOR || '博主')
    },
    // 构建优化
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
            'element-plus': ['element-plus'],
            'utils': ['@/utils/format', '@/utils/seo']
          }
        }
      },
      // 代码分割
      chunkSizeWarningLimit: 1500,
      // 使用 esbuild 压缩（更快，无需额外安装）
      minify: 'esbuild',
      esbuildOptions: {
        drop: mode === 'production' ? ['console', 'debugger'] : []
      }
    },
    // 开发服务器
    server: {
      port: 5173,
      open: true,
      // 代理配置（开发时使用）
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'element-plus']
    }
  }
})
