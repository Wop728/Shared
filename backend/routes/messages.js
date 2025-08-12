// routes/messages.js
const express = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_jwt_secret';

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未授权' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: '无效或过期 token' });
  }
}

// publish
router.post('/publish', auth, async (req, res) => {
  try {
    const { type, title, content, keywords, start_time, end_time } = req.body;
    if (!type || !title || !keywords) return res.status(400).json({ error: '缺少字段' });
    const [r] = await pool.query('INSERT INTO messages (user_id, type, title, content, keywords, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.user.id, type, title, content||'', keywords, start_time||null, end_time||null, 'active']);
    res.json({ ok: true, id: r.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

// search
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const [rows] = await pool.query('SELECT m.*, u.username FROM messages m LEFT JOIN users u ON u.id = m.user_id WHERE m.keywords LIKE ? AND m.status = "active" ORDER BY m.created_at DESC LIMIT 100', ['%'+q+'%']);
    res.json({ ok: true, results: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

// my posts
router.get('/my', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ ok: true, results: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
