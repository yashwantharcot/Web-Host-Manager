@echo off

echo Setting up frontend test environment...
cd frontend
call setup-test-env.bat

echo Running frontend tests...
call npm test -- --watchAll=false

echo Setting up backend test environment...
cd ../backend
call setup-test-env.bat

echo Running backend tests...
call npm test

echo Running integration tests...
call npm run test:integration

echo Running end-to-end tests...
cd ../frontend
call npm run test:e2e

echo All tests completed! 