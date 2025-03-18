const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('../config/database');
const { User, Client, Domain, EmailAccount } = require('./models');
const clientRoutes = require('./routes/clientRoutes');
const domainRoutes = require('./routes/domainRoutes');
const emailAccountRoutes = require('./routes/emailAccountRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Sync models with the database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

// Middleware and routes
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/domains', authMiddleware, domainRoutes);
app.use('/api/emailAccounts', authMiddleware, emailAccountRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
