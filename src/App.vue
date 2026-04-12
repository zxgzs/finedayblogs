<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- 搜索遮罩层 -->
    <div class="search-overlay" v-if="showSearch" @click="showSearch = false"></div>

    <!-- 设置面板遮罩层 -->
    <div v-if="showSettings" class="settings-overlay" @click="showSettings = false"></div>

    <!-- 极光背景 -->
    <div class="aurora-bg"></div>

    <!-- 科技感光球 -->
    <div class="tech-orb orb-1"></div>
    <div class="tech-orb orb-2"></div>
    <div class="tech-orb orb-3"></div>

    <!-- 网格扭曲背景 -->
    <div class="grid-distortion"></div>

    <!-- 闪烁光点 -->
    <div class="sparkle-bg">
      <div v-for="i in 30" :key="i" class="sparkle" :style="getSparkleStyle(i)"></div>
    </div>

    <!-- 粒子背景 -->
    <div class="particles-container" ref="particlesRef">
      <div 
        v-for="i in 30" 
        :key="i" 
        class="star" 
        :style="getStarStyle(i)"
      ></div>
    </div>

    <!-- 扫描线 -->
    <div class="scan-line"></div>

    <!-- 鼠标跟随光效 -->
    <div 
      class="cursor-glow" 
      ref="cursorGlow"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
    ></div>

    <!-- 噪点叠加层 -->
    <div class="noise-overlay"></div>

    <!-- 阅读进度条 -->
    <div class="reading-progress" :style="{ width: readingProgress + '%' }"></div>

    <!-- 回到顶部 -->
    <div class="back-to-top" :class="{ visible: showBackToTop }" @click="scrollToTop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </div>

    <!-- 通知 -->
    <transition name="fade">
      <div
        v-if="notification.visible"
        class="notification"
        :class="notification.type"
      >
        <el-icon v-if="notification.type === 'success'"><CircleCheck /></el-icon>
        <el-icon v-else-if="notification.type === 'error'"><CircleClose /></el-icon>
        <el-icon v-else-if="notification.type === 'warning'"><Warning /></el-icon>
        <el-icon v-else><InfoFilled /></el-icon>
        {{ notification.message }}
      </div>
    </transition>

    <!-- 阅读能量条详情面板 -->
    <div class="energy-detail-panel" v-if="showEnergyDetail" @click.stop>
      <div class="energy-header">
        <span class="energy-title">
          <el-icon><Lightning /></el-icon>
          阅读能量
        </span>
        <span class="close-btn" @click="showEnergyDetail = false">
          <el-icon><Close /></el-icon>
        </span>
      </div>
      <div class="energy-body">
        <div class="current-level">
          <div class="level-badge">Lv.{{ energyLevel }}</div>
          <div class="level-title">{{ levelTitle }}</div>
        </div>
        <div class="energy-progress-section">
          <div class="progress-label">
            <span>当前能量</span>
            <span>{{ currentEnergy }} / {{ maxEnergy }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (currentEnergy / maxEnergy * 100) + '%' }"></div>
          </div>
        </div>
        <div class="energy-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalReadTime }}</span>
            <span class="stat-label">累计阅读(分钟)</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ marathonCount }}</span>
            <span class="stat-label">完成马拉松</span>
          </div>
        </div>
        <div class="level-rewards">
          <div class="rewards-title">称号墙</div>
          <div class="rewards-list">
            <div
              v-for="badge in badges"
              :key="badge.id"
              class="badge-item"
              :class="{ unlocked: badge.unlocked }"
              :title="badge.name + ': ' + badge.desc"
            >
              <span class="badge-icon">{{ badge.icon }}</span>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 音乐播放器 -->
    <div
      ref="musicPlayerRef"
      class="music-player"
      :class="{ open: showMusicPlayer, draggable: isDragging }"
      :style="{ transform: `translate(${musicPlayerPosition.x}px, ${musicPlayerPosition.y}px)` }"
      @click.stop
    >
      <div class="player-header" @mousedown="startDrag">
        <span class="player-title">
          <el-icon><Headset /></el-icon>
          背景音乐
        </span>
        <span class="close-btn" @click.stop="closeMusicPlayer">
          <el-icon><Close /></el-icon>
        </span>
      </div>
      <div class="player-body">
        <div class="now-playing">
          <div class="album-art">
            <div class="album-placeholder" :class="{ playing: isMusicPlaying }">
              <el-icon :size="32"><Headset /></el-icon>
            </div>
          </div>
          <div class="track-info">
            <div class="track-name">{{ currentTrack.name }}</div>
            <div class="track-artist">{{ currentTrack.artist }}</div>
          </div>
        </div>
        <div class="player-controls">
          <el-slider
            v-model="musicVolume"
            :show-tooltip="false"
            @input="updateVolume"
            size="small"
          />
          <div class="volume-icon" @click="toggleMute">
            <el-icon v-if="musicVolume > 0 && !isMuted"><Bell /></el-icon>
            <el-icon v-else-if="musicVolume > 0 && isMuted"><MuteNotification /></el-icon>
            <el-icon v-else><Close /></el-icon>
          </div>
        </div>
        <div class="playback-controls">
          <button class="control-btn" @click="prevTrack">
            <el-icon><VideoPause /></el-icon>
          </button>
          <button class="control-btn play-btn" :class="{ playing: isMusicPlaying }" @click="togglePlay">
            <el-icon v-if="!isMusicPlaying"><VideoPlay /></el-icon>
            <el-icon v-else><VideoPause /></el-icon>
          </button>
          <button class="control-btn stop-btn" @click="stopMusic" title="停止音乐">
            <el-icon><Close /></el-icon>
          </button>
          <button class="control-btn" @click="nextTrack">
            <el-icon><VideoPlay /></el-icon>
          </button>
        </div>
        <div class="track-list">
          <div
            v-for="(track, index) in playlist"
            :key="index"
            class="track-item"
            :class="{ active: currentTrackIndex === index }"
            @click="selectTrack(index)"
          >
            <span class="track-index">{{ index + 1 }}</span>
            <span class="track-name">{{ track.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 签到弹窗 -->
    <div class="sign-dialog" v-if="showSignDialog" @click.stop>
      <div class="sign-content">
        <div class="sign-header">
          <span class="sign-title">每日签到</span>
          <span class="close-btn" @click="showSignDialog = false">
            <el-icon><Close /></el-icon>
          </span>
        </div>
        <div class="sign-body">
          <div class="sign-calendar">
            <div class="calendar-header">
              <span v-for="day in ['日','一','二','三','四','五','六']" :key="day">{{ day }}</span>
            </div>
            <div class="calendar-days">
              <span
                v-for="(day, index) in calendarDays"
                :key="index"
                :class="{
                  'signed': signedDays.includes(day),
                  'today': day === today && signedDays.includes(day)
                }"
              >{{ day }}</span>
            </div>
          </div>
          <div class="sign-stats">
            <div class="stat-item">
              <span class="stat-value">{{ signedDays.length }}</span>
              <span class="stat-label">累计签到</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ currentStreak }}</span>
              <span class="stat-label">连续签到</span>
            </div>
          </div>
          <el-button
            type="primary"
            size="large"
            :disabled="hasSignedToday"
            class="sign-btn"
            @click="handleSign"
          >
            <el-icon v-if="!hasSignedToday"><Calendar /></el-icon>
            <el-icon v-else><CircleCheck /></el-icon>
            {{ hasSignedToday ? '今日已签到' : '立即签到' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="settings-panel" :class="{ open: showSettings }" @click.stop>
      <div class="settings-header">
        <h3>
          <el-icon><Setting /></el-icon>
          博客设置
        </h3>
        <span class="close-btn" @click="showSettings = false">
          <el-icon><Close /></el-icon>
        </span>
      </div>
      <div class="settings-content">
        <div class="setting-item">
          <div class="setting-label">
            <el-icon><Moon v-if="!isDarkMode" /><Sunny v-else /></el-icon>
            深色模式
          </div>
          <el-switch v-model="isDarkMode" @change="toggleTheme" />
          <p class="setting-desc">开启后切换到深色主题</p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <el-icon><Sunrise /></el-icon>
            自动夜间模式
          </div>
          <el-switch v-model="autoDarkMode" @change="saveAutoDarkMode" />
          <p class="setting-desc">晚 8 点至早 7 点自动深色模式</p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <el-icon><View /></el-icon>
            显示阅读进度
          </div>
          <el-switch v-model="showReadingProgress" @change="saveShowReadingProgress" />
          <p class="setting-desc">在文章页面显示阅读进度条</p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <el-icon><Timer /></el-icon>
            阅读字号
          </div>
          <el-slider v-model="fontSize" :min="14" :max="20" :step="1" @change="saveFontSize" />
          <p class="setting-desc">调整文章正文字号大小</p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <el-icon><List /></el-icon>
            显示目录
          </div>
          <el-switch v-model="showToc" @change="saveShowToc" />
          <p class="setting-desc">在文章详情页显示文章目录</p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <el-icon><MagicStick /></el-icon>
            动画效果
          </div>
          <el-switch v-model="enableAnimations" @change="saveEnableAnimations" />
          <p class="setting-desc">开启页面切换动画</p>
        </div>

        <el-divider />

        <div class="setting-item">
          <div class="setting-label">
            <el-icon><InfoFilled /></el-icon>
            关于博客
          </div>
          <p class="setting-desc">版本: 3.0.0</p>
          <p class="setting-desc">基于 Vue 3 + Element Plus 构建</p>
        </div>
      </div>
    </div>

    <!-- 键盘快捷键提示 -->
    <div class="keyboard-hints" v-if="showKeyboardHints">
      <div class="hint-title">
        <el-icon><Keyboard /></el-icon>
        快捷键
      </div>
      <div class="hint-item">
        <kbd>Ctrl</kbd><kbd>K</kbd> 全局搜索
      </div>
      <div class="hint-item">
        <kbd>G</kbd> <kbd>H</kbd> 首页
      </div>
      <div class="hint-item">
        <kbd>G</kbd> <kbd>A</kbd> 关于
      </div>
      <div class="hint-item">
        <kbd>G</kbd> <kbd>C</kbd> 联系
      </div>
      <div class="hint-item">
        <kbd>G</kbd> <kbd>T</kbd> 时光机
      </div>
      <div class="hint-item">
        <kbd>T</kbd> 切换主题
      </div>
      <div class="hint-item">
        <kbd>E</kbd> 护眼模式
      </div>
      <div class="hint-item">
        <kbd>M</kbd> 音乐播放
      </div>
      <div class="hint-item">
        <kbd>P</kbd> 专注模式
      </div>
      <div class="hint-item">
        <kbd>S</kbd> 设置
      </div>
      <div class="hint-item">
        <kbd>J</kbd> <kbd>K</kbd> 上下篇
      </div>
      <div class="hint-item">
        <kbd>Space</kbd> 下一页
      </div>
      <div class="hint-item">
        <kbd>F</kbd> 全屏
      </div>
      <div class="hint-item">
        <kbd>?</kbd> 帮助
      </div>
      <div class="hint-item">
        <kbd>Esc</kbd> 关闭弹窗（音乐播放器除外）
      </div>
    </div>

    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <el-icon><Edit /></el-icon>
          </div>
          <span class="gradient-text animated-gradient-text">我的博客</span>
        </router-link>
        <nav class="nav-menu">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item magnetic"
            :class="{ active: route.path === item.path }"
          >
            <span class="nav-icon"><el-icon><component :is="item.icon" /></el-icon></span>
            <span class="nav-text">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- 全局搜索 -->
        <div class="header-search">
          <div class="search-trigger" @click="showSearch = !showSearch">
            <el-icon><Search /></el-icon>
            <span class="search-hint">搜索</span>
            <kbd>Ctrl</kbd><kbd>K</kbd>
          </div>
          <div class="search-panel" v-if="showSearch" @click.stop>
            <el-input
              v-model="searchQuery"
              placeholder="输入关键词搜索文章..."
              size="large"
              autofocus
              @keydown.esc="showSearch = false"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <div class="search-results" v-if="searchQuery.trim()">
              <div
                v-for="article in searchResults"
                :key="article.id"
                class="search-result-item"
                @click="goToArticle(article.id)"
              >
                <div class="result-title">{{ article.title }}</div>
                <div class="result-meta">
                  <span><el-icon><Calendar /></el-icon>{{ article.date }}</span>
                  <span><el-icon><View /></el-icon>{{ article.views }}</span>
                </div>
              </div>
              <div v-if="searchResults.length === 0" class="no-results">
                未找到相关文章
              </div>
            </div>
            <div class="search-tips" v-else>
              <p>输入标题、内容或标签搜索</p>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <!-- 阅读能量条显示 -->
          <div class="energy-display" v-if="currentEnergy > 0" @click="showEnergyDetail = !showEnergyDetail">
            <div class="energy-icon">
              <el-icon><Lightning /></el-icon>
            </div>
            <div class="energy-bar">
              <div class="energy-fill" :style="{ width: (currentEnergy / maxEnergy * 100) + '%' }"></div>
            </div>
            <span class="energy-level">Lv.{{ energyLevel }}</span>
          </div>

          <button
            class="action-btn sign-btn"
            :class="{ 'has-signed': hasSignedToday }"
            @click="showSignDialog = true"
            title="每日签到"
          >
            <el-icon :size="18"><Calendar /></el-icon>
          </button>
          <button
            class="action-btn"
            :class="{ 'is-active': isDarkMode }"
            @click="toggleTheme"
            title="切换主题 (T)"
          >
            <el-icon :size="18"><Moon v-if="!isDarkMode" /><Sunny v-else /></el-icon>
          </button>
          <button
            class="action-btn eye-care-btn"
            :class="{ 'is-active': isEyeCareMode }"
            @click="toggleEyeCareMode"
            title="护眼模式"
          >
            <el-icon :size="18"><Sunrise /></el-icon>
          </button>
          <button
            class="action-btn"
            :class="{ 'is-active': showMusicPlayer }"
            @click="openMusicPlayer"
            title="音乐播放器"
          >
            <el-icon :size="18"><Headset /></el-icon>
          </button>
          <button class="action-btn" @click="showSettings = true" title="设置 (S)">
            <el-icon :size="18"><Setting /></el-icon>
          </button>
          <button class="action-btn" @click="showKeyboardHints = !showKeyboardHints" title="帮助 (?)">
            <el-icon :size="18"><QuestionFilled /></el-icon>
          </button>
          <router-link to="/admin" class="action-btn" title="管理后台">
            <el-icon :size="18"><User /></el-icon>
          </router-link>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in" :disabled="!enableAnimations">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p class="copyright">
          © 2026 我的个人博客 · Made with
          <el-icon style="color: #f56c6c;"><Star /></el-icon>
          by Vue 3
        </p>
        <div class="footer-links">
          <router-link to="/about">关于我们</router-link>
          <router-link to="/contact">联系方式</router-link>
          <router-link to="/admin">管理后台</router-link>
          <a href="#" @click.prevent="showNotification('功能开发中...', 'info')">隐私政策</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Moon, Sunny, Lightning, Sunrise, Headset, VideoPlay, VideoPause, Bell, MuteNotification, Close } from '@element-plus/icons-vue'
import { articles } from '@/data/articles'

const route = useRoute()
const router = useRouter()

const isDarkMode = ref(false)
const showBackToTop = ref(false)
const showSettings = ref(false)
const showKeyboardHints = ref(false)
const readingProgress = ref(0)
const showReadingProgress = ref(true)
const showToc = ref(true)
const fontSize = ref(16)
const enableAnimations = ref(true)
const mouseX = ref(0)
const mouseY = ref(0)
const particlesRef = ref<HTMLElement | null>(null)
const cursorGlow = ref<HTMLElement | null>(null)

// 全局搜索
const showSearch = ref(false)
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

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
  searchQuery.value = ''
  showSearch.value = false
}

