<template>
  <div class="photo-wall">
    <div class="wall-header">
      <h2>摄影作品</h2>
      <div class="filter-bar">
        <el-radio-group v-model="selectedCategory" size="small">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="cat in categories" :key="cat" :label="cat">{{ cat }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="photo-grid">
      <div
        v-for="photo in filteredPhotos"
        :key="photo.id"
        class="photo-item"
        @click="viewPhoto(photo)"
      >
        <div class="photo-wrapper">
          <img :src="photo.thumbnail || photo.url" :alt="photo.title" loading="lazy" />
          <div class="photo-overlay">
            <div class="overlay-content">
              <h3>{{ photo.title }}</h3>
              <p v-if="photo.description">{{ photo.description }}</p>
              <div class="photo-meta">
                <el-icon v-if="photo.camera"><Camera /></el-icon>
                <span>{{ photo.camera || '未知设备' }}</span>
                <span v-if="photo.location">• {{ photo.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 照片预览弹窗 -->
    <el-dialog
      v-model="showPreview"
      :title="currentPhoto?.title"
      width="80%"
      class="photo-preview-dialog"
    >
      <div class="photo-preview-content">
        <img :src="currentPhoto?.url" :alt="currentPhoto?.title" />
        <div class="photo-details">
          <h3>{{ currentPhoto?.title }}</h3>
          <p v-if="currentPhoto?.description">{{ currentPhoto.description }}</p>
          <div class="details-meta">
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ currentPhoto?.date }}</span>
            </div>
            <div v-if="currentPhoto?.camera" class="meta-item">
              <el-icon><Camera /></el-icon>
              <span>{{ currentPhoto.camera }}</span>
            </div>
            <div v-if="currentPhoto?.location" class="meta-item">
              <el-icon><Location /></el-icon>
              <span>{{ currentPhoto.location }}</span>
            </div>
            <div class="meta-item">
              <el-icon><PriceTag /></el-icon>
              <span>{{ currentPhoto?.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera, Calendar, Location, PriceTag } from '@element-plus/icons-vue'
import { photos, type Photo } from '@/data/portfolio'

const selectedCategory = ref('')
const showPreview = ref(false)
const currentPhoto = ref<Photo | null>(null)

const categories = computed(() => {
  const cats = new Set(photos.map(p => p.category))
  return Array.from(cats)
})

const filteredPhotos = computed(() => {
  if (!selectedCategory.value) {
    return photos
  }
  return photos.filter(p => p.category === selectedCategory.value)
})

const viewPhoto = (photo: Photo) => {
  currentPhoto.value = photo
  showPreview.value = true
}
</script>

<style scoped lang="scss">
.photo-wall {
  .wall-header {
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

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;

    .photo-item {
      position: relative;
      aspect-ratio: 4 / 3;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);

        .photo-overlay {
          opacity: 1;
        }
      }

      .photo-wrapper {
        position: relative;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          display: flex;
          align-items: flex-end;
          padding: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;

          .overlay-content {
            color: white;

            h3 {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 600;
            }

            p {
              margin: 0 0 12px 0;
              font-size: 13px;
              opacity: 0.9;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .photo-meta {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 12px;
              opacity: 0.8;

              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}

:deep(.photo-preview-dialog) {
  .el-dialog__body {
    padding: 0;
  }
}

.photo-preview-content {
  display: flex;
  gap: 24px;
  max-height: 70vh;

  img {
    max-width: 60%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .photo-details {
    flex: 1;
    padding: 24px;

    h3 {
      margin: 0 0 12px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    p {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .details-meta {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--text-secondary);

        .el-icon {
          color: var(--color-primary);
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .photo-wall {
    .wall-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .photo-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }
  }

  .photo-preview-content {
    flex-direction: column;

    img {
      max-width: 100%;
      max-height: 50vh;
    }
  }
}
</style>
