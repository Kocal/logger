import chalk from 'chalk';

export enum Level {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  LOG = 'log',
  DEBUG = 'debug',
}

export const levels = {
  [Level.ERROR]: { priority: 0, color: chalk.redBright },
  [Level.WARN]: { priority: 1, color: chalk.yellow },
  [Level.INFO]: { priority: 2, color: chalk.blue },
  [Level.LOG]: { priority: 3, color: chalk.green },
  [Level.DEBUG]: { priority: 4, color: chalk.cyanBright },
};