// 自动夜间模式
const autoDarkMode = ref(false)

const saveAutoDarkMode = () => {
  localStorage.setItem('auto_dark_mode', String(autoDarkMode.value))
}

const loadAutoDarkMode = () => {
  const stored = localStorage.getItem('auto_dark_mode')
  if (stored) autoDarkMode.value = stored === 'true'
}

const checkAutoDarkMode = () => {
  if (!autoDarkMode.value) return

  const hour = new Date().getHours()
  // 晚上 8 点到早上 7 点自动深色模式
  if (hour >= 20 || hour < 7) {
    if (!isDarkMode.value) {
      isDarkMode.value = true
      document.documentElement.classList.add('dark-mode')
    }
  } else {
    if (isDarkMode.value) {
      isDarkMode.value = false
      document.documentElement.classList.remove('dark-mode')
    }
  }
}

// 签到功能
const showSignDialog = ref(false)
const signedDays = ref<number[]>([])
const today = new Date().getDate()

const hasSignedToday = computed(() => signedDays.value.includes(today))

const currentStreak = computed(() => {
  let streak = 0
  const now = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    if (signedDays.value.includes(date.getDate())) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
})

const calendarDays = computed(() => {
  const days = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let i = 0; i < firstDay; i++) {
    days.push(0)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  return days
})

