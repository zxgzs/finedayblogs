# 掘金 & CSDN 文章发布指南

> 基于 SakuraBlog 的 3 篇 ECharts 爆款文章，已按平台规则分别优化。

---

## 一、GitHub Topics 设置（10秒）

**打开：** https://github.com/zxgzs/finedayblogs/settings

**往下滚到 Topics 区域，依次输入以下标签（回车确认每个）：**

```
vue3
blog-template
echarts
data-visualization
typescript
vite
element-plus
sakura
glassmorphism
dashboard
frontend
```

**这些标签的作用：** 让开发者在搜索 "vue3 blog template" 或 "echarts dashboard" 时能搜到你的项目。`blog-template` 和 `data-visualization` 是高流量标签。

---

## 二、掘金发布（推荐首发）

### 📄 文章一：【原创】前端如何用ECharts做出老板夸爆的数据大屏？（附完整源码）

**标题：** `【原创】前端如何用ECharts做出老板夸爆的数据大屏？（附完整源码）`

**封面图：** 使用博客的 OG 图或自己截图一张大屏效果

**分类选择：** 前端 > Vue.js（或 前端 > 其他）

**标签/话题：**
```
ECharts
Vue.js
数据可视化
数据大屏
前端
TypeScript
源码分享
```

**文章正文（直接复制到掘金编辑器）：**

