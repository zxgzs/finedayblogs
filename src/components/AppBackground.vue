<template>
  <div class="app-background" :class="{ 'dark-mode': isDarkMode, 'eye-care-mode': isEyeCareMode }">
    <!-- 背景图片层 -->
    <div class="background-image" :style="{ backgroundImage: `url(${currentBackgroundImage})` }"></div>

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
      <div v-for="i in 30" :key="i" :style="getSparkleStyle(i)" class="sparkle"></div>
    </div>

    <!-- 粒子背景 -->
    <div ref="particlesRef" class="particles-container">
      <div
        v-for="i in 30"
        :key="i"
        :style="getStarStyle(i)"
        class="star"
      ></div>
    </div>

    <!-- 扫描线 -->
    <div class="scan-line"></div>

    <!-- 鼠标跟随光效 -->
    <div
      ref="cursorGlow"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
      class="cursor-glow"
    ></div>

    <!-- 噪点叠加层 -->
    <div class="noise-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 导入背景图片
import bgImg1 from '@/assets/img.png'
import bgImg2 from '@/assets/img_1.png'
import bgImg3 from '@/assets/img_2.png'

const mouseX = ref(0)
const mouseY = ref(0)
const particlesRef = ref<HTMLElement | null>(null)
const cursorGlow = ref<HTMLElement | null>(null)
const isDarkMode = ref(false)
const isEyeCareMode = ref(false)

// 背景图片列表
const backgroundImages = [bgImg1, bgImg2, bgImg3]
const currentBgIndex = ref(0)

// 计算当前背景图片
const currentBackgroundImage = computed(() => backgroundImages[currentBgIndex.value])

// 自动切换背景
let bgInterval: number

const startBackgroundRotation = () => {
  bgInterval = window.setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % backgroundImages.length
  }, 10000) // 每10秒切换一次
}

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

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// 监听主题变化
const watchThemeChanges = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const target = mutation.target as HTMLElement
        isDarkMode.value = target.classList.contains('dark-mode')
        isEyeCareMode.value = target.classList.contains('eye-care-mode')
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return observer
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  startBackgroundRotation()

  // 初始化主题状态
  isDarkMode.value = document.documentElement.classList.contains('dark-mode')
  isEyeCareMode.value = document.documentElement.classList.contains('eye-care-mode')

  // 监听主题变化
  watchThemeChanges()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  clearInterval(bgInterval)
})
</script>

<style scoped>
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* 背景图片 */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.4;
  transition: background-image 1.5s ease-in-out, opacity 0.5s ease;
  z-index: -3;
}

/* 深色模式 */
.app-background.dark-mode .background-image {
  opacity: 0.3;
  filter: brightness(0.7) saturate(0.8);
}

/* 护眼模式 */
.app-background.eye-care-mode .background-image {
  opacity: 0.35;
  filter: brightness(1.1) sepia(0.3) saturate(0.9);
}

/* 深色模式 + 护眼模式 */
.app-background.dark-mode.eye-care-mode .background-image {
  opacity: 0.25;
  filter: brightness(0.6) sepia(0.2) saturate(0.7);
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

/* 深色模式下的光效 */
.app-background.dark-mode .cursor-glow {
  background: radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%);
}

/* 护眼模式下的光效 */
.app-background.eye-care-mode .cursor-glow {
  background: radial-gradient(circle, rgba(212, 160, 86, 0.12) 0%, transparent 70%);
}
</style>