const loadSignedDays = () => {
  const stored = localStorage.getItem('signed_days')
  if (stored) {
    const data = JSON.parse(stored)
    // 只保留当月的签到记录
    const now = new Date()
    if (data.year === now.getFullYear() && data.month === now.getMonth()) {
      signedDays.value = data.days
    }
  }
}

const handleSign = () => {
  if (hasSignedToday.value) return

  signedDays.value.push(today)
  localStorage.setItem('signed_days', JSON.stringify({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    days: signedDays.value
  }))

  showNotification(`签到成功！已连续签到 ${currentStreak.value} 天`, 'success')
}

const notification = ref({
  visible: false,
  message: '',
  type: 'info' as 'success' | 'warning' | 'error' | 'info'
})

const navItems = [
  { path: '/', name: '首页', icon: 'HomeFilled' },
  { path: '/tags', name: '标签', icon: 'PriceTag' },
  { path: '/archives', name: '归档', icon: 'Folder' },
  { path: '/time-machine', name: '时光机', icon: 'Clock' },
  { path: '/history', name: '历史', icon: 'Memo' },
  { path: '/about', name: '关于', icon: 'User' },
  { path: '/contact', name: '联系', icon: 'Message' }
]

// 生成星星样式
const getStarStyle = (_index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const duration = 2 + Math.random() * 4
  const delay = Math.random() * 5
  const size = 1 + Math.random() * 2
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    '--duration': `${duration}s`,
    animationDelay: `${delay}s`
  }
}

