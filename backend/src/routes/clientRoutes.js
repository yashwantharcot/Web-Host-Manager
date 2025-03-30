'use strict';

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  validateCreateClient,
  validateUpdateClient,
  validateClientId
} = require('../middleware/validators/clientValidator');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /clients:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Get all clients
 *     description: Retrieve all clients with their websites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients retrieved successfully
 *       401:
 *         description: Not authenticated
 */
router.get('/', apiLimiter, clientController.getAll);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Get client by ID
 *     description: Retrieve a single client by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client retrieved successfully
 *       404:
 *         description: Client not found
 */
router.get('/:id', apiLimiter, validateClientId, clientController.getById);

/**
 * @swagger
 * /clients:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Create new client
 *     description: Create a new client record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - company
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +1-555-123-4567
 *               company:
 *                 type: string
 *                 example: Smith Enterprises
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', apiLimiter, validateCreateClient, clientController.create);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     tags:
 *       - Clients
 *     summary: Update client
 *     description: Update an existing client record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 */
router.put('/:id', apiLimiter, validateUpdateClient, clientController.update);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     tags:
 *       - Clients
 *     summary: Delete client
 *     description: Delete a client record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       204:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/:id', apiLimiter, validateClientId, clientController.delete);

/**
 * @swagger
 * /clients/{id}/websites:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Get client websites
 *     description: Retrieve all websites associated with a client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client websites retrieved successfully
 *       404:
 *         description: Client not found
 */
router.get('/:id/websites', apiLimiter, validateClientId, clientController.getClientWithWebsites);

// Additional routes
router.get('/:id/stats', clientController.getClientStats);

module.exports = router; 