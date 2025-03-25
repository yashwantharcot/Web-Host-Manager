const express = require('express');
const router = express.Router();
const { getAllDomains, getDomainById, createDomain, updateDomain, deleteDomain } = require('../controllers/domainController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Get all domains
router.get('/', getAllDomains);

// Get domain by ID
router.get('/:id', getDomainById);

// Create new domain
router.post('/', createDomain);

// Update domain
router.put('/:id', updateDomain);

// Delete domain
router.delete('/:id', deleteDomain);

// Get domains by client
router.get('/client/:clientId', domainController.getDomainsByClient);

// Get domains by website
router.get('/website/:websiteId', domainController.getDomainsByWebsite);

module.exports = router; 