// 护眼模式
const isEyeCareMode = ref(false)

const toggleEyeCareMode = () => {
  isEyeCareMode.value = !isEyeCareMode.value
  localStorage.setItem('eye_care_mode', String(isEyeCareMode.value))
  if (isEyeCareMode.value) {
    document.documentElement.classList.add('eye-care-mode')
    showNotification('护眼模式已开启', 'success')
  } else {
    document.documentElement.classList.remove('eye-care-mode')
    showNotification('护眼模式已关闭', 'info')
  }
}

// 阅读能量系统
const currentEnergy = ref(0)
const totalReadTime = ref(0) // 分钟
const marathonCount = ref(0)
const showEnergyDetail = ref(false)

const maxEnergy = ref(100)
const energyLevel = computed(() => Math.floor(totalReadTime.value / 30) + 1)

const levelTitles = ['阅读新手', '阅读学徒', '阅读达人', '阅读专家', '知识猎手', '技术大咖', '资深博主', '知识大师', '思想领袖', '传奇读者']
const levelTitle = computed(() => {
  const level = Math.min(energyLevel.value, levelTitles.length) - 1
  return levelTitles[level]
})

const badges = ref([
  { id: 1, name: '首次阅读', icon: '📖', desc: '完成第一篇文章阅读', unlocked: false, requirement: 1 },
  { id: 2, name: '阅读达人', icon: '📚', desc: '阅读5篇文章', unlocked: false, requirement: 5 },
  { id: 3, name: '阅读专家', icon: '🎓', desc: '阅读20篇文章', unlocked: false, requirement: 20 },
  { id: 4, name: '知识猎手', icon: '🔍', desc: '阅读50篇文章', unlocked: false, requirement: 50 },
  { id: 5, name: '马拉松选手', icon: '🏃', desc: '完成一次阅读马拉松', unlocked: false, requirement: 1 },
  { id: 6, name: '连续7日', icon: '🔥', desc: '连续阅读7天', unlocked: false, requirement: 7 },
  { id: 7, name: '能量满格', icon: '⚡', desc: '能量值达到100', unlocked: false, requirement: 100 },
  { id: 8, name: '资深读者', icon: '🌟', desc: '累计阅读100分钟', unlocked: false, requirement: 100 },
])

