<template>
  <header class="header">
    <div class="header-content">
      <router-link class="logo" to="/">
        <div class="logo-icon">
          <el-icon>
            <Edit/>
          </el-icon>
        </div>
        <span class="gradient-text animated-gradient-text">我的博客</span>
      </router-link>

      <nav class="nav-menu">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :class="{ active: route.path === item.path }"
          :to="item.path"
          class="nav-item magnetic"
        >
          <span class="nav-icon"><el-icon><component :is="item.icon"/></el-icon></span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="header-actions">
        <EnergyDisplay v-if="currentEnergy > 0" @click="showEnergyDetail = !showEnergyDetail" />
        
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
import { Edit, Moon, Sunny, Sunrise, Headset, Setting, QuestionFilled, User, Calendar } from '@element-plus/icons-vue'
import { articles } from '@/data/articles'
import EnergyDisplay from './EnergyDisplay.vue'
import SearchPanel from './SearchPanel.vue'

const route = useRoute()
const router = useRouter()

const isDarkMode = defineModel<boolean>('isDarkMode')
const isEyeCareMode = defineModel<boolean>('isEyeCareMode')
const currentEnergy = defineModel<number>('currentEnergy')
const hasSignedToday = defineModel<boolean>('hasSignedToday')
const showMusicPlayer = defineModel<boolean>('showMusicPlayer')

const showSearch = ref(false)
const showSignDialog = defineModel<boolean>('showSignDialog')
const showSettings = defineModel<boolean>('showSettings')
const showKeyboardHints = defineModel<boolean>('showKeyboardHints')
const showEnergyDetail = defineModel<boolean>('showEnergyDetail')

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

const navItems = [
  {path: '/', name: '首页', icon: 'HomeFilled'},
  {path: '/tags', name: '标签', icon: 'PriceTag'},
  {path: '/archives', name: '归档', icon: 'Folder'},
  {path: '/time-machine', name: '时光机', icon: 'Clock'},
  {path: '/history', name: '历史', icon: 'Memo'},
  {path: '/about', name: '关于', icon: 'User'},
  {path: '/contact', name: '联系', icon: 'Message'}
]

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
  position: relative;
  z-index: 9999;
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
  padding: 8px 16px;
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    color: var(--primary-color);
  }

  &.active {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2));
    color: var(--primary-color);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
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

  &.is-active {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
  }

  &.has-signed {
    color: #67c23a;
  }
}
</style>
