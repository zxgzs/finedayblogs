<template>
  <div class="loading-container" :style="{ height: height + 'px' }">
    <div class="spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  height?: number
  text?: string
}>()

withDefaults(defineProps<{
  height?: number
  text?: string
}>(), {
  height: 200,
  text: '加载中...'
})
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  
  &:nth-child(1) {
    animation-delay: -0.45s;
    border-top-color: var(--primary-color);
  }
  
  &:nth-child(2) {
    animation-delay: -0.3s;
    border-top-color: var(--secondary-color);
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
  }
  
  &:nth-child(3) {
    animation-delay: -0.15s;
    border-top-color: var(--accent-color);
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>
