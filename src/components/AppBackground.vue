<template>
  <div class="app-background">
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
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
const particlesRef = ref<HTMLElement | null>(null)
const cursorGlow = ref<HTMLElement | null>(null)

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

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
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
</style>
