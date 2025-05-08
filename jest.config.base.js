// jest.config.base.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@graphql/(.*)$': '<rootDir>/src/graphql/$1',
    '^@usecases/(.*)$': '<rootDir>/src/usecases/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@commons/(.*)$': '<rootDir>/src/commons/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
