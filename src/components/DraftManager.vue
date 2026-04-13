<template>
  <div class="draft-manager">
    <div class="draft-header">
      <h3>
        <el-icon><Document /></el-icon>
        草稿箱 ({{ drafts.length }})
      </h3>
      <el-button
        v-if="drafts.length > 0"
        type="danger"
        text
        size="small"
        @click="clearAllDrafts"
      >
        清空全部
      </el-button>
    </div>

    <div v-if="drafts.length === 0" class="empty-state">
      <el-empty description="暂无草稿" />
    </div>

    <div v-else class="draft-list">
      <div
        v-for="draft in sortedDrafts"
        :key="draft.id"
        class="draft-item"
        @click="loadDraft(draft)"
      >
        <div class="draft-info">
          <h4 class="draft-title">{{ draft.title || '无标题' }}</h4>
          <p class="draft-meta">
            <el-icon><Clock /></el-icon>
            保存于 {{ formatTime(draft.savedAt) }}
          </p>
          <p class="draft-preview">{{ truncate(draft.content, 80) }}</p>
          <div class="draft-tags">
            <el-tag v-if="draft.category" size="small" type="info">
              {{ draft.category }}
            </el-tag>
            <el-tag
              v-for="tag in draft.tags.slice(0, 3)"
              :key="tag"
              size="small"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div class="draft-actions">
          <el-button
            type="danger"
            text
            size="small"
            @click.stop="deleteDraft(draft.id)"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DraftData } from '@/composables/useAutoSave'

const emit = defineEmits<{
  load: [draft: DraftData]
}>()

const drafts = ref<DraftData[]>([])

// 加载所有草稿
const loadAllDrafts = () => {
  try {
    const stored = localStorage.getItem('blog_drafts')
    if (stored) {
      drafts.value = Object.values(JSON.parse(stored))
    }
  } catch (error) {
    console.error('加载草稿失败:', error)
  }
}

// 按保存时间排序
const sortedDrafts = computed(() => {
  return [...drafts.value].sort(
    (a, b) => (b.savedAt || 0) - (a.savedAt || 0)
  )
})

// 加载指定草稿
const loadDraft = (draft: DraftData) => {
  emit('load', draft)
}

// 删除草稿
const deleteDraft = async (draftId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个草稿吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const stored = localStorage.getItem('blog_drafts')
    if (stored) {
      const allDrafts = JSON.parse(stored)
      delete allDrafts[draftId]
      localStorage.setItem('blog_drafts', JSON.stringify(allDrafts))
      drafts.value = Object.values(allDrafts)
      ElMessage.success('草稿已删除')
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 清空所有草稿
const clearAllDrafts = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有草稿吗？此操作不可恢复。', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    localStorage.removeItem('blog_drafts')
    drafts.value = []
    ElMessage.success('所有草稿已清空')
  } catch (error) {
    // 用户取消
  }
}

// 格式化时间
const formatTime = (timestamp?: number): string => {
  if (!timestamp) return '未知'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}天前`
  return date.toLocaleDateString('zh-CN')
}

// 截断文本
const truncate = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(() => {
  loadAllDrafts()
})
</script>

<style scoped lang="scss">
.draft-manager {
  .draft-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 16px;
    }
  }

  .empty-state {
    padding: 40px 0;
  }

  .draft-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 500px;
    overflow-y: auto;

    .draft-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      background: var(--bg-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: var(--primary-color-light);
        transform: translateX(4px);
      }

      .draft-info {
        flex: 1;

        .draft-title {
          margin: 0 0 8px;
          font-size: 15px;
          color: var(--text-primary);
        }

        .draft-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0 0 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .draft-preview {
          margin: 0 0 8px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .draft-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
      }

      .draft-actions {
        margin-left: 12px;
      }
    }
  }
}
</style>
