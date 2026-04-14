<template>
  <transition name="fade">
    <div
      v-if="notification.visible"
      :class="notification.type"
      class="notification"
    >
      <el-icon v-if="notification.type === 'success'">
        <CircleCheck/>
      </el-icon>
      <el-icon v-else-if="notification.type === 'error'">
        <CircleClose/>
      </el-icon>
      <el-icon v-else-if="notification.type === 'warning'">
        <Warning/>
      </el-icon>
      <el-icon v-else>
        <InfoFilled/>
      </el-icon>
      {{ notification.message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CircleCheck, CircleClose, Warning, InfoFilled } from '@element-plus/icons-vue'

const notification = ref({
  visible: false,
  message: '',
  type: 'info' as 'success' | 'warning' | 'error' | 'info'
})

const show = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  notification.value = { visible: true, message, type }
  setTimeout(() => {
    notification.value.visible = false
  }, 3000)
}

onMounted(() => {
  window.addEventListener('show-notification', (e: any) => {
    show(e.detail.message, e.detail.type)
  })
})

defineExpose({ show })
</script>

<style scoped>
.notification {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 12px 20px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 280px;
  animation: slideInRight 0.3s ease;

  &.success {
    border-left: 4px solid #67c23a;
  }

  &.error {
    border-left: 4px solid #f56c6c;
  }

  &.warning {
    border-left: 4px solid #e6a23c;
  }

  &.info {
    border-left: 4px solid var(--primary-color);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
