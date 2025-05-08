const loggerMock = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  add: jest.fn(),
  transports: [
    {
      format: jest.fn(),
    },
  ],
};

// trying to mock createLogger to return a specific logger instance
jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue(loggerMock),
  transports: {
    File: jest.fn(),
    Console: jest.fn(),
  },
}));

describe('logger', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  it('Should be defined', () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').logger;
    // act && assert
    expect(logger).toBeDefined();
  });

  it('Should call log', () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').logger;
    // act
    logger.log('info', 'test log info');
    // assert
    expect(logger.log).toHaveBeenCalled();
  });

  it('Should call debug', () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').logger;
    // act
    logger.debug('debug message');
    // assert
    expect(logger.debug).toHaveBeenCalledTimes(1);
  });

  it('Should call error', () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').logger;
    // act
    logger.error('error message');
    // assert
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('Should try in mock env', () => {
    // arrange
    process.env.NODE_ENV = 'mock';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').logger;
    // act
    logger.error('error message');
    // assert
    expect(logger.error).toHaveBeenCalledTimes(2);
  });

  it('Should try in mock preprod', () => {
    // arrange
    process.env.NODE_ENV = 'preprod';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').logger;
    // act
    logger.info('info');
    // assert
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
