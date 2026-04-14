<template>
  <div class="plugins-page">
    <div class="plugins-header">
      <h1>
        <el-icon><Plug /></el-icon>
        脚本插件
      </h1>
      <p class="subtitle">精选实用插件，提升开发效率</p>
    </div>

    <!-- 分类筛选 -->
    <div class="categories">
      <button
        v-for="category in [{ name: '全部', icon: '📋' }, ...pluginCategories]"
        :key="category.name"
        :class="{ active: selectedCategory === category.name }"
        class="category-btn magnetic"
        @click="selectedCategory = category.name"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
        <span class="category-count">{{ category.count || plugins.length }}</span>
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索插件..."
        prefix-icon="Search"
        clearable
        size="large"
      />
    </div>

    <!-- 精选插件 -->
    <div v-if="selectedCategory === '全部' && !searchQuery" class="featured-section">
      <h2>
        <el-icon><Star /></el-icon>
        精选插件
      </h2>
      <div class="featured-grid">
        <div
          v-for="plugin in featuredPlugins"
          :key="plugin.id"
          class="featured-card hover-glow hover-scale"
          @click="showPluginDetail(plugin)"
        >
          <div class="featured-icon">{{ plugin.icon }}</div>
          <div class="featured-info">
            <h3>{{ plugin.name }}</h3>
            <p class="featured-desc">{{ plugin.description }}</p>
            <div class="featured-meta">
              <span class="meta-item">
                <el-icon><Download /></el-icon>
                {{ formatNumber(plugin.downloads) }}
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ plugin.rating }}
              </span>
              <span class="meta-item">
                <el-icon><User /></el-icon>
                {{ plugin.author }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 插件列表 -->
    <div class="plugins-section">
      <h2>
        <el-icon><Collection /></el-icon>
        插件列表
      </h2>
      <div class="plugins-grid">
        <div
          v-for="plugin in filteredPlugins"
          :key="plugin.id"
          class="plugin-card hover-glow hover-scale"
          :class="{ featured: plugin.featured }"
        >
          <div v-if="plugin.featured" class="featured-badge">
            <el-icon><Star /></el-icon>
            精选
          </div>
          <div class="plugin-icon">{{ plugin.icon }}</div>
          <div class="plugin-header">
            <h3 class="plugin-name">{{ plugin.name }}</h3>
            <el-tag size="small" type="info">{{ plugin.version }}</el-tag>
          </div>
          <p class="plugin-desc">{{ plugin.description }}</p>
          <div class="plugin-tags">
            <el-tag
              v-for="tag in plugin.tags"
              :key="tag"
              size="small"
              effect="plain"
              type="success"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="plugin-meta">
            <div class="meta-left">
              <span class="meta-item">
                <el-icon><Download /></el-icon>
                {{ formatNumber(plugin.downloads) }}
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ plugin.rating }}
              </span>
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ plugin.date }}
              </span>
            </div>
            <div class="meta-right">
              <span class="author">{{ plugin.author }}</span>
            </div>
          </div>
          <div class="plugin-actions">
            <el-button type="primary" size="small" @click="showPluginDetail(plugin)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button
              v-if="plugin.github"
              type="default"
              size="small"
              @click="openLink(plugin.github)"
            >
              <el-icon><Position /></el-icon>
              GitHub
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 插件详情弹窗 -->
    <el-dialog
      v-model="showDetail"
      :title="selectedPlugin?.name"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedPlugin" class="plugin-detail">
        <div class="detail-header">
          <div class="detail-icon">{{ selectedPlugin.icon }}</div>
          <div class="detail-info">
            <h2>{{ selectedPlugin.name }}</h2>
            <p class="detail-version">版本: {{ selectedPlugin.version }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h3>简介</h3>
          <p>{{ selectedPlugin.description }}</p>
        </div>

        <div class="detail-meta">
          <div class="meta-stat">
            <div class="stat-icon"><el-icon><Download /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(selectedPlugin.downloads) }}</div>
              <div class="stat-label">下载量</div>
            </div>
          </div>
          <div class="meta-stat">
            <div class="stat-icon"><el-icon><Star /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">{{ selectedPlugin.rating }}</div>
              <div class="stat-label">评分</div>
            </div>
          </div>
          <div class="meta-stat">
            <div class="stat-icon"><el-icon><Calendar /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">{{ selectedPlugin.date }}</div>
              <div class="stat-label">更新日期</div>
            </div>
          </div>
        </div>

        <div class="detail-tags">
          <h3>标签</h3>
          <div class="tags-list">
            <el-tag
              v-for="tag in selectedPlugin.tags"
              :key="tag"
              type="success"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div class="detail-author">
          <h3>作者</h3>
          <p>{{ selectedPlugin.author }}</p>
        </div>

        <div v-if="selectedPlugin.github || selectedPlugin.npm" class="detail-links">
          <h3>相关链接</h3>
          <div class="links-list">
            <el-button
              v-if="selectedPlugin.github"
              type="primary"
              plain
              @click="openLink(selectedPlugin.github)"
            >
              <el-icon><Position /></el-icon>
              GitHub 仓库
            </el-button>
            <el-button
              v-if="selectedPlugin.npm"
              type="success"
              plain
              @click="openLink(selectedPlugin.npm)"
            >
              <el-icon><Box /></el-icon>
              NPM 包
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { plugins, pluginCategories, featuredPlugins } from '@/data/plugins'
import type { Plugin } from '@/data/plugins'
import { setPageMeta } from '@/utils/seo'

