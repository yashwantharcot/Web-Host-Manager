module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The root directory that Jest should scan for tests and modules
  rootDir: '.',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>'],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],

  // Setup files that will be run before each test
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Set test timeout
  testTimeout: 10000,

  // Environment variables
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};
