import { ref, watch } from 'vue'

export function useTheme() {
  const isDarkMode = ref(true)

  // 从 localStorage 加载主题
  const loadTheme = () => {
    const saved = localStorage.getItem('blog_theme')
    if (saved !== null) {
      isDarkMode.value = saved === 'dark'
    } else {
      // 默认深色模式
      isDarkMode.value = true
    }
    applyTheme()
  }

  // 应用主题到 document
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.remove('light-mode')
    } else {
      document.documentElement.classList.add('light-mode')
      document.documentElement.classList.remove('dark-mode')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('blog_theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }

  // 监听变化
  watch(isDarkMode, () => {
    applyTheme()
  })

  // 初始化
  loadTheme()

  return {
    isDarkMode,
    toggleTheme
  }
}
