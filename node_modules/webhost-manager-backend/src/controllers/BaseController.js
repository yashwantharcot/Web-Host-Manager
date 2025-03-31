'use strict';

const logger = require('../utils/logger');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  async getAll(req, res) {
    try {
      const items = await this.model.findAll({
        where: { is_active: true }
      });
      res.json(items);
    } catch (error) {
      logger.error(`Error fetching ${this.model.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(item);
    } catch (error) {
      logger.error(`Error fetching ${this.model.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const item = await this.model.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      logger.error(`Error creating ${this.model.name}:`, error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      logger.error(`Error updating ${this.model.name}:`, error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }
      await item.update({ is_active: false });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      logger.error(`Error deleting ${this.model.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  }

  async bulkCreate(req, res) {
    try {
      const items = await this.model.bulkCreate(req.body);
      res.status(201).json(items);
    } catch (error) {
      logger.error(`Error bulk creating ${this.model.name}:`, error);
      res.status(500).json({
        error: `Error bulk creating ${this.model.name}`,
        details: error.message
      });
    }
  }

  async bulkUpdate(req, res) {
    try {
      const { ids, data } = req.body;
      await this.model.update(data, {
        where: { id: ids }
      });
      const items = await this.model.findAll({
        where: { id: ids }
      });
      res.json(items);
    } catch (error) {
      logger.error(`Error bulk updating ${this.model.name}:`, error);
      res.status(500).json({
        error: `Error bulk updating ${this.model.name}`,
        details: error.message
      });
    }
  }

  async bulkDelete(req, res) {
    try {
      const { ids } = req.body;
      await this.model.destroy({
        where: { id: ids }
      });
      res.json({ message: `${ids.length} ${this.model.name}(s) deleted successfully` });
    } catch (error) {
      logger.error(`Error bulk deleting ${this.model.name}:`, error);
      res.status(500).json({
        error: `Error bulk deleting ${this.model.name}`,
        details: error.message
      });
    }
  }
}

module.exports = BaseController; 