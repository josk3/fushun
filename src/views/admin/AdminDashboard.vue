<template>
  <div class="admin-page">
    <div class="admin-sidebar">
      <h3>管理后台</h3>
      <nav>
        <router-link to="/" class="admin-nav-item admin-nav-back">← 返回官网</router-link>
        <router-link to="/admin/announcements" class="admin-nav-item">公告管理</router-link>
        <router-link to="/admin/mall" class="admin-nav-item">商城管理</router-link>
        <router-link v-if="isSuperAdmin" to="/admin/users" class="admin-nav-item">用户管理</router-link>
      </nav>
      <div class="admin-sidebar-footer">
        <span>{{ user && user.name }} ({{ user && user.role === 'super_admin' ? '超级管理员' : '用户' }})</span>
        <button @click="handleLogout">退出登录</button>
      </div>
    </div>
    <div class="admin-main">
      <h2>欢迎回来，{{ user && user.name }}</h2>
      <div class="admin-cards">
        <router-link to="/admin/announcements" class="admin-card">
          <div class="admin-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <strong>公告管理</strong>
          <span>发布、编辑和删除公告通知</span>
        </router-link>
        <router-link to="/admin/mall" class="admin-card">
          <div class="admin-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <strong>商城管理</strong>
          <span>管理产品商城商品</span>
        </router-link>
        <router-link v-if="isSuperAdmin" to="/admin/users" class="admin-card">
          <div class="admin-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <strong>用户管理</strong>
          <span>管理系统用户权限</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminApi } from '@/composables/useAdminApi'

const router = useRouter()
const { user, isSuperAdmin, logout } = useAdminApi()

function handleLogout() {
  logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}
.admin-sidebar {
  width: 220px;
  background: #1a2332;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex-shrink: 0;
}
.admin-sidebar h3 {
  margin: 0 0 24px;
  padding: 0 20px;
  font-size: 16px;
  color: rgba(255,255,255,0.9);
}
.admin-nav-item {
  display: block;
  padding: 12px 20px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s, color 0.2s;
}
.admin-nav-item:hover, .admin-nav-item.router-link-active {
  background: rgba(255,255,255,0.08);
  color: #fff;
}
.admin-nav-back {
  color: rgba(185,150,88,0.8);
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 14px;
}
.admin-nav-back:hover {
  color: #d6bfa9;
}
.admin-sidebar-footer {
  margin-top: auto;
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}
.admin-sidebar-footer button {
  display: block;
  margin-top: 8px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.admin-sidebar-footer button:hover {
  background: rgba(255,255,255,0.2);
}
.admin-main {
  flex: 1;
  padding: 32px;
}
.admin-main h2 {
  margin: 0 0 24px;
  font-size: 22px;
  color: #1a1a1a;
}
.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.admin-card {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}
.admin-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
.admin-card-icon {
  color: #1a4977;
  margin-bottom: 12px;
}
.admin-card strong {
  display: block;
  font-size: 16px;
  margin-bottom: 6px;
}
.admin-card span {
  font-size: 13px;
  color: #888;
}
</style>
