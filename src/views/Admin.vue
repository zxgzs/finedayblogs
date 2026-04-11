<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>
        <el-icon><Setting /></el-icon>
        管理后台
      </h1>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="goToEditor">
          <el-icon><Edit /></el-icon>
          写文章
        </el-button>
        <el-button size="large" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="admin-stats">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ articles.length }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalComments }}</div>
          <div class="stat-label">评论总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalViews }}</div>
          <div class="stat-label">总访问量</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
          <el-icon><Star /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalLikes }}</div>
          <div class="stat-label">总点赞数</div>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="admin-tabs" animated>
      <el-tab-pane label="文章管理" name="articles">
        <div class="data-table">
          <el-table :data="articles" stripe style="width: 100%" :header-cell-style="{ background: 'var(--bg-color)', color: 'var(--text-primary)' }">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="title" label="标题" min-width="200">
              <template #default="{ row }">
                <span class="article-title-cell">{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column prop="views" label="浏览" width="80" />
            <el-table-column prop="likes" label="点赞" width="80" />
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editArticle(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button link type="danger" @click="deleteArticle(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="评论管理" name="comments">
        <div class="data-table">
          <el-table :data="comments" stripe style="width: 100%" :header-cell-style="{ background: 'var(--bg-color)', color: 'var(--text-primary)' }">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="content" label="内容" min-width="300" />
            <el-table-column prop="date" label="日期" width="160" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button link type="danger" @click="deleteComment(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="网站统计" name="stats">
        <div class="stats-content">
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="stats-card">
                <h3>
                  <el-icon><Top /></el-icon>
                  热门文章 Top 5
                </h3>
                <div class="rank-list">
                  <div v-for="(article, index) in topArticles" :key="article.id" class="rank-item">
                    <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="rank-title">{{ article.title }}</span>
                    <span class="rank-value">{{ article.views }} 阅读</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="stats-card">
                <h3>
                  <el-icon><PieChart /></el-icon>
                  分类分布
                </h3>
                <div class="category-dist">
                  <div v-for="cat in categoryStats" :key="cat.name" class="dist-item">
                    <span class="dist-name">{{ cat.name }}</span>
                    <div class="dist-bar">
                      <div class="dist-fill" :style="{ width: cat.percent + '%', background: cat.color }"></div>
                    </div>
                    <span class="dist-count">{{ cat.count }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { articles, comments } from '@/data/articles'
import type { Article, Comment } from '@/data/articles'

const router = useRouter()
const activeTab = ref('articles')

const totalComments = computed(() => comments.length)
const totalViews = computed(() => articles.reduce((sum, a) => sum + a.views, 0))
const totalLikes = computed(() => articles.reduce((sum, a) => sum + a.likes, 0))

const topArticles = computed(() =>
  [...articles].sort((a, b) => b.views - a.views).slice(0, 5)
)

const categoryStats = computed(() => {
  const total = articles.length
  const cats = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#f5576c']
  return Object.entries(cats).map(([name, count], i) => ({
    name,
    count,
    percent: Math.round((count / total) * 100),
    color: colors[i % colors.length]
  }))
})

const goToEditor = () => {
  router.push('/editor')
}

const goHome = () => {
  router.push('/')
}

const editArticle = (article: Article) => {
  router.push(`/editor/${article.id}`)
}

const deleteArticle = async (article: Article) => {
  try {
    await ElMessageBox.confirm(`确定要删除文章《${article.title}》吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = articles.findIndex(a => a.id === article.id)
    if (index > -1) {
      articles.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 取消删除
  }
}

const deleteComment = async (comment: Comment) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = comments.findIndex(c => c.id === comment.id)
    if (index > -1) {
      comments.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 取消删除
  }
}
</script>

<style scoped lang="scss">
.admin-page {
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

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h1 {
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--info-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      svg {
        -webkit-text-fill-color: var(--primary-color);
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .admin-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-card {
      background: var(--card-bg);
      border-radius: var(--radius-xl);
      padding: 28px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: white;
        flex-shrink: 0;
      }

      .stat-info {
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 6px;
        }
      }
    }
  }

  .admin-tabs {
    :deep(.el-tabs__header) {
      background: var(--card-bg);
      padding: 16px 20px;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      border: 1px solid var(--border-color);
      border-bottom: none;
      margin: 0;
    }

    :deep(.el-tabs__content) {
      background: var(--card-bg);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      border: 1px solid var(--border-color);
      border-top: none;
      padding: 24px;
    }
  }

  .data-table {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    padding: 8px;

    :deep(.el-table) {
      --el-table-border-color: var(--border-color);
      --el-table-header-bg-color: var(--bg-color);
    }

    .article-title-cell {
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

.stats-content {
  .stats-card {
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    padding: 28px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);

    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-primary);

      svg {
        color: var(--primary-color);
      }
    }
  }

  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid var(--border-color);
      transition: all 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        padding-left: 8px;
      }

      .rank-num {
        width: 28px;
        height: 28px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
        background: var(--bg-color);
        color: var(--text-muted);

        &.rank-1 { 
          background: linear-gradient(135deg, #ffd700, #ffb800); 
          color: #000;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }
        &.rank-2 { 
          background: linear-gradient(135deg, #c0c0c0, #a8a8a8); 
          color: #000;
          box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
        }
        &.rank-3 { 
          background: linear-gradient(135deg, #cd7f32, #b87333); 
          color: #fff;
          box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
        }
      }

      .rank-title {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
        color: var(--text-primary);
      }

      .rank-value {
        font-size: 14px;
        color: var(--text-muted);
        font-weight: 500;
      }
    }
  }

  .category-dist {
    .dist-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 0;

      .dist-name {
        width: 90px;
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
      }

      .dist-bar {
        flex: 1;
        height: 10px;
        background: var(--bg-color);
        border-radius: var(--radius);
        overflow: hidden;

        .dist-fill {
          height: 100%;
          border-radius: var(--radius);
          transition: width 0.6s ease;
        }
      }

      .dist-count {
        width: 50px;
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
      }
    }
  }
}
</style>
