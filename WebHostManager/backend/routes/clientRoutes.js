const express = require('express');
const { Client } = require('../models');
const router = express.Router();

// Create a new client
router.post('/', async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a client by ID
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.update(req.body);
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a client by ID
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;