<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1>
        <el-icon><DataAnalysis /></el-icon>
        数据仪表板
      </h1>
      <div class="header-actions">
        <el-select v-model="timeRange" size="default" style="width: 150px">
          <el-option label="近7天" value="7" />
          <el-option label="近30天" value="30" />
          <el-option label="近90天" value="90" />
        </el-select>
        <el-button :icon="Refresh" @click="refreshData">
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 - 合并为一行 -->
    <div class="stats-grid stats-grid-compact">
      <StatsCard
        title="总浏览量"
        :value="readingStats.totalViews"
        type="primary"
        :icon="View"
        unit="次"
        :trend="12.5"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="总阅读时长"
        :value="readingStats.totalReadTime"
        type="success"
        :icon="Clock"
        unit="分钟"
        :trend="8.3"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="文章数量"
        :value="readingStats.articlesRead"
        type="warning"
        :icon="Document"
        unit="篇"
        :trend="-2.1"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="完成率"
        :value="readingStats.completionRate"
        type="info"
        :icon="CircleCheck"
        unit="%"
        :trend="5.7"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="总点赞数"
        :value="interactionStats.totalLikes"
        type="primary"
        :icon="Star"
        unit="次"
        :trend="15.2"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="总评论数"
        :value="interactionStats.totalComments"
        type="success"
        :icon="ChatDotRound"
        unit="条"
        :trend="18.7"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="总分享数"
        :value="interactionStats.totalShares"
        type="warning"
        :icon="Share"
        unit="次"
        :trend="22.4"
        :loading="isLoading"
        compact
      />
      <StatsCard
        title="平均互动"
        :value="interactionStats.averageEngagement"
        type="info"
        :icon="TrendCharts"
        unit="次"
        :trend="10.6"
        :loading="isLoading"
        compact
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-row">
      <!-- 趋势图 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>阅读趋势</h3>
          <el-radio-group v-model="trendType" size="small">
            <el-radio-button label="views">浏览量</el-radio-button>
            <el-radio-button label="likes">点赞数</el-radio-button>
            <el-radio-button label="comments">评论数</el-radio-button>
          </el-radio-group>
        </div>
        <AnalyticsChart :option="trendChartOption" height="350px" />
      </div>

      <!-- 时段分布 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>阅读时段分布</h3>
        </div>
        <AnalyticsChart :option="timeChartOption" height="350px" />
      </div>
    </div>

    <div class="charts-row">
      <!-- 分类统计 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>分类统计</h3>
        </div>
        <AnalyticsChart :option="categoryChartOption" height="350px" />
      </div>

      <!-- 互动率 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>互动率分析</h3>
        </div>
        <AnalyticsChart :option="engagementChartOption" height="350px" />
      </div>
    </div>

    <!-- 文章影响力 -->
    <div class="impact-section">
      <ArticleImpact :impacts="articleImpacts" />
    </div>

    <!-- 用户行为热力图 -->
    <div class="heatmap-section">
      <UserHeatmap :heatmap-data="heatmapData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DataAnalysis,
  Refresh,
  View,
  Clock,
  Document,
  CircleCheck,
  Star,
  ChatDotRound,
  Share,
  TrendCharts
} from '@element-plus/icons-vue'
import { articles } from '@/data/articles'
import { useAnalytics } from '@/composables/useAnalytics'
import StatsCard from '@/components/StatsCard.vue'
import AnalyticsChart from '@/components/AnalyticsChart.vue'
import ArticleImpact from '@/components/ArticleImpact.vue'
import UserHeatmap from '@/components/UserHeatmap.vue'

const {
  isLoading,
  getReadingStats,
  getInteractionStats,
  getTrendData,
  getArticleImpacts,
  generateHeatmapData,
  getTimeDistribution,
  getCategoryStats
} = useAnalytics()

const timeRange = ref('7')
const trendType = ref('views')

const readingStats = ref(getReadingStats())
const interactionStats = ref(getInteractionStats())
const trendData = ref(getTrendData())
const articleImpacts = ref(getArticleImpacts(articles))
const heatmapData = ref(generateHeatmapData(0))
const timeDistribution = ref(getTimeDistribution())
const categoryStats = ref(getCategoryStats(articles))

const trendChartOption = computed(() => {
  const data = trendData.value
  const colors = {
    views: '#409EFF',
    likes: '#67C23A',
    comments: '#E6A23C'
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLine: { lineStyle: { color: '#E4E7ED' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F2F3F7' } },
      axisLabel: { color: '#606266' }
    },
    series: [{
      name: '数量',
      type: 'line',
      smooth: true,
      data: data.map(d => d[trendType.value as keyof typeof d]),
      lineStyle: { color: colors[trendType.value as keyof typeof colors] },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors[trendType.value as keyof typeof colors] + '33' },
            { offset: 1, color: colors[trendType.value as keyof typeof colors] + '05' }
          ]
        }
      }
    }]
  }
})

const timeChartOption = computed(() => {
  const data = timeDistribution.value
  const maxCount = Math.max(...data.map(d => d.count))

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.hour),
      axisLine: { lineStyle: { color: '#E4E7ED' } },
      axisLabel: { color: '#606266', interval: 3 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F2F3F7' } },
      axisLabel: { color: '#606266' }
    },
    series: [{
      name: '阅读次数',
      type: 'bar',
      data: data.map(d => ({
        value: d.count,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#409EFF' },
              { offset: 1, color: '#409EFF66' }
            ]
          }
        }
      }))
    }]
  }
})

const categoryChartOption = computed(() => {
  const data = categoryStats.value

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 篇 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center'
    },
    series: [{
      name: '文章分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data.map(d => ({
        name: d.category,
        value: d.articleCount
      }))
    }]
  }
})

const engagementChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['点赞率', '评论率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: interactionStats.value.likeRate ? ['点赞率', '评论率'] : [],
      axisLine: { lineStyle: { color: '#E4E7ED' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      name: '百分比 (%)',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F2F3F7' } },
      axisLabel: { color: '#606266' }
    },
    series: [
      {
        name: '点赞率',
        type: 'bar',
        data: interactionStats.value.likeRate ? [interactionStats.value.likeRate] : [],
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '评论率',
        type: 'bar',
        data: interactionStats.value.commentRate ? [interactionStats.value.commentRate] : [],
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
})

const refreshData = () => {
  isLoading.value = true

  // 模拟异步加载
  setTimeout(() => {
    readingStats.value = getReadingStats()
    interactionStats.value = getInteractionStats()
    trendData.value = getTrendData()
    articleImpacts.value = getArticleImpacts(articles)
    heatmapData.value = generateHeatmapData(0)
    timeDistribution.value = getTimeDistribution()
    categoryStats.value = getCategoryStats(articles)

    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 24px;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    &.stats-grid-compact {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;

      @media (min-width: 1200px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (min-width: 1600px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
  }

  .charts-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    @media (min-width: 1400px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .chart-container {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--shadow);

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
      }
    }
  }

  .impact-section,
  .heatmap-section {
    margin-bottom: 24px;
  }
}
</style>
