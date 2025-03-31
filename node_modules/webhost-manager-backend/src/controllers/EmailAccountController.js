'use strict';

const BaseController = require('./BaseController');
const { EmailAccount, Website } = require('../models');

class EmailAccountController extends BaseController {
  constructor() {
    super(EmailAccount);
  }

  async getEmailAccountWithWebsite(req, res) {
    try {
      const emailAccount = await EmailAccount.findByPk(req.params.id, {
        include: [{
          model: Website,
          as: 'website'
        }]
      });
      
      if (!emailAccount) {
        return res.status(404).json({ error: 'Email account not found' });
      }
      
      res.json(emailAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEmailAccountsByWebsite(req, res) {
    try {
      const emailAccounts = await EmailAccount.findAll({
        where: { website_id: req.params.websiteId },
        include: [{
          model: Website,
          as: 'website'
        }]
      });
      res.json(emailAccounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEmailAccountsByProvider(req, res) {
    try {
      const emailAccounts = await EmailAccount.findAll({
        where: { provider: req.params.provider },
        include: [{
          model: Website,
          as: 'website'
        }]
      });
      res.json(emailAccounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EmailAccountController(); 