<template>
  <div class="notification-center">
    <el-badge v-if="showButton" :value="unreadCount" :hidden="unreadCount === 0" :max="99">
      <el-button
        circle
        :icon="Bell"
        :type="unreadCount > 0 ? 'danger' : 'default'"
        @click="togglePanel"
        class="notification-button"
      >
      </el-button>
    </el-badge>

    <!-- 通知面板 -->
    <el-drawer
      v-model="showPanel"
      title="通知中心"
      direction="rtl"
      size="400px"
      :with-header="true"
      class="notification-drawer"
      :z-index="10000"
    >
      <template #header>
        <div class="drawer-header">
          <span class="header-title">通知中心</span>
          <div class="header-actions">
            <el-button
              v-if="unreadCount > 0"
              type="primary"
              text
              size="small"
              @click="markAllAsRead"
            >
              全部已读
            </el-button>
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button text>
                {{ filterText }}
                <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="all">全部通知</el-dropdown-item>
                  <el-dropdown-item command="unread">未读通知</el-dropdown-item>
                  <el-dropdown-item command="comment">评论</el-dropdown-item>
                  <el-dropdown-item command="like">点赞</el-dropdown-item>
                  <el-dropdown-item command="system">系统通知</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>

      <div class="notification-content">
        <!-- 空状态 -->
        <el-empty
          v-if="filteredNotifications.length === 0"
          description="暂无通知"
          :image-size="120"
        />

        <!-- 通知列表 -->
        <div v-else class="notification-list">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'is-read': notification.read, 'is-unread': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon">
              <el-icon v-if="notification.type === 'comment'" class="icon-comment">
                <ChatDotRound />
              </el-icon>
              <el-icon v-else-if="notification.type === 'like'" class="icon-like">
                <Star />
              </el-icon>
              <el-icon v-else-if="notification.type === 'reply'" class="icon-reply">
                <ChatLineRound />
              </el-icon>
              <el-icon v-else class="icon-system">
                <Bell />
              </el-icon>
            </div>

            <div class="notification-main">
              <div class="notification-header">
                <span class="notification-title">{{ notification.title }}</span>
                <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
              </div>

              <div class="notification-body">
                <p class="notification-content">{{ notification.content }}</p>
                <div v-if="notification.articleTitle" class="notification-article">
                  <el-icon><Document /></el-icon>
                  {{ notification.articleTitle }}
                </div>
              </div>

              <div class="notification-footer">
                <el-button
                  v-if="!notification.read"
                  type="primary"
                  text
                  size="small"
                  @click.stop="markAsRead(notification.id)"
                >
                  标记为已读
                </el-button>
                <el-button
                  text
                  size="small"
                  type="danger"
                  @click.stop="deleteNotification(notification.id)"
                >
                  删除
                </el-button>
              </div>
            </div>

            <div v-if="!notification.read" class="unread-dot"></div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="clearAllReadNotifications">
            <el-icon><Delete /></el-icon>
            清除已读
          </el-button>
          <div class="notification-stats">
            <span>共 {{ notifications.length }} 条通知</span>
            <span class="unread-stat">{{ unreadCount }} 条未读</span>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Bell,
  ChatDotRound,
  Star,
  ChatLineRound,
  Document,
  ArrowDown,
  Delete
} from '@element-plus/icons-vue'
import {
  notifications,
  markAsRead as markRead,
  markAllAsRead as markAllRead,
  deleteNotification as deleteNoti,
  clearAllReadNotifications as clearRead
} from '@/data/notifications'

const router = useRouter()

const showButton = defineModel<boolean>('showButton')
const showPanel = defineModel<boolean>('showPanel')
const filterType = ref<'all' | 'unread' | 'comment' | 'like' | 'system'>('all')

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const unreadCount = computed(() => {
  return notifications.filter(n => !n.read).length
})

const filterText = computed(() => {
  const texts: Record<string, string> = {
    all: '全部通知',
    unread: '未读通知',
    comment: '评论',
    like: '点赞',
    system: '系统通知'
  }
  return texts[filterType.value]
})

const filteredNotifications = computed(() => {
  let filtered = notifications

  if (filterType.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (filterType.value !== 'all') {
    filtered = filtered.filter(n => n.type === filterType.value)
  }

  return filtered
})

const handleCommand = (command: string) => {
  filterType.value = command as any
}

const handleNotificationClick = (notification: any) => {
  if (!notification.read) {
    markRead(notification.id)
  }

  if (notification.actionUrl) {
    showPanel.value = false
    router.push(notification.actionUrl)
  }
}

const markAsRead = (id: string) => {
  const success = markRead(id)
  if (success) {
    ElMessage.success('已标记为已读')
  }
}

const markAllAsRead = () => {
  markAllRead()
  ElMessage.success('已全部标记为已读')
}

const deleteNotification = async (id: string) => {
  const success = deleteNoti(id)
  if (success) {
    ElMessage.success('通知已删除')
  }
}

const clearAllReadNotifications = () => {
  clearRead()
  ElMessage.success('已清除所有已读通知')
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}天前`
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  // 可以在这里初始化，比如加载通知等
})
</script>

<style scoped lang="scss">
.notification-center {
  :deep(.notification-drawer) {
    z-index: 10000 !important;
  }

  .notification-button {
    position: relative;
    font-size: 20px;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .header-title {
      font-size: 18px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .notification-content {
    flex: 1;
    overflow-y: auto;

    .notification-list {
      .notification-item {
        display: flex;
        gap: 12px;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.3s;
        background: var(--card-bg);
        border: 1px solid transparent;
        position: relative;

        &.is-read {
          opacity: 0.7;

          .notification-content {
            color: var(--text-secondary);
          }
        }

        &.is-unread {
          background: var(--bg-color);
          border-color: var(--primary-color);
        }

        &:hover {
          transform: translateX(-4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .notification-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          .icon-comment {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .icon-like {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          .icon-reply {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }

          .icon-system {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
        }

        .notification-main {
          flex: 1;
          min-width: 0;

          .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .notification-title {
              font-size: 14px;
              font-weight: 600;
              color: var(--text-primary);
            }

            .notification-time {
              font-size: 12px;
              color: var(--text-muted);
            }
          }

          .notification-body {
            margin-bottom: 12px;

            .notification-content {
              font-size: 13px;
              color: var(--text-secondary);
              line-height: 1.5;
              margin: 0 0 6px;
            }

            .notification-article {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: var(--primary-color);
            }
          }

          .notification-footer {
            display: flex;
            gap: 8px;
          }
        }

        .unread-dot {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 8px;
          height: 8px;
          background: var(--primary-color);
          border-radius: 50%;
        }
      }
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);

    .notification-stats {
      font-size: 13px;
      color: var(--text-secondary);
      text-align: right;

      .unread-stat {
        display: block;
        color: var(--primary-color);
        font-weight: 600;
        margin-top: 4px;
      }
    }
  }
}
</style>
