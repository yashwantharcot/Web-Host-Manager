const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const base = process.env.MONGO_URI || process.env.MONGOURI || process.env.MONGODB_URI || '';
if (!base) {
  console.error('No MONGO_URI found in environment');
  process.exit(2);
}

const dbName = process.env.MONGO_DB || 'webhost_manager';

const variants = [
  { name: 'base', uri: base },
  { name: 'withDb', uri: base.replace(/\/?$/, `/${dbName}`) },
  { name: 'withAuthSource', uri: base.includes('?') ? `${base}&authSource=admin` : `${base}?authSource=admin` },
  { name: 'withDbAndAuthSource', uri: base.replace(/\/?$/, `/${dbName}`).includes('?') ? base.replace(/\/?$/, `/${dbName}`) + '&authSource=admin' : base.replace(/\/?$/, `/${dbName}`) + '?authSource=admin' }
];

async function tryConnect(uri) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    await client.db().admin().ping();
    await client.close();
    return { ok: true };
  } catch (err) {
    try { await client.close(); } catch {};
    return { ok: false, message: err && err.message ? err.message : String(err) };
  }
}

(async () => {
  for (const v of variants) {
    console.log('Trying variant:', v.name);
    const res = await tryConnect(v.uri);
    if (res.ok) {
      console.log('SUCCESS with variant:', v.name);
      process.exit(0);
    } else {
      console.log('Failed:', res.message);
    }
  }
  console.error('All variants failed. Credentials likely incorrect or user not authorized for the target DB.');
  process.exit(2);
})();
