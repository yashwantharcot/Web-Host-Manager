const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');
const Domain = require('./Domain');
const EmailAccount = require('./EmailAccount');

// Define associations here if needed
User.hasMany(Client);
Client.belongsTo(User);

module.exports = { sequelize, User, Client, Domain, EmailAccount };