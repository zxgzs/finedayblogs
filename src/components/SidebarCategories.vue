<template>
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
        @click="selectCategory(cat.name)"
      >
        <span class="category-name">
          <el-icon><Folder /></el-icon>
          {{ cat.name }}
        </span>
        <span class="category-count">{{ cat.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOpened, Folder } from '@element-plus/icons-vue'

interface Category {
  name: string
  count: number
}

defineProps<{
  categories: Category[]
  selectedCategory: string
}>()

const emit = defineEmits(['select'])

const selectCategory = (name: string) => {
  emit('select', name)
}
</script>

<style scoped>
.categories {
  padding: 20px;
  background: var(--card-glass);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
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

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }

  &.active {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2));
    border: 1px solid var(--primary-color);
  }

  .category-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-primary);
  }

  .category-count {
    font-size: 12px;
    color: var(--text-muted);
    padding: 2px 8px;
    background: var(--bg-color);
    border-radius: var(--radius-full);
  }
}
</style>
