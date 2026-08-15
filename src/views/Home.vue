<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

function go(target) {
  router.push(target)
}
</script>

<template>
  <div class="home">
    <h1>电子围栏签到系统</h1>
    <p class="sub">免费方案：Leaflet + 天地图 + turf 围栏判断</p>
    <div class="cards">
      <button class="card card-admin" @click="go('/admin')">
        <strong>PC 管理端</strong>
        <span>配置签到围栏（绘制多边形 / 圆形）</span>
      </button>
      <button class="card card-checkin" @click="go(isMobile() ? '/checkin' : '/checkin')">
        <strong>移动端签到</strong>
        <span>定位并判断是否在围栏内</span>
      </button>
    </div>
    <p class="tip">
      提示：移动端定位需在 HTTPS 或 localhost 环境下使用；本 demo 数据存储在浏览器本地，PC 与移动端需使用同一浏览器访问共享围栏。
    </p>
  </div>
</template>

<style scoped>
.home {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #eef4ff 0%, #f6f9ff 100%);
  text-align: center;
}

h1 {
  font-size: 28px;
  color: #1a3a6b;
}

.sub {
  color: #667;
}

.cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  width: 240px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border-radius: 12px;
  color: #fff;
  transition: transform 0.15s;
}

.card:hover {
  transform: translateY(-3px);
}

.card-admin {
  background: #3388ff;
}

.card-checkin {
  background: #22b07d;
}

.card strong {
  font-size: 18px;
}

.tip {
  max-width: 520px;
  font-size: 13px;
  color: #889;
  line-height: 1.6;
}
</style>
