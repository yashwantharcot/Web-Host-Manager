'use strict';

const express = require('express');
const router = express.Router();
const domainController = require('../controllers/DomainController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// CRUD routes
router.get('/', domainController.getAll);
router.get('/:id', domainController.getById);
router.post('/', domainController.create);
router.put('/:id', domainController.update);
router.delete('/:id', domainController.delete);

// Additional routes
router.get('/:id/check-status', domainController.checkDomainStatus);
router.put('/:id/dns-records', domainController.updateDNSRecords);

module.exports = router; 