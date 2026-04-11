<template>
  <el-dialog
    v-model="visible"
    title="分享文章"
    width="400px"
    :close-on-click-modal="true"
  >
    <div class="share-modal">
      <!-- 二维码 -->
      <div class="qr-section">
        <img :src="qrCodeUrl" alt="二维码" class="qr-code" />
        <p class="qr-tip">扫码分享</p>
      </div>
      
      <!-- 分享按钮 -->
      <div class="share-buttons">
        <el-button @click="shareToWeibo">
          <el-icon><Platform /></el-icon>
          微博
        </el-button>
        <el-button @click="shareToTwitter">
          <el-icon><Link /></el-icon>
          Twitter
        </el-button>
        <el-button @click="shareToLinkedIn">
          <el-icon><Link /></el-icon>
          LinkedIn
        </el-button>
      </div>
      
      <!-- 复制链接 -->
      <div class="copy-section">
        <el-input
          :model-value="url"
          readonly
          class="url-input"
        >
          <template #append>
            <el-button @click="handleCopy">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { generateQRCode, copyToClipboard, shareToWeibo, shareToTwitter, shareToLinkedIn } from '@/utils/share'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  title: string
  url: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const qrCodeUrl = ref('')

watch(() => props.modelValue, async (val) => {
  if (val && props.url) {
    qrCodeUrl.value = await generateQRCode(props.url)
  }
}, { immediate: true })

const handleCopy = async () => {
  const success = await copyToClipboard(props.url)
  if (success) {
    ElMessage.success('链接已复制')
  } else {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped lang="scss">
.share-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .qr-code {
    width: 200px;
    height: 200px;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
  }
  
  .qr-tip {
    margin-top: 8px;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.copy-section {
  .url-input {
    :deep(.el-input__inner) {
      color: var(--text-secondary);
    }
  }
}
</style>
