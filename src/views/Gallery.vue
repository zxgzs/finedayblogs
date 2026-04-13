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

  .page-header {
    margin-bottom: 32px;
    text-align: center;

    h1 {
      margin: 0 0 12px 0;
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;

      .el-icon {
        font-size: 36px;
        color: var(--color-primary);
      }
    }

    .page-description {
      margin: 0;
      font-size: 16px;
      color: var(--text-secondary);
    }
  }

  :deep(.gallery-tabs) {
    .el-tabs__header {
      margin-bottom: 24px;

      .el-tabs__nav-wrap::after {
        display: none;
      }

      .el-tabs__item {
        font-size: 16px;
        font-weight: 500;

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
    }
  }
}

@media (max-width: 768px) {
  .gallery-page {
    padding: 16px;

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
      .el-tabs__header {
        .el-tabs__item {
          font-size: 14px;
          padding: 0 12px;
        }
      }
    }
  }
}
</style>
