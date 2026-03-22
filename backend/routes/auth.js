const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const createValidator = require('../middleware/validation/validator');
const { userSchemas } = require('../middleware/validation/schemas');

// Register a new user
router.post('/register', createValidator(userSchemas.register), async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new AppError(400, 'User with this email or username already exists');
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', createValidator(userSchemas.login), async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier) {
      throw new AppError(400, 'Please provide an email or username');
    }

    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }]
      }
    });

    if (!user) {
      console.error(`Login failed: User not found for identifier ${identifier}`);
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.error(`Login failed: Invalid password for user ${user.username}`);
      throw new AppError(401, 'Invalid credentials');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'Please log in to access this resource');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError(401, 'The user belonging to this token no longer exists');
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error = new AppError(401, 'Invalid token. Please log in again');
    }
    next(error);
  }
});

module.exports = router;
