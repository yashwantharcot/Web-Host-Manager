require('dotenv').config();
const express = require('express');
const cors = require('cors');
let swaggerUi;
let specs;
try {
  swaggerUi = require('swagger-ui-express');
  specs = require('./config/swagger');
} catch (e) {
  // swagger not installed in some environments (tests) - continue without docs
  swaggerUi = null;
  specs = null;
}
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// API Documentation (optional)
if (swaggerUi && specs) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/websites', require('./routes/websiteRoutes'));
app.use('/api/domains', require('./routes/domainRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only start server when this file is executed directly (not when required by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (swaggerUi && specs) console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;