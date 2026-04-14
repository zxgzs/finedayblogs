<template>
  <div 
    class="article-card hover-glow hover-scale"
    @click="$emit('click', article.id)"
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
          {{ formatNumber(article.views) }} 次阅读
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
          :class="{ 'is-liked': liked }"
          @click.stop="handleLike"
        >
          <el-icon><Star /></el-icon>
          {{ article.likes + (liked ? 1 : 0) }}
        </span>
        <span
          class="action-btn magnetic"
          :class="{ 'is-collected': collected }"
          @click.stop="handleCollect"
        >
          <el-icon><Collection /></el-icon>
          {{ article.collects + (collected ? 1 : 0) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/utils/format'
import { useLocalStorage } from '@/composables/useLocalStorage'

interface Article {
  id: number
  title: string
  summary: string
  date: string
  category: string
  tags: string[]
  views: number
  likes: number
  collects: number
  isTop?: boolean
}

const props = defineProps<{
  article: Article
}>()

defineEmits<{
  click: [id: number]
}>()

// 使用 localStorage 记录点赞和收藏
const likedArticles = useLocalStorage<number[]>('blog_liked', [])
const collectedArticles = useLocalStorage<number[]>('blog_collected', [])

const liked = computed(() => likedArticles.value.value.includes(props.article.id))
const collected = computed(() => collectedArticles.value.value.includes(props.article.id))

const handleLike = () => {
  const index = likedArticles.value.value.indexOf(props.article.id)
  if (index === -1) {
    likedArticles.value.value.push(props.article.id)
  } else {
    likedArticles.value.value.splice(index, 1)
  }
}

const handleCollect = () => {
  const index = collectedArticles.value.value.indexOf(props.article.id)
  if (index === -1) {
    collectedArticles.value.value.push(props.article.id)
  } else {
    collectedArticles.value.value.splice(index, 1)
  }
}
</script>

<style scoped lang="scss">
.article-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--primary-color);
    box-shadow: var(--shadow-lg);
  }
}

.card-scan-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  animation: scanCard 3s ease-in-out infinite;
}

@keyframes scanCard {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.article-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.article-meta {
  display: flex;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 12px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.article-summary {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.08);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

.article-actions {
  display: flex;
  gap: 12px;
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      color: var(--primary-color);
    }
    
    &.is-liked, &.is-collected {
      color: var(--accent-color);
    }
  }
}
</style>
