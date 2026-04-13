<template>
  <div class="series-card" @click="goToSeries">
    <div class="series-cover">
      <el-image v-if="series.coverImage" :src="series.coverImage" fit="cover" />
      <div v-else class="default-cover">
        <el-icon><Document /></el-icon>
      </div>
      <div class="series-overlay">
        <el-tag :type="getStatusType(series.status)" size="small">
          {{ getStatusText(series.status) }}
        </el-tag>
      </div>
    </div>

    <div class="series-content">
      <h3 class="series-title">{{ series.title }}</h3>
      <p class="series-description">{{ series.description }}</p>

      <div class="series-info">
        <div class="info-item">
          <el-icon><Document /></el-icon>
          <span>{{ series.articleIds.length }} 篇文章</span>
        </div>
        <div class="info-item">
          <el-icon><Clock /></el-icon>
          <span>{{ formatDate(series.updatedAt) }}</span>
        </div>
      </div>

      <div class="series-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">已阅读 {{ readArticles.length }}/{{ series.articleIds.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ArticleSeries } from '@/data/series'

const props = defineProps<{
  series: ArticleSeries
  readArticles?: number[]
}>()

const router = useRouter()

const readArticles = computed(() => {
  return props.readArticles || []
})

const progress = computed(() => {
  if (props.series.articleIds.length === 0) return 0
  const readCount = props.series.articleIds.filter(id => readArticles.value.includes(id)).length
  return (readCount / props.series.articleIds.length) * 100
})

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    draft: 'info',
    published: 'success',
    archived: 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    draft: '草稿',
    published: '连载中',
    archived: '已完结'
  }
  return texts[status] || '未知'
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天更新'
  if (days === 1) return '昨天更新'
  if (days < 7) return `${days} 天前更新`
  return date.toLocaleDateString('zh-CN')
}

const goToSeries = () => {
  router.push(`/series/${props.series.id}`)
}
</script>

<style scoped lang="scss">
.series-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  .series-cover {
    width: 100%;
    height: 180px;
    position: relative;
    overflow: hidden;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .default-cover {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--bg-color) 100%);
      color: var(--text-muted);

      :deep(.el-icon) {
        font-size: 56px;
      }
    }

    .series-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }

  .series-content {
    padding: 16px;

    .series-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .series-description {
      margin: 0 0 12px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .series-info {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      font-size: 13px;
      color: var(--text-secondary);

      .info-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .series-progress {
      .progress-bar {
        height: 4px;
        background: var(--bg-color);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 6px;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--primary-color-light));
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      }

      .progress-text {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }
}
</style>
