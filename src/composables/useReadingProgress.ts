import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 阅读进度跟踪
 */
export function useReadingProgress() {
  const progress = ref(0)
  const estimatedTime = ref(0) // 分钟

  // 计算阅读时间（假设每分钟 300 字）
  const calculateReadingTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, '') // 移除 HTML 标签
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (text.match(/\b\w+\b/g) || []).length
    const totalChars = chineseChars + englishWords
    return Math.ceil(totalChars / 300)
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const calculatedProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    progress.value = Math.min(100, Math.max(0, calculatedProgress))
  }

  onMounted(() => {
    window.addEventListener('scroll', updateProgress)
    updateProgress()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress)
  })

  return {
    progress,
    estimatedTime,
    calculateReadingTime,
    updateProgress
  }
}
