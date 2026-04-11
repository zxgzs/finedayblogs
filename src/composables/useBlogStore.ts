import { ref, computed } from 'vue'
import { articles, type Article } from '@/data/articles'

/**
 * 博客全局状态管理
 * 使用 composable 模式替代 Pinia/Vuex，保持轻量
 */

export function useBlogStore() {
  // 文章列表
  const articleList = ref<Article[]>(articles)
  
  // 加载状态
  const loading = ref(false)
  
  // 错误状态
  const error = ref<string | null>(null)
  
  // 计算属性
  const categories = computed(() => {
    const cats = new Set<string>()
    articleList.value.forEach(article => cats.add(article.category))
    return ['全部', ...Array.from(cats)]
  })
  
  const allTags = computed(() => {
    const tags = new Set<string>()
    articleList.value.forEach(article => {
      article.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  })
  
  const topArticles = computed(() => {
    return articleList.value.filter(a => a.isTop).slice(0, 3)
  })
  
  // 方法
  const getArticleById = (id: number): Article | undefined => {
    return articleList.value.find(a => a.id === id)
  }
  
  const getArticlesByCategory = (category: string): Article[] => {
    if (category === '全部') return articleList.value
    return articleList.value.filter(a => a.category === category)
  }
  
  const getArticlesByTag = (tag: string): Article[] => {
    return articleList.value.filter(a => a.tags.includes(tag))
  }
  
  const searchArticles = (keyword: string): Article[] => {
    if (!keyword.trim()) return articleList.value
    const lower = keyword.toLowerCase()
    return articleList.value.filter(a => 
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.content.toLowerCase().includes(lower)
    )
  }
  
  const incrementViews = (id: number) => {
    const article = articleList.value.find(a => a.id === id)
    if (article) {
      article.views++
    }
  }
  
  // 模拟加载文章（为将来 API 调用预留）
  const loadArticles = async () => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      // 这里可以替换为实际的 API 调用
      // const response = await fetch('/api/articles')
      // articleList.value = await response.json()
    } catch (e) {
      error.value = '加载文章失败'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  
  return {
    // 状态
    articleList,
    loading,
    error,
    // 计算属性
    categories,
    allTags,
    topArticles,
    // 方法
    getArticleById,
    getArticlesByCategory,
    getArticlesByTag,
    searchArticles,
    incrementViews,
    loadArticles
  }
}
