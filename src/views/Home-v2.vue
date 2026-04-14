<template>
  <div class="home-page">
    <div class="main-area">
      <!-- 搜索和筛选区域 -->
      <SearchSection 
        :categories="categoryList"
        @search="handleSearch" 
        @filter="filterByCategory" 
      />

      <!-- 文章列表 -->
      <div class="article-list" v-if="filteredArticles.length > 0">
        <ArticleCard
          v-for="article in paginatedArticles"
          :key="article.id"
          :article="article"
          :is-liked="isLiked(article.id)"
          :is-collected="isCollected(article.id)"
          @click="goToArticle(article.id)"
          @like="handleLike"
          @collect="handleCollect"
        />
      </div>

      <div v-else class="not-found">
        <el-empty description="没有找到相关文章">
          <el-button type="primary" @click="resetFilters">重置筛选</el-button>
        </el-empty>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="filteredArticles.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredArticles.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
          class="magnetic"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 关于我 -->
      <SidebarAbout
        :name="authorName"
        :bio="authorBio"
        :stats="authorStats"
      />

      <!-- 快捷入口 -->
      <SidebarQuickLinks :links="quickLinks" />

      <!-- 文章分类 -->
      <SidebarCategories
        :categories="categories"
        :selected-category="selectedCategory"
        @select="filterByCategory"
      />

      <!-- 热门标签 -->
      <SidebarHotTags
        :tags="hotTags"
        :selected-tag="selectedTag"
        @select="filterByTag"
      />

      <!-- 热门文章 -->
      <SidebarHotArticles
        :articles="hotArticles"
        @click="goToArticle"
      />

      <!-- 最新文章 -->
      <SidebarRecentArticles
        :articles="recentArticles"
        @click="goToArticle"
      />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { articles, hotTags, categories } from '@/data/articles'
import type { Article } from '@/data/articles'

// 组件导入
import SearchSection from '@/components/SearchSection.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import SidebarAbout from '@/components/SidebarAbout.vue'
import SidebarQuickLinks from '@/components/SidebarQuickLinks.vue'
import SidebarCategories from '@/components/SidebarCategories.vue'
import SidebarHotTags from '@/components/SidebarHotTags.vue'
import SidebarHotArticles from '@/components/SidebarHotArticles.vue'
import SidebarRecentArticles from '@/components/SidebarRecentArticles.vue'

const router = useRouter()

// 状态
const selectedCategory = ref('全部')
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const likedArticles = ref<number[]>([])
const collectedArticles = ref<number[]>([])

// 作者信息
const authorName = ref('晴天')
const authorBio = ref('热爱技术,专注前端开发,分享学习心得与实战经验')
const authorStats = computed(() => [
  { value: articles.length, label: '文章' },
  { value: totalViews.value, label: '访问' },
  { value: totalLikes.value, label: '获赞' }
])

const quickLinks = ref([
  { to: '/favorites', icon: 'Star', text: '我的收藏' },
  { to: '/history', icon: 'Clock', text: '阅读历史' }
])

// 计算属性
const categoryList = computed(() => categories.map(c => c.name))
const totalViews = computed(() => articles.reduce((sum, a) => sum + a.views, 0))
const totalLikes = computed(() => articles.reduce((sum, a) => sum + a.likes, 0))

const recentArticles = computed(() =>
  [...articles].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5)
)

const hotArticles = computed(() =>
  [...articles].sort((a, b) => b.views - a.views).slice(0, 5)
)

const filteredArticles = computed(() => {
  let result = [...articles]

  // 按置顶排序
  result.sort((a, b) => {
    if (a.isTop && !b.isTop) return -1
    if (!a.isTop && b.isTop) return 1
    return 0
  })

  // 分类过滤
  if (selectedCategory.value && selectedCategory.value !== '全部') {
    result = result.filter(a => a.category === selectedCategory.value)
  }

  // 标签过滤
  if (selectedTag.value) {
    result = result.filter(a => a.tags.includes(selectedTag.value))
  }

  return result
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, start + pageSize.value)
})

// 方法
const handleSearch = (keyword: string) => {
  // SearchSection 已经处理了搜索逻辑,这里只重置分页
  currentPage.value = 1
}

const filterByCategory = (category: string) => {
  selectedCategory.value = category
  selectedTag.value = ''
  currentPage.value = 1
}

const filterByTag = (tag: string) => {
  if (selectedTag.value === tag) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tag
    selectedCategory.value = '全部'
  }
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const isLiked = (id: number) => likedArticles.value.includes(id)
const isCollected = (id: number) => collectedArticles.value.includes(id)

const handleLike = (article: Article) => {
  if (isLiked(article.id)) {
    likedArticles.value = likedArticles.value.filter(id => id !== article.id)
    ElMessage.success('取消点赞')
  } else {
    likedArticles.value.push(article.id)
    ElMessage.success('点赞成功 +1')
  }
  localStorage.setItem('liked_articles', JSON.stringify(likedArticles.value))
}

const handleCollect = (article: Article) => {
  if (isCollected(article.id)) {
    collectedArticles.value = collectedArticles.value.filter(id => id !== article.id)
    ElMessage.success('取消收藏')
  } else {
    collectedArticles.value.push(article.id)
    ElMessage.success('收藏成功')
  }
  localStorage.setItem('collected_articles', JSON.stringify(collectedArticles.value))
}

const resetFilters = () => {
  selectedCategory.value = '全部'
  selectedTag.value = ''
  currentPage.value = 1
}

// 生命周期
onMounted(() => {
  const storedLikes = localStorage.getItem('liked_articles')
  const storedCollects = localStorage.getItem('collected_articles')
  if (storedLikes) likedArticles.value = JSON.parse(storedLikes)
  if (storedCollects) collectedArticles.value = JSON.parse(storedCollects)
})
</script>

<style scoped lang="scss">
.home-page {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  animation: fadeIn 0.5s ease;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.main-area {
  .article-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .pagination-wrapper {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }

  .not-found {
    padding: 60px 0;
    text-align: center;
  }
}

.sidebar {
  @media (max-width: 1024px) {
    display: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
