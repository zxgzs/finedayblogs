import { ref, computed } from 'vue'
import { articles } from '@/data/articles'
import { useReadingHistory } from './useReadingHistory'

export interface UserPreference {
  categories: Map<string, number>
  tags: Map<string, number>
  lastReadArticleIds: number[]
}

export function useRecommendation() {
  const { getHistory } = useReadingHistory()

  // 分析用户偏好
  const analyzeUserPreference = (): UserPreference => {
    const history = getHistory()
    const categories = new Map<string, number>()
    const tags = new Map<string, number>()

    history.forEach((item) => {
      const article = articles.find(a => a.id === item.articleId)
      if (!article) return

      // 统计分类偏好
      const categoryCount = categories.get(article.category) || 0
      categories.set(article.category, categoryCount + 1)

      // 统计标签偏好
      article.tags.forEach(tag => {
        const tagCount = tags.get(tag) || 0
        tags.set(tag, tagCount + 1)
      })
    })

    return {
      categories,
      tags,
      lastReadArticleIds: history.map(h => h.articleId)
    }
  }

  // 基于用户偏好推荐文章
  const getPersonalizedRecommendations = (limit = 5) => {
    const preference = analyzeUserPreference()
    const scores = articles.map(article => ({
      article,
      score: calculateRecommendationScore(article, preference)
    }))

    // 过滤已读文章
    const unreadRecommendations = scores
      .filter(item => !preference.lastReadArticleIds.includes(item.article.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return unreadRecommendations.map(item => item.article)
  }

  // 计算推荐得分
  const calculateRecommendationScore = (article: any, preference: UserPreference): number => {
    let score = 0

    // 分类得分 (权重 0.4)
    const categoryScore = preference.categories.get(article.category) || 0
    score += categoryScore * 0.4

    // 标签得分 (权重 0.4)
    article.tags.forEach((tag: string) => {
      const tagScore = preference.tags.get(tag) || 0
      score += tagScore * 0.4
    })

    // 热度得分 (权重 0.2)
    const popularityScore = (article.views + article.likes * 2 + article.collects * 3) / 100
    score += popularityScore * 0.2

    // 置顶文章加分
    if (article.isTop) {
      score += 10
    }

    // 近期文章加分
    const articleDate = new Date(article.date)
    const daysSincePublication = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSincePublication < 7) {
      score += 5
    }

    return score
  }

  // 获取相似文章推荐
  const getSimilarArticles = (articleId: number, limit = 3) => {
    const targetArticle = articles.find(a => a.id === articleId)
    if (!targetArticle) return []

    const scores = articles
      .filter(a => a.id !== articleId)
      .map(article => ({
        article,
        similarity: calculateSimilarity(targetArticle, article)
      }))

    return scores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.article)
  }

  // 计算文章相似度
  const calculateSimilarity = (article1: any, article2: any): number => {
    let similarity = 0

    // 分类相似度
    if (article1.category === article2.category) {
      similarity += 0.3
    }

    // 标签相似度
    const commonTags = article1.tags.filter((tag: string) =>
      article2.tags.includes(tag)
    )
    similarity += (commonTags.length / Math.max(article1.tags.length, article2.tags.length)) * 0.5

    // 发布时间相似度
    const date1 = new Date(article1.date).getTime()
    const date2 = new Date(article2.date).getTime()
    const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)
    if (daysDiff < 30) {
      similarity += 0.1
    } else if (daysDiff < 90) {
      similarity += 0.05
    }

    return similarity
  }

  // 获取热门文章推荐
  const getPopularArticles = (limit = 5) => {
    const scores = articles.map(article => ({
      article,
      score: calculatePopularityScore(article)
    }))

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article)
  }

  // 计算文章热度
  const calculatePopularityScore = (article: any): number => {
    const views = article.views || 0
    const likes = (article.likes || 0) * 2
    const collects = (article.collects || 0) * 3
    const daysSincePublication = (Date.now() - new Date(article.date).getTime()) / (1000 * 60 * 60 * 24)

    // 时间衰减因子 (最近的文章权重更高)
    const timeDecay = Math.exp(-daysSincePublication / 30)

    return (views + likes + collects) * timeDecay
  }

  // 获取最新文章推荐
  const getLatestArticles = (limit = 5) => {
    return [...articles]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  // 获取推荐理由
  const getRecommendationReason = (article: any, type: 'personalized' | 'similar' | 'popular' | 'latest'): string => {
    const reasons: Record<string, string> = {
      personalized: '根据你的阅读习惯推荐',
      similar: '与你正在阅读的文章相关',
      popular: '热门文章推荐',
      latest: '最新发布'
    }
    return reasons[type] || '为你推荐'
  }

  return {
    analyzeUserPreference,
    getPersonalizedRecommendations,
    getSimilarArticles,
    getPopularArticles,
    getLatestArticles,
    getRecommendationReason,
    calculateSimilarity,
    calculatePopularityScore
  }
}
