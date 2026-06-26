import express from 'express'
import cors from 'cors'
import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { initDB } from './db.js'
import authRoutes from './routes/auth.js'
import announcementRoutes from './routes/announcements.js'
import mallRoutes from './routes/mall.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

// In production, serve the built frontend from dist/
const DIST_DIR = path.join(__dirname, '..', 'dist')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/mall', mallRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// In production: serve frontend static files + SPA fallback
if (isProduction && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  // SPA fallback: serve index.html for any non-API route
  app.use((_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: '文件大小超过 20MB 限制' })
  }
  res.status(err.status || 500).json({ error: err.message || '服务器错误' })
})

// Start
const server = http.createServer(app)

async function start() {
  await initDB()
  console.log('[DB] 数据库已初始化')

  server.listen(PORT, () => {
    console.log(`[Server] 后台服务已启动: http://localhost:${PORT}`)
    console.log(`[Server] API: http://localhost:${PORT}/api/health`)
  })
}

start().catch(err => {
  console.error('[Server] 启动失败:', err)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
