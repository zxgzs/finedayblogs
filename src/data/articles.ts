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
    author: '博主',
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
    author: '博主'
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
    author: '博主'
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
    author: '博主'
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
    author: '博主'
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
    author: '博主'
  }
]

export const hotTags = [
  { name: 'Vue', count: 12 },
  { name: 'TypeScript', count: 10 },
  { name: 'React', count: 8 },
  { name: 'Node.js', count: 7 },
  { name: 'CSS', count: 6 },
  { name: 'Python', count: 5 },
  { name: 'Docker', count: 4 },
  { name: 'JavaScript', count: 9 }
]

export const categories = [
  { name: '前端开发', count: 25, icon: 'Monitor' },
  { name: '后端开发', count: 18, icon: 'Server' },
  { name: 'DevOps', count: 12, icon: 'Cloud' },
  { name: 'TypeScript', count: 10, icon: 'Document' },
  { name: 'CSS', count: 6, icon: 'Brush' }
]
