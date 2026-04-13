<template>
  <div class="video-gallery">
    <div class="gallery-header">
      <h2>视频内容</h2>
      <div class="filter-bar">
        <el-radio-group v-model="selectedCategory" size="small">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="cat in categories" :key="cat" :label="cat">{{ cat }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="video-grid">
      <div
        v-for="video in filteredVideos"
        :key="video.id"
        class="video-item"
        @click="playVideo(video)"
      >
        <div class="video-thumbnail">
          <img :src="video.thumbnail" :alt="video.title" />
          <div class="duration-badge">{{ video.duration }}</div>
          <div class="play-overlay">
            <el-icon class="play-icon"><VideoPlay /></el-icon>
          </div>
        </div>

        <div class="video-info">
          <h3 class="video-title">{{ video.title }}</h3>
          <p class="video-description">{{ video.description }}</p>
          <div class="video-meta">
            <el-tag size="small" type="info">{{ video.category }}</el-tag>
            <span class="video-date">{{ formatDate(video.publishedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <el-dialog
      v-model="showPlayer"
      :title="currentVideo?.title"
      width="90%"
      :before-close="handleClose"
      class="video-player-dialog"
    >
      <VideoEmbed
        :platform="currentVideo?.platform"
        :video-id="currentVideo?.videoId"
        height="600px"
      />
      <div class="player-info">
        <h3>{{ currentVideo?.title }}</h3>
        <p>{{ currentVideo?.description }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import { videos, type Video } from '@/data/portfolio'
import VideoEmbed from './VideoEmbed.vue'

const selectedCategory = ref('')
const showPlayer = ref(false)
const currentVideo = ref<Video | null>(null)

const categories = computed(() => {
  const cats = new Set(videos.map(v => v.category))
  return Array.from(cats)
})

const filteredVideos = computed(() => {
  if (!selectedCategory.value) {
    return videos
  }
  return videos.filter(v => v.category === selectedCategory.value)
})

const playVideo = (video: Video) => {
  currentVideo.value = video
  showPlayer.value = true
}

const handleClose = () => {
  showPlayer.value = false
  currentVideo.value = null
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.video-gallery {
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

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;

    .video-item {
      background: var(--bg-card);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

        .play-overlay {
          opacity: 1;
        }
      }

      .video-thumbnail {
        position: relative;
        aspect-ratio: 16 / 9;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .duration-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0;
          transition: opacity 0.3s ease;

          .play-icon {
            font-size: 48px;
            color: white;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
          }
        }
      }

      .video-info {
        padding: 16px;

        .video-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-description {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .video-date {
            font-size: 12px;
            color: var(--text-secondary);
          }
        }
      }
    }
  }
}

:deep(.video-player-dialog) {
  .el-dialog__body {
    padding: 20px 0;
  }

  .player-info {
    margin-top: 20px;
    padding: 16px 0;

    h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    p {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  }
}

@media (max-width: 768px) {
  .video-gallery {
    .gallery-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .video-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  :deep(.video-player-dialog) {
    width: 95% !important;
  }
}
</style>
