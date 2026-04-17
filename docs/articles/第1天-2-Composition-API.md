# 💡 Vue 3 Composition API 完全指南（含实战代码）

> 深入理解Vue 3的Composition API，掌握响应式系统、生命周期钩子、依赖注入等核心概念

## 前言

Vue 3引入的Composition API是一个革命性的特性，它改变了我们组织组件逻辑的方式。相比于Options API，Composition API提供了更灵活、更易维护的代码组织方式。

本文将详细介绍Composition API的核心概念和实战技巧。

## 什么是Composition API？

Composition API是一组基于函数的API，允许我们使用导入的函数来组合组件逻辑，而不是依赖选项式API来组织代码。

### Options API vs Composition API

**Options API：**
```javascript
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
```

**Composition API：**
```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const message = ref('Hello')

    const doubled = computed(() => count.value * 2)

    const increment = () => {
      count.value++
    }

    onMounted(() => {
      console.log('Component mounted')
    })

    return {
      count,
      message,
      doubled,
      increment
    }
  }
}
```

### Composition API的优势

1. **更好的代码组织**：按功能而非选项类型组织代码
2. **逻辑复用**：可以轻松提取和复用逻辑
3. **类型推断**：更好的TypeScript支持
4. **更灵活**：不局限于组件内部

## 核心概念

### 1. 响应式系统

Vue 3提供了两种创建响应式状态的方式：`ref`和`reactive`。

#### ref

`ref`用于创建包装后的响应式对象，适合基础类型：

```typescript
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello')
const isActive = ref(false)

// 访问值
console.log(count.value) // 0

// 修改值
count.value = 1
```

**使用场景：**
- 数字、字符串、布尔值等基础类型
- 需要整个替换的对象

```typescript
// 组件中使用
export default {
  setup() {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    return {
      count,
      increment
    }
  }
}
```

#### reactive

`reactive`用于创建响应式对象，适合对象和数组：

```typescript
import { reactive } from 'vue'

const state = reactive({
  name: 'Vue',
  version: '3.0',
  features: ['Composition API', 'Teleport', 'Fragments']
})

// 访问属性
console.log(state.name) // 'Vue'

// 修改属性
state.version = '3.1'

// 添加新属性
state.author = 'Evan You'
```

**使用场景：**
- 对象类型的数据
- 需要深层响应式的复杂数据

```typescript
// 组件中使用
export default {
  setup() {
    const article = reactive({
      title: '',
      content: '',
      tags: []
    })

    const addTag = (tag: string) => {
      article.tags.push(tag)
    }

    return {
      article,
      addTag
    }
  }
}
```

#### toRef和toRefs

当使用`reactive`时，需要使用`toRef`和`toRefs`来保持响应性：

```typescript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  name: 'Vue',
  version: '3.0'
})

// toRef - 转换单个属性
const version = toRef(state, 'version')
console.log(version.value) // '3.0'

// toRefs - 转换整个对象
export default {
  setup() {
    const state = reactive({
      name: 'Vue',
      version: '3.0'
    })

    // 展开所有属性，保持响应性
    return {
      ...toRefs(state)
    }
  }
}
```

### 2. 计算属性

使用`computed`创建计算属性：

```typescript
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

// 只读
console.log(doubled.value) // 0

count.value = 5
console.log(doubled.value) // 10
```

**可写的计算属性：**

```typescript
const count = ref(0)
const doubled = computed({
  get: () => count.value * 2,
  set: (value) => {
    count.value = value / 2
  }
})

doubled.value = 10
console.log(count.value) // 5
```

**实战案例：文章列表过滤**

```typescript
import { ref, computed } from 'vue'

export default {
  setup() {
    const articles = ref([
      { id: 1, title: 'Vue 3教程', category: 'Vue' },
      { id: 2, title: 'React入门', category: 'React' },
      { id: 3, title: 'TypeScript指南', category: 'TS' }
    ])

    const selectedCategory = ref('')

    const filteredArticles = computed(() => {
      if (!selectedCategory.value) {
        return articles.value
      }
      return articles.value.filter(
        a => a.category === selectedCategory.value
      )
    })

    return {
      articles,
      selectedCategory,
      filteredArticles
    }
  }
}
```

