'use strict';

const { body, param } = require('express-validator');
const { validateResult } = require('./validatorResult');
const yup = require('yup');
const logger = require('../../utils/logger');

const clientSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  company: yup.string().required('Company name is required')
});

const validateCreateClient = async (req, res, next) => {
  try {
    await clientSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Client validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

const validateUpdateClient = async (req, res, next) => {
  try {
    await clientSchema.partial().validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Client update validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

const validateClientId = async (req, res, next) => {
  try {
    await yup.number().integer().positive().validate(req.params.id);
    next();
  } catch (error) {
    logger.error('Client ID validation error:', error);
    res.status(400).json({
      error: 'Invalid client ID',
      details: error.errors
    });
  }
};

module.exports = {
  validateCreateClient,
  validateUpdateClient,
  validateClientId
}; 