<template>
  <div class="series-manager">
    <div class="manager-header">
      <h2>
        <el-icon><List /></el-icon>
        文章系列管理
      </h2>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        创建系列
      </el-button>
    </div>

    <!-- 系列列表 -->
    <div class="series-list">
      <div
        v-for="series in series"
        :key="series.id"
        class="series-card"
      >
        <div class="series-cover">
          <el-image v-if="series.coverImage" :src="series.coverImage" fit="cover" />
          <div v-else class="default-cover">
            <el-icon><Document /></el-icon>
          </div>
        </div>

        <div class="series-info">
          <div class="series-header">
            <h3 class="series-title">{{ series.title }}</h3>
            <el-tag :type="getStatusType(series.status)" size="small">
              {{ getStatusText(series.status) }}
            </el-tag>
          </div>

          <p class="series-description">{{ series.description }}</p>

          <div class="series-stats">
            <span class="stat-item">
              <el-icon><Document /></el-icon>
              {{ series.articleIds.length }} 篇文章
            </span>
            <span class="stat-item">
              <el-icon><Clock /></el-icon>
              {{ formatDate(series.updatedAt) }}
            </span>
          </div>

          <div class="series-actions">
            <el-button type="primary" text @click="editSeries(series)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button text @click="manageArticles(series)">
              <el-icon><Sort /></el-icon>
              管理文章
            </el-button>
            <el-button type="danger" text @click="deleteSeries(series)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑系列弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingSeries ? '编辑系列' : '创建系列'"
      width="500px"
    >
      <el-form :model="seriesForm" :rules="seriesRules" ref="formRef" label-width="80px">
        <el-form-item label="系列标题" prop="title">
          <el-input v-model="seriesForm.title" placeholder="请输入系列标题" />
        </el-form-item>

        <el-form-item label="系列描述" prop="description">
          <el-input
            v-model="seriesForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入系列描述"
          />
        </el-form-item>

        <el-form-item label="封面图片">
          <el-input v-model="seriesForm.coverImage" placeholder="请输入封面图片URL" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="seriesForm.status" style="width: 100%">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSeries" :loading="saving">
          {{ editingSeries ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 文章管理弹窗 -->
    <el-dialog v-model="showArticleDialog" title="管理系列文章" width="600px">
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
          <h4>已选文章 (拖拽排序)</h4>
          <draggable
            v-model="orderedArticles"
            item-key="id"
            handle=".drag-handle"
          >
            <template #item="{ element, index }">
              <div class="article-item">
                <div class="drag-handle">
                  <el-icon><Rank /></el-icon>
                </div>
                <div class="article-order">{{ index + 1 }}</div>
                <div class="article-title">{{ element.title }}</div>
                <el-button
                  type="danger"
                  text
                  size="small"
                  @click="removeArticleFromSeries(element.id)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <template #footer>
        <el-button @click="showArticleDialog = false">取消</el-button>
        <el-button type="primary" @click="saveArticleOrder" :loading="saving">
          保存排序
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import type { FormInstance, FormRules } from 'element-plus'
import { articles } from '@/data/articles'
import {
  seriesList,
  createSeries,
  updateSeries,
  deleteSeries,
  getSeriesById,
  addArticleToSeries,
  removeArticleFromSeries as removeArticle,
  reorderSeriesArticles
} from '@/data/series'
import type { ArticleSeries } from '@/data/series'

const emit = defineEmits<{
  refresh: []
}>()

const showCreateDialog = ref(false)
const showArticleDialog = ref(false)
const saving = ref(false)
const editingSeries = ref<ArticleSeries | null>(null)
const currentSeries = ref<ArticleSeries | null>(null)
const formRef = ref<FormInstance>()

const seriesForm = ref({
  title: '',
  description: '',
  coverImage: '',
  status: 'draft' as 'draft' | 'published' | 'archived'
})

const seriesRules: FormRules = {
  title: [{ required: true, message: '请输入系列标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入系列描述', trigger: 'blur' }]
}

const series = computed(() => seriesList)

// 可用文章列表
const availableArticles = computed(() => {
  if (!currentSeries.value) return articles
  return articles.filter(a => !currentSeries.value!.articleIds.includes(a.id))
})

// 已选文章
const selectedArticles = ref<number[]>([])

// 已排序文章
const orderedArticles = ref<any[]>([])

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
    published: '已发布',
    archived: '已归档'
  }
  return texts[status] || '未知'
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN')
}

const editSeries = (seriesData: ArticleSeries) => {
  editingSeries.value = seriesData
  seriesForm.value = {
    title: seriesData.title,
    description: seriesData.description,
    coverImage: seriesData.coverImage || '',
    status: seriesData.status
  }
  showCreateDialog.value = true
}

const manageArticles = (seriesData: ArticleSeries) => {
  currentSeries.value = seriesData
  selectedArticles.value = [...seriesData.articleIds]

  // 加载已排序的文章
  orderedArticles.value = seriesData.order
    .map(orderIndex => seriesData.articleIds[orderIndex])
    .map(id => articles.find(a => a.id === id))
    .filter(Boolean)

  showArticleDialog.value = true
}

const saveSeries = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    if (editingSeries.value) {
      updateSeries(editingSeries.value.id, seriesForm.value)
      ElMessage.success('系列更新成功')
    } else {
      createSeries(seriesForm.value)
      ElMessage.success('系列创建成功')
    }

    showCreateDialog.value = false
    editingSeries.value = null
    seriesForm.value = {
      title: '',
      description: '',
      coverImage: '',
      status: 'draft'
    }

    emit('refresh')
  } catch (error) {
    ElMessage.error('请填写完整信息')
  } finally {
    saving.value = false
  }
}

const deleteSeries = async (seriesData: ArticleSeries) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除系列"${seriesData.title}"吗？此操作不可恢复。`,
      '警告',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const success = deleteSeries(seriesData.id)
    if (success) {
      ElMessage.success('系列已删除')
      emit('refresh')
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    // 用户取消
  }
}

const removeArticleFromSeries = (articleId: number) => {
  if (!currentSeries.value) return

  const success = removeArticle(currentSeries.value.id, articleId)
  if (success) {
    orderedArticles.value = orderedArticles.value.filter(a => a.id !== articleId)
    ElMessage.success('文章已移除')
  }
}

const saveArticleOrder = async () => {
  if (!currentSeries.value) return

  saving.value = true
  try {
    const newOrder = orderedArticles.value.map(article => {
      const index = currentSeries.value!.articleIds.indexOf(article.id)
      return index
    })

    reorderSeriesArticles(currentSeries.value.id, newOrder)
    ElMessage.success('排序已保存')
    showArticleDialog.value = false
    emit('refresh')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped lang="scss">
.series-manager {
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 20px;
    }
  }

  .series-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;

    .series-card {
      background: var(--card-bg);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .series-cover {
        width: 100%;
        height: 160px;
        background: var(--bg-color);
        position: relative;

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
      }

      .series-info {
        padding: 16px;

        .series-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .series-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
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

        .series-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 12px;
          color: var(--text-secondary);

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        .series-actions {
          display: flex;
          gap: 8px;
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
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
          }

          .article-meta {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 4px;
          }
        }
      }

      .article-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--bg-color);
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: move;

        .drag-handle {
          color: var(--text-muted);
          cursor: move;

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
        }

        .article-title {
          flex: 1;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
