/**
 * SEO 工具函数
 */

export interface MetaInfo {
  title: string
  description?: string
  keywords?: string[]
  image?: string
}

/**
 * 设置页面 SEO 信息
 */
export function setPageMeta(meta: MetaInfo) {
  // 设置标题
  document.title = `${meta.title} - 晴天的博客`

  // 设置 description
  updateMetaTag('description', meta.description || '一个现代化的个人博客，分享前端开发经验和技术文章')

  // 设置 keywords
  if (meta.keywords?.length) {
    updateMetaTag('keywords', meta.keywords.join(', '))
  }

  // 设置 Open Graph
  updateMetaTag('og:title', meta.title, 'property')
  updateMetaTag('og:description', meta.description || '', 'property')
  updateMetaTag('og:type', 'article', 'property')
  
  if (meta.image) {
    updateMetaTag('og:image', meta.image, 'property')
  }

  // 设置 Twitter Card
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', meta.title)
  updateMetaTag('twitter:description', meta.description || '', 'name')
}

/**
 * 更新 meta 标签
 */
function updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attr}="${name}"]`)
  
  if (meta) {
    meta.setAttribute('content', content)
  } else {
    meta = document.createElement('meta')
    meta.setAttribute(attr, name)
    meta.setAttribute('content', content)
    document.head.appendChild(meta)
  }
}
