const yup = require('yup');
const logger = require('../../utils/logger');

const websiteSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  url: yup.string().url('Invalid URL format').required('URL is required'),
  hosting_provider: yup.string().required('Hosting provider is required'),
  login_credentials: yup.object().required('Login credentials are required'),
  expiry_date: yup.date().min(new Date(), 'Expiry date must be in the future').required('Expiry date is required'),
  client_id: yup.number().integer().positive().required('Client ID is required')
});

const validateCreateWebsite = async (req, res, next) => {
  try {
    await websiteSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Website validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

const validateUpdateWebsite = async (req, res, next) => {
  try {
    await websiteSchema.partial().validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Website update validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

const validateWebsiteId = async (req, res, next) => {
  try {
    await yup.number().integer().positive().validate(req.params.id);
    next();
  } catch (error) {
    logger.error('Website ID validation error:', error);
    res.status(400).json({
      error: 'Invalid website ID',
      details: error.errors
    });
  }
};

module.exports = {
  validateCreateWebsite,
  validateUpdateWebsite,
  validateWebsiteId
}; 