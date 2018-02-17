# logger

[![Build Status](https://travis-ci.org/Kocal/logger.svg?branch=master)](https://travis-ci.org/Kocal/logger)
[![codecov](https://codecov.io/gh/Kocal/logger/branch/master/graph/badge.svg)](https://codecov.io/gh/Kocal/logger)

> The Node.js logger I have always dreamed of.

## Installation

```
$ yarn add @kocal/logger
```

## Usage

### Basic usage

```js
const Logger = require('@kocal/logger');

// Default logger
const logger = Logger.getLogger();

logger.debug('My message');
// Write `2018-02-17 08:55:28 :: default :: debug :: My message`
logger.log('My message');
// Write `2018-02-17 08:55:28 :: default :: log :: My message`
logger.info('My message');
// Write `2018-02-17 08:55:28 :: default :: info :: My message`
logger.warn('My message');
// Write `2018-02-17 08:55:28 :: default :: warn :: My message`
logger.error('My message');
// Write `2018-02-17 08:55:28 :: default :: error :: My message`

// Named logger
const namedLogger = Logger.getLogger('my-name');

namedLogger.debug('My message');
// Write `2018-02-17 08:55:28 :: my-name :: debug :: My message`
```

### Custom format

The default format is: `yyyy-LL-dd TT :: loggerName :: levelColor(level) :: message`.

You can override the format at any moment by calling `logger.setFormat()`:

```js
const logger = Logger.getLogger();
const format = (context, variables) => {
  return `${context.luxion.toFormat('TT')} :: ${context.message}`
}

logger.setFormat(format);

logger.log('My message');
// Write `08:55:28 :: My message`
```

### Variables

You can specify static or dynamic variables like that:

```js
const logger = Logger.getLogger();

logger.setFormat((context, variables) => {
  return `${context.luxion.toFormat('TT')} :: ${context.message} :: vars = ${JSON.stringify(variables)}`
});

// pass a plain object
logger.setVariables({ count: 9000, foo: 'bar' })
// or a function that will be called at each time you log something
logger.setVariables(() => ({ count: 9000, foo: 'bar' }));


logger.log('My message');
// Write `08:55:28 :: My message :: vars = {"count":9000,"foo":"bar"}`
```

### Additional variables

All logs methods have a 2nd parameters where you can pass additional variables:

```js
// pass a plain object
logger.log('My message', { count: 1234 });
// Write `08:55:28 :: My message :: vars = {"count":1234,"foo":"bar"}`

// or a function
logger.log('My message', () => ({ count: 1234 }));
// Write `08:55:28 :: My message :: vars = {"count":1234,"foo":"bar"}`

```

## API

### `.getLogger( name = 'default', options = {}): Logger`

Returns a singleton.

**Parameters:**
- `name`: A name, 'default' by default
- `options`:
  - `options.format`: check `.setFormat`
  - `options.variables` check `setVariables`

### `.setFormat( (context, variables) => '...' ): void`

Customize log messages format.

**Parameters:**
- `context`:
  - `context.name`: logger's name, 'default' by default
  - `context.level`: 'debug', 'log', 'info', 'warn', or 'error'
  - `context.levelColor`: the color that represents level
  - `context.message`: your message
  - `context.chalk`: an instance of [chalk](https://github.com/chalk/chalk)
  - `context.luxon`: an instance of [luxon](https://github.com/moment/luxon)
- `variables`: a fusion of variables defined with `.setVariables` and additional variables from logging methods

### `.setVariables( variables = {} | Function ): void`

Set your own variables.

**Parameters:**
- `variables`: It can be an object or a function that returns an object.

### `.getVariables(): Object`

Returns variables.

### `.debug( message, additionalVariables = {} | Function ): void`
### `.log( message, additionalVariables = {} | Function ): void`
### `.info( message, additionalVariables = {} | Function ): void`
### `.warn( message, additionalVariables = {} | Function ): void`
### `.error( message, additionalVariables = {} | Function ): void`

Log a message.

**Parameters:**
- `message`: your message 🤷🏻
- `additionalVariables`: variables that will be merged with logger's variables (`.setVariables`)
