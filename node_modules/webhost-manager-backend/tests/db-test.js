require('dotenv').config({
  path: '.env.test'
});

const { Sequelize } = require('sequelize');

async function testConnection() {
  const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Test database sync
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();
