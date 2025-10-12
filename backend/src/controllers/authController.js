"use strict";

const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists (username OR email)
      const existingUser = await User.findOne({
        where: { }
      });
      // The mongoose-backed adapter ignores `Op`, so perform explicit checks
      const byUsername = await User._mongoose.findOne({ username }).exec();
      const byEmail = await User._mongoose.findOne({ email }).exec();
      if (byUsername || byEmail) {
        return res.status(409).json({
          error: 'User already exists',
          details: 'Username or email is already taken'
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find user by username or email
      const user = await User._mongoose.findOne({
        $or: [ { username }, { email: username } ]
      }).exec();

      if (!user) {
        return res.status(401).json({
          error: 'Authentication failed',
          details: 'Invalid username or password'
        });
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Authentication failed',
          details: 'Invalid username or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController(); 