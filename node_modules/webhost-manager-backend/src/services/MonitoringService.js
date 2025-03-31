const https = require('https');
const { Website, Domain } = require('../models');
const notificationService = require('./NotificationService');

class MonitoringService {
  constructor() {
    this.uptimeChecks = new Map(); // Store website check results
    this.sslChecks = new Map(); // Store SSL certificate check results
  }

  async checkWebsiteUptime(website) {
    try {
      const startTime = Date.now();
      const response = await this.makeRequest(website.url);
      const responseTime = Date.now() - startTime;

      const status = {
        isUp: response.statusCode >= 200 && response.statusCode < 400,
        statusCode: response.statusCode,
        responseTime,
        timestamp: new Date(),
      };

      this.uptimeChecks.set(website.id, status);

      // Alert if website is down
      if (!status.isUp) {
        await notificationService.sendCriticalAlert(
          `Website ${website.name} is down`,
          `Website ${website.url} returned status code ${status.statusCode}`,
          [process.env.ADMIN_EMAIL, website.Client.email]
        );
      }

      return status;
    } catch (error) {
      const status = {
        isUp: false,
        error: error.message,
        timestamp: new Date(),
      };

      this.uptimeChecks.set(website.id, status);

      await notificationService.sendCriticalAlert(
        `Website ${website.name} is unreachable`,
        `Error checking website ${website.url}: ${error.message}`,
        [process.env.ADMIN_EMAIL, website.Client.email]
      );

      return status;
    }
  }

  async checkSSLCertificate(domain) {
    try {
      const options = {
        hostname: domain.name,
        port: 443,
        method: 'HEAD',
        rejectUnauthorized: false, // Allow self-signed certificates
      };

      const cert = await this.getCertificate(options);
      const expiryDate = new Date(cert.valid_to);
      const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

      const status = {
        isValid: true,
        expiryDate,
        daysUntilExpiry,
        issuer: cert.issuer,
        timestamp: new Date(),
      };

      this.sslChecks.set(domain.id, status);

      // Alert if certificate is expiring soon
      if (daysUntilExpiry <= 30) {
        await notificationService.sendCriticalAlert(
          `SSL Certificate Expiring Soon for ${domain.name}`,
          `SSL Certificate for ${domain.name} will expire in ${daysUntilExpiry} days`,
          [process.env.ADMIN_EMAIL, domain.Website.Client.email]
        );
      }

      return status;
    } catch (error) {
      const status = {
        isValid: false,
        error: error.message,
        timestamp: new Date(),
      };

      this.sslChecks.set(domain.id, status);

      await notificationService.sendCriticalAlert(
        `SSL Certificate Error for ${domain.name}`,
        `Error checking SSL certificate for ${domain.name}: ${error.message}`,
        [process.env.ADMIN_EMAIL, domain.Website.Client.email]
      );

      return status;
    }
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        resolve(response);
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });
    });
  }

  async getCertificate(options) {
    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        const cert = response.socket.getPeerCertificate();
        if (cert) {
          resolve(cert);
        } else {
          reject(new Error('No certificate found'));
        }
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });

      request.end();
    });
  }

  async monitorAllWebsites() {
    try {
      const websites = await Website.findAll({
        include: [{ model: Domain }]
      });

      for (const website of websites) {
        await this.checkWebsiteUptime(website);
        
        // Check SSL certificates for all domains
        for (const domain of website.Domains) {
          await this.checkSSLCertificate(domain);
        }
      }
    } catch (error) {
      console.error('Error monitoring websites:', error);
      await notificationService.sendCriticalAlert(
        'Website Monitoring Error',
        `Error during website monitoring: ${error.message}`,
        [process.env.ADMIN_EMAIL]
      );
    }
  }

  getUptimeStatus(websiteId) {
    return this.uptimeChecks.get(websiteId);
  }

  getSSLStatus(domainId) {
    return this.sslChecks.get(domainId);
  }

  getAllUptimeStatuses() {
    return Array.from(this.uptimeChecks.entries()).map(([id, status]) => ({
      websiteId: id,
      ...status
    }));
  }

  getAllSSLStatuses() {
    return Array.from(this.sslChecks.entries()).map(([id, status]) => ({
      domainId: id,
      ...status
    }));
  }
}

module.exports = new MonitoringService(); 