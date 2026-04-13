<template>
  <div class="article-page" v-if="article">
    <div class="article-container">
      <div class="article-detail">
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              {{ article.date }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ article.author }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ article.views }} 次阅读
            </span>
            <span class="meta-item">
              <el-icon><Timer /></el-icon>
              {{ readingTime }} 分钟阅读
            </span>
            <span class="meta-item">
              <el-icon><Document /></el-icon>
              {{ wordCount }} 字
            </span>
            <span class="meta-item">
              <el-icon><Folder /></el-icon>
              {{ article.category }}
            </span>
          </div>
        </div>

        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>

        <div class="article-content" :style="{ fontSize: fontSize.value + 'px' }" v-html="renderedContent" ref="contentRef"></div>

        <!-- 朗读控制条 -->
        <div class="reading-controls">
          <div class="read-toolbar">
            <button class="read-btn" :class="{ active: isReading }" @click="toggleRead">
              <el-icon v-if="!isReading"><Headset /></el-icon>
              <el-icon v-else><VideoPause /></el-icon>
              {{ isReading ? '暂停朗读' : '朗读文章' }}
            </button>
            <div class="speed-control" v-if="isReading">
              <span>语速:</span>
              <el-slider v-model="readSpeed" :min="0.5" :max="2" :step="0.1" size="small" />
              <span class="speed-value">{{ readSpeed }}x</span>
            </div>
          </div>
        </div>

        <!-- 打赏区域 -->
        <div class="reward-section">
          <div class="reward-tip">觉得文章有帮助？</div>
          <el-button type="primary" size="large" class="reward-btn" @click="showReward = !showReward">
            <el-icon><Coin /></el-icon>
            赞赏支持
          </el-button>
          <div class="reward-qr" v-if="showReward">
            <div class="qr-item">
              <div class="qr-placeholder">
                <el-icon :size="40"><Picture /></el-icon>
              </div>
              <span>微信支付</span>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">
                <el-icon :size="40"><Picture /></el-icon>
              </div>
              <span>支付宝</span>
            </div>
          </div>
        </div>

        <!-- 阅读心情投票 -->
        <div class="mood-vote-section">
          <div class="mood-title">
            <el-icon><ChatLineSquare /></el-icon>
            读完这篇文章，你的心情是？
          </div>
          <div class="mood-options">
            <div
              v-for="mood in moodOptions"
              :key="mood.id"
              class="mood-item"
              :class="{ selected: selectedMood === mood.id, voted: hasVoted }"
              @click="voteMood(mood.id)"
            >
              <span class="mood-emoji">{{ mood.emoji }}</span>
              <span class="mood-label">{{ mood.label }}</span>
              <span class="mood-percent" v-if="hasVoted">{{ moodPercents[mood.id] }}%</span>
            </div>
          </div>
        </div>

        <!-- 趣味问答 -->
        <div class="quiz-section" v-if="showQuiz">
          <div class="quiz-header">
            <el-icon><QuestionFilled /></el-icon>
            <span>知识小测验</span>
            <el-tag size="small" type="success">答题得积分</el-tag>
          </div>
          <div class="quiz-content" v-if="!quizAnswered">
            <p class="quiz-question">{{ currentQuiz.question }}</p>
            <div class="quiz-options">
              <div
                v-for="(option, index) in currentQuiz.options"
                :key="index"
                class="quiz-option"
                :class="{
                  correct: quizSelected === index && index === currentQuiz.answer,
                  wrong: quizSelected === index && index !== currentQuiz.answer
                }"
                @click="selectQuizAnswer(index)"
              >
                {{ option }}
              </div>
            </div>
          </div>
          <div class="quiz-result" v-else>
            <div class="result-icon">
              <el-icon v-if="quizCorrect" color="#67c23a"><CircleCheck /></el-icon>
              <el-icon v-else color="#f56c6c"><CircleClose /></el-icon>
            </div>
            <p class="result-text">{{ quizCorrect ? '回答正确！太棒了！' : '回答错误，正确答案是：' + currentQuiz.options[currentQuiz.answer] }}</p>
            <p class="result-explain">{{ currentQuiz.explanation }}</p>
          </div>
        </div>

        <div class="article-footer">
          <el-button @click="goBack" size="large">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
          <div class="like-share">
            <span
              class="action-btn"
              :class="{ 'is-liked': isLiked }"
              @click="handleLike"
            >
              <el-icon><Star /></el-icon>
              点赞 ({{ article.likes + (isLiked ? 1 : 0) }})
            </span>
            <span
              class="action-btn"
              :class="{ 'is-collected': isCollected }"
              @click="handleCollect"
            >
              <el-icon><Collection /></el-icon>
              收藏 ({{ article.collects + (isCollected ? 1 : 0) }})
            </span>
            <el-dropdown trigger="click" @command="handleShareCommand">
              <el-button type="primary" size="large">
                <el-icon><Share /></el-icon>
                分享
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="copy">
                    <el-icon><DocumentCopy /></el-icon>
                    复制链接
                  </el-dropdown-item>
                  <el-dropdown-item command="weibo">
                    <el-icon><Share /></el-icon>
                    分享到微博
                  </el-dropdown-item>
                  <el-dropdown-item command="twitter">
                    <el-icon><Share /></el-icon>
                    分享到 Twitter
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 文章目录 -->
      <div class="article-toc" v-if="showToc.value && tocList.length > 0">
        <div class="toc-title">
          <el-icon><List /></el-icon>
          文章目录
        </div>
        <ul class="toc-list">
          <li
            v-for="(item, index) in tocList"
            :key="index"
            class="toc-item"
            :class="[item.level === 2 ? 'level-2' : '', { active: activeToc === item.id }]"
            @click="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <h3 class="comments-title">
        <el-icon><ChatDotRound /></el-icon>
        评论 ({{ comments.filter(c => c.articleId === article?.id).length }})
      </h3>

      <div class="comment-form">
        <div class="form-row">
          <el-input
            v-model="commentAuthor"
            placeholder="请输入昵称"
            class="form-input"
            style="width: 200px; margin-right: 12px;"
            size="large"
          />
        </div>
        
        <!-- 回复提示 -->
        <div v-if="replyingToName" class="reply-hint">
          <span>正在回复 @{{ replyingToName }}</span>
          <el-button type="danger" size="small" link @click="cancelReply">
            <el-icon><Close /></el-icon>
            取消回复
          </el-button>
        </div>
        
        <el-input
          v-model="commentContent"
          type="textarea"
          :rows="3"
          :placeholder="replyingToName ? `回复 @${replyingToName}...` : '写下你的评论...'"
          class="form-input"
        />
        <div class="form-actions">
          <el-button type="primary" size="large" @click="submitComment" :loading="commentLoading">
            {{ replyingTo ? '发表回复' : '发表评论' }}
          </el-button>
        </div>
      </div>

      <div class="comments-list" v-if="articleComments.length > 0">
        <div v-for="comment in articleComments" :key="comment.id" class="comment-item">
          <div class="comment-avatar">
            {{ comment.avatar }}
          </div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-date">{{ comment.date }}</span>
              <CommentAnalysis
                :content="comment.content"
                :author="comment.author"
                :auto-analyze="true"
              />
            </div>
            <p class="comment-content">{{ comment.content }}</p>
            <div class="comment-actions">
              <span class="action-link" @click="handleReply(comment)">
                <el-icon><ChatLineSquare /></el-icon>
                回复
              </span>
            </div>
            
            <!-- 回复列表 -->
            <div v-if="getReplies(comment.id).length > 0" class="replies-list">
              <div v-for="reply in getReplies(comment.id)" :key="reply.id" class="reply-item">
                <div class="reply-avatar">
                  {{ reply.avatar }}
                </div>
                <div class="reply-body">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.author }}</span>
                    <span class="reply-date">{{ reply.date }}</span>
                    <CommentAnalysis
                      :content="reply.content"
                      :author="reply.author"
                      :auto-analyze="true"
                    />
                  </div>
                  <p class="reply-content">{{ reply.content }}</p>
                  <div class="reply-actions">
                    <span class="action-link" @click="handleReply(reply)">
                      <el-icon><ChatLineSquare /></el-icon>
                      回复
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else description="还没有评论，快来抢沙发吧！" />
    </div>

    <!-- 相关推荐 -->
    <div class="related-articles" v-if="relatedArticles.length > 0">
      <h3 class="related-title">
        <el-icon><Connection /></el-icon>
        相关推荐
      </h3>
      <div class="related-list">
        <div
          v-for="related in relatedArticles"
          :key="related.id"
          class="related-item"
          @click="goToArticle(related.id)"
        >
          <div class="related-info">
            <span class="related-title-text">{{ related.title }}</span>
            <span class="related-meta">
              <el-icon><Calendar /></el-icon>
              {{ related.date }}
              <el-icon><View /></el-icon>
              {{ related.views }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <el-empty description="文章不存在或已被删除">
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { articles, comments, saveComments } from '@/data/articles'
import { marked } from 'marked'
import { createLikeNotification, createCommentNotification } from '@/data/notifications'
import CommentAnalysis from '@/components/CommentAnalysis.vue'

const route = useRoute()
const router = useRouter()

// 接收全局设置
const showToc = inject<{ value: boolean }>('showToc', { value: true })
const fontSize = inject<{ value: number }>('fontSize', { value: 16 })
const addReadingTime = inject<(minutes: number) => void>('addReadingTime', () => {})

// 朗读功能
const isReading = ref(false)
const readSpeed = ref(1)
let speechSynthesis: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null

const toggleRead = () => {
  if (isReading.value) {
    stopReading()
  } else {
    startReading()
  }
}

const startReading = () => {
  if (!article.value) return

  speechSynthesis = window.speechSynthesis
  const text = article.value.title + '。' + article.value.content.replace(/[#*`]/g, '')

  currentUtterance = new SpeechSynthesisUtterance(text)
  currentUtterance.rate = readSpeed.value
  currentUtterance.lang = 'zh-CN'
  currentUtterance.onend = () => {
    isReading.value = false
    ElMessage.success('朗读完成')
  }
  currentUtterance.onerror = () => {
    isReading.value = false
    ElMessage.error('朗读出错')
  }

  speechSynthesis.speak(currentUtterance)
  isReading.value = true
  ElMessage.success('开始朗读')
}

const stopReading = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel()
  }
  isReading.value = false
}

// 心情投票
const moodOptions = [
  { id: 1, emoji: '😊', label: '有收获' },
  { id: 2, emoji: '🤔', label: '意犹未尽' },
  { id: 3, emoji: '💡', label: '想尝试' },
  { id: 4, emoji: '👍', label: '写得好' }
]

const selectedMood = ref<number | null>(null)
const hasVoted = ref(false)
const moodPercents = ref<Record<number, number>>({})
const moodVotes = ref<Record<number, number>>({1: 0, 2: 0, 3: 0, 4: 0})

const loadMoodVotes = () => {
  if (!article.value) return
  const stored = localStorage.getItem(`mood_votes_${article.value.id}`)
  if (stored) {
    moodVotes.value = JSON.parse(stored)
    hasVoted.value = true
    calculateMoodPercents()
  }
}

const calculateMoodPercents = () => {
  const total = Object.values(moodVotes.value).reduce((a, b) => a + b, 0)
  if (total === 0) return
  moodOptions.forEach(mood => {
    moodPercents.value[mood.id] = Math.round((moodVotes.value[mood.id] / total) * 100)
  })
}

const voteMood = (moodId: number) => {
  if (hasVoted.value) return
  if (!article.value) return

  selectedMood.value = moodId
  moodVotes.value[moodId]++
  hasVoted.value = true

  localStorage.setItem(`mood_votes_${article.value.id}`, JSON.stringify(moodVotes.value))
  localStorage.setItem(`mood_voted_${article.value.id}`, String(moodId))
  calculateMoodPercents()
  ElMessage.success('感谢投票！')
}

// 趣味问答
const showQuiz = ref(false)
const quizAnswered = ref(false)
const quizCorrect = ref(false)
const quizSelected = ref<number | null>(null)

const quizBank = [
  {
    question: '以下哪个不是博客的优势？',
    options: ['A. 分享知识', 'B. 建立个人品牌', 'C. 即时通讯', 'D. 内容沉淀'],
    answer: 2,
    explanation: '博客主要用于内容分享和沉淀，即时通讯不是博客的核心功能。'
  },
  {
    question: '好的博客文章应该具备哪些特点？',
    options: ['A. 只追求字数多', 'B. 结构清晰、有价值', 'C. 越简短越好', 'D. 不需要排版'],
    answer: 1,
    explanation: '好的文章应该结构清晰、内容有价值，不是简单地追求字数多少。'
  },
  {
    question: '阅读技术博客的正确方式是什么？',
    options: ['A. 只看不练', 'B. 边看边实践', 'C. 只收藏不读', 'D. 快速浏览'],
    answer: 1,
    explanation: '技术博客最好的学习方式是边看边实践，将知识转化为技能。'
  }
]

const currentQuiz = computed(() => {
  if (!article.value) return quizBank[0]
  const index = article.value.id % quizBank.length
  return quizBank[index]
})

const selectQuizAnswer = (index: number) => {
  if (quizAnswered.value) return
  quizSelected.value = index
  quizAnswered.value = true
  quizCorrect.value = index === currentQuiz.value.answer

  if (quizCorrect.value) {
    ElMessage.success('回答正确！+10 积分')
  } else {
    ElMessage.info('答错了，但学到了新知识！')
  }
}

const article = computed(() => {
  const id = Number(route.params.id)
  return articles.find(a => a.id === id)
})

const renderedContent = computed(() => {
  if (!article.value) return ''
  return marked(article.value.content)
})

// 计算文章字数和阅读时间
const wordCount = computed(() => {
  if (!article.value) return 0
  return article.value.content.length
})

const readingTime = computed(() => {
  // 假设阅读速度为每分钟 300 字
  return Math.ceil(wordCount.value / 300)
})

// 相关推荐：基于相同分类或标签
const relatedArticles = computed(() => {
  if (!article.value) return []
  return articles
    .filter(a => a.id !== article.value?.id)
    .filter(a => 
      a.category === article.value?.category ||
      a.tags.some(tag => article.value?.tags.includes(tag))
    )
    .sort((a, b) => {
      // 优先同分类，然后同标签
      const aInCategory = a.category === article.value?.category ? 1 : 0
      const bInCategory = b.category === article.value?.category ? 1 : 0
      const aInTags = a.tags.filter(t => article.value?.tags.includes(t)).length
      const bInTags = b.tags.filter(t => article.value?.tags.includes(t)).length
      return (bInCategory - aInCategory) + (bInTags - aInTags)
    })
    .slice(0, 4)
})

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const tocList = ref<{ id: string; text: string; level: number }[]>([])
const activeToc = ref('')
const contentRef = ref<HTMLElement>()

const isLiked = ref(false)
const isCollected = ref(false)
const showReward = ref(false)
const commentAuthor = ref('')
const commentContent = ref('')
const commentLoading = ref(false)

const articleComments = computed(() => {
  const allComments = comments.filter(c => c.articleId === article.value?.id)
  // 只返回顶级评论（没有 parentId 的）
  return allComments.filter(c => !c.parentId)
})

// 获取评论的所有回复
const getReplies = (commentId: number) => {
  return comments.filter(c => c.parentId === commentId)
}

const generateToc = () => {
  if (!contentRef.value) return
  const headings = contentRef.value.querySelectorAll('h2, h3')
  tocList.value = Array.from(headings).map((h, i) => {
    const id = `heading-${i}`
    h.id = id
    return {
      id,
      text: h.textContent || '',
      level: h.tagName === 'H2' ? 1 : 2
    }
  })
}

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  const headings = document.querySelectorAll('.article-content h2, .article-content h3')
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    const rect = heading.getBoundingClientRect()
    if (rect.top <= 100) {
      activeToc.value = heading.id
      return
    }
  }
}

