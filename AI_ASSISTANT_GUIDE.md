# AI 助手集成指南

本指南说明如何使用集成到博客中的 AI 助手功能。

## 功能特性

### 1. 对话功能
- 支持多轮对话
- 支持自定义角色设定
- 消息历史记录

### 2. Live2D 模型
- 支持 Shizuku、Haru、Haru-01、Hiyori 等模型
- 模型动画效果
- 可切换不同模型

### 3. 语音功能
- **语音识别（STT）**：通过麦克风输入语音
- **语音合成（TTS）**：将 AI 响应转换为语音
- 支持浏览器原生 API

### 4. 多模型支持
- OpenAI GPT-4 / GPT-3.5
- Anthropic Claude 3
- DeepSeek
- 其他兼容 OpenAI API 的模型

## 使用方法

### 1. 在 App.vue 中引入组件

```vue
<template>
  <div id="app">
    <!-- 你的现有内容 -->
    <router-view />

    <!-- 添加 AI 助手组件 -->
    <AIAssistant />
  </div>
</template>

<script setup lang="ts">
import AIAssistant from '@/components/AIAssistant.vue'
</script>
```

### 2. 配置 API Key

1. 点击右下角的 AI 助手按钮
2. 点击设置图标（齿轮）
3. 选择模型
4. 输入你的 API Key
5. 点击保存

### 3. 开始对话

- 直接在输入框输入文字，按 Enter 发送
- 或点击"语音"按钮使用语音输入
- AI 会实时响应你的问题

## API Key 获取方式

### OpenAI
1. 访问 https://platform.openai.com/
2. 登录或注册账号
3. 进入 API Keys 页面
4. 创建新的 API Key

### DeepSeek
1. 访问 https://www.deepseek.com/
2. 注册账号
3. 进入 API 管理页面
4. 获取 API Key

### Claude
1. 访问 https://console.anthropic.com/
2. 登录或注册账号
3. 获取 API Key

## 高级配置

### 自定义角色设定

在设置中的"角色设定"输入框，可以自定义 AI 的角色：

```
你是一个专业的技术博客助手，擅长：
- 前端开发
- Vue.js
- React
- TypeScript
请用简洁、友好的语气回答问题。
```

### Live2D 模型切换

1. 打开设置
2. 在"Live2D 模型"下拉框中选择
3. 点击保存，模型会自动重新加载

## 技术实现

### 组件位置
`src/components/AIAssistant.vue`

### 主要依赖
- `@element-plus/icons-vue`：UI 图标
- `@vueuse/core`：Vue 工具库
- Web Speech API：语音识别和合成

### 扩展功能

#### 1. 集成完整的 Live2D

安装 `oh-my-live2d`：
```bash
yarn add oh-my-live2d
```

在组件中实现：

```typescript
import { loadLive2D } from 'oh-my-live2d'

const initLive2D = async () => {
  try {
    live2dInstance = await loadLive2D({
      target: live2dContainer.value,
      model: settings.value.live2dModel,
      mobile: true
    })
    live2dLoaded.value = true
  } catch (error) {
    console.error('Live2D 加载失败:', error)
  }
}
```

#### 2. 添加记忆功能

使用 IndexedDB 存储对话历史：

```typescript
import { openDB } from 'idb'

const saveMessageToDB = async (message: Message) => {
  const db = await openDB('ai-assistant', 1)
  await db.add('messages', {
    ...message,
    timestamp: Date.now()
  })
}
```

#### 3. 添加 RAG 功能

集成向量数据库实现知识检索：

```typescript
const searchKnowledge = async (query: string) => {
  // 查询本地或远程向量数据库
  const results = await vectorDB.search(query, 3)
  return results
}
```

## 常见问题

### Q: 语音识别不可用？
A: 确保浏览器支持 Web Speech API（Chrome、Edge 等现代浏览器），并且允许麦克风权限。

### Q: Live2D 模型无法加载？
A: 确保网络可以访问 Live2D 模型资源，或者使用本地模型文件。

### Q: API 调用失败？
A:
1. 检查 API Key 是否正确
2. 检查网络连接
3. 检查 API 是否有额度限制

### Q: 如何切换主题？
A: AI 助手会自动适配博客的主题颜色（浅色/深色/护眼模式）。

## 安全建议

1. **不要在前端暴露敏感的 API Key**：建议通过后端代理 API 请求
2. **实现速率限制**：防止 API 滥用
3. **内容过滤**：对用户输入和 AI 响应进行安全检查

## 未来改进

- [ ] 支持更多 LLM 模型（Ollama 本地模型等）
- [ ] 集成完整的 AIRI 项目功能
- [ ] 添加多模态支持（图片、视频）
- [ ] 实现 RAG 功能（基于博客内容的知识库）
- [ ] 添加插件系统（可以执行代码、浏览网页等）
- [ ] 支持多语言

## 参考资料

- [AIRI 项目](https://github.com/moeru-ai/airi)
- [Live2D 官网](https://www.live2d.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenAI API 文档](https://platform.openai.com/docs/)

## 许可证

MIT License
