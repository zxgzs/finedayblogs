<template>
  <div class="archives-page">
    <div class="archives-header">
      <h1>
        <el-icon><FolderOpened /></el-icon>
        文章归档
      </h1>
      <p class="archives-stats">共 {{ articles.length }} 篇文章，持续更新中...</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ articles.length }}</span>
          <span class="stat-label">文章总数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalViews }}</span>
          <span class="stat-label">总阅读量</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ yearsCount }}</span>
          <span class="stat-label">创作年份</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ avgReadingTime }}</span>
          <span class="stat-label">平均阅读(分钟)</span>
        </div>
      </div>
    </div>

    <!-- 年度统计图表 -->
    <div class="year-chart">
      <h3 class="chart-title">
        <el-icon><TrendCharts /></el-icon>
        年度文章发布统计
      </h3>
      <div class="chart-bars">
        <div
          v-for="(count, year) in yearlyStats"
          :key="year"
          class="chart-bar-item"
        >
          <div class="bar-label">{{ year }}</div>
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{ height: (count / maxYearCount * 100) + '%' }"
            ></div>
          </div>
          <div class="bar-count">{{ count }}</div>
        </div>
      </div>
    </div>
    
    <div class="archives-content">
      <div 
        v-for="(yearData, year) in groupedArticles" 
        :key="year" 
        class="archive-year"
      >
        <h2 class="year-title">
          <span class="year-badge">{{ year }}</span>
          年
          <span class="year-count">{{ yearData.length }} 篇</span>
        </h2>
        <div class="archive-list">
          <div 
            v-for="article in yearData" 
            :key="article.id" 
            class="archive-item"
            @click="goToArticle(article.id)"
          >
            <div class="item-date">{{ article.date }}</div>
            <div class="item-title">
              <el-icon><Document /></el-icon>
              {{ article.title }}
            </div>
            <div class="item-meta">
              <el-tag size="small" effect="plain">{{ article.category }}</el-tag>
              <span class="views">
                <el-icon><View /></el-icon>
                {{ article.views }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { articles } from '@/data/articles'

const router = useRouter()

const groupedArticles = computed(() => {
  const grouped: Record<string, typeof articles> = {}
  
  articles.forEach(article => {
    const year = article.date.split('-')[0]
    if (!grouped[year]) {
      grouped[year] = []
    }
    grouped[year].push(article)
  })
  
  // Sort articles within each year by date descending
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })
  
  return grouped
})

// 统计计算
const totalViews = computed(() => articles.reduce((sum, a) => sum + a.views, 0))
const yearsCount = computed(() => Object.keys(groupedArticles.value).length)
const avgReadingTime = computed(() => Math.round(articles.reduce((sum, a) => sum + Math.ceil(a.content.length / 300), 0) / articles.length))

// 年度统计
const yearlyStats = computed(() => {
  const stats: Record<string, number> = {}
  Object.keys(groupedArticles.value).sort().forEach(year => {
    stats[year] = groupedArticles.value[year].length
  })
  return stats
})

const maxYearCount = computed(() => Math.max(...Object.values(yearlyStats.value)))

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}
</script>

<style scoped lang="scss">
.archives-page {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
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

  .archives-header {
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 2px solid var(--border-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), var(--info-color));
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--info-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      svg {
        -webkit-text-fill-color: var(--primary-color);
      }
    }
    
    .archives-stats {
      color: var(--text-muted);
      font-size: 15px;
      margin-left: 44px;
    }
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--card-glass);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-color);
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 212, 255, 0.15);
      }

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: var(--radius);
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 22px;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-muted);
        }
      }
    }
  }

  .year-chart {
    background: var(--card-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 24px;
    margin-bottom: 40px;

    .chart-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 24px;
      color: var(--text-primary);

      svg {
        color: var(--primary-color);
      }
    }

    .chart-bars {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 150px;
      gap: 20px;

      .chart-bar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 80px;

        .bar-label {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .bar-container {
          width: 100%;
          height: 100px;
          background: var(--card-bg);
          border-radius: var(--radius);
          display: flex;
          align-items: flex-end;
          overflow: hidden;

          .bar-fill {
            width: 100%;
            background: linear-gradient(180deg, var(--primary-color), var(--info-color));
            border-radius: var(--radius);
            transition: height 0.5s ease;
            min-height: 4px;
          }
        }

        .bar-count {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 8px;
        }
      }
    }
  }
  
  .archives-content {
    .archive-year {
      margin-bottom: 48px;
      
      .year-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);

        .year-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 20px;
          background: linear-gradient(135deg, var(--primary-color), var(--info-color));
          color: white;
          border-radius: var(--radius-full);
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .year-count {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 400;
        }
      }
      
      .archive-list {
        padding-left: 8px;
        
        .archive-item {
          padding: 20px 24px;
          margin-bottom: 12px;
          margin-left: 20px;
          border-left: 2px solid var(--border-color);
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          background: var(--bg-color);
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
          border: 1px solid transparent;
          
          &::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 28px;
            width: 14px;
            height: 14px;
            background: var(--card-bg);
            border: 3px solid var(--primary-color);
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          
          &:hover {
            border-left-color: var(--primary-color);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.05));
            transform: translateX(8px);
            border-color: rgba(99, 102, 241, 0.2);
            
            &::before {
              background: linear-gradient(135deg, var(--primary-color), var(--info-color));
              box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
              transform: scale(1.2);
            }

            .item-title {
              color: var(--primary-color);
            }
          }
          
          .item-date {
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 8px;
            font-family: 'Fira Code', monospace;
          }
          
          .item-title {
            font-size: 17px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: color 0.3s ease;

            svg {
              color: var(--primary-color);
            }
          }
          
          .item-meta {
            display: flex;
            align-items: center;
            gap: 16px;

            .views {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: var(--text-muted);

              svg {
                width: 14px;
                height: 14px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .archives-page {
    padding: 24px;
    
    .archives-header {
      h1 {
        font-size: 26px;
      }
    }
    
    .archives-content .archive-year {
      .year-title {
        font-size: 20px;
      }

      .archive-list .archive-item {
        padding: 16px 20px;
      }
    }
  }
}
</style>