const goBack = () => {
  router.push('/')
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    ElMessage.success('点赞成功 +1')
    // 创建点赞通知
    if (article.value) {
      createLikeNotification(article.value.id, article.value.title, '当前用户')
    }
  } else {
    ElMessage.success('取消点赞')
  }
}

const handleCollect = () => {
  isCollected.value = !isCollected.value
  if (isCollected.value) {
    ElMessage.success('收藏成功')
  } else {
    ElMessage.success('取消收藏')
  }
}

const handleShare = async () => {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制到剪贴板')
  } catch {
    ElMessage.info('请手动复制链接分享')
  }
}

const handleShareCommand = (command: string) => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || '')
  
  switch (command) {
    case 'copy':
      handleShare()
      break
    case 'weibo':
      window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank')
      break
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
      break
  }
}

const submitComment = async () => {
  if (!commentAuthor.value.trim()) {
    ElMessage.warning('请输入昵称')
    return
  }
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  commentLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  const newComment = {
    id: Date.now(),
    articleId: article.value?.id || 0,
    author: commentAuthor.value,
    content: commentContent.value,
    date: new Date().toLocaleString('zh-CN'),
    avatar: commentAuthor.value.charAt(0).toUpperCase(),
    parentId: replyingTo.value || undefined
  }

  comments.push(newComment)
  saveComments()

  // 创建通知
  if (article.value) {
    if (replyingTo.value) {
      // 回复评论的通知
      const parentComment = comments.find(c => c.id === replyingTo.value)
      if (parentComment) {
        createCommentNotification(
          article.value.id,
          article.value.title,
          commentAuthor.value,
          `回复了 ${parentComment.author}: ${newComment.content}`
        )
      }
    } else {
      // 新评论的通知
      createCommentNotification(
        article.value.id,
        article.value.title,
        commentAuthor.value,
        newComment.content
      )
    }
  }

  commentContent.value = ''
  commentAuthor.value = ''
  replyingTo.value = null
  replyingToName.value = ''
  ElMessage.success(replyingTo.value ? '回复发表成功' : '评论发表成功')
  commentLoading.value = false
}

