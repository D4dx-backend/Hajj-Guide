const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Constant-time string comparison to prevent timing attacks
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Still do a comparison to prevent length-based timing leak
    crypto.timingSafeEqual(Buffer.alloc(bufA.length), Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Username and password are required' });
  }

  const isUsernameValid = safeCompare(username, process.env.ADMIN_USERNAME);
  const isPasswordValid = safeCompare(password, process.env.ADMIN_PASSWORD);

  if (!isUsernameValid || !isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username: process.env.ADMIN_USERNAME, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    success: true,
    data: { token },
    message: 'Login successful',
  });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, data: { admin: decoded } });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
