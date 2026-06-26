import { ref, computed } from 'vue'

const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

export function useAdminApi() {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const isLoggedIn = computed(() => !!token.value)
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')

  async function request(url, options = {}) {
    const headers = { ...options.headers }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(url, { ...options, headers })
    const data = await res.json()

    if (res.status === 401) {
      logout()
      throw new Error(data.error || '登录已过期')
    }
    if (!res.ok) {
      throw new Error(data.error || '请求失败')
    }
    return data
  }

  function setAuth(tokenVal, userVal) {
    token.value = tokenVal
    user.value = userVal
    localStorage.setItem(TOKEN_KEY, tokenVal)
    localStorage.setItem(USER_KEY, JSON.stringify(userVal))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  // Auth
  const login = (phone, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) })
      .then(data => { setAuth(data.token, data.user); return data })

  const register = (name, phone, password) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, phone, password }) })

  const getMe = () => request('/api/auth/me')
  const getUsers = () => request('/api/auth/users')
  const deleteUser = (id) => request(`/api/auth/users/${id}`, { method: 'DELETE' })

  // Announcements
  const getAnnouncements = () => request('/api/announcements')
  const getAnnouncement = (id) => request(`/api/announcements/${id}`)
  const createAnnouncement = (title, content) =>
    request('/api/announcements', { method: 'POST', body: JSON.stringify({ title, content }) })
  const updateAnnouncement = (id, title, content, pdf_url) =>
    request(`/api/announcements/${id}`, { method: 'PUT', body: JSON.stringify({ title, content, pdf_url }) })
  const deleteAnnouncement = (id) =>
    request(`/api/announcements/${id}`, { method: 'DELETE' })

  // Attachments
  const uploadAttachments = (announcementId, files) => {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    return request(`/api/announcements/${announcementId}/attachments`, {
      method: 'POST',
      body: formData
    })
  }
  const deleteAttachment = (id) =>
    request(`/api/announcements/attachments/${id}`, { method: 'DELETE' })

  // Mall
  const getProducts = () => request('/api/mall')
  const createProduct = (data) =>
    request('/api/mall', { method: 'POST', body: JSON.stringify(data) })
  const updateProduct = (id, data) =>
    request(`/api/mall/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  const deleteProduct = (id) =>
    request(`/api/mall/${id}`, { method: 'DELETE' })

  return {
    token, user, isLoggedIn, isSuperAdmin,
    login, register, logout, getMe, getUsers, deleteUser,
    getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement,
    uploadAttachments, deleteAttachment,
    getProducts, createProduct, updateProduct, deleteProduct
  }
}
