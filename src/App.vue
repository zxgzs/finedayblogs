<template>
	<div :class="{ 'dark-mode': isDarkMode }" class="app">
		<!-- 设置面板遮罩层 -->
		<div v-if="showSettings" class="settings-overlay" @click="showSettings = false"></div>

		<!-- 背景效果 -->
		<AppBackground/>

		<!-- 二次元装饰 -->
		<AnimeDecorations/>

		<!-- 阅读进度条 -->
		<ReadingProgressBar v-model:visible="showReadingProgress"/>

		<!-- 回到顶部 -->
		<BackToTop/>

		<!-- 通知 -->
		<Notification ref="notificationRef"/>

		<!-- 通知中心（抽屉） -->
		<NotificationCenter v-model:showPanel="showNotificationPanel" :show-button="false"/>

		<!-- 阅读能量条详情面板 -->
		<EnergyDetailPanel
			v-model:visible="showEnergyDetail"
			:badges="badges"
			:current-energy="currentEnergy"
			:energy-level="energyLevel"
			:level-title="levelTitle"
			:marathon-count="marathonCount"
			:max-energy="maxEnergy"
			:total-read-time="totalReadTime"
		/>

		<!-- 音乐播放器 -->
		<MusicPlayer
			v-model:position="musicPlayerPosition"
			v-model:visible="showMusicPlayer"
			:current-index="currentTrackIndex"
			:is-muted="isMuted"
			:is-playing="isMusicPlaying"
			:playlist="playlist"
			:volume="musicVolume"
			@close="closeMusicPlayer"
			@next="nextTrack"
			@prev="prevTrack"
			@select="selectTrack"
			@stop="stopMusic"
			@toggle-play="togglePlay"
			@toggle-mute="toggleMute"
		/>

		<!-- 签到弹窗 -->
		<SignDialog
			v-model:visible="showSignDialog"
			:calendar-days="calendarDays"
			:current-streak="currentStreak"
			:has-signed-today="hasSignedToday"
			:signed-days="signedDays"
			:today="today"
			@sign="handleSign"
		/>

		<!-- 设置面板 -->
		<SettingsPanel
			v-model:auto-dark-mode="autoDarkMode"
			v-model:enable-animations="enableAnimations"
			v-model:font-size="fontSize"
			v-model:is-dark-mode="isDarkMode"
			v-model:show-reading-progress="showReadingProgress"
			v-model:show-toc="showToc"
			v-model:visible="showSettings"
		/>

		<!-- 键盘快捷键提示 -->
		<KeyboardHints v-model:visible="showKeyboardHints"/>

		<!-- AI 助手 -->
		<AIAssistant />

		<!-- 头部导航 -->
		<TheHeader
			v-model:current-energy="currentEnergy"
			v-model:has-signed-today="hasSignedToday"
			v-model:is-dark-mode="isDarkMode"
			v-model:is-eye-care-mode="isEyeCareMode"
			v-model:show-energy-detail="showEnergyDetail"
			v-model:show-keyboard-hints="showKeyboardHints"
			v-model:show-music-player="showMusicPlayer"
			v-model:show-notification-panel="showNotificationPanel"
			v-model:show-settings="showSettings"
			v-model:show-sign-dialog="showSignDialog"
			:energy-level="energyLevel"
			:max-energy="maxEnergy"
			@toggle-theme="toggleTheme"
			@toggle-eye-care-mode="toggleEyeCareMode"
			@open-music-player="openMusicPlayer"
		/>

		<!-- 主内容区域 -->
		<main class="main-content">
			<router-view v-slot="{ Component }">
				<transition :disabled="!enableAnimations" mode="out-in" name="fade">
					<component :is="Component"/>
				</transition>
			</router-view>
		</main>

		<!-- 页脚 -->
		<TheFooter/>
	</div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, provide, ref} from 'vue'
import {useRouter} from 'vue-router'

