<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">
        © 2026 我的个人博客 · Made with
        <el-icon style="color: #f56c6c;">
          <Star/>
        </el-icon>
        by Vue 3
      </p>
      <div class="footer-links">
        <router-link to="/about">关于我们</router-link>
        <router-link to="/contact">联系方式</router-link>
        <router-link to="/admin">管理后台</router-link>
        <a href="#" @click.prevent="showNotification('功能开发中...', 'info')">隐私政策</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Star } from '@element-plus/icons-vue'

const showNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  const event = new CustomEvent('show-notification', { detail: { message, type } })
  window.dispatchEvent(event)
}
</script>

<style scoped>
.footer {
  background: var(--card-glass);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border-color);
  padding: 20px 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.copyright {
  color: var(--text-muted);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;

  &:hover {
    color: var(--primary-color);
  }
}
</style>
