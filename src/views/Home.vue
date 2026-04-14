<template>
  <div class="home-page">
    <div class="main-area">
      <!-- 搜索和筛选区域 -->
      <div class="search-section glassmorphism border-flow">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题或内容..."
            class="search-input"
            clearable
            @input="handleSearch"
            size="large"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" size="large" class="btn-flow magnetic" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        <div class="filter-row">
          <span class="filter-label">分类:</span>
          <el-tag
            v-for="cat in ['全部', ...categoryList]"
            :key="cat"
            :class="{ 'active-tag': selectedCategory === cat }"
            class="filter-tag magnetic"
            @click="filterByCategory(cat)"
          >
            {{ cat }}
          </el-tag>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="article-list" v-if="filteredArticles.length > 0">
        <div
          v-for="article in paginatedArticles"
          :key="article.id"
          class="article-card hover-glow hover-scale"
          @click="goToArticle(article.id)"
        >
          <!-- 卡片扫描线效果 -->
          <div class="card-scan-line"></div>
          
          <div class="article-header">
            <div class="article-title-row">
              <el-tag v-if="article.isTop" size="small" type="danger" effect="dark" class="pulse-ring">置顶</el-tag>
              <h2 class="article-title glitch-text" :data-text="article.title">
                {{ article.title }}
              </h2>
            </div>
            <div class="article-meta">
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ article.date }}
              </span>
              <span class="meta-item">
                <el-icon><Folder /></el-icon>
                {{ article.category }}
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ article.views }} 次阅读
              </span>
            </div>
          </div>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-footer">
            <div class="article-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag magnetic">
                {{ tag }}
              </span>
            </div>
            <div class="article-actions">
              <span
                class="action-btn magnetic"
                :class="{ 
                  'is-liked': isLiked(article.id),
                  'like-animate': likeAnimation === article.id
                }"
                @click.stop="handleLike(article)"
              >
                <el-icon><Star /></el-icon>
                {{ article.likes + (isLiked(article.id) ? 1 : 0) }}
              </span>
              <span
                class="action-btn magnetic"
                :class="{ 'is-collected': isCollected(article.id) }"
                @click.stop="handleCollect(article)"
              >
                <el-icon><Collection /></el-icon>
                {{ article.collects + (isCollected(article.id) ? 1 : 0) }}
              </span>
            </div>
          </div>
        </div>
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
      <div class="sidebar-section about-me">
        <div class="avatar pulse-ring">
          <el-icon :size="50"><UserFilled /></el-icon>
        </div>
        <div class="name gradient-text">晴天</div>
        <div class="bio">热爱技术，专注前端开发，分享学习心得与实战经验</div>
        <div class="stats">
          <div class="stat-item magnetic">
            <div class="stat-value animated-gradient-text">{{ articles.length }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat-item magnetic">
            <div class="stat-value animated-gradient-text">{{ totalViews }}</div>
            <div class="stat-label">访问</div>
          </div>
          <div class="stat-item magnetic">
            <div class="stat-value animated-gradient-text">{{ totalLikes }}</div>
            <div class="stat-label">获赞</div>
          </div>
        </div>
        <div class="social-links">
          <a href="#" class="social-link magnetic" title="GitHub">
            <el-icon><Brand /></el-icon>
          </a>
          <a href="#" class="social-link magnetic" title="CSDN">
            <el-icon><Link /></el-icon>
          </a>
          <a href="#" class="social-link magnetic" title="邮箱">
            <el-icon><Message /></el-icon>
          </a>
          <a href="#" class="social-link magnetic" title="RSS">
            <el-icon><Connection /></el-icon>
          </a>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="sidebar-section quick-links">
        <router-link to="/favorites" class="quick-link magnetic">
          <el-icon><Star /></el-icon>
          <span>我的收藏</span>
          <el-icon class="arrow"><ArrowRight /></el-icon>
        </router-link>
        <router-link to="/history" class="quick-link magnetic">
          <el-icon><Clock /></el-icon>
          <span>阅读历史</span>
          <el-icon class="arrow"><ArrowRight /></el-icon>
        </router-link>
      </div>

      <div class="sidebar-section categories">
        <div class="sidebar-title">
          <el-icon><FolderOpened /></el-icon>
          文章分类
        </div>
        <div class="category-list">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="category-item magnetic"
            :class="{ active: selectedCategory === cat.name }"
            @click="filterByCategory(cat.name)"
          >
            <span class="category-name">
              <el-icon><Folder /></el-icon>
              {{ cat.name }}
            </span>
            <span class="category-count">{{ cat.count }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-section hot-tags">
        <div class="sidebar-title">
          <el-icon><Collection /></el-icon>
          热门标签
        </div>
        <div class="tag-list">
          <span
            v-for="tag in hotTags"
            :key="tag.name"
            class="tag-item magnetic"
            :class="{ active: selectedTag === tag.name }"
            @click="filterByTag(tag.name)"
          >
            {{ tag.name }} ({{ tag.count }})
          </span>
        </div>
      </div>

      <div class="sidebar-section hot-articles">
        <div class="sidebar-title">
          <el-icon><Top /></el-icon>
          热门文章
        </div>
        <div class="hot-article-list">
          <div
            v-for="(article, index) in hotArticles"
            :key="article.id"
            class="hot-article-item"
            @click="goToArticle(article.id)"
          >
            <span class="rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <div class="hot-article-info">
              <span class="hot-article-title">{{ article.title }}</span>
              <span class="hot-article-views">
                <el-icon><View /></el-icon>
                {{ article.views }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 个性化推荐 -->
      <RecommendationPanel />

      <div class="sidebar-section recent-articles">
        <div class="sidebar-title">
          <el-icon><Clock /></el-icon>
          最新文章
        </div>
        <div
          v-for="article in recentArticles"
          :key="article.id"
          class="article-item magnetic"
          @click="goToArticle(article.id)"
        >
          <span class="article-title">{{ article.title }}</span>
          <span class="article-date">{{ article.date }}</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { articles, hotTags, categories } from '@/data/articles'
import type { Article } from '@/data/articles'
import RecommendationPanel from '@/components/RecommendationPanel.vue'

const router = useRouter()

const searchKeyword = ref('')
const selectedCategory = ref('全部')
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const likedArticles = ref<number[]>([])
const collectedArticles = ref<number[]>([])

const categoryList = computed(() => categories.map(c => c.name))

const totalViews = computed(() => articles.reduce((sum, a) => sum + a.views, 0))
const totalLikes = computed(() => articles.reduce((sum, a) => sum + a.likes, 0))

const recentArticles = computed(() =>
  [...articles].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5)
)

// 热门文章（按阅读量排序）
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

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(keyword) ||
      a.summary.toLowerCase().includes(keyword) ||
      a.content.toLowerCase().includes(keyword)
    )
  }

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

