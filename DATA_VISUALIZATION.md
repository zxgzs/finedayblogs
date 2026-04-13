# 📊 数据可视化功能说明

## 功能概述

本博客系统集成了完整的数据可视化功能，包括个人数据仪表板、文章影响力分析和用户行为热力图。这些功能可以帮助博主了解博客的整体运营情况、读者行为模式和文章传播效果。

## 核心功能

### 1. 个人数据仪表板

**功能描述：**
- 全面的数据统计展示
- 阅读趋势分析
- 互动数据分析
- 分类统计
- 时段分布分析

**统计指标：**

#### 阅读统计
- **总浏览量**：所有文章的总浏览次数
- **总阅读时长**：读者累计阅读时间（分钟）
- **文章数量**：已发布的文章总数
- **完成率**：平均文章完成阅读率

#### 互动统计
- **总点赞数**：所有文章获得的点赞总数
- **总评论数**：所有文章的评论总数
- **总分享数**：所有文章的分享总数
- **平均互动**：每篇文章的平均互动次数
- **点赞率**：点赞数/浏览数 × 100%
- **评论率**：评论数/浏览数 × 100%

**图表展示：**

1. **阅读趋势图**
   - 显示最近7天/30天/90天的数据
   - 支持切换浏览量、点赞数、评论数
   - 平滑曲线展示趋势变化

2. **时段分布图**
   - 柱状图展示24小时阅读分布
   - 了解读者的活跃时间段
   - 帮助优化发布时间

3. **分类统计图**
   - 饼图展示各分类文章占比
   - 直观了解内容分布
   - 支持点击查看详情

4. **互动率分析图**
   - 对比点赞率和评论率
   - 评估文章互动质量
   - 发现内容优化方向

**使用方法：**

1. 访问数据仪表板页面
   - 点击导航栏的"数据"菜单
   - 或直接访问 `/dashboard`

2. 选择时间范围
   - 近7天、近30天、近90天
   - 切换不同时间段查看数据变化

3. 刷新数据
   - 点击"刷新数据"按钮
   - 实时更新所有图表

**数据来源：**

```typescript
// 从localStorage读取数据
- article_views: 文章浏览记录
- reading_time: 总阅读时长
- reading_history: 阅读历史记录
- article_likes: 点赞记录
- blog_comments: 评论数据
- article_shares: 分享记录
```

### 2. 文章影响力分析

**功能描述：**
- 计算每篇文章的影响力得分
- 展示文章传播路径和效果
- 排行展示最受欢迎的文章

**影响力计算公式：**

```typescript
影响力得分 = (点赞数 × 2 + 评论数 × 3 + 分享数 × 5) + (浏览数 × 0.1)
传播范围 = 浏览数 + (分享数 × 100)
互动率 = (点赞数 + 评论数 + 分享数) / 浏览数 × 100%
```

**排行指标：**

- **影响力**：按影响力得分排序
- **浏览量**：按浏览次数排序
- **互动率**：按互动率排序

**趋势指示：**

- 🟢 **上升**：文章热度持续上升
- 🔴 **下降**：文章热度下降
- ⚪ **稳定**：文章热度平稳

**排行榜展示：**

```vue
<div class="impact-item">
  <div class="rank-number">1</div>
  <div class="impact-content">
    <div class="impact-title">文章标题</div>
    <div class="impact-metrics">
      <span>浏览: 1234</span>
      <span>点赞: 56</span>
      <span>评论: 23</span>
      <span>分享: 12</span>
    </div>
  </div>
  <div class="impact-score">
    <div class="score-value">156.7</div>
    <div class="score-trend">上升</div>
  </div>
</div>
```

**使用场景：**

1. **内容优化**
   - 识别高影响力文章
   - 分析成功文章的特点
   - 优化后续内容策略

2. **推广决策**
   - 选择高影响力文章重点推广
   - 针对不同渠道制定策略
   - 提高推广ROI

3. **读者洞察**
   - 了解读者喜好
   - 发现热门话题
   - 调整内容方向

### 3. 用户行为热力图

**功能描述：**
- 可视化用户点击行为
- 分析用户停留时长
- 识别用户关注重点区域

**热力区域划分：**

```
┌─────────────────────────┐
│      标题区              │  - 文章标题区域
├─────────────────────────┤
│      导语区              │  - 文章摘要区域
├─────────────────────────┤
│                         │
│      正文区              │  - 文章主要内容
│                         │
├─────────────────────────┤
│      底部区              │  - 评论区、推荐等
└─────────────────────────┘
```

