<template>
  <div class="gallery-page">
    <div class="page-header">
      <h1>
        <el-icon><Picture /></el-icon>
        内容画廊
      </h1>
      <p class="page-description">展示照片、项目、视频和音频等多样化内容</p>
    </div>

    <el-tabs v-model="activeTab" class="gallery-tabs">
      <el-tab-pane label="摄影作品" name="photos">
        <PhotoWall />
      </el-tab-pane>

      <el-tab-pane label="项目作品集" name="portfolio">
        <ProjectPortfolio />
      </el-tab-pane>

      <el-tab-pane label="视频内容" name="videos">
        <VideoGallery />
      </el-tab-pane>

      <el-tab-pane label="播客/音频" name="audios">
        <AudioGallery />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import PhotoWall from '@/components/PhotoWall.vue'
import ProjectPortfolio from '@/components/ProjectPortfolio.vue'
import VideoGallery from '@/components/VideoGallery.vue'
import AudioGallery from '@/components/AudioGallery.vue'

const activeTab = ref('photos')
</script>

<style scoped lang="scss">
.gallery-page {
  padding: 24px;
  width: 1400px;
  max-width: 1400px !important;
  min-width: 1400px !important;
  margin: 0 auto !important;
  min-height: calc(100vh - 140px);
  box-sizing: border-box !important;
  overflow-x: hidden;
  position: relative;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;

  h1 {
    margin: 0 0 12px 0;
    font-size: 36px;
    font-weight: 800;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-shadow: 2px 2px 4px rgba(236, 72, 153, 0.1);
    animation: cuteBounce 3s ease-in-out infinite;

    .el-icon {
      font-size: 40px;
      color: var(--primary-color);
      filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.3));
    }
  }

  .page-description {
    margin: 0;
    font-size: 16px;
    color: var(--text-secondary);
    font-weight: 500;
    padding: 8px 20px;
    background: rgba(236, 72, 153, 0.08);
    border-radius: var(--radius-full);
    display: inline-block;
  }
}

:deep(.gallery-tabs) {
  width: 1352px !important;
  min-width: 1352px !important;
  max-width: 1352px !important;

  .el-tabs__header {
    width: 100% !important;
    margin-bottom: 24px;

    .el-tabs__nav-wrap::after {
      display: none;
    }

    .el-tabs__item {
      font-size: 16px;
      font-weight: 500;
      padding: 0 24px;

      &.is-active {
        color: var(--color-primary);
        font-weight: 600;
      }
    }

    .el-tabs__active-bar {
      background: var(--color-primary);
      height: 3px;
      border-radius: 2px;
    }
  }

  .el-tabs__content {
    background: transparent;
    width: 1352px !important;
    min-width: 1352px !important;
    max-width: 1352px !important;
    min-height: 600px !important;
    box-sizing: border-box !important;
    overflow-x: hidden;
  }
}

.gallery-page :deep(.el-tab-pane) {
  width: 1352px !important;
  min-width: 1352px !important;
  max-width: 1352px !important;
  min-height: 600px !important;
  box-sizing: border-box !important;
  overflow-x: hidden;
}

