const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Email routes
router.get('/', emailController.getAllEmails);
router.get('/:id', emailController.getEmailById);
router.post('/', emailController.createEmail);
router.put('/:id', emailController.updateEmail);
router.delete('/:id', emailController.deleteEmail);

module.exports = router; 