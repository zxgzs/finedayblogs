import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 从 localStorage 读取值
  const readValue = (): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const storedValue = ref<T>(readValue())

  // 监听变化并保存到 localStorage
  watch(storedValue, (newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  })

  // 移除值
  const removeValue = () => {
    try {
      localStorage.removeItem(key)
      storedValue.value = initialValue
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  return {
    value: storedValue,
    removeValue
  }
}
