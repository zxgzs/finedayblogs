# AI 助手 - 快速开始指南

## 🎉 恭喜！AI 助手已成功集成到你的博客中！

## 🚀 如何使用

### 第一步：启动博客

```bash
yarn dev
```

### 第二步：打开 AI 助手

1. 访问博客首页
2. 点击右下角的 **紫色圆形按钮**（AI 助手图标）
3. 助手面板会从右下角滑出

### 第三步：配置 API Key

1. 点击助手面板右上角的 **设置图标**（齿轮）
2. 在弹出的设置面板中：
   - 选择你喜欢的 AI 模型（GPT-4、GPT-3.5、Claude 3、DeepSeek 等）
   - 输入你的 API Key
   - （可选）自定义角色设定
   - （可选）选择 Live2D 模型
3. 点击"保存"

### 第四步：开始对话

- **文字输入**：在输入框输入消息，按 Enter 发送
- **语音输入**：点击"语音"按钮，对着麦克风说话
- **语音输出**：在设置中开启"语音合成"，AI 会朗读回复

## 🎨 功能说明

### 1. Live2D 模型
支持以下模型：
- **Shizuku**：经典动漫风格
- **Haru**：可爱风格
- **Haru-01**：另一种可爱风格
- **Hiyori**：清新风格

### 2. 对话功能
- 支持多轮对话上下文
- 消息自动滚动到底部
- 打字动画效果
- 消息历史记录（保存在本地存储）

### 3. 语音功能
- **语音识别**：使用浏览器原生 Web Speech API
- **语音合成**：将文字转换为语音朗读
- 支持中文语音识别（需要 Chrome、Edge 等浏览器）

### 4. 模型选择
支持以下模型：
- OpenAI GPT-4 / GPT-3.5
- Anthropic Claude 3
- DeepSeek
- 其他兼容 OpenAI API 的模型

## 🔑 获取 API Key

### OpenAI API Key
1. 访问 https://platform.openai.com/
2. 登录或注册账号
3. 点击右上角头像 → API Keys
4. 创建新的 API Key
5. 复制并粘贴到助手的设置中

### DeepSeek API Key
1. 访问 https://www.deepseek.com/
2. 注册账号
3. 进入 API 管理页面
4. 获取 API Key

### Claude API Key
1. 访问 https://console.anthropic.com/
2. 登录或注册
3. 获取 API Key

## 💡 使用技巧

### 自定义角色设定
让 AI 助手扮演特定角色，例如：

```
你是一个专业的技术博客助手，擅长：
- 前端开发（Vue、React、TypeScript）
- 后端开发（Node.js、Python）
- 数据库设计
- 系统架构

请用简洁、专业的语气回答用户的问题。
```

### 对话技巧
- 提问要清晰具体
- 可以让 AI 解释代码、提供建议
- 可以询问技术问题、获取学习资源
- 支持多轮对话，可以追问细节

### 语音使用
- 在安静环境中使用语音识别效果更好
- 可以按住语音按钮连续说话
- 语音合成可以在设置中调整

## 🛡️ 安全提醒

⚠️ **重要提示**：
1. 不要在前端暴露敏感的 API Key（当前实现仅用于演示）
2. 建议在生产环境中通过后端代理 API 请求
3. 注意 API 调用量和费用限制
4. 对用户输入进行适当的内容过滤

## 🔧 高级配置

### 后端代理（推荐）

为了安全性，建议创建后端代理：

```typescript
// 后端 API（Node.js + Express）
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 500
  })

  res.json(response)
})
```

然后修改前端代码调用你的后端 API：

```typescript
const fetchAIResponse = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [...messages, { role: 'user', content }] })
  })

  const data = await response.json()
  return data.choices[0].message.content
}
```

### 集成完整的 Live2D

如果需要使用完整的 Live2D 模型：

1. 安装 Live2D 库：
```bash
yarn add oh-my-live2d
```

2. 下载 Live2D 模型文件：
   - Shizuku: https://github.com/guansss/pixiv-live2d-widget
   - 其他模型：从 Live2D 官网或 GitHub 获取

3. 配置模型路径并加载

### RAG 功能（基于博客内容）

将博客文章作为知识库，让 AI 能够回答关于博客内容的问题：

1. 使用向量数据库（如 Pinecone、Qdrant）
2. 将博客文章向量化存储
3. 用户提问时先检索相关文章
4. 将检索结果作为上下文发送给 AI

## 📚 更多资源

- [完整集成指南](./AI_ASSISTANT_GUIDE.md)
- [AIRI 项目](https://github.com/moeru-ai/airi)
- [Live2D 官网](https://www.live2d.com/)
- [Web Speech API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

## 📄 许可证

MIT License

---

**享受与 AI 助手的互动吧！** 🎊
