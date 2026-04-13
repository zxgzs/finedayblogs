/**
 * 项目作品数据
 */
export interface Project {
  id: number
  title: string
  description: string
  category: string
  tech: string[]
  cover: string
  demoUrl?: string
  githubUrl?: string
  status: 'completed' | 'in-progress' | 'planned'
  featured: boolean
  createdAt: string
}

/**
 * 摄影作品数据
 */
export interface Photo {
  id: number
  title: string
  description?: string
  url: string
  thumbnail?: string
  category: string
  location?: string
  date: string
  camera?: string
  featured: boolean
}

/**
 * 视频数据
 */
export interface Video {
  id: number
  title: string
  description: string
  platform: 'bilibili' | 'youtube' | 'vimeo'
  videoId: string
  thumbnail?: string
  duration?: string
  category: string
  publishedAt: string
}

/**
 * 音频/播客数据
 */
export interface Audio {
  id: number
  title: string
  description: string
  url: string
  duration: string
  articleId?: number
  category: string
  publishedAt: string
}

// 示例项目数据
export const projects: Project[] = [
  {
    id: 1,
    title: 'Vue3 博客系统',
    description: '基于 Vue3 + TypeScript 构建的现代化博客系统，支持 Markdown 编辑、AI 摘要生成、数据可视化等功能。',
    category: 'Web 应用',
    tech: ['Vue 3', 'TypeScript', 'Vite', 'Element Plus'],
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    demoUrl: 'https://example.com/demo1',
    githubUrl: 'https://github.com/username/blog',
    status: 'completed',
    featured: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'AI 智能客服系统',
    description: '集成了自然语言处理的智能客服系统，支持多轮对话、意图识别和知识库管理。',
    category: 'AI/ML',
    tech: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    cover: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
    demoUrl: 'https://example.com/demo2',
    githubUrl: 'https://github.com/username/ai-chatbot',
    status: 'completed',
    featured: true,
    createdAt: '2024-02-20'
  },
  {
    id: 3,
    title: '数据可视化大屏',
    description: '企业级数据可视化大屏，支持实时数据更新、多图表联动和自定义主题。',
    category: '数据可视化',
    tech: ['ECharts', 'Vue 3', 'WebSocket', 'D3.js'],
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    demoUrl: 'https://example.com/demo3',
    githubUrl: 'https://github.com/username/data-viz',
    status: 'completed',
    featured: false,
    createdAt: '2024-03-10'
  },
  {
    id: 4,
    title: '移动端商城应用',
    description: '跨平台移动电商应用，支持商品浏览、购物车、订单管理和支付功能。',
    category: '移动应用',
    tech: ['React Native', 'Redux', 'Node.js', 'MongoDB'],
    cover: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    demoUrl: 'https://example.com/demo4',
    githubUrl: 'https://github.com/username/mobile-shop',
    status: 'in-progress',
    featured: false,
    createdAt: '2024-04-01'
  },
  {
    id: 5,
    title: '区块链钱包',
    description: '安全的多链数字钱包，支持资产管理和DeFi交互。',
    category: '区块链',
    tech: ['Solidity', 'Web3.js', 'Vue 3', 'ethers.js'],
    cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    githubUrl: 'https://github.com/username/crypto-wallet',
    status: 'planned',
    featured: false,
    createdAt: '2024-05-15'
  },
  {
    id: 6,
    title: '在线协作白板',
    description: '实时在线协作白板工具，支持多人同时绘图和标注。',
    category: '协作工具',
    tech: ['Canvas API', 'WebSocket', 'Node.js', 'Redis'],
    cover: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800',
    demoUrl: 'https://example.com/demo6',
    githubUrl: 'https://github.com/username/whiteboard',
    status: 'in-progress',
    featured: true,
    createdAt: '2024-06-01'
  }
]

