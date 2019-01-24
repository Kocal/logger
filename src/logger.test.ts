import Logger from '.';
import chalk from 'chalk';

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
    const logger = Logger.getLogger('default-format');
    logger.setLevel('debug');

    logger.debug('Debug message');
    expect(console.debug).toHaveBeenLastCalledWith(chalk`2018-02-17 08:30:00 :: default-format :: {cyanBright debug} :: Debug message`);

    logger.log('Log message');
    expect(console.log).toHaveBeenLastCalledWith(chalk`2018-02-17 08:30:00 :: default-format :: {green log} :: Log message`);

    logger.info('Info message');
    expect(console.info).toHaveBeenLastCalledWith(chalk`2018-02-17 08:30:00 :: default-format :: {blue info} :: Info message`);

    logger.warn('Warn message');
    expect(console.warn).toHaveBeenLastCalledWith(chalk`2018-02-17 08:30:00 :: default-format :: {yellow warn} :: Warn message`);

    logger.error('Error message');
    expect(console.error).toHaveBeenLastCalledWith(chalk`2018-02-17 08:30:00 :: default-format :: {redBright error} :: Error message`);
  });

  test('custom format', () => {
    const logger = Logger.getLogger('custom-format');
    logger.setLevel('debug');
    logger.setFormat((ctx, variables) => `${ctx.luxon.toFormat('yyyy-LL-dd')} - ${ctx.level} - ${ctx.message}`);

    logger.debug('Debug message');
    expect(console.debug).toHaveBeenLastCalledWith('2018-02-17 - debug - Debug message');

    logger.log('Log message');
    expect(console.log).toHaveBeenLastCalledWith('2018-02-17 - log - Log message');

    logger.info('Info message');
    expect(console.info).toHaveBeenLastCalledWith('2018-02-17 - info - Info message');

    logger.warn('Warn message');
    expect(console.warn).toHaveBeenLastCalledWith('2018-02-17 - warn - Warn message');

    logger.error('Error message');
    expect(console.error).toHaveBeenLastCalledWith('2018-02-17 - error - Error message');
  });

  test('context variables', () => {
    const logger = Logger.getLogger('context-variables');
    logger.setLevel('debug');
    logger.setFormat((ctx) => `name=${ctx.name} level=${ctx.level} message=${ctx.message}`);

    logger.debug('Debug message');
    expect(console.debug).toHaveBeenLastCalledWith('name=context-variables level=debug message=Debug message');

    logger.log('Log message');
    expect(console.log).toHaveBeenLastCalledWith('name=context-variables level=log message=Log message');

    logger.info('Info message');
    expect(console.info).toHaveBeenLastCalledWith('name=context-variables level=info message=Info message');

    logger.warn('Warn message');
    expect(console.warn).toHaveBeenLastCalledWith('name=context-variables level=warn message=Warn message');

    logger.error('Error message');
    expect(console.error).toHaveBeenLastCalledWith('name=context-variables level=error message=Error message');
  });

  test('static user variables', () => {
    const logger = Logger.getLogger('static-user-variables');
    logger.setLevel('debug');

    let count = 0;

    logger.setFormat((ctx, vars) => `message=${ctx.message} :: count=${vars.count} username=${vars.username}`);
    logger.setVariables({
      count,
      username: 'kocal',
    });

    logger.log('Log message');
    expect(console.log).toHaveBeenLastCalledWith('message=Log message :: count=0 username=kocal');
    expect(count).toBe(0);

    count += 1;

    logger.log('Log 2nd message');
    expect(console.log).toHaveBeenLastCalledWith('message=Log 2nd message :: count=0 username=kocal');
    expect(count).toBe(1);
  });

  test('dynamic user variables', () => {
    const logger = Logger.getLogger('dynamic-user-variables');
    logger.setLevel('debug');

    let count = 0;

    logger.setFormat((ctx, vars) => `message=${ctx.message} :: count=${vars.count} username=${vars.username}`);
    logger.setVariables(() => ({
      count,
      username: 'kocal',
    }));

    logger.log('Log message');
    expect(console.log).toHaveBeenLastCalledWith('message=Log message :: count=0 username=kocal');
    expect(count).toBe(0);

    count += 1;

    logger.log('Log 2nd message');
    expect(console.log).toHaveBeenLastCalledWith('message=Log 2nd message :: count=1 username=kocal');
    expect(count).toBe(1);
  });

  test('additional variables should override variables', () => {
    const logger = Logger.getLogger('additional-variables');

    logger.setLevel('log');
    logger.setFormat((ctx, vars) => `message=${ctx.message} :: count=${vars.count}`);
    logger.setVariables({
      count: 0,
    });

    logger.log('Log message');
    expect(console.log).toHaveBeenLastCalledWith('message=Log message :: count=0');

    logger.log('Log message', { count: '9000' });
    expect(console.log).toHaveBeenLastCalledWith('message=Log message :: count=9000');
  });
});

describe('Logger.setLevel()', () => {
  beforeEach(() => {
    console.debug = jest.fn();
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  const logger = Logger.getLogger('set-level');
  logger.setLevel('debug');
  logger.setFormat(ctx => `[${ctx.level}] ${ctx.message}`);

  const logAllLevels = () => [
    'debug',
    'log',
    'info',
    'warn',
    'error',
  ].forEach(level => logger[level]('My message'));

  test('invalid level', () => {
    expect(() => {
      logger.setLevel('foo bar');
    }).toThrow('Level "foo bar" is not a valid level.');
  });

  test('debug', () => {
    logger.setLevel('debug');
    logAllLevels();

    expect(console.debug).toHaveBeenLastCalledWith('[debug] My message');
    expect(console.log).toHaveBeenLastCalledWith('[log] My message');
    expect(console.info).toHaveBeenLastCalledWith('[info] My message');
    expect(console.warn).toHaveBeenLastCalledWith('[warn] My message');
    expect(console.error).toHaveBeenLastCalledWith('[error] My message');
  });

  test('log', () => {
    logger.setLevel('log');
    logAllLevels();

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenLastCalledWith('[log] My message');
    expect(console.info).toHaveBeenLastCalledWith('[info] My message');
    expect(console.warn).toHaveBeenLastCalledWith('[warn] My message');
    expect(console.error).toHaveBeenLastCalledWith('[error] My message');
  });

  test('info', () => {
    logger.setLevel('info');
    logAllLevels();

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenLastCalledWith('[info] My message');
    expect(console.warn).toHaveBeenLastCalledWith('[warn] My message');
    expect(console.error).toHaveBeenLastCalledWith('[error] My message');
  });

  test('warn', () => {
    logger.setLevel('warn');
    logAllLevels();

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenLastCalledWith('[warn] My message');
    expect(console.error).toHaveBeenLastCalledWith('[error] My message');
  });

  test('error', () => {
    logger.setLevel('error');
    logAllLevels();

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenLastCalledWith('[error] My message');
  });
});