```markdown
> 做过一个真实的 SCADA 数据大屏项目后，我总结了一套**从零到上线**的完整方法论。今天全部分享给你，文末附完整可运行源码。

![技术栈](https://img.shields.io/badge/技术栈-Vue3%20%2B%20ECharts%20%2B%20TS-blue?style=for-the-badge)

## 为什么写这篇文章？

市面上的 ECharts 教程大多停留在"画一个柱状图"的阶段。但真正的工作场景中，老板和客户想要的是这种：

- 🔥 **酷炫的视觉效果** — 渐变、发光、粒子背景
- 📊 **多图表联动** — 点击地图，其他图表跟着变
- 🖥️ **大屏自适应** — 投影仪、拼接屏都能完美展示
- ⚡ **实时数据刷新** — WebSocket 推送，数字跳动

这些东西，官方文档讲得少，网上碎片化教程又不系统。**本文一次讲透。**

---

## 第一章：大屏设计规范（很多人第一步就错了）

### 1.1 分分辨率选择

\`\`\`
标准大屏分辨率：1920 × 1080（16:9）
拼接屏常见：3840 × 2160 / 5760 × 2160
适配策略：设计稿按 1920×1080，运行时 scale 缩放
\`\`\`

### 1.2 配色方案

数据大屏不是越花哨越好。成熟的配色就这几套：

\`\`\`css
/* 深色科技风（推荐） */
--bg-primary: #0a1a3a;
--bg-secondary: #0d213b;
--border-color: #1a3a5c;
--text-primary: #e0f0ff;
--text-secondary: #8ab4d8;
--accent-cyan: #00d4ff;
--accent-blue: #0078ff;
--accent-gold: #ffc107;

/* 关键原则：
   1. 背景深色（减少视觉疲劳 + 突出图表）
   2. 强调色不超过3种
   3. 文字对比度要够（WCAG AA标准）
*/
\`\`\`

---

## 第二章：ECharts 核心图表实战

### 2.1 酷炫柱状图（渐变 + 圆角 + 发光）

这是大屏中最常用的图表类型，但默认样式太朴素了：

\`\`\`typescript
import * as echarts from 'echarts'

const barOption = {
  grid: { top: 40, right: 20, bottom: 30, left: 50 },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月'],
    axisLine: { lineStyle: { color: '#1a3a5c' } },
    axisLabel: { color: '#8ab4d8', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#1a3a5c', type: 'dashed' } },
    axisLabel: { color: '#8ab4d8' }
  },
  series: [{
    type: 'bar',
    barWidth: 20,
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#00d4ff' },    // 顶部亮青色
        { offset: 1, color: '#0078ff' }     // 底部深蓝色
      ]),
      shadowColor: 'rgba(0, 212, 255, 0.3)',
      shadowBlur: 10
    },
    data: [320, 450, 380, 520, 490, 610],
    animationDelay: (idx: number) => idx * 100  // 逐个动画
  }]
}
\`\`\`

**关键技巧：**

- \`LinearGradient\` 让柱子有质感（比纯色高级10倍）
- \`shadowBlur\` 制造发光效果（科技感来源）
- \`animationDelay\` 让柱子依次升起（动感十足）

### 2.2 环形进度图（大屏KPI标配）

每个大屏都有几个核心 KPI 指标，环形图是最佳展示方式：

\`\`\`typescript
const gaugeOption = {
  series: [{
    type: 'pie',
    radius: ['65%', '80%'],       // 环形：内半径 + 外半径
    startAngle: 90,
    silent: true,                  // 不响应鼠标事件
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#00d4ff' },
        { offset: 1, color: '#0078ff' }
      ])
    },
    label: {
      show: true,
      position: 'center',
      formatter: () => \`{value|85.6%}\\n{name|完成率}\`,
      rich: {
        value: { fontSize: 28, fontWeight: 'bold', color: '#e0f0ff', lineHeight: 36 },
        name: { fontSize: 12, color: '#8ab4d8', lineHeight: 20 }
      }
    },
    data: [
      { value: 85.6, name: '完成率' },
      { value: 14.4, name: '剩余', itemStyle: { color: '#1a3a5c' } }
    ]
  }]
}
\`\`\`

### 2.3 折线面积图（趋势数据的最佳表达）

\`\`\`typescript
const lineOption = {
  grid: { top: 30, right: 20, bottom: 30, left: 45 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    axisLine: { lineStyle: { color: '#1a3a5c' } },
    axisLabel: { color: '#8ab4d8' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#1a3a5c', type: 'dashed' } },
    axisLabel: { color: '#8ab4d8' }
  },
  series: [{
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: 2, color: '#00d4ff' },
    itemStyle: { color: '#00d4ff' },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
        { offset: 1, color: 'rgba(0, 212, 255, 0)' }
      ])
    },
    data: [120, 280, 250, 350, 290, 420]
  }]
}
\`\`\`

---

## 第三章：大屏幕自适应（最关键的一环）

这是**最多人踩坑的地方**。大屏要投在各种尺寸的屏幕上：

### 3.1 scale 方案（推荐✅）

\`\`\`typescript
// composables/useScreenScale.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenScale(designWidth = 1920, designHeight = 1080) {
  const scale = ref(1)
  const screenRef = ref<HTMLElement>()

  const resize = () => {
    if (!screenRef.value) return
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    const scaleX = screenWidth / designWidth
    const scaleY = screenHeight / designHeight
    scale.value = Math.min(scaleX, scaleY)  // 取较小值
    
    screenRef.value.style.transform = \`scale(\${scale.value})\`
    screenRef.value.style.transformOrigin = 'top left'
    screenRef.value.style.width = \`\${designWidth}px\`
    screenRef.value.style.height = \`\${designHeight}px\`
  }

  onMounted(() => {
    resize()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })

  return { scale, screenRef }
}

// <div ref="screenRef" class="screen-container">...你的大屏内容...</div>
\`\`\`

### 3.2 两种方案对比

| | **scale方案** | **rem方案** |
|--|---------|--------|
| 宽高比 | ✅ 严格保持 | ❌ 可能变形 |
| 字体清晰 | ⚠️ 极端比例时 | ✅ 始终清晰 |
| 开发体验 | ✅ 按固定像素写 | ⚠️ 要转rem单位 |
| 适用场景 | 大屏/展示屏 | 后台管理系统 |

---

## 第四章：数字滚动 & 特效组件

大屏没有动画就没有灵魂。

### 4.1 数字滚动效果

\`\`\`vue
<!-- components/NumberRoll.vue -->
<template>
  <span class="number-roll">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  value: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), { duration: 1500 })

const displayValue = ref(0)

function animateNumber(target: number) {
  const startTime = Date.now()
  const startValue = displayValue.value
  
  const step = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // easeOutExpo 缓动函数 — 快速启动，缓慢结束
    const easeProgress = progress === 1 
      ? 1 
      : 1 - Math.pow(2, -10 * progress)
    
    displayValue.value = Math.floor(
      startValue + (target - startValue) * easeProgress
    )
    
    if (progress < 1) requestAnimationFrame(step)
  }
  
  requestAnimationFrame(step)
}

watch(() => props.value, (val) => animateNumber(val), { immediate: true })
</script>

<style scoped>
.number-roll {
  font-variant-numeric: tabular-nums;  /* 等宽数字，避免抖动 */
  font-family: 'DIN Alternate', 'Roboto Mono', monospace;
  font-weight: bold;
  background: linear-gradient(180deg, #fff 0%, #8ab4d8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
\`\`\`

### 4.2 科技风边框装饰组件

\`\`\`vue
<!-- components/PanelBorder.vue -->
<template>
  <div class="panel-border">
    <!-- 四角 L 型装饰 -->
    <span class="corner corner-tl"></span>
    <span class="corner corner-tr"></span>
    <span class="corner corner-bl"></span>
    <span class="corner corner-br"></span>
    <!-- 标题栏 -->
    <div v-if="title" class="panel-title">
      <span class="title-decoration"></span>
      {{ title }}
    </div>
    <!-- 内容区 -->
    <div class="panel-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.panel-border {
  position: relative;
  background: rgba(10, 42, 74, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  backdrop-filter: blur(10px);
}

.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #00d4ff;
  border-style: solid;
}
.corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

.panel-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #e0f0ff;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}
.title-decoration {
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, #00d4ff, #0078ff);
  border-radius: 2px;
}
.panel-content {
  padding: 16px;
}
</style>
\`\`\`

---

## 第五章：Vue3 Composable 封装

别每次都重复写初始化代码：

\`\`\`typescript
// composables/useChart.ts
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import * as echarts from 'echarts'

export function useChart<T>(
  chartRef: Ref<HTMLElement | undefined>,
  optionGetter: () => T,
  autoResize = true
) {
  let chart: echarts.ECharts | null = null

  const initChart = () => {
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value, 'dark')
    chart.setOption(optionGetter())
  }

  const updateChart = () => {
    if (!chart) return
    chart.setOption(optionGetter(), true)
  }

  const handleResize = () => chart?.resize()

  onMounted(() => {
    initChart()
    if (autoResize) window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    chart?.dispose()
    chart = null
  })

  watch(optionGetter, updateChart, { deep: true })

  return { chart, updateChart }
}
\`\`\`

使用起来非常简洁：

\`\`\`vue
<template>
  <div ref="barRef" style="width:100%;height:300px"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChart } from '@/composables/useChart'

const barRef = ref<HTMLElement>()
const barOption = ref({ /* ...你的 ECharts 配置 */ })
useChart(barRef, () => barOption.value)
</script>
\`\`\`

---

## 第六章：性能优化（大数据量的坑）

当数据量大时（几千个点），ECharts 会卡：

\`\`\`typescript
// ✅ 方案1：开启分片渲染（最重要！）
chart.setOption({
  series: [{
    type: 'line',
    progressive: 200,       // 分片渲染，每200个点一帧
    progressiveThreshold: 500
  }]
})

// ✅ 方案2：数据采样 — 显示聚合后的数据
function sampleData(data: number[], maxPoints = 500): number[] {
  if (data.length <= maxPoints) return data
  const step = data.length / maxPoints
  return Array.from({ length: maxPoints }, (_, i) =>
    data[Math.floor(i * step)]
  )
}

// ✅ 方案3：节流 resize
import { throttle } from '@vueuse/core'
window.addEventListener('resize', throttle(() => chart?.resize(), 200))
\`\`\`

---

## 总结清单

做一个数据大屏你实际需要的东西：

- ✅ ECharts 核心图表（柱状图/折线图/饼图/地图/散点图）
- ✅ 自适应布局（scale 或 rem）
- ✅ 数字滚动动画（easeOutExpo 缓动）
- ✅ 科技风边框装饰（四角L型 + 渐变标题栏）
- ✅ Vue3 组件封装（useChart composable）
- ✅ 配色方案（深色背景 + 青/蓝/金强调色）
- ✅ 性能优化（progressive 渲染 + 节流 resize）
- ✅ WebSocket 实时数据对接

---

> 👋 我是晴天，专注 **Vue3 + ECharts 数据可视化**开发。
> 
> 如果你正在做大屏项目，有任何问题欢迎评论区交流~
> 
> **个人博客：[fineday.vip](https://fineday.vip)** | **开源模板：[SakuraBlog](https://github.com/zxgzs/finedayblogs)**

---

### 🔥 掘金发布Tips

1. **发文时间：** 周二~周四 晚上 8:00-9:30（流量高峰）
2. **首图：** 用一张大屏效果图做封面，视觉冲击力强
3. **摘要栏填写：** 从零搭建SCADA级数据大屏，7章实战+完整源码
4. **开启评论区互动** — 发布后前30分钟回复所有评论，算法会加权推荐
5. **文章底部加话题标签：** #前端 #Vue #ECharts #数据可视化 #开源

---

## 📄 文章二：Vue3 封装 ECharts 组件：一次编写到处复用

**标题：** `【原创】Vue3 封装 ECharts 组件：一次编写到处复用`

**分类：** 前端 > Vue.js

**标签：**
```
ECharts
Vue.js
组件封装
CompositionAPI
TypeScript
前端进阶
```

**发布时间：** 距离文章一发布后 **2-3天**（形成系列感）

**内容来源：** 博客文章 #8，直接复制 `src/data/articles.ts` 中 id=8 的 content 字段即可。

---

## 📄 文案三：数据大屏 1920 自适应方案：scale vs rem vs vw 全方位对比

**标题：** `【原创】数据大屏 1920 自适应方案：scale vs rem vs vw 全方位对比`

**分类：** 前端 > CSS（或 前端 > 其他）

**标签：**
```
CSS
数据大屏
自适应
前端
响应式
Vue
```

**发布时间：** 距离文章二发布后 **2-3天**

**内容来源：** 博客文章 #9，直接复制 `src/data/articles.ts` 中 id=9 的 content 字段即可。

---

# 三、CSDN 发布

CSDN 和掘金的区别：
- CSDN **SEO权重更高**（百度收录快）
- CSDN **读者群体更广**（初级开发者多，阅读量大）
- 但 CSDN **广告多、体验差**

### 操作步骤

#### 第一步：注册/登录

打开 https://csdn.net ，用微信扫码登录最快。

#### 第二步：进入编辑器

点击顶部 **"发布"** → 选择 **" Markdown 编辑器"**（不是富文本！）

#### 第三步：粘贴文章内容

**和掘金用同一篇文章内容即可**，但需要微调：

1. **删除掘金专属元素**（如 `> 👋 我是晴天` 部分的掘金链接）
2. **CSDN 摘要**：填入 `从零搭建SCADA级数据大屏，涵盖ECharts核心图表、自适应布局、数字滚动特效、边框装饰等实战技巧。基于真实项目经验，附完整可运行源码。`
3. **文章类型选择：** **原创**
4. **分类专栏：** 如果还没有，先创建一个专栏叫「前端进阶」或「Vue3 + ECharts 实战」
5. **标签：** 和掘金一样
6. **封面图：** 同样用大屏效果图

#### 第四步：发布注意事项

- CSDN 对**代码块语言标记**支持好，确保所有 \`\`\` 后面有 typescript/vue/css 标记
- CSDN 支持目录自动生成（在设置里开），建议开启
- **不要同时发到多个平台**（会被判定为抄袭）—— 建议 **先掘金 → 24小时后再发CSDN**
- CSDN 发完后，把 CSDN 链接补充到掘金文章底部的"原文链接"

---

# 四、发布时间表（重要⚡）

| 时间 | 平台 | 文章 | 动作 |
|------|------|------|------|
| **Day 1 （周二晚 8:30）** | 掘金 | 文章一（ECharts大屏） | 首发 |
| Day 1 晚 | 掘金 | 同上 | 前30分钟疯狂回复评论 |
| **Day 3 （周四晚 8:30）** | CSDN | 文章一（同篇） | 二次发布 |
| **Day 5 （周六早 10:00）** | 掘金 | 文件二（组件封装） | 形成系列 |
| Day 7 | 掘金 | 文件三（自适应方案） | 系列完结 |
| Day 9 | CSDN | 文件二 + 三 | 批量同步 |

### ⚠️ 避坑提醒

1. **不要用同一篇文章同时发两个平台** —— Google/百度会判定为镜像内容，两边都降权
2. **先掘金后CSDN** —— 掘金审核更快（通常5分钟内），CSDN 有时需要几小时
3. **CSDN 版要改开头第一段** —— 至少改写30%，避免完全重复
4. **两篇文章之间至少间隔2天** —— 让每篇文章都有独立的流量周期
5. **发布后立刻分享到朋友圈/微信群/技术群**

---

# 五、发布后检查清单

发布完成后逐项确认：

- [ ] 掘金文章 URL 是否正常访问
- [ ] 文章是否被推送到对应的话题/标签页
- [ ] 代码块渲染是否正确（没有格式错乱）
- [ ] 移动端预览是否正常（大部分读者用手机看）
- [ ] 评论功能是否正常
- [ ] 已分享到 3 个以上的技术群
- [ ] GitHub README 中的链接已指向新文章