const loadEnergyData = () => {
  const stored = localStorage.getItem('reading_energy')
  if (stored) {
    const data = JSON.parse(stored)
    currentEnergy.value = data.currentEnergy || 0
    totalReadTime.value = data.totalReadTime || 0
    marathonCount.value = data.marathonCount || 0
    // 检查徽章
    badges.value.forEach(badge => {
      if (badge.id === 1 && totalReadTime.value > 0) badge.unlocked = true
      if (badge.id === 2 && totalReadTime.value >= 5) badge.unlocked = true
      if (badge.id === 3 && totalReadTime.value >= 20) badge.unlocked = true
      if (badge.id === 4 && totalReadTime.value >= 50) badge.unlocked = true
      if (badge.id === 5 && marathonCount.value > 0) badge.unlocked = true
      if (badge.id === 7 && currentEnergy.value >= 100) badge.unlocked = true
      if (badge.id === 8 && totalReadTime.value >= 100) badge.unlocked = true
    })
  }
}

const saveEnergyData = () => {
  localStorage.setItem('reading_energy', JSON.stringify({
    currentEnergy: currentEnergy.value,
    totalReadTime: totalReadTime.value,
    marathonCount: marathonCount.value
  }))
}

const addReadingTime = (minutes: number) => {
  totalReadTime.value += minutes
  currentEnergy.value = Math.min(currentEnergy.value + minutes, maxEnergy.value)
  saveEnergyData()
  checkBadges()
}

const checkBadges = () => {
  badges.value.forEach(badge => {
    if (!badge.unlocked) {
      if (badge.id === 1 && totalReadTime.value >= 1) badge.unlocked = true
      if (badge.id === 2 && totalReadTime.value >= 5) badge.unlocked = true
      if (badge.id === 3 && totalReadTime.value >= 20) badge.unlocked = true
      if (badge.id === 4 && totalReadTime.value >= 50) badge.unlocked = true
      if (badge.id === 7 && currentEnergy.value >= 100) badge.unlocked = true
      if (badge.id === 8 && totalReadTime.value >= 100) badge.unlocked = true
    }
  })
}

// 音乐播放器
const showMusicPlayer = ref(false)
const isMusicPlaying = ref(false)
const musicVolume = ref(50)
const isMuted = ref(false)
const currentTrackIndex = ref(0)
const audioPlayer = ref<HTMLAudioElement | null>(null)
const musicPlayerRef = ref<HTMLElement | null>(null)

// 拖拽状态
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const musicPlayerPosition = ref({ x: 0, y: 0 })

const playlist = ref([
  { name: '宁静时光', artist: '轻音乐', url: '' },
  { name: '咖啡馆氛围', artist: '爵士乐', url: '' },
  { name: '雨后森林', artist: '自然音', url: '' },
  { name: '专注工作', artist: '古典乐', url: '' },
])

const currentTrack = computed(() => playlist.value[currentTrackIndex.value] || playlist.value[0])

const togglePlay = () => {
  if (!audioPlayer.value) {
    audioPlayer.value = new Audio()
    audioPlayer.value.volume = musicVolume.value / 100
    audioPlayer.value.muted = isMuted.value
    audioPlayer.value.loop = true
    
    audioPlayer.value.addEventListener('ended', () => {
      nextTrack()
    })
  }

  if (isMusicPlaying.value) {
    audioPlayer.value.pause()
    isMusicPlaying.value = false
    showNotification('音乐已暂停', 'info')
  } else {
    const track = currentTrack.value
    if (track.url) {
      audioPlayer.value.src = track.url
      audioPlayer.value.play()
      isMusicPlaying.value = true
      showNotification(`正在播放: ${track.name}`, 'success')
    } else {
      showNotification('暂无音频文件', 'warning')
    }
  }
}

const stopMusic = () => {
  // 停止音乐并重置状态
  isMusicPlaying.value = false

  if (audioPlayer.value) {
    try {
      audioPlayer.value.pause()
      audioPlayer.value.currentTime = 0
      audioPlayer.value.src = ''
    } catch (error) {
      console.error('停止音乐失败:', error)
    }
  }
}

const closeMusicPlayer = () => {
  showMusicPlayer.value = false
  stopMusic()
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioPlayer.value) {
    audioPlayer.value.muted = isMuted.value
  }
}

const updateVolume = (val: number) => {
  musicVolume.value = val
  if (audioPlayer.value) {
    audioPlayer.value.volume = val / 100
  }
}

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length
  loadCurrentTrack()
}

const nextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length
  loadCurrentTrack()
}

const loadCurrentTrack = () => {
  if (audioPlayer.value && isMusicPlaying.value) {
    const track = currentTrack.value
    if (track.url) {
      audioPlayer.value.src = track.url
      audioPlayer.value.play()
    }
  }
}

const selectTrack = (index: number) => {
  currentTrackIndex.value = index
  if (audioPlayer.value && isMusicPlaying.value) {
    const track = playlist.value[index]
    if (track.url) {
      audioPlayer.value.src = track.url
      audioPlayer.value.play()
    }
  }
}

