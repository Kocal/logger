const { DateTime } = require('luxon');
const chalk = require('chalk');

const utils = require('./utils');
const loggers = {};

class Logger {

  static get DEBUG() { return 'debug' };
  static get LOG() { return 'log' };
  static get INFO() { return 'info' };
  static get WARN() { return 'warn' };
  static get ERROR() { return 'error' };

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
   * @param {String} level
   */
  setLevel(level) {
    if (!Object.keys(priorities).includes(level)) {
      throw new Error(`Level "${level}" is not a valid level.`);
    }

    this._level = level;
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
    this._handle(Logger.DEBUG, message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  log(message, additionalVariables = {}) {
    this._handle(Logger.LOG, message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  info(message, additionalVariables = {}) {
    this._handle(Logger.INFO, message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  warn(message, additionalVariables = {}) {
    this._handle(Logger.WARN, message, additionalVariables);
  }

  /**
   * @param {String} message
   * @param {Object} [additionalVariables={}]
   */
  error(message, additionalVariables = {}) {
    this._handle(Logger.ERROR, message, additionalVariables);
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
    logger.setLevel(options.level || 'info');

    return logger;
  }

  /**
   * @param {String} level
   * @param {String} [message='']
   * @param {Object|Function} [additionalVariables={}]
   * @private
   */
  _handle(level, message = '', additionalVariables = {}) {
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
