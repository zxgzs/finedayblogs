import { reactive } from 'vue'

export interface Notification {
  id: string
  type: 'comment' | 'like' | 'follow' | 'reply' | 'system'
  title: string
  content: string
  avatar?: string
  articleId?: number
  articleTitle?: string
  userId?: string
  userName?: string
  timestamp: number
  read: boolean
  actionUrl?: string
}

const storedNotifications = localStorage.getItem('blog_notifications')
export const notifications = reactive<Notification[]>(storedNotifications ? JSON.parse(storedNotifications) : [])

export function saveNotifications() {
  localStorage.setItem('blog_notifications', JSON.stringify(notifications))
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `noti_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    read: false
  }

  notifications.unshift(newNotification)
  saveNotifications()
  return newNotification
}

export function markAsRead(id: string): boolean {
  const notification = notifications.find(n => n.id === id)
  if (notification) {
    notification.read = true
    saveNotifications()
    return true
  }
  return false
}

export function markAllAsRead(): void {
  notifications.forEach(n => n.read = true)
  saveNotifications()
}

export function deleteNotification(id: string): boolean {
  const index = notifications.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.splice(index, 1)
    saveNotifications()
    return true
  }
  return false
}

export function clearAllReadNotifications(): void {
  const unread = notifications.filter(n => !n.read)
  notifications.length = 0
  notifications.push(...unread)
  saveNotifications()
}

export function getUnreadCount(): number {
  return notifications.filter(n => !n.read).length
}

export function getNotificationsByType(type: Notification['type']): Notification[] {
  return notifications.filter(n => n.type === type)
}

export function getRecentNotifications(limit = 10): Notification[] {
  return notifications.slice(0, limit)
}

// 创建不同类型的通知辅助函数
export function createCommentNotification(articleId: number, articleTitle: string, commenter: string, content: string): Notification {
  return addNotification({
    type: 'comment',
    title: '新评论',
    content: `${commenter} 评论了你的文章《${articleTitle}》`,
    articleId,
    articleTitle,
    userName: commenter,
    avatar: commenter.charAt(0).toUpperCase(),
    actionUrl: `/article/${articleId}#comments`
  })
}

export function createLikeNotification(articleId: number, articleTitle: string, liker: string): Notification {
  return addNotification({
    type: 'like',
    title: '收到点赞',
    content: `${liker} 赞了你的文章《${articleTitle}》`,
    articleId,
    articleTitle,
    userName: liker,
    avatar: liker.charAt(0).toUpperCase(),
    actionUrl: `/article/${articleId}`
  })
}

export function createReplyNotification(articleId: number, articleTitle: string, replier: string, replyContent: string): Notification {
  return addNotification({
    type: 'reply',
    title: '收到回复',
    content: `${replier} 回复了你的评论：${replyContent.substring(0, 30)}...`,
    articleId,
    articleTitle,
    userName: replier,
    avatar: replier.charAt(0).toUpperCase(),
    actionUrl: `/article/${articleId}#comments`
  })
}

export function createSystemNotification(title: string, content: string, actionUrl?: string): Notification {
  return addNotification({
    type: 'system',
    title,
    content,
    actionUrl
  })
}
