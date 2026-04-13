# 🤖 AI辅助功能说明

## 功能概述

本博客系统集成了AI辅助功能，包括智能摘要生成、评论情感分析和垃圾评论检测。这些功能可以提升内容创作效率，优化评论管理，提供更好的用户体验。

## 核心功能

### 1. AI文章摘要生成

**功能描述：**
- 基于文章内容自动生成智能摘要
- 提取关键关键词
- 支持本地和云端两种模式

**使用方法：**

1. **本地模式（默认）**
   - 在文章编辑器中，点击"AI生成摘要"按钮
   - 系统会分析文章内容，提取关键句子和关键词
   - 置信度通常在80%以上

2. **云端模式（需要配置）**
   - 配置腾讯云NLP API
   - 调用云端API生成更精准的摘要
   - 需要有效的腾讯云账号和API密钥

**实现原理：**

```typescript
// 本地摘要生成
- 提取关键句子（基于关键词出现频率和位置）
- 提取关键词（基于词频统计）
- 选择得分最高的3-5个句子组合成摘要
- 自动限制长度在200字以内

// 云端摘要生成
- 调用腾讯云NLP关键词提取API
- 基于关键词重新组织成摘要
- 支持更复杂的自然语言处理
```

**使用示例：**

```vue
<template>
  <div class="editor">
    <AISummaryGenerator
      :content="articleContent"
      @update:summary="updateSummary"
      @update:keywords="updateKeywords"
    />
  </div>
</template>
```

### 2. 智能评论情感分析

**功能描述：**
- 自动分析评论的情感倾向
- 识别正面、负面、中性情绪
- 提供情感强度和置信度

**使用方法：**

在文章详情页的评论区，每条评论会自动显示情感分析标签：
- 🟢 **正面**：积极、正面、有收获等
- 🔴 **负面**：负面、糟糕、失望等
- ⚪ **中性**：客观、中立内容

**情感分类：**

```typescript
type SentimentType = 'positive' | 'negative' | 'neutral'

interface SentimentResult {
  sentiment: SentimentType    // 情感类型
  score: number               // 情感强度（0-1）
  confidence: number          // 置信度（0-1）
}
```

**实现原理：**

```typescript
// 本地情感分析
- 使用情感词典匹配（正面词库、负面词库）
- 计算正面和负面词汇出现的频率
- 根据频率差值判断情感倾向
- 计算置信度（基于总词汇数）

// 云端情感分析
- 调用腾讯云NLP情感分析API
- 使用深度学习模型分析
- 提供更精准的情感判断
```

**使用示例：**

```vue
<template>
  <div class="comment">
    <CommentAnalysis
      :content="comment.text"
      :author="comment.author"
      :auto-analyze="true"
    />
  </div>
</template>
```

### 3. 垃圾评论检测

**功能描述：**
- 自动识别垃圾评论
- 提供风险分数和原因
- 支持自动过滤

**检测规则：**

1. **广告检测**
   - 包含广告关键词（加微信、代写、刷单等）
   - 风险分数：+30

2. **重复内容检测**
   - 检测重复字符或短语
   - 风险分数：+20

3. **链接检测**
   - 包含过多外部链接（>2个）
   - 风险分数：+25

4. **无意义内容**
   - 纯数字、纯符号
   - 风险分数：+40

5. **长度检测**
   - 过短（<3字）：+15
   - 过长（>500字）：+10

6. **邮箱检测**
   - 使用临时邮箱：+25

7. **用户名检测**
   - 可疑用户名格式：+20

**风险判定：**

```typescript
interface SpamDetectionResult {
  isSpam: boolean      // 是否为垃圾评论
  reason: string       // 检测原因
  score: number        // 风险分数（0-100）
}

// 风险分数 >= 50：判定为垃圾评论
```

**使用示例：**

```vue
<template>
  <div class="comment">
    <CommentAnalysis
      :content="comment.content"
      :author="comment.author"
      :email="comment.email"
      :show-spam="true"
      :show-sentiment="true"
    />
  </div>
</template>
```

## 配置指南

### 云端API配置

