import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Article from '@/views/Article.vue'
import About from '@/views/About.vue'
import Archives from '@/views/Archives.vue'
import Contact from '@/views/Contact.vue'
import Admin from '@/views/Admin.vue'
import Editor from '@/views/Editor.vue'
import History from '@/views/History.vue'
import Favorites from '@/views/Favorites.vue'
import Tags from '@/views/Tags.vue'
import TimeMachine from '@/views/TimeMachine.vue'
import Series from '@/views/Series.vue'
import SeriesDetail from '@/views/SeriesDetail.vue'
import Dashboard from '@/views/Dashboard.vue'
import Gallery from '@/views/Gallery.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article,
    meta: { title: '文章详情' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我' }
  },
  {
    path: '/archives',
    name: 'Archives',
    component: Archives,
    meta: { title: '归档' }
  },
  {
    path: '/tags',
    name: 'Tags',
    component: Tags,
    meta: { title: '标签云' }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { title: '阅读历史' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { title: '我的收藏' }
  },
  {
    path: '/time-machine',
    name: 'TimeMachine',
    component: TimeMachine,
    meta: { title: '博客时光机' }
  },
  {
    path: '/series',
    name: 'Series',
    component: Series,
    meta: { title: '文章系列' }
  },
  {
    path: '/series/:id',
    name: 'SeriesDetail',
    component: SeriesDetail,
    meta: { title: '系列详情' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '数据仪表板' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
    meta: { title: '内容画廊' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { title: '联系我' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { title: '管理后台' }
  },
  {
    path: '/editor/:id?',
    name: 'Editor',
    component: Editor,
    meta: { title: '文章编辑器' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '博客'} - 我的个人博客`
  next()
})

export default router
