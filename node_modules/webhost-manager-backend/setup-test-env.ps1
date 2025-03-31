# Create test environment file
Write-Host "Creating test environment file..."
@"
NODE_ENV=test
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webhostmanager_test
DB_USER=postgres
DB_PASSWORD=yashwanth123
JWT_SECRET=test_secret_key
JWT_EXPIRES_IN=1h
"@ | Set-Content -Path .env.test

# Create Sequelize config directory if it doesn't exist
$configDir = "config"
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force
}

# Create Sequelize config file
Write-Host "Creating Sequelize config file..."
@"
{
  "test": {
    "username": "postgres",
    "password": "yashwanth123",
    "database": "webhostmanager_test",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  }
}
"@ | Set-Content -Path "$configDir/config.json"

# Create error handler middleware if it doesn't exist
$middlewareDir = "src/middleware"
if (-not (Test-Path $middlewareDir)) {
    New-Item -ItemType Directory -Path $middlewareDir -Force
}

# Create error handler middleware file
Write-Host "Creating error handler middleware..."
@"
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
};

module.exports = errorHandler;
"@ | Set-Content -Path "$middlewareDir/errorHandler.js"

# Create auth middleware file
Write-Host "Creating auth middleware..."
@"
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token verification failed, authorization denied' });
  }
};

module.exports = auth;
"@ | Set-Content -Path "$middlewareDir/auth.js"

# Setup test database
Write-Host "Setting up test database..."
$env:PGPASSWORD = "yashwanth123"
try {
    psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS webhostmanager_test;"
    psql -U postgres -h localhost -c "CREATE DATABASE webhostmanager_test;"
} catch {
    Write-Host "Warning: Could not connect to PostgreSQL. Please ensure PostgreSQL is running and credentials are correct."
    Write-Host "You may need to manually create the test database."
    Write-Host "Please run these commands in psql:"
    Write-Host "1. DROP DATABASE IF EXISTS webhostmanager_test;"
    Write-Host "2. CREATE DATABASE webhostmanager_test;"
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install --legacy-peer-deps

# Install Sequelize CLI globally
Write-Host "Installing Sequelize CLI globally..."
npm install -g sequelize-cli

# Run migrations
Write-Host "Running migrations..."
try {
    npx sequelize-cli db:migrate --env test
} catch {
    Write-Host "Warning: Could not run migrations. Please ensure database is properly set up."
}

# Seed test data
Write-Host "Seeding test data..."
try {
    npm run seed:test
} catch {
    Write-Host "Warning: Could not seed test data. Please ensure database is properly set up."
}

Write-Host "Backend test environment setup complete!" 