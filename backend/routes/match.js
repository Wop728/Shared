// routes/match.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

function parseKW(s){ if(!s) return []; return s.split(',').map(x=>x.trim()).filter(Boolean); }

// auto match by message_id
router.get('/auto', async (req, res) => {
  try {
    const id = req.query.message_id;
    if (!id) return res.status(400).json({ error: '缺少 message_id' });
    const [[msg]] = await pool.query('SELECT * FROM messages WHERE id = ?', [id]);
    if (!msg) return res.status(404).json({ error: '消息未找到' });
    const kws = parseKW(msg.keywords);
    const matched = [];
    for (const kw of kws) {
      const [rows] = await pool.query('SELECT m.*, u.username FROM messages m LEFT JOIN users u ON u.id = m.user_id WHERE m.keywords LIKE ? AND m.type != ? AND m.status = "active" AND m.id != ?', ['%'+kw+'%', msg.type, id]);
      for (const r of rows) matched.push(r);
    }
    res.json({ ok: true, matched });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
