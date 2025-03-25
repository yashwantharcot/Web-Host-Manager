const { Client, Website, Domain, Email } = require('../models');

exports.getAllClients = async (req, res) => {
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
};

exports.getClientById = async (req, res) => {
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
};

exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({
      error: 'Error creating client',
      details: error.message
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    await client.update(req.body);
    res.json(client);
  } catch (error) {
    res.status(500).json({
      error: 'Error updating client',
      details: error.message
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting client',
      details: error.message
    });
  }
}; 