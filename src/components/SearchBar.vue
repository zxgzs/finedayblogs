<template>
  <div class="search-section glassmorphism border-flow">
    <div class="search-bar">
      <el-input
        :model-value="searchValue"
        :placeholder="placeholder"
        class="search-input"
        clearable
        size="large"
        @update:model-value="emitUpdate"
        @keyup.enter="$emit('search')"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button 
        type="primary" 
        size="large" 
        class="btn-flow magnetic"
        @click="$emit('search')"
      >
        <el-icon><Search /></el-icon>
        {{ searchButtonText }}
      </el-button>
    </div>
    
    <div v-if="showFilters" class="filter-row">
      <span class="filter-label">分类:</span>
      <el-tag
        v-for="cat in categories"
        :key="cat"
        :class="{ 'active-tag': categoryValue === cat }"
        class="filter-tag magnetic"
        @click="$emit('update:modelCategory', cat)"
      >
        {{ cat }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  modelCategory?: string
  placeholder?: string
  searchButtonText?: string
  categories?: string[]
  showFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  modelCategory: '全部',
  placeholder: '搜索文章标题或内容...',
  searchButtonText: '搜索',
  categories: () => [],
  showFilters: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:modelCategory': [value: string]
  search: []
}>()

const searchValue = props.modelValue
const categoryValue = props.modelCategory

const emitUpdate = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.search-section {
  background: var(--card-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  .search-input {
    flex: 1;
  }
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  .filter-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .filter-tag {
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &.active-tag {
      background: var(--primary-color);
      color: #000;
      border-color: var(--primary-color);
    }
  }
}
</style>
