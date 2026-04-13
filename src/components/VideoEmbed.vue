<template>
  <div class="video-embed-container">
    <!-- Bilibili 视频嵌入 -->
    <iframe
      v-if="platform === 'bilibili'"
      :src="`//player.bilibili.com/player.html?bvid=${videoId}&high_quality=1&danmaku=0`"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      :width="width"
      :height="height"
    />

    <!-- YouTube 视频嵌入 -->
    <iframe
      v-else-if="platform === 'youtube'"
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      :width="width"
      :height="height"
    />

    <!-- Vimeo 视频嵌入 -->
    <iframe
      v-else-if="platform === 'vimeo'"
      :src="`https://player.vimeo.com/video/${videoId}`"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      :width="width"
      :height="height"
    />

    <!-- 不支持的平台 -->
    <div v-else class="unsupported-platform">
      <el-icon><VideoCamera /></el-icon>
      <p>不支持的视频平台: {{ platform }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoCamera } from '@element-plus/icons-vue'

interface Props {
  platform: 'bilibili' | 'youtube' | 'vimeo'
  videoId: string
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '500px'
})
</script>

<style scoped lang="scss">
.video-embed-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  iframe {
    display: block;
    border: none;
  }

  .unsupported-platform {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--text-secondary);
    background: var(--bg-secondary);

    .el-icon {
      font-size: 48px;
      margin-bottom: 16px;
      color: var(--color-primary);
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
