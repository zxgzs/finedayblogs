<template>
  <div class="anime-decorations">
    <!-- 漂浮的星星 -->
    <div v-for="(star, index) in stars" :key="index" class="star" :style="star.style">
      {{ star.emoji }}
    </div>

    <!-- 漂浮的爱心 -->
    <div v-for="(heart, index) in hearts" :key="`heart-${index}`" class="heart" :style="heart.style">
      ❤️
    </div>

    <!-- 云朵 -->
    <div class="cloud cloud-1">☁️</div>
    <div class="cloud cloud-2">☁️</div>
    <div class="cloud cloud-3">☁️</div>

    <!-- 闪烁的光点 -->
    <div class="sparkle sparkle-1">✨</div>
    <div class="sparkle sparkle-2">✨</div>
    <div class="sparkle sparkle-3">✨</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stars = ref<Array<{ emoji: string; style: any }>>([])
const hearts = ref<Array<{ style: any }>>([])

const starEmojis = ['⭐', '🌟', '✨', '💫', '🌠']

onMounted(() => {
  // 生成星星
  for (let i = 0; i < 15; i++) {
    stars.value.push({
      emoji: starEmojis[Math.floor(Math.random() * starEmojis.length)],
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (3 + Math.random() * 4) + 's',
        fontSize: (12 + Math.random() * 16) + 'px'
      }
    })
  }

  // 生成爱心
  for (let i = 0; i < 5; i++) {
    hearts.value.push({
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        animationDuration: (4 + Math.random() * 3) + 's',
        fontSize: (16 + Math.random() * 12) + 'px'
      }
    })
  }
})
</script>

<style scoped>
.anime-decorations {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.star {
  position: absolute;
  opacity: 0.6;
  animation: floatStar ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5));
}

.heart {
  position: absolute;
  opacity: 0.5;
  animation: floatHeart ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.4));
}

.cloud {
  position: absolute;
  font-size: 48px;
  opacity: 0.3;
  animation: floatCloud linear infinite;
  filter: blur(2px);
}

.cloud-1 {
  top: 10%;
  left: 5%;
  animation-duration: 30s;
  animation-delay: 0s;
}

.cloud-2 {
  top: 20%;
  right: 10%;
  animation-duration: 40s;
  animation-delay: -10s;
}

.cloud-3 {
  top: 60%;
  left: 15%;
  animation-duration: 35s;
  animation-delay: -20s;
}

.sparkle {
  position: absolute;
  font-size: 20px;
  opacity: 0;
  animation: sparkle 2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
}

.sparkle-1 {
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 50%;
  right: 30%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  top: 80%;
  left: 60%;
  animation-delay: 1.4s;
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-20px) rotate(180deg) scale(1.1);
  }
}

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(-5deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-30px) scale(1.2) rotate(5deg);
    opacity: 0.8;
  }
}

@keyframes floatCloud {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .cloud {
    font-size: 32px;
  }

  .star, .heart {
    font-size: 12px !important;
  }
}
</style>
