<template>
  <div class="toc-container" v-if="items.length > 0">
    <div class="toc-header">
      <el-icon><List /></el-icon>
      <span>目录</span>
    </div>
    <ul class="toc-list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="toc-item"
        :class="[
          `level-${item.level}`,
          { active: activeId === item.id }
        ]"
        @click="handleClick(item.id)"
      >
        <span class="toc-text">{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
export interface TOCItem {
  id: string
  text: string
  level: number
}

defineProps<{
  items: TOCItem[]
  activeId?: string
}>()

const emit = defineEmits<{
  click: [id: string]
}>()

const handleClick = (id: string) => {
  emit('click', id)
}
</script>

<style scoped lang="scss">
.toc-container {
  position: sticky;
  top: 100px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 16px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  box-shadow: var(--shadow);
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  &:hover {
    background: rgba(99, 102, 241, 0.08);
    color: var(--primary-color);
  }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: var(--primary-color);
    font-weight: 500;
  }
  
  &.level-3 {
    padding-left: 24px;
  }
  
  &.level-4 {
    padding-left: 36px;
  }
}

.toc-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
