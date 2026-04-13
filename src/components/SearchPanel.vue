<template>
  <!-- 搜索遮罩层 -->
  <div v-if="show" class="search-overlay" @click="closeSearch"></div>

  <div v-if="show" class="search-panel" @click.stop>
    <el-input
      v-model="query"
      autofocus
      placeholder="输入关键词搜索文章..."
      size="large"
      @keydown.esc="closeSearch"
    >
      <template #prefix>
        <el-icon>
          <Search/>
        </el-icon>
      </template>
    </el-input>
    <div v-if="query.trim()" class="search-results">
      <div
        v-for="article in props.results"
        :key="article.id"
        class="search-result-item"
        @click="goToArticle(article.id)"
      >
        <div class="result-title">{{ article.title }}</div>
        <div class="result-meta">
          <span><el-icon><Calendar/></el-icon>{{ article.date }}</span>
          <span><el-icon><View/></el-icon>{{ article.views }}</span>
        </div>
      </div>
      <div v-if="props.results.length === 0" class="no-results">
        未找到相关文章
      </div>
    </div>
    <div v-else class="search-tips">
      <p>输入标题、内容或标签搜索</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Calendar, View } from '@element-plus/icons-vue'

const show = defineModel<boolean>('show')
const query = defineModel<string>('query')

interface Article {
  id: number
  title: string
  date: string
  views: number
}

const props = defineProps<{
  results: Article[]
}>()

const emit = defineEmits(['go-to-article'])

const closeSearch = () => {
  show.value = false
  query.value = ''
}

const goToArticle = (id: number) => {
  emit('go-to-article', id)
}
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9998;
}

.search-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 360px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: searchSlide 0.2s ease;
  z-index: 10000;

  :deep(.el-input__wrapper) {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    border-bottom: 1px solid var(--border-color);
  }
}

.search-results {
  max-height: 360px;
  overflow-y: auto;

  .search-result-item {
    padding: 12px 14px;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: rgba(0, 212, 255, 0.1);
    }

    .result-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
      font-size: 14px;
    }

    .result-meta {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: var(--text-muted);

      span {
        display: flex;
        align-items: center;
        gap: 3px;
      }
    }
  }

  .no-results {
    padding: 20px;
    text-align: center;
    color: var(--text-muted);
  }
}

.search-tips {
  padding: 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

@keyframes searchSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
