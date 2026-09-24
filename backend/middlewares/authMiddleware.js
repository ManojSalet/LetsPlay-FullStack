const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token and attach user info
exports.protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role || 'customer',
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

// Admin authorization guard
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Administrator privileges required' });
};
