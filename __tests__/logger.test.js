const Logger = require('..');

const chalk = require('chalk');

describe('Logger', function () {
  beforeEach(() => {
    console.debug = jest.fn();
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  test('singletons', () => {
    expect(Logger.getLogger()).toBe(Logger.getLogger());
    expect(Logger.getLogger('A')).toBe(Logger.getLogger('A'));
    expect(Logger.getLogger()).not.toBe(Logger.getLogger('A'));
  });

  test('default format', () => {
    const logger = Logger.getLogger();

    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalledWith(chalk`2018-02-17 08:30:00 :: default :: {cyanBright debug} :: Debug message`);

    logger.log('Log message');
    expect(console.log).toHaveBeenCalledWith(chalk`2018-02-17 08:30:00 :: default :: {green log} :: Log message`);

    logger.info('Info message');
    expect(console.info).toHaveBeenCalledWith(chalk`2018-02-17 08:30:00 :: default :: {blue info} :: Info message`);

    logger.warn('Warn message');
    expect(console.warn).toHaveBeenCalledWith(chalk`2018-02-17 08:30:00 :: default :: {yellow warn} :: Warn message`);

    logger.error('Error message');
    expect(console.error).toHaveBeenCalledWith(chalk`2018-02-17 08:30:00 :: default :: {redBright error} :: Error message`);
  });

  test('custom format', () => {
    const logger = Logger.getLogger();
    // only date, no colors, no logger name
    logger.setFormat((ctx, variables) => `${ctx.luxon.toFormat('yyyy-LL-dd')} - ${ctx.level} - ${ctx.message}`);

    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalledWith('2018-02-17 - debug - Debug message');

    logger.log('Log message');
    expect(console.log).toHaveBeenCalledWith('2018-02-17 - log - Log message');

    logger.info('Info message');
    expect(console.info).toHaveBeenCalledWith('2018-02-17 - info - Info message');

    logger.warn('Warn message');
    expect(console.warn).toHaveBeenCalledWith('2018-02-17 - warn - Warn message');

    logger.error('Error message');
    expect(console.error).toHaveBeenCalledWith('2018-02-17 - error - Error message');
  });

  test('context variables', () => {
    const logger = Logger.getLogger();
    logger.setFormat((ctx) => `name=${ctx.name} level=${ctx.level} message=${ctx.message}`);

    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalledWith('name=default level=debug message=Debug message');

    logger.log('Log message');
    expect(console.log).toHaveBeenCalledWith('name=default level=log message=Log message');

    logger.info('Info message');
    expect(console.info).toHaveBeenCalledWith('name=default level=info message=Info message');

    logger.warn('Warn message');
    expect(console.warn).toHaveBeenCalledWith('name=default level=warn message=Warn message');

    logger.error('Error message');
    expect(console.error).toHaveBeenCalledWith('name=default level=error message=Error message');
  });

  test('static user variables', () => {
    const logger = Logger.getLogger();
    let count = 0;

    logger.setFormat((ctx, vars) => `message=${ctx.message} :: count=${vars.count} username=${vars.username}`);
    logger.setVariables({
      count,
      username: 'kocal',
    });

    logger.log('Log message');
    expect(console.log).toHaveBeenCalledWith('message=Log message :: count=0 username=kocal');
    expect(count).toBe(0);

    count += 1;

    logger.log('Log 2nd message');
    expect(console.log).toHaveBeenCalledWith('message=Log 2nd message :: count=0 username=kocal');
    expect(count).toBe(1);
  });

  test('dynamic user variables', () => {
    const logger = Logger.getLogger();
    let count = 0;

    logger.setFormat((ctx, vars) => `message=${ctx.message} :: count=${vars.count} username=${vars.username}`);
    logger.setVariables(() => ({
      count,
      username: 'kocal',
    }));

    logger.log('Log message');
    expect(console.log).toHaveBeenCalledWith('message=Log message :: count=0 username=kocal');
    expect(count).toBe(0);

    count += 1;

    logger.log('Log 2nd message');
    expect(console.log).toHaveBeenCalledWith('message=Log 2nd message :: count=1 username=kocal');
    expect(count).toBe(1);
  });
});
