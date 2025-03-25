#!/bin/bash

# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Install Chakra UI and related dependencies
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Install testing dependencies
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event cypress

# Create test environment file
cat > .env.test << EOL
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TEST_USER_EMAIL=admin@example.com
REACT_APP_TEST_USER_PASSWORD=password123
EOL

echo "Frontend test environment setup complete!" 