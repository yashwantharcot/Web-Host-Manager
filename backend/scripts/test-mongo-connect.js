const mongo = require('../src/config/mongo');

(async () => {
  try {
    await mongo.connect();
    console.log('OK: connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('ERROR: could not connect to MongoDB', err.message || err);
    process.exit(2);
  }
})();
