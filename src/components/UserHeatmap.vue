<template>
  <div class="user-heatmap">
    <div class="heatmap-header">
      <h3>
        <el-icon><Grid /></el-icon>
        用户行为热力图
      </h3>
      <el-select v-model="viewMode" size="small" style="width: 100px">
        <el-option label="点击热力" value="click" />
        <el-option label="停留时长" value="duration" />
      </el-select>
    </div>

    <div class="heatmap-container" ref="heatmapRef">
      <div
        v-for="region in heatmapRegions"
        :key="region.region"
        class="heatmap-region"
        :style="{ opacity: region.heat / 100 }"
        :title="`${region.region}: ${region.interactions} 次交互`"
      >
        <div class="region-label">{{ region.region }}</div>
        <div class="region-stats">
          <span>{{ region.interactions }} 次</span>
          <span class="region-heat">{{ region.heat.toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <div class="heatmap-legend">
      <div class="legend-title">热度说明</div>
      <div class="legend-scale">
        <span class="legend-label">低</span>
        <div class="legend-bar">
          <div class="legend-colors">
            <div class="legend-color" style="background: rgba(64, 158, 255, 0.2)"></div>
            <div class="legend-color" style="background: rgba(64, 158, 255, 0.5)"></div>
            <div class="legend-color" style="background: rgba(64, 158, 255, 0.8)"></div>
          </div>
        </div>
        <span class="legend-label">高</span>
      </div>
    </div>

    <div class="heatmap-tips">
      <el-icon><InfoFilled /></el-icon>
      <span>基于用户点击、停留等行为生成的热力图，帮助了解用户关注的重点区域</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Grid, InfoFilled } from '@element-plus/icons-vue'
import type { HeatmapData } from '@/composables/useAnalytics'

interface Props {
  heatmapData: HeatmapData[]
}

const props = defineProps<Props>()

const viewMode = ref<'click' | 'duration'>('click')
const heatmapRef = ref<HTMLDivElement>()

const heatmapRegions = computed(() => {
  return props.heatmapData.map(data => ({
    region: data.region,
    heat: data.heat,
    interactions: data.interactions
  }))
})

const trackClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()

  const position = {
    x: event.clientX,
    y: event.clientY
  }

  // 这里可以记录到后端或localStorage
  console.log('Click at:', position)
}

onMounted(() => {
  if (heatmapRef.value) {
    heatmapRef.value.addEventListener('click', trackClick)
  }
})

onUnmounted(() => {
  if (heatmapRef.value) {
    heatmapRef.value.removeEventListener('click', trackClick)
  }
})
</script>

<style scoped lang="scss">
.user-heatmap {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);

  .heatmap-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .heatmap-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;

    .heatmap-region {
      position: relative;
      padding: 24px;
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.05) 100%);
      border: 2px solid var(--primary-color);
      border-radius: 12px;
      transition: all 0.3s;
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary-color);
        opacity: 0.6;
      }

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

        &::before {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      .region-label {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      .region-stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 14px;
        color: var(--text-secondary);

        .region-heat {
          font-weight: 600;
          color: var(--primary-color);
        }
      }
    }
  }

  .heatmap-legend {
    padding: 16px;
    background: var(--bg-color);
    border-radius: 8px;
    margin-bottom: 16px;

    .legend-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .legend-scale {
      display: flex;
      align-items: center;
      gap: 12px;

      .legend-label {
        font-size: 12px;
        color: var(--text-secondary);
      }

      .legend-bar {
        flex: 1;
        height: 20px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;

        .legend-colors {
          display: flex;
          height: 100%;

          .legend-color {
            flex: 1;
            height: 100%;
          }
        }
      }
    }
  }

  .heatmap-tips {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
    background: var(--primary-color-light);
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
    font-size: 14px;
    color: var(--text-primary);
  }
}
</style>
