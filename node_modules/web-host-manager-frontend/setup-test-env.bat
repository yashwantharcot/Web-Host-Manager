@echo off

:: Remove existing node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

:: Install dependencies
call npm install

:: Install Chakra UI and related dependencies
call npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

:: Install testing dependencies
call npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event cypress

:: Create test environment file
echo REACT_APP_API_URL=http://localhost:3001/api > .env.test
echo REACT_APP_TEST_USER_EMAIL=admin@example.com >> .env.test
echo REACT_APP_TEST_USER_PASSWORD=password123 >> .env.test

echo Frontend test environment setup complete! 