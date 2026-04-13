import { ref, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'

export interface DraftData {
  title: string
  category: string
  tags: string[]
  summary: string
  content: string
  isTop: boolean
  id?: number
  savedAt?: number
}

export function useAutoSave(formData: Ref<DraftData>, articleId?: Ref<number>) {
  let saveTimer: ReturnType<typeof setTimeout>
  const isSaving = ref(false)
  const lastSaved = ref<Date | null>(null)
  const autoSaveEnabled = ref(true)

  // 保存草稿到 localStorage
  const saveDraft = async () => {
    if (!autoSaveEnabled.value) return

    try {
      isSaving.value = true

      const draftId = formData.value.id || articleId?.value || `draft_${Date.now()}`

      const drafts = getDrafts()
      drafts[draftId] = {
        ...formData.value,
        id: draftId,
        savedAt: Date.now(),
        isDraft: true
      }

      localStorage.setItem('blog_drafts', JSON.stringify(drafts))
      lastSaved.value = new Date()

      console.log('草稿已自动保存:', draftId)
    } catch (error) {
      console.error('保存草稿失败:', error)
    } finally {
      isSaving.value = false
    }
  }

  // 获取所有草稿
  const getDrafts = (): Record<string, DraftData> => {
    try {
      const drafts = localStorage.getItem('blog_drafts')
      return drafts ? JSON.parse(drafts) : {}
    } catch {
      return {}
    }
  }

  // 加载指定草稿
  const loadDraft = (draftId: string): DraftData | null => {
    const drafts = getDrafts()
    return drafts[draftId] || null
  }

  // 删除草稿
  const deleteDraft = (draftId: string) => {
    const drafts = getDrafts()
    delete drafts[draftId]
    localStorage.setItem('blog_drafts', JSON.stringify(drafts))
  }

  // 清除当前草稿
  const clearCurrentDraft = () => {
    const currentId = formData.value.id || articleId?.value || `draft_${Date.now()}`
    deleteDraft(currentId)
    lastSaved.value = null
  }

  // 启动自动保存
  const startAutoSave = () => {
    clearTimeout(saveTimer)
    // 5秒无操作后自动保存
    saveTimer = setTimeout(() => {
      saveDraft()
    }, 5000)
  }

  // 手动保存草稿
  const manualSave = async () => {
    await saveDraft()
    ElMessage.success(`草稿已保存于 ${formatTime(lastSaved.value!)}`)
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

  // 监听表单变化，触发自动保存
  watch(
    formData,
    () => {
      startAutoSave()
    },
    { deep: true }
  )

  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearTimeout(saveTimer)
  })

  return {
    isSaving,
    lastSaved,
    autoSaveEnabled,
    saveDraft,
    manualSave,
    getDrafts,
    loadDraft,
    deleteDraft,
    clearCurrentDraft
  }
}
