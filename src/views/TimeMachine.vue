<template>
  <div class="time-machine-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Clock /></el-icon>
        博客时光机
      </h1>
      <p class="page-desc">记录博客的每一个重要时刻，见证成长的每一步</p>
    </div>

    <!-- 里程碑统计 -->
    <div class="milestones-stats">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- 时间线 -->
    <div class="timeline">
      <div class="timeline-line"></div>
      <div
        v-for="(event, index) in timelineEvents"
        :key="index"
        class="timeline-item"
        :class="[event.type, { highlight: event.highlight }]"
      >
        <div class="timeline-marker">
          <div class="marker-dot"></div>
          <span class="marker-year">{{ event.year }}</span>
        </div>
        <div class="timeline-content">
          <div class="event-header">
            <span class="event-badge" :class="event.type">{{ event.badge }}</span>
            <span class="event-date">{{ event.date }}</span>
          </div>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-desc">{{ event.description }}</p>
          <div class="event-tags">
            <el-tag v-for="tag in event.tags" :key="tag" size="small" effect="plain">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就墙 -->
    <div class="achievements-section">
      <h2 class="section-title">
        <el-icon><Trophy /></el-icon>
        成就墙
      </h2>
      <div class="achievements-grid">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-desc">{{ achievement.description }}</p>
          </div>
          <div class="achievement-status">
            <el-icon v-if="achievement.unlocked" color="#67c23a"><CircleCheck /></el-icon>
            <el-icon v-else color="#909399"><Lock /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 未来展望 -->
    <div class="future-section">
      <div class="future-content">
        <h2>
          <el-icon><Sunrise /></el-icon>
          未来可期
        </h2>
        <p>这只是开始，更多精彩正在路上...</p>
        <div class="future-goals">
          <div class="goal-item" v-for="goal in futureGoals" :key="goal.title">
            <span class="goal-icon">{{ goal.icon }}</span>
            <span class="goal-text">{{ goal.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { articles } from '@/data/articles'

const stats = computed(() => [
  { icon: 'Document', value: articles.length, label: '文章总数' },
  { icon: 'View', value: articles.reduce((sum, a) => sum + a.views, 0), label: '总阅读量' },
  { icon: 'Calendar', value: new Date().getFullYear() - 2022, label: '运营年份' },
  { icon: 'Star', value: articles.reduce((sum, a) => sum + a.likes, 0), label: '总获赞数' }
])

const timelineEvents = [
  {
    year: '2022',
    date: '3月15日',
    badge: '起点',
    type: 'milestone',
    highlight: true,
    title: '博客正式上线',
    description: '经过精心准备，我的个人技术博客终于与大家见面了。第一篇文章《前端开发入门指南》正式发布。',
    tags: ['上线', '首发', '起点']
  },
  {
    year: '2022',
    date: '6月1日',
    badge: '成长',
    type: 'growth',
    highlight: false,
    title: '文章突破10篇',
    description: '在半年内发布了10篇原创技术文章，涵盖了Vue3、TypeScript、Element Plus等热门技术栈。',
    tags: ['里程碑', '成长']
  },
  {
    year: '2022',
    date: '12月31日',
    badge: '年度',
    type: 'milestone',
    highlight: true,
    title: '年度总结',
    description: '2022年共发布24篇文章，累计获得500+阅读量和100+点赞，博客初具规模。',
    tags: ['年度总结', '2022']
  },
  {
    year: '2023',
    date: '3月15日',
    badge: '周年',
    type: 'milestone',
    highlight: true,
    title: '博客一周年',
    description: '博客上线一周年！这一年里，我坚持每周更新，内容质量不断提升，读者群体逐渐扩大。',
    tags: ['周年庆', '一周年']
  },
  {
    year: '2023',
    date: '8月20日',
    badge: '升级',
    type: 'feature',
    highlight: false,
    title: '全新UI 2.0发布',
    description: '博客迎来重大改版，采用科技感十足的深色主题，添加了动态背景、粒子效果等炫酷元素。',
    tags: ['UI升级', '新版本']
  },
  {
    year: '2023',
    date: '12月31日',
    badge: '年度',
    type: 'milestone',
    highlight: true,
    title: '2023年度数据',
    description: '全年发布48篇文章，阅读量突破10000+，新增评论区、赞赏功能，博客生态日趋完善。',
    tags: ['年度总结', '2023']
  },
  {
    year: '2024',
    date: '5月1日',
    badge: '功能',
    type: 'feature',
    highlight: false,
    title: '加入阅读能量系统',
    description: '引入游戏化机制，读者可以通过阅读获得能量值，解锁各种成就徽章，阅读变得更加有趣。',
    tags: ['新功能', '游戏化']
  },
  {
    year: '2024',
    date: '9月15日',
    badge: '交互',
    type: 'feature',
    highlight: false,
    title: '音乐播放器上线',
    description: '边阅读边听音乐，支持多种风格的背景音乐，让阅读成为一种享受。',
    tags: ['新功能', '音乐']
  },
  {
    year: '2025',
    date: '2月10日',
    badge: 'AI',
    type: 'feature',
    highlight: true,
    title: 'AI助手集成',
    description: '集成智能AI助手，可以回答读者关于文章内容的疑问，提供个性化的学习建议。',
    tags: ['AI', '智能化']
  },
  {
    year: '2025',
    date: '6月1日',
    badge: '活跃',
    type: 'growth',
    highlight: false,
    title: '连续更新100天',
    description: '坚持每天更新文章，连续更新突破100天，累计发布200+篇原创内容。',
    tags: ['里程碑', '坚持']
  },
  {
    year: '2025',
    date: '12月31日',
    badge: '年度',
    type: 'milestone',
    highlight: true,
    title: '2025年度成就',
    description: '全年阅读量突破50000+，粉丝数量增长300%，博客成为技术圈小有名气的学习平台。',
    tags: ['年度总结', '2025']
  },
  {
    year: '2026',
    date: '3月15日',
    badge: '纪念',
    type: 'milestone',
    highlight: true,
    title: '博客四周年',
    description: '四年磨一剑，博客已经成为我技术生涯的重要组成部分。感谢每一位读者的陪伴与支持！',
    tags: ['周年庆', '四周年']
  }
]

const achievements = [
  { id: 1, icon: '📝', name: '笔耕不辍', description: '发布第一篇文章', unlocked: true },
  { id: 2, icon: '🔥', name: '持之以恒', description: '连续更新30天', unlocked: true },
  { id: 3, icon: '👑', name: '阅读破万', description: '总阅读量突破10000', unlocked: true },
  { id: 4, icon: '⭐', name: '获赞达人', description: '获得100个点赞', unlocked: true },
  { id: 5, icon: '🎯', name: '精准定位', description: '文章分类达到10个', unlocked: false },
  { id: 6, icon: '🚀', name: '流量明星', description: '单篇文章阅读破5000', unlocked: false },
  { id: 7, icon: '🏆', name: '年度最佳', description: '获得年度优秀作者', unlocked: false },
  { id: 8, icon: '💎', name: '钻石粉丝', description: '拥有1000粉丝', unlocked: false }
]

const futureGoals = [
  { icon: '📚', title: '出版技术书籍' },
  { icon: '🎥', title: '视频教程' },
  { icon: '🌐', title: '多语言支持' },
  { icon: '📱', title: '移动端APP' }
]
</script>

<style scoped lang="scss">
.time-machine-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: fadeIn 0.5s ease;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;

  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 16px;

    svg {
      color: var(--primary-color);
    }
  }

  .page-desc {
    font-size: 16px;
    color: var(--text-muted);
  }
}

