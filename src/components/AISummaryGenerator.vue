<template>
  <div class="ai-summary-generator">
    <el-button
      :loading="isAnalyzing"
      :icon="MagicStick"
      type="primary"
      plain
      @click="generateSummary"
    >
      {{ isAnalyzing ? '生成中...' : 'AI生成摘要' }}
    </el-button>

    <!-- 摘要结果 -->
    <el-dialog
      v-model="showResult"
      title="AI摘要生成结果"
      width="600px"
      @close="handleClose"
    >
      <div v-if="result" class="summary-result">
        <el-alert
          :title="`置信度: ${(result.confidence * 100).toFixed(1)}%`"
          type="success"
          :closable="false"
          style="margin-bottom: 16px"
        />

        <div class="summary-section">
          <h4>摘要内容</h4>
          <el-input
            v-model="result.summary"
            type="textarea"
            :rows="4"
            placeholder="摘要内容"
          />
        </div>

        <div class="summary-section">
          <h4>关键词</h4>
          <div class="keywords">
            <el-tag
              v-for="keyword in result.keywords"
              :key="keyword"
              closable
              @close="removeKeyword(keyword)"
            >
              {{ keyword }}
            </el-tag>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="regenerate">重新生成</el-button>
        <el-button type="primary" @click="applyResult">应用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick } from '@element-plus/icons-vue'
import { useAIAnalysis, type AISummaryResult } from '@/composables/useAIAnalysis'

interface Props {
  content: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:summary', 'update:keywords'])

const { isAnalyzing, generateArticleSummary } = useAIAnalysis()

const showResult = ref(false)
const result = ref<AISummaryResult | null>(null)

const generateSummary = async () => {
  if (!props.content || props.content.length < 100) {
    ElMessage.warning('文章内容太短，无法生成摘要')
    return
  }

  try {
    const summaryResult = await generateArticleSummary(props.content)
    result.value = summaryResult
    showResult.value = true
    ElMessage.success('摘要生成成功')
  } catch (error) {
    console.error('生成摘要失败:', error)
    ElMessage.error('摘要生成失败，请稍后重试')
  }
}

const regenerate = async () => {
  if (!props.content) return
  await generateSummary()
}

const removeKeyword = (keyword: string) => {
  if (result.value) {
    result.value.keywords = result.value.keywords.filter(k => k !== keyword)
  }
}

const applyResult = () => {
  if (result.value) {
    emit('update:summary', result.value.summary)
    emit('update:keywords', result.value.keywords)
    ElMessage.success('摘要已应用')
    showResult.value = false
  }
}

const handleClose = () => {
  showResult.value = false
}
</script>

<style scoped lang="scss">
.ai-summary-generator {
  .summary-result {
    .summary-section {
      margin-bottom: 20px;

      h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--text-primary);
      }

      .keywords {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
}
</style>
