export interface Article {
  id: number
  title: string
  summary: string
  content: string
  date: string
  category: string
  tags: string[]
  views: number
  likes: number
  collects: number
  author: string
  isTop?: boolean
}

export interface Comment {
  id: number
  articleId: number
  author: string
  content: string
  date: string
  avatar: string
  parentId?: number
}

const storedComments = localStorage.getItem('blog_comments')
export const comments: Comment[] = storedComments ? JSON.parse(storedComments) : [
  {
    id: 1,
    articleId: 1,
    author: '前端新手',
    content: '写得真好！Composition API 终于讲清楚了，感谢博主！',
    date: '2026-04-09 10:30',
    avatar: '前'
  },
  {
    id: 2,
    articleId: 1,
    author: 'Vue开发者',
    content: '期待更多 Vue 3 相关的高级教程',
    date: '2026-04-09 14:20',
    avatar: 'V'
  }
]

export const saveComments = () => {
  localStorage.setItem('blog_comments', JSON.stringify(comments))
}

export const articles: Article[] = [
  {
    id: 1,
    title: 'Vue 3 Composition API 完全指南',
    summary: '深入理解 Vue 3 的 Composition API，包括响应式系统、生命周期钩子、依赖注入等核心概念，以及如何在实际项目中最佳实践。',
    content: `
# Vue 3 Composition API 完全指南

Vue 3 引入了全新的 Composition API，这是一个改变游戏规则的特性，让我们能够更灵活地组织组件逻辑。

## 什么是 Composition API？

Composition API 是一组基于函数的 API，允许我们使用导入的函数来组合组件逻辑，而不是依赖选项式 API 来组织代码。

## 核心概念

### 1. 响应式系统

Vue 3 提供了一些函数来创建响应式状态：

\`\`\`javascript
import { ref, reactive, computed } from 'vue'

// 基础类型使用 ref
const count = ref(0)
const message = ref('Hello')

// 对象类型使用 reactive
const state = reactive({
  name: 'Vue',
  version: '3.0'
})

// 计算属性
const doubled = computed(() => count.value * 2)
\`\`\`

### 2. 生命周期钩子

在 Composition API 中，生命周期钩子需要在 setup 函数中调用：

\`\`\`javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

setup() {
  onMounted(() => {
    console.log('组件已挂载')
  })
  
  onUnmounted(() => {
    console.log('组件已卸载')
  })
}
\`\`\`

### 3. 依赖注入

使用 provide 和 inject 在组件树中传递数据：

\`\`\`javascript
import { provide, inject } from 'vue'

// 父组件
setup() {
  const theme = ref('dark')
  provide('theme', theme)
}

// 子组件
setup() {
  const theme = inject('theme')
  console.log(theme.value)
}
\`\`\`

## 最佳实践

1. **逻辑复用**：使用 composables 函数封装可复用的逻辑
2. **代码组织**：按功能而非选项类型组织代码
3. **类型安全**：充分利用 TypeScript 的类型推断

## 总结

Composition API 提供了更灵活的代码组织方式，让我们能够更好地复用逻辑，构建更易维护的应用程序。
    `,
    date: '2026-04-08',
    category: '前端开发',
    tags: ['Vue', 'JavaScript', '前端'],
    views: 1234,
    likes: 89,
    collects: 45,
    author: '晴天',
    isTop: true
  },
  {
    id: 2,
    title: 'TypeScript 高级类型技巧',
    summary: '掌握 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等，让你的代码更加类型安全和可维护。',
    content: `
# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，掌握高级类型技巧可以让我们编写更加类型安全的代码。

## 泛型

泛型让我们能够创建可复用的组件，同时保持类型安全：

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

// 使用泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

## 条件类型

条件类型根据其他类型来推断类型：

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T

type ExtractPromise<T> = T extends Promise<infer U> ? U : T
\`\`\`

## 映射类型

映射类型让我们可以批量转换类型：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}
\`\`\`

## 总结

掌握这些高级类型技巧，可以让我们更好地利用 TypeScript 的类型系统，编写出更加健壮的代码。
    `,
    date: '2026-04-05',
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    views: 892,
    likes: 56,
    collects: 23,
    author: '晴天'
  },
  {
    id: 3,
    title: 'Node.js 性能优化实战',
    summary: '深入探讨 Node.js 应用的性能优化策略，包括内存管理、事件循环优化、缓存策略等实用技巧。',
    content: `
# Node.js 性能优化实战

Node.js 以其高性能著称，但不当的使用方式可能导致性能问题。本文将介绍一些实用的性能优化技巧。

## 1. 内存管理

监控内存使用，避免内存泄漏：

\`\`\`javascript
// 定期检查内存使用
setInterval(() => {
  const used = process.memoryUsage()
  console.log(\`内存使用: \${Math.round(used.heapUsed / 1024 / 1024)}MB\`)
}, 10000)
\`\`\`

## 2. 事件循环优化

避免阻塞事件循环：

\`\`\`javascript
// 使用 setImmediate 分解长任务
function processLongTask() {
  // 处理一批数据
  process.nextTick(() => {
    // 继续处理下一批
  })
}
\`\`\`

## 3. 缓存策略

合理使用缓存提高性能：

\`\`\`javascript
const cache = new Map()

function getCachedData(key) {
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key))
  }
  return fetchData(key).then(data => {
    cache.set(key, data)
    return data
  })
}
\`\`\`

## 总结

性能优化是一个持续的过程，需要结合具体场景进行分析和改进。
    `,
    date: '2026-04-02',
    category: '后端开发',
    tags: ['Node.js', '后端', '性能优化'],
    views: 756,
    likes: 42,
    collects: 18,
    author: '晴天'
  },
  {
    id: 4,
    title: 'CSS Grid 和 Flexbox 布局对比',
    summary: '详细对比 CSS Grid 和 Flexbox 两种布局方式的使用场景、优缺点，以及如何根据项目需求选择合适的布局方案。',
    content: `
# CSS Grid 和 Flexbox 布局对比

CSS Grid 和 Flexbox 是现代 CSS 布局的两大支柱，它们各有优势。

## Flexbox 适用场景

Flexbox 适合一维布局：

- 导航栏
- 卡片内部布局
- 表单元素排列
- 垂直居中

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Grid 适用场景

Grid 适合二维布局：

- 页面整体布局
- 相册网格
- 数据表格
- 仪表盘

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

## 配合使用

实际项目中，通常需要配合使用两者：

\`\`\`css
/* Grid 定义整体布局 */
.page {
  display: grid;
  grid-template-columns: 1fr 300px;
}

/* Flexbox 定义组件内部布局 */
.card {
  display: flex;
  flex-direction: column;
}
\`\`\`

## 总结

没有绝对的优劣，根据具体场景选择合适的布局方式才是最佳实践。
    `,
    date: '2026-03-28',
    category: 'CSS',
    tags: ['CSS', '布局', '前端'],
    views: 1023,
    likes: 67,
    collects: 31,
    author: '晴天'
  },
  {
    id: 5,
    title: 'Docker 容器化部署指南',
    summary: '学习如何使用 Docker 容器化你的应用，包括 Dockerfile 编写、Docker Compose 编排、以及生产环境部署最佳实践。',
    content: `
# Docker 容器化部署指南

Docker 已经成为现代应用部署的标准工具，本文将带你入门 Docker 的使用。

## 基本概念

- **镜像 (Image)**：应用的只读模板
- **容器 (Container)**：镜像的运行实例
- **仓库 (Registry)**：存储和分发镜像的服务

## Dockerfile 示例

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Docker Compose

用于定义和运行多容器应用：

\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  db:
    image: postgres:14
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
\`\`\`

## 最佳实践

1. 使用多阶段构建减小镜像体积
2. 不要在镜像中存储敏感信息
3. 使用 .dockerignore 排除不需要的文件
4. 及时清理不必要的缓存

## 总结

Docker 简化了应用的部署和扩展，是现代开发流程中不可或缺的工具。
    `,
    date: '2026-03-25',
    category: 'DevOps',
    tags: ['Docker', 'DevOps', '容器化'],
    views: 645,
    likes: 38,
    collects: 15,
    author: '晴天'
  },
  {
    id: 6,
    title: 'React Hooks 深入理解',
    summary: '全面解析 React Hooks 的使用技巧和最佳实践，包括 useState、useEffect、useCallback、useMemo 等常用钩子。',
    content: `
# React Hooks 深入理解

React Hooks 是 React 16.8 引入的新特性，它让我们能够在函数组件中使用 state 和其他 React 特性。

## useState

\`\`\`jsx
const [count, setCount] = useState(0)

// 函数式更新
setCount(prev => prev + 1)
\`\`\`

## useEffect

\`\`\`jsx
useEffect(() => {
  // 副作用逻辑
  document.title = \`计数: \${count}\`
  
  return () => {
    // 清理逻辑
  }
}, [count]) // 依赖数组
\`\`\`

## useCallback 和 useMemo

\`\`\`jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
\`\`\`

## 自定义 Hook

\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return size
}
\`\`\`
    `,
    date: '2026-03-20',
    category: '前端开发',
    tags: ['React', 'Hooks', '前端'],
    views: 534,
    likes: 29,
    collects: 12,
    author: '晴天'
  }
]

  // ========== 爆款文章：ECharts数据大屏 ==========
  {
    id: 7,
    title: '前端如何用ECharts做出老板夸爆的数据大屏？（附源码）',
    summary: '从零搭建一个SCADA级别的数据可视化大屏，涵盖ECharts核心图表、自适应布局方案、数字滚动特效、边框装饰组件等实战技巧。基于真实项目经验，附完整可运行源码。',
    content: `
# 前端如何用ECharts做出老板夸爆的数据大屏？（附源码）

> 做过一个真实的 SCADA 数据大屏项目后，我总结了一套**从零到上线**的完整方法论。今天全部分享给你，文末附源码。

![数据大屏效果示意](https://img.shields.io/badge/技术栈-Vue3%20%2B%20ECharts%20%2B%20TS-blue?style=for-the-badge)

## 为什么写这篇文章？

市面上的 ECharts 教程大多停留在"画一个柱状图"的阶段。但真正的工作场景中，老板和客户想要的是这种：

- 🔥 **酷炫的视觉效果** — 渐变、发光、粒子背景
- 📊 **多图表联动** — 点击地图，其他图表跟着变
- 🖥️ **大屏自适应** — 投影仪、拼接屏都能完美展示
- ⚡ **实时数据刷新** — WebSocket 推送，数字跳动

这些东西，官方文档讲得少，网上碎片化教程又不系统。**本文一次讲透。**

---

## 第一章：大屏设计规范（很多人第一步就错了）

### 1.1 分辨率选择

\`\`\`
标准大屏分辨率：1920 × 1080（16:9）
拼接屏常见：3840 × 2160 / 5760 × 2160
适配策略：设计稿按 1920×1080，运行时 scale 缩放
\`\`\`

### 1.2 配色方案

数据大屏不是越花哨越好。成熟的配色就这几套：

\`\`\`css
/* 深色科技风（推荐） */
--bg-primary: #0a1a3a;
--bg-secondary: #0d213b;
--border-color: #1a3a5c;
--text-primary: #e0f0ff;
--text-secondary: #8ab4d8;
--accent-cyan: #00d4ff;
--accent-blue: #0078ff;
--accent-gold: #ffc107;

/* 关键原则：
   1. 背景深色（减少视觉疲劳 + 突出图表）
   2. 强调色不超过3种
   3. 文字对比度要够（WCAG AA标准）
*/
\`\`\`

---

## 第二章：ECharts 核心图表实战

### 2.1 酷炫柱状图（渐变 + 圆角 + 发光）

这是大屏中最常用的图表类型，但默认样式太朴素了：

\`\`\`typescript
import * as echarts from 'echarts'

const barOption = {
  grid: { top: 40, right: 20, bottom: 30, left: 50 },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月'],
    axisLine: { lineStyle: { color: '#1a3a5c' } },
    axisLabel: { color: '#8ab4d8', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#1a3a5c', type: 'dashed' } },
    axisLabel: { color: '#8ab4d8' }
  },
  series: [{
    type: 'bar',
    barWidth: 20,
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#00d4ff' },    // 顶部亮青色
        { offset: 1, color: '#0078ff' }     // 底部深蓝色
      ]),
      shadowColor: 'rgba(0, 212, 255, 0.3)',
      shadowBlur: 10
    },
    data: [320, 450, 380, 520, 490, 610],
    animationDelay: (idx: number) => idx * 100  // 逐个动画
  }]
}
\`\`\`

**关键技巧：**
- \`LinearGradient\` 让柱子有质感（比纯色高级10倍）
- \`shadowBlur\` 制造发光效果（科技感来源）
- \`animationDelay\` 让柱子依次升起（动感十足）

### 2.2 环形进度图（大屏KPI标配）

每个大屏都有几个核心 KPI 指标，环形图是最佳展示方式：

\`\`\`typescript
const gaugeOption = {
  series: [{
    type: 'pie',
    radius: ['65%', '80%'],       // 环形：内半径 + 外半径
    startAngle: 90,
    silent: true,                  // 不响应鼠标事件
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#00d4ff' },
        { offset: 1, color: '#0078ff' }
      ])
    },
    label: {
      show: true,
      position: 'center',
      formatter: () => \`{value|85.6%}\\n{name|完成率}\`,
      rich: {
        value: { fontSize: 28, fontWeight: 'bold', color: '#e0f0ff', lineHeight: 36 },
        name: { fontSize: 12, color: '#8ab4d8', lineHeight: 20 }
      }
    },
    data: [
      { value: 85.6, name: '完成率' },
      { value: 14.4, name: '剩余', itemStyle: { color: '#1a3a5c' } }
    ]
  }]
}
\`\`\`

### 2.3 折线面积图（趋势数据的最佳表达）

\`\`\`typescript
const lineOption = {
  grid: { top: 30, right: 20, bottom: 30, left: 45 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    axisLine: { lineStyle: { color: '#1a3a5c' } },
    axisLabel: { color: '#8ab4d8' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#1a3a5c', type: 'dashed' } },
    axisLabel: { color: '#8ab4d8' }
  },
  series: [{
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: 2, color: '#00d4ff' },
    itemStyle: { color: '#00d4ff' },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
        { offset: 1, color: 'rgba(0, 212, 255, 0)' }
      ])
    },
    data: [120, 280, 250, 350, 290, 420]
  }]
}
\`\`\`

---

## 第三章：大屏幕自适应（最关键的一环）

这是**最多人踩坑的地方**。大屏要投在各种尺寸的屏幕上：

### 3.1 scale 方案（推荐✅）

\`\`\`typescript
// composables/useScreenScale.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenScale(designWidth = 1920, designHeight = 1080) {
  const scale = ref(1)
  const screenRef = ref<HTMLElement>()

  const resize = () => {
    if (!screenRef.value) return
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // 计算缩放比例（保持宽高比）
    const scaleX = screenWidth / designWidth
    const scaleY = screenHeight / designHeight
    scale.value = Math.min(scaleX, scaleY)  // 取较小值，保证完整显示
    
    // 应用变换
    screenRef.value.style.transform = \`scale(\${scale.value})\`
    screenRef.value.style.transformOrigin = 'top left'
    screenRef.value.style.width = \`\${designWidth}px\`
    screenRef.value.style.height = \`\${designHeight}px\`
  }

  onMounted(() => {
    resize()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })

  return { scale, screenRef }
}

// 使用方式
// <div ref="screenRef" class="screen-container">
//   ... 你的大屏内容 ...
// </div>
\`\`\`

### 3.2 rem 方案（备选）

如果不需要严格保持比例，rem 更灵活：

\`\`\`typescript
// 设置根字体大小
function setRem() {
  const html = document.documentElement
  const width = html.clientWidth
  // 设计稿宽度 1920px 对应 html font-size: 100px
  html.style.fontSize = \`${(width / 1920) * 100}px\`
}
\`\`\`

**两种方案对比：**

| | scale方案 | rem方案 |
|--|---------|--------|
| 宽高比 | ✅ 严格保持 | ❌ 可能变形 |
| 字体模糊 | ⚠️ 极端比例时 | ✅ 始终清晰 |
| 开发体验 | ✅ 按固定像素写 | ⚠️ 要转rem单位 |
| 适用场景 | 大屏/展示屏 | 后台管理系统 |

---

## 第四章：数字滚动 & 特效组件

大屏没有动画就没有灵魂。

### 4.1 数字滚动效果

\`\`\`vue
<!-- components/NumberRoll.vue -->
<template>
  <span class="number-roll">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  value: number
  duration?: number  // 动画时长(ms)
}

const props = withDefaults(defineProps<Props>(), { duration: 1500 })

const displayValue = ref(0)

function animateNumber(target: number) {
  const startTime = Date.now()
  const startValue = displayValue.value
  
  const step = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // easeOutExpo 缓动函数 — 快速启动，缓慢结束
    const easeProgress = progress === 1 
      ? 1 
      : 1 - Math.pow(2, -10 * progress)
    
    displayValue.value = Math.floor(
      startValue + (target - startValue) * easeProgress
    )
    
    if (progress < 1) requestAnimationFrame(step)
  }
  
  requestAnimationFrame(step)
}

watch(() => props.value, (val) => animateNumber(val), { immediate: true })
</script>

<style scoped>
.number-roll {
  font-variant-numeric: tabular-nums;  /* 等宽数字，避免抖动 */
  font-family: 'DIN Alternate', 'Roboto Mono', monospace;
  font-weight: bold;
  background: linear-gradient(180deg, #fff 0%, #8ab4d8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
\`\`\`

### 4.2 边框装饰组件

大屏的卡片不能是普通的矩形框，要有科技感边框：

\`\`\`vue
<!-- components/PanelBorder.vue -->
<template>
  <div class="panel-border">
    <!-- 四角装饰 -->
    <span class="corner corner-tl"></span>
    <span class="corner corner-tr"></span>
    <span class="corner corner-bl"></span>
    <span class="corner corner-br"></span>
    <!-- 标题栏 -->
    <div v-if="title" class="panel-title">
      <span class="title-decoration"></span>
      {{ title }}
    </div>
    <!-- 内容区 -->
    <div class="panel-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.panel-border {
  position: relative;
  background: rgba(10, 42, 74, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  backdrop-filter: blur(10px);
}

/* 四角 L 型装饰 */
.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #00d4ff;
  border-style: solid;
}
.corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

/* 标题栏 */
.panel-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #e0f0ff;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}
.title-decoration {
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, #00d4ff, #0078ff);
  border-radius: 2px;
}
.panel-content {
  padding: 16px;
}
</style>
\`\`\`

---

## 第五章：Vue3 封装可复用的图表组件

别每次都重复写初始化代码：

\`\`\`typescript
// composables/useChart.ts
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import * as echarts from 'echarts'

export function useChart<T>(
  chartRef: Ref<HTMLElement | undefined>,
  optionGetter: () => T,
  autoResize = true
) {
  let chart: echarts.ECharts | null = null

  const initChart = () => {
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value, 'dark')
    chart.setOption(optionGetter())
  }

  const updateChart = () => {
    if (!chart) return
    chart.setOption(optionGetter(), true)  // notMerge: false，合并更新
  }

  // 监听窗口变化
  const handleResize = () => chart?.resize()

  onMounted(() => {
    initChart()
    if (autoResize) window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    chart?.dispose()
    chart = null
  })

  // 支持外部响应式更新
  watch(optionGetter, updateChart, { deep: true })

  return { chart, updateChart }
}
\`\`\`

使用起来非常简洁：

\`\`\`vue
<template>
  <div ref="barRef" style="width:100%;height:300px"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChart } from '@/composables/useChart'

const barRef = ref<HTMLElement>()

// 响应式的 option — 数据变化自动重绘！
const barOption = ref({
  // ... 你的 ECharts 配置
})

useChart(barRef, () => barOption.value)
</script>
\`\`\`

---

## 第六章：完整大屏布局示例

把所有东西组合起来：

\`\`\`vue
<!-- views/Dashboard.vue -->
<template>
  <div ref="screenRef" class="dashboard-screen">
    <!-- 顶部标题栏 -->
    <header class="dash-header">
      <span class="logo">🏢 智能运维数据中心</span>
      <span class="datetime">{{ currentTime }}</span>
    </header>

    <!-- 主体内容 -->
    <main class="dash-body">
      <!-- 左侧面板 -->
      <aside class="dash-left">
        <PanelBorder title="月度销售趋势">
          <div ref="lineRef" class="chart-box"></div>
        </PanelBorder>
        <PanelBorder title="产品分类占比">
          <div ref="pieRef" class="chart-box"></div>
        </PanelBorder>
      </aside>

      <!-- 中间主区域 -->
      <section class="dash-center">
        <PanelBorder title="核心指标">
          <div class="kpi-row">
            <KpiCard title="总营收" :value="1284567" prefix="¥" />
            <KpiCard title="活跃用户" :value="89432" />
            <KpiCard title="转化率" :value="23.56" suffix="%" />
            <KpiCard title="订单量" :value="12459" />
          </div>
        </PanelBorder>
        <!-- 地图或其他中心图表 -->
      </section>

      <!-- 右侧面板 -->
      <aside class="dash-right">
        <PanelBorder title="区域销量排行">
          <div ref="barRef" class="chart-box"></div>
        </PanelBorder>
        <PanelBorder title="完成率">
          <div ref="gaugeRef" class="chart-box"></div>
        </PanelBorder>
      </aside>
    </main>
  </div>
</template>
\`\`\`

---

## 第七章：性能优化（大数据量的坑）

当数据量大时（几千个点），ECharts 会卡：

\`\`\`typescript
// 方案1：开启渲染优化（最重要！）
chart.setOption({
  series: [{
    type: 'line',
    progressive: 200,       // 分片渲染，每200个点一帧
    progressiveThreshold: 500  // 超过500个点才启用分片
  }]
})

// 方案2：大数据量用 canvas 模式（默认就是canvas）
// 但如果需要交互多，SVG反而更快

// 方案3：数据采样 — 显示聚合后的数据
function sampleData(data: number[], maxPoints = 500): number[] {
  if (data.length <= maxPoints) return data
  const step = data.length / maxPoints
  return Array.from({ length: maxPoints }, (_, i) =>
    data[Math.floor(i * step)]
  )
}

// 方案4：节流防抖 resize
import { throttle } from '@vueuse/core'
window.addEventListener('resize', throttle(() => chart?.resize(), 200))
\`\`\`

---

## 总结 & 完整清单

做一个数据大屏，你实际需要的东西：

\`\`\`
✅ ECharts 核心图表（柱状图/折线图/饼图/地图/散点图）
✅ 自适应布局（scale 或 rem）
✅ 数字滚动动画（easeOutExpo缓动）
✅ 科技风边框装饰（四角L型 + 渐变标题栏）
✅ Vue3 组件封装（useChart composable）
✅ 配色方案（深色背景 + 青/蓝/金强调色）
✅ 性能优化（progressive渲染 + 节流resize）
✅ WebSocket 实时数据对接
\`\`\`

---

## 下一步？

如果你想要：
- 🗺️ **地图可视化**（GeoJSON、热力图、飞线）— 评论区扣 1
- 🎨 **更多特效**（扫描线、粒子背景、故障闪烁）— 扣 2
- 📦 **完整源码**（本文所有代码打包下载）— 扣 3
- 🔥 **3D大屏**（ECharts GL + Three.js 效果）— 扣 4

---

> 👋 我是晴天，专注 Vue3 + ECharts 数据可视化开发。  
> 如果你正在做大屏项目，有任何问题欢迎评论区交流~  
> **博客：[fineday.vip](https://fineday.vip)** | 掘金/CSDN同名
    `,
    date: '2026-04-17',
    category: '数据可视化',
    tags: ['ECharts', 'Vue3', '数据大屏', 'TypeScript', '可视化'],
    views: 0,
    likes: 0,
    collects: 0,
    author: '晴天',
    isTop: true
  },
  {
    id: 8,
    title: 'Vue3 封装 ECharts 组件：一次编写到处复用',
    summary: '告别每次手写init和resize，用Composable模式打造一套优雅的ECharts组件体系。支持响应式数据更新、自动销毁、主题切换。',
    content: `
# Vue3 封装 ECharts 组件：一次编写到处复用

在上一篇文章中，我们做了一个完整的数据大屏。有同学问："每次都写一堆 init/setOption/resize 太麻烦了，有没有更优雅的方式？"

当然有。今天教你用 Vue3 的 Composition API 把 ECharts **彻底封装好**，以后写新图表只需关注数据本身。

## 我们要解决的问题

传统写法的痛点：

\`\`\`typescript
// ❌ 每次都要写的样板代码
onMounted(() => {
  const dom = document.getElementById('chart')
  chart = echarts.init(dom)
  chart.setOption(option)
  window.addEventListener('resize', () => chart?.resize())
})
onUnmounted(() => {
  window.removeEventListener('resize', ...)
  chart?.dispose()
})
// 数据变了还要手动调用 chart.setOption()
\`\`\`

如果一个页面有 5 个图表？写 5 遍？不可能的。

## Composable 方案设计

### 核心 useChart

\`\`\`typescript
// composables/useChart.ts
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

export interface UseChartOptions {
  theme?: object | string   // ECharts 主题
  autoResize?: boolean     // 是否监听窗口变化
  renderer?: 'canvas' | 'svg'  // 渲染器
}

export function useChart(
  chartRef: Ref<HTMLElement | undefined>,
  options: UseChartOptions = {}
) {
  const {
    theme = 'dark',
    autoResize = true,
    renderer = 'canvas'
  } = options

  let instance: echarts.ECharts | null = null
  let currentOption: EChartsOption = {}

  /** 初始化 */
  const init = () => {
    if (!chartRef.value || instance) return
    instance = echarts.init(chartRef.value, theme, { renderer })
  }

  /** 设置配置项 */
  const setOption = (option: EChartsOption, merge = false) => {
    currentOption = merge && currentOption 
      ? { ...currentOption, ...option } 
      : option
    instance?.setOption(currentOption, false)
  }

  /** 显示加载动画 */
  const showLoading = (text = 'loading...') =>
    instance?.showLoading('default', { text, color: 'rgba(0,0,0,0.1)' })

  /** 隐藏加载动画 */
  const hideLoading = () => instance?.hideLoading()

  /** 手动调整大小 */
  const resize = () => instance?.resize()

  /** 获取实例（高级用法） */
  const getInstance = () => instance

  /** 生命周期管理 */
  onMounted(init)
  
  if (autoResize) {
    onMounted(() => {
      window.addEventListener('resize', resize)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', resize)
      instance?.dispose()
      instance = null
    })
  }

  return { init, setOption, showLoading, hideLoading, resize, getInstance }
}
\`\`\`

### 通用图表组件

\`\`\`vue
<!-- components/BaseChart.vue -->
<template>
  <div ref="chartRef" class="base-chart" :style="{ width, height }" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChart } from '@/composables/useChart'

interface Props {
  option: Record<string, any>
  width?: string
  height?: string
  theme?: object | string
  renderer?: 'canvas' | 'svg'
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  renderer: 'canvas'
})

const chartRef = ref<HTMLElement>()

const { setOption, resize } = useChart(chartRef, {
  theme: props.theme,
  renderer: props.renderer
})

// 监听外部 option 变化 → 自动更新图表
watch(
  () => props.option,
  (newOption) => setOption(newOption),
  { deep: true, immediate: true }
)

// 暴露方法给父组件
defineExpose({ resize })
</script>

<style scoped>
.base-chart {
  min-height: 200px;
}
</style>
\`\`\`

## 使用示例

封装完之后，使用变得极其简单：

\`\`\`vue
<template>
  <BaseChart :option="barOption" height="300px" />
  <BaseChart :option="lineOption" height="300px" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const barOption = reactive({
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }]
})

// 数据变化 → 图表自动更新
setTimeout(() => {
  barOption.series[0].data = [300, 400, 250]  // 自动触发 watch
}, 2000)
</script>
\`\`\`

**就这么简单。** 不需要手动 init、setOption、resize、dispose——全帮你搞定了。

## 进阶：带类型提示的专用组件

如果你想要更好的 IDE 支持，可以为每种图表类型创建专用组件：

\`\`\`vue
<!-- components/BarChart.vue -->
<script setup lang="ts">
import BaseChart from './BaseChart.vue'
import type { BarSeriesOption } from 'echarts/charts'
import { computed } from 'vue'

interface BarProps {
  xAxisData: string[]
  seriesData: BarSeriesOption[]
  title?: string
}

const props = defineProps<BarProps>()

const option = computed(() => ({
  title: { text: props.title },
  tooltip: { trigger: 'axis' },
  grid: { top: 40, right: 20, bottom: 30, left: 50 },
  xAxis: { type: 'category', data: props.xAxisData },
  yAxis: { type: 'value' },
  series: props.seriesData
}))
</script>

<template>
  <BaseChart :option="option" />
</template>
\`\`\`

这样用的时候连 option 都不用拼了：

\`\`\`vue
<BarChart
  :x-axis-data="['一月', '二月', '三月']"
  :series-data="[{ type: 'bar', data: [320, 450, 380] }]"
  title="月度销售"
/>
\`\`\`

## 下期预告

下一篇我们聊**大屏的自适应方案深度对比**：scale vs rem vs vw/vh，到底选哪个？不同场景的最佳实践。
    `,
    date: '2026-04-18',
    category: '前端开发',
    tags: ['Vue3', 'ECharts', '组件封装', 'CompositionAPI'],
    views: 0,
    likes: 0,
    collects: 0,
    author: '晴天'
  },
  {
    id: 9,
    title: '数据大屏 1920 自适应方案：scale vs rem vs vw 全方位对比',
    summary: '数据大屏投放到不同尺寸屏幕时总会变形？本文深入对比三种主流自适应方案的原理、优缺点和适用场景，并给出最佳实践建议。',
    content: `
# 数据大屏 1920 自适应方案：scale vs rem vs vw 全方位对比

做数据大屏最头疼的问题之一：**设计稿 1920×1080，投影仪是 1366×768，拼接屏是 5760×2160……怎么做到都不变形？**

今天我把三种主流方案全部实现一遍，告诉你哪个最适合你的场景。

## 方案一：CSS transform scale（⭐ 推荐）

### 原理

\`\`\`
设计稿固定为 1920×1080 → 计算当前屏幕与设计稿的比例 → transform: scale(比例)
\`\`\`

### 实现

\`\`\`typescript
// composables/useScreenScale.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenScale(
  designW = 1920, 
  designH = 1080,
  mode: 'contain' | 'cover' = 'contain'
) {
  const containerRef = ref<HTMLElement>()

  const resize = () => {
    const el = containerRef.value
    if (!el) return

    const { clientWidth: cw, clientHeight: ch } = document.documentElement
    const scaleX = cw / designW
    const scaleY = ch / designH

    let scale: number
    if (mode === 'contain') {
      scale = Math.min(scaleX, scaleY)  // 完整显示，可能有留白
    } else {
      scale = Math.max(scaleX, scaleY)  // 铺满，可能被裁切
    }

    el.style.transform = \`scale(\${scale})\`
    el.style.transformOrigin = 'top left'
    el.style.width = \`\${designW}px\`
    el.style.height = \`\${designH}px\`
  }

  onMounted(() => {
    resize()
    window.addEventListener('resize', resize)
  })
  onUnmounted(() => window.removeEventListener('resize', resize))

  return { containerRef }
}
\`\`\`

### 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 开发体验好（直接按设计稿像素写） | ⚠️ 极端比例下可能有留白或裁剪 |
| ✅ 宽高比严格保持 | ⚠️ 小比例时文字可能模糊 |
| ✅ 改造成本最低 | ⚠️ devtools 调试时坐标对不上 |

### 适用场景

**数据可视化大屏、展示屏、投屏演示**

---

## 方案二：rem 动态根字号

### 原理

\`\`\`
根据屏幕宽度动态设置 html 的 font-size → 所有单位用 rem → 自动缩放
\`\`\`

### 实现

\`\`\`typescript
// utils/rem.ts
const DESIGN_WIDTH = 1920

export function initRem(designWidth = DESIGN_WIDTH) {
  const setRem = () => {
    const html = document.documentElement
    const width = html.clientWidth
    // 1920px → html font-size = 100px
    // 那么 1rem = 设计稿上的 100px
    // 设计稿 20px 字体 → 0.2rem
    html.style.fontSize = \`${(width / designWidth) * 100}px\`
  }

  setRem()
  window.addEventListener('resize', setRem)
  return () => window.removeEventListener('resize', setRem)
}

// 在 main.ts 中调用
import { initRem } from './utils/rem'
initRem()
\`\`\`

配合 PostCSS 自动转换 px → rem：

\`\`\`js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-pxtorem')({
      rootValue: 100,        // 1rem = 100px
      unitPrecision: 4,
      propList: ['*'],
      selectorBlackList: ['.no-rem']  // 排除的类名
    })
  ]
}
\`\`\`

### 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 始终清晰（不依赖 scale） | ❌ 宽高比不保（窄屏会被压扁）|
| ✅ 移动端通用方案 | ⚠️ 需要 postcss 构建 |
| ✅ 字体始终锐利 | ⚠️ 高度方向需额外处理 |

### 适用场景

**后台管理系统、中后台应用、需要兼顾移动端的页面**

---

## 方案三：vw/vh 视口单位

### 原理

\`\`\`
1vw = 屏幕宽度的 1%，1vh = 屏幕高度的 1%
直接用视口单位替代 px
\`\`\`

### 使用

\`\`\`css
.container {
  width: 100vw;
  height: 100vh;
  padding: 1vh 2vw;   /* 相对于视口 */
  font-size: 1vw;    /* 字体也跟随 */
}
\`\`\`

同样可以配 PostCSS 插件自动转换。

### 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 无需 JS 运行时计算 | ❌ 同样不保宽高比 |
| ✅ CSS 原生支持 | ⚠️ 小屏幕上字太小 |
| ✅ 简单直接 | ⚠️ 兼容性极老浏览器有问题 |

### 适用场景

** Landing Page、简单展示页、移动端优先的项目**

---

## 三方案终极对比

| 维度 | scale | rem | vw/vh |
|------|-------|-----|-------|
| **宽高比保持** | ✅ 完美保持 | ❌ 不保持 | ❌ 不保持 |
| **清晰度** | ⚠️ 极端情况模糊 | ✅ 始终清晰 | ✅ 始终清晰 |
| **开发效率** | ✅ 最高（直接写 px） | ⚠️ 需转换 | ⚠️ 需转换 |
| **改造难度** | ✅ 只包一层容器 | ⚠️ 全项目改单位 | ⚠️ 全项目改单位 |
| **移动端兼容** | ❌ 不适合 | ✅ 适合 | ✅ 适合 |
| **调试体验** | ⚠️ 坐标偏移 | ✅ 正常 | ✅ 正常 |

## 我的建议

\`\`\`
做数据大屏 → 用 scale（必须保宽高比）
做后台系统 → 用 rem（成熟稳定）
做落地页/H5 → 用 vw/vh（简单快捷）

如果不确定 → scale 最省心
\`\`\`

在实际项目中，我的做法是：**大屏主体用 scale 包裹，内部的管理弹窗/侧边栏用 rem/vw**，两者结合，取长补短。
    `,
    date: '2026-04-19',
    category: '数据可视化',
    tags: ['自适应', '数据大屏', 'CSS', 'scale', 'rem'],
    views: 0,
    likes: 0,
    collects: 0,
    author: '晴天'
  }
]

export const hotTags = [
  { name: 'ECharts', count: 15 },
  { name: 'Vue', count: 12 },
  { name: 'TypeScript', count: 10 },
  { name: '数据大屏', count: 8 },
  { name: '数据可视化', count: 7 },
  { name: 'React', count: 8 },
  { name: 'Node.js', count: 7 },
  { name: 'CSS', count: 6 },
  { name: 'Python', count: 5 },
  { name: 'Docker', count: 4 },
  { name: 'JavaScript', count: 9 }
]

export const categories = [
  { name: '数据可视化', count: 8, icon: 'TrendCharts' },
  { name: '前端开发', count: 25, icon: 'Monitor' },
  { name: '后端开发', count: 18, icon: 'Server' },
  { name: 'DevOps', count: 12, icon: 'Cloud' },
  { name: 'TypeScript', count: 10, icon: 'Document' },
  { name: 'CSS', count: 6, icon: 'Brush' }
]
