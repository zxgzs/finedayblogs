<template>
  <div class="enhanced-markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <el-button-group>
        <el-tooltip content="加粗 (Ctrl+B)" placement="bottom">
          <el-button @click="insertFormat('**', '**')" size="small">
            <el-icon><Edit /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="斜体 (Ctrl+I)" placement="bottom">
          <el-button @click="insertFormat('*', '*')" size="small">
            <el-icon><Timer /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="删除线" placement="bottom">
          <el-button @click="insertFormat('~~', '~~')" size="small">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <el-tooltip content="标题 H1" placement="bottom">
          <el-button @click="insertLine('# ', 'H1')" size="small">
            H1
          </el-button>
        </el-tooltip>
        <el-tooltip content="标题 H2" placement="bottom">
          <el-button @click="insertLine('## ', 'H2')" size="small">
            H2
          </el-button>
        </el-tooltip>
        <el-tooltip content="标题 H3" placement="bottom">
          <el-button @click="insertLine('### ', 'H3')" size="small">
            H3
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <el-tooltip content="无序列表" placement="bottom">
          <el-button @click="insertLine('- ')" size="small">
            <el-icon><List /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="有序列表" placement="bottom">
          <el-button @click="insertLine('1. ')" size="small">
            <el-icon><Sort /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="任务列表" placement="bottom">
          <el-button @click="insertLine('- [ ] ')" size="small">
            <el-icon><Select /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <el-tooltip content="代码块 (Ctrl+Shift+C)" placement="bottom">
          <el-button @click="insertCode()" size="small">
            <el-icon><Document /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="行内代码" placement="bottom">
          <el-button @click="insertFormat('`', '`')" size="small">
            <el-icon><Tickets /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="引用" placement="bottom">
          <el-button @click="insertQuote()" size="small">
            <el-icon><ChatLineSquare /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <el-tooltip content="插入链接" placement="bottom">
          <el-button @click="insertLink()" size="small">
            <el-icon><Link /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="插入图片" placement="bottom">
          <el-button @click="insertImage()" size="small">
            <el-icon><Picture /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="插入表格" placement="bottom">
          <el-button @click="insertTable()" size="small">
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <div class="toolbar-spacer" />

      <!-- 图片上传 -->
      <el-upload
        :show-file-list="false"
        :before-upload="handleImageUpload"
        accept="image/*"
        drag
        class="toolbar-upload"
      >
        <el-button type="primary" size="small">
          <el-icon><UploadFilled /></el-icon>
          拖拽或点击上传图片
        </el-button>
      </el-upload>

      <!-- 预览切换 -->
      <el-switch
        v-model="showPreview"
        active-text="预览"
        inactive-text="编辑"
        size="large"
      />
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container" :class="{ 'preview-mode': showPreview }">
      <!-- 编辑器 -->
      <div
        class="editor-pane"
        v-show="!showPreview"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <textarea
          ref="editorRef"
          v-model="content"
          class="editor-textarea"
          placeholder="开始编写你的文章... 支持 Markdown 语法"
          @keydown="handleKeydown"
          @scroll="handleScroll"
          @input="handleInput"
        ></textarea>
      </div>

      <!-- 预览区域 -->
      <div class="preview-pane" v-show="showPreview" v-html="renderedContent"></div>
    </div>

    <!-- 底部状态栏 -->
    <div class="editor-statusbar">
      <div class="status-left">
        <span class="status-item">
          <el-icon><Document /></el-icon>
          {{ content.split('\n').length }} 行
        </span>
        <span class="status-item">
          <el-icon><Edit /></el-icon>
          {{ content.length }} 字符
        </span>
      </div>
      <div class="status-right">
        <span v-if="autoSaving" class="auto-saving">
          <el-icon class="is-loading"><Loading /></el-icon>
          自动保存中...
        </span>
        <span v-else-if="lastSaved" class="last-saved">
          <el-icon><Clock /></el-icon>
          最后保存于 {{ formatTime(lastSaved) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'auto-save': []
}>()

const editorRef = ref<HTMLTextAreaElement>()
const content = ref(props.modelValue)
const showPreview = ref(false)
const autoSaving = ref(false)
const lastSaved = ref<Date | null>(null)

// 配置 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true
})

// 渲染 Markdown
const renderedContent = computed(() => {
  if (!content.value) {
    return '<div class="empty-preview"><p>预览区域</p></div>'
  }
  return marked(content.value)
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value) {
    content.value = newVal
  }
})

// 监听内容变化
watch(content, (newVal) => {
  emit('update:modelValue', newVal)
})

// 插入格式化文本
const insertFormat = (before: string, after: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)

  content.value = text.substring(0, start) + before + selected + after + text.substring(end)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, end + before.length)
  }, 0)
}

// 插入行
const insertLine = (prefix: string, level?: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value

  // 获取当前行
  const lineStart = text.lastIndexOf('\n', start - 1) + 1
  const lineEnd = text.indexOf('\n', end)
  const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd)

  // 替换当前行
  content.value = text.substring(0, lineStart) + prefix + currentLine + text.substring(lineEnd === -1 ? text.length : lineEnd)

  setTimeout(() => {
    textarea.focus()
    const newCursorPos = lineStart + prefix.length + (end - start)
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
}

// 插入代码块
const insertCode = () => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)

  const code = selected ? `\n\`\`\`\n${selected}\n\`\`\`\n` : '\n```\n\n```\n'
  content.value = text.substring(0, start) + code + text.substring(end)
}

