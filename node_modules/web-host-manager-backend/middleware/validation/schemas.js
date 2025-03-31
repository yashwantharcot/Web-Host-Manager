const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('admin', 'user').default('user')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Client validation schemas
const clientSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).allow(null, ''),
    company: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    status: Joi.string().valid('active', 'inactive', 'pending').default('active')
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).allow(null, ''),
    company: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    status: Joi.string().valid('active', 'inactive', 'pending')
  })
};

// Domain validation schemas
const domainSchemas = {
  create: Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/).required(),
    registrar: Joi.string().allow(null, ''),
    registrarUsername: Joi.string().allow(null, ''),
    registrarPassword: Joi.string().allow(null, ''),
    nameservers: Joi.array().items(Joi.string()).default([]),
    registrationDate: Joi.date().required(),
    expiryDate: Joi.date().required(),
    autoRenew: Joi.boolean().default(true),
    status: Joi.string().valid('active', 'expired', 'pending', 'transferring').default('active'),
    notes: Joi.string().allow(null, ''),
    clientId: Joi.number().integer().required()
  }),

  update: Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/),
    registrar: Joi.string().allow(null, ''),
    registrarUsername: Joi.string().allow(null, ''),
    registrarPassword: Joi.string().allow(null, ''),
    nameservers: Joi.array().items(Joi.string()),
    registrationDate: Joi.date(),
    expiryDate: Joi.date(),
    autoRenew: Joi.boolean(),
    status: Joi.string().valid('active', 'expired', 'pending', 'transferring'),
    notes: Joi.string().allow(null, '')
  })
};

// Email Account validation schemas
const emailSchemas = {
  create: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    server: Joi.string().required(),
    port: Joi.number().integer().min(1).max(65535).required(),
    type: Joi.string().valid('POP3', 'IMAP', 'Exchange').default('IMAP'),
    useSSL: Joi.boolean().default(true),
    quotaLimit: Joi.number().integer().min(0).allow(null),
    status: Joi.string().valid('active', 'suspended', 'deleted').default('active'),
    clientId: Joi.number().integer().required()
  }),

  update: Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
    server: Joi.string(),
    port: Joi.number().integer().min(1).max(65535),
    type: Joi.string().valid('POP3', 'IMAP', 'Exchange'),
    useSSL: Joi.boolean(),
    quotaLimit: Joi.number().integer().min(0).allow(null),
    status: Joi.string().valid('active', 'suspended', 'deleted')
  })
};

module.exports = {
  userSchemas,
  clientSchemas,
  domainSchemas,
  emailSchemas
};
