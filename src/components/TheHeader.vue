<template>
  <header class="header">
    <div class="header-content">
      <router-link class="logo" to="/">
        <div class="logo-icon">
          <el-icon>
            <Edit/>
          </el-icon>
        </div>
        <span class="gradient-text animated-gradient-text">晴天的博客</span>
      </router-link>

      <nav class="nav-menu">
        <router-link
          v-for="item in mainNavItems"
          :key="item.path"
          :class="{ active: route.path === item.path }"
          :to="item.path"
          class="nav-item magnetic"
        >
          <span class="nav-icon"><el-icon><component :is="item.icon"/></el-icon></span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>

        <el-dropdown trigger="click" @command="handleMenuCommand">
          <div class="nav-item magnetic dropdown-trigger">
            <span class="nav-icon"><el-icon><MoreFilled /></el-icon></span>
            <span class="nav-text">更多</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in moreNavItems"
                :key="item.path"
                :command="item.path"
                :class="{ active: route.path === item.path }"
              >
                <el-icon><component :is="item.icon"/></el-icon>
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </nav>

      <div class="header-actions">
        <EnergyDisplay
          v-if="currentEnergy !== undefined && currentEnergy > 0"
          :current-energy="currentEnergy"
          :max-energy="maxEnergy"
          :energy-level="energyLevel"
          @click="showEnergyDetail = !showEnergyDetail"
        />

        <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
          <el-button
            circle
            :icon="Bell"
            :type="unreadCount > 0 ? 'danger' : 'default'"
            @click="showNotificationPanel = !showNotificationPanel"
            class="notification-button"
          >
          </el-button>
        </el-badge>

        <button
          :class="{ 'has-signed': hasSignedToday }"
          class="action-btn sign-btn"
          title="每日签到"
          @click="showSignDialog = true"
        >
          <el-icon :size="18">
            <Calendar/>
          </el-icon>
        </button>
        
        <button
          :class="{ 'is-active': isDarkMode }"
          class="action-btn"
          title="切换主题 (T)"
          @click="toggleTheme"
        >
          <el-icon :size="18">
            <Moon v-if="!isDarkMode"/>
            <Sunny v-else/>
          </el-icon>
        </button>
        
        <button
          :class="{ 'is-active': isEyeCareMode }"
          class="action-btn eye-care-btn"
          title="护眼模式"
          @click="toggleEyeCareMode"
        >
          <el-icon :size="18">
            <Sunrise/>
          </el-icon>
        </button>
        
        <button
          :class="{ 'is-active': showMusicPlayer }"
          class="action-btn"
          title="音乐播放器"
          @click="openMusicPlayer"
        >
          <el-icon :size="18">
            <Headset/>
          </el-icon>
        </button>
        
        <button class="action-btn" title="设置 (S)" @click="showSettings = true">
          <el-icon :size="18">
            <Setting/>
          </el-icon>
        </button>
        
        <button class="action-btn" title="帮助 (?)" @click="showKeyboardHints = !showKeyboardHints">
          <el-icon :size="18">
            <QuestionFilled/>
          </el-icon>
        </button>
        
        <router-link class="action-btn" title="管理后台" to="/admin">
          <el-icon :size="18">
            <User/>
          </el-icon>
        </router-link>
      </div>
    </div>

    <SearchPanel 
      v-model:show="showSearch" 
      v-model:query="searchQuery" 
      :results="searchResults"
      @go-to-article="goToArticle"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Edit, Moon, Sunny, Sunrise, Headset, Setting, QuestionFilled, User, Calendar, Bell, DataAnalysis, Picture, Plug, MoreFilled } from '@element-plus/icons-vue'
import { articles } from '@/data/articles'
import { notifications } from '@/data/notifications'
import EnergyDisplay from './EnergyDisplay.vue'
import SearchPanel from './SearchPanel.vue'

const route = useRoute()
const router = useRouter()

const isDarkMode = defineModel<boolean>('isDarkMode')
const isEyeCareMode = defineModel<boolean>('isEyeCareMode')
const currentEnergy = defineModel<number>('currentEnergy')
const hasSignedToday = defineModel<boolean>('hasSignedToday')
const showMusicPlayer = defineModel<boolean>('showMusicPlayer')

const props = defineProps<{
  maxEnergy: number
  energyLevel: number
}>()

const showSearch = ref(false)
const showSignDialog = defineModel<boolean>('showSignDialog')
const showSettings = defineModel<boolean>('showSettings')
const showKeyboardHints = defineModel<boolean>('showKeyboardHints')
const showEnergyDetail = defineModel<boolean>('showEnergyDetail')
const showNotificationPanel = defineModel<boolean>('showNotificationPanel')

const unreadCount = computed(() => {
  return notifications.filter(n => !n.read).length
})

const searchQuery = ref('')
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return articles.filter(a =>
    a.title.toLowerCase().includes(query) ||
    a.content.toLowerCase().includes(query) ||
    a.tags.some(t => t.toLowerCase().includes(query))
  ).slice(0, 8)
})

const mainNavItems = [
  {path: '/', name: '首页', icon: 'HomeFilled'},
  {path: '/plugins', name: '脚本插件', icon: 'Plug'},
  {path: '/tags', name: '标签', icon: 'PriceTag'},
  {path: '/archives', name: '归档', icon: 'Folder'},
  {path: '/about', name: '关于', icon: 'User'}
]

const moreNavItems = [
  {path: '/dashboard', name: '数据', icon: 'DataAnalysis'},
  {path: '/gallery', name: '画廊', icon: 'Picture'},
  {path: '/time-machine', name: '时光机', icon: 'Clock'},
  {path: '/history', name: '历史', icon: 'Memo'},
  {path: '/contact', name: '联系', icon: 'Message'}
]

const handleMenuCommand = (path: string) => {
  router.push(path)
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
  searchQuery.value = ''
  showSearch.value = false
}

const emit = defineEmits(['toggleTheme', 'toggleEyeCareMode', 'openMusicPlayer'])

const toggleTheme = () => emit('toggleTheme')
const toggleEyeCareMode = () => emit('toggleEyeCareMode')
const openMusicPlayer = () => emit('openMusicPlayer')
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(255, 107, 157, 0.15);
}

.header::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color), var(--primary-color));
  background-size: 300% 100%;
  animation: gradientMove 3s linear infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background: var(--card-glass);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.gradient-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    opacity: 0;
    transform: translateY(100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
    border-radius: inherit;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    color: white;

    &::before {
      opacity: 0.2;
      transform: translateY(0);
    }
  }

  &.active {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
    animation: bounce 0.5s ease;
  }

  &.dropdown-trigger {
    cursor: pointer;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  background: var(--card-glass);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-color: transparent;
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
  }

  &.is-active {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-color: transparent;
    animation: pulse 2s ease-in-out infinite;
  }

  &.has-signed {
    color: #10b981;
    border-color: #10b981;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.notification-button {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--card-glass);
  border-radius: var(--radius);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

:deep(.el-dropdown-menu) {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  box-shadow: 0 8px 30px rgba(255, 107, 157, 0.2);
  border-radius: var(--radius-xl);
  padding: 12px;
  min-width: 160px;

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(155, 89, 182, 0.15));
      color: var(--primary-color);
      transform: translateX(5px);
    }

    &.active {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      transform: scale(1.02);
    }

    .el-icon {
      font-size: 18px;
    }
  }
}
</style>
