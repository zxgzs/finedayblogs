<template>
  <div class="energy-display" @click="clickHandler">
    <div class="energy-icon">
      <el-icon>
        <Lightning/>
      </el-icon>
    </div>
    <div class="energy-bar">
      <div :style="{ width: (currentEnergy / maxEnergy * 100) + '%' }" class="energy-fill"></div>
    </div>
    <span class="energy-level">Lv.{{ energyLevel }}</span>
  </div>
</template>

<script setup lang="ts">
import { Lightning } from '@element-plus/icons-vue'

defineProps<{
  currentEnergy: number
  maxEnergy: number
  energyLevel: number
}>()

const emit = defineEmits(['click'])

const clickHandler = () => {
  emit('click')
}
</script>

<style scoped>
.energy-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary-color);
  }

  .energy-icon {
    color: #fbbf24;
    display: flex;
  }

  .energy-bar {
    width: 60px;
    height: 6px;
    background: var(--bg-color);
    border-radius: 3px;
    overflow: hidden;

    .energy-fill {
      height: 100%;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      border-radius: 3px;
      transition: width 0.3s;
    }
  }

  .energy-level {
    font-size: 12px;
    font-weight: 700;
    color: #fbbf24;
  }
}
</style>
