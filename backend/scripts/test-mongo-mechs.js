const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let baseUri = process.env.MONGO_URI || process.env.MONGOURI || process.env.MONGODB_URI || '';
if (!baseUri) {
  console.error('No MONGO_URI found in env');
  process.exit(2);
}

// ensure no trailing slash after domain path
if (baseUri.endsWith('/')) baseUri = baseUri.slice(0, -1);

const mechs = ['SCRAM-SHA-256', 'SCRAM-SHA-1', ''];

function addParam(uri, key, val) {
  if (!val) return uri;
  return uri.includes('?') ? `${uri}&${key}=${val}` : `${uri}?${key}=${val}`;
}

(async () => {
  for (const mech of mechs) {
    const uri = mech ? addParam(baseUri, 'authMechanism', mech) : baseUri;
    console.log('Trying authMechanism:', mech || 'default');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('SUCCESS with mechanism:', mech || 'default');
      await client.close();
      process.exit(0);
    } catch (err) {
      console.error('Failed with', mech || 'default', '->', err && err.message ? err.message : err);
    } finally {
      try { await client.close(); } catch {}
    }
  }
  console.error('All mechanisms failed');
  process.exit(2);
})();
