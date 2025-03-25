const { Website, Client, Domain, Email } = require('../models');

exports.getAllWebsites = async (req, res) => {
  try {
    const websites = await Website.findAll({
      include: [
        { model: Client, attributes: ['id', 'name', 'company'] },
        { model: Domain, attributes: ['id', 'name', 'status'] },
        { model: Email, attributes: ['id', 'email', 'status'] }
      ]
    });
    res.json(websites);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching websites',
      details: error.message
    });
  }
};

exports.getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findByPk(req.params.id, {
      include: [
        { model: Client },
        { model: Domain },
        { model: Email }
      ]
    });

    if (!website) {
      return res.status(404).json({
        error: 'Website not found'
      });
    }

    res.json(website);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching website',
      details: error.message
    });
  }
};

exports.createWebsite = async (req, res) => {
  try {
    const website = await Website.create(req.body);
    res.status(201).json(website);
  } catch (error) {
    res.status(500).json({
      error: 'Error creating website',
      details: error.message
    });
  }
};

exports.updateWebsite = async (req, res) => {
  try {
    const website = await Website.findByPk(req.params.id);
    if (!website) {
      return res.status(404).json({
        error: 'Website not found'
      });
    }

    await website.update(req.body);
    res.json(website);
  } catch (error) {
    res.status(500).json({
      error: 'Error updating website',
      details: error.message
    });
  }
};

exports.deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findByPk(req.params.id);
    if (!website) {
      return res.status(404).json({
        error: 'Website not found'
      });
    }

    await website.destroy();
    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting website',
      details: error.message
    });
  }
}; 