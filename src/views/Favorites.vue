<template>
  <div class="favorites-page">
    <div class="favorites-header">
      <h1>
        <el-icon><Star /></el-icon>
        我的收藏
      </h1>
      <p class="subtitle">收藏的文章将在这里展示，方便你随时回顾</p>
    </div>

    <!-- 统计 -->
    <div class="favorites-stats" v-if="favoritesList.length > 0">
      <div class="stat-badge">
        <el-icon><Collection /></el-icon>
        共 {{ favoritesList.length }} 篇文章
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="favorites-grid" v-if="favoritesList.length > 0">
      <div
        v-for="article in favoritesList"
        :key="article.id"
        class="favorite-card hover-glow hover-scale"
        @click="goToArticle(article.id)"
      >
        <div class="card-badge">
          <el-icon><Star /></el-icon>
          已收藏
        </div>
        <h2 class="card-title">{{ article.title }}</h2>
        <p class="card-summary">{{ article.summary }}</p>
        <div class="card-meta">
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            {{ article.date }}
          </span>
          <span class="meta-item">
            <el-icon><Folder /></el-icon>
            {{ article.category }}
          </span>
        </div>
        <div class="card-tags">
          <el-tag
            v-for="tag in article.tags.slice(0, 3)"
            :key="tag"
            size="small"
            effect="plain"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="card-footer">
          <div class="card-stats">
            <span class="stat">
              <el-icon><View /></el-icon>
              {{ article.views }}
            </span>
            <span class="stat">
              <el-icon><Star /></el-icon>
              {{ article.likes }}
            </span>
          </div>
          <el-button
            type="danger"
            size="small"
            @click.stop="removeFavorite(article.id)"
          >
            <el-icon><Delete /></el-icon>
            取消收藏
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <el-icon><Star /></el-icon>
      </div>
      <h3>还没有收藏文章</h3>
      <p>在文章详情页点击收藏按钮，将喜欢的文章加入收藏夹</p>
      <el-button type="primary" @click="goHome">
        <el-icon><HomeFilled /></el-icon>
        去首页逛逛
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { articles } from '@/data/articles'
import type { Article } from '@/data/articles'

const router = useRouter()
const collectedIds = ref<number[]>([])

const favoritesList = computed(() => {
  return articles.filter(a => collectedIds.value.includes(a.id))
})

const loadFavorites = () => {
  const stored = localStorage.getItem('collected_articles')
  if (stored) {
    collectedIds.value = JSON.parse(stored)
  }
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const goHome = () => {
  router.push('/')
}

const removeFavorite = (id: number) => {
  collectedIds.value = collectedIds.value.filter(i => i !== id)
  localStorage.setItem('collected_articles', JSON.stringify(collectedIds.value))
  ElMessage.success('已取消收藏')
}

onMounted(() => {
  loadFavorites()
  window.addEventListener('storage', loadFavorites)
})
</script>

<style scoped lang="scss">
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .favorites-header {
    margin-bottom: 32px;

    h1 {
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, var(--warning-color), #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;

      svg {
        -webkit-text-fill-color: var(--warning-color);
      }
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 15px;
    }
  }

  .favorites-stats {
    margin-bottom: 24px;

    .stat-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1));
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: var(--radius-full);
      color: var(--warning-color);
      font-size: 14px;
      font-weight: 500;
    }
  }

  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .favorite-card {
      background: var(--card-bg);
      border-radius: var(--radius-xl);
      padding: 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        border-color: var(--warning-color);
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      .card-badge {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: linear-gradient(135deg, var(--warning-color), #f97316);
        border-radius: var(--radius-full);
        color: white;
        font-size: 12px;
        font-weight: 600;
      }

      .card-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 12px;
        padding-right: 60px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-summary {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-meta {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--text-muted);

          svg {
            font-size: 14px;
          }
        }
      }

      .card-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);

        .card-stats {
          display: flex;
          gap: 16px;

          .stat {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            color: var(--text-muted);

            svg {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-color);

    .empty-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 40px;
        color: var(--warning-color);
      }
    }

    h3 {
      font-size: 20px;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    p {
      color: var(--text-muted);
      margin-bottom: 24px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