// 打开音乐播放器
const openMusicPlayer = () => {
  if (!showMusicPlayer.value) {
    // 如果位置还没设置过，设置初始位置到右下角
    if (musicPlayerPosition.value.x === 0 && musicPlayerPosition.value.y === 0) {
      const playerWidth = 300
      const playerHeight = 450 // 更准确的估计
      musicPlayerPosition.value = {
        x: window.innerWidth - playerWidth - 20,
        y: window.innerHeight - playerHeight - 80
      }
    }
    showMusicPlayer.value = true
  }
}

// 音乐播放器拖拽
const startDrag = (e: MouseEvent) => {
  // 检查是否点击的是关闭按钮
  const target = e.target as HTMLElement
  if (target.closest('.close-btn')) return

  if (!musicPlayerRef.value) return
  isDragging.value = true

  const rect = musicPlayerRef.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !musicPlayerRef.value) return

  const x = e.clientX - dragOffset.value.x
  const y = e.clientY - dragOffset.value.y

  // 限制在视口内
  const maxX = window.innerWidth - musicPlayerRef.value.offsetWidth
  const maxY = window.innerHeight - musicPlayerRef.value.offsetHeight

  musicPlayerPosition.value = {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY))
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 全局通知方法
const showNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  notification.value = { visible: true, message, type }
  setTimeout(() => {
    notification.value.visible = false
  }, 3000)
}

provide('showNotification', showNotification)
provide('showToc', showToc)
provide('fontSize', fontSize)
provide('showReadingProgress', showReadingProgress)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('dark_mode', String(isDarkMode.value))
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

const saveShowReadingProgress = () => {
  localStorage.setItem('show_progress', String(showReadingProgress.value))
}

const saveFontSize = () => {
  localStorage.setItem('font_size', String(fontSize.value))
}

const saveShowToc = () => {
  localStorage.setItem('show_toc', String(showToc.value))
}

const saveEnableAnimations = () => {
  localStorage.setItem('enable_animations', String(enableAnimations.value))
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight

  showBackToTop.value = scrollTop > 300

  if (showReadingProgress.value && docHeight > 0) {
    readingProgress.value = Math.min((scrollTop / docHeight) * 100, 100)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  
  // 更新磁吸效果元素的相对位置
  updateMagneticElements(e)
}

const handleClick = (e: MouseEvent) => {
  createRipple(e.clientX, e.clientY)
}

// 创建点击涟漪效果
const createRipple = (x: number, y: number) => {
  const ripple = document.createElement('div')
  ripple.className = 'ripple-effect'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  document.body.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 800)
}

// 窗口大小改变处理
const handleWindowResize = () => {
  if (musicPlayerRef.value && showMusicPlayer.value) {
    const maxX = window.innerWidth - musicPlayerRef.value.offsetWidth
    const maxY = window.innerHeight - musicPlayerRef.value.offsetHeight

    // 确保播放器在视口内
    musicPlayerPosition.value = {
      x: Math.max(0, Math.min(musicPlayerPosition.value.x, maxX)),
      y: Math.max(0, Math.min(musicPlayerPosition.value.y, maxY))
    }
  }
}

// 磁吸效果
const magneticElements = ref<HTMLElement[]>([])
const updateMagneticElements = (e: MouseEvent) => {
  magneticElements.value.forEach(el => {
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const distance = Math.sqrt(distX * distX + distY * distY)
    const maxDistance = 150
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance * 10
      const moveX = distX / distance * strength
      const moveY = distY / distance * strength
      el.style.transform = `translate(${moveX}px, ${moveY}px)`
    } else {
      el.style.transform = 'translate(0, 0)'
    }
  })
}

// 生成闪烁光点样式
const getSparkleStyle = (_index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 3
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl+K 打开搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    showSearch.value = !showSearch.value
    return
  }

  // 忽略输入框中的按键，但保留 Escape
  const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
  const key = e.key.toLowerCase()

  // Escape 始终生效
  if (key === 'escape') {
    showSettings.value = false
    showKeyboardHints.value = false
    showEnergyDetail.value = false
    return
  }

  // 在输入框中不处理其他快捷键
  if (isInput) return

  // 阻止默认行为以避免浏览器快捷键冲突
  let handled = true

  switch (key) {
    case 't':
      toggleTheme()
      break
    case 's':
      showSettings.value = !showSettings.value
      break
    case '/':
    case '?':
      showKeyboardHints.value = !showKeyboardHints.value
      break
    case 'e':
      toggleEyeCareMode()
      break
    case 'm':
      openMusicPlayer()
      break
    case 'p':
      // 专注模式切换
      toggleFocusMode()
      break
    case 'g':
      window._gKeyPending = true
      setTimeout(() => { window._gKeyPending = false }, 1000)
      handled = false // g 键需要组合使用，不阻止
      break
    default:
      handled = false
  }

  if (handled) {
    e.preventDefault()
  }

  // G+键组合
  if (window._gKeyPending && !handled) {
    window._gKeyPending = false
    switch (key) {
      case 'h':
        router.push('/')
        break
      case 'a':
        router.push('/about')
        break
      case 'c':
        router.push('/contact')
        break
      case 't':
        router.push('/time-machine')
        break
    }
  }
}

