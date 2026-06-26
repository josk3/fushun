<template>
  <!-- Home / Info layout: official-header -->
  <header
    v-if="isOfficial"
    class="official-header"
    :class="{ scrolled: isScrolled, 'info-top': isInfoPage }"
    role="banner"
  >
    <div class="official-header-inner">
      <router-link
        v-if="isInfoPage"
        to="/"
        class="official-logo official-logo-img"
        aria-label="福顺保险经纪首页"
      >
        <img src="/img/official/logo_light.png" alt="福顺保险经纪有限公司">
      </router-link>
      <router-link v-else to="/" class="official-logo" aria-label="福顺保险经纪首页">
        <span class="official-logo-mark">FS</span>
        <span>福顺保险经纪</span>
      </router-link>
      <nav class="official-nav" :class="{ open: menuOpen }" aria-label="主导航">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="{ active: isActive(item.path) }"
          @click="menuOpen = false"
        >{{ item.label }}</router-link>
      </nav>
      <div class="header-login-area">
        <template v-if="adminUser">
          <div class="header-user-dropdown">
            <span class="header-user-name">{{ adminUser.name }}</span>
            <div class="header-user-menu">
              <router-link to="/admin" @click="menuOpen = false">进入后台</router-link>
              <button @click="handleLogout">退出登录</button>
            </div>
          </div>
        </template>
        <router-link v-else to="/admin/login" class="header-login-btn" @click="menuOpen = false">登录</router-link>
      </div>
      <button
        class="official-menu"
        aria-label="打开导航菜单"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      ><span></span><span></span><span></span></button>
    </div>
  </header>

  <!-- Default layout: header -->
  <header
    v-else
    class="header header-solid"
    :class="{ scrolled: isScrolled }"
    role="banner"
  >
    <div class="container">
      <router-link to="/" class="logo">
        <span class="logo-icon">FS</span>
        <span class="logo-text">福顺保险经纪</span>
      </router-link>
      <nav class="nav" :class="{ open: menuOpen }" role="navigation" aria-label="主导航">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="{ active: isActive(item.path) }"
          @click="menuOpen = false"
        >{{ item.label }}</router-link>
      </nav>
      <div class="header-login-area">
        <template v-if="adminUser">
          <div class="header-user-dropdown">
            <span class="header-user-name">{{ adminUser.name }}</span>
            <div class="header-user-menu">
              <router-link to="/admin" @click="menuOpen = false">进入后台</router-link>
              <button @click="handleLogout">退出登录</button>
            </div>
          </div>
        </template>
        <router-link v-else to="/admin/login" class="header-login-btn" @click="menuOpen = false">登录</router-link>
      </div>
      <button
        class="mobile-toggle"
        :class="{ active: menuOpen }"
        aria-label="打开导航菜单"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      ><span></span><span></span><span></span></button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollEffects } from '@/composables/useScrollEffects'

const route = useRoute()
const router = useRouter()
const { isScrolled } = useScrollEffects()
const menuOpen = ref(false)

// Admin login state from localStorage
const adminUser = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))
watch(() => route.path, () => {
  adminUser.value = JSON.parse(localStorage.getItem('admin_user') || 'null')
  menuOpen.value = false
})

function handleLogout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  adminUser.value = null
  router.push('/')
}

const navItems = [
  { path: '/', label: '首页' },
  { path: '/info', label: '信息披露' },
  { path: '/about', label: '关于我们' },
  { path: '/service', label: '客户服务' },
  { path: '/products', label: '产品介绍' },
  { path: '/mall', label: '产品商城' },
  { path: '/announcement', label: '公告通知' },
  { path: '/contact', label: '联系我们' },
]

const isOfficial = computed(() => {
  const layout = route.meta.layout
  return layout === 'home' || layout === 'info'
})

const isInfoPage = computed(() => route.meta.layout === 'info')

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

watch(() => route.path, () => { menuOpen.value = false })
</script>
