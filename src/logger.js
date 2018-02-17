const { DateTime } = require('luxon');
const chalk = require('chalk');

const utils = require('./utils');
const loggers = {};

class Logger {

  /**
   * @param {String} name
   * @param {Object} options
   * @returns {Logger}
   */
  static getLogger(name = 'default', options = {}) {
    if (!(name in loggers)) {
      loggers[name] = Logger._create(name, options);
    }

    return loggers[name];
  }

  /**
   * @param {Function} [format=(ctx, variables) => `...`]
   */
  setFormat(format = (ctx, variables) => `${ctx.luxon.toFormat('yyyy-LL-dd TT')} :: ${ctx.name} :: ${ctx.levelColor(ctx.level)} :: ${ctx.message}`) {
    if (typeof format !== 'function') {
      throw new Error(`Arg « format » should be a function, got « ${typeof format} ».`);
    }

    this._format = format;
  }

  /**
   * @param {Object} [variables={}]
   */
  setVariables(variables = {}) {
    if (typeof variables !== 'function' && typeof variables !== 'object') {
      throw new Error(`Arg « variables » should be a function or an object, got « ${typeof variables } »`);
    }

    this._variables = variables;
  }

  /**
   * @returns {Object}
   */
  getVariables() {
    return this._variables;
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  debug(message, additionalVariables = {}) {
    this._handle('debug', message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  log(message, additionalVariables = {}) {
    this._handle('log', message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  info(message, additionalVariables = {}) {
    this._handle('info', message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  warn(message, additionalVariables = {}) {
    this._handle('warn', message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  error(message, additionalVariables = {}) {
    this._handle('error', message, additionalVariables);
  }

  /**
   * @param {String} name
   * @param {Object} options
   * @returns {Logger}
   * @private
   */
  static _create(name, options) {
    const logger = new Logger;
    logger._name = name;
    logger.setFormat(options.format || undefined);
    logger.setVariables(options.variables || undefined);

    return logger;
  }

  /**
   * @param {String} level
   * @param {String} [message='']
   * @param {Object|Function} [additionalVariables={}]
   * @private
   */
  _handle(level, message = '', additionalVariables = {}) {
    if (!['debug', 'log', 'info', 'warn', 'error'].includes(level)) {
      throw new Error(`Expected a valid level name, got « ${level} ».`);
    }

    const context = this._buildContext(level, message);
    const variables = {
      ...(typeof this._variables === 'function' ? this._variables() : this._variables),
      ...(typeof additionalVariables === 'function' ? additionalVariables() : additionalVariables),
    };

    console[level](this._format(context, variables));
  }

  /**
   * @param {String} level
   * @param {String} message
   * @returns {{level: String, message: String, luxon: DateTime}}
   * @private
   */
  _buildContext(level, message) {
    return {
      level,
      message,
      name: this._name,
      chalk,
      luxon: DateTime.local(),
      levelColor: utils.getChalkColorByLevel(level),
    };
  }
}

module.exports = Logger;