.gallery-page :deep(.photo-wall),
.gallery-page :deep(.portfolio),
.gallery-page :deep(.video-gallery),
.gallery-page :deep(.audio-gallery) {
  width: 1352px !important;
  min-width: 1352px !important;
  max-width: 1352px !important;
  box-sizing: border-box !important;
  overflow-x: hidden;

  .wall-header,
  .gallery-header,
  .portfolio-header {
    background: var(--card-bg);
    backdrop-filter: blur(12px);
    border-radius: var(--radius-lg);
    padding: 20px;
    margin-bottom: 24px;
    border: 2px dashed var(--border-color);
    position: relative;
    overflow: hidden;

    &::before {
      content: '✨';
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 20px;
      animation: sparkle 2s ease-in-out infinite;
    }

    h2 {
      margin: 0 0 12px 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      text-shadow: 1px 1px 2px rgba(236, 72, 153, 0.1);
    }
  }

  .photo-grid {
    grid-template-columns: repeat(6, 1fr) !important;
    gap: 16px;

    .photo-item {
      border-radius: var(--radius-xl);
      border: 2px solid rgba(236, 72, 153, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 30px rgba(236, 72, 153, 0.2);
        border-color: var(--primary-color);

        .photo-overlay {
          opacity: 1;
          background: linear-gradient(to top, rgba(236, 72, 153, 0.9), rgba(244, 114, 182, 0.7));
        }
      }
    }
  }

  .project-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 20px;

    .project-card {
      border-radius: var(--radius-xl);
      border: 2px solid rgba(236, 72, 153, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 30px rgba(236, 72, 153, 0.2);
        border-color: var(--primary-color);
      }
    }
  }

  .video-grid {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 16px;

    .video-item {
      border-radius: var(--radius-xl);
      border: 2px solid rgba(236, 72, 153, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 30px rgba(236, 72, 153, 0.2);
        border-color: var(--primary-color);

        .play-overlay {
          opacity: 1;
        }
      }
    }
  }

  .audio-list {
    width: 1352px !important;
    min-width: 1352px !important;
    max-width: 1352px !important;
    box-sizing: border-box !important;
    overflow-x: hidden;
    gap: 12px;

    .audio-item {
      border-radius: var(--radius-xl);
      border: 2px solid rgba(236, 72, 153, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--card-bg);
      backdrop-filter: blur(12px);

      &:hover {
        transform: translateX(8px) scale(1.01);
        box-shadow: 0 8px 20px rgba(236, 72, 153, 0.2);
        border-color: var(--primary-color);
      }

      &.playing {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-color: var(--primary-color);
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);

        .audio-title,
        .audio-description {
          color: white;
        }
      }
    }
  }

  .audio-content {
    width: 1352px !important;
    max-width: 1352px !important;
    box-sizing: border-box !important;
    overflow-x: hidden;
  }

  .audio-player-container {
    width: 1352px !important;
    min-width: 1352px !important;
    max-width: 1352px !important;
    box-sizing: border-box !important;
    overflow-x: hidden;
    border-radius: var(--radius-xl);
    border: 2px solid rgba(236, 72, 153, 0.2);
    background: var(--card-bg);
    backdrop-filter: blur(12px);
  }
}

@media (max-width: 768px) {
  .gallery-page {
    padding: 16px;
    width: 100vw !important;
    min-width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;

    .page-header {
      margin-bottom: 24px;

      h1 {
        font-size: 24px;

        .el-icon {
          font-size: 28px;
        }
      }

      .page-description {
        font-size: 14px;
      }
    }

    :deep(.gallery-tabs) {
      width: calc(100vw - 32px) !important;
      min-width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;

      .el-tabs__header {
        .el-tabs__item {
          font-size: 14px;
          padding: 0 12px;
        }
      }

      .el-tabs__content {
        width: calc(100vw - 32px) !important;
        min-width: calc(100vw - 32px) !important;
        max-width: calc(100vw - 32px) !important;
        min-height: 400px !important;
      }
    }
  }

  :deep(.photo-wall),
  :deep(.portfolio),
  :deep(.video-gallery),
  :deep(.audio-gallery) {
    width: calc(100vw - 32px) !important;
    min-width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px) !important;
    overflow-x: hidden;

    .photo-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    .project-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    .video-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    .audio-list {
      width: calc(100vw - 32px) !important;
      min-width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;
      box-sizing: border-box !important;
      overflow-x: hidden;
    }

    .audio-item {
      width: calc(100vw - 32px) !important;
      min-width: calc(100vw - 32px) !important;
      box-sizing: border-box !important;
      overflow-x: hidden;
    }

    .audio-content {
      width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;
      box-sizing: border-box !important;
      overflow-x: hidden;
    }

    .audio-player-container {
      width: calc(100vw - 32px) !important;
      min-width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;
      box-sizing: border-box !important;
      overflow-x: hidden;

      .player-header,
      .audio-info,
      .player-controls,
      .progress-container,
      .control-buttons,
      .speed-control {
        width: calc(100vw - 32px) !important;
        max-width: calc(100vw - 32px) !important;
        box-sizing: border-box !important;
        overflow-x: hidden;
      }

      .progress-bar {
        min-width: 0 !important;
      }
    }
  }
}
</style>