// 专注模式
const isFocusMode = ref(false)

const toggleFocusMode = () => {
  isFocusMode.value = !isFocusMode.value
  if (isFocusMode.value) {
    document.documentElement.classList.add('focus-mode')
    showNotification('专注模式已开启，按 Esc 退出', 'success')
  } else {
    document.documentElement.classList.remove('focus-mode')
    showNotification('专注模式已关闭', 'info')
  }
}

provide('toggleFocusMode', toggleFocusMode)
provide('isFocusMode', isFocusMode)
provide('addReadingTime', addReadingTime)

onMounted(() => {
  // 加载设置
  const storedDarkMode = localStorage.getItem('dark_mode')
  if (storedDarkMode === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark-mode')
  }

  const storedFontSize = localStorage.getItem('font_size')
  if (storedFontSize) fontSize.value = parseInt(storedFontSize)

  const storedShowToc = localStorage.getItem('show_toc')
  if (storedShowToc) showToc.value = storedShowToc === 'true'

  const storedProgress = localStorage.getItem('show_progress')
  if (storedProgress) showReadingProgress.value = storedProgress === 'true'

  const storedAnimations = localStorage.getItem('enable_animations')
  if (storedAnimations) enableAnimations.value = storedAnimations === 'true'

  // 加载自动夜间模式
  loadAutoDarkMode()
  checkAutoDarkMode()
  // 每分钟检查一次时间
  setInterval(checkAutoDarkMode, 60000)

  // 加载签到记录
  loadSignedDays()

  // 加载阅读能量数据
  loadEnergyData()

  // 加载护眼模式
  const storedEyeCare = localStorage.getItem('eye_care_mode')
  if (storedEyeCare === 'true') {
    isEyeCareMode.value = true
    document.documentElement.classList.add('eye-care-mode')
  }

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('click', handleClick)
  window.addEventListener('resize', handleWindowResize)
  
  // 初始化磁吸效果元素
  setTimeout(() => {
    magneticElements.value = Array.from(document.querySelectorAll('.magnetic'))
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('click', handleClick)
  window.removeEventListener('resize', handleWindowResize)

  // 停止音乐播放并销毁 Audio 对象
  stopMusic()
  if (audioPlayer.value) {
    audioPlayer.value = null
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: relative;
  z-index: 9999;
}

.main-content {
  flex: 1;
}

/* 粒子样式 */
.star {
  position: absolute;
  background: var(--primary-color);
  border-radius: 50%;
  animation: twinkle var(--duration, 3s) ease-in-out infinite;
  box-shadow: 0 0 6px var(--primary-color);
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.5);
  }
}

/* 鼠标跟随光效 */
.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: left 0.15s ease-out, top 0.15s ease-out;
}

/* 键盘快捷键提示面板 */
.keyboard-hints {
  position: fixed;
  top: 80px;
  right: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-lg);
  z-index: 10000;
  min-width: 200px;
  animation: slideIn 0.2s ease;

  .hint-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);

    svg {
      color: var(--primary-color);
    }
  }

  .hint-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    font-size: 14px;
    color: var(--text-secondary);

    :deep(kbd) {
      display: inline-block;
      padding: 4px 8px;
      font-size: 12px;
      font-family: inherit;
      font-weight: 600;
      color: var(--text-primary);
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      box-shadow: 0 2px 0 var(--border-color);
      min-width: 24px;
      text-align: center;
    }
  }
}

/* 签到弹窗样式 */
.sign-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 360px;
  animation: signPop 0.3s ease;

  .sign-content {
    .sign-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);

      .sign-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .close-btn {
        cursor: pointer;
        color: var(--text-muted);
        transition: color 0.3s;

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .sign-body {
      padding: 20px;

      .sign-calendar {
        background: var(--card-glass);
        border-radius: var(--radius);
        padding: 12px;
        margin-bottom: 16px;

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          text-align: center;

          span {
            width: 28px;
            height: 28px;
            line-height: 28px;
            border-radius: 50%;
            font-size: 12px;
            color: var(--text-muted);
            margin: 0 auto;

            &.signed {
              background: linear-gradient(135deg, var(--primary-color), var(--info-color));
              color: white;
            }

            &.today {
              border: 2px solid var(--primary-color);
            }
          }
        }
      }

      .sign-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 16px;

        .stat-item {
          text-align: center;

          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
            display: block;
          }

          .stat-label {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
      }

      .sign-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
      }
    }
  }
}

@keyframes signPop {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes signPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(103, 194, 58, 0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 全局搜索样式 */
.header-search {
  position: relative;

  .search-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--card-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-secondary);
    font-size: 13px;

    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .search-hint {
      font-size: 13px;
    }

    kbd {
      padding: 1px 4px;
      font-size: 10px;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 3px;
    }
  }

  .search-panel {
    position: fixed;
    top: 60px;
    right: 20px;
    width: 360px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    animation: searchSlide 0.2s ease;
    z-index: 10000;

    :deep(.el-input__wrapper) {
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .search-results {
    max-height: 360px;
    overflow-y: auto;

    .search-result-item {
      padding: 12px 14px;
      cursor: pointer;
      transition: background 0.2s;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(0, 212, 255, 0.1);
      }

      .result-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
        font-size: 14px;
      }

      .result-meta {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: var(--text-muted);

        span {
          display: flex;
          align-items: center;
          gap: 3px;
        }
      }
    }

    .no-results {
      padding: 20px;
      text-align: center;
      color: var(--text-muted);
    }
  }

  .search-tips {
    padding: 16px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }
}

