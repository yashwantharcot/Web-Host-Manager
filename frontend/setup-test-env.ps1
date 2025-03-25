# Remove existing node_modules and package-lock.json
Write-Host "Removing existing node_modules and package-lock.json..."
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install --legacy-peer-deps

# Install Chakra UI and related dependencies
Write-Host "Installing Chakra UI dependencies..."
npm install @chakra-ui/react @chakra-ui/utils @emotion/react @emotion/styled framer-motion --legacy-peer-deps

# Install chart dependencies
Write-Host "Installing chart dependencies..."
npm install chart.js react-chartjs-2 --legacy-peer-deps

# Install testing dependencies
Write-Host "Installing testing dependencies..."
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event lz-string --legacy-peer-deps

# Install Cypress globally
Write-Host "Installing Cypress globally..."
npm install -g cypress

# Create Cypress support file
Write-Host "Creating Cypress support file..."
$cypressSupportDir = "cypress/support"
if (-not (Test-Path $cypressSupportDir)) {
    New-Item -ItemType Directory -Path $cypressSupportDir -Force
}
@"
// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide XHR requests from command log
const app = window.top;
if (app) {
    app.console.log = () => {};
}
"@ | Set-Content -Path "$cypressSupportDir/e2e.js"

# Create tsconfig.json for Cypress
Write-Host "Creating tsconfig.json for Cypress..."
@"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress", "node"],
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "baseUrl": "http://localhost:3000"
  },
  "include": ["**/*.ts"]
}
"@ | Set-Content -Path "tsconfig.json"

# Create test environment file
Write-Host "Creating test environment file..."
@"
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TEST_USER_EMAIL=admin@example.com
REACT_APP_TEST_USER_PASSWORD=password123
"@ | Set-Content -Path .env.test

Write-Host "Frontend test environment setup complete!" 