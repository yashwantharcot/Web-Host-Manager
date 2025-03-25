const User = require('./User');
const Client = require('./Client');
const Website = require('./Website');
const Domain = require('./Domain');
const Email = require('./Email');

// Client associations
Client.hasMany(Website);
Website.belongsTo(Client);

Client.hasMany(Domain);
Domain.belongsTo(Client);

Client.hasMany(Email);
Email.belongsTo(Client);

// Website associations
Website.hasMany(Domain);
Domain.belongsTo(Website);

Website.hasMany(Email);
Email.belongsTo(Website);

module.exports = {
  User,
  Client,
  Website,
  Domain,
  Email
}; 