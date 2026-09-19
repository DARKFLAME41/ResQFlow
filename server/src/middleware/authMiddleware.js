const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'resqflow_super_secret_hackathon_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo purposes, allow demo requests with fallback user header or unauthenticated guest
    const guestUser = req.headers['x-demo-user'];
    if (guestUser) {
      try {
        req.user = JSON.parse(guestUser);
        return next();
      } catch (e) {}
    }
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || (!roles.includes(req.user.role) && req.user.role !== 'Admin')) {
      return res.status(403).json({ error: `Access denied. Requires role: ${roles.join(' or ')}` });
    }
    next();
  };
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole
};