const replyingTo = ref<number | null>(null)
const replyingToName = ref('')

const handleReply = (comment: any) => {
  replyingTo.value = comment.id
  replyingToName.value = comment.author
  commentAuthor.value = ''
  ElMessage.info(`正在回复 @${comment.author}`)
  
  // 滚动到评论表单
  const formEl = document.querySelector('.comment-form')
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const cancelReply = () => {
  replyingTo.value = null
  replyingToName.value = ''
  commentContent.value = ''
}

onMounted(async () => {
  await nextTick()
  generateToc()
  window.addEventListener('scroll', handleScroll)

  const storedLikes = localStorage.getItem('liked_articles') || '[]'
  const storedCollects = localStorage.getItem('collected_articles') || '[]'
  const likes = JSON.parse(storedLikes)
  const collects = JSON.parse(storedCollects)

  if (article.value) {
    isLiked.value = likes.includes(article.value.id)
    isCollected.value = collects.includes(article.value.id)
    // 加载心情投票
    loadMoodVotes()
    // 检查是否已投票
    const votedMood = localStorage.getItem(`mood_voted_${article.value.id}`)
    if (votedMood) {
      selectedMood.value = parseInt(votedMood)
      hasVoted.value = true
    }
    // 延迟显示问答
    setTimeout(() => {
      showQuiz.value = true
    }, 3000)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 停止朗读
  if (speechSynthesis) {
    speechSynthesis.cancel()
  }
  // 添加阅读时间
  if (article.value && readingTime.value > 0) {
    addReadingTime(readingTime.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.article-page {
  max-width: 1280px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.article-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.article-detail {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);

  .article-header {
    text-align: center;
    margin-bottom: 32px;

    .article-title {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 24px;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }

    .article-meta {
      display: flex;
      justify-content: center;
      gap: 28px;
      color: var(--text-muted);
      font-size: 15px;
      flex-wrap: wrap;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;

        svg {
          color: var(--primary-color);
        }
      }
    }
  }

  .article-tags {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 40px;
    flex-wrap: wrap;

    .tag {
      padding: 8px 18px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1));
      color: var(--primary-color);
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(99, 102, 241, 0.2);
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        color: white;
        transform: translateY(-2px);
      }
    }
  }

  .article-content {
    font-size: 17px;
    line-height: 1.9;
    color: var(--text-primary);

    :deep(h2) {
      font-size: 28px;
      margin: 48px 0 20px;
      font-weight: 700;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border-color);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, var(--primary-color), var(--info-color));
      }
    }

    :deep(h3) {
      font-size: 22px;
      margin: 36px 0 16px;
      font-weight: 600;
    }

    :deep(p) {
      margin-bottom: 20px;
    }

    :deep(code) {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1));
      padding: 3px 8px;
      border-radius: 6px;
      font-family: 'Fira Code', 'JetBrains Mono', monospace;
      font-size: 0.9em;
      color: var(--primary-color);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    :deep(pre) {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      color: #e2e8f0;
      padding: 24px;
      border-radius: var(--radius-lg);
      overflow-x: auto;
      margin: 24px 0;
      box-shadow: var(--shadow-lg);

      code {
        background: transparent;
        color: inherit;
        padding: 0;
        border: none;
        font-size: 14px;
        line-height: 1.7;
      }
    }

    :deep(blockquote) {
      margin: 24px 0;
      padding: 20px 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05));
      border-left: 4px solid var(--primary-color);
      border-radius: 0 var(--radius) var(--radius) 0;
      color: var(--text-secondary);
      font-style: italic;
    }

    :deep(ul), :deep(ol) {
      margin: 16px 0;
      padding-left: 24px;

      li {
        margin-bottom: 8px;
      }
    }
  }

  .article-footer {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 2px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;

    .like-share {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: var(--radius-full);
        background: var(--bg-color);
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        font-size: 15px;
        font-weight: 500;

        svg {
          width: 20px;
          height: 20px;
        }

        &:hover {
          background: linear-gradient(135deg, var(--primary-color), var(--info-color));
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        &.is-liked {
          background: linear-gradient(135deg, var(--danger-color), #f97316);
          color: white;
        }

        &.is-collected {
          background: linear-gradient(135deg, var(--warning-color), #eab308);
          color: white;
        }
      }
    }
  }
}

// 打赏区域
.reward-section {
  margin: 48px 0;
  padding: 32px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(124, 58, 237, 0.05));
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-xl);
  text-align: center;

  .reward-tip {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }

  .reward-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border: none;
    padding: 12px 32px;
    font-size: 16px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 212, 255, 0.4);
    }
  }

  .reward-qr {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 24px;
    animation: fadeIn 0.3s ease;

    .qr-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .qr-placeholder {
        width: 140px;
        height: 140px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
      }

      span {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }
  }
}

