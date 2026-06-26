import initSqlJs from 'sql.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'data.db')

let SQL, db

export async function initDB() {
  SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      author_id INTEGER,
      pdf_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `)

  // Migration: add pdf_url column if not exists (for old databases)
  try { db.run('ALTER TABLE announcements ADD COLUMN pdf_url TEXT') } catch (_e) { /* column already exists */ }

  db.run(`
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      announcement_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      filepath TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS mall_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      provider TEXT,
      price TEXT,
      link TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      image TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `)

  // Seed super admin if not exists
  const result = db.exec("SELECT id FROM users WHERE phone = '13800000000'")
  if (result.length === 0 || result[0].values.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.run(
      "INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)",
      ['超级管理员', '13800000000', hash, 'super_admin']
    )
    console.log('[DB] 超级管理员已创建: 13800000000 / admin123')
  }

  // Seed legacy announcements if no pdf_url announcements exist yet
  const pdfCount = db.exec("SELECT COUNT(*) FROM announcements WHERE pdf_url IS NOT NULL AND pdf_url != ''")
  if (pdfCount.length === 0 || pdfCount[0].values[0][0] === 0) {
    const legacyAnnouncements = [
      { title: '关于撤销福顺保险经纪有限公司湖南分公司的公告', date: '2025-05-06', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20250506.pdf' },
      { title: '关于撤销福顺保险经纪有限公司青岛分公司的公告', date: '2025-03-20', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20250320.pdf' },
      { title: '关于撤销福顺保险经纪有限公司甘肃分公司的公告', date: '2025-01-17', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20250117.pdf' },
      { title: '关于撤销福顺保险经纪有限公司陕西分公司的公告', date: '2024-12-18', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20241218.pdf' },
      { title: '关于撤销福顺保险经纪有限公司广东分公司的公告', date: '2024-10-28', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20241031.pdf' },
      { title: '关于撤销福顺保险经纪有限公司山西分公司的公告', date: '2024-10-23', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj2024103102.pdf' },
      { title: '关于撤销福顺保险经纪有限公司广西分公司的公告', date: '2024-10-10', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20241010.pdf' },
      { title: '关于换发《保险中介许可证》的公告', date: '2023-08-20', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20230815.pdf' },
      { title: '关于广东分公司住所变更的公告', date: '2023-08-20', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/gdfgs20230820.pdf' },
      { title: '关于换发《保险中介许可证》的公告 (2022)', date: '2022-08-20', pdf: 'https://fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20230820.pdf' },
    ]
    for (const a of legacyAnnouncements) {
      db.run(
        "INSERT INTO announcements (title, content, pdf_url, created_at) VALUES (?, NULL, ?, ?)",
        [a.title, a.pdf, a.date]
      )
    }
    console.log(`[DB] 已种子 ${legacyAnnouncements.length} 条历史公告`)
  }

  save()
  return db
}

export function save() {
  if (db) {
    const data = db.export()
    fs.writeFileSync(DB_PATH, Buffer.from(data))
  }
}

export function getDB() {
  return db
}

// Helper: run INSERT/UPDATE/DELETE, auto-save, return { changes, lastId }
export function run(sql, params = []) {
  db.run(sql, params)
  const lastIdResult = db.exec('SELECT last_insert_rowid() as id')
  const lastId = lastIdResult[0]?.values[0][0] ?? null
  const changesResult = db.exec('SELECT changes() as c')
  const changes = changesResult[0]?.values[0][0] ?? 0
  save()
  return { lastId, changes }
}

// Helper: query multiple rows
export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

// Helper: query single row
export function queryOne(sql, params = []) {
  const rows = queryAll(sql, params)
  return rows[0] || null
}
