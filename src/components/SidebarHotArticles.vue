<template>
  <div class="sidebar-section hot-articles">
    <div class="sidebar-title">
      <el-icon><Top /></el-icon>
      热门文章
    </div>
    <div class="hot-article-list">
      <div
        v-for="(article, index) in articles"
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
</template>

<script setup lang="ts">
import { Top, View } from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  views: number
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
.hot-articles {
  padding: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}
  margin-bottom: 24px;
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
  background: var(--card-bg);
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
</style>
