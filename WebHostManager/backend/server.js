const express = require('express');
const dotenv = require('dotenv');
const { sequelize, User, Client, Domain, EmailAccount } = require('./models');
const clientRoutes = require('./routes/clientRoutes');
const domainRoutes = require('./routes/domainRoutes');
const emailAccountRoutes = require('./routes/emailAccountRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Test the database connection
(async () => {
  try {
    await sequelize.sync(); // Sync the database models
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Middleware and routes
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/domains', authMiddleware, domainRoutes);
app.use('/api/emailAccounts', authMiddleware, emailAccountRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
