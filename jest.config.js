module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: './coverage/',
  collectCoverage: !!process.env.CI,
  collectCoverageFrom: ['src/**/*.js'],
};
