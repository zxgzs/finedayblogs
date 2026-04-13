import { ref } from 'vue'

/**
 * AI分析结果接口
 */
export interface AISummaryResult {
  summary: string
  keywords: string[]
  confidence: number
}

export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  confidence: number
}

export interface SpamDetectionResult {
  isSpam: boolean
  reason: string
  score: number
}

/**
 * AI分析Composable
 * 提供文本摘要、情感分析、垃圾评论检测等功能
 */
export function useAIAnalysis() {
  const isAnalyzing = ref(false)
  const apiConfig = ref({
    secretId: '',
    secretKey: '',
    endpoint: 'wenzhi.api.qcloud.com',
    region: 'gz'
  })

  /**
   * 配置腾讯云NLP API
   */
  const configureAPI = (config: { secretId: string; secretKey: string; region?: string }) => {
    apiConfig.value = {
      ...apiConfig.value,
      ...config
    }
    localStorage.setItem('ai_api_config', JSON.stringify(config))
  }

  /**
   * 加载API配置
   */
  const loadAPIConfig = () => {
    const stored = localStorage.getItem('ai_api_config')
    if (stored) {
      const config = JSON.parse(stored)
      apiConfig.value = { ...apiConfig.value, ...config }
    }
  }

  /**
   * 生成本地文本摘要（基于关键词和句子提取）
   */
  const generateLocalSummary = async (content: string, maxLength = 200): Promise<AISummaryResult> => {
    isAnalyzing.value = true

    try {
      // 提取关键句子
      const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 10)
      const keywords = extractKeywords(content)
      const keywordScores = new Map(keywords.map(k => [k.word, k.score]))

      // 为每个句子打分（基于关键词出现频率和位置）
      const scoredSentences = sentences.map((sentence, index) => {
        let score = 0
        keywords.forEach(kw => {
          if (sentence.includes(kw.word)) {
            score += kw.score
          }
        })
        // 开头句子权重更高
        score *= (1 - index * 0.1)
        return { sentence, score }
      })

      // 选择得分最高的句子
      const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => s.sentence)

      // 组合成摘要
      let summary = topSentences.join('。')
      if (!summary.endsWith('。')) {
        summary += '。'
      }

      // 限制长度
      if (summary.length > maxLength) {
        summary = summary.substring(0, maxLength - 3) + '...'
      }

      return {
        summary,
        keywords: keywords.map(k => k.word).slice(0, 5),
        confidence: 0.85
      }
    } finally {
      isAnalyzing.value = false
    }
  }

  /**
   * 提取关键词（基于词频和位置）
   */
  const extractKeywords = (text: string): Array<{ word: string; score: number }> => {
    // 简单的中文分词（基于常见词库）
    const commonWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']

    // 提取2-4个字的词（简单模拟）
    const words: string[] = []
    for (let i = 0; i < text.length - 1; i++) {
      for (let len = 4; len >= 2; len--) {
        if (i + len <= text.length) {
          const word = text.substring(i, i + len)
          if (/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(word) && !commonWords.includes(word)) {
            words.push(word)
            i += len - 1
            break
          }
        }
      }
    }

    // 统计词频
    const wordCount = new Map<string, number>()
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    })

    // 计算得分（词频 + 位置权重）
    const results: Array<{ word: string; score: number }> = []
    wordCount.forEach((count, word) => {
      const firstPos = text.indexOf(word)
      const positionWeight = Math.max(0.5, 1 - firstPos / text.length * 0.3)
      const score = count * positionWeight
      results.push({ word, score })
    })

    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * 腾讯云NLP关键词提取API
   */
  const generateCloudSummary = async (content: string): Promise<AISummaryResult> => {
    // TODO: 实现腾讯云NLP API调用
    // 使用关键词提取API生成摘要
    const result = await generateLocalSummary(content)
    return result
  }

  /**
   * 生成文章摘要
   */
  const generateArticleSummary = async (content: string, useCloud = false): Promise<AISummaryResult> => {
    if (useCloud && apiConfig.value.secretId && apiConfig.value.secretKey) {
      return await generateCloudSummary(content)
    }
    return await generateLocalSummary(content)
  }

  /**
   * 本地情感分析（基于情感词典）
   */
  const analyzeLocalSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
    // 简单的情感词典
    const positiveWords = ['好', '棒', '优秀', '厉害', '喜欢', '爱', '赞', '谢谢', '不错', '支持', '有用', '学习', '收获', '期待', '完美', '精彩', '感谢']
    const negativeWords = ['差', '烂', '不好', '讨厌', '垃圾', '失望', '无语', '糟糕', '错误', '问题', 'bug', '太差', '不行', '反感', '愤怒', '不满']

    let positiveScore = 0
    let negativeScore = 0

    positiveWords.forEach(word => {
      const regex = new RegExp(word, 'g')
      const matches = text.match(regex)
      if (matches) {
        positiveScore += matches.length
      }
    })

    negativeWords.forEach(word => {
      const regex = new RegExp(word, 'g')
      const matches = text.match(regex)
      if (matches) {
        negativeScore += matches.length
      }
    })

    const totalScore = positiveScore + negativeScore
    let sentiment: 'positive' | 'negative' | 'neutral'
    let score: number

    if (totalScore === 0) {
      sentiment = 'neutral'
      score = 0
    } else if (positiveScore > negativeScore) {
      sentiment = 'positive'
      score = (positiveScore - negativeScore) / totalScore
    } else {
      sentiment = 'negative'
      score = (negativeScore - positiveScore) / totalScore
    }

    return {
      sentiment,
      score,
      confidence: Math.min(0.7, totalScore * 0.1)
    }
  }

  /**
   * 腾讯云NLP情感分析API
   */
  const analyzeCloudSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
    // TODO: 实现腾讯云NLP API调用
    return await analyzeLocalSentiment(text)
  }

  /**
   * 分析评论情感
   */
  const analyzeCommentSentiment = async (text: string, useCloud = false): Promise<SentimentAnalysisResult> => {
    if (useCloud && apiConfig.value.secretId && apiConfig.value.secretKey) {
      return await analyzeCloudSentiment(text)
    }
    return await analyzeLocalSentiment(text)
  }

  /**
   * 检测垃圾评论（本地规则）
   */
  const detectLocalSpam = async (comment: {
    content: string
    author: string
    email?: string
  }): Promise<SpamDetectionResult> => {
    let spamScore = 0
    const reasons: string[] = []

    // 检查广告词
    const spamKeywords = ['加微信', '代写', '刷单', '兼职', '日赚', '贷款', '投资', '股票', '彩票', '博彩', '买', '卖', '推广', '广告', 'QQ', '电话', '联系']
    spamKeywords.forEach(keyword => {
      if (comment.content.includes(keyword)) {
        spamScore += 30
        reasons.push(`包含敏感关键词: ${keyword}`)
      }
    })

    // 检查重复字符
    const repeatedPattern = /(.{2,})\1{2,}/
    if (repeatedPattern.test(comment.content)) {
      spamScore += 20
      reasons.push('包含重复内容')
    }

    // 检查URL过多
    const urlMatches = comment.content.match(/https?:\/\/\S+/g)
    if (urlMatches && urlMatches.length > 2) {
      spamScore += 25
      reasons.push('包含过多链接')
    }

    // 检查纯数字或纯符号
    if (/^[\d\s\W]+$/.test(comment.content)) {
      spamScore += 40
      reasons.push('内容为无意义字符')
    }

    // 检查过短
    if (comment.content.trim().length < 3) {
      spamScore += 15
      reasons.push('评论过短')
    }

    // 检查过长（可能是垃圾信息）
    if (comment.content.length > 500) {
      spamScore += 10
      reasons.push('评论过长')
    }

    // 检查敏感邮箱
    const spamEmails = ['@spam', '@test', '@temp', 'noreply@']
    if (comment.email) {
      spamEmails.forEach(pattern => {
        if (comment.email!.includes(pattern)) {
          spamScore += 25
          reasons.push('使用临时邮箱')
        }
      })
    }

    // 检查用户名是否可疑
    const suspiciousPatterns = [/^\d+$/, /^[a-zA-Z]{20,}$/]
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(comment.author)) {
        spamScore += 20
        reasons.push('用户名格式可疑')
      }
    })

    const isSpam = spamScore >= 50

    return {
      isSpam,
      reason: reasons.join('; ') || '正常评论',
      score: spamScore
    }
  }

  /**
   * 检测垃圾评论
   */
  const detectSpamComment = async (comment: {
    content: string
    author: string
    email?: string
  }): Promise<SpamDetectionResult> => {
    isAnalyzing.value = true
    try {
      return await detectLocalSpam(comment)
    } finally {
      isAnalyzing.value = false
    }
  }

  /**
   * 批量分析评论
   */
  const batchAnalyzeComments = async (comments: Array<{
    content: string
    author: string
    email?: string
  }>) => {
    const results = await Promise.all([
      ...comments.map(c => detectSpamComment(c)),
      ...comments.map(c => analyzeCommentSentiment(c.content))
    ])

    return {
      spamResults: results.slice(0, comments.length) as SpamDetectionResult[],
      sentimentResults: results.slice(comments.length) as SentimentAnalysisResult[]
    }
  }

  return {
    // 状态
    isAnalyzing,

    // API配置
    configureAPI,
    loadAPIConfig,

    // 文章摘要
    generateArticleSummary,

    // 情感分析
    analyzeCommentSentiment,

    // 垃圾评论检测
    detectSpamComment,

    // 批量分析
    batchAnalyzeComments
  }
}
