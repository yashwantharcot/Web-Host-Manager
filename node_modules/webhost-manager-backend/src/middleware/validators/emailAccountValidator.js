'use strict';

const { body, param } = require('express-validator');
const { validateResult } = require('./validatorResult');

const validateCreateEmailAccount = [
  body('website_id')
    .isInt()
    .withMessage('Valid website ID is required'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  
  body('provider')
    .trim()
    .notEmpty()
    .withMessage('Provider is required')
    .isLength({ max: 100 })
    .withMessage('Provider must be at most 100 characters'),
  
  validateResult
];

const validateUpdateEmailAccount = [
  param('id')
    .isInt()
    .withMessage('Invalid email account ID'),
  
  body('website_id')
    .optional()
    .isInt()
    .withMessage('Invalid website ID'),
  
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  
  body('provider')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Provider cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Provider must be at most 100 characters'),
  
  validateResult
];

const validateEmailAccountId = [
  param('id')
    .isInt()
    .withMessage('Invalid email account ID'),
  
  validateResult
];

module.exports = {
  validateCreateEmailAccount,
  validateUpdateEmailAccount,
  validateEmailAccountId
}; 