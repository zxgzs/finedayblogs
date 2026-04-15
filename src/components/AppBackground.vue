<template>
  <div class="app-background" :class="{ 'dark-mode': isDarkMode, 'eye-care-mode': isEyeCareMode }">
    <!-- 背景图片层 -->
    <div class="background-image" :style="{ backgroundImage: `url(${currentBackgroundImage})` }"></div>

    <!-- 樱花飘落 -->
    <div v-for="(cherry, index) in cherries" :key="`cherry-${index}`" class="cherry-fall" :style="cherry.style">
      🌸
    </div>

    <!-- 极光背景 -->
    <div class="aurora-bg"></div>

    <!-- 彩虹光晕 -->
    <div class="rainbow-glow"></div>

    <!-- 科技感光球 -->
    <div class="tech-orb orb-1"></div>
    <div class="tech-orb orb-2"></div>
    <div class="tech-orb orb-3"></div>

    <!-- 网格扭曲背景 -->
    <div class="grid-distortion"></div>

    <!-- 闪烁光点 -->
    <div class="sparkle-bg">
      <div v-for="i in 40" :key="i" :style="getSparkleStyle(i)" class="sparkle"></div>
    </div>

    <!-- 粒子背景 -->
    <div ref="particlesRef" class="particles-container">
      <div
        v-for="i in 40"
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

// 樱花数据
const cherries = ref<Array<{ style: any }>>([])

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
  }, 12000) // 每12秒切换一次
}

// 生成星星样式
const getStarStyle = (_index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const duration = 2 + Math.random() * 4
  const delay = Math.random() * 5
  const size = 2 + Math.random() * 2
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

// 生成樱花样式
const getCherryStyle = (_index: number) => {
  const x = Math.random() * 100
  const delay = Math.random() * 10
  const duration = 8 + Math.random() * 6
  const size = 12 + Math.random() * 8
  return {
    left: `${x}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}px`
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

  // 生成樱花
  for (let i = 0; i < 15; i++) {
    cherries.value.push({
      style: getCherryStyle(i)
    })
  }
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

/* 樱花飘落 */
.cherry-fall {
  position: absolute;
  animation: cherryFall linear infinite;
  opacity: 0.7;
  filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.3));
  pointer-events: none;
}

@keyframes cherryFall {
  0% {
    transform: translateY(-50px) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh) rotate(360deg) scale(1.1);
    opacity: 0;
  }
}

/* 粒子样式 */
.star {
  position: absolute;
  background: var(--primary-color);
  border-radius: 50%;
  animation: twinkle var(--duration, 3s) ease-in-out infinite;
  box-shadow: 0 0 6px var(--primary-color);
  opacity: 0.5;
  pointer-events: none;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

/* 极光背景 */
.aurora-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(168, 85, 247, 0.05) 50%,
    rgba(59, 130, 246, 0.05) 100%
  );
  animation: auroraMove 20s ease-in-out infinite;
  z-index: -2;
  pointer-events: none;
}

@keyframes auroraMove {
  0%, 100% {
    transform: translateX(-10%) translateY(-10%);
  }
  50% {
    transform: translateX(10%) translateY(10%);
  }
}

/* 彩虹光晕 */
.rainbow-glow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(236, 72, 153, 0.03) 0%,
    rgba(168, 85, 247, 0.02) 30%,
    transparent 70%
  );
  animation: rainbowGlow 15s ease-in-out infinite;
  z-index: -1;
  pointer-events: none;
}

@keyframes rainbowGlow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

/* 科技感光球 */
.tech-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
  pointer-events: none;
}

.orb-1 {
  top: 20%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: var(--primary-color);
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-2 {
  top: 60%;
  right: 15%;
  width: 250px;
  height: 250px;
  background: var(--secondary-color);
  animation: orbFloat 10s ease-in-out infinite reverse;
}

.orb-3 {
  bottom: 20%;
  left: 30%;
  width: 200px;
  height: 200px;
  background: var(--accent-color);
  animation: orbFloat 12s ease-in-out infinite;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

/* 网格扭曲背景 */
.grid-distortion {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(236, 72, 153, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(236, 72, 153, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridDistort 30s linear infinite;
  z-index: -1;
  pointer-events: none;
}

@keyframes gridDistort {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 闪烁光点 */
.sparkle-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: sparkleAnim 3s ease-in-out infinite;
  box-shadow: 0 0 10px white, 0 0 20px var(--primary-color);
}

@keyframes sparkleAnim {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 粒子容器 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
}

/* 扫描线 */
.scan-line {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 0, 0, 0.02) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.3;
}

/* 噪点叠加层 */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
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
  background: radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%);
}

/* 护眼模式下的光效 */
.app-background.eye-care-mode .cursor-glow {
  background: radial-gradient(circle, rgba(212, 160, 86, 0.15) 0%, transparent 70%);
}
</style>