// 布局组件
import AppBackground from '@/components/AppBackground.vue'
import AnimeDecorations from '@/components/AnimeDecorations.vue'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import BackToTop from '@/components/BackToTop.vue'
import ReadingProgressBar from '@/components/ReadingProgressBar.vue'

// 功能组件
import Notification from '@/components/Notification.vue'
import NotificationCenter from '@/components/NotificationCenter.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import KeyboardHints from '@/components/KeyboardHints.vue'
import AIAssistant from '@/components/AIAssistant.vue'

// 游戏化组件
import EnergyDetailPanel from '@/components/EnergyDetailPanel.vue'
import SignDialog from '@/components/SignDialog.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'

const router = useRouter()

const notificationRef = ref()
const isDarkMode = ref(false)
const showSettings = ref(false)
const showKeyboardHints = ref(false)
const showReadingProgress = ref(true)
const showToc = ref(true)
const fontSize = ref(16)
const enableAnimations = ref(true)
const showNotificationPanel = ref(false)

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

// 全局通知方法
const showNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
	if (notificationRef.value) {
		notificationRef.value.show(message, type)
	}
}

provide('showNotification', showNotification)
provide('showToc', showToc)
provide('fontSize', fontSize)
provide('showReadingProgress', showReadingProgress)

// 自动夜间模式
const autoDarkMode = ref(false)

const loadAutoDarkMode = () => {
	const stored = localStorage.getItem('auto_dark_mode')
	if (stored) autoDarkMode.value = stored === 'true'
}

