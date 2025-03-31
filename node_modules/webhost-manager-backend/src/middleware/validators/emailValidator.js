const yup = require('yup');
const logger = require('../../utils/logger');

const emailSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  provider: yup.string().required('Email provider is required'),
  website_id: yup.number().integer().positive().required('Website ID is required')
});

const validateCreateEmail = async (req, res, next) => {
  try {
    await emailSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Email account validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

const validateUpdateEmail = async (req, res, next) => {
  try {
    await emailSchema.partial().validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Email account update validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

const validateEmailId = async (req, res, next) => {
  try {
    await yup.number().integer().positive().validate(req.params.id);
    next();
  } catch (error) {
    logger.error('Email account ID validation error:', error);
    res.status(400).json({
      error: 'Invalid email account ID',
      details: error.errors
    });
  }
};

module.exports = {
  validateCreateEmail,
  validateUpdateEmail,
  validateEmailId
}; 