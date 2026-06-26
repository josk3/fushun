<template>
  <div class="auth-page">
    <!-- Background decorations -->
    <div class="auth-bg">
      <div class="auth-bg-circle c1"></div>
      <div class="auth-bg-circle c2"></div>
      <div class="auth-bg-circle c3"></div>
    </div>

    <div class="auth-container">
      <!-- Branding -->
      <div class="auth-brand">
        <div class="auth-logo">
          <span class="auth-logo-mark">FS</span>
        </div>
        <h1>福顺保险经纪</h1>
        <p>内部管理系统</p>
      </div>

      <!-- Card -->
      <div class="auth-card">
        <div class="auth-tabs">
          <button :class="{ active: tab === 'login' }" @click="tab = 'login'">登录</button>
          <button :class="{ active: tab === 'register' }" @click="tab = 'register'">注册</button>
        </div>

        <!-- Login Form -->
        <form v-if="tab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>手机号</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <input v-model="loginPhone" type="tel" placeholder="请输入手机号" required maxlength="11">
            </div>
          </div>
          <div class="form-group">
            <label>密码</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="loginPassword" type="password" placeholder="请输入密码" required>
            </div>
          </div>
          <p v-if="error" class="form-error">{{ error }}</p>
          <button type="submit" class="auth-submit" :disabled="loading">{{ loading ? '登录中...' : '登 录' }}</button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>昵称</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input v-model="regName" type="text" placeholder="请输入昵称" required>
            </div>
          </div>
          <div class="form-group">
            <label>手机号</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <input v-model="regPhone" type="tel" placeholder="请输入手机号" required maxlength="11">
            </div>
          </div>
          <div class="form-group">
            <label>密码</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="regPassword" type="password" placeholder="至少 6 位" required minlength="6">
            </div>
          </div>
          <p v-if="error" class="form-error">{{ error }}</p>
          <p v-if="successMsg" class="form-success">{{ successMsg }}</p>
          <button type="submit" class="auth-submit" :disabled="loading">{{ loading ? '注册中...' : '注 册' }}</button>
        </form>
      </div>

      <div class="auth-footer">
        <router-link to="/">← 返回官网首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminApi } from '@/composables/useAdminApi'

const router = useRouter()
const { login, register } = useAdminApi()

const tab = ref('login')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

const loginPhone = ref('')
const loginPassword = ref('')
const regName = ref('')
const regPhone = ref('')
const regPassword = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(loginPhone.value, loginPassword.value)
    router.push('/admin')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  error.value = ''
  successMsg.value = ''
  loading.value = true
  try {
    await register(regName.value, regPhone.value, regPassword.value)
    successMsg.value = '注册成功，请切换到登录页登录'
    tab.value = 'login'
    loginPhone.value = regPhone.value
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(155deg, #071525 0%, #0d2744 40%, #153d66 100%);
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* Background decorations */
.auth-bg { position: absolute; inset: 0; pointer-events: none; }
.auth-bg-circle { position: absolute; border-radius: 50%; }
.c1 {
  top: -120px; right: -80px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(34,97,170,0.25), transparent 70%);
}
.c2 {
  bottom: -100px; left: -60px;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(185,150,88,0.12), transparent 70%);
}
.c3 {
  top: 40%; left: 60%;
  width: 200px; height: 200px;
  border: 1px solid rgba(185,150,88,0.08);
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
}

/* Branding */
.auth-brand {
  text-align: center;
  margin-bottom: 32px;
}
.auth-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.auth-logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(185,150,88,0.4);
  color: #d6bfa9;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.auth-brand h1 {
  margin: 0;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.auth-brand p {
  margin: 6px 0 0;
  color: rgba(255,255,255,0.45);
  font-size: 14px;
}

/* Card */
.auth-card {
  background: rgba(255,255,255,0.97);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

/* Tabs */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 28px;
  background: #f0f2f5;
  border-radius: 10px;
  padding: 4px;
}
.auth-tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.25s ease;
}
.auth-tabs button.active {
  background: #fff;
  color: #1a4977;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}
.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1.5px solid #e0e4ea;
  border-radius: 10px;
  background: #f8f9fb;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.input-wrap:focus-within {
  border-color: #1a4977;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(26,73,119,0.08);
}
.input-icon {
  flex-shrink: 0;
  color: #b0b8c4;
}
.input-wrap:focus-within .input-icon {
  color: #1a4977;
}
.input-wrap input {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #333;
  outline: none;
}
.input-wrap input::placeholder {
  color: #b0b8c4;
}

/* Submit button */
.auth-submit {
  margin-top: 4px;
  padding: 13px;
  background: linear-gradient(135deg, #1a4977, #154785);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  letter-spacing: 0.05em;
}
.auth-submit:hover {
  opacity: 0.92;
}
.auth-submit:active {
  transform: scale(0.98);
}
.auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Messages */
.form-error {
  color: #e53935;
  font-size: 13px;
  margin: 0;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 8px;
}
.form-success {
  color: #2e7d32;
  font-size: 13px;
  margin: 0;
  padding: 8px 12px;
  background: #f0fdf4;
  border-radius: 8px;
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: 24px;
}
.auth-footer a {
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}
.auth-footer a:hover {
  color: rgba(255,255,255,0.8);
}
</style>
