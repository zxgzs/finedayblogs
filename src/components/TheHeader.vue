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

        <el-dropdown trigger="click" @command="handleActionCommand" placement="bottom-end">
          <button class="action-btn more-btn" title="更多功能">
            <el-icon :size="18">
              <MoreFilled/>
            </el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                :command="'eye-care'"
                :class="{ active: isEyeCareMode }"
              >
                <el-icon><Sunrise/></el-icon>
                <span>护眼模式</span>
                <el-switch v-model="isEyeCareMode" size="small" @click.stop />
              </el-dropdown-item>

              <el-dropdown-item
                :command="'music'"
                :class="{ active: showMusicPlayer }"
              >
                <el-icon><Headset/></el-icon>
                <span>音乐播放器</span>
                <el-switch v-model="showMusicPlayer" size="small" @click.stop />
              </el-dropdown-item>

              <el-dropdown-item :command="'settings'">
                <el-icon><Setting/></el-icon>
                <span>设置</span>
                <span class="shortcut-hint">S</span>
              </el-dropdown-item>

              <el-dropdown-item :command="'help'">
                <el-icon><QuestionFilled/></el-icon>
                <span>帮助</span>
                <span class="shortcut-hint">?</span>
              </el-dropdown-item>

              <el-dropdown-item :command="'admin'">
                <el-icon><User/></el-icon>
                <span>管理后台</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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

const handleActionCommand = (command: string) => {
  switch (command) {
    case 'settings':
      showSettings.value = true
      break
    case 'help':
      showKeyboardHints.value = !showKeyboardHints.value
      break
    case 'admin':
      router.push('/admin')
      break
    case 'eye-care':
    case 'music':
      // 这些功能通过 v-model 绑定处理
      break
  }
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
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.25);
  backdrop-filter: blur(15px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 240, 245, 0.85));
  border-bottom: 2px solid transparent;
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      rgba(255, 182, 193, 0.8), 
      rgba(255, 105, 180, 0.8), 
      rgba(199, 21, 133, 0.8), 
      rgba(255, 105, 180, 0.8), 
      rgba(255, 182, 193, 0.8));
    background-size: 200% 100%;
    animation: gradientMove 4s linear infinite;
  }

  &::after {
    content: '🌸';
    position: absolute;
    top: -15px;
    right: 30%;
    font-size: 20px;
    animation: floatSakura 3s ease-in-out infinite;
    pointer-events: none;
  }
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes floatSakura {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
    opacity: 1;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '✨';
    position: absolute;
    top: -8px;
    right: -5px;
    font-size: 14px;
    animation: twinkle 2s ease-in-out infinite;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 105, 180, 0.2));
    transform: scale(1.05);
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #ffb6c1, #ff69b4, #c71585);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  animation: logoFloat 3s ease-in-out infinite;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: inherit;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shine 2s linear infinite;
  }
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.gradient-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff69b4, #c71585, #ff1493);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: '~';
    color: #ff69b4;
    margin-left: 4px;
    animation: wiggle 1s ease-in-out infinite;
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;

  &::before {
    content: '💕';
    position: absolute;
    left: -15px;
    top: 50%;
    font-size: 12px;
    animation: heartFloat 2s ease-in-out infinite;
    animation-delay: 0s;
  }

  &::after {
    content: '💕';
    position: absolute;
    right: -15px;
    top: 50%;
    font-size: 12px;
    animation: heartFloat 2s ease-in-out infinite;
    animation-delay: 1s;
  }
}

@keyframes heartFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-8px) scale(1.2);
    opacity: 1;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 28px 10px 18px;
  border-radius: 25px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: visible;
  font-weight: 600;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(255, 182, 193, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ffb6c1, #ff69b4);
    opacity: 0;
    transform: scale(1.2);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: -1;
    border-radius: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    right: 8px;
    top: -10px;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s ease;
    font-size: 14px;
    z-index: 10;
  }

  &:hover {
    transform: translateY(-4px) scale(1.08);
    color: white;
    box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
    border-color: transparent;

    &::before {
      opacity: 1;
      transform: scale(1);
    }

    &::after {
      opacity: 1;
      transform: scale(1);
      content: '☆';
    }
  }

  &.active {
    background: linear-gradient(135deg, #ff69b4, #c71585);
    color: white;
    border-color: transparent;
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
    animation: cuteBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

    &::after {
      content: '⭐';
      opacity: 1;
      transform: scale(1);
    }
  }

  &.dropdown-trigger {
    cursor: pointer;
  }
}

