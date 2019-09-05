# history-extra

Extra functionality for the [history](https://github.com/ReactTraining/history) module.

[![Build Status](https://travis-ci.org/w33ble/history-extra.svg?branch=master)](https://travis-ci.org/w33ble/history-extra)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/history-extra/master/LICENSE)
[![Coverage](https://img.shields.io/codecov/c/github/w33ble/history-extra.svg)](https://codecov.io/gh/w33ble/history-extra)
[![npm](https://img.shields.io/npm/v/history-extra.svg)](https://www.npmjs.com/package/history-extra)
[![Project Status](https://img.shields.io/badge/status-stable-brightgreen.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)

## Usage

```
yarn add history history-extra
```

`history` is a peer dependency, and must be installed along side `history-extra`.

## Versions

The major version of `history-extra` should be compatible with the upstream `history` module with the same major version.

So far, it's only been tested with `4.7.0` and newer.

## Methods

### `createHashStateHistory`

```
import { createHashStateHistory } from 'history-extra';
```

Works the same way that [createHashHistory in history](https://github.com/ReactTraining/history/blob/master/README.md#usage) works, except that it supports state.

## Development

### Scripts

There are several scripts available to check and test the code. The CI will run them too, but they're also helpful for running locally. All of these are launched with `npm run <script>` or `yarn run <script>`.

script | description
------ | -----------
lint | Runs linter on the code to catch syntax and other issues.
build | Runs the build, producing the output in `dist`.
test | Runs the tests in a local browser (Chrome and Firefox).

### Environment Variables

There are some ENV args that make things nice for development.

arg | description
--- | -----------
DEV | Boolean, useful for tests. Puts karma in watch mode and will re-run tests every time you save a change.
TRAVIS | Boolean, used by the CI. Also useful for running your tests on Sauce Labs instead of just locally.
KARMA_LAUNCHERS | Useful for controlling which launchers to use, as a comma-separated list. Local options are `Chrome` and `Firefox`. If `TRAVIS` is truthy, options are `SL_Explorer`, `SL_Chrome`, `SL_Firefox`, and `SL_Safari`.

#### Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com)

[![Testing Provided by Sauce Labs](sauce.png)](https://saucelabs.com/)

#### License

MIT © [w33ble](https://github.com/w33ble)