const handleSearch = () => {
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

const likeAnimation = ref<number | null>(null)

const handleLike = (article: Article) => {
  if (isLiked(article.id)) {
    likedArticles.value = likedArticles.value.filter(id => id !== article.id)
    ElMessage.success('取消点赞')
  } else {
    likedArticles.value.push(article.id)
    likeAnimation.value = article.id
    setTimeout(() => {
      likeAnimation.value = null
    }, 600)
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
  searchKeyword.value = ''
  selectedCategory.value = '全部'
  selectedTag.value = ''
  currentPage.value = 1
}

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
}

.article-card {
  position: relative;
  overflow: hidden;
  
  .card-scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 212, 255, 0.08) 50%,
      transparent 100%
    );
    animation: cardScan 4s linear infinite;
    pointer-events: none;
    z-index: 1;
  }
}

@keyframes cardScan {
  0% {
    top: -100%;
  }
  100% {
    top: 200%;
  }
}

.article-title {
  position: relative;
  z-index: 2;
}

.article-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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

// 侧边栏统计数据增强
.stat-item {
  text-align: center;
  padding: 10px;
  border-radius: var(--radius);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    color: var(--text-muted);
  }
}

// 快捷入口
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  .quick-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--card-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    text-decoration: none;
    transition: all 0.3s ease;

    svg {
      font-size: 18px;
      color: var(--primary-color);
    }

    span {
      flex: 1;
      font-weight: 500;
    }

    .arrow {
      font-size: 14px;
      color: var(--text-muted);
      transition: transform 0.3s ease;
    }

    &:hover {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
      transform: translateX(4px);

      .arrow {
        transform: translateX(4px);
        color: var(--primary-color);
      }
    }
  }
}

// 社交链接悬浮效果
.social-link {
  width: 42px;
  height: 42px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 0 20px var(--primary-color);
    border-color: var(--primary-color);
  }
}

// 点赞动画
@keyframes likeAnim {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.like-animate {
  animation: likeAnim 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  .el-icon {
    animation: heartBeat 0.6s ease-in-out;
  }
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.4);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.2);
  }
  60% {
    transform: scale(1);
  }
}

// 热门文章排行榜
.hot-articles {
  .hot-article-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .hot-article-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    background: var(--card-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color);
      transform: translateX(4px);
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(124, 58, 237, 0.05));
    }

    .rank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;

      &.rank-1 {
        background: linear-gradient(135deg, #ffd700, #ff8c00);
        color: #000;
      }

      &.rank-2 {
        background: linear-gradient(135deg, #c0c0c0, #808080);
        color: #fff;
      }

      &.rank-3 {
        background: linear-gradient(135deg, #cd7f32, #8b4513);
        color: #fff;
      }

      &.rank-4,
      &.rank-5 {
        background: var(--card-bg);
        color: var(--text-muted);
        border: 1px solid var(--border-color);
      }
    }

    .hot-article-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;

      .hot-article-title {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hot-article-views {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--text-muted);

        svg {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
