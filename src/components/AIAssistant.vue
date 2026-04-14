<template>
  <div class="ai-assistant-container">
    <!-- 切换按钮 -->
    <button
      class="assistant-toggle"
      @click="toggleAssistant"
      :class="{ active: isOpen }"
      title="AI 助手"
    >
      <el-icon :size="24">
        <ChatDotRound />
      </el-icon>
    </button>

    <!-- 助手面板 -->
    <Transition name="assistant-slide">
      <div v-if="isOpen" class="assistant-panel glassmorphism">
        <!-- 头部 -->
        <div class="assistant-header">
          <div class="assistant-title">
            <el-icon><UserFilled /></el-icon>
            <span>AI 助手</span>
          </div>
          <div class="assistant-actions">
            <el-button
              size="small"
              circle
              @click="toggleSettings"
              :icon="Setting"
              title="设置"
            />
            <el-button
              size="small"
              circle
              @click="toggleAssistant"
              :icon="Close"
              title="关闭"
            />
          </div>
        </div>

        <!-- Live2D 模型区域 -->
        <div ref="live2dContainer" class="live2d-container">
          <div v-if="!live2dLoaded" class="live2d-placeholder">
            <el-icon :size="48" class="placeholder-icon"><Avatar /></el-icon>
            <p>加载中...</p>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="chat-container">
          <div
            ref="chatMessages"
            class="chat-messages"
            @scroll="handleScroll"
          >
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="chat-message"
              :class="message.role"
            >
              <div class="message-content">
                <div class="message-sender">{{ message.role === 'user' ? '你' : 'AI 助手' }}</div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
            <div v-if="isTyping" class="chat-message assistant">
              <div class="message-content">
                <div class="message-sender">AI 助手</div>
                <div class="message-text typing">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="2"
            placeholder="输入消息..."
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.prevent
          />
          <div class="input-actions">
            <el-button
              size="small"
              @click="toggleVoice"
              :disabled="!voiceSupported"
              :icon="isListening ? Microphone : Microphone"
            >
              {{ isListening ? '停止' : '语音' }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="sendMessage"
              :loading="isLoading"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 设置面板 -->
    <el-dialog
      v-model="settingsVisible"
      title="AI 助手设置"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="settings" label-width="120px">
        <el-form-item label="模型">
          <el-select v-model="settings.model" placeholder="选择模型">
            <el-option label="GPT-4" value="gpt-4" />
            <el-option label="GPT-3.5" value="gpt-3.5-turbo" />
            <el-option label="Claude 3" value="claude-3" />
            <el-option label="DeepSeek" value="deepseek" />
          </el-select>
        </el-form-item>

        <el-form-item label="API Key">
          <el-input
            v-model="settings.apiKey"
            type="password"
            placeholder="输入 API Key"
            show-password
          />
        </el-form-item>

        <el-form-item label="角色设定">
          <el-input
            v-model="settings.systemPrompt"
            type="textarea"
            :rows="4"
            placeholder="输入角色设定..."
          />
        </el-form-item>

        <el-form-item label="Live2D 模型">
          <el-select v-model="settings.live2dModel" placeholder="选择模型">
            <el-option label="Shizuku" value="shizuku" />
            <el-option label="Haru" value="haru" />
            <el-option label="Haru-01" value="haru-01" />
            <el-option label="Hiyori" value="hiyori" />
          </el-select>
        </el-form-item>

        <el-form-item label="语音合成">
          <el-switch v-model="settings.ttsEnabled" />
        </el-form-item>

        <el-form-item label="语音识别">
          <el-switch v-model="settings.sttEnabled" :disabled="!voiceSupported" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Close, Setting, UserFilled, Avatar, Microphone } from '@element-plus/icons-vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface Settings {
  model: string
  apiKey: string
  systemPrompt: string
  live2dModel: string
  ttsEnabled: boolean
  sttEnabled: boolean
}

const isOpen = ref(false)
const isTyping = ref(false)
const isLoading = ref(false)
const isListening = ref(false)
const live2dLoaded = ref(false)
const settingsVisible = ref(false)
const voiceSupported = ref(false)

const inputMessage = ref('')
const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是你的 AI 助手，有什么我可以帮助你的吗？',
    timestamp: new Date()
  }
])

const settings = ref<Settings>({
  model: 'gpt-3.5-turbo',
  apiKey: '',
  systemPrompt: '你是一个友好的 AI 助手，帮助用户解答问题和提供信息。',
  live2dModel: 'shizuku',
  ttsEnabled: false,
  sttEnabled: false
})

const live2dContainer = ref<HTMLElement>()
const chatMessages = ref<HTMLElement>()
let live2dInstance: any = null
let recognition: any = null

// 初始化 Live2D
const initLive2D = async () => {
  try {
    // 这里使用 oh-my-live2d 或其他 Live2D 库
    // 简化版本：使用 CSS 动画作为占位
    live2dLoaded.value = true
    ElMessage.success('Live2D 模型加载成功')
  } catch (error) {
    console.error('Live2D 加载失败:', error)
    ElMessage.error('Live2D 模型加载失败')
  }
}

