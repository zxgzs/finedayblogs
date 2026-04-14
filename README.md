# 个人博客 🚀

一个使用 Vue 3 + TypeScript + Element Plus 构建的现代化个人博客系统。

✨ **最新优化**：性能提升 52%，包体积减少 39%，新增 SEO 优化、代码分割、错误处理等

📄 详细优化报告：[OPTIMIZATION.md](./OPTIMIZATION.md)

## 特性

- 🎨 现代化 UI 设计，响应式布局
- 📱 支持移动端、平板和桌面端
- ✍️ Markdown 文章渲染
- 🏷️ 标签分类系统
- 📁 归档功能
- 🔍 文章搜索和筛选

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **路由管理**: Vue Router 4
- **语言**: TypeScript
- **样式**: SCSS

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── data/            # 数据文件
├── router/          # 路由配置
├── styles/          # 全局样式
├── views/           # 页面组件
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 页面功能

- **首页**: 文章列表、热门标签、个人简介
- **文章详情**: Markdown 渲染、代码高亮、分享功能
- **归档**: 按年份整理的文章归档
- **关于**: 个人介绍、技术栈、联系方式

## 自定义配置

### 环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
VITE_BLOG_TITLE=晴天的博客
VITE_BLOG_AUTHOR=晴天
VITE_API_BASE_URL=https://api.example.com
```

### 修改个人信息

编辑 `src/views/About.vue` 和 `src/views/Home.vue` 中的个人信息。

### 添加新文章

在 `src/data/articles.ts` 中添加新的文章数据。

### 修改主题颜色

编辑 `src/styles/global.scss` 中的 CSS 变量。

## License

MIT License © 2026

