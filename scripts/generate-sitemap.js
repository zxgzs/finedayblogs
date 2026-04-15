/**
 * 自动生成 Sitemap XML
 * 使用方法：node scripts/generate-sitemap.js
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// 直接读取并解析 articles.ts 文件
const articlesPath = resolve(import.meta.dirname, '../src/data/articles.ts')
const articlesContent = readFileSync(articlesPath, 'utf-8')

// 从 TypeScript 文件中提取文章数据（简化版）
// 注意：这里假设 articles 数组的格式保持不变
const articleMatches = articlesContent.match(/id:\s*(\d+).*?date:\s*['"](.*?)['"]/gs)

const articles = []
let match
const idRegex = /id:\s*(\d+)/
const dateRegex = /date:\s*['"](.*?)['"]/

while ((match = idRegex.exec(articlesContent)) !== null) {
  const id = match[1]
  const dateMatch = articlesContent.substring(match.index).match(dateRegex)
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
  articles.push({ id, date })
}

// 配置
const config = {
  baseUrl: 'https://fineday.vip',
  lastmod: new Date().toISOString().split('T')[0],
}

// 生成网站 URL 列表
const urls = [
  // 首页
  {
    url: config.baseUrl + '/',
    lastmod: config.lastmod,
    changefreq: 'daily',
    priority: 1.0,
  },
  // 主要页面
  {
    url: config.baseUrl + '/tags',
    lastmod: config.lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    url: config.baseUrl + '/archives',
    lastmod: config.lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    url: config.baseUrl + '/dashboard',
    lastmod: config.lastmod,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    url: config.baseUrl + '/gallery',
    lastmod: config.lastmod,
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    url: config.baseUrl + '/plugins',
    lastmod: config.lastmod,
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    url: config.baseUrl + '/about',
    lastmod: config.lastmod,
    changefreq: 'monthly',
    priority: 0.5,
  },
]

// 添加文章 URL
articles.forEach((article) => {
  urls.push({
    url: `${config.baseUrl}/article/${article.id}`,
    lastmod: article.date,
    changefreq: 'monthly',
    priority: 0.9,
  })
})

// 生成 Sitemap XML
const generateSitemapXML = (urls) => {
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

const sitemapXML = generateSitemapXML(urls)

// 保存文件
import { writeFileSync } from 'fs'

const outputPath = resolve(import.meta.dirname, '../public/sitemap.xml')
writeFileSync(outputPath, sitemapXML, 'utf-8')

console.log('✅ Sitemap 生成成功！')
console.log(`📍 文件位置: ${outputPath}`)
console.log(`📊 总共 ${urls.length} 个 URL`)
console.log(`🌐 基础 URL: ${config.baseUrl}`)
