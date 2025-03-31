const express = require('express');
const { EmailAccount } = require('../models');
const router = express.Router();

// Create a new email account
router.post('/', async (req, res) => {
  try {
    const emailAccount = await EmailAccount.create(req.body);
    res.status(201).json(emailAccount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all email accounts
router.get('/', async (req, res) => {
  try {
    const emailAccounts = await EmailAccount.findAll();
    res.status(200).json(emailAccounts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single email account by ID
router.get('/:id', async (req, res) => {
  try {
    const emailAccount = await EmailAccount.findByPk(req.params.id);
    if (emailAccount) {
      res.status(200).json(emailAccount);
    } else {
      res.status(404).json({ error: 'Email account not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an email account by ID
router.put('/:id', async (req, res) => {
  try {
    const emailAccount = await EmailAccount.findByPk(req.params.id);
    if (emailAccount) {
      await emailAccount.update(req.body);
      res.status(200).json(emailAccount);
    } else {
      res.status(404).json({ error: 'Email account not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an email account by ID
router.delete('/:id', async (req, res) => {
  try {
    const emailAccount = await EmailAccount.findByPk(req.params.id);
    if (emailAccount) {
      await emailAccount.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Email account not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;