.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9998;
}

.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1999;
  cursor: pointer;
}

@keyframes searchSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 能量条显示 */
.energy-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary-color);
  }

  .energy-icon {
    color: #fbbf24;
    display: flex;
  }

  .energy-bar {
    width: 60px;
    height: 6px;
    background: var(--bg-color);
    border-radius: 3px;
    overflow: hidden;

    .energy-fill {
      height: 100%;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      border-radius: 3px;
      transition: width 0.3s;
    }
  }

  .energy-level {
    font-size: 12px;
    font-weight: 700;
    color: #fbbf24;
  }
}

/* 能量详情面板 */
.energy-detail-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10002;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 380px;
  animation: signPop 0.3s ease;

  .energy-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);

    .energy-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: var(--text-primary);

      svg {
        color: #fbbf24;
      }
    }

    .close-btn {
      cursor: pointer;
      color: var(--text-muted);

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .energy-body {
    padding: 20px;

    .current-level {
      text-align: center;
      margin-bottom: 20px;

      .level-badge {
        display: inline-block;
        padding: 8px 24px;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: #000;
        font-weight: 800;
        font-size: 20px;
        border-radius: var(--radius-full);
        margin-bottom: 8px;
      }

      .level-title {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }

    .energy-progress-section {
      margin-bottom: 20px;

      .progress-label {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .progress-bar {
        height: 8px;
        background: var(--bg-color);
        border-radius: 4px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          transition: width 0.3s;
        }
      }
    }

    .energy-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }

    .level-rewards {
      .rewards-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .rewards-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          background: var(--bg-color);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius);
          opacity: 0.5;
          transition: all 0.3s;

          &.unlocked {
            opacity: 1;
            border-style: solid;
            border-color: var(--primary-color);
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
          }

          .badge-icon {
            font-size: 24px;
          }

          .badge-name {
            font-size: 10px;
            color: var(--text-muted);
            text-align: center;
          }
        }
      }
    }
  }
}

/* 音乐播放器 */
.music-player {
  position: fixed;
  width: 300px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  user-select: none;

  &.open {
    opacity: 1;
    visibility: visible;
  }

  &.draggable {
    cursor: move;
    transition: none;
  }

  .player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
    border-bottom: 1px solid var(--border-color);
    cursor: move;

    .player-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 14px;
      color: var(--text-primary);

      svg {
        color: var(--primary-color);
      }
    }

    .close-btn {
      cursor: pointer;
      color: var(--text-muted);

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .player-body {
    padding: 16px;

    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .album-art {
        width: 56px;
        height: 56px;
        flex-shrink: 0;

        .album-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          &.playing {
            animation: pulse 1.5s ease infinite;
          }
        }
      }

      .track-info {
        flex: 1;
        min-width: 0;

        .track-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-artist {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }

    .player-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .volume-icon {
        cursor: pointer;
        color: var(--text-muted);

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .playback-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      .control-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--bg-color);
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &:hover {
          background: var(--primary-color);
          color: white;
        }

        &.play-btn {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;

          &.playing {
            animation: pulse 1.5s ease infinite;
          }
        }

        &.stop-btn {
          &:hover {
            background: #f56c6c;
          }
        }
      }
    }

    .track-list {
      max-height: 150px;
      overflow-y: auto;

      .track-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: var(--radius);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 212, 255, 0.1);
        }

        &.active {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2));

          .track-index {
            color: var(--primary-color);
          }

          .track-name {
            color: var(--primary-color);
          }
        }

        .track-index {
          width: 20px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .track-name {
          flex: 1;
          font-size: 13px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 专注模式 */
.focus-mode .header,
.focus-mode .sidebar,
.focus-mode .footer,
.focus-mode .article-toc {
  display: none !important;
}

.focus-mode .main-content {
  max-width: 800px;
  margin: 0 auto;
}

.focus-mode .article-detail {
  padding: 60px;
}

/* 护眼模式 */
.eye-care-mode {
  --bg-color: #fdf6e3 !important;
  --text-primary: #5c4d3c !important;
  --text-secondary: #7a6b5a !important;
  --text-muted: #9a8b7a !important;
  --card-bg: #fff8dc !important;
  --border-color: #e6d5b8 !important;
  --primary-color: #d4a056 !important;
  background: #fdf6e3 !important;
}

/* 淡入淡出阅读动画 */
.fade-in-read .article-content p,
.fade-in-read .article-content h2,
.fade-in-read .article-content h3,
.fade-in-read .article-content ul,
.fade-in-read .article-content ol,
.fade-in-read .article-content blockquote,
.fade-in-read .article-content pre {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 导航快捷键提示 */
.nav-shortcuts {
  display: flex;
  align-items: center;
  gap: 4px;

  kbd {
    padding: 2px 6px;
    font-size: 10px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--text-muted);
  }
}
</style>
