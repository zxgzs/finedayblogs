<template>
  <div class="sidebar-section recent-articles">
    <div class="sidebar-title">
      <el-icon><Clock /></el-icon>
      最新文章
    </div>
    <div
      v-for="article in articles"
      :key="article.id"
      class="article-item magnetic"
      @click="goToArticle(article.id)"
    >
      <span class="article-title">{{ article.title }}</span>
      <span class="article-date">{{ article.date }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  date: string
}

defineProps<{
  articles: Article[]
}>()

const emit = defineEmits(['click'])

const goToArticle = (id: number) => {
  emit('click', id)
}
</script>

<style scoped>
.recent-articles {
  padding: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);

  svg {
    color: var(--primary-color);
  }
}

.article-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(99, 102, 241, 0.08);
  }

  .article-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .article-date {
    font-size: 12px;
    color: var(--text-muted);
  }
}
</style>
