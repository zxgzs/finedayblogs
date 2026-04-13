export interface ArticleSeries {
  id: string
  title: string
  description: string
  coverImage?: string
  articleIds: number[]
  order: number[]
  createdAt: number
  updatedAt: number
  status: 'draft' | 'published' | 'archived'
}

const storedSeries = localStorage.getItem('blog_series')
export const seriesList: ArticleSeries[] = storedSeries
  ? JSON.parse(storedSeries).map((s: any) => ({
      ...s,
      articleIds: s.articleIds || [],
      order: s.order || []
    }))
  : []

export function saveSeries() {
  localStorage.setItem('blog_series', JSON.stringify(seriesList))
}

export function createSeries(data: Omit<ArticleSeries, 'id' | 'createdAt' | 'updatedAt'>): ArticleSeries {
  const newSeries: ArticleSeries = {
    id: `series_${Date.now()}`,
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  seriesList.push(newSeries)
  saveSeries()
  return newSeries
}

export function updateSeries(id: string, data: Partial<ArticleSeries>): ArticleSeries | null {
  const index = seriesList.findIndex(s => s.id === id)
  if (index > -1) {
    seriesList[index] = {
      ...seriesList[index],
      ...data,
      updatedAt: Date.now()
    }
    saveSeries()
    return seriesList[index]
  }
  return null
}

export function deleteSeries(id: string): boolean {
  const index = seriesList.findIndex(s => s.id === id)
  if (index > -1) {
    seriesList.splice(index, 1)
    saveSeries()
    return true
  }
  return false
}

export function getSeriesById(id: string): ArticleSeries | undefined {
  return seriesList.find(s => s.id === id)
}

export function getPublishedSeries(): ArticleSeries[] {
  return seriesList.filter(s => s.status === 'published')
}

export function addArticleToSeries(seriesId: string, articleId: number, order?: number): boolean {
  const series = seriesList.find(s => s.id === seriesId)
  if (!series) return false

  if (!series.articleIds.includes(articleId)) {
    series.articleIds.push(articleId)
    series.order.push(order !== undefined ? order : series.articleIds.length - 1)
    series.updatedAt = Date.now()
    saveSeries()
    return true
  }
  return false
}

export function removeArticleFromSeries(seriesId: string, articleId: number): boolean {
  const series = seriesList.find(s => s.id === seriesId)
  if (!series) return false

  const index = series.articleIds.indexOf(articleId)
  if (index > -1) {
    series.articleIds.splice(index, 1)
    series.order.splice(index, 1)
    series.updatedAt = Date.now()
    saveSeries()
    return true
  }
  return false
}

export function reorderSeriesArticles(seriesId: string, newOrder: number[]): boolean {
  const series = seriesList.find(s => s.id === seriesId)
  if (!series) return false

  series.order = newOrder
  series.updatedAt = Date.now()
  saveSeries()
  return true
}

export function getSeriesArticles(seriesId: string, articles: any[]): any[] {
  const series = seriesList.find(s => s.id === seriesId)
  if (!series) return []

  return series.order
    .map(orderIndex => series.articleIds[orderIndex])
    .filter(id => articles.find(a => a.id === id))
    .map(id => articles.find(a => a.id === id))
    .filter(Boolean)
}