**数据类型：**

1. **点击热力**
   - 统计各区域的点击次数
   - 显示用户最关注的区域
   - 颜色深浅代表热度高低

2. **停留时长**
   - 统计各区域的停留时间
   - 分析用户阅读习惯
   - 优化内容布局

**热力图说明：**

- 🔵 低热度 (20%以下)
- 🟡 中等热度 (20%-60%)
- 🔴 高热度 (60%以上)

**应用场景：**

1. **布局优化**
   - 将重要内容放在高热度区域
   - 提高关键信息的曝光率
   - 优化用户阅读体验

2. **内容调整**
   - 根据停留时长调整内容密度
   - 平衡各区域的信息量
   - 提升整体阅读率

3. **广告位选择**
   - 选择高热度区域投放广告
   - 提高广告点击率
   - 最大化收益

## 组件使用

### AnalyticsChart - 图表组件

**用途：** 通用的ECharts图表封装组件

**属性：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| option | Object | - | ECharts配置选项 |
| height | String | '400px' | 图表高度 |
| theme | String | 'default' | 图表主题 |

**使用示例：**

```vue
<template>
  <AnalyticsChart
    :option="chartOption"
    height="400px"
  />
</template>

<script setup>
import { ref } from 'vue'

const chartOption = ref({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1月', '2月', '3月'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: [120, 200, 150]
  }]
})
</script>
```

### StatsCard - 统计卡片

**用途：** 显示关键指标数据的卡片组件

**属性：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | - | 卡片标题 |
| value | Number/String | - | 显示值 |
| type | String | 'primary' | 颜色类型 |
| icon | Component | - | 图标组件 |
| unit | String | - | 单位 |
| trend | Number | - | 趋势百分比 |
| loading | Boolean | false | 加载状态 |

**类型选项：**
- `primary` - 蓝色
- `success` - 绿色
- `warning` - 橙色
- `danger` - 红色
- `info` - 灰色

**使用示例：**

```vue
<StatsCard
  title="总浏览量"
  :value="12345"
  type="primary"
  :icon="View"
  unit="次"
  :trend="12.5"
/>
```

### ArticleImpact - 文章影响力

**用途：** 展示文章影响力排行

**属性：**

| 属性 | 类型 | 说明 |
|------|------|------|
| impacts | ArticleImpact[] | 影响力数据数组 |

**使用示例：**

```vue
<ArticleImpact :impacts="articleImpacts" />
```

### UserHeatmap - 用户热力图

**用途：** 展示用户行为热力图

**属性：**

| 属性 | 类型 | 说明 |
|------|------|------|
| heatmapData | HeatmapData[] | 热力数据数组 |

**使用示例：**

```vue
<UserHeatmap :heatmap-data="heatmapData" />
```

## Composable API

### useAnalytics

**功能：** 提供数据分析相关的功能函数

**返回方法：**

```typescript
const {
  isLoading,                    // 加载状态
  getReadingStats,             // 获取阅读统计
  getInteractionStats,         // 获取互动统计
  getTrendData,                // 获取趋势数据
  calculateArticleImpact,      // 计算文章影响力
  getArticleImpacts,           // 获取文章影响力排行
  trackUserBehavior,           // 记录用户行为
  generateHeatmapData,         // 生成热力图数据
  getTimeDistribution,         // 获取时段分布
  getCategoryStats              // 获取分类统计
} = useAnalytics()
```

**使用示例：**

```typescript
import { useAnalytics } from '@/composables/useAnalytics'
import { articles } from '@/data/articles'

const { getReadingStats, getArticleImpacts } = useAnalytics()

// 获取阅读统计
const readingStats = getReadingStats()
console.log(readingStats.totalViews)    // 总浏览量
console.log(readingStats.totalReadTime) // 总阅读时长

// 获取文章影响力排行
const impacts = getArticleImpacts(articles)
console.log(impacts[0].impactScore)     // 第一名的得分
```

## 路由配置

```typescript
{
  path: '/dashboard',
  name: 'Dashboard',
  component: Dashboard,
  meta: { title: '数据仪表板' }
}
```

## 文件结构

```
src/
├── composables/
│   └── useAnalytics.ts             # 数据分析核心逻辑
├── components/
│   ├── AnalyticsChart.vue          # 图表组件
│   ├── StatsCard.vue               # 统计卡片组件
│   ├── ArticleImpact.vue           # 文章影响力组件
│   └── UserHeatmap.vue             # 用户热力图组件
└── views/
    └── Dashboard.vue               # 数据仪表板页面
```

