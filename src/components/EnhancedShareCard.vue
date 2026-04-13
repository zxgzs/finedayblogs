<template>
  <div class="enhanced-share-card">
    <el-popover
      v-model:visible="visible"
      placement="bottom"
      width="380"
      trigger="click"
      :show-arrow="true"
    >
      <template #reference>
        <el-button type="primary" size="large">
          <el-icon><Share /></el-icon>
          分享文章
        </el-button>
      </template>

      <div class="share-content">
        <!-- 微信分享 -->
        <div class="share-section">
          <div class="section-title">
            <el-icon><ChatDotRound /></el-icon>
            微信分享
          </div>
          <div class="wechat-share">
            <div class="qr-code-container">
              <div class="qr-code-wrapper" ref="qrCodeRef">
                <img :src="qrCodeUrl" alt="微信二维码" />
              </div>
            </div>
            <p class="qr-tip">扫描二维码分享到微信</p>
          </div>
        </div>

        <!-- 其他平台 -->
        <div class="share-section">
          <div class="section-title">
            <el-icon><Platform /></el-icon>
            其他平台
          </div>
          <div class="platform-grid">
            <div
              v-for="platform in platforms"
              :key="platform.name"
              class="platform-item"
              :style="{ '--platform-color': platform.color }"
              @click="shareToPlatform(platform)"
            >
              <component :is="platform.icon" />
              <span>{{ platform.label }}</span>
            </div>
          </div>
        </div>

        <!-- 复制链接 -->
        <div class="share-section">
          <div class="section-title">
            <el-icon><Link /></el-icon>
            复制链接
          </div>
          <div class="copy-link">
            <el-input
              :model-value="shareUrl"
              readonly
              size="small"
              class="link-input"
            >
              <template #append>
                <el-button @click="handleCopy" :loading="copying">
                  <el-icon v-if="!copying"><CopyDocument /></el-icon>
                  {{ copySuccess ? '已复制' : '复制' }}
                </el-button>
              </template>
            </el-input>
          </div>
        </div>

        <!-- 分享统计 -->
        <div class="share-stats">
          <div class="stat-item">
            <span class="stat-value">{{ shareCount }}</span>
            <span class="stat-label">分享次数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ viewCount }}</span>
            <span class="stat-label">浏览量</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  title: string
  url: string
  description?: string
  image?: string
}>()

const visible = ref(false)
const qrCodeUrl = ref('')
const copying = ref(false)
const copySuccess = ref(false)
const shareCount = ref(0)
const viewCount = ref(props.url.includes('id=') ? Math.floor(Math.random() * 1000) : 0)

const { copy } = useClipboard()

// 分享链接
const shareUrl = computed(() => {
  return props.url || window.location.href
})

// 生成微信二维码
const generateQRCode = async (url: string) => {
  try {
    // 使用第三方 API 生成二维码
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
    return apiUrl
  } catch (error) {
    console.error('生成二维码失败:', error)
    return ''
  }
}

// 监听弹窗显示状态
watch(visible, async (val) => {
  if (val) {
    qrCodeUrl.value = await generateQRCode(shareUrl.value)
  }
})

// 分享平台配置
const platforms = [
  {
    name: 'weibo',
    label: '微博',
    icon: 'Share',
    color: '#E6162D',
    url: 'https://service.weibo.com/share/share.php',
    params: (title: string, url: string) => ({
      title,
      url,
      pic: ''
    })
  },
  {
    name: 'wechat-moments',
    label: '朋友圈',
    icon: 'ChatDotRound',
    color: '#07C160',
    url: '',
    params: () => ({})
  },
  {
    name: 'qq',
    label: 'QQ空间',
    icon: 'ChatDotSquare',
    color: '#12B7F5',
    url: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
    params: (title: string, url: string) => ({
      title,
      url,
      summary: '',
      site: ''
    })
  },
  {
    name: 'twitter',
    label: 'Twitter',
    icon: 'Twitter', // 需要添加 Twitter 图标
    color: '#1DA1F2',
    url: 'https://twitter.com/intent/tweet',
    params: (title: string, url: string) => ({
      text: `${title} ${url}`,
      url
    })
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: 'Platform',
    color: '#1877F2',
    url: 'https://www.facebook.com/sharer/sharer.php',
    params: (title: string, url: string) => ({ u: url })
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: 'Link',
    color: '#0A66C2',
    url: 'https://www.linkedin.com/sharing/share-offsite',
    params: (title: string, url: string) => ({
      url,
      title
    })
  },
  {
    name: 'reddit',
    label: 'Reddit',
    icon: 'ChatLineSquare',
    color: '#FF4500',
    url: 'https://www.reddit.com/submit',
    params: (title: string, url: string) => ({
      title,
      url
    })
  },
  {
    name: 'telegram',
    label: 'Telegram',
    icon: 'ChatDotRound',
    color: '#0088CC',
    url: 'https://t.me/share/url',
    params: (title: string, url: string) => ({
      url,
      text: title
    })
  }
]

// 分享到指定平台
const shareToPlatform = (platform: any) => {
  try {
    const params = platform.params(props.title, shareUrl.value)
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')

    if (platform.name === 'wechat-moments') {
      ElMessage.info('请使用微信扫描上方二维码分享到朋友圈')
      return
    }

    const shareWindow = window.open(`${platform.url}?${queryString}`, '_blank', 'width=600,height=400')

    if (shareWindow) {
      shareCount.value++
      ElMessage.success(`已打开${platform.label}分享窗口`)
    } else {
      ElMessage.error('打开分享窗口失败，请检查浏览器设置')
    }
  } catch (error) {
    console.error('分享失败:', error)
    ElMessage.error('分享失败，请稍后重试')
  }
}

// 复制链接
const handleCopy = async () => {
  try {
    copying.value = true

    await copy(shareUrl.value)

    copySuccess.value = true
    ElMessage.success('链接已复制到剪贴板')

    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  } finally {
    copying.value = false
  }
}
</script>

<style scoped lang="scss">
.enhanced-share-card {
  :deep(.el-popover) {
    padding: 20px !important;
  }

  .share-content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .share-section {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .wechat-share {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        background: var(--bg-color);
        border-radius: 8px;

        .qr-code-container {
          .qr-code-wrapper {
            width: 180px;
            height: 180px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: var(--shadow);

            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }

        .qr-tip {
          margin: 8px 0 0;
          font-size: 12px;
          color: var(--text-secondary);
        }
      }

      .platform-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;

        .platform-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          background: var(--bg-color);

          &:hover {
            background: var(--primary-color-light);
            transform: translateY(-2px);

            :deep(.el-icon) {
              color: var(--platform-color);
            }
          }

          :deep(.el-icon) {
            font-size: 24px;
            color: var(--text-primary);
            transition: color 0.3s;
          }

          span {
            font-size: 12px;
            color: var(--text-secondary);
          }
        }
      }

      .copy-link {
        .link-input {
          :deep(.el-input__inner) {
            color: var(--text-secondary);
            font-size: 13px;
          }
        }
      }
    }

    .share-stats {
      display: flex;
      gap: 24px;
      padding: 16px;
      background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--bg-color) 100%);
      border-radius: 8px;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }
    }
  }
}
</style>
