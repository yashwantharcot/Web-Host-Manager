const { Domain, Client, Website } = require('../models');

exports.getAllDomains = async (req, res) => {
  try {
    const domains = await Domain.findAll({
      include: [
        { model: Client, attributes: ['id', 'name', 'company'] },
        { model: Website, attributes: ['id', 'name', 'url'] }
      ]
    });
    res.json(domains);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching domains',
      details: error.message
    });
  }
};

exports.getDomainById = async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id, {
      include: [
        { model: Client },
        { model: Website }
      ]
    });

    if (!domain) {
      return res.status(404).json({
        error: 'Domain not found'
      });
    }

    res.json(domain);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching domain',
      details: error.message
    });
  }
};

exports.createDomain = async (req, res) => {
  try {
    const { name, registrar, registrationDate, expiryDate, clientId, websiteId } = req.body;
    
    // Validate required fields
    if (!name || !registrar || !registrationDate || !expiryDate || !clientId) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name, registrar, registration date, expiry date, and client are required'
      });
    }

    // Validate dates
    const regDate = new Date(registrationDate);
    const expDate = new Date(expiryDate);
    
    if (isNaN(regDate.getTime()) || isNaN(expDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format'
      });
    }

    if (expDate <= regDate) {
      return res.status(400).json({
        error: 'Expiry date must be after registration date'
      });
    }

    // Check if domain already exists
    const existingDomain = await Domain.findOne({ where: { name } });
    if (existingDomain) {
      return res.status(400).json({
        error: 'Domain already exists'
      });
    }

    // Validate client exists
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(400).json({
        error: 'Client not found'
      });
    }

    // Validate website if provided
    if (websiteId) {
      const website = await Website.findByPk(websiteId);
      if (!website) {
        return res.status(400).json({
          error: 'Website not found'
        });
      }
    }

    // Create domain
    const domain = await Domain.create(req.body);
    
    // Fetch the created domain with associations
    const createdDomain = await Domain.findByPk(domain.id, {
      include: [
        { model: Client },
        { model: Website }
      ]
    });

    res.status(201).json(createdDomain);
  } catch (error) {
    res.status(500).json({
      error: 'Error creating domain',
      details: error.message
    });
  }
};

exports.updateDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, registrar, registrationDate, expiryDate, clientId, websiteId } = req.body;

    const domain = await Domain.findByPk(id);
    if (!domain) {
      return res.status(404).json({
        error: 'Domain not found'
      });
    }

    // If name is being updated, validate it
    if (name && name !== domain.name) {
      const existingDomain = await Domain.findOne({ where: { name } });
      if (existingDomain) {
        return res.status(400).json({
          error: 'Domain name already exists'
        });
      }
    }

    // Validate dates if being updated
    if (registrationDate || expiryDate) {
      const regDate = new Date(registrationDate || domain.registrationDate);
      const expDate = new Date(expiryDate || domain.expiryDate);
      
      if (isNaN(regDate.getTime()) || isNaN(expDate.getTime())) {
        return res.status(400).json({
          error: 'Invalid date format'
        });
      }

      if (expDate <= regDate) {
        return res.status(400).json({
          error: 'Expiry date must be after registration date'
        });
      }
    }

    // Validate client if being updated
    if (clientId) {
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(400).json({
          error: 'Client not found'
        });
      }
    }

    // Validate website if being updated
    if (websiteId) {
      const website = await Website.findByPk(websiteId);
      if (!website) {
        return res.status(400).json({
          error: 'Website not found'
        });
      }
    }

    // Update domain
    await domain.update(req.body);

    // Fetch the updated domain with associations
    const updatedDomain = await Domain.findByPk(id, {
      include: [
        { model: Client },
        { model: Website }
      ]
    });

    res.json(updatedDomain);
  } catch (error) {
    res.status(500).json({
      error: 'Error updating domain',
      details: error.message
    });
  }
};

exports.deleteDomain = async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({
        error: 'Domain not found'
      });
    }

    await domain.destroy();
    res.json({ message: 'Domain deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting domain',
      details: error.message
    });
  }
};

exports.getDomainsByClient = async (req, res) => {
  try {
    const domains = await Domain.findAll({
      where: { clientId: req.params.clientId },
      include: [
        { model: Client },
        { model: Website }
      ]
    });
    res.json(domains);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching client domains',
      details: error.message
    });
  }
};

exports.getDomainsByWebsite = async (req, res) => {
  try {
    const domains = await Domain.findAll({
      where: { websiteId: req.params.websiteId },
      include: [
        { model: Client },
        { model: Website }
      ]
    });
    res.json(domains);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching website domains',
      details: error.message
    });
  }
}; 