export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: '需要超级管理员权限' })
  }
  next()
}
