<template>
  <div class="series-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><List /></el-icon>
        文章系列
      </h1>
      <p class="page-desc">系统化学习，循序渐进</p>
    </div>

    <!-- 系列列表 -->
    <div class="series-list">
      <SeriesCard
        v-for="series in publishedSeries"
        :key="series.id"
        :series="series"
        :read-articles="readArticleIds"
      />
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="publishedSeries.length === 0"
      description="暂无文章系列"
      :image-size="200"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { setPageMeta } from '@/utils/seo'
import { getPublishedSeries } from '@/data/series'
import SeriesCard from '@/components/SeriesCard.vue'
import { useReadingHistory } from '@/composables/useReadingHistory'

const { getHistory } = useReadingHistory()

const publishedSeries = ref(getPublishedSeries())

// 获取已阅读的文章ID
const readArticleIds = computed(() => {
  const history = getHistory()
  return history.map(item => item.articleId)
})

onMounted(() => {
  setPageMeta('文章系列 - 晴天的博客', '系统化学习系列教程，循序渐进掌握技术知识')
})
</script>

<style scoped lang="scss">
.series-page {
  padding-top: 80px;

  .page-header {
    text-align: center;
    padding: 40px 0;
    margin-bottom: 32px;
    background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--bg-color) 100%);
    border-radius: 12px;

    .page-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--text-primary);
    }

    .page-desc {
      font-size: 16px;
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .series-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
}
</style>