## 数据存储

### LocalStorage结构

```typescript
// 文章浏览记录
interface ArticleViews {
  [articleId: number]: number  // 浏览次数
}

// 阅读历史
interface ReadingHistory {
  articleId: number
  timestamp: number
  readTime: number
}

// 点赞记录
interface ArticleLikes {
  [articleId: number]: boolean
}

// 评论数据
interface Comments {
  id: number
  articleId: number
  author: string
  content: string
  date: string
}

// 分享记录
interface ArticleShares {
  [articleId: number]: number
}

// 用户行为记录
interface UserBehavior {
  elementId: string
  position: { x: number; y: number }
  type: 'click' | 'hover' | 'scroll'
  duration: number
  timestamp: number
}
```

## 依赖安装

```bash
npm install echarts
```

## 图表配置

### ECharts配置示例

#### 折线图

```typescript
{
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1月', '2月', '3月'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    smooth: true,
    data: [120, 200, 150]
  }]
}
```

#### 柱状图

```typescript
{
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: [100, 200, 150]
  }]
}
```

#### 饼图

```typescript
{
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: '50%',
    data: [
      { name: 'A', value: 100 },
      { name: 'B', value: 200 }
    ]
  }]
}
```

## 性能优化

### 数据缓存

```typescript
// 缓存计算结果，避免重复计算
const cachedStats = ref<ReadingStats | null>(null)

const getReadingStats = () => {
  if (cachedStats.value) {
    return cachedStats.value
  }

  const stats = calculateStats()
  cachedStats.value = stats
  return stats
}
```

### 图表懒加载

```vue
<template>
  <AnalyticsChart
    v-if="showChart"
    :option="chartOption"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showChart = ref(false)

onMounted(() => {
  // 延迟加载图表，提升首屏性能
  setTimeout(() => {
    showChart.value = true
  }, 300)
})
</script>
```

## 注意事项

1. **数据隐私**
   - 所有数据存储在本地
   - 不涉及用户隐私信息
   - 符合数据保护法规

2. **性能考虑**
   - 图表数据不要过多
   - 合理使用数据缓存
   - 避免频繁重绘

3. **浏览器兼容**
   - 使用localStorage需要浏览器支持
   - 图表功能需要现代浏览器
   - IE浏览器不支持

4. **数据准确性**
   - 本地数据可能不完整
   - 建议定期清理无效数据
   - 重要数据建议备份

## 扩展开发

### 添加新的统计指标

```typescript
// 在 useAnalytics.ts 中添加新方法
const getNewStats = () => {
  // 实现你的逻辑
  return {
    // 返回统计数据
  }
}

export function useAnalytics() {
  return {
    // 现有方法
    getNewStats  // 添加新方法
  }
}
```

### 自定义图表样式

```typescript
const customChartOption = {
  // ECharts 配置
  backgroundColor: '#f5f5f5',
  textStyle: {
    fontFamily: 'Arial'
  },
  // 更多自定义配置...
}
```

### 集成后端API

```typescript
const fetchStatsFromAPI = async () => {
  try {
    const response = await fetch('/api/stats')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取数据失败:', error)
    return null
  }
}
```

## 常见问题

### Q: 数据不更新？

A: 检查以下几点：
- 确认是否点击了"刷新数据"按钮
- 检查localStorage是否正常存储
- 查看浏览器控制台是否有错误

### Q: 图表不显示？

A: 可能原因：
- echarts未正确安装
- 图表容器高度为0
- option配置错误
- 浏览器不兼容

### Q: 热力图没有数据？

A: 热力图需要：
- 足够的用户行为记录
- 定期记录用户点击和停留
- 检查trackUserBehavior是否被调用

### Q: 影响力计算不准确？

A: 可以：
- 调整权重系数
- 添加更多影响因素
- 使用实际的后端数据

## 更新日志

**v1.0.0** (2026-04-13)
- ✅ 个人数据仪表板
- ✅ 文章影响力分析
- ✅ 用户行为热力图
- ✅ 统计卡片组件
- ✅ 图表组件封装
- ✅ 数据分析API
- ✅ ECharts集成

## 技术支持

如有问题或建议，请：
1. 检查浏览器控制台错误
2. 确认echarts已正确安装
3. 查看本文档的使用说明

---

**实现日期:** 2026-04-13
**版本:** v1.0.0
**状态:** ✅ 完成并测试通过
