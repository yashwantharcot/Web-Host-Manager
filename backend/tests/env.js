// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 3001;

// Test database configuration
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 5432;
process.env.DB_NAME = 'whm_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';

// Test authentication configuration
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '24h';

// Test security configuration
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.RATE_LIMIT_WINDOW_MS = 900000;
process.env.RATE_LIMIT_MAX_REQUESTS = 100;
process.env.CORS_MAX_AGE = 0;
process.env.CORS_ORIGIN = 'http://localhost:3000';

// Test session configuration
process.env.SESSION_SECRET = 'test_session_secret';
process.env.SESSION_EXPIRY = 3600000;

// Logging configuration
process.env.LOG_LEVEL = 'error';
