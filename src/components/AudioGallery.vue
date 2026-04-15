<template>
  <div class="audio-gallery">
    <div class="gallery-header">
      <h2>播客/音频</h2>
      <div class="filter-bar">
        <el-radio-group v-model="selectedCategory" size="small">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="cat in categories" :key="cat" :label="cat">{{ cat }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 当前播放器 -->
    <div class="current-player" :style="{ minHeight: currentAudio ? 'auto' : '0', marginBottom: currentAudio ? '24px' : '0' }">
      <AudioPlayer v-if="currentAudio" :audio="currentAudio" />
    </div>

    <!-- 音频列表 -->
    <div class="audio-list">
      <div
        v-for="audio in filteredAudios"
        :key="audio.id"
        class="audio-item"
        :class="{ playing: currentAudio?.id === audio.id && isPlaying }"
        @click="selectAudio(audio)"
      >
        <div class="audio-icon">
          <el-icon v-if="currentAudio?.id === audio.id && isPlaying" class="playing-icon">
            <RefreshRight />
          </el-icon>
          <el-icon v-else>
            <Headset />
          </el-icon>
        </div>

        <div class="audio-content">
          <div class="audio-main">
            <h3 class="audio-title">{{ audio.title }}</h3>
            <p class="audio-description">{{ audio.description }}</p>
          </div>

          <div class="audio-meta">
            <el-tag size="small" type="info">{{ audio.category }}</el-tag>
            <span class="audio-duration">{{ audio.duration }}</span>
            <span class="audio-date">{{ formatDate(audio.publishedAt) }}</span>
          </div>
        </div>

        <div class="audio-action">
          <el-button
            circle
            :icon="currentAudio?.id === audio.id && isPlaying ? VideoPause : VideoPlay"
            @click.stop="togglePlay(audio)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Headset,
  VideoPlay,
  VideoPause,
  RefreshRight
} from '@element-plus/icons-vue'
import { audios, type Audio } from '@/data/portfolio'
import AudioPlayer from './AudioPlayer.vue'

const selectedCategory = ref('')
const currentAudio = ref<Audio | null>(null)
const isPlaying = ref(false)

const categories = computed(() => {
  const cats = new Set(audios.map(a => a.category))
  return Array.from(cats)
})

const filteredAudios = computed(() => {
  if (!selectedCategory.value) {
    return audios
  }
  return audios.filter(a => a.category === selectedCategory.value)
})

const selectAudio = (audio: Audio) => {
  if (currentAudio.value?.id === audio.id) {
    return
  }
  currentAudio.value = audio
  isPlaying.value = false
}

const togglePlay = (audio: Audio) => {
  if (currentAudio.value?.id !== audio.id) {
    currentAudio.value = audio
    isPlaying.value = true
  } else {
    isPlaying.value = !isPlaying.value
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

// 监听播放状态变化
watch(isPlaying, (newState) => {
  // 这里可以添加其他逻辑，比如发送统计等
})
</script>

<style scoped lang="scss">
.audio-gallery {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden;
  min-height: 600px;

  .gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .filter-bar {
      display: flex;
      gap: 12px;
    }
  }

  .current-player {
    margin-bottom: 24px;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden;
  }

  .audio-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden;

    .audio-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--bg-card);
      padding: 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      width: 100% !important;
      min-width: 100% !important;
      box-sizing: border-box !important;
      overflow-x: hidden;

      &:hover {
        background: var(--bg-secondary);
      }

      &.playing {
        background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.05));
        border-color: var(--color-primary);
      }

      .audio-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .el-icon {
          font-size: 24px;
          color: white;
        }

        .playing-icon {
          animation: rotate 2s linear infinite;
        }
      }

      .audio-content {
        flex: 1;
        min-width: 0;
        width: 100% !important;
        box-sizing: border-box !important;
        overflow-x: hidden;

        .audio-main {
          margin-bottom: 8px;

          .audio-title {
            margin: 0 0 6px 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .audio-description {
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        .audio-meta {
          display: flex;
          align-items: center;
          gap: 12px;

          .audio-duration {
            font-size: 12px;
            color: var(--text-secondary);
          }

          .audio-date {
            font-size: 12px;
            color: var(--text-secondary);
          }
        }
      }

      .audio-action {
        flex-shrink: 0;
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .audio-gallery {
    .gallery-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .audio-list {
      .audio-item {
        padding: 12px;

        .audio-icon {
          width: 40px;
          height: 40px;

          .el-icon {
            font-size: 20px;
          }
        }

        .audio-content {
          .audio-main {
            .audio-title {
              font-size: 14px;
            }

            .audio-description {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
