const { User, sequelize } = require('./models');
const { Op } = require('sequelize');

async function checkUser() {
  try {
    // sequelize.authenticate() is now implemented by me to connect to Mongoose
    await sequelize.authenticate();
    const identifier = 'yashwanth@123';
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }]
      }
    });
    console.log('User found:', user ? { id: user.id, username: user.username, email: user.email } : 'Not found');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (sequelize.close) await sequelize.close();
  }
}

checkUser();
