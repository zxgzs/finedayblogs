<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">
        © 2026 晴天的博客 · Made with
        <el-icon style="color: #f56c6c;">
          <Star/>
        </el-icon>
        by Vue 3
      </p>
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: var(--card-glass);
  backdrop-filter: blur(10px);
  border-top: 3px solid;
  border-image: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color)) 1;
  padding: 8px 0;
  box-shadow: 0 -4px 20px rgba(255, 107, 157, 0.2);
  z-index: 9998;
}

.footer::before {
  content: '💕';
  position: absolute;
  top: -12px;
  right: 20px;
  font-size: 20px;
  animation: bounce 2s ease-in-out infinite;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.copyright {
  color: var(--text-muted);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
