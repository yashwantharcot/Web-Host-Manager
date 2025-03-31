const nodemailer = require('nodemailer');
const { Domain, Website, Client, EmailAccount } = require('../models');
const { Op } = require('sequelize');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async checkExpiringDomains() {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringDomains = await Domain.findAll({
        where: {
          expiry_date: {
            [Op.lte]: thirtyDaysFromNow,
            [Op.gt]: new Date()
          },
          status: 'active'
        },
        include: [
          {
            model: Website,
            include: [{ model: Client }]
          }
        ]
      });

      for (const domain of expiringDomains) {
        await this.sendDomainExpiryNotification(domain);
      }
    } catch (error) {
      console.error('Error checking expiring domains:', error);
    }
  }

  async checkExpiringHosting() {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringWebsites = await Website.findAll({
        where: {
          expiry_date: {
            [Op.lte]: thirtyDaysFromNow,
            [Op.gt]: new Date()
          }
        },
        include: [{ model: Client }]
      });

      for (const website of expiringWebsites) {
        await this.sendHostingExpiryNotification(website);
      }
    } catch (error) {
      console.error('Error checking expiring hosting:', error);
    }
  }

  async sendDomainExpiryNotification(domain) {
    const daysUntilExpiry = Math.ceil(
      (domain.expiry_date - new Date()) / (1000 * 60 * 60 * 24)
    );

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: domain.Website.Client.email,
      subject: `Domain ${domain.name} expires in ${daysUntilExpiry} days`,
      html: `
        <h2>Domain Expiration Notice</h2>
        <p>Dear ${domain.Website.Client.name},</p>
        <p>Your domain <strong>${domain.name}</strong> will expire in ${daysUntilExpiry} days.</p>
        <p>Details:</p>
        <ul>
          <li>Domain: ${domain.name}</li>
          <li>Registrar: ${domain.registrar}</li>
          <li>Expiry Date: ${domain.expiry_date.toLocaleDateString()}</li>
          <li>Website: ${domain.Website.name}</li>
        </ul>
        <p>Please take action to renew your domain to avoid service interruption.</p>
        <p>Best regards,<br>Your Web Host Manager</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Domain expiry notification sent for ${domain.name}`);
    } catch (error) {
      console.error(`Error sending domain expiry notification for ${domain.name}:`, error);
    }
  }

  async sendHostingExpiryNotification(website) {
    const daysUntilExpiry = Math.ceil(
      (website.expiry_date - new Date()) / (1000 * 60 * 60 * 24)
    );

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: website.Client.email,
      subject: `Hosting for ${website.name} expires in ${daysUntilExpiry} days`,
      html: `
        <h2>Hosting Expiration Notice</h2>
        <p>Dear ${website.Client.name},</p>
        <p>The hosting for your website <strong>${website.name}</strong> will expire in ${daysUntilExpiry} days.</p>
        <p>Details:</p>
        <ul>
          <li>Website: ${website.name}</li>
          <li>URL: ${website.url}</li>
          <li>Hosting Provider: ${website.hosting_provider}</li>
          <li>Expiry Date: ${website.expiry_date.toLocaleDateString()}</li>
        </ul>
        <p>Please take action to renew your hosting to avoid service interruption.</p>
        <p>Best regards,<br>Your Web Host Manager</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Hosting expiry notification sent for ${website.name}`);
    } catch (error) {
      console.error(`Error sending hosting expiry notification for ${website.name}:`, error);
    }
  }

  async sendCriticalAlert(subject, message, recipients) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: recipients.join(','),
      subject: `[CRITICAL] ${subject}`,
      html: `
        <h2>Critical Alert</h2>
        <p>${message}</p>
        <p>This is an automated message from Web Host Manager.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Critical alert sent: ${subject}`);
    } catch (error) {
      console.error(`Error sending critical alert: ${subject}`, error);
    }
  }
}

module.exports = new NotificationService(); 