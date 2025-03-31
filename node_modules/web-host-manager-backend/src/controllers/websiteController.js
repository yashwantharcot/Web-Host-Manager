'use strict';

const BaseController = require('./BaseController');
const { Website, Client, Domain, EmailAccount } = require('../models');

class WebsiteController extends BaseController {
  constructor() {
    super(Website);
  }

  async getWebsiteWithDetails(req, res) {
    try {
      const website = await Website.findByPk(req.params.id, {
        include: [
          {
            model: Client,
            as: 'client'
          },
          {
            model: Domain,
            as: 'domains'
          },
          {
            model: EmailAccount,
            as: 'emailAccounts'
          }
        ]
      });
      
      if (!website) {
        return res.status(404).json({ error: 'Website not found' });
      }
      
      res.json(website);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWebsitesByClient(req, res) {
    try {
      const websites = await Website.findAll({
        where: { client_id: req.params.clientId },
        include: [
          {
            model: Domain,
            as: 'domains'
          },
          {
            model: EmailAccount,
            as: 'emailAccounts'
          }
        ]
      });
      res.json(websites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllWithDetails(req, res) {
    try {
      const websites = await Website.findAll({
        include: [
          {
            model: Client,
            as: 'client'
          },
          {
            model: Domain,
            as: 'domains'
          },
          {
            model: EmailAccount,
            as: 'emailAccounts'
          }
        ]
      });
      res.json(websites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WebsiteController(); 