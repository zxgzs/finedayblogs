<template>
  <div class="history-page">
    <div class="history-header">
      <h1>
        <el-icon><Clock /></el-icon>
        阅读历史
      </h1>
      <div class="header-actions" v-if="historyList.length > 0">
        <el-button type="danger" plain @click="handleClearAll">
          <el-icon><Delete /></el-icon>
          清空历史
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="history-stats" v-if="historyList.length > 0">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ historyList.length }}</div>
          <div class="stat-label">阅读文章</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalReadTime }}</div>
          <div class="stat-label">累计阅读(分钟)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ lastReadDate }}</div>
          <div class="stat-label">最近阅读</div>
        </div>
      </div>
    </div>

    <!-- 阅读历史列表 -->
    <div class="history-list" v-if="historyList.length > 0">
      <div
        v-for="(item, index) in historyList"
        :key="item.articleId"
        class="history-item hover-glow hover-scale"
        @click="goToArticle(item.articleId)"
      >
        <div class="item-index">{{ index + 1 }}</div>
        <div class="item-content">
          <h3 class="item-title">{{ item.title }}</h3>
          <div class="item-meta">
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatTime(item.lastReadAt) }}
            </span>
            <span class="meta-item">
              <el-icon><DataAnalysis /></el-icon>
              阅读进度 {{ item.progress }}%
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
        <div class="item-actions">
          <el-button type="primary" circle @click.stop="goToArticle(item.articleId)">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-button type="danger" circle @click.stop="removeItem(item.articleId)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <el-icon><Clock /></el-icon>
      </div>
      <h3>暂无阅读历史</h3>
      <p>开始阅读文章，记录你的学习轨迹</p>
      <el-button type="primary" @click="goHome">
        <el-icon><HomeFilled /></el-icon>
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useReadingHistory } from '@/composables/useReadingHistory'
import { formatRelativeTime } from '@/utils/format'

const router = useRouter()
const { history, removeHistory, clearHistory } = useReadingHistory()

const historyList = computed(() => history.value.value)

const totalReadTime = computed(() => {
  return historyList.value.length * 5
})

const lastReadDate = computed(() => {
  if (historyList.value.length === 0) return '-'
  return formatRelativeTime(new Date(historyList.value[0].lastReadAt))
})

const formatTime = (timestamp: number) => {
  return formatRelativeTime(new Date(timestamp))
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const goHome = () => {
  router.push('/')
}

const removeItem = async (articleId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条阅读记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    removeHistory(articleId)
    ElMessage.success('已删除')
  } catch {
    // 取消删除
  }
}

const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有阅读历史吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning'
    })
    clearHistory()
    ElMessage.success('已清空所有历史')
  } catch {
    // 取消操作
  }
}
</script>

<style scoped lang="scss">
.history-page {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h1 {
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--info-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      svg {
        -webkit-text-fill-color: var(--primary-color);
      }
    }
  }

  .history-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .stat-card {
      background: var(--card-bg);
      border-radius: var(--radius-xl);
      padding: 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
      }

      .stat-info {
        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-muted);
        }
      }
    }
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .history-item {
      background: var(--card-bg);
      border-radius: var(--radius-lg);
      padding: 20px 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-color);
        transform: translateX(8px);
      }

      .item-index {
        width: 40px;
        height: 40px;
        border-radius: var(--radius);
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 18px;
        color: white;
        flex-shrink: 0;
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 10px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: var(--text-muted);

            svg {
              font-size: 14px;
            }
          }
        }

        .progress-bar {
          height: 4px;
          background: var(--bg-color);
          border-radius: 2px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 2px;
            transition: width 0.3s ease;
          }
        }
      }

      .item-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-color);

    .empty-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 40px;
        color: var(--primary-color);
      }
    }

    h3 {
      font-size: 20px;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    p {
      color: var(--text-muted);
      margin-bottom: 24px;
    }
  }
}

@media (max-width: 768px) {
  .history-page {
    .history-header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .history-list {
      .history-item {
        flex-direction: column;
        align-items: flex-start;

        .item-actions {
          width: 100%;
          justify-content: flex-end;
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
