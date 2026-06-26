import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '福顺保险经纪', layout: 'home' }
  },
  {
    path: '/info',
    name: 'Info',
    component: () => import('@/views/InfoView.vue'),
    meta: { title: '信息披露 - 福顺保险经纪', layout: 'info' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于我们 - 福顺保险经纪', layout: 'default' }
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('@/views/ServiceView.vue'),
    meta: { title: '客户服务 - 福顺保险经纪', layout: 'default' }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { title: '产品介绍 - 福顺保险经纪', layout: 'default' }
  },
  {
    path: '/mall',
    name: 'Mall',
    component: () => import('@/views/MallView.vue'),
    meta: { title: '产品商城 - 福顺保险经纪', layout: 'default' }
  },
  {
    path: '/announcement',
    name: 'Announcement',
    component: () => import('@/views/AnnouncementView.vue'),
    meta: { title: '公告通知 - 福顺保险经纪', layout: 'default' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: '联系我们 - 福顺保险经纪', layout: 'default' }
  },
  // Admin routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLogin.vue'),
    meta: { title: '登录 - 福顺内部系统', layout: 'admin' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { title: '管理后台 - 福顺内部系统', layout: 'admin', requireAuth: true }
  },
  {
    path: '/admin/announcements',
    name: 'AdminAnnouncements',
    component: () => import('@/views/admin/AdminAnnouncements.vue'),
    meta: { title: '公告管理 - 福顺内部系统', layout: 'admin', requireAuth: true }
  },
  {
    path: '/admin/mall',
    name: 'AdminMall',
    component: () => import('@/views/admin/AdminMall.vue'),
    meta: { title: '商城管理 - 福顺内部系统', layout: 'admin', requireAuth: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/AdminUsers.vue'),
    meta: { title: '用户管理 - 福顺内部系统', layout: 'admin', requireAuth: true, requireSuperAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || '福顺保险经纪'
})

// Auth guard
router.beforeEach((to) => {
  if (!to.meta.requireAuth) return
  const token = localStorage.getItem('admin_token')
  if (!token) return { path: '/admin/login', query: { redirect: to.fullPath } }

  if (to.meta.requireSuperAdmin) {
    try {
      const user = JSON.parse(localStorage.getItem('admin_user') || 'null')
      if (!user || user.role !== 'super_admin') return { path: '/admin' }
    } catch {
      return { path: '/admin/login' }
    }
  }
})

export default router