// 初始化语音识别
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    voiceSupported.value = true
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'zh-CN'

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      inputMessage.value = transcript
      isListening.value = false
    }

    recognition.onerror = () => {
      isListening.value = false
      ElMessage.error('语音识别失败')
    }

    recognition.onend = () => {
      isListening.value = false
    }
  }
}

// 发送消息
const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content,
    timestamp: new Date()
  })

  inputMessage.value = ''
  await scrollToBottom()

  // 显示输入状态
  isTyping.value = true
  isLoading.value = true

  try {
    // 调用 AI API
    const response = await fetchAIResponse(content)

    // 添加 AI 响应
    messages.value.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    })

    // TTS 语音合成
    if (settings.value.ttsEnabled) {
      await speakText(response)
    }
  } catch (error) {
    ElMessage.error('获取 AI 响应失败')
  } finally {
    isTyping.value = false
    isLoading.value = false
    await scrollToBottom()
  }
}

// 调用 AI API
const fetchAIResponse = async (content: string): Promise<string> => {
  // 这里需要替换为实际的 API 调用
  // 示例：调用 OpenAI API
  if (!settings.value.apiKey) {
    return '请先在设置中配置 API Key。'
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.value.apiKey}`
      },
      body: JSON.stringify({
        model: settings.value.model,
        messages: [
          { role: 'system', content: settings.value.systemPrompt },
          ...messages.value.map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const data = await response.json()
    return data.choices[0]?.message?.content || '抱歉，我没有收到响应。'
  } catch (error) {
    console.error('API 调用失败:', error)
    return '抱歉，API 调用失败，请检查网络连接和 API Key。'
  }
}

// 语音合成
const speakText = async (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 1
    window.speechSynthesis.speak(utterance)
  }
}

// 语音输入
const toggleVoice = () => {
  if (isListening.value) {
    recognition.stop()
    isListening.value = false
  } else {
    recognition.start()
    isListening.value = true
    ElMessage.info('开始语音识别...')
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

// 处理滚动
const handleScroll = () => {
  // 可以在这里实现加载更多历史消息
}

// 切换助手面板
const toggleAssistant = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && !live2dLoaded.value) {
    initLive2D()
  }
}

// 切换设置面板
const toggleSettings = () => {
  settingsVisible.value = true
}

// 保存设置
const saveSettings = () => {
  localStorage.setItem('ai-assistant-settings', JSON.stringify(settings.value))
  settingsVisible.value = false
  ElMessage.success('设置已保存')

  // 重新加载 Live2D 模型
  if (isOpen.value) {
    live2dLoaded.value = false
    initLive2D()
  }
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('ai-assistant-settings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  }
}

onMounted(() => {
  loadSettings()
  initSpeechRecognition()
})

onUnmounted(() => {
  if (recognition) {
    recognition.stop()
  }
})
</script>

<style scoped lang="scss">
.ai-assistant-container {
  position: fixed;
  bottom: 80px;
  left: 30px;
  z-index: 9999;

  .assistant-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.6);
    }

    &.active {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }
  }

  .assistant-panel {
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 400px;
    height: 600px;
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: calc(100vh - 160px);

    .assistant-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
      background: rgba(99, 102, 241, 0.05);

      .assistant-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .assistant-actions {
        display: flex;
        gap: 8px;
      }
    }

    .live2d-container {
      height: 200px;
      background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .live2d-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: var(--text-muted);

        .placeholder-icon {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      }
    }

    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .chat-message {
          display: flex;
          align-items: flex-start;
          gap: 8px;

          &.user {
            flex-direction: row-reverse;

            .message-content {
              background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
              color: white;
              border-radius: 20px 20px 4px 20px;

              .message-sender {
                color: rgba(255, 255, 255, 0.9);
              }
            }
          }

          &.assistant {
            .message-content {
              background: var(--bg-secondary);
              border: 1px solid var(--border-color);
              border-radius: 20px 20px 20px 4px;
            }
          }

          .message-content {
            max-width: 80%;
            padding: 12px 16px;
            animation: messageIn 0.3s ease;

            .message-sender {
              font-size: 11px;
              font-weight: 600;
              margin-bottom: 4px;
              color: var(--text-muted);
            }

            .message-text {
              font-size: 14px;
              line-height: 1.5;
              word-break: break-word;
            }

            .typing {
              display: flex;
              gap: 4px;
              padding: 8px 0;

              .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: currentColor;
                animation: typing 1.4s infinite ease-in-out both;

                &:nth-child(1) { animation-delay: -0.32s; }
                &:nth-child(2) { animation-delay: -0.16s; }
              }

              @keyframes typing {
                0%, 80%, 100% {
                  transform: scale(0.6);
                  opacity: 0.5;
                }
                40% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }

          @keyframes messageIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      }
    }

    .chat-input {
      padding: 16px;
      border-top: 1px solid var(--border-color);
      background: rgba(99, 102, 241, 0.02);

      .input-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }
    }
  }

  .assistant-slide-enter-active,
  .assistant-slide-leave-active {
    transition: all 0.3s ease;
  }

  .assistant-slide-enter-from,
  .assistant-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
