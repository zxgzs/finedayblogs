import { ref, computed } from 'vue'

/**
 * 阅读统计数据
 */
export interface ReadingStats {
  totalViews: number
  totalReadTime: number
  articlesRead: number
  averageReadingTime: number
  completionRate: number
}

/**
 * 互动统计数据
 */
export interface InteractionStats {
  totalLikes: number
  totalComments: number
  totalShares: number
  averageEngagement: number
  likeRate: number
  commentRate: number
}

/**
 * 趋势数据
 */
export interface TrendData {
  date: string
  views: number
  likes: number
  comments: number
}

/**
 * 文章影响力数据
 */
export interface ArticleImpact {
  articleId: number
  title: string
  views: number
  likes: number
  comments: number
  shares: number
  impactScore: number
  reach: number
  engagementRate: number
  trend: 'rising' | 'falling' | 'stable'
}

/**
 * 用户行为数据
 */
export interface UserBehavior {
  elementId: string
  position: { x: number; y: number }
  type: 'click' | 'hover' | 'scroll'
  duration: number
  timestamp: number
}

/**
 * 区域热度数据
 */
export interface HeatmapData {
  region: string
  heat: number
  interactions: number
}

/**
 * 数据分析Composable
 * 提供阅读统计、互动分析、趋势分析等功能
 */
