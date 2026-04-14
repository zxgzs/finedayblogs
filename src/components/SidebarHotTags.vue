<template>
  <div class="sidebar-section hot-tags">
    <div class="sidebar-title">
      <el-icon><Collection /></el-icon>
      热门标签
    </div>
    <div class="tag-list">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="tag-item magnetic"
        :class="{ active: selectedTag === tag.name }"
        @click="selectTag(tag.name)"
      >
        {{ tag.name }} ({{ tag.count }})
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Collection } from '@element-plus/icons-vue'

interface Tag {
  name: string
  count: number
}

defineProps<{
  tags: Tag[]
  selectedTag: string
}>()

const emit = defineEmits(['select'])

const selectTag = (name: string) => {
  emit('select', name)
}
</script>

<style scoped>
.hot-tags {
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

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-block;
  padding: 6px 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
  }

  &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}
</style>
