const logger = require('../../utils/logger');

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body || {};
  const errors = [];
  if (!username || typeof username !== 'string' || !username.trim()) errors.push('Username is required');
  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('Valid email is required');
  if (!password || typeof password !== 'string' || password.length < 6) errors.push('Password must be at least 6 characters');
  if (errors.length) {
    logger.error('Register validation failed', errors);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body || {};
  const errors = [];
  if (!username || typeof username !== 'string' || !username.trim()) errors.push('Username or email is required');
  if (!password || typeof password !== 'string') errors.push('Password is required');
  if (errors.length) {
    logger.error('Login validation failed', errors);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
};

module.exports = { validateRegister, validateLogin };