// 插入链接
const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (!url) return

  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end) || '链接文字'

  content.value = text.substring(0, start) + `[${selected}](${url})` + text.substring(end)
}

// 插入图片
const insertImage = () => {
  const url = prompt('请输入图片地址:')
  if (!url) return

  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const text = textarea.value

  content.value = text.substring(0, start) + `![图片](${url})` + text.substring(start)
}

// 插入表格
const insertTable = () => {
  const table = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const text = textarea.value

  content.value = text.substring(0, start) + table + text.substring(start)
}

// 插入引用
const insertQuote = () => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end) || '引用内容'

  content.value = text.substring(0, start) + `\n> ${selected}\n` + text.substring(end)
}

// 处理快捷键
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl+B: 加粗
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault()
    insertFormat('**', '**')
  }
  // Ctrl+I: 斜体
  else if (e.ctrlKey && e.key === 'i') {
    e.preventDefault()
    insertFormat('*', '*')
  }
  // Tab: 缩进
  else if (e.key === 'Tab') {
    e.preventDefault()
    const textarea = editorRef.value
    if (textarea) {
      const start = textarea.selectionStart
      const text = textarea.value
      content.value = text.substring(0, start) + '  ' + text.substring(start)
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2)
      }, 0)
    }
  }
}

// 处理滚动同步
const handleScroll = () => {
  // 可以实现编辑器和预览的滚动同步
}

// 处理输入
const handleInput = () => {
  // 可以添加输入统计等功能
}

// 处理图片拖拽上传
const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      await uploadImage(file)
    }
  }
}

// 上传图片
const handleImageUpload = async (file: File): Promise<boolean> => {
  try {
    await uploadImage(file)
    return false // 阻止默认上传行为
  } catch (error) {
    ElMessage.error('图片上传失败')
    return false
  }
}

// 上传图片到服务器（模拟）
const uploadImage = async (file: File) => {
  try {
    // 创建 FileReader 读取图片
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string

      // 插入图片到光标位置
      const textarea = editorRef.value
      if (textarea) {
        const start = textarea.selectionStart
        const text = textarea.value
        const imageMarkdown = `
![${file.name}](${dataUrl})
`
        content.value = text.substring(0, start) + imageMarkdown + text.substring(start)

        ElMessage.success('图片上传成功')
      }
    }
    reader.readAsDataURL(file)
  } catch (error) {
    ElMessage.error('图片处理失败')
  }
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

// 自动保存
let autoSaveTimer: ReturnType<typeof setTimeout>
const startAutoSave = () => {
  clearTimeout(autoSaveTimer)
  autoSaving.value = true

  autoSaveTimer = setTimeout(() => {
    emit('auto-save')
    autoSaving.value = false
    lastSaved.value = new Date()
  }, 2000)
}

watch(content, () => {
  startAutoSave()
})
</script>

<style scoped lang="scss">
.enhanced-markdown-editor {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);

  .editor-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;

    .toolbar-spacer {
      flex: 1;
    }

    .toolbar-upload {
      :deep(.el-upload-dragger) {
        display: none;
      }
    }
  }

  .editor-container {
    display: grid;
    grid-template-columns: 1fr;
    min-height: 500px;
    background: var(--card-bg);

    &.preview-mode {
      .preview-pane {
        display: block;
      }
    }

    .editor-pane {
      display: flex;
      flex-direction: column;

      .editor-textarea {
        width: 100%;
        height: 100%;
        min-height: 500px;
        padding: 20px;
        border: none;
        resize: none;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        font-size: 14px;
        line-height: 1.8;
        background: var(--card-bg);
        color: var(--text-primary);
        outline: none;

        &::placeholder {
          color: var(--text-muted);
        }
      }
    }

    .preview-pane {
      display: none;
      padding: 20px;
      overflow-y: auto;
      background: var(--card-bg);

      :deep(.empty-preview) {
        color: var(--text-muted);
        text-align: center;
        padding: 40px;
      }

      :deep(pre) {
        background: var(--code-bg);
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 14px;
        line-height: 1.6;
      }

      :deep(code) {
        background: var(--code-bg);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
      }

      :deep(blockquote) {
        border-left: 4px solid var(--primary-color);
        padding-left: 16px;
        margin: 16px 0;
        color: var(--text-secondary);
        font-style: italic;
      }

      :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;

        th, td {
          border: 1px solid var(--border-color);
          padding: 12px;
          text-align: left;
        }

        th {
          background: var(--bg-color);
          font-weight: 600;
        }
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
      }

      :deep(h1),
      :deep(h2),
      :deep(h3),
      :deep(h4),
      :deep(h5),
      :deep(h6) {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.4;
      }

      :deep(h1) { font-size: 2em; }
      :deep(h2) { font-size: 1.75em; }
      :deep(h3) { font-size: 1.5em; }

      :deep(p) {
        margin: 12px 0;
        line-height: 1.8;
      }

      :deep(ul),
      :deep(ol) {
        margin: 12px 0;
        padding-left: 24px;
      }

      :deep(li) {
        margin: 4px 0;
      }

      :deep(a) {
        color: var(--primary-color);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .editor-statusbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: var(--bg-color);
    border-top: 1px solid var(--border-color);
    font-size: 12px;
    color: var(--text-secondary);

    .status-left,
    .status-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .auto-saving {
      color: var(--warning-color);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .last-saved {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}
</style>