1. **获取腾讯云API密钥**

   - 访问 [腾讯云官网](https://cloud.tencent.com/)
   - 注册并登录账号
   - 进入【API密钥管理】
   - 获取 Secret ID 和 Secret Key
   - 开通【自然语言处理】服务

2. **配置API**

   在博客系统中：
   - 点击设置 → AI分析配置
   - 勾选"使用云端AI"
   - 填入 Secret ID 和 Secret Key
   - 选择地域（广州/上海/北京/香港）
   - 点击"测试连接"
   - 保存配置

3. **功能开关**

   - **自动摘要**：发布文章时自动生成摘要
   - **垃圾过滤**：自动检测并过滤垃圾评论
   - **情感分析**：自动分析评论情感倾向

### 本地模式配置

本地模式无需任何配置，开箱即用：
- 使用内置算法进行摘要生成
- 使用情感词典进行情感分析
- 使用规则引擎进行垃圾检测

本地模式特点：
- ✅ 无需API密钥
- ✅ 无网络请求
- ✅ 无额外费用
- ❌ 精度相对较低
- ❌ 功能相对简单

## API定价

腾讯云NLP服务定价参考：

| 服务 | 免费配额 | 超出后价格 |
|------|---------|-----------|
| 情感分析 | 1000次/月 | ¥0.002/次 |
| 关键词提取 | 1000次/月 | ¥0.002/次 |
| 主题分类 | 1000次/月 | ¥0.002/次 |

详细定价请参考：[腾讯云自然语言处理定价](https://cloud.tencent.com/document/product/271/39140)

## 文件结构

```
src/
├── composables/
│   └── useAIAnalysis.ts          # AI分析核心逻辑
├── components/
│   ├── AIAnalysisConfig.vue      # AI配置组件
│   ├── AISummaryGenerator.vue    # 摘要生成组件
│   └── CommentAnalysis.vue       # 评论分析组件
└── views/
    ├── Editor.vue                 # 编辑器（集成摘要生成）
    └── Article.vue               # 文章详情（集成评论分析）
```

## 使用场景

### 场景1：快速写文章

1. 在编辑器中写完文章内容
2. 点击"AI生成摘要"按钮
3. 系统自动生成摘要和关键词
4. 稍作调整后发布

### 场景2：评论管理

1. 在文章详情页查看评论
2. 每条评论显示情感标签
3. 垃圾评论会自动标记
4. 点击"详情"查看分析结果

### 场景3：内容优化

1. 查看读者评论的情感分布
2. 了解读者对文章的真实反馈
3. 根据反馈优化内容

## 技术细节

### 性能优化

1. **批量分析**
   ```typescript
   // 批量分析评论，避免逐条请求
   const batchAnalyzeComments = async (comments) => {
     const results = await Promise.all([
       ...comments.map(c => detectSpamComment(c)),
       ...comments.map(c => analyzeCommentSentiment(c))
     ])
     return results
   }
   ```

2. **缓存机制**
   - 已分析的评论结果缓存到localStorage
   - 避免重复分析

3. **异步处理**
   - 不阻塞页面渲染
   - 异步加载分析结果

### 错误处理

```typescript
try {
  const result = await generateArticleSummary(content)
} catch (error) {
  console.error('AI分析失败:', error)
  // 降级到本地模式
  const localResult = await generateLocalSummary(content)
}
```

## 扩展开发

### 添加新的情感词

在 `useAIAnalysis.ts` 中修改情感词典：

```typescript
const positiveWords = [
  '好', '棒', '优秀', '厉害',
  // 添加你的正面词
  '精彩', '完美', '实用'
]

const negativeWords = [
  '差', '烂', '不好', '讨厌',
  // 添加你的负面词
  '失望', '糟糕', '问题'
]
```

### 自定义垃圾检测规则

在 `detectLocalSpam` 函数中添加自定义规则：

```typescript
// 自定义规则示例
const spamKeywords = [
  // 添加你的关键词
  '广告', '推广', '联系'
]
```

### 集成其他AI服务

可以替换为其他AI服务商：

- 阿里云NLP
- 百度NLP
- OpenAI GPT
- Google Cloud NLP

只需修改 `generateCloudSummary` 和 `analyzeCloudSentiment` 函数的实现。

## 注意事项

1. **隐私保护**
   - 评论内容不会上传到云端（使用本地模式时）
   - 云端模式遵守腾讯云隐私政策

2. **性能考虑**
   - 大量评论建议使用分页加载
   - 避免一次性分析过多内容

3. **准确性**
   - 本地模式仅供参考
   - 云端模式精度更高但需要费用

4. **API限制**
   - 腾讯云API有调用频率限制
   - 建议添加请求队列和重试机制

## 常见问题

### Q: 为什么有些评论没有分析结果？

A: 可能原因：
- 评论内容过短（<10字）
- 分析失败（网络问题）
- 功能未开启（检查配置）

### Q: 云端模式和本地模式的区别？

A:
- 云端模式：精度高、功能强、需要API、有费用
- 本地模式：精度低、功能简单、免费、无需配置

### Q: 如何提高摘要质量？

A:
- 写作时注意段落清晰
- 使用明确的主题句
- 避免过多的技术术语
- 提供充足的内容（>200字）

### Q: 垃圾评论会自动删除吗？

A: 目前只做标记，不会自动删除。你可以：
- 根据风险分数手动过滤
- 或者在提交时阻止高风险评论

## 更新日志

**v1.0.0** (2026-04-13)
- ✅ AI文章摘要生成
- ✅ 评论情感分析
- ✅ 垃圾评论检测
- ✅ 本地和云端双模式
- ✅ 配置管理界面
- ✅ 批量分析支持

## 技术支持

如有问题或建议，请：
1. 检查浏览器控制台错误
2. 确认API配置是否正确
3. 查看本文档的使用说明

---

**实现日期:** 2026-04-13
**版本:** v1.0.0
**状态:** ✅ 完成并测试通过
