<template>
  <div class="admin-page">
    <div class="admin-sidebar">
      <h3>管理后台</h3>
      <nav>
        <router-link to="/" class="admin-nav-item admin-nav-back">← 返回官网</router-link>
        <router-link to="/admin/announcements" class="admin-nav-item">公告管理</router-link>
        <router-link to="/admin/mall" class="admin-nav-item">商城管理</router-link>
        <router-link to="/admin/users" class="admin-nav-item active-link">用户管理</router-link>
      </nav>
      <div class="admin-sidebar-footer">
        <span>{{ user && user.name }}</span>
        <button @click="handleLogout">退出登录</button>
      </div>
    </div>
    <div class="admin-main">
      <h2>用户管理</h2>
      <table class="admin-table">
        <thead><tr><th>昵称</th><th>手机号</th><th>角色</th><th>注册时间</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.phone }}</td>
            <td><span :class="['role-badge', u.role]">{{ u.role === 'super_admin' ? '超级管理员' : '普通用户' }}</span></td>
            <td>{{ (u.created_at || '').slice(0, 10) }}</td>
            <td>
              <button v-if="u.role !== 'super_admin'" class="btn-sm btn-danger" @click="handleDelete(u.id, u.name)">删除</button>
            </td>
          </tr>
          <tr v-if="users.length === 0"><td colspan="5" style="text-align:center;color:#999">加载中...</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminApi } from '@/composables/useAdminApi'

const router = useRouter()
const { user, logout, getUsers, deleteUser } = useAdminApi()
const users = ref([])

async function loadUsers() {
  try { users.value = await getUsers() } catch (e) { alert(e.message) }
}

async function handleDelete(id, name) {
  if (!confirm(`确定删除用户「${name}」？删除后该用户将无法登录。`)) return
  try { await deleteUser(id); loadUsers() } catch (e) { alert(e.message) }
}

function handleLogout() { logout(); router.push('/admin/login') }
onMounted(loadUsers)
</script>

<style scoped>
.admin-page { display: flex; min-height: 100vh; background: #f0f2f5; }
.admin-sidebar { width: 220px; background: #1a2332; color: #fff; display: flex; flex-direction: column; padding: 20px 0; flex-shrink: 0; }
.admin-sidebar h3 { margin: 0 0 24px; padding: 0 20px; font-size: 16px; }
.admin-nav-item { display: block; padding: 12px 20px; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; transition: background 0.2s; }
.admin-nav-item:hover, .admin-nav-item.active-link { background: rgba(255,255,255,0.08); color: #fff; }
.admin-nav-back { color: rgba(185,150,88,0.8); margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px; }
.admin-nav-back:hover { color: #d6bfa9; }
.admin-sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: rgba(255,255,255,0.5); }
.admin-sidebar-footer button { display: block; margin-top: 8px; padding: 6px 12px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
.admin-main { flex: 1; padding: 32px; }
.admin-main h2 { margin: 0 0 20px; font-size: 20px; }
.btn-sm { padding: 4px 10px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; }
.btn-danger { color: #e53935; border-color: #e53935; }
.btn-danger:hover { background: #ffebee; }
.admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.admin-table th { background: #f5f5f5; padding: 12px 16px; text-align: left; font-size: 13px; color: #666; }
.admin-table td { padding: 12px 16px; border-top: 1px solid #f0f0f0; font-size: 14px; }
.role-badge { padding: 2px 10px; border-radius: 10px; font-size: 12px; }
.role-badge.super_admin { background: #fff3e0; color: #e65100; }
.role-badge.user { background: #e8f5e9; color: #2e7d32; }
</style>
