<template>
  <div class="portfolio">
    <div class="portfolio-header">
      <h2>项目作品集</h2>
      <div class="filter-bar">
        <el-select v-model="selectedCategory" placeholder="选择分类" clearable size="default" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>
        <el-radio-group v-model="sortBy" size="default">
          <el-radio-button label="featured">精选</el-radio-button>
          <el-radio-button label="latest">最新</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="project-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        :class="{ featured: project.featured }"
      >
        <div class="project-cover">
          <img :src="project.cover" :alt="project.title" />
          <div class="project-status" :class="project.status">
            {{ getStatusText(project.status) }}
          </div>
          <div v-if="project.featured" class="featured-badge">
            <el-icon><Star /></el-icon>
            精选
          </div>
        </div>

        <div class="project-content">
          <div class="project-tags">
            <el-tag size="small" type="info">{{ project.category }}</el-tag>
            <el-tag
              v-for="tech in project.tech"
              :key="tech"
              size="small"
              type="primary"
              effect="plain"
            >
              {{ tech }}
            </el-tag>
          </div>

          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-description">{{ project.description }}</p>

          <div class="project-footer">
            <div class="project-date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(project.createdAt) }}
            </div>

            <div class="project-actions">
              <el-button
                v-if="project.demoUrl"
                type="primary"
                size="small"
                :icon="VideoPlay"
                @click="openDemo(project.demoUrl)"
              >
                Demo
              </el-button>
              <el-button
                v-if="project.githubUrl"
                size="small"
                :icon="Link"
                @click="openGithub(project.githubUrl)"
              >
                代码
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, Calendar, VideoPlay, Link } from '@element-plus/icons-vue'
import { projects, type Project } from '@/data/portfolio'

const selectedCategory = ref('')
const sortBy = ref('featured')

const categories = computed(() => {
  const cats = new Set(projects.map(p => p.category))
  return Array.from(cats)
})

const filteredProjects = computed(() => {
  let result = projects

  // 分类筛选
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 排序
  if (sortBy.value === 'featured') {
    result = [...result].sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } else {
    result = [...result].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return result
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    'in-progress': '进行中',
    planned: '计划中'
  }
  return statusMap[status] || status
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`
}

const openDemo = (url: string) => {
  window.open(url, '_blank')
}

const openGithub = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.portfolio {
  width: 100% !important;
  max-width: 100% !important;
  min-height: 600px;

  .portfolio-header {
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
      align-items: center;
    }
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
    gap: 16px;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;

    .project-card {
      background: var(--bg-card);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.featured {
        border-color: #f7ba2a;
      }

      .project-cover {
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        &:hover {
          img {
            transform: scale(1.05);
          }
        }

        .project-status {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          color: white;

          &.completed {
            background: linear-gradient(135deg, #67c23a, #85ce61);
          }

          &.in-progress {
            background: linear-gradient(135deg, #409eff, #66b1ff);
          }

          &.planned {
            background: linear-gradient(135deg, #909399, #b1b3b8);
          }
        }

        .featured-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: linear-gradient(135deg, #f7ba2a, #f5c762);
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
      }

      .project-content {
        padding: 20px;

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .project-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .project-description {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .project-date {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: var(--text-secondary);

            .el-icon {
              font-size: 14px;
            }
          }

          .project-actions {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .portfolio {
    .portfolio-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;

      .filter-bar {
        width: 100%;
        justify-content: space-between;
      }
    }

    .project-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .project-card {
        .project-cover {
          aspect-ratio: 16 / 12;
        }

        .project-content {
          padding: 12px;

          .project-tags {
            gap: 6px;
            margin-bottom: 8px;

            .el-tag {
              font-size: 11px;
            }
          }

          .project-title {
            font-size: 14px;
            margin-bottom: 6px;
          }

          .project-description {
            font-size: 12px;
            margin-bottom: 12px;
            -webkit-line-clamp: 2;
          }

          .project-footer {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;

            .project-date {
              font-size: 11px;
            }

            .project-actions {
              width: 100%;

              .el-button {
                flex: 1;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
