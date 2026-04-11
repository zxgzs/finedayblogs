<template>
  <div class="tags-page">
    <div class="tags-header">
      <h1>
        <el-icon><PriceTag /></el-icon>
        标签云
      </h1>
      <p class="subtitle">点击标签查看相关文章</p>
    </div>

    <!-- 标签云 -->
    <div class="tag-cloud">
      <span
        v-for="tag in sortedTags"
        :key="tag.name"
        class="tag-item"
        :class="{ active: selectedTag === tag.name }"
        :style="getTagStyle(tag.count)"
        @click="handleTagClick(tag.name)"
      >
        {{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </span>
    </div>

    <!-- 选中标签后的文章列表 -->
    <div v-if="selectedTag" class="tag-articles">
      <div class="articles-header">
        <h2>
          <el-icon><Collection /></el-icon>
          "{{ selectedTag }}" 标签下的文章
        </h2>
        <el-button @click="selectedTag = ''">
          <el-icon><Close /></el-icon>
          清除筛选
        </el-button>
      </div>

      <div class="articles-list">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="article-item hover-glow hover-scale"
          @click="goToArticle(article.id)"
        >
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <div class="article-meta">
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ article.date }}
              </span>
              <span class="meta-item">
                <el-icon><Folder /></el-icon>
                {{ article.category }}
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ article.views }} 阅读
              </span>
            </div>
          </div>
          <div class="article-tags">
            <el-tag
              v-for="t in article.tags"
              :key="t"
              size="small"
              :type="t === selectedTag ? 'primary' : 'info'"
              effect="plain"
            >
              {{ t }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签统计 -->
    <div class="tags-stats" v-if="!selectedTag">
      <h2>
        <el-icon><DataAnalysis /></el-icon>
        标签统计
      </h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ allTags.length }}</div>
          <div class="stat-label">标签总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalTagUsage }}</div>
          <div class="stat-label">标签使用次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ avgTagsPerArticle }}</div>
          <div class="stat-label">平均每篇文章标签数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ mostUsedTag }}</div>
          <div class="stat-label">最常用标签</div>
        </div>
      </div>

      <!-- 热门标签排行 -->
      <h3 class="section-title">
        <el-icon><Top /></el-icon>
        热门标签 TOP 10
      </h3>
      <div class="tag-ranking">
        <div
          v-for="(tag, index) in topTags"
          :key="tag.name"
          class="rank-item"
          @click="handleTagClick(tag.name)"
        >
          <span class="rank-number" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
          <span class="rank-name">{{ tag.name }}</span>
          <div class="rank-bar">
            <div
              class="rank-fill"
              :style="{ width: (tag.count / topTags[0].count * 100) + '%' }"
            ></div>
          </div>
          <span class="rank-count">{{ tag.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articles } from '@/data/articles'

const router = useRouter()
const selectedTag = ref('')

// 收集所有标签及其出现次数
const allTags = computed(() => {
  const tagMap = new Map<string, number>()
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }))
})

// 按使用次数排序的标签
const sortedTags = computed(() => {
  return [...allTags.value].sort((a, b) => b.count - a.count)
})

// 统计信息
const totalTagUsage = computed(() => {
  return allTags.value.reduce((sum, tag) => sum + tag.count, 0)
})

const avgTagsPerArticle = computed(() => {
  return (totalTagUsage.value / articles.length).toFixed(1)
})

const mostUsedTag = computed(() => {
  if (sortedTags.value.length === 0) return '-'
  return sortedTags.value[0].name
})

// Top 10 热门标签
const topTags = computed(() => {
  return sortedTags.value.slice(0, 10)
})

// 根据标签数量计算样式
const getTagStyle = (count: number) => {
  const maxCount = Math.max(...allTags.value.map(t => t.count))
  const minCount = Math.min(...allTags.value.map(t => t.count))
  const ratio = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount)
  
  // 字号范围 14px - 32px
  const fontSize = 14 + ratio * 18
  // 透明度范围 0.6 - 1
  const opacity = 0.6 + ratio * 0.4
  // 根据比例分配颜色
  const hue = 180 + ratio * 60 // 从青色到蓝色
  
  return {
    fontSize: `${fontSize}px`,
    opacity,
    backgroundColor: `hsla(${hue}, 70%, 50%, ${opacity * 0.15})`,
    borderColor: `hsla(${hue}, 70%, 50%, ${opacity * 0.5})`,
    color: `hsl(${hue}, 80%, 60%)`
  }
}

// 根据选中标签过滤文章
const filteredArticles = computed(() => {
  if (!selectedTag.value) return []
  return articles.filter(article => article.tags.includes(selectedTag.value))
})

const handleTagClick = (tagName: string) => {
  if (selectedTag.value === tagName) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tagName
  }
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}
</script>

<style scoped lang="scss">
.tags-page {
  max-width: 1000px;
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

  .tags-header {
    margin-bottom: 32px;
    text-align: center;

    h1 {
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;

      svg {
        -webkit-text-fill-color: var(--primary-color);
      }
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 15px;
    }
  }

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    padding: 32px;
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-color);
    margin-bottom: 32px;

    .tag-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-full);
      border: 1px solid;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover, &.active {
        transform: scale(1.1);
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        border-color: var(--primary-color) !important;
        background-color: rgba(0, 212, 255, 0.2) !important;
        color: var(--primary-color) !important;
        opacity: 1 !important;
      }

      .tag-count {
        font-size: 0.75em;
        padding: 2px 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }
    }
  }

  .tag-articles {
    .articles-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        font-size: 20px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--primary-color);
      }
    }

    .articles-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .article-item {
        background: var(--card-bg);
        border-radius: var(--radius-lg);
        padding: 20px 24px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--primary-color);
          transform: translateX(8px);
        }

        .article-info {
          margin-bottom: 12px;

          .article-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
          }

          .article-meta {
            display: flex;
            gap: 16px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: var(--text-muted);
            }
          }
        }

        .article-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      }
    }
  }

  .tags-stats {
    h2 {
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      color: var(--text-primary);

      svg {
        color: var(--primary-color);
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-card {
        background: var(--card-bg);
        border-radius: var(--radius-lg);
        padding: 20px;
        text-align: center;
        border: 1px solid var(--border-color);

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary-color);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-muted);
        }
      }
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: var(--text-primary);

      svg {
        color: var(--warning-color);
      }
    }

    .tag-ranking {
      background: var(--card-bg);
      border-radius: var(--radius-xl);
      padding: 24px;
      border: 1px solid var(--border-color);

      .rank-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 0;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.2s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          padding-left: 8px;
          background: rgba(0, 212, 255, 0.05);
        }

        .rank-number {
          width: 28px;
          height: 28px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          background: var(--bg-color);
          color: var(--text-muted);

          &.rank-1 {
            background: linear-gradient(135deg, #ffd700, #ffb800);
            color: #000;
          }

          &.rank-2 {
            background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
            color: #000;
          }

          &.rank-3 {
            background: linear-gradient(135deg, #cd7f32, #b87333);
            color: #fff;
          }
        }

        .rank-name {
          width: 100px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .rank-bar {
          flex: 1;
          height: 8px;
          background: var(--bg-color);
          border-radius: 4px;
          overflow: hidden;

          .rank-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 4px;
            transition: width 0.6s ease;
          }
        }

        .rank-count {
          width: 40px;
          text-align: right;
          font-weight: 600;
          color: var(--primary-color);
        }
      }
    }
  }
}
</style>
