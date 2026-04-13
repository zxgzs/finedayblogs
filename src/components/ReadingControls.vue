<template>
  <div class="reading-controls">
    <div class="read-toolbar">
      <button class="read-btn" :class="{ active: isReading }" @click="toggleRead">
        <el-icon v-if="!isReading"><Headset /></el-icon>
        <el-icon v-else><VideoPause /></el-icon>
        {{ isReading ? '暂停朗读' : '朗读文章' }}
      </button>
      <div class="speed-control" v-if="isReading">
        <span>语速:</span>
        <el-slider v-model="speed" :min="0.5" :max="2" :step="0.1" size="small" />
        <span class="speed-value">{{ speed }}x</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Headset, VideoPause } from '@element-plus/icons-vue'

const isReading = defineModel<boolean>('isReading', { default: false })
const speed = defineModel<number>('speed', { default: 1 })

const emit = defineEmits(['toggle'])

const toggleRead = () => {
  emit('toggle')
}
</script>

<style scoped>
.reading-controls {
  margin: 32px 0;
  padding: 20px;
  background: var(--card-glass);
  border-radius: var(--radius-lg);
}

.read-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.read-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--secondary-color);
  }

  &.active {
    background: #f56c6c;
  }
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.speed-value {
  min-width: 40px;
  font-weight: 600;
  color: var(--primary-color);
}
</style>
