<template>
  <div class="search-section glassmorphism border-flow">
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章标题或内容..."
        class="search-input"
        clearable
        @input="handleSearch"
        size="large"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" size="large" class="btn-flow magnetic" @click="handleSearch">
        <el-icon><Search /></el-icon>
        搜索
      </el-button>
    </div>
    <div class="filter-row">
      <span class="filter-label">分类:</span>
      <el-tag
        v-for="cat in ['全部', ...categoryList]"
        :key="cat"
        :class="{ 'active-tag': selectedCategory === cat }"
        class="filter-tag magnetic"
        @click="filterByCategory(cat)"
      >
        {{ cat }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const selectedCategory = ref('全部')

const categoryList = ref(['技术', '生活', '随笔', '教程'])

const emit = defineEmits(['search', 'filter'])

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const filterByCategory = (category: string) => {
  selectedCategory.value = category
  emit('filter', category)
}
</script>

<style scoped>
.search-section {
  padding: 24px;
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
}

.filter-tag {
  cursor: pointer;
  transition: all 0.3s;

  &.active-tag {
    background: var(--primary-color);
    color: white;
  }
}
</style>
