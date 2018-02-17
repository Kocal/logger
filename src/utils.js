const chalk = require('chalk');

module.exports.getChalkColorByLevel = (level) => {
  switch (level) {
    case 'debug':
      return chalk.cyanBright;
    case 'info':
      return chalk.blue;
    case 'warn':
      return chalk.yellow;
    case 'error':
      return chalk.redBright;
    case 'log':
    default:
      return chalk.green;
  }
};
