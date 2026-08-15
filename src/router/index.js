import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '电子围栏签到系统' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/PcAdmin.vue'),
    meta: { title: '围栏管理（PC）' }
  },
  {
    path: '/checkin',
    name: 'checkin',
    component: () => import('../views/MobileCheckin.vue'),
    meta: { title: '移动签到' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title || '电子围栏签到系统'
})

export default router
