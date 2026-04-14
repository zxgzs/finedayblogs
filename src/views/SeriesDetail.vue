<template>
  <div v-if="series" class="series-detail-page">
    <!-- 系列头部 -->
    <div class="series-header" :style="headerStyle">
      <div class="header-content">
        <el-tag :type="getStatusType(series?.status || '')" size="large">
          {{ getStatusText(series?.status || '') }}
        </el-tag>
        <h1 class="series-title">{{ series?.title }}</h1>
        <p class="series-description">{{ series?.description }}</p>

        <div class="series-stats">
          <div class="stat-item">
            <el-icon><Document /></el-icon>
            <span>{{ series?.articleIds?.length || 0 }} 篇文章</span>
          </div>
          <div class="stat-item">
            <el-icon><Clock /></el-icon>
            <span>{{ series?.updatedAt ? formatDate(series.updatedAt) : '' }}</span>
          </div>
          <div class="stat-item">
            <el-icon><View /></el-icon>
            <span>已阅读 {{ readCount }}/{{ series?.articleIds?.length || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-container">
      <h2 class="section-title">
        <el-icon><List /></el-icon>
        系列文章
      </h2>

      <div class="articles-list">
        <div
          v-for="(article, index) in seriesArticles"
          :key="article.id"
          class="article-item"
          :class="{ 'is-read': isArticleRead(article.id) }"
          @click="goToArticle(article)"
        >
          <div class="article-order">
            <span class="order-number">{{ index + 1 }}</span>
            <el-icon v-if="isArticleRead(article.id)" class="read-icon">
              <CircleCheck />
            </el-icon>
          </div>

          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>

            <div class="article-meta">
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ article.views }} 次阅读
              </span>
              <span class="meta-item">
                <el-icon><ChatDotRound /></el-icon>
                {{ getCommentCount(article.id) }} 评论
              </span>
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ article.date }}
              </span>
            </div>
          </div>

          <div class="article-actions">
            <el-button type="primary" @click.stop="goToArticle(article)">
              {{ isArticleRead(article.id) ? '重读' : '开始阅读' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 阅读进度 -->
    <div class="reading-progress">
      <div class="progress-card">
        <h3>
          <el-icon><TrendCharts /></el-icon>
          阅读进度
        </h3>
        <div class="progress-content">
          <div class="progress-circle">
            <el-progress
              type="circle"
              :percentage="progress"
              :color="progressColor"
              :width="120"
            >
              <template #default="{ percentage }">
                <span class="progress-text">{{ percentage }}%</span>
              </template>
            </el-progress>
          </div>
          <div class="progress-info">
            <p>已完成 {{ readCount }} 篇文章</p>
            <p>还剩 {{ series?.articleIds?.length ? series.articleIds.length - readCount : 0 }} 篇文章</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { setPageMeta } from '@/utils/seo'
import { articles } from '@/data/articles'
import { comments } from '@/data/articles'
import { getSeriesById, getSeriesArticles } from '@/data/series'
import { useReadingHistory } from '@/composables/useReadingHistory'
import type { ArticleSeries } from '@/data/series'

const router = useRouter()
const route = useRoute()
const { getHistory } = useReadingHistory()

const seriesId = computed(() => route.params.id as string)
const series = ref<ArticleSeries | null>(null)

const readArticleIds = computed(() => {
  const history = getHistory()
  return history.map(item => item.articleId)
})

const readCount = computed(() => {
  if (!series.value) return 0
  return series.value.articleIds.filter(id => readArticleIds.value.includes(id)).length
})

const progress = computed(() => {
  if (!series.value || series.value.articleIds.length === 0) return 0
  return Math.round((readCount.value / series.value.articleIds.length) * 100)
})

const progressColor = computed(() => {
  if (progress.value < 30) return '#f56c6c'
  if (progress.value < 70) return '#e6a23c'
  return '#67c23a'
})

const seriesArticles = computed(() => {
  if (!series.value) return []
  return getSeriesArticles(series.value.id, articles)
})

const headerStyle = computed(() => {
  if (!series.value || !series.value.coverImage) {
    return {
      background: `linear-gradient(135deg, var(--primary-color-light) 0%, var(--bg-color) 100%)`
    }
  }
  return {
    backgroundImage: `url(${series.value.coverImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)'
    }
  }
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

const isArticleRead = (articleId: number) => {
  return readArticleIds.value.includes(articleId)
}

const getCommentCount = (articleId: number) => {
  return comments.filter(c => c.articleId === articleId).length
}

const goToArticle = (article: any) => {
  router.push(`/article/${article.id}`)
}

onMounted(() => {
  const seriesData = getSeriesById(seriesId.value)
  if (!seriesData) {
    router.push('/series')
    return
  }

  series.value = seriesData
  setPageMeta({
    title: `${seriesData.title} - 文章系列`,
    description: seriesData.description
  })
})
</script>

<style scoped lang="scss">
.series-detail-page {
  padding-top: 100px;
  padding-bottom: 60px;
  min-height: calc(100vh - 60px);

  .series-header {
    position: relative;
    padding: 60px 24px;
    color: white;
    border-radius: 12px;
    margin-bottom: 32px;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
      z-index: 1;
    }

    .header-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;

      .series-title {
        font-size: 36px;
        font-weight: 700;
        margin: 16px 0;
        line-height: 1.3;
      }

      .series-description {
        font-size: 18px;
        line-height: 1.6;
        opacity: 0.9;
        margin-bottom: 24px;
        max-width: 800px;
      }

      .series-stats {
        display: flex;
        gap: 24px;
        font-size: 14px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }
    }
  }

  .articles-container {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 40px;

    .section-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
    }

    .articles-list {
      .article-item {
        display: flex;
        gap: 20px;
        padding: 24px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        margin-bottom: 16px;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          border-color: var(--primary-color);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        &.is-read {
          opacity: 0.7;
          background: var(--bg-color);
        }

        .article-order {
          flex-shrink: 0;
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color);
          color: white;
          border-radius: 8px;
          font-size: 20px;
          font-weight: 700;

          .read-icon {
            position: absolute;
            bottom: -4px;
            right: -4px;
            background: rgba(255, 255, 255, 0.9);
            color: var(--success-color);
            border-radius: 50%;
            padding: 2px;
            font-size: 16px;
          }
        }

        .article-content {
          flex: 1;

          .article-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px;
            color: var(--text-primary);
          }

          .article-summary {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
            margin: 0 0 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .article-meta {
            display: flex;
            gap: 16px;
            font-size: 13px;
            color: var(--text-secondary);

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
        }

        .article-actions {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .reading-progress {
    margin-top: 48px;
    position: relative;
    z-index: 1;

    .progress-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 24px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary);
      }

      .progress-content {
        display: flex;
        align-items: center;
        gap: 32px;

        .progress-circle {
          :deep(.el-progress__text) {
            .progress-text {
              font-size: 24px;
              font-weight: 700;
            }
          }
        }

        .progress-info {
          flex: 1;
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.8;
        }
      }
    }
  }
}
</style>
