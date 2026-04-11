<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Pet from './pet.js'

const petInstance = ref(null)

onMounted(() => {
  petInstance.value = Pet.init({
    drag: true,
    showChat: true,
    words: [
      '欢迎来到我的博客~',
      '今天也要开心哦！',
      '点击我可以互动哦',
      '记得常来看看呀',
      '写的文章真不错！',
      '给你比个心~',
      '加油加油！',
      '有什么问题可以问我哦'
    ]
  })
})

onUnmounted(() => {
  if (petInstance.value) {
    petInstance.value.destroy()
  }
})
</script>

<template>
  <div></div>
</template>