.article-toc {
  position: sticky;
  top: 100px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  max-height: calc(100vh - 120px);
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }

  .toc-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: var(--primary-color);
    }
  }

  .toc-list {
    list-style: none;

    .toc-item {
      padding: 10px 0 10px 16px;
      border-left: 2px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      color: var(--text-secondary);

      &:hover, &.active {
        color: var(--primary-color);
        border-left-color: var(--primary-color);
        padding-left: 20px;
      }

      &.level-2 {
        padding-left: 32px;
        font-size: 13px;
      }
    }
  }
}

.comments-section {
  margin-top: 40px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);

  .comments-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      color: var(--primary-color);
    }
  }

  .comment-form {
    margin-bottom: 32px;

    .form-row {
      margin-bottom: 12px;
    }

    .reply-hint {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: var(--radius);
      margin-bottom: 12px;
      color: var(--primary-color);
      font-size: 14px;
    }

    :deep(.form-input) {
      margin-bottom: 16px;
    }

    :deep(textarea) {
      min-height: 100px;
      resize: vertical;
      border-radius: var(--radius);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
  }

  .comments-list {
    .comment-item {
      display: flex;
      gap: 16px;
      padding: 24px 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      .comment-avatar {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-full);
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 18px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .comment-body {
        flex: 1;

        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .comment-author {
            font-weight: 600;
            color: var(--text-primary);
          }

          .comment-date {
            font-size: 13px;
            color: var(--text-muted);
          }
        }

        .comment-content {
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .comment-actions {
          margin-top: 12px;

          .action-link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: var(--text-muted);
            cursor: pointer;

            &:hover {
              color: var(--primary-color);
            }
          }
        }

        .replies-list {
          margin-top: 16px;
          padding-left: 20px;
          border-left: 2px solid var(--border-color);

          .reply-item {
            display: flex;
            gap: 12px;
            padding: 16px 0;
            border-bottom: 1px dashed var(--border-color);

            &:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }

            .reply-avatar {
              width: 36px;
              height: 36px;
              border-radius: var(--radius-full);
              background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              font-size: 14px;
              flex-shrink: 0;
            }

            .reply-body {
              flex: 1;

              .reply-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;

                .reply-author {
                  font-weight: 600;
                  font-size: 14px;
                  color: var(--text-primary);
                }

                .reply-date {
                  font-size: 12px;
                  color: var(--text-muted);
                }
              }

              .reply-content {
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.6;
              }

              .reply-actions {
                margin-top: 8px;

                .action-link {
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 12px;
                  color: var(--text-muted);
                  cursor: pointer;

                  &:hover {
                    color: var(--primary-color);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// 相关推荐
.related-articles {
  margin-top: 40px;
  padding: 24px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);

  .related-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);

    svg {
      color: var(--primary-color);
    }
  }

  .related-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .related-item {
    padding: 16px;
    background: var(--card-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 212, 255, 0.2);
    }

    .related-info {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .related-title-text {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .related-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: var(--text-muted);

        svg {
          font-size: 12px;
        }
      }
    }
  }
}

.not-found {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 80px;
  text-align: center;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .article-detail {
    padding: 24px;

    .article-header .article-title {
      font-size: 26px;
    }

    .article-meta {
      flex-wrap: wrap;
      gap: 12px;
    }
  }
}

/* 朗读控制条 */
.reading-controls {
  margin: 32px 0;
  padding: 16px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);

  .read-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    .read-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
      }

      &.active {
        background: linear-gradient(135deg, #f56c6c, #e6a23c);
      }
    }

    .speed-control {
      display: flex;
      align-items: center;
      gap: 12px;

      span {
        font-size: 13px;
        color: var(--text-muted);
      }

      .speed-value {
        min-width: 40px;
        color: var(--primary-color);
        font-weight: 600;
      }
    }
  }
}

