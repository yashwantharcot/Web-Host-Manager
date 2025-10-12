const mongo = require('../src/config/mongo');
const models = require('../src/models/mongoose');

(async () => {
  try {
    await mongo.connect();

    // Clear collections (safe for local/dev only)
    await Promise.all(Object.values(models).filter(m => m && m.deleteMany).map(m => m.deleteMany({})));

    // Insert sample user
    const user = await models.User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const client = await models.Client.create({
      user_id: user._id,
      company_name: 'Acme Co',
      contact_name: 'John Doe',
      email: 'contact@acme.example'
    });

    const website = await models.Website.create({
      client_id: client._id,
      domain: 'example.com',
      hosting_provider: 'ExampleHost'
    });

    const domain = await models.Domain.create({
      website_id: website._id,
      name: 'example.com',
      registrar: 'ExampleRegistrar'
    });

    const emailAcc = await models.EmailAccount.create({
      website_id: website._id,
      email: 'info@example.com',
      type: 'imap'
    });

    console.log('Seed complete:');
    console.log({ user: user._id, client: client._id, website: website._id, domain: domain._id, emailAcc: emailAcc._id });

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
