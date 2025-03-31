const monitoringService = require('../services/MonitoringService');
const { Website, Domain } = require('../models');

class MonitoringController {
  async getWebsiteStatus(req, res) {
    try {
      const { websiteId } = req.params;
      
      // Check if website exists
      const website = await Website.findByPk(websiteId);
      if (!website) {
        return res.status(404).json({ error: 'Website not found' });
      }

      const status = monitoringService.getUptimeStatus(websiteId);
      if (!status) {
        return res.status(404).json({ error: 'No monitoring data available' });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching website status',
        details: error.message
      });
    }
  }

  async getDomainSSLStatus(req, res) {
    try {
      const { domainId } = req.params;
      
      // Check if domain exists
      const domain = await Domain.findByPk(domainId);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      const status = monitoringService.getSSLStatus(domainId);
      if (!status) {
        return res.status(404).json({ error: 'No SSL certificate data available' });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching SSL certificate status',
        details: error.message
      });
    }
  }

  async getAllWebsiteStatuses(req, res) {
    try {
      const statuses = monitoringService.getAllUptimeStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching website statuses',
        details: error.message
      });
    }
  }

  async getAllSSLStatuses(req, res) {
    try {
      const statuses = monitoringService.getAllSSLStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching SSL certificate statuses',
        details: error.message
      });
    }
  }

  async triggerMonitoring(req, res) {
    try {
      await monitoringService.monitorAllWebsites();
      res.json({ message: 'Monitoring triggered successfully' });
    } catch (error) {
      res.status(500).json({
        error: 'Error triggering monitoring',
        details: error.message
      });
    }
  }
}

module.exports = new MonitoringController(); 