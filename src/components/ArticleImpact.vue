<template>
  <div class="article-impact">
    <div class="impact-header">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        文章影响力分析
      </h3>
      <el-select v-model="sortType" size="small" style="width: 120px">
        <el-option label="影响力" value="impact" />
        <el-option label="浏览量" value="views" />
        <el-option label="互动率" value="engagement" />
      </el-select>
    </div>

    <div class="impact-list">
      <div
        v-for="(item, index) in sortedImpacts"
        :key="item.articleId"
        class="impact-item"
      >
        <div class="impact-rank">
          <span class="rank-number" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
        </div>

        <div class="impact-content">
          <div class="impact-title">{{ item.title }}</div>
          <div class="impact-metrics">
            <div class="metric-item">
              <span class="metric-label">浏览</span>
              <span class="metric-value">{{ formatNumber(item.views) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">点赞</span>
              <span class="metric-value">{{ formatNumber(item.likes) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">评论</span>
              <span class="metric-value">{{ formatNumber(item.comments) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">分享</span>
              <span class="metric-value">{{ formatNumber(item.shares) }}</span>
            </div>
          </div>
        </div>

        <div class="impact-score">
          <div class="score-label">影响力</div>
          <div class="score-value">{{ formatNumber(item.impactScore) }}</div>
          <div class="score-trend" :class="`trend-${item.trend}`">
            <el-icon><component :is="getTrendIcon(item.trend)" /></el-icon>
            {{ getTrendText(item.trend) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendCharts, ArrowUp, ArrowDown, Minus } from '@element-plus/icons-vue'
import type { ArticleImpact } from '@/composables/useAnalytics'

interface Props {
  impacts: ArticleImpact[]
}

const props = defineProps<Props>()

const sortType = ref<'impact' | 'views' | 'engagement'>('impact')

const sortedImpacts = computed(() => {
  const sorted = [...props.impacts]

  switch (sortType.value) {
    case 'impact':
      return sorted.sort((a, b) => b.impactScore - a.impactScore)
    case 'views':
      return sorted.sort((a, b) => b.views - a.views)
    case 'engagement':
      return sorted.sort((a, b) => b.engagementRate - a.engagementRate)
    default:
      return sorted
  }
})

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const getTrendIcon = (trend: string) => {
  const icons: Record<string, any> = {
    rising: ArrowUp,
    falling: ArrowDown,
    stable: Minus
  }
  return icons[trend] || Minus
}

const getTrendText = (trend: string) => {
  const texts: Record<string, string> = {
    rising: '上升',
    falling: '下降',
    stable: '稳定'
  }
  return texts[trend] || '稳定'
}
</script>

<style scoped lang="scss">
.article-impact {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);

  .impact-header {
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

  .impact-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .impact-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--bg-color);
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background: var(--card-hover);
        transform: translateX(4px);
      }

      .impact-rank {
        .rank-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--text-secondary);
          color: white;
          font-size: 14px;
          font-weight: 700;

          &.rank-1 {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
          }

          &.rank-2 {
            background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
            box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4);
          }

          &.rank-3 {
            background: linear-gradient(135deg, #cd7f32 0%, #e0a96d 100%);
            box-shadow: 0 2px 8px rgba(205, 127, 50, 0.4);
          }
        }
      }

      .impact-content {
        flex: 1;
        min-width: 0;

        .impact-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .impact-metrics {
          display: flex;
          gap: 24px;

          .metric-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .metric-label {
              font-size: 12px;
              color: var(--text-secondary);
            }

            .metric-value {
              font-size: 16px;
              font-weight: 600;
              color: var(--text-primary);
            }
          }
        }
      }

      .impact-score {
        text-align: center;
        min-width: 80px;

        .score-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .score-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 4px;
        }

        .score-trend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          font-size: 12px;

          &.trend-rising {
            color: #67c23a;
          }

          &.trend-falling {
            color: #f56c6c;
          }

          &.trend-stable {
            color: var(--text-secondary);
          }
        }
      }
    }
  }
}
</style>
