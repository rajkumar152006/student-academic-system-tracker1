const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  
  if (!tokenHeader) {
    return res.status(403).json({ error: 'A token is required for authentication' });
  }

  try {
    const token = tokenHeader.startsWith('Bearer ') ? tokenHeader.slice(7) : tokenHeader;
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  return next();
};

module.exports = verifyToken;
