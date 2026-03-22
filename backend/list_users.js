const { User, sequelize } = require('./models');

async function listUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log('Total users:', users.length);
    users.forEach(u => {
      console.log(`- ID: ${u.id}, Username: ${u.username}, Email: ${u.email}`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (sequelize.close) await sequelize.close();
  }
}

listUsers();
