<template>
  <div class="recommendation-panel">
    <div class="panel-header">
      <h3>
        <el-icon><MagicStick /></el-icon>
        为你推荐
      </h3>
      <el-tabs v-model="activeTab" size="small">
        <el-tab-pane label="个性化" name="personalized" />
        <el-tab-pane label="热门" name="popular" />
        <el-tab-pane label="最新" name="latest" />
        <el-tab-pane label="相似" name="similar" />
      </el-tabs>
    </div>

    <div class="recommendation-list">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-state">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>正在为你智能推荐...</p>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-else-if="currentArticles.length === 0"
        description="暂无推荐文章"
        :image-size="100"
      />

      <!-- 推荐列表 -->
      <div v-else class="articles">
        <div
          v-for="article in currentArticles"
          :key="article.id"
          class="article-card"
          @click="goToArticle(article)"
        >
          <div class="article-cover" v-if="article.cover">
            <el-image :src="article.cover" fit="cover" />
          </div>

          <div class="article-content">
            <h4 class="article-title">{{ article.title }}</h4>
            <p class="article-summary">{{ article.summary }}</p>

            <div class="article-meta">
              <span class="meta-tag">
                <el-icon><Folder /></el-icon>
                {{ article.category }}
              </span>

              <div class="meta-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ formatNumber(article.views) }}
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ formatNumber(article.likes) }}
                </span>
              </div>
            </div>

            <div class="article-reason">
              <el-tag size="small" type="info">
                {{ getRecommendationReasonText(activeTab) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="panel-footer">
      <el-button @click="refreshRecommendations" :loading="loading">
        <el-icon><Refresh /></el-icon>
        换一批
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecommendation } from '@/composables/useRecommendation'

const props = defineProps<{
  currentArticleId?: number
}>()

const router = useRouter()
const {
  getPersonalizedRecommendations,
  getSimilarArticles,
  getPopularArticles,
  getLatestArticles,
  getRecommendationReason
} = useRecommendation()

const getRecommendationReasonText = (type: 'personalized' | 'similar' | 'popular' | 'latest'): string => {
  return getRecommendationReason(null, type)
}

const activeTab = ref<'personalized' | 'popular' | 'latest' | 'similar'>('personalized')
const loading = ref(false)
const personalizedArticles = ref<any[]>([])
const similarArticles = ref<any[]>([])
const popularArticles = ref<any[]>([])
const latestArticles = ref<any[]>([])

const currentArticles = computed(() => {
  switch (activeTab.value) {
    case 'personalized':
      return personalizedArticles.value
    case 'similar':
      return similarArticles.value
    case 'popular':
      return popularArticles.value
    case 'latest':
      return latestArticles.value
    default:
      return personalizedArticles.value
  }
})

const formatNumber = (num: number): string => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

const goToArticle = (article: any) => {
  router.push(`/article/${article.id}`)
}

const loadRecommendations = async () => {
  loading.value = true
  try {
    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 500))

    personalizedArticles.value = getPersonalizedRecommendations(5)
    popularArticles.value = getPopularArticles(5)
    latestArticles.value = getLatestArticles(5)

    if (props.currentArticleId) {
      similarArticles.value = getSimilarArticles(props.currentArticleId, 5)
    } else {
      similarArticles.value = []
    }

    // 如果没有个性化推荐，显示热门
    if (personalizedArticles.value.length === 0) {
      activeTab.value = 'popular'
    }
  } catch (error) {
    console.error('加载推荐失败:', error)
    ElMessage.error('加载推荐失败')
  } finally {
    loading.value = false
  }
}

const refreshRecommendations = async () => {
  await loadRecommendations()
  ElMessage.success('已更新推荐')
}

watch(() => props.currentArticleId, () => {
  loadRecommendations()
})

onMounted(() => {
  loadRecommendations()
})
</script>

<style scoped lang="scss">
.recommendation-panel {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid var(--border-color);

  .panel-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
    }

    :deep(.el-tabs__nav-wrap::after) {
      background-color: var(--border-color);
    }
  }

  .recommendation-list {
    min-height: 300px;
    max-height: 600px;
    overflow-y: auto;

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: var(--text-secondary);

      :deep(.el-icon) {
        font-size: 32px;
        margin-bottom: 16px;
      }
    }

    .articles {
      padding: 16px;

      .article-card {
        display: flex;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s;
        background: var(--bg-color);

        &:hover {
          background: var(--primary-color-light);
          transform: translateX(4px);

          .article-title {
            color: var(--primary-color);
          }
        }

        &:last-child {
          margin-bottom: 0;
        }

        .article-cover {
          flex-shrink: 0;
          width: 100px;
          height: 70px;
          border-radius: 6px;
          overflow: hidden;

          :deep(.el-image) {
            width: 100%;
            height: 100%;
          }
        }

        .article-content {
          flex: 1;
          min-width: 0;

          .article-title {
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 6px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .article-summary {
            font-size: 12px;
            color: var(--text-secondary);
            line-height: 1.5;
            margin: 0 0 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .article-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .meta-tag {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: var(--text-secondary);
            }

            .meta-stats {
              display: flex;
              gap: 12px;

              .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                color: var(--text-muted);
              }
            }
          }

          .article-reason {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
  }

  .panel-footer {
    padding: 16px;
    border-top: 1px solid var(--border-color);
    text-align: center;
  }
}
</style>
