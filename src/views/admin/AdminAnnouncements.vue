<template>
  <div class="admin-page">
    <div class="admin-sidebar">
      <h3>管理后台</h3>
      <nav>
        <router-link to="/" class="admin-nav-item admin-nav-back">← 返回官网</router-link>
        <router-link to="/admin/announcements" class="admin-nav-item active-link">公告管理</router-link>
        <router-link to="/admin/mall" class="admin-nav-item">商城管理</router-link>
        <router-link v-if="isSuperAdmin" to="/admin/users" class="admin-nav-item">用户管理</router-link>
      </nav>
      <div class="admin-sidebar-footer">
        <span>{{ user && user.name }}</span>
        <button @click="handleLogout">退出登录</button>
      </div>
    </div>
    <div class="admin-main">
      <!-- List View -->
      <template v-if="!editing">
        <div class="admin-header">
          <h2>公告管理</h2>
          <button class="btn-primary" @click="startCreate">+ 发布公告</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr><th>标题</th><th>发布日期</th><th>附件</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ (item.created_at || '').slice(0, 10) }}</td>
              <td>
                <span v-if="(item.attachment_count || 0) + (item.pdf_url ? 1 : 0) > 0">
                  {{ (item.attachment_count || 0) + (item.pdf_url ? 1 : 0) }} 个
                </span>
                <span v-else style="color:#ccc">无</span>
              </td>
              <td class="actions">
                <button class="btn-sm" @click="startEdit(item)">编辑</button>
                <button class="btn-sm btn-danger" @click="handleDelete(item.id)">删除</button>
              </td>
            </tr>
            <tr v-if="list.length === 0"><td colspan="4" style="text-align:center;color:#999">暂无公告</td></tr>
          </tbody>
        </table>
      </template>

      <!-- Edit / Create View -->
      <template v-else>
        <div class="admin-header">
          <h2>{{ editId ? '编辑公告' : '发布公告' }}</h2>
          <button class="btn-secondary" @click="cancelEdit">返回列表</button>
        </div>
        <div class="admin-form-card">
          <label class="form-field">
            <span>标题</span>
            <input v-model="form.title" type="text" placeholder="请输入公告标题" required>
          </label>
          <label class="form-field">
            <span>正文（可选）</span>
            <textarea v-model="form.content" rows="8" placeholder="输入公告正文内容..."></textarea>
          </label>

          <!-- Attachments -->
          <div class="form-field">
            <span>附件</span>
            <!-- Show pdf_url if exists -->
            <div v-if="form.pdf_url" class="attachment-list" style="margin-bottom:8px">
              <div class="attachment-item">
                <span class="att-icon">PDF</span>
                <a :href="form.pdf_url" target="_blank" class="att-name" style="color:#1565c0;text-decoration:underline">{{ form.pdf_url.split('/').pop() || '查看PDF' }}</a>
                <span style="font-size:11px;color:#999">（外链）</span>
              </div>
            </div>
            <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" @click="triggerUpload">
              <input ref="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" style="display:none" @change="handleFileSelect">
              <p>点击或拖拽文件到此处上传</p>
              <small>支持 PDF / Word / PPT / Excel，单文件不超过 20MB</small>
            </div>
            <div v-if="attachments.length" class="attachment-list">
              <div v-for="att in attachments" :key="att.id" class="attachment-item">
                <span class="att-icon">{{ getFileIcon(att.original_name) }}</span>
                <span class="att-name">{{ att.original_name }}</span>
                <button class="btn-sm btn-danger" @click="handleDeleteAttachment(att.id)">删除</button>
              </div>
            </div>
            <div v-if="pendingFiles.length" class="attachment-list">
              <div v-for="(f, i) in pendingFiles" :key="i" class="attachment-item">
                <span class="att-icon">{{ getFileIcon(f.name) }}</span>
                <span class="att-name">{{ f.name }}</span>
                <button class="btn-sm btn-danger" @click="pendingFiles.splice(i, 1)">移除</button>
              </div>
            </div>
          </div>

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
const { user, isSuperAdmin, logout, getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadAttachments, deleteAttachment } = useAdminApi()

