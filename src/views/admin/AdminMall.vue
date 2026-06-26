<template>
  <div class="admin-page">
    <div class="admin-sidebar">
      <h3>管理后台</h3>
      <nav>
        <router-link to="/" class="admin-nav-item admin-nav-back">← 返回官网</router-link>
        <router-link to="/admin/announcements" class="admin-nav-item">公告管理</router-link>
        <router-link to="/admin/mall" class="admin-nav-item active-link">商城管理</router-link>
        <router-link v-if="isSuperAdmin" to="/admin/users" class="admin-nav-item">用户管理</router-link>
      </nav>
      <div class="admin-sidebar-footer">
        <span>{{ user && user.name }}</span>
        <button @click="handleLogout">退出登录</button>
      </div>
    </div>
    <div class="admin-main">
      <template v-if="!editing">
        <div class="admin-header">
          <h2>商城管理</h2>
          <button class="btn-primary" @click="startCreate">+ 添加商品</button>
        </div>
        <table class="admin-table">
          <thead><tr><th>商品名称</th><th>保险公司</th><th>价格</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.provider }}</td>
              <td>{{ item.price }}</td>
              <td><span :class="['status', item.status]">{{ item.status === 'active' ? '上架' : '下架' }}</span></td>
              <td class="actions">
                <button class="btn-sm" @click="startEdit(item)">编辑</button>
                <button class="btn-sm btn-danger" @click="handleDelete(item.id)">删除</button>
              </td>
            </tr>
            <tr v-if="list.length === 0"><td colspan="5" style="text-align:center;color:#999">暂无商品</td></tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <div class="admin-header">
          <h2>{{ editId ? '编辑商品' : '添加商品' }}</h2>
          <button class="btn-secondary" @click="cancelEdit">返回列表</button>
        </div>
        <div class="admin-form-card">
          <label class="form-field"><span>商品名称</span><input v-model="form.name" type="text" placeholder="请输入商品名称" required></label>
          <label class="form-field"><span>保险公司</span><input v-model="form.provider" type="text" placeholder="请输入保险公司"></label>
          <label class="form-field"><span>价格</span><input v-model="form.price" type="text" placeholder="请输入价格描述"></label>
          <label class="form-field"><span>链接</span><input v-model="form.link" type="url" placeholder="商品链接"></label>
          <label class="form-field"><span>图片链接</span><input v-model="form.image" type="url" placeholder="商品图片链接"></label>
          <label class="form-field">
            <span>状态</span>
            <select v-model="form.status"><option value="active">上架</option><option value="inactive">下架</option></select>
          </label>
          <div class="form-actions">
            <button class="btn-primary" @click="handleSave" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
            <button class="btn-secondary" @click="cancelEdit">取消</button>
          </div>
          <p v-if="formError" class="form-error">{{ formError }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminApi } from '@/composables/useAdminApi'

const router = useRouter()
const { user, isSuperAdmin, logout, getProducts, createProduct, updateProduct, deleteProduct } = useAdminApi()

const list = ref([])
const editing = ref(false)
const editId = ref(null)
const saving = ref(false)
const formError = ref('')
const form = ref({ name: '', provider: '', price: '', link: '', image: '', status: 'active' })

async function loadList() {
  try { list.value = await getProducts() } catch (e) { console.error(e) }
}

function startCreate() {
  editId.value = null
  form.value = { name: '', provider: '', price: '', link: '', image: '', status: 'active' }
  formError.value = ''
  editing.value = true
}

function startEdit(item) {
  editId.value = item.id
  form.value = { name: item.name, provider: item.provider || '', price: item.price || '', link: item.link || '', image: item.image || '', status: item.status || 'active' }
  formError.value = ''
  editing.value = true
}

function cancelEdit() { editing.value = false; loadList() }

async function handleSave() {
  if (!form.value.name.trim()) { formError.value = '请输入商品名称'; return }
  formError.value = ''
  saving.value = true
  try {
    if (editId.value) {
      await updateProduct(editId.value, form.value)
    } else {
      await createProduct(form.value)
    }
    cancelEdit()
  } catch (e) { formError.value = e.message } finally { saving.value = false }
}

async function handleDelete(id) {
  if (!confirm('确定删除该商品？')) return
  try { await deleteProduct(id); loadList() } catch (e) { alert(e.message) }
}

function handleLogout() { logout(); router.push('/admin/login') }
onMounted(loadList)
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
.admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.admin-header h2 { margin: 0; font-size: 20px; }
.btn-primary { padding: 8px 20px; background: #1a4977; color: #fff; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
.btn-primary:disabled { background: #aaa; }
.btn-secondary { padding: 8px 20px; background: #e8e8e8; color: #333; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
.btn-sm { padding: 4px 10px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; margin-right: 6px; }
.btn-danger { color: #e53935; border-color: #e53935; }
.btn-danger:hover { background: #ffebee; }
.admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.admin-table th { background: #f5f5f5; padding: 12px 16px; text-align: left; font-size: 13px; color: #666; }
.admin-table td { padding: 12px 16px; border-top: 1px solid #f0f0f0; font-size: 14px; }
.status { padding: 2px 10px; border-radius: 10px; font-size: 12px; }
.status.active { background: #e8f5e9; color: #2e7d32; }
.status.inactive { background: #fafafa; color: #999; }
.admin-form-card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; font-size: 13px; color: #555; }
.form-field input, .form-field select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; outline: none; }
.form-field input:focus, .form-field select:focus { border-color: #1a4977; }
.form-actions { display: flex; gap: 10px; margin-top: 8px; }
.form-error { color: #e53935; font-size: 13px; margin: 8px 0 0; }
</style>
