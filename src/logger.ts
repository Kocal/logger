import { DateTime } from 'luxon';
import chalk, { Chalk } from 'chalk';
import { Level, levels } from './levels';

type Format = (ctx, variables: Variables) => string;

type VariablesObj = { [k: string]: any }
type Variables = VariablesObj | (() => VariablesObj);

interface Context {
  level: string;
  message: string;
  name: string;
  chalk: Chalk;
  levelColor: Chalk;
  luxon: DateTime;
}

interface Options {
  format?: Format;
  variables?: Variables;
  level?: string;
}

const loggers: { [k: string]: Logger } = {};

const defaultFormat = (ctx: Context, variables: Variables) => {
  return `${ctx.luxon.toFormat('yyyy-LL-dd TT')} :: ${ctx.name} :: ${ctx.levelColor(ctx.level)} :: ${ctx.message}`;
};

export class Logger {
  public readonly name: string;
  public level: 'error' | 'warn' | 'info' | 'log' | 'debug' = Level.INFO;
  public format: Format = defaultFormat;
  public variables: Variables = {};

  public constructor(name, options) {
    this.name = name;
    this.format = options.format || this.format;
    this.variables = options.variables || this.variables;
    this.level = options.level || this.level;
  }

  public static getLogger(name = 'default', options: Options = {}): Logger {
    if (!(name in loggers)) {
      loggers[name] = new Logger(name, options);
    }

    return loggers[name];
  }

  public error(message: string, additionalVariables = {}) {
    this.handle(Level.ERROR, message, additionalVariables);
  }

  public warn(message: string, additionalVariables = {}) {
    this.handle(Level.WARN, message, additionalVariables);
  }

  public info(message: string, additionalVariables = {}) {
    this.handle(Level.INFO, message, additionalVariables);
  }

  public log(message: string, additionalVariables = {}) {
    this.handle(Level.LOG, message, additionalVariables);
  }

  public debug(message: string, additionalVariables = {}) {
    this.handle(Level.DEBUG, message, additionalVariables);
  }

  private handle(level: Level, message = '', additionalVariables: Variables = {}) {
    if (levels[level].priority > levels[this.level].priority) {
      return;
    }

    const context = this.buildContext(level, message);
    const variables = {
      // @ts-ignore
      ...(typeof this.variables === 'function' ? this.variables() : this.variables),
      // @ts-ignore
      ...(typeof additionalVariables === 'function' ? additionalVariables() : additionalVariables),
    };

    console[level](this.format(context, variables));
  }

  private buildContext(level: Level, message: string): Context {
    return {
      level,
      message,
      chalk,
      name: this.name,
      luxon: DateTime.local(),
      levelColor: levels[level].color,
    };
  }

  // Prevent breaking changes, but should be removed

  public setLevel(level) {
    if (!Object.keys(levels).includes(level)) {
      throw new Error(`Level "${level}" is not a valid level.`);
    }

    this.level = level;
  }

  public setFormat(format) {
    this.format = format;
  }

  public setVariables(variables) {
    this.variables = variables;
  }
}
