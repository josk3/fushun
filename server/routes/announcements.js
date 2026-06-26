import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { queryAll, queryOne, run } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const ext = path.extname(originalName)
    const name = crypto.randomBytes(8).toString('hex') + ext
    cb(null, name)
  }
})

const ALLOWED_EXTS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const ext = path.extname(originalName).toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      return cb(new Error('不支持的文件类型，仅允许 PDF/Word/PPT/Excel'))
    }
    cb(null, true)
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
})

const router = Router()

// GET /api/announcements — public list with attachment counts
router.get('/', (req, res) => {
  const list = queryAll(`
    SELECT a.id, a.title, a.content, a.author_id, a.pdf_url, a.created_at,
           u.name as author_name,
           (SELECT COUNT(*) FROM attachments WHERE announcement_id = a.id) as attachment_count
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.id
    ORDER BY a.created_at DESC
  `)
  res.json(list)
})

// IMPORTANT: Static-path routes MUST come before /:id to avoid route conflicts

// GET /api/announcements/attachments/:id/download — public download
router.get('/attachments/:id/download', (req, res) => {
  const id = Number(req.params.id)
  const att = queryOne('SELECT * FROM attachments WHERE id = ?', [id])
  if (!att) return res.status(404).json({ error: '附件不存在' })

  const filePath = path.join(UPLOADS_DIR, att.filename)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: '文件已丢失' })

  res.download(filePath, att.original_name)
})

// DELETE /api/announcements/attachments/:id
router.delete('/attachments/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const att = queryOne('SELECT * FROM attachments WHERE id = ?', [id])
  if (!att) return res.status(404).json({ error: '附件不存在' })

  const filePath = path.join(UPLOADS_DIR, att.filename)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  run('DELETE FROM attachments WHERE id = ?', [id])
  res.json({ success: true })
})

// GET /api/announcements/:id — public detail with attachments
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const item = queryOne(`
    SELECT a.*, u.name as author_name
    FROM announcements a LEFT JOIN users u ON a.author_id = u.id
    WHERE a.id = ?
  `, [id])
  if (!item) return res.status(404).json({ error: '公告不存在' })

  const attachments = queryAll(
    'SELECT id, filename, original_name, created_at FROM attachments WHERE announcement_id = ?',
    [id]
  )

  res.json({ ...item, attachments })
})

// POST /api/announcements — auth required
router.post('/', authMiddleware, (req, res) => {
  const { title, content } = req.body
  if (!title || !title.trim()) {
    return res.status(400).json({ error: '请输入标题' })
  }

  const { lastId } = run(
    'INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)',
    [title.trim(), content || null, req.user.id]
  )

  res.json({ id: lastId, title, content })
})

// PUT /api/announcements/:id — auth required
router.put('/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const existing = queryOne('SELECT * FROM announcements WHERE id = ?', [id])
  if (!existing) return res.status(404).json({ error: '公告不存在' })

  const { title, content, pdf_url } = req.body
  if (!title || !title.trim()) {
    return res.status(400).json({ error: '请输入标题' })
  }

  run('UPDATE announcements SET title = ?, content = ?, pdf_url = ? WHERE id = ?',
    [title.trim(), content || null, pdf_url || null, id])

  res.json({ id, title, content, pdf_url })
})

// DELETE /api/announcements/:id — auth required
router.delete('/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const existing = queryOne('SELECT * FROM announcements WHERE id = ?', [id])
  if (!existing) return res.status(404).json({ error: '公告不存在' })

  // Delete associated attachment files
  const attachments = queryAll('SELECT * FROM attachments WHERE announcement_id = ?', [id])
  for (const att of attachments) {
    const filePath = path.join(UPLOADS_DIR, att.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }

  run('DELETE FROM attachments WHERE announcement_id = ?', [id])
  run('DELETE FROM announcements WHERE id = ?', [id])

  res.json({ success: true })
})

// POST /api/announcements/:id/attachments — upload
router.post('/:id/attachments', authMiddleware, upload.array('files', 10), (req, res) => {
  const announcementId = Number(req.params.id)
  const existing = queryOne('SELECT * FROM announcements WHERE id = ?', [announcementId])
  if (!existing) return res.status(404).json({ error: '公告不存在' })

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '请选择文件' })
  }

  const inserted = []
  for (const file of req.files) {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const { lastId } = run(
      'INSERT INTO attachments (announcement_id, filename, original_name, filepath) VALUES (?, ?, ?, ?)',
      [announcementId, file.filename, originalName, `/uploads/${file.filename}`]
    )
    inserted.push({ id: lastId, filename: file.filename, original_name: originalName })
  }

  res.json({ uploaded: inserted })
})

export default router
