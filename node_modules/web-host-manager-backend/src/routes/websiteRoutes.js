'use strict';

const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/WebsiteController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// CRUD routes
router.get('/', websiteController.getAll);
router.get('/:id', websiteController.getById);
router.post('/', websiteController.create);
router.put('/:id', websiteController.update);
router.delete('/:id', websiteController.delete);

// Additional routes
router.get('/:id/stats', websiteController.getWebsiteStats);
router.get('/:id/check-ssl', websiteController.checkSSLStatus);

module.exports = router; 