export function useAnalytics() {
  const isLoading = ref(false)

  /**
   * 获取阅读统计
   */
  const getReadingStats = (): ReadingStats => {
    try {
      const storedViews = localStorage.getItem('article_views') || '{}'
      const views: Record<number, number> = JSON.parse(storedViews)

      const storedReadTime = localStorage.getItem('reading_time') || '0'
      const totalReadTime = parseInt(storedReadTime)

      const storedHistory = localStorage.getItem('reading_history') || '[]'
      const history = JSON.parse(storedHistory)
      const uniqueArticles = new Set(history.map((h: any) => h.articleId))

      const totalViews = Object.values(views).reduce((sum: number, val) => sum + val, 0)
      const articlesRead = uniqueArticles.size
      const averageReadingTime = articlesRead > 0 ? totalReadTime / articlesRead : 0

      // 计算完成率（假设一篇文章平均需要10分钟完成）
      const completionRate = averageReadingTime / 10

      return {
        totalViews,
        totalReadTime,
        articlesRead,
        averageReadingTime: Math.round(averageReadingTime * 10) / 10,
        completionRate: Math.min(completionRate, 1) * 100
      }
    } catch (error) {
      console.error('Error getting reading stats:', error)
      return {
        totalViews: 0,
        totalReadTime: 0,
        articlesRead: 0,
        averageReadingTime: 0,
        completionRate: 0
      }
    }
  }

  /**
   * 获取互动统计
   */
  const getInteractionStats = (): InteractionStats => {
    try {
      const storedLikes = localStorage.getItem('article_likes') || '[]'
      const likes: Record<number, boolean> = JSON.parse(storedLikes)

      const storedComments = localStorage.getItem('blog_comments') || '[]'
      const comments = JSON.parse(storedComments)

      const storedShares = localStorage.getItem('article_shares') || '[]'
      const shares: Record<number, number> = JSON.parse(storedShares)

      // 获取总浏览量
      const storedViews = localStorage.getItem('article_views') || '{}'
      const views: Record<number, number> = JSON.parse(storedViews)
      const totalViews = Object.values(views).reduce((sum: number, val) => sum + val, 0)

      const totalLikes = Object.keys(likes).length
      const totalComments = comments.length
      const totalShares = Object.values(shares).reduce((sum: number, val) => sum + val, 0)

      const totalInteractions = totalLikes + totalComments + totalShares
      const averageEngagement = totalInteractions > 0 ? totalInteractions / 20 : 0

      const likeRate = totalViews === 0 ? 0 : (totalLikes / totalViews) * 100
      const commentRate = totalViews === 0 ? 0 : (totalComments / totalViews) * 100

      return {
        totalLikes,
        totalComments,
        totalShares,
        averageEngagement: Math.round(averageEngagement * 100) / 100,
        likeRate: Math.round(likeRate * 100) / 100,
        commentRate: Math.round(commentRate * 100) / 100
      }
    } catch (error) {
      console.error('Error getting interaction stats:', error)
      return {
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        averageEngagement: 0,
        likeRate: 0,
        commentRate: 0
      }
    }
  }

  /**
   * 获取趋势数据（最近7天）
   */
  const getTrendData = (): TrendData[] => {
    const trendData: TrendData[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // 模拟数据（实际应用中应该从后端获取）
      trendData.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        views: Math.floor(Math.random() * 500) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 20) + 5
      })
    }

    return trendData
  }

  /**
   * 计算文章影响力
   */
  const calculateArticleImpact = (article: {
    id: number
    title: string
    views: number
    likes: number
  }): ArticleImpact => {
    const storedComments = localStorage.getItem('blog_comments') || '[]'
    const comments = JSON.parse(storedComments)
    const articleComments = comments.filter((c: any) => c.articleId === article.id)

    const storedShares = localStorage.getItem('article_shares') || '{}'
    const shares: Record<number, number> = JSON.parse(storedShares)
    const shareCount = shares[article.id] || 0

    // 影响力得分计算
    const engagementScore = (article.likes * 2 + articleComments.length * 3 + shareCount * 5)
    const impactScore = engagementScore + (article.views * 0.1)

    // 传播范围（基于分享数和浏览量的估算）
    const reach = article.views + (shareCount * 100)

    // 互动率
    const engagementRate = article.views > 0
      ? ((article.likes + articleComments.length + shareCount) / article.views) * 100
      : 0

    // 趋势判断（简化版）
    const trend: 'rising' | 'falling' | 'stable' = 'stable'

    return {
      articleId: article.id,
      title: article.title,
      views: article.views,
      likes: article.likes,
      comments: articleComments.length,
      shares: shareCount,
      impactScore: Math.round(impactScore * 10) / 10,
      reach,
      engagementRate: Math.round(engagementRate * 100) / 100,
      trend
    }
  }

  /**
   * 获取所有文章的影响力排行
   */
  const getArticleImpacts = (articles: any[]): ArticleImpact[] => {
    return articles
      .map(article => calculateArticleImpact(article))
      .sort((a, b) => b.impactScore - a.impactScore)
  }

  /**
   * 记录用户行为
   */
  const trackUserBehavior = (behavior: UserBehavior) => {
    const stored = localStorage.getItem('user_behavior') || '[]'
    const behaviors: UserBehavior[] = JSON.parse(stored)

    // 只保留最近1000条记录
    if (behaviors.length >= 1000) {
      behaviors.shift()
    }

    behaviors.push(behavior)
    localStorage.setItem('user_behavior', JSON.stringify(behaviors))
  }

  /**
   * 生成热力图数据
   */
  const generateHeatmapData = (articleId: number): HeatmapData[] => {
    const stored = localStorage.getItem('user_behavior') || '[]'
    const behaviors: UserBehavior[] = JSON.parse(stored)

    // 按区域统计点击次数
    const regionMap = new Map<string, { count: number; interactions: number }>()

    behaviors.forEach(behavior => {
      // 根据位置判断区域
      const region = getRegionFromPosition(behavior.position)

      if (!regionMap.has(region)) {
        regionMap.set(region, { count: 0, interactions: 0 })
      }

      const data = regionMap.get(region)!
      data.count += 1
      data.interactions += 1
    })

    // 转换为数组并计算热度
    const heatmapData: HeatmapData[] = []
    const maxCount = Math.max(...Array.from(regionMap.values()).map(v => v.count), 1)

    regionMap.forEach((data, region) => {
      heatmapData.push({
        region,
        heat: (data.count / maxCount) * 100,
        interactions: data.interactions
      })
    })

    return heatmapData.sort((a, b) => b.heat - a.heat)
  }

  /**
   * 根据位置获取区域名称
   */
  const getRegionFromPosition = (position: { x: number; y: number }): string => {
    const { x, y } = position

    if (y < 100) return '标题区'
    if (y < 300) return '导语区'
    if (y < window.innerHeight - 200) return '正文区'
    return '底部区'
  }

  /**
   * 获取时段分布
   */
  const getTimeDistribution = () => {
    const stored = localStorage.getItem('reading_history') || '[]'
    const history = JSON.parse(stored)

    const distribution = Array(24).fill(0)

    history.forEach((item: any) => {
      const hour = new Date(item.timestamp).getHours()
      distribution[hour]++
    })

    return distribution.map((count, hour) => ({
      hour: `${hour}:00`,
      count
    }))
  }

  /**
   * 获取分类统计
   */
  const getCategoryStats = (articles: any[]) => {
    const stats = new Map<string, { count: number; views: number; likes: number }>()

    articles.forEach(article => {
      const category = article.category

      if (!stats.has(category)) {
        stats.set(category, { count: 0, views: 0, likes: 0 })
      }

      const data = stats.get(category)!
      data.count++
      data.views += article.views
      data.likes += article.likes
    })

    return Array.from(stats.entries()).map(([category, data]) => ({
      category,
      articleCount: data.count,
      totalViews: data.views,
      totalLikes: data.likes,
      avgViews: Math.round(data.views / data.count)
    }))
  }

  return {
    isLoading,
    getReadingStats,
    getInteractionStats,
    getTrendData,
    calculateArticleImpact,
    getArticleImpacts,
    trackUserBehavior,
    generateHeatmapData,
    getTimeDistribution,
    getCategoryStats
  }
}
