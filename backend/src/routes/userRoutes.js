'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);

module.exports = router; 