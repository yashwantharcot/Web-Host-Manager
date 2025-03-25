const express = require('express');
const router = express.Router();
const { getAllWebsites, getWebsiteById, createWebsite, updateWebsite, deleteWebsite } = require('../controllers/websiteController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getAllWebsites);
router.get('/:id', getWebsiteById);
router.post('/', createWebsite);
router.put('/:id', updateWebsite);
router.delete('/:id', deleteWebsite);

module.exports = router; 