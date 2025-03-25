const { Email, Client, Website } = require('../models');

exports.getAllEmails = async (req, res) => {
  try {
    const emails = await Email.findAll({
      include: [
        { model: Client, attributes: ['id', 'name', 'company'] },
        { model: Website, attributes: ['id', 'name', 'url'] }
      ]
    });
    res.json(emails);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching email accounts',
      details: error.message
    });
  }
};

exports.getEmailById = async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id, {
      include: [
        { model: Client },
        { model: Website }
      ]
    });

    if (!email) {
      return res.status(404).json({
        error: 'Email account not found'
      });
    }

    res.json(email);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching email account',
      details: error.message
    });
  }
};

exports.createEmail = async (req, res) => {
  try {
    const { email, password, type, status, clientId, websiteId } = req.body;
    
    // Validate required fields
    if (!email || !password || !clientId || !websiteId) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Email, password, client, and website are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Check if email already exists
    const existingEmail = await Email.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    // Validate client and website exist
    const client = await Client.findByPk(clientId);
    const website = await Website.findByPk(websiteId);

    if (!client) {
      return res.status(400).json({
        error: 'Client not found'
      });
    }

    if (!website) {
      return res.status(400).json({
        error: 'Website not found'
      });
    }

    // Create email account
    const emailAccount = await Email.create(req.body);
    
    // Fetch the created email with associations
    const createdEmail = await Email.findByPk(emailAccount.id, {
      include: [
        { model: Client },
        { model: Website }
      ]
    });

    res.status(201).json(createdEmail);
  } catch (error) {
    res.status(500).json({
      error: 'Error creating email account',
      details: error.message
    });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, type, status, clientId, websiteId } = req.body;

    const emailAccount = await Email.findByPk(id);
    if (!emailAccount) {
      return res.status(404).json({
        error: 'Email account not found'
      });
    }

    // If email is being updated, validate it
    if (email && email !== emailAccount.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      // Check if new email already exists
      const existingEmail = await Email.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          error: 'Email already exists'
        });
      }
    }

    // If client or website is being updated, validate they exist
    if (clientId) {
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(400).json({
          error: 'Client not found'
        });
      }
    }

    if (websiteId) {
      const website = await Website.findByPk(websiteId);
      if (!website) {
        return res.status(400).json({
          error: 'Website not found'
        });
      }
    }

    // Update email account
    await emailAccount.update(req.body);

    // Fetch the updated email with associations
    const updatedEmail = await Email.findByPk(id, {
      include: [
        { model: Client },
        { model: Website }
      ]
    });

    res.json(updatedEmail);
  } catch (error) {
    res.status(500).json({
      error: 'Error updating email account',
      details: error.message
    });
  }
};

exports.deleteEmail = async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (!email) {
      return res.status(404).json({
        error: 'Email account not found'
      });
    }

    await email.destroy();
    res.json({ message: 'Email account deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting email account',
      details: error.message
    });
  }
}; 