### 3. 侦听器

使用`watch`和`watchEffect`侦听数据变化。

#### watch

侦听特定数据源的变化：

```typescript
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
})

count.value = 1 // 输出: count changed from 0 to 1
```

**侦听多个数据源：**

```typescript
const firstName = ref('John')
const lastName = ref('Doe')

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Name changed from ${oldFirst} ${oldLast} to ${newFirst} ${newLast}`)
})
```

**侦听对象属性：**

```typescript
const user = reactive({
  name: 'John',
  age: 30
})

watch(() => user.name, (newName, oldName) => {
  console.log(`Name changed from ${oldName} to ${newName}`)
})
```

**配置选项：**

```typescript
watch(
  source,
  callback,
  {
    immediate: true,  // 立即执行一次
    deep: true,       // 深度侦听
    flush: 'post'     // 回调时机：pre/post/sync
  }
)
```

#### watchEffect

自动追踪依赖，无需显式指定：

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

watchEffect(() => {
  console.log(`count is ${count.value}, doubled is ${doubled.value}`)
})

count.value = 1 // 自动重新执行
```

**停止侦听：**

```typescript
const stop = watchEffect(() => {
  console.log('effect runs')
})

// 停止侦听
stop()
```

**实战案例：草稿自动保存**

```typescript
import { ref, watchEffect } from 'vue'

export function useAutoSave(formData: any) {
  const isSaving = ref(false)
  const lastSaved = ref<number | null>(null)

  let timer: any = null

  watchEffect(() => {
    // 清除之前的定时器
    clearTimeout(timer)

    // 5秒后保存
    timer = setTimeout(() => {
      saveDraft(formData)
      isSaving.value = false
      lastSaved.value = Date.now()
    }, 5000)

    isSaving.value = true
  })

  return {
    isSaving,
    lastSaved
  }
}
```

### 4. 生命周期钩子

在Composition API中，生命周期钩子需要在`setup`函数中调用：

```typescript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('组件挂载前')
    })

    onMounted(() => {
      console.log('组件已挂载')
    })

    onBeforeUpdate(() => {
      console.log('组件更新前')
    })

    onUpdated(() => {
      console.log('组件已更新')
    })

    onBeforeUnmount(() => {
      console.log('组件卸载前')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })

    onErrorCaptured((err) => {
      console.error('捕获错误:', err)
      return false // 阻止错误继续向上传播
    })
  }
}
```

**生命周期映射：**

| Options API | Composition API |
|------------|-----------------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |

### 5. 依赖注入

使用`provide`和`inject`在组件树中传递数据：

```typescript
import { provide, inject } from 'vue'

// 父组件
export default {
  setup() {
    const theme = ref('dark')
    const user = reactive({
      name: 'John',
      role: 'admin'
    })

    // 提供数据
    provide('theme', theme)
    provide('user', user)

    // 提供可修改的方法
    provide('toggleTheme', () => {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    })
  }
}

// 子组件
export default {
  setup() {
    // 注入数据
    const theme = inject('theme')
    const user = inject('user')
    const toggleTheme = inject('toggleTheme')

    return {
      theme,
      user,
      toggleTheme
    }
  }
}
```

**默认值：**

```typescript
const theme = inject('theme', 'light')
```

**实战案例：主题切换**

```typescript
// composables/useTheme.ts
import { provide, inject, ref, readonly } from 'vue'

const ThemeKey = Symbol('theme')

export function provideTheme() {
  const isDark = ref(false)

  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark')
  }

  const setDark = (dark: boolean) => {
    isDark.value = dark
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  provide(ThemeKey, {
    isDark: readonly(isDark),
    toggle,
    setDark
  })
}

export function useTheme() {
  const theme = inject(ThemeKey)
  if (!theme) {
    throw new Error('Theme not provided')
  }
  return theme
}
```