// 示例摄影作品数据
export const photos: Photo[] = [
  {
    id: 1,
    title: '山间晨曦',
    description: '清晨的第一缕阳光洒在山间',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    category: '风景',
    location: '黄山',
    date: '2024-03-15',
    camera: 'Sony A7R4',
    featured: true
  },
  {
    id: 2,
    title: '城市夜景',
    description: '繁华都市的夜晚灯光',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
    category: '城市',
    location: '上海',
    date: '2024-04-20',
    camera: 'Canon R5',
    featured: true
  },
  {
    id: 3,
    title: '人像摄影',
    description: '自然光下的人像拍摄',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: '人像',
    date: '2024-05-10',
    camera: 'Sony A7R4',
    featured: false
  },
  {
    id: 4,
    title: '花开瞬间',
    description: '春日盛开的樱花',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    category: '花卉',
    location: '武汉大学',
    date: '2024-03-25',
    camera: 'Fujifilm X-T5',
    featured: false
  },
  {
    id: 5,
    title: '海边日落',
    description: '夕阳西下的海景',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    category: '风景',
    location: '三亚',
    date: '2024-06-05',
    camera: 'Sony A7R4',
    featured: true
  },
  {
    id: 6,
    title: '街拍瞬间',
    description: '街头的人文纪实',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    category: '街拍',
    location: '北京',
    date: '2024-04-15',
    camera: 'Leica M11',
    featured: false
  }
]

// 示例视频数据
export const videos: Video[] = [
  {
    id: 1,
    title: 'Vue3 响应式原理深度解析',
    description: '深入理解 Vue3 的响应式系统，包括 Proxy、Reactive API 和 Effect 的实现原理。',
    platform: 'bilibili',
    videoId: 'BV1xx411c7mD',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    duration: '45:30',
    category: '前端开发',
    publishedAt: '2024-03-20'
  },
  {
    id: 2,
    title: 'TypeScript 高级类型系统',
    description: '掌握 TypeScript 的高级类型，包括泛型、条件类型、映射类型等。',
    platform: 'youtube',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    duration: '38:15',
    category: '前端开发',
    publishedAt: '2024-04-10'
  },
  {
    id: 3,
    title: '微服务架构设计实践',
    description: '分享微服务架构的设计原则和实际项目中的落地经验。',
    platform: 'bilibili',
    videoId: 'BV1GJ411x7h7',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    duration: '52:40',
    category: '后端开发',
    publishedAt: '2024-05-05'
  },
  {
    id: 4,
    title: '摄影后期调色技巧',
    description: '分享人像和风景摄影的后期调色思路和技巧。',
    platform: 'youtube',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800',
    duration: '28:20',
    category: '摄影教程',
    publishedAt: '2024-06-01'
  }
]

// 示例音频数据
export const audios: Audio[] = [
  {
    id: 1,
    title: 'Vue3 博客系统 - 技术选型与架构设计',
    description: '本篇文章的音频版本，介绍了项目的技术栈选择和整体架构设计思路。',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '12:35',
    articleId: 1,
    category: '技术分享',
    publishedAt: '2024-03-15'
  },
  {
    id: 2,
    title: 'AI 辅助开发实践',
    description: '探索 AI 工具在软件开发中的应用，包括代码生成、代码审查和文档编写。',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '15:20',
    articleId: 2,
    category: 'AI 技术',
    publishedAt: '2024-04-20'
  },
  {
    id: 3,
    title: '数据可视化最佳实践',
    description: '分享数据可视化的设计原则和实现技巧，帮助你创建更清晰的数据图表。',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '18:45',
    articleId: 3,
    category: '前端开发',
    publishedAt: '2024-05-10'
  },
  {
    id: 4,
    title: '摄影心得分享 - 如何拍出好照片',
    description: '从构图、光线到后期，分享摄影的各个环节的心得体会。',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '22:10',
    category: '摄影分享',
    publishedAt: '2024-06-01'
  }
]
