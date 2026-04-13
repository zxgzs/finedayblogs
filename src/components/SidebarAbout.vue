<template>
  <div class="sidebar-section about-me">
    <div class="avatar pulse-ring">
      <el-icon :size="50"><UserFilled /></el-icon>
    </div>
    <div class="name gradient-text">{{ name }}</div>
    <div class="bio">{{ bio }}</div>
    <div class="stats">
      <div class="stat-item magnetic" v-for="(stat, key) in stats" :key="key">
        <div class="stat-value animated-gradient-text">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
    <div class="social-links">
      <a v-for="link in socialLinks" :key="link.title" href="#" class="social-link magnetic" :title="link.title">
        <el-icon><component :is="link.icon" /></el-icon>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserFilled, Brand, Link, Message, Connection } from '@element-plus/icons-vue'

defineProps<{
  name?: string
  bio?: string
  stats?: Array<{ value: number, label: string }>
  socialLinks?: Array<{ icon: any, title: string }>
}>()

withDefaults(defineProps<{
  name: string
  bio: string
  stats: Array<{ value: number, label: string }>
}>(), {
  name: '技术博主',
  bio: '热爱技术,专注前端开发,分享学习心得与实战经验',
  stats: () => [],
  socialLinks: () => [
    { icon: Brand, title: 'GitHub' },
    { icon: Link, title: 'CSDN' },
    { icon: Message, title: '邮箱' },
    { icon: Connection, title: 'RSS' }
  ]
})
</script>

<style scoped>
.about-me {
  text-align: center;
  padding: 24px;
  background: var(--card-glass);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.bio {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
  line-height: 1.6;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  border-radius: var(--radius);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-link {
  width: 42px;
  height: 42px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);

  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 0 20px var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}
</style>
