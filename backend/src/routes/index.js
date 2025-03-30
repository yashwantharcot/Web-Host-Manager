'use strict';

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const websiteRoutes = require('./websiteRoutes');
const domainRoutes = require('./domainRoutes');
const emailAccountRoutes = require('./emailAccountRoutes');
const monitoringRoutes = require('./monitoringRoutes');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/clients', authenticate, clientRoutes);
router.use('/websites', authenticate, websiteRoutes);
router.use('/domains', authenticate, domainRoutes);
router.use('/email-accounts', authenticate, emailAccountRoutes);
router.use('/monitoring', authenticate, monitoringRoutes);

// Admin-only routes
router.get('/stats', authenticate, authorize('admin'), (req, res) => {
  // Add statistics endpoint implementation
});

module.exports = router; 