/* 心情投票 */
.mood-vote-section {
  margin: 32px 0;
  padding: 24px;
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);

  .mood-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--text-primary);

    svg {
      color: var(--primary-color);
    }
  }

  .mood-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .mood-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 16px;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 212, 255, 0.2);
    }

    &.selected {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
    }

    &.voted:not(.selected) {
      opacity: 0.7;
    }

    .mood-emoji {
      font-size: 32px;
    }

    .mood-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .mood-percent {
      font-size: 12px;
      color: var(--primary-color);
      font-weight: 700;
    }
  }
}

/* 趣味问答 */
.quiz-section {
  margin: 32px 0;
  padding: 24px;
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.1), rgba(82, 196, 26, 0.05));
  border: 1px solid rgba(103, 194, 58, 0.3);
  border-radius: var(--radius-xl);
  animation: fadeIn 0.5s ease;

  .quiz-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    svg {
      color: #67c23a;
      font-size: 20px;
    }

    span {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  .quiz-question {
    font-size: 15px;
    color: var(--text-primary);
    margin-bottom: 16px;
    font-weight: 600;
  }

  .quiz-options {
    display: grid;
    gap: 10px;
  }

  .quiz-option {
    padding: 12px 16px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    color: var(--text-secondary);

    &:hover {
      border-color: #67c23a;
      background: rgba(103, 194, 58, 0.05);
    }

    &.correct {
      border-color: #67c23a;
      background: rgba(103, 194, 58, 0.15);
      color: #67c23a;
      font-weight: 600;
    }

    &.wrong {
      border-color: #f56c6c;
      background: rgba(245, 108, 108, 0.15);
      color: #f56c6c;
    }
  }

  .quiz-result {
    text-align: center;
    padding: 16px;

    .result-icon {
      margin-bottom: 12px;

      svg {
        font-size: 48px;
      }
    }

    .result-text {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .result-explain {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }
  }
}

/* 淡入淡出阅读动画 */
:deep(.article-content) {
  .fade-section {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
