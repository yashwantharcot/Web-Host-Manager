'use strict';

const BaseController = require('./BaseController');
const { Domain, Website, Client } = require('../models');

class DomainController extends BaseController {
  constructor() {
    super(Domain);
  }

  async getAll(req, res) {
    try {
      const domains = await Domain.findAll({
        where: { 
          is_active: true,
          website_id: req.query.website_id // Filter by website if specified
        },
        include: [{
          model: Website,
          as: 'website',
          where: { is_active: true },
          required: true,
          include: [{
            model: Client,
            as: 'client',
            where: { 
              user_id: req.user.id,
              is_active: true
            },
            required: true
          }]
        }]
      });
      res.json(domains);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const domain = await Domain.findOne({
        where: { 
          id: req.params.id,
          is_active: true
        },
        include: [{
          model: Website,
          as: 'website',
          where: { is_active: true },
          required: true,
          include: [{
            model: Client,
            as: 'client',
            where: { 
              user_id: req.user.id,
              is_active: true
            },
            required: true
          }]
        }]
      });

      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      res.json(domain);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      // Verify website belongs to current user's client
      const website = await Website.findOne({
        where: { 
          id: req.body.website_id,
          is_active: true
        },
        include: [{
          model: Client,
          as: 'client',
          where: { 
            user_id: req.user.id,
            is_active: true
          },
          required: true
        }]
      });

      if (!website) {
        return res.status(404).json({ error: 'Website not found' });
      }

      const domain = await Domain.create(req.body);
      res.status(201).json(domain);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const domain = await Domain.findOne({
        where: { 
          id: req.params.id,
          is_active: true
        },
        include: [{
          model: Website,
          as: 'website',
          where: { is_active: true },
          required: true,
          include: [{
            model: Client,
            as: 'client',
            where: { 
              user_id: req.user.id,
              is_active: true
            },
            required: true
          }]
        }]
      });

      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      await domain.update(req.body);
      res.json(domain);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const domain = await Domain.findOne({
        where: { 
          id: req.params.id,
          is_active: true
        },
        include: [{
          model: Website,
          as: 'website',
          where: { is_active: true },
          required: true,
          include: [{
            model: Client,
            as: 'client',
            where: { 
              user_id: req.user.id,
              is_active: true
            },
            required: true
          }]
        }]
      });

      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      await domain.update({ is_active: false });
      res.json({ message: 'Domain deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkDomainStatus(req, res) {
    try {
      const domain = await Domain.findOne({
        where: { 
          id: req.params.id,
          is_active: true
        },
        include: [{
          model: Website,
          as: 'website',
          where: { is_active: true },
          required: true,
          include: [{
            model: Client,
            as: 'client',
            where: { 
              user_id: req.user.id,
              is_active: true
            },
            required: true
          }]
        }]
      });

      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      // Here you would implement domain status checking logic
      // For now, we'll just return a mock response
      const domainStatus = {
        is_registered: true,
        registration_date: domain.registration_date,
        expiry_date: domain.expiry_date,
        days_until_expiry: Math.ceil((domain.expiry_date - new Date()) / (1000 * 60 * 60 * 24)),
        auto_renew: domain.auto_renew,
        dns_records: domain.dns_records
      };

      // Update domain status based on expiry
      const newStatus = domainStatus.days_until_expiry <= 0 ? 'expired' : 'active';
      if (newStatus !== domain.status) {
        await domain.update({ status: newStatus });
      }

      res.json(domainStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateDNSRecords(req, res) {
    try {
      const domain = await Domain.findOne({
        where: { 
          id: req.params.id,
          is_active: true
        },
        include: [{
          model: Website,
          as: 'website',
          where: { is_active: true },
          required: true,
          include: [{
            model: Client,
            as: 'client',
            where: { 
              user_id: req.user.id,
              is_active: true
            },
            required: true
          }]
        }]
      });

      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      const { dns_records } = req.body;
      await domain.update({ dns_records });
      res.json({ message: 'DNS records updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new DomainController(); 