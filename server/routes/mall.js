import { Router } from 'express'
import { queryAll, queryOne, run } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// GET /api/mall — public
router.get('/', (req, res) => {
  const list = queryAll('SELECT * FROM mall_products ORDER BY created_at DESC')
  res.json(list)
})

// GET /api/mall/:id
router.get('/:id', (req, res) => {
  const item = queryOne('SELECT * FROM mall_products WHERE id = ?', [Number(req.params.id)])
  if (!item) return res.status(404).json({ error: '商品不存在' })
  res.json(item)
})

// POST /api/mall — auth required
router.post('/', authMiddleware, (req, res) => {
  const { name, provider, price, link, status, image } = req.body
  if (!name || !name.trim()) {
    return res.status(400).json({ error: '请输入商品名称' })
  }

  const { lastId } = run(
    'INSERT INTO mall_products (name, provider, price, link, status, image) VALUES (?, ?, ?, ?, ?, ?)',
    [name.trim(), provider || null, price || null, link || null, status || 'active', image || null]
  )

  res.json({ id: lastId, name })
})

// PUT /api/mall/:id — auth required
router.put('/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const existing = queryOne('SELECT * FROM mall_products WHERE id = ?', [id])
  if (!existing) return res.status(404).json({ error: '商品不存在' })

  const { name, provider, price, link, status, image } = req.body
  run(
    'UPDATE mall_products SET name = ?, provider = ?, price = ?, link = ?, status = ?, image = ? WHERE id = ?',
    [name || existing.name, provider ?? existing.provider, price ?? existing.price,
     link ?? existing.link, status || existing.status, image ?? existing.image, id]
  )

  res.json({ id, name: name || existing.name })
})

// DELETE /api/mall/:id — auth required
router.delete('/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const existing = queryOne('SELECT * FROM mall_products WHERE id = ?', [id])
  if (!existing) return res.status(404).json({ error: '商品不存在' })

  run('DELETE FROM mall_products WHERE id = ?', [id])
  res.json({ success: true })
})

export default router
