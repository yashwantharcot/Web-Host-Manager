// Adapter: expose mongoose-backed models under backend/models so tests and
// other legacy code that `require('../models')` keep working.

const mongooseAdapter = require('../src/models/index.js');

// Minimal `sequelize` object used by tests/setup.js which calls `sequelize.sync({force:true})`
// and `sequelize.close()`. We implement those to operate on the mongoose connection.
const sequelize = {
  async close() {
    try {
      if (mongooseAdapter && mongooseAdapter.mongoose && mongooseAdapter.mongoose.disconnect) {
        await mongooseAdapter.mongoose.disconnect();
      }
    } catch (e) {
      // ignore
    }
  },
  async sync(options = {}) {
    // If force is true, clear all collections to emulate fresh SQL schema
    if (options.force) {
      const conn = mongooseAdapter.mongoose.connection;
      if (conn && conn.collections) {
        const collections = Object.keys(conn.collections);
        for (const name of collections) {
          try {
            await conn.collections[name].deleteMany({});
          } catch (e) {
            // ignore
          }
        }
      }
    }
    return Promise.resolve();
  }
};

// Export the mongoose-backed model adapters (User, Client, Domain, EmailAccount)
module.exports = {
  sequelize,
  User: mongooseAdapter.User,
  Client: mongooseAdapter.Client,
  Domain: mongooseAdapter.Domain,
  EmailAccount: mongooseAdapter.EmailAccount
};