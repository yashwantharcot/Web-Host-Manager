#!/bin/bash

# Create test environment file
cat > .env.test << EOL
NODE_ENV=test
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webhostmanager_test
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=test_secret_key
JWT_EXPIRES_IN=1h
EOL

# Create test database
psql -U postgres -c "DROP DATABASE IF EXISTS webhostmanager_test;"
psql -U postgres -c "CREATE DATABASE webhostmanager_test;"

# Run migrations
npm run migrate:test

# Seed test data
npm run seed:test

echo "Backend test environment setup complete!" 