/* 里程碑统计 */
.milestones-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: var(--radius-lg);

      svg {
        font-size: 24px;
        color: white;
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: 28px;
        font-weight: 800;
        color: var(--text-primary);
        font-family: 'Orbitron', monospace;
      }

      .stat-label {
        font-size: 13px;
        color: var(--text-muted);
      }
    }
  }
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 120px;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    padding-left: 40px;
  }

  .timeline-line {
    position: absolute;
    left: 100px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color), var(--primary-color));
    border-radius: 2px;

    @media (max-width: 768px) {
      left: 15px;
    }
  }

  .timeline-item {
    position: relative;
    padding-bottom: 48px;

    &:last-child {
      padding-bottom: 0;
    }

    .timeline-marker {
      position: absolute;
      left: -32px;
      display: flex;
      flex-direction: column;
      align-items: center;

      @media (max-width: 768px) {
        left: -35px;
      }

      .marker-dot {
        width: 16px;
        height: 16px;
        background: var(--primary-color);
        border: 3px solid var(--bg-color);
        border-radius: 50%;
        box-shadow: 0 0 12px var(--primary-color);
      }

      .marker-year {
        margin-top: 8px;
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-color);
        font-family: 'Orbitron', monospace;
      }
    }

    .timeline-content {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 24px;
      transition: all 0.3s;

      &:hover {
        transform: translateX(8px);
        box-shadow: var(--shadow-lg);
      }

      .event-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .event-badge {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;

          &.milestone {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
          }

          &.growth {
            background: linear-gradient(135deg, #67c23a, #85ce61);
            color: white;
          }

          &.feature {
            background: linear-gradient(135deg, #e6a23c, #f56c6c);
            color: white;
          }
        }

        .event-date {
          font-size: 13px;
          color: var(--text-muted);
        }
      }

      .event-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .event-desc {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 12px;
      }

      .event-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    &.highlight .timeline-content {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(124, 58, 237, 0.05));
    }
  }
}

/* 成就墙 */
.achievements-section {
  margin-bottom: 80px;

  .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 32px;

    svg {
      color: #fbbf24;
    }
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .achievement-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    &.unlocked {
      border-color: #67c23a;
      background: linear-gradient(135deg, rgba(103, 194, 58, 0.05), rgba(82, 196, 26, 0.02));

      .achievement-icon {
        filter: grayscale(0);
      }
    }

    &:not(.unlocked) {
      opacity: 0.6;

      .achievement-icon {
        filter: grayscale(1);
      }
    }

    .achievement-icon {
      font-size: 36px;
      flex-shrink: 0;
    }

    .achievement-info {
      flex: 1;
      min-width: 0;

      .achievement-name {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .achievement-desc {
        font-size: 12px;
        color: var(--text-muted);
      }
    }

    .achievement-status {
      svg {
        font-size: 20px;
      }
    }
  }
}

/* 未来展望 */
.future-section {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 48px;
  text-align: center;

  .future-content {
    h2 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 16px;

      svg {
        color: #f59e0b;
      }
    }

    p {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }

    .future-goals {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;

      .goal-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: var(--card-bg);
        border-radius: var(--radius-full);
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .goal-icon {
          font-size: 20px;
        }

        .goal-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
      }
    }
  }
}

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
</style>
