@echo off

:: Create test environment file
echo NODE_ENV=test > .env.test
echo PORT=3001 >> .env.test
echo DB_HOST=localhost >> .env.test
echo DB_PORT=5432 >> .env.test
echo DB_NAME=webhostmanager_test >> .env.test
echo DB_USER=postgres >> .env.test
echo DB_PASSWORD=postgres >> .env.test
echo JWT_SECRET=test_secret_key >> .env.test
echo JWT_EXPIRES_IN=1h >> .env.test

:: Create test database
psql -U postgres -c "DROP DATABASE IF EXISTS webhostmanager_test;"
psql -U postgres -c "CREATE DATABASE webhostmanager_test;"

:: Install dependencies
call npm install

:: Run migrations
call npm run migrate:test

:: Seed test data
call npm run seed:test

echo Backend test environment setup complete! 