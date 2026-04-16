/**
 * SEO 组合式函数
 * 用于在 Vue 组件中快速设置 SEO
 */

import { watch, onMounted } from 'vue'
import { setArticleSEO } from '@/utils/seoGenerator'
import type { Article } from '@/data/articles'

export function useSEO(article: Article, baseUrl = 'https://fineday.vip') {
  const url = `${baseUrl}/article/${article.id}`
  const image = `${baseUrl}/images/article/${article.id}.jpg`

  onMounted(() => {
    setArticleSEO(article, url, image)
  })

  // 监听文章变化，动态更新 SEO
  watch(
    () => article,
    (newArticle) => {
      setArticleSEO(newArticle, url, image)
    },
    { deep: true }
  )

  return {
    url,
    image,
  }
}

/**
 * 为首页设置 SEO
 */
export function useHomeSEO() {
  onMounted(() => {
    document.title = '晴天的博客 - Vue 3 + TypeScript 前端技术分享'

    setMeta('description', '专注于Vue 3、TypeScript、前端开发技术分享，提供实战教程、性能优化、开发经验等高质量内容')
    setMeta('keywords', 'Vue 3, TypeScript, 前端开发, Element Plus, Vite, 前端教程, 技术博客')

    setOGMeta({
      'og:title': '晴天的博客 - Vue 3 + TypeScript 技术分享',
      'og:description': '专注于Vue 3、TypeScript、前端开发技术分享，提供实战教程、性能优化、开发经验等高质量内容',
      'og:type': 'website',
    })
  })
}

/**
 * 为归档页面设置 SEO
 */
export function useArchivesSEO() {
  onMounted(() => {
    document.title = '文章归档 | 晴天的博客'
    setMeta('description', '浏览晴天的博客所有文章归档，按年份整理，方便查找历史文章')
    setMeta('keywords', '文章归档,博客归档,文章列表')
  })
}

/**
 * 为标签页面设置 SEO
 */
export function useTagsSEO() {
  onMounted(() => {
    document.title = '标签分类 | 晴天的博客'
    setMeta('description', '浏览晴天的博客所有文章标签，按标签分类查找相关技术文章')
    setMeta('keywords', '标签分类,技术标签,文章标签')
  })
}

/**
 * 为关于页面设置 SEO
 */
export function useAboutSEO() {
  onMounted(() => {
    document.title = '关于我 | 晴天的博客'
    setMeta('description', '了解博主晴天，前端开发者，专注 Vue 3 和 TypeScript 技术分享')
    setMeta('keywords', '关于博主,个人简介,前端开发者')
  })
}

/**
 * 设置 Meta 标签
 */
const setMeta = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * 设置 OG Meta 标签
 */
const setOGMeta = (meta: Record<string, string>) => {
  Object.entries(meta).forEach(([property, content]) => {
    let element = document.querySelector(`meta[property="${property}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('property', property)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  })
}
