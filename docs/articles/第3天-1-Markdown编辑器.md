# ✍️ 开发一个增强的 Markdown 编辑器：支持拖拽上传和实时预览

> 从零开发一个功能强大的Markdown编辑器，支持工具栏、拖拽上传、实时预览等功能

## 前言

Markdown编辑器是博客系统的核心功能之一。市面上有很多优秀的编辑器，但为了更好的控制和定制，我决定自己开发一个。本文将详细介绍如何从零开发一个功能强大的Markdown编辑器。

## 功能需求

### 核心功能

1. **工具栏功能**：加粗、斜体、标题、列表、代码块等
2. **实时预览**：输入时实时预览渲染结果
3. **图片上传**：支持拖拽和点击上传
4. **快捷键支持**：常用操作的快捷键
5. **自动保存**：防止内容丢失
6. **代码高亮**：Markdown中的代码高亮显示

### UI设计

```
┌─────────────────────────────────────┐
│  [工具栏] B I H1 H2 ... 📷 📤     │
├─────────────────┬───────────────────┤
│  编辑区         │    预览区         │
│                 │                   │
│  # 标题         │    标题           │
│                 │    样式           │
│  **加粗**       │    加粗           │
│                 │                   │
│  [代码]         │    高亮代码       │
└─────────────────┴───────────────────┘
```

## 技术选型

### Markdown解析库

选择`marked`作为Markdown解析库：

```bash
npm install marked dompurify highlight.js
```

- **marked**：快速、轻量、可扩展的Markdown解析器
- **dompurify**：防止XSS攻击
- **highlight.js**：代码高亮

## 基础实现

### 1. 组件结构

```vue
<!-- components/editor/EnhancedMarkdownEditor.vue -->
<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <ToolbarButton @click="insertBold" title="加粗 (Ctrl+B)">
        <el-icon><Bold /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertItalic" title="斜体 (Ctrl+I)">
        <el-icon><Italic /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertHeading" title="标题">
        <el-icon><DArrowDown /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertCode" title="代码块 (Ctrl+Shift+C)">
        <el-icon><Document /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertList" title="无序列表">
        <el-icon><List /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertQuote" title="引用">
        <el-icon><ChatDotRound /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertLink" title="链接">
        <el-icon><Link /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="triggerImageUpload" title="图片">
        <el-icon><Picture /></el-icon>
      </ToolbarButton>
      <ToolbarButton @click="insertTable" title="表格">
        <el-icon><Grid /></el-icon>
      </ToolbarButton>

      <div class="toolbar-divider"></div>

      <ToolbarButton @click="togglePreview" :active="showPreview">
        <el-icon><View /></el-icon>
        {{ showPreview ? '编辑' : '预览' }}
      </ToolbarButton>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container">
      <!-- 输入区 -->
      <div
        v-show="!showPreview"
        class="editor-input"
        contenteditable="true"
        ref="editorRef"
        @input="handleInput"
        @keydown="handleKeydown"
        @drop="handleDrop"
        @dragover.prevent
      ></div>

      <!-- 预览区 -->
      <div
        v-show="showPreview"
        class="editor-preview"
        v-html="renderedHtml"
      ></div>
    </div>

    <!-- 状态栏 -->
    <div class="editor-statusbar">
      <span>{{ statistics.chars }} 字符</span>
      <span>{{ statistics.words }} 词</span>
      <span>{{ statistics.lines }} 行</span>
      <span v-if="autoSaving">自动保存中...</span>
      <span v-else-if="lastSaved">已保存 {{ formatTime(lastSaved) }}</span>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      @change="handleFileSelect"
      style="display: none"
    />
  </div>
</template>
```

### 2. 状态管理

