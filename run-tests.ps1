# Set error action preference
$ErrorActionPreference = "Stop"

# Get the script's directory
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

try {
    # Setup and run frontend tests
    Write-Host "Setting up frontend test environment..."
    Set-Location (Join-Path $scriptRoot "frontend")
    .\setup-test-env.ps1
    Write-Host "Running frontend tests..."
    npm test -- --watchAll=false

    # Setup and run backend tests
    Write-Host "Setting up backend test environment..."
    Set-Location (Join-Path $scriptRoot "backend")
    .\setup-test-env.ps1
    Write-Host "Running backend tests..."
    npm test
    Write-Host "Running integration tests..."
    npm run test:integration

    # Run end-to-end tests
    Write-Host "Running end-to-end tests..."
    Set-Location (Join-Path $scriptRoot "frontend")
    npm run test:e2e

    Write-Host "All tests completed successfully!"
} catch {
    Write-Host "Error occurred during test execution: $_"
    exit 1
} finally {
    # Return to the original directory
    Set-Location $scriptRoot
} 