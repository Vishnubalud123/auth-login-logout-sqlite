const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || https://auth-login-logout-sqlite-5uis.vercel.app/;

app.use(cors({
  origin: 'https://auth-login-logout-sqlite-5uis.vercel.app/',
  credentials: true
}));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['secretkey_change_this'],
  maxAge: 15 * 60 * 1000 // 15 minutes
}));

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    db.get('SELECT id, email, created_at FROM users WHERE id = ?', [req.session.userId], (err, user) => {
      if (err || !user) return res.status(401).json({ error: 'Unauthorized' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/api/status', (req, res) => res.json({ status: 'Server is running' }));

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (row) return res.status(400).json({ error: 'User already exists' });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Hashing error' });
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
        if (err) return res.status(500).json({ error: 'Error creating user' });
        req.session.userId = this.lastID;
        res.status(201).json({ user: { id: this.lastID, email } });
      });
    });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Compare error' });
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email } });
    });
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session = null;
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/user', requireAuth, (req, res) => res.json({ user: req.user }));

app.get('/api/dashboard', requireAuth, (req, res) => {
  res.json({ message: 'Welcome to dashboard!', user: req.user, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
