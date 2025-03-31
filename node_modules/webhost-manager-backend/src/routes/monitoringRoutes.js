const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/MonitoringController');
const { authenticate, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * /monitoring/websites/{websiteId}:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Get website monitoring status
 *     description: Retrieve the current monitoring status for a specific website
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Website ID
 *     responses:
 *       200:
 *         description: Website status retrieved successfully
 *       404:
 *         description: Website not found or no monitoring data available
 */
router.get('/websites/:websiteId', 
  authenticate,
  apiLimiter,
  monitoringController.getWebsiteStatus
);

/**
 * @swagger
 * /monitoring/domains/{domainId}/ssl:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Get domain SSL certificate status
 *     description: Retrieve the current SSL certificate status for a specific domain
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: domainId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Domain ID
 *     responses:
 *       200:
 *         description: SSL certificate status retrieved successfully
 *       404:
 *         description: Domain not found or no SSL data available
 */
router.get('/domains/:domainId/ssl',
  authenticate,
  apiLimiter,
  monitoringController.getDomainSSLStatus
);

/**
 * @swagger
 * /monitoring/websites:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Get all website statuses
 *     description: Retrieve the current monitoring status for all websites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Website statuses retrieved successfully
 */
router.get('/websites',
  authenticate,
  apiLimiter,
  monitoringController.getAllWebsiteStatuses
);

/**
 * @swagger
 * /monitoring/ssl:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Get all SSL certificate statuses
 *     description: Retrieve the current SSL certificate status for all domains
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SSL certificate statuses retrieved successfully
 */
router.get('/ssl',
  authenticate,
  apiLimiter,
  monitoringController.getAllSSLStatuses
);

/**
 * @swagger
 * /monitoring/trigger:
 *   post:
 *     tags:
 *       - Monitoring
 *     summary: Trigger monitoring check
 *     description: Manually trigger a monitoring check for all websites and domains
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monitoring triggered successfully
 */
router.post('/trigger',
  authenticate,
  authorize(['admin']),
  apiLimiter,
  monitoringController.triggerMonitoring
);

module.exports = router; 