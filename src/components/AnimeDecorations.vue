<template>
  <div class="anime-decorations">
    <!-- 樱花 -->
    <div v-for="(cherry, index) in cherries" :key="`cherry-${index}`" class="cherry-blossom" :style="cherry.style">
      🌸
    </div>

    <!-- 漂浮的星星 -->
    <div v-for="(star, index) in stars" :key="`star-${index}`" class="star" :style="star.style">
      {{ star.emoji }}
    </div>

    <!-- 漂浮的爱心 -->
    <div v-for="(heart, index) in hearts" :key="`heart-${index}`" class="heart" :style="heart.style">
      💖
    </div>

    <!-- 云朵 -->
    <div class="cloud cloud-1">☁️</div>
    <div class="cloud cloud-2">☁️</div>
    <div class="cloud cloud-3">☁️</div>

    <!-- 闪烁的光点 -->
    <div class="sparkle sparkle-1">✨</div>
    <div class="sparkle sparkle-2">✨</div>
    <div class="sparkle sparkle-3">✨</div>

    <!-- 音符 -->
    <div class="note note-1">🎵</div>
    <div class="note note-2">🎶</div>

    <!-- 蝴蝶 -->
    <div class="butterfly butterfly-1">🦋</div>
    <div class="butterfly butterfly-2">🦋</div>

    <!-- 彩虹 -->
    <div class="rainbow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stars = ref<Array<{ emoji: string; style: any }>>([])
const hearts = ref<Array<{ style: any }>>([])
const cherries = ref<Array<{ style: any }>>([])

const starEmojis = ['⭐', '🌟', '✨', '💫', '🌠']

onMounted(() => {
  // 生成星星
  for (let i = 0; i < 20; i++) {
    stars.value.push({
      emoji: starEmojis[Math.floor(Math.random() * starEmojis.length)],
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (3 + Math.random() * 4) + 's',
        fontSize: (14 + Math.random() * 20) + 'px'
      }
    })
  }

  // 生成爱心
  for (let i = 0; i < 8; i++) {
    hearts.value.push({
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        animationDuration: (4 + Math.random() * 3) + 's',
        fontSize: (20 + Math.random() * 15) + 'px'
      }
    })
  }

  // 生成樱花
  for (let i = 0; i < 12; i++) {
    cherries.value.push({
      style: {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 8 + 's',
        animationDuration: (8 + Math.random() * 6) + 's',
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
  z-index: 0;
  overflow: hidden;
}

.cherry-blossom {
  position: absolute;
  animation: cherryFloat linear infinite;
  opacity: 0.7;
  filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.3));
}

@keyframes cherryFloat {
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

.star {
  position: absolute;
  opacity: 0.7;
  animation: floatStar ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.6));
}

.heart {
  position: absolute;
  opacity: 0.6;
  animation: floatHeart ease-in-out infinite;
  filter: drop-shadow(0 0 12px rgba(255, 105, 180, 0.5));
}

.cloud {
  position: absolute;
  font-size: 56px;
  opacity: 0.35;
  animation: floatCloud linear infinite;
  filter: blur(3px);
}

.cloud-1 {
  top: 8%;
  left: 8%;
  animation-duration: 35s;
  animation-delay: 0s;
}

.cloud-2 {
  top: 18%;
  right: 10%;
  animation-duration: 45s;
  animation-delay: -12s;
}

.cloud-3 {
  top: 55%;
  left: 15%;
  animation-duration: 38s;
  animation-delay: -22s;
}

.sparkle {
  position: absolute;
  font-size: 24px;
  opacity: 0;
  animation: sparkleAnim 2s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.8));
}

.sparkle-1 {
  top: 12%;
  left: 15%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 45%;
  right: 25%;
  animation-delay: 0.8s;
}

.sparkle-3 {
  top: 75%;
  left: 60%;
  animation-delay: 1.6s;
}

.note {
  position: absolute;
  font-size: 28px;
  opacity: 0.6;
  animation: noteFloat ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.4));
}

.note-1 {
  top: 20%;
  left: 10%;
  animation-duration: 6s;
  animation-delay: -2s;
}

.note-2 {
  top: 60%;
  right: 15%;
  animation-duration: 8s;
  animation-delay: -5s;
}

.butterfly {
  position: absolute;
  font-size: 32px;
  opacity: 0.5;
  animation: butterflyFly ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.3));
}

.butterfly-1 {
  top: 15%;
  left: 20%;
  animation-duration: 12s;
  animation-delay: -3s;
}

.butterfly-2 {
  top: 65%;
  right: 25%;
  animation-duration: 15s;
  animation-delay: -7s;
}

.rainbow {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 120px;
  height: 60px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0) 0%,
    rgba(168, 85, 247, 0.3) 20%,
    rgba(251, 191, 36, 0.3) 40%,
    rgba(34, 197, 94, 0.3) 60%,
    rgba(59, 130, 246, 0.3) 80%,
    rgba(168, 85, 247, 0.3) 100%
  );
  border-radius: 30px;
  opacity: 0.4;
  animation: rainbowFloat 20s ease-in-out infinite;
  filter: blur(2px);
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-30px) rotate(180deg) scale(1.2);
  }
}

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(-8deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-40px) scale(1.3) rotate(8deg);
    opacity: 1;
  }
}

@keyframes floatCloud {
  0% {
    transform: translateX(-120px);
  }
  100% {
    transform: translateX(calc(100vw + 120px));
  }
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

@keyframes noteFloat {
  0%, 100% {
    transform: translateY(0) rotate(-15deg);
  }
  50% {
    transform: translateY(-25px) rotate(15deg);
  }
}

@keyframes butterflyFly {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -20px) rotate(10deg);
  }
  50% {
    transform: translate(-15px, -10px) rotate(-5deg);
  }
  75% {
    transform: translate(20px, -25px) rotate(8deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes rainbowFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.05);
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .cloud {
    font-size: 40px !important;
  }

  .star, .heart {
    font-size: 12px !important;
  }

  .note, .butterfly {
    font-size: 20px !important;
  }

  .cherry-blossom {
    font-size: 12px !important;
  }
}
</style>