## Composables：逻辑复用

Composables是Composition API的核心优势之一，它让我们能够提取和复用逻辑。

### 创建Composable

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const doubled = computed(() => count.value * 2)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset
  }
}
```

### 使用Composable

```typescript
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const {
      count,
      doubled,
      increment,
      decrement,
      reset
    } = useCounter(10)

    return {
      count,
      doubled,
      increment,
      decrement,
      reset
    }
  }
}
```

### 实战案例：文章管理

```typescript
// composables/useArticle.ts
import { ref, computed, onMounted } from 'vue'

export function useArticle() {
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const selectedCategory = ref('')

  const filteredArticles = computed(() => {
    if (!selectedCategory.value) {
      return articles.value
    }
    return articles.value.filter(
      a => a.category === selectedCategory.value
    )
  })

  const hotArticles = computed(() => {
    return articles.value
      .filter(a => a.views > 1000)
      .sort((a, b) => b.views - a.views)
  })

  const fetchArticles = async () => {
    loading.value = true
    error.value = null

    try {
      articles.value = await getArticles()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  const addArticle = (article: Article) => {
    articles.value.unshift(article)
  }

  const updateArticle = (id: number, updates: Partial<Article>) => {
    const index = articles.value.findIndex(a => a.id === id)
    if (index !== -1) {
      articles.value[index] = {
        ...articles.value[index],
        ...updates
      }
    }
  }

  const deleteArticle = (id: number) => {
    articles.value = articles.value.filter(a => a.id !== id)
  }

  onMounted(() => {
    fetchArticles()
  })

  return {
    articles,
    loading,
    error,
    selectedCategory,
    filteredArticles,
    hotArticles,
    fetchArticles,
    addArticle,
    updateArticle,
    deleteArticle
  }
}
```

## 最佳实践

### 1. 按功能组织代码

```typescript
export default {
  setup() {
    // 文章相关逻辑
    const { articles, fetchArticles } = useArticles()

    // 用户相关逻辑
    const { user, login, logout } = useAuth()

    // 主题相关逻辑
    const { theme, toggleTheme } = useTheme()

    return {
      articles,
      user,
      theme,
      fetchArticles,
      login,
      logout,
      toggleTheme
    }
  }
}
```

### 2. 使用TypeScript

```typescript
import { ref, Ref } from 'vue'

interface Article {
  id: number
  title: string
  content: string
  views: number
}

export function useArticleList(): {
  articles: Ref<Article[]>
  fetchArticles: () => Promise<void>
} {
  const articles = ref<Article[]>([])

  const fetchArticles = async () => {
    articles.value = await getArticles()
  }

  return {
    articles,
    fetchArticles
  }
}
```

### 3. 避免过度使用ref

```typescript
// ❌ 不推荐：过多ref
const title = ref('')
const content = ref('')
const category = ref('')
const tags = ref([])
const isPublished = ref(false)

// ✅ 推荐：使用reactive
const article = reactive({
  title: '',
  content: '',
  category: '',
  tags: [],
  isPublished: false
})
```

### 4. 合理使用computed

```typescript
// ❌ 不推荐：在模板中直接计算
// <div>{{ article.content.length }}</div>

// ✅ 推荐：使用computed
const contentLength = computed(() => article.content.length)
// <div>{{ contentLength }}</div>
```

## 总结

Composition API提供了更灵活、更强大的代码组织方式：

1. **逻辑复用**：通过Composables轻松复用逻辑
2. **代码组织**：按功能而非选项类型组织代码
3. **类型安全**：更好的TypeScript支持
4. **灵活性**：不局限于组件内部

掌握Composition API，能让你写出更优雅、更易维护的Vue 3代码！

---

**标签**：#Vue3 #CompositionAPI #前端 #JavaScript #TypeScript

**点赞❤️ + 收藏⭐️ + 评论💬，你的支持是我创作的动力！**
