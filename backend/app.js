// app.js - backend for gxpt project
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const messages = require('./routes/messages');
const match = require('./routes/match');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use('/api/auth', auth);
app.use('/api/messages', messages);
app.use('/api/match', match);

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
