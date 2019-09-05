"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayHelp = displayHelp;
exports.processOptions = processOptions;

var _path = require("path");

var _dedent = _interopRequireDefault(require("dedent"));

var _devUtils = require("@kbn/dev-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const options = {
  help: {
    desc: 'Display this menu and exit.'
  },
  config: {
    arg: '<file>',
    desc: 'Pass in a config'
  },
  esFrom: {
    arg: '<snapshot|source|path>',
    desc: 'Build Elasticsearch from source, snapshot or path to existing install dir.',
    defaultHelp: 'Default: $TEST_ES_FROM or snapshot'
  },
  'kibana-install-dir': {
    arg: '<dir>',
    desc: 'Run Kibana from existing install directory instead of from source.'
  },
  verbose: {
    desc: 'Log everything.'
  },
  debug: {
    desc: 'Run in debug mode.'
  },
  quiet: {
    desc: 'Only log errors.'
  },
  silent: {
    desc: 'Log nothing.'
  }
};

function displayHelp() {
  const helpOptions = Object.keys(options).filter(name => name !== '_').map(name => {
    const option = options[name];
    return _objectSpread({}, option, {
      usage: `${name} ${option.arg || ''}`,
      default: option.defaultHelp || ''
    });
  }).map(option => {
    return `--${option.usage.padEnd(30)} ${option.desc} ${option.default}`;
  }).join(`\n      `);
  return (0, _dedent.default)(`
    Start Functional Test Servers

    Usage:
      node scripts/functional_tests_server --help
      node scripts/functional_tests_server [--config <file>]
      node scripts/functional_tests_server [options] [-- --<other args>]

    Options:
      ${helpOptions}
    `);
}

function processOptions(userOptions, defaultConfigPath) {
  validateOptions(userOptions);
  const config = userOptions.config || defaultConfigPath;

  if (!config) {
    throw new Error(`functional_tests_server: config is required`);
  }

  if (!userOptions.esFrom) {
    userOptions.esFrom = process.env.TEST_ES_FROM || 'snapshot';
  }

  if (userOptions['kibana-install-dir']) {
    userOptions.installDir = userOptions['kibana-install-dir'];
    delete userOptions['kibana-install-dir'];
  }

  function createLogger() {
    return new _devUtils.ToolingLog({
      level: (0, _devUtils.pickLevelFromFlags)(userOptions),
      writeTo: process.stdout
    });
  }

  return _objectSpread({}, userOptions, {
    config: (0, _path.resolve)(config),
    createLogger,
    extraKbnOpts: userOptions._
  });
}

function validateOptions(userOptions) {
  Object.entries(userOptions).forEach(([key, val]) => {
    if (key === '_') return; // Validate flags passed

    if (options[key] === undefined) {
      throw new Error(`functional_tests_server: invalid option [${key}]`);
    }

    if ( // Validate boolean flags
    !options[key].arg && typeof val !== 'boolean' || // Validate string/array flags
    options[key].arg && typeof val !== 'string' && !Array.isArray(val) || // Validate enum flags
    options[key].choices && !options[key].choices.includes(val)) {
      throw new Error(`functional_tests_server: invalid argument [${val}] to option [${key}]`);
    }
  });
}