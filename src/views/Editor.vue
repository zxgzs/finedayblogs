<template>
  <div class="editor-page">
    <div class="editor-header">
      <h1>
        <el-icon><Edit /></el-icon>
        {{ isEdit ? '编辑文章' : '写文章' }}
      </h1>
      <div class="header-actions">
        <el-button @click="showDraftManager = true">
          <el-icon><Document /></el-icon>
          草稿箱
        </el-button>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="saveDraft" :loading="saving">
          <el-icon><Document /></el-icon>
          保存草稿
        </el-button>
        <el-button type="success" @click="publishArticle" :loading="publishing">
          <el-icon><Promotion /></el-icon>
          发布文章
        </el-button>
      </div>
    </div>

    <!-- 自动保存状态 -->
    <div v-if="autoSaving || lastSaved" class="save-status">
      <el-tag v-if="autoSaving" type="warning" size="small">
        <el-icon class="is-loading"><Loading /></el-icon>
        正在自动保存...
      </el-tag>
      <el-tag v-else-if="lastSaved" type="info" size="small">
        <el-icon><Clock /></el-icon>
        已于 {{ formatTime(lastSaved) }} 保存
      </el-tag>
    </div>

    <div class="editor-form">
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <div class="form-row">
          <el-input
            v-model="formData.title"
            placeholder="请输入文章标题..."
            class="title-input"
            maxlength="100"
            show-word-limit
          />
        </div>

        <div class="form-row">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="分类" prop="category">
                <el-select v-model="formData.category" placeholder="选择分类" style="width: 100%">
                  <el-option label="前端开发" value="前端开发" />
                  <el-option label="后端开发" value="后端开发" />
                  <el-option label="DevOps" value="DevOps" />
                  <el-option label="TypeScript" value="TypeScript" />
                  <el-option label="CSS" value="CSS" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签">
                <el-select v-model="formData.tags" multiple placeholder="选择标签" style="width: 100%">
                  <el-option label="Vue" value="Vue" />
                  <el-option label="React" value="React" />
                  <el-option label="TypeScript" value="TypeScript" />
                  <el-option label="Node.js" value="Node.js" />
                  <el-option label="JavaScript" value="JavaScript" />
                  <el-option label="CSS" value="CSS" />
                  <el-option label="Python" value="Python" />
                  <el-option label="Docker" value="Docker" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="置顶">
                <el-switch v-model="formData.isTop" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-row">
          <el-form-item label="摘要">
            <div class="summary-input-wrapper">
              <el-input
                v-model="formData.summary"
                type="textarea"
                :rows="2"
                placeholder="请输入文章摘要（可选）"
                maxlength="200"
                show-word-limit
              />
              <AISummaryGenerator
                :content="formData.content"
                @update:summary="handleUpdateSummary"
                @update:keywords="handleUpdateKeywords"
              />
            </div>
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="正文" prop="content">
            <EnhancedMarkdownEditor v-model="formData.content" />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 草稿管理器弹窗 -->
    <el-drawer
      v-model="showDraftManager"
      title="草稿箱"
      direction="rtl"
      size="400px"
    >
      <DraftManager @load="handleLoadDraft" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { articles } from '@/data/articles'
import { useAutoSave, type DraftData } from '@/composables/useAutoSave'
import DraftManager from '@/components/DraftManager.vue'
import EnhancedMarkdownEditor from '@/components/EnhancedMarkdownEditor.vue'
import AISummaryGenerator from '@/components/AISummaryGenerator.vue'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const saving = ref(false)
const publishing = ref(false)
const showDraftManager = ref(false)

const articleId = computed(() => Number(route.params.id))
const isEdit = computed(() => !!articleId.value)

const formData = reactive<DraftData>({
  title: '',
  category: '',
  tags: [],
  summary: '',
  content: '',
  isTop: false
})

const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 使用自动保存功能
const {
  isSaving: autoSaving,
  lastSaved,
  manualSave,
  getDrafts,
  loadDraft: loadAutoDraft,
  clearCurrentDraft
} = useAutoSave(formData, articleId)

const goBack = () => {
  if (formData.title || formData.content) {
    ElMessageBox.confirm('当前文章未保存，确定要离开吗？', '提示', {
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.push('/admin')
    }).catch(() => {
      // 用户取消
    })
  } else {
    router.push('/admin')
  }
}

const saveDraft = async () => {
  try {
    await formRef.value?.validateField('title')
    saving.value = true

    await manualSave()
  } catch {
    ElMessage.warning('请填写标题')
  } finally {
    saving.value = false
  }
}

const handleUpdateSummary = (summary: string) => {
  formData.summary = summary
}

const handleUpdateKeywords = (keywords: string[]) => {
  // 合并AI生成的关键词到现有标签
  formData.tags = [...new Set([...formData.tags, ...keywords])]
}

const publishArticle = async () => {
  try {
    await formRef.value?.validate()
    publishing.value = true

    const summary = formData.summary || formData.content.substring(0, 150).replace(/[#*`]/g, '') + '...'

    if (isEdit.value) {
      const index = articles.findIndex(a => a.id === articleId.value)
      if (index > -1) {
        articles[index] = {
          ...articles[index],
          title: formData.title,
          category: formData.category,
          tags: formData.tags,
          summary,
          content: formData.content,
          isTop: formData.isTop,
          date: new Date().toISOString().split('T')[0]
        }
      }
      ElMessage.success('文章更新成功')
    } else {
      const newArticle = {
        id: Math.max(...articles.map(a => a.id)) + 1,
        title: formData.title,
        category: formData.category,
        tags: formData.tags,
        summary,
        content: formData.content,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        collects: 0,
        author: '博主',
        isTop: formData.isTop
      }
      articles.unshift(newArticle)
      ElMessage.success('文章发布成功')
    }

    clearCurrentDraft()
    router.push('/admin')
  } catch {
    ElMessage.warning('请完善文章信息')
  } finally {
    publishing.value = false
  }
}

// 从草稿管理器加载草稿
const handleLoadDraft = (draft: DraftData) => {
  Object.assign(formData, draft)
  showDraftManager.value = false
  ElMessage.success('草稿已加载')
}

// 格式化时间
const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  // 优先加载自动保存的草稿
  const savedDrafts = getDrafts()
  const draftId = articleId.value ? String(articleId.value) : `draft_${Date.now()}`

  if (savedDrafts[draftId] && !isEdit.value) {
    Object.assign(formData, savedDrafts[draftId])
    ElMessage.info('已加载上次编辑的草稿')
  }

  // 如果是编辑模式，加载现有文章
  if (isEdit.value) {
    const article = articles.find(a => a.id === articleId.value)
    if (article) {
      formData.title = article.title
      formData.category = article.category
      formData.tags = article.tags
      formData.summary = article.summary
      formData.content = article.content
      formData.isTop = article.isTop || false
    }
  }
})
</script>

<style scoped lang="scss">
.editor-page {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);

    h1 {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .save-status {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .editor-form {
    .form-row {
      margin-bottom: 20px;

      .title-input {
        :deep(.el-input__wrapper) {
          box-shadow: none;
          padding: 12px 0;
          font-size: 24px;
          font-weight: 600;

          &:hover, &.is-focus {
            box-shadow: none !important;
          }
        }
      }

      .summary-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }
}
</style>
