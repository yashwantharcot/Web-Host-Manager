const express = require('express');
const router = express.Router();
const { Client } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const createValidator = require('../middleware/validation/validator');
const { clientSchemas } = require('../middleware/validation/schemas');

// Protect all routes after this middleware
router.use(protect);

// Get all clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await Client.findAll({
      where: {
        userId: req.user.id
      }
    });

    res.json({
      status: 'success',
      data: {
        clients
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get a single client
router.get('/:id', async (req, res, next) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!client) {
      throw new AppError(404, 'Client not found');
    }

    res.json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create a new client
router.post('/', createValidator(clientSchemas.create), async (req, res, next) => {
  try {
    const client = await Client.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update a client
router.patch('/:id', createValidator(clientSchemas.update), async (req, res, next) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!client) {
      throw new AppError(404, 'Client not found');
    }

    await client.update(req.body);

    res.json({
      status: 'success',
      data: {
        client
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a client
router.delete('/:id', async (req, res, next) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!client) {
      throw new AppError(404, 'Client not found');
    }

    await client.destroy();

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
