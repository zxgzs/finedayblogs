<template>
  <div class="about-page">
    <div class="about-header">
      <div class="avatar-wrapper">
        <div class="avatar">
          <el-icon :size="50"><UserFilled /></el-icon>
        </div>
        <div class="avatar-ring"></div>
      </div>
      <h1 class="name gradient-text">晴天</h1>
      <p class="bio animated-gradient-text">前端开发 | Vue / React | 技术分享</p>
      <div class="social-badges">
        <span class="badge magnetic">Vue 3</span>
        <span class="badge magnetic">React</span>
        <span class="badge magnetic">TypeScript</span>
      </div>
    </div>
    
    <div class="about-content">
      <div class="about-section">
        <h2 class="section-title">
          <el-icon><Edit /></el-icon>
          关于我
        </h2>
        <div class="section-content">
          <p>你好！我是晴天，一名热爱技术的前端开发工程师，专注于现代 Web 前端技术。</p>
          <p>我创建这个博客的目的是记录学习过程中的点滴，分享前端开发经验，希望能帮助到更多正在学习前端的朋友们。</p>
          <p>平时喜欢研究新技术，关注前端生态，对 Vue、React、TypeScript、小程序等前端技术有浓厚的兴趣。</p>
        </div>
      </div>
      
      <div class="about-section">
        <h2 class="section-title">
          <el-icon><Monitor /></el-icon>
          技术栈
        </h2>
        <div class="skills-grid">
          <div class="skill-item magnetic hover-glow" v-for="skill in skills" :key="skill.name">
            <span class="skill-icon">{{ skill.icon }}</span>
            <span class="skill-name">{{ skill.name }}</span>
          </div>
        </div>
      </div>
      
      <div class="about-section">
        <h2 class="section-title">
          <el-icon><Message /></el-icon>
          联系方式
        </h2>
        <div class="contact-grid">
          <a href="mailto:frontend@example.com" class="contact-card magnetic hover-glow">
            <div class="contact-icon">
              <el-icon><Message /></el-icon>
            </div>
            <div class="contact-info">
              <span class="contact-label">邮箱</span>
              <span class="contact-value">frontend@example.com</span>
            </div>
          </a>
          <a href="#" class="contact-card magnetic hover-glow">
            <div class="contact-icon">
              <el-icon><Position /></el-icon>
            </div>
            <div class="contact-info">
              <span class="contact-label">GitHub</span>
              <span class="contact-value">github.com/fe-dev</span>
            </div>
          </a>
          <a href="#" class="contact-card magnetic hover-glow">
            <div class="contact-icon">
              <el-icon><Connection /></el-icon>
            </div>
            <div class="contact-info">
              <span class="contact-label">微信公众号</span>
              <span class="contact-value">前端加油站</span>
            </div>
          </a>
        </div>
      </div>
      
      <div class="about-section">
        <h2 class="section-title">
          <el-icon><Clock /></el-icon>
          建站历程
        </h2>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in timeline"
            :key="index"
            :timestamp="item.date"
            placement="top"
            :color="index === 0 ? '#6366f1' : '#e2e8f0'"
            :hollow="index !== 0"
          >
            <el-card class="timeline-card" shadow="hover">
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const skills = [
  { name: 'Vue 3', icon: '⚡' },
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'JavaScript', icon: '📜' },
  { name: 'Vite', icon: '🚀' },
  { name: '微信小程序', icon: '💬' },
  { name: 'CSS3', icon: '🎨' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Git', icon: '📦' },
  { name: 'Webpack', icon: '📦' },
  { name: 'Pinia', icon: '📍' },
  { name: 'Tailwind', icon: '💨' }
]

const timeline = [
  {
    date: '2026-04-01',
    title: '博客正式上线',
    description: '经过一段时间的开发，前端技术博客终于正式上线了！'
  },
  {
    date: '2026-03-15',
    title: '开始博客开发',
    description: '使用 Vue 3 + Vite + TypeScript 开始搭建个人博客系统'
  },
  {
    date: '2026-03-01',
    title: '前端之路',
    description: '开启前端学习之旅，从 HTML/CSS 到 Vue/React'
  }
]
</script>

<style scoped lang="scss">
.about-page {
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

  .about-header {
    text-align: center;
    margin-bottom: 60px;
    padding-bottom: 48px;
    border-bottom: 2px solid var(--border-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), var(--info-color));
    }

    .avatar-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;

      .avatar {
        width: 120px;
        height: 120px;
        border-radius: var(--radius-full);
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 50px;
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        position: relative;
        z-index: 1;
      }

      .avatar-ring {
        position: absolute;
        inset: -8px;
        border-radius: var(--radius-full);
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        opacity: 0.3;
        animation: pulse-ring 2s infinite;
      }

      @keyframes pulse-ring {
        0%, 100% {
          transform: scale(1);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.1;
        }
      }
    }

    .name {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--info-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .bio {
      font-size: 16px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    .social-badges {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;

      .badge {
        padding: 8px 16px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1));
        color: var(--primary-color);
        border-radius: var(--radius-full);
        font-size: 13px;
        font-weight: 500;
        border: 1px solid rgba(99, 102, 241, 0.2);
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, var(--primary-color), var(--info-color));
          color: white;
          transform: translateY(-2px);
        }
      }
    }
  }

  .about-content {
    .about-section {
      margin-bottom: 48px;

      .section-title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);

        svg {
          color: var(--primary-color);
          font-size: 24px;
        }
      }

      .section-content {
        color: var(--text-secondary);
        line-height: 1.9;
        font-size: 16px;

        p {
          margin-bottom: 16px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 16px;

        .skill-item {
          text-align: center;
          padding: 20px 16px;
          background: var(--bg-color);
          border-radius: var(--radius-lg);
          font-size: 14px;
          color: var(--text-secondary);
          transition: all 0.3s ease;
          cursor: default;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .skill-icon {
            font-size: 28px;
          }

          .skill-name {
            font-weight: 500;
          }

          &:hover {
            background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            color: white;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
            border-color: transparent;
          }
        }
      }

      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;

        .contact-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-color);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          cursor: pointer;

          .contact-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--radius);
            background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            flex-shrink: 0;
          }

          .contact-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .contact-label {
              font-size: 13px;
              color: var(--text-muted);
            }

            .contact-value {
              font-size: 14px;
              font-weight: 500;
              color: var(--text-primary);
            }
          }

          &:hover {
            background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
            border-color: transparent;

            .contact-icon {
              background: rgba(255, 255, 255, 0.2);
            }

            .contact-info {
              .contact-label, .contact-value {
                color: white;
              }
            }
          }
        }
      }

      .timeline-card {
        border-radius: var(--radius) !important;
        border: 1px solid var(--border-color);
        
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        
        p {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .about-page {
    padding: 24px;

    .about-header {
      .name {
        font-size: 26px;
      }
    }

    .about-content .about-section {
      .skills-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }

      .contact-grid {
        grid-template-columns: 1fr !important;
      }
    }
  }
}
</style>
