const express = require('express');
const { Domain } = require('../models');
const router = express.Router();

// Create a new domain
router.post('/', async (req, res) => {
  try {
    const domain = await Domain.create(req.body);
    res.status(201).json(domain);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all domains
router.get('/', async (req, res) => {
  try {
    const domains = await Domain.findAll();
    res.status(200).json(domains);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single domain by ID
router.get('/:id', async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (domain) {
      res.status(200).json(domain);
    } else {
      res.status(404).json({ error: 'Domain not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a domain by ID
router.put('/:id', async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (domain) {
      await domain.update(req.body);
      res.status(200).json(domain);
    } else {
      res.status(404).json({ error: 'Domain not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a domain by ID
router.delete('/:id', async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (domain) {
      await domain.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Domain not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;