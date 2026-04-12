import { ref } from 'vue'

export interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

/**
 * 文章目录生成
 */
export function useTableOfContents(_contentRef: HTMLElement | null) {
  const tocList = ref<TOCItem[]>([])
  const activeToc = ref<string>('')

  const generateTOC = (content: HTMLElement): TOCItem[] => {
    const headings = content.querySelectorAll('h2, h3, h4, h5, h6')
    const items: TOCItem[] = []

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      const id = heading.id || `heading-${items.length}`
      
      if (!heading.id) {
        heading.id = id
      }

      items.push({
        id,
        text,
        level
      })
    })

    return items
  }

  const handleScroll = () => {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3')
    let currentId = ''

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect()
      if (rect.top <= 100) {
        currentId = heading.id
      }
    })

    if (currentId) {
      activeToc.value = currentId
    }
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  return {
    tocList,
    activeToc,
    generateTOC,
    handleScroll,
    scrollToHeading
  }
}
