'use strict';

const BaseController = require('./BaseController');
const { Client, Website, Domain, Email } = require('../models');

class ClientController extends BaseController {
  constructor() {
    super(Client);
  }

  async getAll(req, res) {
    try {
      const clients = await Client.findAll({
        where: { 
          is_active: true,
          user_id: req.user.id // Only get clients for the current user
        },
        include: [{
          model: Website,
          as: 'websites',
          where: { is_active: true },
          required: false
        }]
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const client = await Client.findOne({
        where: { 
          id: req.params.id,
          user_id: req.user.id, // Ensure client belongs to current user
          is_active: true
        },
        include: [{
          model: Website,
          as: 'websites',
          where: { is_active: true },
          required: false
        }]
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      // Add user_id to the client data
      const clientData = {
        ...req.body,
        user_id: req.user.id
      };

      const client = await Client.create(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const client = await Client.findOne({
        where: { 
          id: req.params.id,
          user_id: req.user.id, // Ensure client belongs to current user
          is_active: true
        }
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      await client.update(req.body);
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const client = await Client.findOne({
        where: { 
          id: req.params.id,
          user_id: req.user.id, // Ensure client belongs to current user
          is_active: true
        }
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      // Soft delete the client and all associated websites
      await client.update({ is_active: false });
      await Website.update(
        { is_active: false },
        { where: { client_id: client.id } }
      );

      res.json({ message: 'Client and associated websites deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClientStats(req, res) {
    try {
      const client = await Client.findOne({
        where: { 
          id: req.params.id,
          user_id: req.user.id,
          is_active: true
        },
        include: [{
          model: Website,
          as: 'websites',
          where: { is_active: true },
          required: false
        }]
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      const stats = {
        total_websites: client.websites.length,
        active_websites: client.websites.filter(w => w.status === 'active').length,
        maintenance_websites: client.websites.filter(w => w.status === 'maintenance').length,
        inactive_websites: client.websites.filter(w => w.status === 'inactive').length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClientWithWebsites(req, res) {
    try {
      const client = await Client.findByPk(req.params.id, {
        include: [{
          model: Website,
          as: 'websites'
        }]
      });
      
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllWithWebsites(req, res) {
    try {
      const clients = await Client.findAll({
        include: [{
          model: Website,
          as: 'websites'
        }]
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllClients(req, res) {
    try {
      const clients = await Client.findAll({
        include: [
          { model: Website, attributes: ['id', 'name', 'url', 'status'] },
          { model: Domain, attributes: ['id', 'name', 'status'] },
          { model: Email, attributes: ['id', 'email', 'status'] }
        ]
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching clients',
        details: error.message
      });
    }
  }

  async getClientById(req, res) {
    try {
      const client = await Client.findByPk(req.params.id, {
        include: [
          { model: Website },
          { model: Domain },
          { model: Email }
        ]
      });

      if (!client) {
        return res.status(404).json({
          error: 'Client not found'
        });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching client',
        details: error.message
      });
    }
  }
}

module.exports = new ClientController(); 