@keyframes cuteBounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-8px); }
  50% { transform: translateY(-2px); }
  75% { transform: translateY(-5px); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;

  &::before {
    content: '🎀';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    animation: ribbonWave 2s ease-in-out infinite;
  }
}

@keyframes ribbonWave {
  0%, 100% { transform: translateY(-50%) rotate(-5deg); }
  50% { transform: translateY(-50%) rotate(5deg); }
}

.action-btn {
  width: 44px;
  height: 44px;
  border: 2px solid rgba(255, 182, 193, 0.5);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  color: #ff69b4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(255, 182, 193, 0.2);

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(135deg, #ffb6c1, #ff69b4, #c71585);
    opacity: 0;
    z-index: -1;
    transition: all 0.3s ease;
  }

  &:hover {
    color: white;
    border-color: transparent;
    transform: scale(1.15) rotate(360deg);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);

    &::before {
      opacity: 1;
    }
  }

  &.is-active {
    background: linear-gradient(135deg, #ff69b4, #c71585);
    color: white;
    border-color: transparent;
    animation: cutePulse 2s ease-in-out infinite;

    &::after {
      content: '💖';
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 12px;
      animation: heartBeat 1s ease-in-out infinite;
    }
  }

  &.has-signed {
    color: #10b981;
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);

    &::after {
      content: '✓';
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 12px;
      color: #10b981;
      background: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  }
}

@keyframes cutePulse {
  0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5); }
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.1); }
}

.notification-button {
  width: 38px;
  height: 38px;
  border: 2px solid rgba(255, 182, 193, 0.5);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  color: #ff69b4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-size: 16px;

  &:hover {
    background: linear-gradient(135deg, #ff69b4, #c71585);
    color: white;
    border-color: transparent;
    transform: scale(1.15) rotate(10deg);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
  }
}

:deep(.el-dropdown-menu) {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 182, 193, 0.5);
  box-shadow: 0 10px 40px rgba(255, 105, 180, 0.25);
  border-radius: 20px;
  padding: 8px;
  min-width: 200px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffb6c1, #ff69b4, #c71585);
  }

  &::after {
    content: '🎀';
    position: absolute;
    top: -10px;
    right: 20px;
    font-size: 20px;
  }

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 15px;
    color: #6b7280;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    font-weight: 500;
    position: relative;
    margin: 4px 0;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 105, 180, 0.2));
      color: #c71585;
      transform: translateX(8px) scale(1.02);
    }

    &.active {
      background: linear-gradient(135deg, #ff69b4, #c71585);
      color: white;
      transform: scale(1.05);

      &::before {
        content: '⭐';
        position: absolute;
        right: 10px;
        font-size: 12px;
      }
    }

    .el-icon {
      font-size: 18px;
      flex-shrink: 0;
      color: #ff69b4;
    }

    span {
      flex: 1;
    }

    .shortcut-hint {
      margin-left: auto;
      font-size: 11px;
      padding: 4px 10px;
      background: rgba(255, 182, 193, 0.2);
      border-radius: 8px;
      border: 1px solid rgba(255, 182, 193, 0.4);
      color: #c71585;
      font-weight: 600;
    }

    .el-switch {
      margin-left: auto;
      flex-shrink: 0;
    }
  }
}

.more-btn {
  &:hover {
    transform: rotate(90deg) scale(1.15);
    background: linear-gradient(135deg, #ff69b4, #c71585);
    color: white;
    border-color: transparent;
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);

    &::after {
      content: '✨';
      position: absolute;
      top: -12px;
      right: -8px;
      font-size: 12px;
    }
  }
}

/* 二次元装饰元素 */
.nav-icon {
  font-size: 16px;
  transition: all 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.2) rotate(10deg);
}

/* 添加可爱的悬浮提示 */
.logo[title] {
  position: relative;

  &::before {
    content: attr(title);
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%) scale(0);
    background: linear-gradient(135deg, #ff69b4, #c71585);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 10;
  }

  &:hover::before {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}
</style>
