'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _concat_stream = require('./concat_stream');

Object.defineProperty(exports, 'createConcatStream', {
  enumerable: true,
  get: function () {
    return _concat_stream.createConcatStream;
  }
});

var _promise_from_streams = require('./promise_from_streams');

Object.defineProperty(exports, 'createPromiseFromStreams', {
  enumerable: true,
  get: function () {
    return _promise_from_streams.createPromiseFromStreams;
  }
});