const checkAutoDarkMode = () => {
	if (!autoDarkMode.value) return

	const hour = new Date().getHours()
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

const toggleTheme = () => {
	isDarkMode.value = !isDarkMode.value
	localStorage.setItem('dark_mode', String(isDarkMode.value))
	if (isDarkMode.value) {
		document.documentElement.classList.add('dark-mode')
	} else {
		document.documentElement.classList.remove('dark-mode')
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

// 专注模式
const isFocusMode = ref(false)

const toggleFocusMode = () => {
	isFocusMode.value = !isFocusMode.value
	if (isFocusMode.value) {
		document.documentElement.classList.add('focus-mode')
		showNotification('专注模式已开启,按 Esc 退出', 'success')
	} else {
		document.documentElement.classList.remove('focus-mode')
		showNotification('专注模式已关闭', 'info')
	}
}

provide('toggleFocusMode', toggleFocusMode)
provide('isFocusMode', isFocusMode)

// 阅读能量系统
const currentEnergy = ref(0)
const totalReadTime = ref(0)
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
	{id: 1, name: '首次阅读', icon: '📖', desc: '完成第一篇文章阅读', unlocked: false, requirement: 1},
	{id: 2, name: '阅读达人', icon: '📚', desc: '阅读5篇文章', unlocked: false, requirement: 5},
	{id: 3, name: '阅读专家', icon: '🎓', desc: '阅读20篇文章', unlocked: false, requirement: 20},
	{id: 4, name: '知识猎手', icon: '🔍', desc: '阅读50篇文章', unlocked: false, requirement: 50},
	{id: 5, name: '马拉松选手', icon: '🏃', desc: '完成一次阅读马拉松', unlocked: false, requirement: 1},
	{id: 6, name: '连续7日', icon: '🔥', desc: '连续阅读7天', unlocked: false, requirement: 7},
	{id: 7, name: '能量满格', icon: '⚡', desc: '能量值达到100', unlocked: false, requirement: 100},
	{id: 8, name: '资深读者', icon: '🌟', desc: '累计阅读100分钟', unlocked: false, requirement: 100},
])

const loadEnergyData = () => {
	const stored = localStorage.getItem('reading_energy')
	if (stored) {
		const data = JSON.parse(stored)
		currentEnergy.value = data.currentEnergy || 0
		totalReadTime.value = data.totalReadTime || 0
		marathonCount.value = data.marathonCount || 0
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

provide('addReadingTime', addReadingTime)

// 音乐播放器
const showMusicPlayer = ref(false)
const isMusicPlaying = ref(false)
const musicVolume = ref(50)
const isMuted = ref(false)
const currentTrackIndex = ref(0)
const audioPlayer = ref<HTMLAudioElement | null>(null)
const musicPlayerPosition = ref({x: 0, y: 0})

const playlist = ref([
	{name: '宁静时光', artist: '轻音乐', url: ''},
	{name: '咖啡馆氛围', artist: '爵士乐', url: ''},
	{name: '雨后森林', artist: '自然音', url: ''},
	{name: '专注工作', artist: '古典乐', url: ''},
])

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
		const track = playlist.value[currentTrackIndex.value]
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
		const track = playlist.value[currentTrackIndex.value]
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

const openMusicPlayer = () => {
	if (!showMusicPlayer.value) {
		if (musicPlayerPosition.value.x === 0 && musicPlayerPosition.value.y === 0) {
			const playerWidth = 300
			const playerHeight = 450
			musicPlayerPosition.value = {
				x: window.innerWidth - playerWidth - 20,
				y: window.innerHeight - playerHeight - 80
			}
		}
		showMusicPlayer.value = true
	}
}

const handleWindowResize = () => {
	if (showMusicPlayer.value) {
		const maxX = window.innerWidth - 300
		const maxY = window.innerHeight - 450
		musicPlayerPosition.value = {
			x: Math.max(0, Math.min(musicPlayerPosition.value.x, maxX)),
			y: Math.max(0, Math.min(musicPlayerPosition.value.y, maxY))
		}
	}
}

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
	if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
		e.preventDefault()
		showNotification('搜索功能请使用页面内搜索', 'info')
		return
	}

	const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
	const key = e.key.toLowerCase()

	if (key === 'escape') {
		showSettings.value = false
		showKeyboardHints.value = false
		showEnergyDetail.value = false
		return
	}

	if (isInput) return

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
			toggleFocusMode()
			break
		case 'g':
			window._gKeyPending = true
			setTimeout(() => {
				window._gKeyPending = false
			}, 1000)
			handled = false
			break
		default:
			handled = false
	}

	if (handled) {
		e.preventDefault()
	}

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

onMounted(() => {
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

	loadAutoDarkMode()
	checkAutoDarkMode()
	setInterval(checkAutoDarkMode, 60000)

	loadSignedDays()
	loadEnergyData()

	const storedEyeCare = localStorage.getItem('eye_care_mode')
	if (storedEyeCare === 'true') {
		isEyeCareMode.value = true
		document.documentElement.classList.add('eye-care-mode')
	}

	window.addEventListener('keydown', handleKeydown)
	window.addEventListener('resize', handleWindowResize)

	if (window.OML2D) {
		let models = ['HK416-2-destroy/model.json']
		window.OML2D.loadOml2d({
			menus: {},
			models: models.map(model => {
				return {
					path: `/models/${model}`,
					position: [0, -40],
					stageStyle: {
						height: 600
					}
				}
			}),
		})
	}
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown)
	window.removeEventListener('resize', handleWindowResize)
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
	position: relative;
}

.main-content {
	flex: 1;
}

.settings-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	z-index: 1999;
	cursor: pointer;
}

/* 专注模式 */
:global(.focus-mode .header),
:global(.focus-mode .footer),
:global(.focus-mode .article-toc) {
	display: none !important;
}

:global(.focus-mode .main-content) {
	max-width: 800px;
	margin: 0 auto;
}

/* 护眼模式 */
:global(.eye-care-mode) {
	--bg-color: #faf5e6 !important;
	--bg-secondary: #f5edd8 !important;
	--text-primary: #4a4036 !important;
	--text-secondary: #6b5d52 !important;
	--text-muted: #9a8a7d !important;
	--card-bg: rgba(255, 251, 235, 0.5) !important;
	--card-glass: rgba(255, 251, 235, 0.4) !important;
	--card-higher-opacity: rgba(255, 251, 235, 0.85) !important;
	--border-color: rgba(212, 160, 86, 0.2) !important;
	--primary-color: #d4a056 !important;
	background: #faf5e6 !important;
}
</style>
