<template>
  <div class="audio-player-container">
    <div class="player-header">
      <div class="audio-cover">
        <el-icon class="cover-icon"><Headset /></el-icon>
      </div>
      <div class="audio-info">
        <h3 class="audio-title">{{ audio.title }}</h3>
        <p class="audio-description">{{ audio.description }}</p>
      </div>
    </div>

    <div class="player-controls">
      <div class="progress-container">
        <span class="time-display current-time">{{ formatTime(currentTime) }}</span>
        <div
          class="progress-bar"
          ref="progressBar"
          @click="seekTo"
        >
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          >
            <div class="progress-handle" />
          </div>
        </div>
        <span class="time-display duration">{{ audio.duration }}</span>
      </div>

      <div class="control-buttons">
        <el-button
          circle
          :icon="isPlaying ? VideoPause : VideoPlay"
          @click="togglePlay"
          size="large"
          type="primary"
        />
        <div class="volume-control">
          <el-icon @click="toggleMute">
            <Mute v-if="isMuted || volume === 0" />
            <MuteNotification v-else />
          </el-icon>
          <el-slider
            v-model="volume"
            :show-tooltip="false"
            :step="0.1"
            :max="1"
            @input="updateVolume"
            class="volume-slider"
          />
        </div>
      </div>

      <div class="speed-control">
        <span class="speed-label">速度</span>
        <el-select v-model="playbackRate" size="small" style="width: 80px">
          <el-option label="0.5x" :value="0.5" />
          <el-option label="0.75x" :value="0.75" />
          <el-option label="1x" :value="1" />
          <el-option label="1.25x" :value="1.25" />
          <el-option label="1.5x" :value="1.5" />
          <el-option label="2x" :value="2" />
        </el-select>
      </div>
    </div>

    <audio
      ref="audioElement"
      :src="audio.url"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Headset,
  VideoPlay,
  VideoPause,
  Mute,
  MuteNotification
} from '@element-plus/icons-vue'
import type { Audio } from '@/data/portfolio'

interface Props {
  audio: Audio
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false
})

const audioElement = ref<HTMLAudioElement>()
const progressBar = ref<HTMLElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const playbackRate = ref(1)

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

watch(volume, (newVolume) => {
  if (audioElement.value) {
    audioElement.value.volume = newVolume
    isMuted.value = newVolume === 0
  }
})

watch(playbackRate, (newRate) => {
  if (audioElement.value) {
    audioElement.value.playbackRate = newRate
  }
})

const togglePlay = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const seekTo = (e: MouseEvent) => {
  if (!progressBar.value || !audioElement.value) return

  const rect = progressBar.value.getBoundingClientRect()
  const percentage = (e.clientX - rect.left) / rect.width
  audioElement.value.currentTime = percentage * duration.value
}

const updateVolume = (value: number) => {
  if (audioElement.value) {
    audioElement.value.volume = value
    isMuted.value = value === 0
  }
}

const toggleMute = () => {
  if (!audioElement.value) return

  if (isMuted.value) {
    audioElement.value.volume = volume.value > 0 ? volume.value : 0.8
    isMuted.value = false
  } else {
    audioElement.value.volume = 0
    isMuted.value = true
  }
}

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 自动播放
if (props.autoplay) {
  setTimeout(() => {
    togglePlay()
  }, 500)
}
</script>

<style scoped lang="scss">
.audio-player-container {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .player-header {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    .audio-cover {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .cover-icon {
        font-size: 40px;
        color: white;
      }
    }

    .audio-info {
      flex: 1;
      min-width: 0;

      .audio-title {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .audio-description {
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  .player-controls {
    .progress-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;

      .time-display {
        font-size: 13px;
        color: var(--text-secondary);
        font-family: monospace;
        min-width: 50px;
        text-align: center;
      }

      .progress-bar {
        flex: 1;
        height: 8px;
        background: var(--bg-secondary);
        border-radius: 4px;
        cursor: pointer;
        position: relative;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
          border-radius: 4px;
          position: relative;
          transition: width 0.1s linear;

          .progress-handle {
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        }

        &:hover .progress-handle {
          transform: translateY(-50%) scale(1.2);
        }
      }
    }

    .control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-bottom: 16px;

      .volume-control {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 20px;
          color: var(--text-secondary);
          cursor: pointer;

          &:hover {
            color: var(--text-primary);
          }
        }

        .volume-slider {
          width: 100px;
        }
      }
    }

    .speed-control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      .speed-label {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
  }
}

@media (max-width: 768px) {
  .audio-player-container {
    padding: 16px;

    .player-header {
      .audio-cover {
        width: 60px;
        height: 60px;

        .cover-icon {
          font-size: 30px;
        }
      }

      .audio-info {
        .audio-title {
          font-size: 16px;
        }

        .audio-description {
          font-size: 13px;
        }
      }
    }

    .player-controls {
      .control-buttons {
        .volume-control {
          .volume-slider {
            width: 80px;
          }
        }
      }
    }
  }
}
</style>
