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

      <el-tab-pane label="系列管理" name="series">
        <div class="series-manager">
          <div class="manager-header">
            <el-button type="primary" @click="showSeriesDialog = true">
              <el-icon><Plus /></el-icon>
              创建系列
            </el-button>
            <div class="manager-stats">
              <span>共 {{ series.length }} 个系列</span>
            </div>
          </div>

          <div v-if="series.length === 0" class="empty-state">
            <el-empty description="暂无文章系列" :image-size="150">
              <el-button type="primary" @click="showSeriesDialog = true">
                创建第一个系列
              </el-button>
            </el-empty>
          </div>

          <div v-else class="series-grid">
            <div
              v-for="item in series"
              :key="item.id"
              class="series-item"
              @click="viewSeries(item)"
            >
              <div class="series-item-cover">
                <el-image v-if="item.coverImage" :src="item.coverImage" fit="cover" />
                <div v-else class="default-cover">
                  <el-icon><Document /></el-icon>
                </div>
                <el-tag :type="getStatusType(item.status)" size="small" class="series-status">
                  {{ getStatusText(item.status) }}
                </el-tag>
              </div>

              <div class="series-item-content">
                <h4 class="series-item-title">{{ item.title }}</h4>
                <p class="series-item-desc">{{ item.description }}</p>

                <div class="series-item-meta">
                  <span>
                    <el-icon><Document /></el-icon>
                    {{ item.articleIds?.length || 0 }} 篇文章
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ formatDate(item.updatedAt) }}
                  </span>
                </div>

                <div class="series-item-actions">
                  <el-button type="primary" text @click.stop="editSeries(item)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button text @click.stop="manageArticles(item)">
                    <el-icon><Sort /></el-icon>
                    管理文章
                  </el-button>
                  <el-button text @click.stop="goToSeries(item)">
                    <el-icon><View /></el-icon>
                    查看
                  </el-button>
                  <el-button type="danger" text @click.stop="deleteSeries(item)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
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

    <!-- 系列编辑弹窗 -->
    <el-dialog
      v-model="showSeriesDialog"
      :title="editingSeries ? '编辑系列' : '创建系列'"
      width="500px"
    >
      <el-form :model="seriesForm" label-width="80px">
        <el-form-item label="系列标题" required>
          <el-input v-model="seriesForm.title" placeholder="请输入系列标题" />
        </el-form-item>

        <el-form-item label="系列描述" required>
          <el-input
            v-model="seriesForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入系列描述"
          />
        </el-form-item>

        <el-form-item label="封面图片">
          <el-input v-model="seriesForm.coverImage" placeholder="请输入封面图片URL（可选）" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="seriesForm.status" style="width: 100%">
            <el-option label="草稿" value="draft" />
            <el-option label="连载中" value="published" />
            <el-option label="已完结" value="archived" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showSeriesDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSeries">
          {{ editingSeries ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 文章管理弹窗 -->
    <el-dialog v-model="showArticleDialog" title="管理系列文章" width="800px">
      <div v-if="currentSeries" class="article-manager">
        <div class="available-articles">
          <h4>可用文章</h4>
          <el-checkbox-group v-model="selectedArticles">
            <div
              v-for="article in availableArticles"
              :key="article.id"
              class="article-checkbox-item"
            >
              <el-checkbox :label="article.id" :value="article.id">
                <div class="article-info">
                  <div class="article-title">{{ article.title }}</div>
                  <div class="article-meta">{{ article.category }}</div>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="selected-articles">
          <h4>已选文章 ({{ orderedArticles.length }})</h4>
          <div class="articles-list">
            <draggable
              v-model="orderedArticles"
              item-key="id"
              :animation="200"
              ghost-class="ghost-item"
              drag-class="dragging-item"
            >
              <template #item="{ element: article, index }">
                <div class="article-item">
                  <div class="drag-handle">
                    <el-icon><Rank /></el-icon>
                  </div>
                  <div class="article-order">{{ index + 1 }}</div>
                  <div class="article-title">{{ article.title }}</div>
                  <el-button
                    type="danger"
                    text
                    size="small"
                    @click="removeArticle(article.id)"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showArticleDialog = false">取消</el-button>
        <el-button type="primary" @click="saveArticleOrder">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import { articles, comments } from '@/data/articles'
import { seriesList, createSeries, updateSeries, deleteSeries as deleteSeriesItem } from '@/data/series'
import type { Article, Comment } from '@/data/articles'
import type { ArticleSeries } from '@/data/series'

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

// 系列管理相关
const showSeriesDialog = ref(false)
const showArticleDialog = ref(false)
const editingSeries = ref<ArticleSeries | null>(null)
const currentSeries = ref<ArticleSeries | null>(null)
const seriesForm = ref({
  title: '',
  description: '',
  coverImage: '',
  status: 'draft' as 'draft' | 'published' | 'archived'
})

const series = computed(() => seriesList)

// 可用文章列表
const availableArticles = computed(() => {
  if (!currentSeries.value) return articles
  return articles.filter(a => !selectedArticles.value.includes(a.id))
})

// 已选文章
const selectedArticles = ref<number[]>([])

// 已排序文章
const orderedArticles = ref<any[]>([])

// 监听选中的文章变化，自动更新已排序列表
watch(selectedArticles, (newVal, oldVal) => {
  if (!currentSeries.value) return

  // 找出新选中的文章
  const addedIds = newVal.filter(id => !oldVal.includes(id))
  addedIds.forEach(id => {
    const article = articles.find(a => a.id === id)
    if (article && !orderedArticles.value.find(a => a.id === id)) {
      orderedArticles.value.push(article)
    }
  })

  // 移除取消选中的文章
  const removedIds = oldVal.filter(id => !newVal.includes(id))
  orderedArticles.value = orderedArticles.value.filter(a => !removedIds.includes(a.id))
}, { deep: true })

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
  return date.toLocaleDateString('zh-CN')
}

const editSeries = (seriesItem: ArticleSeries) => {
  editingSeries.value = seriesItem
  seriesForm.value = {
    title: seriesItem.title,
    description: seriesItem.description,
    coverImage: seriesItem.coverImage || '',
    status: seriesItem.status
  }
  showSeriesDialog.value = true
}

const saveSeries = () => {
  if (!seriesForm.value.title.trim()) {
    ElMessage.warning('请输入系列标题')
    return
  }

  if (!seriesForm.value.description.trim()) {
    ElMessage.warning('请输入系列描述')
    return
  }

  if (editingSeries.value) {
    updateSeries(editingSeries.value.id, seriesForm.value)
    ElMessage.success('系列更新成功')
  } else {
    createSeries(seriesForm.value)
    ElMessage.success('系列创建成功')
  }

  showSeriesDialog.value = false
  editingSeries.value = null
  seriesForm.value = {
    title: '',
    description: '',
    coverImage: '',
    status: 'draft'
  }
}

const deleteSeries = async (seriesItem: ArticleSeries) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除系列"${seriesItem.title}"吗？此操作不可恢复。`,
      '警告',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const success = deleteSeriesItem(seriesItem.id)
    if (success) {
      ElMessage.success('系列已删除')
    } else {
      ElMessage.error('删除失败')
    }
  } catch {
    // 用户取消
  }
}

const viewSeries = (seriesItem: ArticleSeries) => {
  router.push(`/series/${seriesItem.id}`)
}

const goToSeries = (seriesItem: ArticleSeries) => {
  router.push(`/series/${seriesItem.id}`)
}

const manageArticles = (seriesItem: ArticleSeries) => {
  currentSeries.value = seriesItem
  selectedArticles.value = [...seriesItem.articleIds]

  // 加载已排序的文章
  if (seriesItem.order && seriesItem.order.length > 0) {
    orderedArticles.value = seriesItem.order
      .map(orderIndex => seriesItem.articleIds[orderIndex])
      .map(id => articles.find(a => a.id === id))
      .filter(Boolean)
  } else {
    // 如果没有排序信息，直接使用articleIds
    orderedArticles.value = seriesItem.articleIds
      .map(id => articles.find(a => a.id === id))
      .filter(Boolean)
  }

  showArticleDialog.value = true
}

const saveArticleOrder = async () => {
  if (!currentSeries.value) return

  try {
    // 构建新的文章ID数组和排序数组
    const newArticleIds = orderedArticles.value.map(a => a.id)
    const newOrder = Array.from({ length: newArticleIds.length }, (_, i) => i)

    // 更新系列
    updateSeries(currentSeries.value.id, {
      articleIds: newArticleIds,
      order: newOrder
    })

    ElMessage.success('文章已更新')
    showArticleDialog.value = false
    currentSeries.value = null
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const removeArticle = (articleId: number) => {
  selectedArticles.value = selectedArticles.value.filter(id => id !== articleId)
  orderedArticles.value = orderedArticles.value.filter(a => a.id !== articleId)
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

.series-manager {
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .manager-stats {
      font-size: 14px;
      color: var(--text-secondary);
    }
  }

  .empty-state {
    padding: 60px 0;
  }

  .series-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;

    .series-item {
      background: var(--card-bg);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        border-color: var(--primary-color);
      }

      .series-item-cover {
        position: relative;
        width: 100%;
        height: 160px;
        background: var(--bg-color);

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
          color: var(--text-muted);

          :deep(.el-icon) {
            font-size: 48px;
          }
        }

        .series-status {
          position: absolute;
          top: 12px;
          right: 12px;
        }
      }

      .series-item-content {
        padding: 16px;

        .series-item-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .series-item-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .series-item-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 13px;
          color: var(--text-secondary);

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        .series-item-actions {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }
      }
    }
  }
}

.article-manager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-height: 500px;

  .available-articles,
  .selected-articles {
    h4 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .article-checkbox-item {
      padding: 8px;
      border-radius: 6px;
      margin-bottom: 8px;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-color);
      }

      .article-info {
        margin-left: 8px;

        .article-title {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 14px;
        }

        .article-meta {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
      }
    }

    .articles-list {
      max-height: 400px;
      overflow-y: auto;

      .article-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--bg-color);
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: move;
        transition: all 0.2s;

        &:hover {
          background: var(--border-color);
        }

        .drag-handle {
          flex-shrink: 0;
          color: var(--text-secondary);
          cursor: move;
          padding: 4px;

          &:hover {
            color: var(--primary-color);
          }
        }

        .article-order {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .article-title {
          flex: 1;
          font-size: 14px;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .ghost-item {
        opacity: 0.5;
        background: var(--primary-color-light);
      }

      .dragging-item {
        opacity: 1;
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
