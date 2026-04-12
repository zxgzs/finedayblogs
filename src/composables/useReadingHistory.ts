import { useLocalStorage } from './useLocalStorage'

export interface ReadingHistoryItem {
  articleId: number
  title: string
  lastReadAt: number
  progress: number
}

/**
 * 阅读历史记录
 */
export function useReadingHistory() {
  const history = useLocalStorage<ReadingHistoryItem[]>('blog_reading_history', [])
  const maxHistory = 50 // 最多保存 50 条记录

  const addHistory = (article: { id: number; title: string }, progress: number = 0) => {
    const existingIndex = history.value.value.findIndex(h => h.articleId === article.id)
    
    if (existingIndex !== -1) {
      // 更新已有记录
      history.value.value[existingIndex].lastReadAt = Date.now()
      history.value.value[existingIndex].progress = progress
      // 移到最前面
      const [item] = history.value.value.splice(existingIndex, 1)
      history.value.value.unshift(item)
    } else {
      // 添加新记录
      history.value.value.unshift({
        articleId: article.id,
        title: article.title,
        lastReadAt: Date.now(),
        progress
      })
      
      // 超出限制时删除最旧的
      if (history.value.value.length > maxHistory) {
        history.value.value.pop()
      }
    }
  }

  const removeHistory = (articleId: number) => {
    const index = history.value.value.findIndex(h => h.articleId === articleId)
    if (index !== -1) {
      history.value.value.splice(index, 1)
    }
  }

  const clearHistory = () => {
    history.value.value = []
  }

  const getHistory = () => {
    return history.value.value
  }

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory,
    getHistory
  }
}
