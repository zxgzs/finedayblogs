<template>
  <div class="article-meta">
    <span class="meta-item">
      <el-icon><Calendar /></el-icon>
      {{ date }}
    </span>
    <span class="meta-item">
      <el-icon><User /></el-icon>
      {{ author }}
    </span>
    <span class="meta-item">
      <el-icon><View /></el-icon>
      {{ views }} 次阅读
    </span>
    <span class="meta-item">
      <el-icon><Timer /></el-icon>
      {{ readingTime }} 分钟阅读
    </span>
    <span class="meta-item">
      <el-icon><Document /></el-icon>
      {{ wordCount }} 字
    </span>
    <span class="meta-item">
      <el-icon><Folder /></el-icon>
      {{ category }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Calendar, User, View, Timer, Document, Folder } from '@element-plus/icons-vue'

defineProps<{
  date: string
  author: string
  views: number
  readingTime: number
  wordCount: number
  category: string
}>()
</script>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0;
  padding: 12px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.meta-item svg {
  color: var(--primary-color);
}
</style>
