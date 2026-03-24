const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment from backend/.env first, then try repo root .env to be flexible
dotenv.config();
const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });
const projectEnv = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: projectEnv });

// Accept multiple common environment variable names for backwards compatibility
const rawMongoUri = process.env.MONGO_URI || process.env.MONGOURI || process.env.MONGO_URL || process.env.MONGODB_URI || '';

// Helper to fix a URI where password contains an unencoded '@' by encoding the password part
function sanitizeMongoUri(uri) {
  if (!uri) return uri;
  const m = uri.match(/^(mongodb(\+srv)?:\/\/)(.*)$/);
  if (!m) return uri;
  const prefix = m[1];
  const rest = m[3];

  // If there are no credentials, return as-is
  if (rest.indexOf('@') === -1) return uri;

  // Split at the last '@' to separate credentials and host
  const lastAt = rest.lastIndexOf('@');
  const cred = rest.slice(0, lastAt);
  const hostAndPath = rest.slice(lastAt + 1);

  // If credentials don't contain ':', assume no password
  if (cred.indexOf(':') === -1) return uri;

  const user = cred.split(':')[0];
  const pass = cred.split(':').slice(1).join(':');

  // If password already looks encoded or contains no @, return original
  if (!pass || pass.indexOf('@') === -1) {
    return uri;
  }

  const encodedPass = encodeURIComponent(pass);
  return `${prefix}${user}:${encodedPass}@${hostAndPath}`;
}

const MONGO_URI = rawMongoUri ? (rawMongoUri.startsWith('mongodb+srv') ? rawMongoUri : sanitizeMongoUri(rawMongoUri)) : 'mongodb://localhost:27017/webhost_manager';

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser/useUnifiedTopology are defaults on recent mongoose versions but kept for clarity
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info(`Connected to MongoDB (${MONGO_URI.split('@')[0]}@...)`);
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = { connect, mongoose };
