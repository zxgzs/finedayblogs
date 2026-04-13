<template>
  <div class="mood-vote-section">
    <div class="mood-title">
      <el-icon><ChatLineSquare /></el-icon>
      读完这篇文章,你的心情是？
    </div>
    <div class="mood-options">
      <div
        v-for="mood in moods"
        :key="mood.id"
        class="mood-item"
        :class="{ selected: selectedMood === mood.id, voted: hasVoted }"
        @click="vote(mood.id)"
      >
        <span class="mood-emoji">{{ mood.emoji }}</span>
        <span class="mood-label">{{ mood.label }}</span>
        <span class="mood-percent" v-if="hasVoted">{{ percents[mood.id] }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChatLineSquare } from '@element-plus/icons-vue'

interface Mood {
  id: number
  emoji: string
  label: string
  votes: number
}

const moods = ref<Mood[]>([
  { id: 1, emoji: '😊', label: '学到很多', votes: 0 },
  { id: 2, emoji: '🤔', label: '有所启发', votes: 0 },
  { id: 3, emoji: '👍', label: '很赞', votes: 0 },
  { id: 4, emoji: '😴', label: '有点困', votes: 0 },
  { id: 5, emoji: '🤯', label: '太复杂', votes: 0 }
])

const selectedMood = ref<number | null>(null)
const hasVoted = ref(false)

const percents = computed(() => {
  const total = moods.value.reduce((sum, m) => sum + m.votes, 0)
  if (total === 0) return {}
  
  const result: Record<number, number> = {}
  moods.value.forEach(mood => {
    result[mood.id] = Math.round((mood.votes / total) * 100)
  })
  return result
})

const vote = (id: number) => {
  if (hasVoted.value) return
  
  selectedMood.value = id
  moods.value.find(m => m.id === id)!.votes++
  hasVoted.value = true
}
</script>

<style scoped>
.mood-vote-section {
  margin: 32px 0;
  padding: 24px;
  background: var(--card-glass);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.mood-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;

  svg {
    color: var(--primary-color);
  }
}

.mood-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mood-item {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    border-color: var(--primary-color);
    background: rgba(0, 212, 255, 0.1);
  }

  &.selected {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2));
  }

  &.voted {
    cursor: default;

    &:hover {
      transform: none;
    }
  }
}

.mood-emoji {
  font-size: 32px;
  display: block;
  margin-bottom: 4px;
}

.mood-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.mood-percent {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-color);
}
</style>