const searchQuery = ref('')
const selectedCategory = ref('全部')
const showDetail = ref(false)
const selectedPlugin = ref<Plugin | null>(null)

onMounted(() => {
  setPageMeta('脚本插件 - 晴天的博客', '精选实用插件，提升开发效率')
})

// 根据分类和搜索过滤插件
const filteredPlugins = computed(() => {
  let result = plugins

  // 分类过滤
  if (selectedCategory.value !== '全部') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query)) ||
      p.category.toLowerCase().includes(query)
    )
  }

  return result
})

// 显示插件详情
const showPluginDetail = (plugin: Plugin) => {
  selectedPlugin.value = plugin
  showDetail.value = true
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.plugins-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
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

  .plugins-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      font-size: 32px;
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
      font-size: 16px;
    }
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
    justify-content: center;

    .category-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      color: var(--text-secondary);

      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-color: transparent;
        color: white;
      }

      .category-icon {
        font-size: 16px;
      }

      .category-name {
        font-weight: 500;
      }

      .category-count {
        padding: 2px 8px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        font-size: 12px;
      }
    }
  }

  .search-bar {
    max-width: 600px;
    margin: 0 auto 40px;

    :deep(.el-input__wrapper) {
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
    }
  }

  .featured-section {
    margin-bottom: 48px;

    h2 {
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-primary);
      margin-bottom: 24px;

      svg {
        color: var(--warning-color);
      }
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;

      .featured-card {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
        border: 2px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        }

        &:hover {
          border-color: var(--primary-color);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
        }

        .featured-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .featured-info {
          h3 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 12px;
          }

          .featured-desc {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .featured-meta {
            display: flex;
            gap: 16px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: var(--text-muted);

              svg {
                font-size: 16px;
                color: var(--primary-color);
              }
            }
          }
        }
      }
    }
  }

  .plugins-section {
    h2 {
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-primary);
      margin-bottom: 24px;

      svg {
        color: var(--primary-color);
      }
    }

    .plugins-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;

      .plugin-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 24px;
        transition: all 0.3s ease;
        position: relative;

        &.featured {
          border-color: var(--primary-color);
        }

        &:hover {
          border-color: var(--primary-color);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }

        .featured-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: linear-gradient(135deg, var(--warning-color), #f39c12);
          color: white;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
        }

        .plugin-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .plugin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;

          .plugin-name {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .plugin-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .plugin-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .plugin-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 16px;

          .meta-left {
            display: flex;
            gap: 16px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: var(--text-muted);

              svg {
                font-size: 16px;
                color: var(--primary-color);
              }
            }
          }

          .author {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 500;
          }
        }

        .plugin-actions {
          display: flex;
          gap: 12px;
        }
      }
    }
  }

  .plugin-detail {
    .detail-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);

      .detail-icon {
        font-size: 64px;
      }

      .detail-info {
        flex: 1;

        h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .detail-version {
          color: var(--text-muted);
          font-size: 14px;
        }
      }
    }

    .detail-section {
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      p {
        color: var(--text-secondary);
        line-height: 1.8;
        margin: 0;
      }
    }

    .detail-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      .meta-stat {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: var(--bg-color);
        border-radius: var(--radius-lg);

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius);
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        .stat-info {
          .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
          }

          .stat-label {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
      }
    }

    .detail-tags {
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      .tags-list {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    .detail-author {
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      p {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .detail-links {
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      .links-list {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
    }
  }
}

@media (max-width: 768px) {
  .plugins-page {
    padding: 20px;

    .plugins-header h1 {
      font-size: 24px;
    }

    .categories {
      .category-btn {
        padding: 8px 16px;
        font-size: 13px;
      }
    }

    .featured-grid {
      grid-template-columns: 1fr !important;
    }

    .plugins-grid {
      grid-template-columns: 1fr !important;
    }

    .detail-meta {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
