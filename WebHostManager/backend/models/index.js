const User = require('./User');
const Client = require('./Client');
const Domain = require('./Domain');
const EmailAccount = require('./EmailAccount');

// Define associations
User.hasMany(Client, { foreignKey: 'userId' });
Client.belongsTo(User, { foreignKey: 'userId' });

Client.hasMany(Domain, { foreignKey: 'clientId' });
Domain.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasMany(EmailAccount, { foreignKey: 'clientId' });
EmailAccount.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = {
  User,
  Client,
  Domain,
  EmailAccount,
};