const list = ref([])
const editing = ref(false)
const editId = ref(null)
const saving = ref(false)
const formError = ref('')
const fileInput = ref(null)
const pendingFiles = ref([])
const attachments = ref([])

const form = ref({ title: '', content: '', pdf_url: '' })

async function loadList() {
  try { list.value = await getAnnouncements() } catch (e) { console.error(e) }
}

function startCreate() {
  editId.value = null
  form.value = { title: '', content: '', pdf_url: '' }
  attachments.value = []
  pendingFiles.value = []
  formError.value = ''
  editing.value = true
}

async function startEdit(item) {
  try {
    const detail = await getAnnouncement(item.id)
    editId.value = detail.id
    form.value = { title: detail.title, content: detail.content || '', pdf_url: detail.pdf_url || '' }
    attachments.value = detail.attachments || []
    pendingFiles.value = []
    formError.value = ''
    editing.value = true
  } catch (e) { alert(e.message) }
}

function cancelEdit() {
  editing.value = false
  loadList()
}

async function handleSave() {
  if (!form.value.title.trim()) {
    formError.value = '请输入标题'
    return
  }
  formError.value = ''
  saving.value = true
  try {
    let id = editId.value
    if (id) {
      await updateAnnouncement(id, form.value.title, form.value.content, form.value.pdf_url)
    } else {
      const res = await createAnnouncement(form.value.title, form.value.content)
      id = res.id
    }
    if (pendingFiles.value.length > 0) {
      await uploadAttachments(id, pendingFiles.value)
      pendingFiles.value = []
      const detail = await getAnnouncement(id)
      attachments.value = detail.attachments || []
    }
    cancelEdit()
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('确定删除该公告？')) return
  try {
    await deleteAnnouncement(id)
    loadList()
  } catch (e) { alert(e.message) }
}

async function handleDeleteAttachment(id) {
  try {
    await deleteAttachment(id)
    attachments.value = attachments.value.filter(a => a.id !== id)
  } catch (e) { alert(e.message) }
}

function triggerUpload() { fileInput.value && fileInput.value.click() }

function handleFileSelect(e) {
  pendingFiles.value.push(...Array.from(e.target.files))
  e.target.value = ''
}

function handleDrop(e) {
  pendingFiles.value.push(...Array.from(e.dataTransfer.files))
}

function getFileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase()
  const icons = { pdf: 'PDF', doc: 'DOC', docx: 'DOCX', xls: 'XLS', xlsx: 'XLSX', ppt: 'PPT', pptx: 'PPTX' }
  return icons[ext] || 'FILE'
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
.btn-primary:hover { background: #15406a; }
.btn-primary:disabled { background: #aaa; }
.btn-secondary { padding: 8px 20px; background: #e8e8e8; color: #333; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
.btn-sm { padding: 4px 10px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; margin-right: 6px; }
.btn-danger { color: #e53935; border-color: #e53935; }
.btn-danger:hover { background: #ffebee; }

.admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.admin-table th { background: #f5f5f5; padding: 12px 16px; text-align: left; font-size: 13px; color: #666; }
.admin-table td { padding: 12px 16px; border-top: 1px solid #f0f0f0; font-size: 14px; }
.admin-table .actions { white-space: nowrap; }

.admin-form-card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; font-size: 13px; color: #555; }
.form-field input, .form-field textarea { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; outline: none; font-family: inherit; resize: vertical; }
.form-field input:focus, .form-field textarea:focus { border-color: #1a4977; }

.upload-area { border: 2px dashed #d0d0d0; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.upload-area:hover { border-color: #1a4977; background: #f8fafc; }
.upload-area p { margin: 0 0 4px; font-size: 14px; color: #555; }
.upload-area small { color: #999; font-size: 12px; }

.attachment-list { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.attachment-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #f8f8f8; border-radius: 6px; font-size: 13px; }
.att-icon { width: 36px; text-align: center; padding: 2px 6px; background: #e3f2fd; color: #1565c0; border-radius: 4px; font-size: 11px; font-weight: 700; }
.att-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.form-actions { display: flex; gap: 10px; margin-top: 8px; }
.form-error { color: #e53935; font-size: 13px; margin: 8px 0 0; }
</style>
