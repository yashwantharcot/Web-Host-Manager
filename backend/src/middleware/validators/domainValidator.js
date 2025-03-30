'use strict';

const { body, param } = require('express-validator');
const { validateResult } = require('./validatorResult');

const validateCreateDomain = [
  body('website_id')
    .isInt()
    .withMessage('Valid website ID is required'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Domain name is required')
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
    .withMessage('Invalid domain name format'),
  
  body('registrar')
    .trim()
    .notEmpty()
    .withMessage('Registrar is required')
    .isLength({ max: 100 })
    .withMessage('Registrar must be at most 100 characters'),
  
  body('expiry_date')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  body('renewal_cost')
    .isFloat({ min: 0 })
    .withMessage('Renewal cost must be a positive number'),
  
  body('status')
    .isIn(['active', 'pending', 'expired'])
    .withMessage('Status must be either active, pending, or expired'),
  
  validateResult
];

const validateUpdateDomain = [
  param('id')
    .isInt()
    .withMessage('Invalid domain ID'),
  
  body('website_id')
    .optional()
    .isInt()
    .withMessage('Invalid website ID'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Domain name cannot be empty')
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
    .withMessage('Invalid domain name format'),
  
  body('registrar')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Registrar cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Registrar must be at most 100 characters'),
  
  body('expiry_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  body('renewal_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Renewal cost must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['active', 'pending', 'expired'])
    .withMessage('Status must be either active, pending, or expired'),
  
  validateResult
];

const validateDomainId = [
  param('id')
    .isInt()
    .withMessage('Invalid domain ID'),
  
  validateResult
];

module.exports = {
  validateCreateDomain,
  validateUpdateDomain,
  validateDomainId
}; 