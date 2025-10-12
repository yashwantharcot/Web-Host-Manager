const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend/.env and repo root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// If a full URI is provided, use it. Otherwise build from parts.
const fullUri = process.env.MONGO_URI || process.env.MONGOURI || process.env.MONGODB_URI || '';

function sanitizeUri(uri) {
  if (!uri) return uri;
  // match prefix and rest
  const m = uri.match(/^(mongodb(\+srv)?:\/\/)(.*)$/);
  if (!m) return uri;
  const prefix = m[1];
  const rest = m[3];

  if (rest.indexOf('@') === -1) return uri;
  const lastAt = rest.lastIndexOf('@');
  const cred = rest.slice(0, lastAt);
  const hostAndPath = rest.slice(lastAt + 1);
  if (cred.indexOf(':') === -1) return uri;
  const user = cred.split(':')[0];
  const pass = cred.split(':').slice(1).join(':');
  if (!pass) return uri;
  // If password contains '@' or other unsafe chars, encode it
  const encodedPass = encodeURIComponent(pass);
  return `${prefix}${user}:${encodedPass}@${hostAndPath}`;
}

let uri = sanitizeUri(fullUri);
if (!uri) {
  const username = encodeURIComponent(process.env.MONGO_USER || process.env.MONGO_USERNAME || '');
  const password = encodeURIComponent(process.env.MONGO_PASS || process.env.MONGO_PASSWORD || '');
  const cluster = process.env.MONGO_CLUSTER || process.env.MONGO_HOST || '';
  const authSource = process.env.MONGO_AUTHSOURCE || 'admin';
  const authMechanism = process.env.MONGO_AUTHMECH || 'SCRAM-SHA-1';
  if (username && password && cluster) {
    uri = `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;
  }
}

if (!uri) {
  console.error('No MongoDB URI or credentials found in environment. Set MONGO_URI or MONGO_USER/MONGO_PASS/MONGO_CLUSTER.');
  process.exit(2);
}

async function run() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected. Listing sample documents...');

    const dbName = process.env.MONGO_DB || process.env.DB_NAME || 'webhost_manager';
    const collName = process.env.MONGO_COLL || 'test_collection';

    const database = client.db(dbName);
    const coll = database.collection(collName);

    // Insert a sample doc if collection empty
    const count = await coll.countDocuments();
    if (count === 0) {
      await coll.insertOne({ seededAt: new Date(), note: 'seeded by test-mongo-native' });
      console.log('Inserted a sample document.');
    }

    const cursor = coll.find().limit(5);
    await cursor.forEach(doc => console.log(JSON.stringify(doc)));
  } catch (err) {
    console.error('MongoDB error:', err && err.message ? err.message : err);
    process.exit(2);
  } finally {
    await client.close();
  }
}

run().catch(err => {
  console.error('Unhandled error:', err && err.message ? err.message : err);
  process.exit(2);
});
