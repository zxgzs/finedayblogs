<template>
  <div v-if="visible" :style="{ width: progress + '%' }" class="reading-progress"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const visible = defineModel<boolean>('visible')

const handleScroll = () => {
  if (!visible.value) return
  
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = Math.min((scrollTop / docHeight) * 100, 100)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  z-index: 10000;
  transition: width 0.1s;
}
</style>
