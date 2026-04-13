<template>
  <div v-if="visible" class="sign-dialog" @click.stop>
    <div class="sign-content">
      <div class="sign-header">
        <span class="sign-title">每日签到</span>
        <span class="close-btn" @click="close">
          <el-icon><Close/></el-icon>
        </span>
      </div>
      <div class="sign-body">
        <div class="sign-calendar">
          <div class="calendar-header">
            <span v-for="day in ['日','一','二','三','四','五','六']" :key="day">{{ day }}</span>
          </div>
          <div class="calendar-days">
            <span
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="{
                'signed': signedDays.includes(day),
                'today': day === today && signedDays.includes(day)
              }"
            >{{ day }}</span>
          </div>
        </div>
        <div class="sign-stats">
          <div class="stat-item">
            <span class="stat-value">{{ signedDays.length }}</span>
            <span class="stat-label">累计签到</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ currentStreak }}</span>
            <span class="stat-label">连续签到</span>
          </div>
        </div>
        <el-button
          :disabled="hasSignedToday"
          class="sign-btn"
          size="large"
          type="primary"
          @click="handleSign"
        >
          <el-icon v-if="!hasSignedToday">
            <Calendar/>
          </el-icon>
          <el-icon v-else>
            <CircleCheck/>
          </el-icon>
          {{ hasSignedToday ? '今日已签到' : '立即签到' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Close, Calendar, CircleCheck } from '@element-plus/icons-vue'

const visible = defineModel<boolean>('visible')

defineProps<{
  signedDays: number[]
  today: number
  currentStreak: number
  calendarDays: number[]
  hasSignedToday: boolean
}>()

const emit = defineEmits(['close', 'sign'])

const close = () => {
  emit('close')
}

const handleSign = () => {
  emit('sign')
}
</script>

<style scoped>
.sign-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 360px;
  animation: signPop 0.3s ease;

  .sign-content {
    .sign-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);

      .sign-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .close-btn {
        cursor: pointer;
        color: var(--text-muted);
        transition: color 0.3s;

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .sign-body {
      padding: 20px;

      .sign-calendar {
        background: var(--card-glass);
        border-radius: var(--radius);
        padding: 12px;
        margin-bottom: 16px;

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          text-align: center;

          span {
            width: 28px;
            height: 28px;
            line-height: 28px;
            border-radius: 50%;
            font-size: 12px;
            color: var(--text-muted);
            margin: 0 auto;

            &.signed {
              background: linear-gradient(135deg, var(--primary-color), var(--info-color));
              color: white;
            }

            &.today {
              border: 2px solid var(--primary-color);
            }
          }
        }
      }

      .sign-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 16px;

        .stat-item {
          text-align: center;

          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
            display: block;
          }

          .stat-label {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
      }

      .sign-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
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

@keyframes signPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(103, 194, 58, 0);
  }
}
</style>