```typescript
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

interface Props {
  modelValue: string
  autoSave?: boolean
  autoSaveDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoSave: true,
  autoSaveDelay: 2000
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'save', value: string): void
}>()

const editorRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()
const showPreview = ref(false)
const lastSaved = ref<number | null>(null)
const autoSaving = ref(false)

const statistics = computed(() => {
  const text = props.modelValue
  return {
    chars: text.length,
    words: text.trim().split(/\s+/).filter(w => w).length,
    lines: text.split('\n').length
  }
})

// 初始化marked
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {
        console.error('Highlight error:', e)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

const renderedHtml = computed(() => {
  if (!props.modelValue) return ''

  try {
    const html = marked.parse(props.modelValue)
    return DOMPurify.sanitize(html)
  } catch (e) {
    console.error('Markdown parse error:', e)
    return '<p>Markdown解析错误</p>'
  }
})
</script>
```

## 工具栏功能

### 1. 文本格式化

```typescript
const insertBold = () => {
  insertText('**', '**')
}

const insertItalic = () => {
  insertText('*', '*')
}

const insertHeading = () => {
  insertText('## ', '')
}

const insertCode = () => {
  insertText('```\n', '\n```')
}

const insertList = () => {
  insertText('- ', '')
}

const insertQuote = () => {
  insertText('> ', '')
}

const insertLink = () => {
  const text = window.getSelection()?.toString() || '链接文本'
  insertText('[', `](url)`)
}

const insertTable = () => {
  const table = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
|     |     |     |
`
  insertText(table, '')
}

const insertText = (prefix: string, suffix: string) => {
  if (!editorRef.value) return

  const selection = window.getSelection()
  if (!selection) return

  const range = selection.getRangeAt(0)
  const selectedText = range.toString()

  const newText = prefix + selectedText + suffix

  document.execCommand('insertText', false, newText)
  handleInput()
}
```

### 2. 快捷键支持

```typescript
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl+B: 加粗
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault()
    insertBold()
  }

  // Ctrl+I: 斜体
  if (e.ctrlKey && e.key === 'i') {
    e.preventDefault()
    insertItalic()
  }

  // Ctrl+K: 链接
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    insertLink()
  }

  // Tab: 缩进
  if (e.key === 'Tab') {
    e.preventDefault()
    insertText('  ', '')
  }

  // Shift+Tab: 取消缩进
  if (e.key === 'Tab' && e.shiftKey) {
    e.preventDefault()
    // 实现取消缩进逻辑
  }
}
```

## 图片上传

### 1. 拖拽上传

```typescript
const handleDrop = async (e: DragEvent) => {
  e.preventDefault()

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.type.startsWith('image/')) {
      await handleImageUpload(file)
    }
  }
}

const handleImageUpload = async (file: File) => {
  try {
    // 读取图片为Base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      insertImage(dataUrl)
    }
    reader.readAsDataURL(file)
  } catch (e) {
    console.error('Image upload error:', e)
    ElMessage.error('图片上传失败')
  }
}

const insertImage = (src: string) => {
  const imageMarkdown = `

![图片](${src})

`
  insertText(imageMarkdown, '')
}
```

### 2. 点击上传

```typescript
const triggerImageUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.type.startsWith('image/')) {
      await handleImageUpload(file)
    }
  }

  // 清空input，允许重复选择同一文件
  target.value = ''
}
```

### 3. 上传到服务器（可选）

```typescript
const uploadToServer = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (data.code === 200) {
      return data.url
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    console.error('Upload error:', e)
    throw e
  }
}
```

## 自动保存

```typescript
let saveTimer: any = null

