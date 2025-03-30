'use strict';

const express = require('express');
const router = express.Router();
const emailAccountController = require('../controllers/EmailAccountController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// CRUD routes
router.get('/', emailAccountController.getAll);
router.get('/:id', emailAccountController.getById);
router.post('/', emailAccountController.create);
router.put('/:id', emailAccountController.update);
router.delete('/:id', emailAccountController.delete);

// Additional routes
router.get('/:id/check-status', emailAccountController.checkEmailStatus);
router.put('/:id/credentials', emailAccountController.updateCredentials);

module.exports = router; 