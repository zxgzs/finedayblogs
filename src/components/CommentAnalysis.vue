<template>
  <div class="comment-analysis">
    <!-- 情感分析标签 -->
    <el-tag
      v-if="showSentiment && sentimentResult"
      :type="getSentimentType(sentimentResult.sentiment)"
      size="small"
      class="sentiment-tag"
    >
      <el-icon class="icon">
        <component :is="getSentimentIcon(sentimentResult.sentiment)" />
      </el-icon>
      {{ getSentimentText(sentimentResult.sentiment) }}
      <span class="confidence">({{ (sentimentResult.confidence * 100).toFixed(0) }}%)</span>
    </el-tag>

    <!-- 垃圾评论标签 -->
    <el-tag
      v-if="showSpam && spamResult"
      :type="spamResult.isSpam ? 'danger' : 'success'"
      size="small"
      class="spam-tag"
    >
      <el-icon class="icon">
        <component :is="spamResult.isSpam ? 'Warning' : 'CircleCheck'" />
      </el-icon>
      {{ spamResult.isSpam ? '疑似垃圾' : '正常评论' }}
      <span class="confidence">({{ spamResult.score }}分)</span>
    </el-tag>

    <!-- 分析详情弹窗 -->
    <el-popover
      v-if="sentimentResult || spamResult"
      placement="top"
      :width="350"
      trigger="hover"
    >
      <div class="analysis-detail">
        <div v-if="sentimentResult" class="detail-section">
          <h5>情感分析</h5>
          <el-progress
            :percentage="(sentimentResult.score * 100)"
            :color="getSentimentColor(sentimentResult.sentiment)"
            :show-text="false"
          />
          <div class="detail-text">
            <span>情感倾向：{{ getSentimentText(sentimentResult.sentiment) }}</span>
            <span>强度：{{ (sentimentResult.score * 100).toFixed(1) }}%</span>
            <span>置信度：{{ (sentimentResult.confidence * 100).toFixed(0) }}%</span>
          </div>
        </div>

        <div v-if="spamResult" class="detail-section">
          <h5>垃圾评论检测</h5>
          <el-progress
            :percentage="spamResult.score"
            :color="spamResult.isSpam ? '#f56c6c' : '#67c23a'"
            :show-text="false"
          />
          <div class="detail-text">
            <span>检测结果：{{ spamResult.isSpam ? '疑似垃圾' : '正常' }}</span>
            <span>风险分数：{{ spamResult.score }}</span>
            <span v-if="spamResult.reason" class="spam-reason">原因：{{ spamResult.reason }}</span>
          </div>
        </div>
      </div>

      <template #reference>
        <el-icon class="info-icon" @click="handleShowDetail">
          <InfoFilled />
        </el-icon>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Warning,
  CircleCheck,
  InfoFilled,
  SuccessFilled,
  ChatDotRound
} from '@element-plus/icons-vue'
import { useAIAnalysis } from '@/composables/useAIAnalysis'
import type { SentimentAnalysisResult, SpamDetectionResult } from '@/composables/useAIAnalysis'

interface Props {
  content: string
  author: string
  email?: string
  autoAnalyze?: boolean
  showSentiment?: boolean
  showSpam?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoAnalyze: true,
  showSentiment: true,
  showSpam: true
})

const { analyzeCommentSentiment, detectSpamComment } = useAIAnalysis()

const sentimentResult = ref<SentimentAnalysisResult | null>(null)
const spamResult = ref<SpamDetectionResult | null>(null)

const analyzeComment = async () => {
  try {
    // 并行执行情感分析和垃圾检测
    const [sentiment, spam] = await Promise.all([
      analyzeCommentSentiment(props.content),
      detectSpamComment({
        content: props.content,
        author: props.author,
        email: props.email
      })
    ])

    sentimentResult.value = sentiment
    spamResult.value = spam
  } catch (error) {
    console.error('分析评论失败:', error)
  }
}

const getSentimentType = (sentiment: string) => {
  const types: Record<string, any> = {
    positive: 'success',
    negative: 'danger',
    neutral: 'info'
  }
  return types[sentiment] || 'info'
}

const getSentimentIcon = (sentiment: string) => {
  const icons: Record<string, any> = {
    positive: SuccessFilled,
    negative: Warning,
    neutral: ChatDotRound
  }
  return icons[sentiment] || ChatDotRound
}

const getSentimentText = (sentiment: string) => {
  const texts: Record<string, string> = {
    positive: '正面',
    negative: '负面',
    neutral: '中性'
  }
  return texts[sentiment] || '未知'
}

const getSentimentColor = (sentiment: string) => {
  const colors: Record<string, string> = {
    positive: '#67c23a',
    negative: '#f56c6c',
    neutral: '#909399'
  }
  return colors[sentiment] || '#909399'
}

const handleShowDetail = () => {
  // 可以在这里打开详细信息弹窗
}

onMounted(() => {
  if (props.autoAnalyze) {
    analyzeComment()
  }
})

// 暴露分析方法供外部调用
defineExpose({
  analyzeComment
})
</script>

<style scoped lang="scss">
.comment-analysis {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  .sentiment-tag,
  .spam-tag {
    display: flex;
    align-items: center;
    gap: 4px;

    .icon {
      font-size: 14px;
    }

    .confidence {
      opacity: 0.8;
    }
  }

  .info-icon {
    font-size: 14px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--primary-color);
    }
  }

  .analysis-detail {
    .detail-section {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      h5 {
        margin: 0 0 8px 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-primary);
      }

      .detail-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
        font-size: 12px;
        color: var(--text-secondary);

        .spam-reason {
          color: var(--warning-color);
          word-break: break-all;
        }
      }
    }
  }
}
</style>
