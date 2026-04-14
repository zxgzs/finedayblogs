<template>
  <div
    ref="musicPlayerRef"
    :class="{ open: visible, draggable: isDragging }"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    class="music-player"
    @click.stop
  >
    <div class="player-header" @mousedown="startDrag">
      <span class="player-title">
        <el-icon><Headset/></el-icon>
        背景音乐
      </span>
      <span class="close-btn" @click.stop="close">
        <el-icon><Close/></el-icon>
      </span>
    </div>
    <div class="player-body">
      <div class="now-playing">
        <div class="album-art">
          <div :class="{ playing: isPlaying }" class="album-placeholder">
            <el-icon :size="32">
              <Headset/>
            </el-icon>
          </div>
        </div>
        <div class="track-info">
          <div class="track-name">{{ currentTrack.name }}</div>
          <div class="track-artist">{{ currentTrack.artist }}</div>
        </div>
      </div>
      <div class="player-controls">
        <el-slider
          :model-value="volume"
          :show-tooltip="false"
          size="small"
          @input="updateVolume"
        />
        <div class="volume-icon" @click="toggleMute">
          <el-icon v-if="volume > 0 && !isMuted">
            <Bell/>
          </el-icon>
          <el-icon v-else-if="volume > 0 && isMuted">
            <MuteNotification/>
          </el-icon>
          <el-icon v-else>
            <Close/>
          </el-icon>
        </div>
      </div>
      <div class="playback-controls">
        <button class="control-btn" @click="prevTrack">
          <el-icon>
            <VideoPause/>
          </el-icon>
        </button>
        <button :class="{ playing: isPlaying }" class="control-btn play-btn" @click="togglePlay">
          <el-icon v-if="!isPlaying">
            <VideoPlay/>
          </el-icon>
          <el-icon v-else>
            <VideoPause/>
          </el-icon>
        </button>
        <button class="control-btn stop-btn" title="停止音乐" @click="stopMusic">
          <el-icon>
            <Close/>
          </el-icon>
        </button>
        <button class="control-btn" @click="nextTrack">
          <el-icon>
            <VideoPlay/>
          </el-icon>
        </button>
      </div>
      <div class="track-list">
        <div
          v-for="(track, index) in playlist"
          :key="index"
          :class="{ active: currentIndex === index }"
          class="track-item"
          @click="selectTrack(index)"
        >
          <span class="track-index">{{ index + 1 }}</span>
          <span class="track-name">{{ track.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Headset, Close, Bell, MuteNotification, VideoPlay, VideoPause } from '@element-plus/icons-vue'

interface Track {
  name: string
  artist: string
  url: string
}

interface Position {
  x: number
  y: number
}

const visible = defineModel<boolean>('visible')
const position = defineModel<Position>('position', { default: { x: 0, y: 0 } })

const props = defineProps<{
  isPlaying: boolean
  volume: number
  isMuted: boolean
  currentIndex: number
  playlist: Track[]
}>()

const emit = defineEmits(['toggle-play', 'stop', 'prev', 'next', 'select', 'update:volume', 'toggle-mute', 'close'])

const musicPlayerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragOffset = ref({x: 0, y: 0})

const currentTrack = computed(() => props.playlist[props.currentIndex] || props.playlist[0])

const startDrag = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.close-btn')) return

  if (!musicPlayerRef.value) return
  isDragging.value = true

  const rect = musicPlayerRef.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !musicPlayerRef.value) return

  const x = e.clientX - dragOffset.value.x
  const y = e.clientY - dragOffset.value.y

  const maxX = window.innerWidth - musicPlayerRef.value.offsetWidth
  const maxY = window.innerHeight - musicPlayerRef.value.offsetHeight

  position.value = {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY))
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const togglePlay = () => emit('toggle-play')
const stopMusic = () => emit('stop')
const prevTrack = () => emit('prev')
const nextTrack = () => emit('next')
const selectTrack = (index: number) => emit('select', index)
const updateVolume = (val: number | number[]) => emit('update:volume', val)
const toggleMute = () => emit('toggle-mute')
const close = () => emit('close')

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.music-player {
  position: fixed;
  width: 300px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  user-select: none;

  &.open {
    opacity: 1;
    visibility: visible;
  }

  &.draggable {
    cursor: move;
    transition: none;
  }

  .player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
    border-bottom: 1px solid var(--border-color);
    cursor: move;

    .player-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 14px;
      color: var(--text-primary);

      svg {
        color: var(--primary-color);
      }
    }

    .close-btn {
      cursor: pointer;
      color: var(--text-muted);

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .player-body {
    padding: 16px;

    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .album-art {
        width: 56px;
        height: 56px;
        flex-shrink: 0;

        .album-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          &.playing {
            animation: pulse 1.5s ease infinite;
          }
        }
      }

      .track-info {
        flex: 1;
        min-width: 0;

        .track-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-artist {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }

    .player-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .volume-icon {
        cursor: pointer;
        color: var(--text-muted);

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .playback-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      .control-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--bg-color);
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &:hover {
          background: var(--primary-color);
          color: white;
        }

        &.play-btn {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;

          &.playing {
            animation: pulse 1.5s ease infinite;
          }
        }

        &.stop-btn {
          &:hover {
            background: #f56c6c;
          }
        }
      }
    }

    .track-list {
      max-height: 150px;
      overflow-y: auto;

      .track-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: var(--radius);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(99, 102, 241, 0.08);
        }

        &.active {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2));

          .track-index {
            color: var(--primary-color);
          }

          .track-name {
            color: var(--primary-color);
          }
        }

        .track-index {
          width: 20px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .track-name {
          flex: 1;
          font-size: 13px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
