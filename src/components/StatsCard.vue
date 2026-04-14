<template>
  <div class="stats-card" :class="[`stats-card-${type}`, { 'is-loading': loading }]">
    <div class="stats-card-icon">
      <el-icon :size="24">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stats-card-content">
      <div class="stats-card-title">{{ title }}</div>
      <div class="stats-card-value">
        <span v-if="loading">...</span>
        <span v-else>{{ formattedValue }}</span>
        <span v-if="unit" class="stats-card-unit">{{ unit }}</span>
      </div>
      <div v-if="trend !== undefined" class="stats-card-trend" :class="`trend-${trendType}`">
        <el-icon :size="14">
          <component :is="trendIcon" />
        </el-icon>
        <span>{{ Math.abs(trend) }}%</span>
        <span class="trend-label">较上期</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown, Minus } from '@element-plus/icons-vue'

interface Props {
  title: string
  value: number | string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: any
  unit?: string
  trend?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  trend: undefined,
  loading: false
})

const trendType = computed(() => {
  if (props.trend === undefined) return 'none'
  if (props.trend > 0) return 'up'
  if (props.trend < 0) return 'down'
  return 'flat'
})

const trendIcon = computed(() => {
  if (props.trend === undefined) return Minus
  if (props.trend > 0) return ArrowUp
  if (props.trend < 0) return ArrowDown
  return Minus
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value

  // 格式化大数字
  if (props.value >= 1000000) {
    return (props.value / 1000000).toFixed(1) + 'M'
  }
  if (props.value >= 1000) {
    return (props.value / 1000).toFixed(1) + 'K'
  }

  return props.value.toLocaleString()
})
</script>

<style scoped lang="scss">
.stats-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: all 0.3s;

  &.is-loading {
    opacity: 0.6;
    pointer-events: none;
  }

  .stats-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }

  &.stats-card-primary .stats-card-icon {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-light) 100%);
    color: white;
  }

  &.stats-card-success .stats-card-icon {
    background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
    color: white;
  }

  &.stats-card-warning .stats-card-icon {
    background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
    color: white;
  }

  &.stats-card-danger .stats-card-icon {
    background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
    color: white;
  }

  &.stats-card-info .stats-card-icon {
    background: linear-gradient(135deg, #909399 0%, #b1b3b8 100%);
    color: white;
  }

  .stats-card-content {
    flex: 1;
    min-width: 0;

    .stats-card-title {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .stats-card-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;

      .stats-card-unit {
        font-size: 14px;
        font-weight: 400;
        color: var(--text-secondary);
        margin-left: 4px;
      }
    }

    .stats-card-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      font-size: 12px;

      .trend-label {
        color: var(--text-secondary);
      }

      &.trend-up {
        color: #67c23a;
      }

      &.trend-down {
        color: #f56c6c;
      }

      &.trend-flat {
        color: var(--text-secondary);
      }
    }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
  }
}
</style>
