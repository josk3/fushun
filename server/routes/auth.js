import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { queryAll, queryOne, run } from '../db.js'
import { signToken, authMiddleware } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { phone, password } = req.body
  if (!phone || !password) {
    return res.status(400).json({ error: '请输入手机号和密码' })
  }

  const user = queryOne('SELECT * FROM users WHERE phone = ?', [phone])
  if (!user) {
    return res.status(401).json({ error: '手机号或密码错误' })
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: '手机号或密码错误' })
  }

  const token = signToken({ id: user.id, name: user.name, phone: user.phone, role: user.role })
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
  })
})

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, phone, password } = req.body
  if (!name || !phone || !password) {
    return res.status(400).json({ error: '请填写完整信息' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少 6 位' })
  }

  const existing = queryOne('SELECT id FROM users WHERE phone = ?', [phone])
  if (existing) {
    return res.status(409).json({ error: '该手机号已注册' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const { lastId } = run(
    'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, phone, hash, 'user']
  )

  res.json({ id: lastId, name, phone, role: 'user' })
})

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const user = queryOne('SELECT id, name, phone, role, created_at FROM users WHERE id = ?', [req.user.id])
  if (!user) return res.status(404).json({ error: '用户不存在' })
  res.json(user)
})

// GET /api/auth/users — super_admin only
router.get('/users', authMiddleware, adminOnly, (req, res) => {
  const users = queryAll('SELECT id, name, phone, role, created_at FROM users ORDER BY id')
  res.json(users)
})

// DELETE /api/auth/users/:id — super_admin only
router.delete('/users/:id', authMiddleware, adminOnly, (req, res) => {
  const id = Number(req.params.id)
  const user = queryOne('SELECT * FROM users WHERE id = ?', [id])
  if (!user) return res.status(404).json({ error: '用户不存在' })
  if (user.role === 'super_admin') {
    return res.status(403).json({ error: '不能删除超级管理员' })
  }
  run('DELETE FROM users WHERE id = ?', [id])
  res.json({ success: true })
})

export default router
