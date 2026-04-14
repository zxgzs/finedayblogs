export interface Plugin {
  id: number
  name: string
  description: string
  version: string
  author: string
  category: string
  icon: string
  downloads: number
  rating: number
  tags: string[]
  date: string
  featured?: boolean
  code?: string
  documentation?: string
  github?: string
  npm?: string
}

export const plugins: Plugin[] = [
  {
    id: 1,
    name: 'Vue 3 Composition API Helper',
    description: '一个强大的 Vue 3 Composition API 辅助工具，简化常用逻辑复用模式，提供自动响应式状态管理和生命周期钩子增强。',
    version: '2.5.1',
    author: '晴天',
    category: 'Vue',
    icon: '⚡',
    downloads: 15420,
    rating: 4.9,
    tags: ['Vue', 'Composition API', '工具'],
    date: '2026-04-10',
    featured: true,
    github: 'https://github.com/qingtian/vue-composition-helper',
    npm: 'https://www.npmjs.com/package/vue-composition-helper'
  },
  {
    id: 2,
    name: 'TypeScript Type Guard Generator',
    description: '自动生成 TypeScript 类型守卫的工具，通过类型定义自动创建运行时类型检查，提高代码安全性。',
    version: '1.8.3',
    author: '晴天',
    category: 'TypeScript',
    icon: '📘',
    downloads: 8932,
    rating: 4.7,
    tags: ['TypeScript', '类型安全', '自动化'],
    date: '2026-04-08',
    featured: true
  },
  {
    id: 3,
    name: 'React Hooks Utility Kit',
    description: 'React Hooks 工具包集合，包含大量实用的自定义 Hooks，涵盖状态管理、表单处理、网络请求等常见场景。',
    version: '3.2.0',
    author: '晴天',
    category: 'React',
    icon: '⚛️',
    downloads: 12345,
    rating: 4.8,
    tags: ['React', 'Hooks', '工具库'],
    date: '2026-04-05',
    featured: true
  },
  {
    id: 4,
    name: 'CSS Grid Layout Builder',
    description: '可视化 CSS Grid 布局构建器，通过拖拽方式快速生成响应式网格布局代码。',
    version: '1.4.2',
    author: '晴天',
    category: 'CSS',
    icon: '🎨',
    downloads: 6789,
    rating: 4.6,
    tags: ['CSS', 'Grid', '可视化'],
    date: '2026-04-02'
  },
  {
    id: 5,
    name: 'Markdown to Vue Component',
    description: '将 Markdown 文件转换为 Vue 组件的工具，支持代码高亮、自定义样式和主题配置。',
    version: '2.1.0',
    author: '晴天',
    category: '工具',
    icon: '📝',
    downloads: 5678,
    rating: 4.5,
    tags: ['Markdown', 'Vue', '转换'],
    date: '2026-03-28'
  },
  {
    id: 6,
    name: 'Auto Import Extension',
    description: 'VS Code 扩展，自动导入 JavaScript/TypeScript 模块，智能识别并添加导入语句。',
    version: '1.9.5',
    author: '晴天',
    category: 'VS Code',
    icon: '🔌',
    downloads: 8901,
    rating: 4.8,
    tags: ['VS Code', '自动化', '导入'],
    date: '2026-03-25'
  },
  {
    id: 7,
    name: 'Vite Plugin SVG Icons',
    description: 'Vite 插件，将 SVG 图标自动导入为 Vue 组件，支持 Tree-shaking 和按需加载。',
    version: '2.3.1',
    author: '晴天',
    category: 'Vite',
    icon: '🖼️',
    downloads: 4567,
    rating: 4.7,
    tags: ['Vite', 'SVG', '图标'],
    date: '2026-03-20'
  },
  {
    id: 8,
    name: 'API Mock Server',
    description: '轻量级 API 模拟服务器，基于配置文件快速生成模拟接口，支持数据持久化和自定义响应。',
    version: '1.5.0',
    author: '晴天',
    category: '开发工具',
    icon: '🔧',
    downloads: 3456,
    rating: 4.4,
    tags: ['API', 'Mock', '开发'],
    date: '2026-03-15'
  }
]

export const pluginCategories = [
  { name: 'Vue', icon: '⚡', count: plugins.filter(p => p.category === 'Vue').length },
  { name: 'React', icon: '⚛️', count: plugins.filter(p => p.category === 'React').length },
  { name: 'TypeScript', icon: '📘', count: plugins.filter(p => p.category === 'TypeScript').length },
  { name: 'CSS', icon: '🎨', count: plugins.filter(p => p.category === 'CSS').length },
  { name: 'Vite', icon: '🚀', count: plugins.filter(p => p.category === 'Vite').length },
  { name: '工具', icon: '🔧', count: plugins.filter(p => p.category === '工具').length },
  { name: 'VS Code', icon: '🔌', count: plugins.filter(p => p.category === 'VS Code').length },
  { name: '开发工具', icon: '🛠️', count: plugins.filter(p => p.category === '开发工具').length }
]

export const featuredPlugins = plugins.filter(p => p.featured)
