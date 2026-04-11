<template>
  <div class="editor-page">
    <div class="editor-header">
      <h1>
        <el-icon><Edit /></el-icon>
        {{ isEdit ? '编辑文章' : '写文章' }}
      </h1>
      <div class="header-actions">
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
            <el-input
              v-model="formData.summary"
              type="textarea"
              :rows="2"
              placeholder="请输入文章摘要（可选）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="正文" prop="content">
            <div class="editor-toolbar">
              <button type="button" class="tool-btn" @click="insertFormat('**', '**')" title="加粗">
                <el-icon><Edit /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertFormat('*', '*')" title="斜体">
                <el-icon><Timer /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertLine('# ')" title="标题">
                <el-icon><Tickets /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertLine('- ')" title="列表">
                <el-icon><List /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertCode()" title="代码">
                <el-icon><Document /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertLink()" title="链接">
                <el-icon><Link /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertImage()" title="图片">
                <el-icon><Picture /></el-icon>
              </button>
              <button type="button" class="tool-btn" @click="insertQuote()" title="引用">
                <el-icon><ChatLineSquare /></el-icon>
              </button>
            </div>
            <textarea
              ref="editorRef"
              v-model="formData.content"
              class="editor-content"
              placeholder="使用 Markdown 编写文章..."
              @keydown.tab.prevent="handleTab"
            ></textarea>
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="预览">
            <div class="content-preview" v-html="renderedPreview"></div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { articles } from '@/data/articles'
import { marked } from 'marked'

const router = useRouter()
const route = useRoute()

const editorRef = ref<HTMLTextAreaElement>()
const formRef = ref()
const saving = ref(false)
const publishing = ref(false)

const articleId = computed(() => Number(route.params.id))
const isEdit = computed(() => !!articleId.value)

const formData = reactive({
  title: '',
  category: '',
  tags: [] as string[],
  summary: '',
  content: '',
  isTop: false
})

const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

const renderedPreview = computed(() => {
  if (!formData.content) return '<p style="color: var(--text-muted);">预览区域</p>'
  return marked(formData.content)
})

const insertFormat = (before: string, after: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)

  formData.content = text.substring(0, start) + before + selected + after + text.substring(end)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, end + before.length)
  }, 0)
}

const insertLine = (prefix: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const text = textarea.value

  formData.content = text.substring(0, start) + '\n' + prefix + text.substring(start)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length + 1, start + prefix.length + 1)
  }, 0)
}

const insertCode = () => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)

  const code = selected ? `\n\`\`\`\n${selected}\n\`\`\`\n` : '\n```\n\n```\n'
  formData.content = text.substring(0, start) + code + text.substring(end)
}

const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (!url) return

  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end) || '链接文字'

  formData.content = text.substring(0, start) + `[${selected}](${url})` + text.substring(end)
}

const insertImage = () => {
  const url = prompt('请输入图片地址:')
  if (!url) return

  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const text = textarea.value

  formData.content = text.substring(0, start) + `![图片](${url})` + text.substring(start)
}

const insertQuote = () => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end) || '引用内容'

  formData.content = text.substring(0, start) + `\n> ${selected}\n` + text.substring(end)
}

const handleTab = (_e: KeyboardEvent) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const text = textarea.value

  formData.content = text.substring(0, start) + '  ' + text.substring(start)

  setTimeout(() => {
    textarea.setSelectionRange(start + 2, start + 2)
  }, 0)
}

const goBack = () => {
  router.push('/admin')
}

const saveDraft = async () => {
  try {
    await formRef.value?.validateField('title')
    saving.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('article_draft', JSON.stringify(formData))
    ElMessage.success('草稿保存成功')
  } catch {
    ElMessage.warning('请填写标题')
  } finally {
    saving.value = false
  }
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

    localStorage.removeItem('article_draft')
    router.push('/admin')
  } catch {
    ElMessage.warning('请完善文章信息')
  } finally {
    publishing.value = false
  }
}

onMounted(() => {
  const draft = localStorage.getItem('article_draft')
  if (draft && !isEdit.value) {
    Object.assign(formData, JSON.parse(draft))
  }

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
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);

    h1 {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
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

      .editor-toolbar {
        display: flex;
        gap: 8px;
        padding: 12px;
        background: var(--bg-color);
        border-radius: 8px 8px 0 0;
        flex-wrap: wrap;

        .tool-btn {
          padding: 8px 12px;
          border: none;
          background: var(--card-bg);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 4px;

          &:hover {
            background: var(--primary-color);
            color: white;
          }
        }
      }

      .editor-content {
        width: 100%;
        min-height: 400px;
        padding: 16px;
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 8px 8px;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        line-height: 1.6;
        resize: vertical;
        background: var(--card-bg);
        color: var(--text-primary);

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      .content-preview {
        min-height: 200px;
        padding: 16px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-color);
        font-size: 15px;
        line-height: 1.8;
      }
    }
  }
}
</style>
