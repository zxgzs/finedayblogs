<template>
  <div class="related-articles" v-if="articles.length > 0">
    <h3 class="section-title">
      <el-icon><Connection /></el-icon>
      相关文章
    </h3>
    <div class="article-grid">
      <div
        v-for="article in articles"
        :key="article.id"
        class="related-card"
        @click="$emit('click', article.id)"
      >
        <h4 class="card-title">{{ article.title }}</h4>
        <div class="card-meta">
          <span class="meta-date">{{ article.date }}</span>
          <span class="meta-views">
            <el-icon><View /></el-icon>
            {{ article.views }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Article {
  id: number
  title: string
  date: string
  views: number
}

defineProps<{
  articles: Article[]
}>()

defineEmits<{
  click: [id: number]
}>()
</script>

<style scoped lang="scss">
.related-articles {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.related-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow);

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }
}

.card-title {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
  
  .meta-views {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
