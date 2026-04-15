/**
 * SEO 元数据生成工具
 * 用于自动生成文章的 SEO 优化 meta 标签
 */

export interface ArticleSEOMeta {
  title: string
  description: string
  keywords: string[]
  author: string
  url: string
  image?: string
  publishedTime?: string
  modifiedTime?: string
}

export interface OGMeta {
  'og:type': string
  'og:url': string
  'og:title': string
  'og:description': string
  'og:image'?: string
  'og:site_name': string
  'og:locale': string
  'article:author'?: string
  'article:published_time'?: string
  'article:modified_time'?: string
}

export interface TwitterMeta {
  'twitter:card': string
  'twitter:url': string
  'twitter:title': string
  'twitter:description': string
  'twitter:image'?: string
}

/**
 * 生成优化的文章标题
 * 规则：标题 | 网站名称
 */
export const generateArticleTitle = (articleTitle: string, siteName = '晴天的博客'): string => {
  return `${articleTitle} | ${siteName}`
}

/**
 * 生成文章描述（从摘要中提取）
 * 规则：限制在 155-160 字符之间
 */
export const generateArticleDescription = (summary: string, maxLength = 160): string => {
  if (summary.length <= maxLength) {
    return summary
  }
  return summary.substring(0, maxLength - 3) + '...'
}

/**
 * 生成关键词（从标签中提取）
 * 规则：最多 10 个关键词，用逗号分隔
 */
export const generateKeywords = (tags: string[], category?: string, maxTags = 10): string => {
  const allTags = [...tags]
  if (category && !allTags.includes(category)) {
    allTags.unshift(category)
  }
  return allTags.slice(0, maxTags).join(', ')
}

/**
 * 生成 Open Graph 元数据
 */
export const generateOGMeta = (meta: ArticleSEOMeta): OGMeta => {
  return {
    'og:type': 'article',
    'og:url': meta.url,
    'og:title': generateArticleTitle(meta.title),
    'og:description': generateArticleDescription(meta.description),
    'og:image': meta.image,
    'og:site_name': '晴天的博客',
    'og:locale': 'zh_CN',
    'article:author': meta.author,
    'article:published_time': meta.publishedTime,
    'article:modified_time': meta.modifiedTime,
  }
}

/**
 * 生成 Twitter Card 元数据
 */
export const generateTwitterMeta = (meta: ArticleSEOMeta): TwitterMeta => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:url': meta.url,
    'twitter:title': generateArticleTitle(meta.title),
    'twitter:description': generateArticleDescription(meta.description),
    'twitter:image': meta.image,
  }
}

/**
 * 生成所有 SEO 元数据
 */
export const generateAllMeta = (meta: ArticleSEOMeta) => {
  const ogMeta = generateOGMeta(meta)
  const twitterMeta = generateTwitterMeta(meta)

  return {
    // 基础 Meta 标签
    title: generateArticleTitle(meta.title),
    description: generateArticleDescription(meta.description),
    keywords: generateKeywords(meta.keywords),
    author: meta.author,

    // Open Graph 标签
    ...ogMeta,

    // Twitter Card 标签
    ...twitterMeta,

    // 其他 SEO 标签
    robots: 'index, follow',
    googlebot: 'index, follow',
  }
}

/**
 * 设置页面的 Meta 标签
 */
export const setPageMeta = (meta: ArticleSEOMeta) => {
  const allMeta = generateAllMeta(meta)
  const ogMeta = generateOGMeta(meta)
  const twitterMeta = generateTwitterMeta(meta)

  // 设置页面标题
  document.title = allMeta.title

  // 设置基础 Meta 标签
  setMeta('description', allMeta.description as string)
  setMeta('keywords', allMeta.keywords as string)
  setMeta('author', allMeta.author)
  setMeta('robots', allMeta.robots as string)
  setMeta('googlebot', allMeta.googlebot as string)

  // 设置 Open Graph 标签
  setMetaProperty('og:type', ogMeta['og:type'])
  setMetaProperty('og:url', ogMeta['og:url'])
  setMetaProperty('og:title', ogMeta['og:title'])
  setMetaProperty('og:description', ogMeta['og:description'])
  if (ogMeta['og:image']) {
    setMetaProperty('og:image', ogMeta['og:image'])
  }
  setMetaProperty('og:site_name', ogMeta['og:site_name'])
  setMetaProperty('og:locale', ogMeta['og:locale'])
  if (ogMeta['article:author']) {
    setMetaProperty('article:author', ogMeta['article:author'])
  }
  if (ogMeta['article:published_time']) {
    setMetaProperty('article:published_time', ogMeta['article:published_time'])
  }
  if (ogMeta['article:modified_time']) {
    setMetaProperty('article:modified_time', ogMeta['article:modified_time'])
  }

  // 设置 Twitter Card 标签
  setMeta('twitter:card', twitterMeta['twitter:card'])
  setMeta('twitter:url', twitterMeta['twitter:url'])
  setMeta('twitter:title', twitterMeta['twitter:title'])
  setMeta('twitter:description', twitterMeta['twitter:description'])
  if (twitterMeta['twitter:image']) {
    setMeta('twitter:image', twitterMeta['twitter:image'])
  }
}

/**
 * 设置 Meta 标签
 */
const setMeta = (name: string, content?: string) => {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  if (content) {
    element.setAttribute('content', content)
  } else {
    element.remove()
  }
}

/**
 * 设置 Meta Property 标签（用于 Open Graph）
 */
const setMetaProperty = (property: string, content?: string) => {
  let element = document.querySelector(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  if (content) {
    element.setAttribute('content', content)
  } else {
    element.remove()
  }
}

/**
 * 生成结构化数据（Schema.org）
 */
export const generateSchemaData = (meta: ArticleSEOMeta) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.description,
    image: meta.image,
    author: {
      '@type': 'Person',
      name: meta.author,
    },
    publisher: {
      '@type': 'Organization',
      name: '晴天的博客',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fineday.vip/logo.png',
      },
    },
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': meta.url,
    },
  }
}

/**
 * 将结构化数据插入页面
 */
export const insertSchemaData = (schemaData: any) => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(schemaData)

  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  document.head.appendChild(script)
}

/**
 * 为文章设置完整的 SEO
 */
export const setArticleSEO = (
  article: {
    title: string
    summary: string
    tags: string[]
    category: string
    date: string
    author: string
  },
  url: string,
  image?: string
) => {
  const meta: ArticleSEOMeta = {
    title: article.title,
    description: article.summary,
    keywords: article.tags,
    author: article.author,
    url,
    image,
    publishedTime: article.date,
    modifiedTime: article.date,
  }

  // 设置 Meta 标签
  setPageMeta(meta)

  // 设置结构化数据
  const schemaData = generateSchemaData(meta)
  insertSchemaData(schemaData)

  // 设置 Canonical 链接
  setCanonical(url)
}

/**
 * 设置 Canonical 链接
 */
const setCanonical = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = url
}

/**
 * 生成 Sitemap XML
 */
export const generateSitemapXML = (urls: Array<{ url: string; lastmod: string; changefreq: string; priority: number }>): string => {
  const urlElements = urls.map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
}
