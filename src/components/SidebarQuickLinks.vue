<template>
  <div class="sidebar-section quick-links">
    <router-link v-for="link in links" :key="link.to" :to="link.to" class="quick-link magnetic">
      <el-icon><component :is="link.icon" /></el-icon>
      <span>{{ link.text }}</span>
      <el-icon class="arrow"><ArrowRight /></el-icon>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { Star, Clock, ArrowRight } from '@element-plus/icons-vue'

interface QuickLink {
  to: string
  icon: any
  text: string
}

const links = defineProps<QuickLink[]>().links

withDefaults(defineProps<{
  links?: QuickLink[]
}>(), {
  links: () => [
    { to: '/favorites', icon: Star, text: '我的收藏' },
    { to: '/history', icon: Clock, text: '阅读历史' }
  ]
})
</script>

<style scoped>
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;

  svg {
    font-size: 18px;
    color: var(--primary-color);
  }

  span {
    flex: 1;
    font-weight: 500;
  }

  .arrow {
    font-size: 14px;
    color: var(--text-muted);
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
    transform: translateX(4px);

    .arrow {
      transform: translateX(4px);
      color: var(--primary-color);
    }
  }
}
</style>
