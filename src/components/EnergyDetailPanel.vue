<template>
  <div v-if="visible" class="energy-detail-panel" @click.stop>
    <div class="energy-header">
      <span class="energy-title">
        <el-icon><Lightning/></el-icon>
        阅读能量
      </span>
      <span class="close-btn" @click="close">
        <el-icon><Close/></el-icon>
      </span>
    </div>
    <div class="energy-body">
      <div class="current-level">
        <div class="level-badge">Lv.{{ energyLevel }}</div>
        <div class="level-title">{{ levelTitle }}</div>
      </div>
      <div class="energy-progress-section">
        <div class="progress-label">
          <span>当前能量</span>
          <span>{{ currentEnergy }} / {{ maxEnergy }}</span>
        </div>
        <div class="progress-bar">
          <div :style="{ width: (currentEnergy / maxEnergy * 100) + '%' }" class="progress-fill"></div>
        </div>
      </div>
      <div class="energy-stats">
        <div class="stat-item">
          <span class="stat-value">{{ totalReadTime }}</span>
          <span class="stat-label">累计阅读(分钟)</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ marathonCount }}</span>
          <span class="stat-label">完成马拉松</span>
        </div>
      </div>
      <div class="level-rewards">
        <div class="rewards-title">称号墙</div>
        <div class="rewards-list">
          <div
            v-for="badge in badges"
            :key="badge.id"
            :class="{ unlocked: badge.unlocked }"
            :title="badge.name + ': ' + badge.desc"
            class="badge-item"
          >
            <span class="badge-icon">{{ badge.icon }}</span>
            <span class="badge-name">{{ badge.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lightning, Close } from '@element-plus/icons-vue'

const visible = defineModel<boolean>('visible')

defineProps<{
  energyLevel: number
  levelTitle: string
  currentEnergy: number
  maxEnergy: number
  totalReadTime: number
  marathonCount: number
  badges: Array<{
    id: number
    name: string
    icon: string
    desc: string
    unlocked: boolean
  }>
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.energy-detail-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10002;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 380px;
  animation: signPop 0.3s ease;

  .energy-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);

    .energy-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: var(--text-primary);

      svg {
        color: #fbbf24;
      }
    }

    .close-btn {
      cursor: pointer;
      color: var(--text-muted);

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .energy-body {
    padding: 20px;

    .current-level {
      text-align: center;
      margin-bottom: 20px;

      .level-badge {
        display: inline-block;
        padding: 8px 24px;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: #000;
        font-weight: 800;
        font-size: 20px;
        border-radius: var(--radius-full);
        margin-bottom: 8px;
      }

      .level-title {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }

    .energy-progress-section {
      margin-bottom: 20px;

      .progress-label {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .progress-bar {
        height: 8px;
        background: var(--bg-color);
        border-radius: 4px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          transition: width 0.3s;
        }
      }
    }

    .energy-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }

    .level-rewards {
      .rewards-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .rewards-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          background: var(--bg-color);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius);
          opacity: 0.5;
          transition: all 0.3s;

          &.unlocked {
            opacity: 1;
            border-style: solid;
            border-color: var(--primary-color);
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
          }

          .badge-icon {
            font-size: 24px;
          }

          .badge-name {
            font-size: 10px;
            color: var(--text-muted);
            text-align: center;
          }
        }
      }
    }
  }
}

@keyframes signPop {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