const handleInput = () => {
  if (!editorRef.value) return

  const content = editorRef.value.innerText
  emit('update:modelValue', content)

  if (props.autoSave) {
    // 清除之前的定时器
    clearTimeout(saveTimer)

    autoSaving.value = true

    // 设置新的定时器
    saveTimer = setTimeout(() => {
      emit('save', content)
      lastSaved.value = Date.now()
      autoSaving.value = false
    }, props.autoSaveDelay)
  }
}
```

## 样式设计

```scss
<style scoped lang="scss">
.markdown-editor {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  .editor-toolbar {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color);
    gap: 8px;

    .toolbar-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: var(--el-fill-color);
      }

      &.active {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }

    .toolbar-divider {
      width: 1px;
      height: 20px;
      background: var(--el-border-color);
      margin: 0 8px;
    }
  }

  .editor-container {
    display: flex;
    min-height: 400px;

    .editor-input {
      flex: 1;
      padding: 16px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      line-height: 1.6;
      outline: none;
      overflow-y: auto;

      &:empty:before {
        content: attr(placeholder);
        color: var(--el-text-color-placeholder);
      }
    }

    .editor-preview {
      flex: 1;
      padding: 16px;
      overflow-y: auto;

      // Markdown样式
      h1, h2, h3, h4, h5, h6 {
        margin: 16px 0 8px;
        font-weight: 600;
        line-height: 1.25;
      }

      h1 { font-size: 2em }
      h2 { font-size: 1.5em }
      h3 { font-size: 1.25em }

      p {
        margin: 8px 0;
        line-height: 1.6;
      }

      code {
        padding: 2px 6px;
        background: var(--el-fill-color);
        border-radius: 3px;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.9em;
      }

      pre {
        padding: 16px;
        background: #282c34;
        border-radius: 4px;
        overflow-x: auto;

        code {
          padding: 0;
          background: transparent;
          color: #abb2bf;
        }
      }

      blockquote {
        padding: 0 16px;
        margin: 8px 0;
        border-left: 4px solid var(--el-color-primary);
        color: var(--el-text-color-secondary);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;

        th, td {
          padding: 8px 12px;
          border: 1px solid var(--el-border-color);
          text-align: left;
        }

        th {
          background: var(--el-fill-color-light);
          font-weight: 600;
        }

        tr:hover {
          background: var(--el-fill-color);
        }
      }

      img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }

      a {
        color: var(--el-color-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .editor-statusbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    background: var(--el-fill-color-light);
    border-top: 1px solid var(--el-border-color);
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
```

## 使用示例

```vue
<template>
  <EnhancedMarkdownEditor
    v-model="article.content"
    :auto-save="true"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import EnhancedMarkdownEditor from '@/components/editor/EnhancedMarkdownEditor.vue'

const article = reactive({
  title: '',
  content: ''
})

const handleSave = (content: string) => {
  console.log('自动保存:', content)
  // 保存到服务器或localStorage
}
</script>
```

## 功能扩展

### 1. 表情支持

```bash
npm install @emoji-mart/vue @emoji-mart/data
```

```vue
<template>
  <EmojiPicker
    @select="insertEmoji"
  />
</template>
```

### 2. 代码块语言选择

```typescript
const insertCodeWithLanguage = () => {
  const languages = ['javascript', 'typescript', 'python', 'java', 'css']
  const lang = prompt('选择代码语言:', 'javascript')

  if (lang) {
    insertText(`\`\`\`${lang}\n`, '\n\`\`\`')
  }
}
```

### 3. 导出功能

```typescript
const exportMarkdown = () => {
  const blob = new Blob([props.modelValue], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'article.md'
  link.click()
  URL.revokeObjectURL(url)
}

const exportHTML = () => {
  const html = renderedHtml.value
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'article.html'
  link.click()
  URL.revokeObjectURL(url)
}
```

## 总结

通过以上实现，我们开发了一个功能强大的Markdown编辑器，具备：

1. **丰富的工具栏** - 支持常用Markdown语法
2. **实时预览** - 输入时即时查看效果
3. **图片上传** - 支持拖拽和点击上传
4. **快捷键支持** - 提高编辑效率
5. **自动保存** - 防止内容丢失
6. **代码高亮** - 优美的代码显示

这个编辑器可以作为博客系统的核心编辑器，也可以独立使用在其他项目中。

---

**标签**：#Markdown #编辑器 #Vue3 #前端 #组件开发

**点赞❤️ + 收藏⭐️ + 评论💬，你的支持是我创作的动力！**
