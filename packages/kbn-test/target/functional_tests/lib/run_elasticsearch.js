"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runElasticsearch = runElasticsearch;

var _path = require("path");

var _paths = require("./paths");

var _es = require("../../es");

var _auth = require("./auth");

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
async function runElasticsearch({
  config,
  options
}) {
  const {
    log,
    esFrom
  } = options;
  const license = config.get('esTestCluster.license');
  const isTrialLicense = config.get('esTestCluster.license') === 'trial';
  const cluster = (0, _es.createEsTestCluster)({
    port: config.get('servers.elasticsearch.port'),
    password: isTrialLicense ? _auth.DEFAULT_SUPERUSER_PASS : config.get('servers.elasticsearch.password'),
    license,
    log,
    basePath: (0, _path.resolve)(_paths.KIBANA_ROOT, '.es'),
    esFrom: esFrom || config.get('esTestCluster.from'),
    dataArchive: config.get('esTestCluster.dataArchive')
  });
  const esArgs = config.get('esTestCluster.serverArgs');
  await cluster.start(esArgs);

  if (isTrialLicense) {
    await (0, _auth.setupUsers)(log, config.get('servers.elasticsearch.port'), [config.get('servers.elasticsearch'), config.get('servers.kibana')]);
  }

  return cluster;
}