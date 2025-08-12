// db.js - MySQL connection pool
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'gxpt_user',
  password: 'kH8x!pZ3R@tq',
  database: 'gxpt_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool;
