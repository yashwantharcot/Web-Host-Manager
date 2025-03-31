const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new AppError(401, 'You are not logged in. Please log in to get access.');
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError(401, 'The user belonging to this token no longer exists.');
    }

    // 4) Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
