<template>
  <div class="reading-progress-container" v-if="visible">
    <div class="reading-progress-bar" :style="{ width: progress + '%' }">
      <span class="progress-percent">{{ Math.round(progress) }}%</span>
    </div>
    <div class="reading-info" v-if="showInfo">
      <span class="info-item" v-if="readingTime > 0">
        <el-icon><Timer /></el-icon>
        约 {{ readingTime }} 分钟
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  progress: number
  readingTime?: number
  visible?: boolean
  showInfo?: boolean
}>()

withDefaults(defineProps<{
  progress: number
  readingTime?: number
  visible?: boolean
  showInfo?: boolean
}>(), {
  visible: true,
  showInfo: true,
  readingTime: 0
})
</script>

<style scoped lang="scss">
.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: transparent;
}

.reading-progress-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: width 0.1s ease;
  position: relative;
  box-shadow: 0 0 10px var(--primary-color);
  
  .progress-percent {
    position: absolute;
    right: 0;
    top: 8px;
    font-size: 0.75rem;
    color: var(--primary-color);
    font-weight: 600;
    text-shadow: 0 0 5px var(--primary-color);
  }
}

.reading-info {
  position: absolute;
  right: 16px;
  top: 8px;
  display: flex;
  gap: 12px;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--card-bg);
    padding: 4px 8px;
    border-radius: var(--radius-full);
    backdrop-filter: blur(10px);
  }
}
</style>
