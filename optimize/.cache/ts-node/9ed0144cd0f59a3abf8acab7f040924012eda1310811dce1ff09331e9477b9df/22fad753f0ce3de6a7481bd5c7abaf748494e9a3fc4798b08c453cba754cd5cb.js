"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.nodesSchema = graphql_tag_1.default `
  type InfraNodeMetric {
    name: InfraMetricType!
    value: Float!
    avg: Float!
    max: Float!
  }

  type InfraNodePath {
    value: String!
    label: String!
  }

  type InfraNode {
    path: [InfraNodePath!]!
    metric: InfraNodeMetric!
  }

  input InfraTimerangeInput {
    "The interval string to use for last bucket. The format is '{value}{unit}'. For example '5m' would return the metrics for the last 5 minutes of the timespan."
    interval: String!
    "The end of the timerange"
    to: Float!
    "The beginning of the timerange"
    from: Float!
  }

  enum InfraOperator {
    gt
    gte
    lt
    lte
    eq
  }

  enum InfraMetricType {
    count
    cpu
    load
    memory
    tx
    rx
    logRate
  }

  input InfraMetricInput {
    "The type of metric"
    type: InfraMetricType!
  }

  enum InfraPathType {
    terms
    filters
    hosts
    pods
    containers
    custom
  }

  input InfraPathInput {
    "The type of path"
    type: InfraPathType!
    "The label to use in the results for the group by for the terms group by"
    label: String
    "The field to group by from a terms aggregation, this is ignored by the filter type"
    field: String
    "The fitlers for the filter group by"
    filters: [InfraPathFilterInput!]
  }

  "A group by filter"
  input InfraPathFilterInput {
    "The label for the filter, this will be used as the group name in the final results"
    label: String!
    "The query string query"
    query: String!
  }

  type InfraResponse {
    nodes(path: [InfraPathInput!]!, metric: InfraMetricInput!): [InfraNode!]!
  }

  extend type InfraSource {
    "A hierarchy of hosts, pods, containers, services or arbitrary groups"
    map(timerange: InfraTimerangeInput!, filterQuery: String): InfraResponse
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbm9kZXMvc2NoZW1hLmdxbC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbm9kZXMvc2NoZW1hLmdxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsc0VBQThCO0FBRWpCLFFBQUEsV0FBVyxHQUFRLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0ZsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XG5cbmV4cG9ydCBjb25zdCBub2Rlc1NjaGVtYTogYW55ID0gZ3FsYFxuICB0eXBlIEluZnJhTm9kZU1ldHJpYyB7XG4gICAgbmFtZTogSW5mcmFNZXRyaWNUeXBlIVxuICAgIHZhbHVlOiBGbG9hdCFcbiAgICBhdmc6IEZsb2F0IVxuICAgIG1heDogRmxvYXQhXG4gIH1cblxuICB0eXBlIEluZnJhTm9kZVBhdGgge1xuICAgIHZhbHVlOiBTdHJpbmchXG4gICAgbGFiZWw6IFN0cmluZyFcbiAgfVxuXG4gIHR5cGUgSW5mcmFOb2RlIHtcbiAgICBwYXRoOiBbSW5mcmFOb2RlUGF0aCFdIVxuICAgIG1ldHJpYzogSW5mcmFOb2RlTWV0cmljIVxuICB9XG5cbiAgaW5wdXQgSW5mcmFUaW1lcmFuZ2VJbnB1dCB7XG4gICAgXCJUaGUgaW50ZXJ2YWwgc3RyaW5nIHRvIHVzZSBmb3IgbGFzdCBidWNrZXQuIFRoZSBmb3JtYXQgaXMgJ3t2YWx1ZX17dW5pdH0nLiBGb3IgZXhhbXBsZSAnNW0nIHdvdWxkIHJldHVybiB0aGUgbWV0cmljcyBmb3IgdGhlIGxhc3QgNSBtaW51dGVzIG9mIHRoZSB0aW1lc3Bhbi5cIlxuICAgIGludGVydmFsOiBTdHJpbmchXG4gICAgXCJUaGUgZW5kIG9mIHRoZSB0aW1lcmFuZ2VcIlxuICAgIHRvOiBGbG9hdCFcbiAgICBcIlRoZSBiZWdpbm5pbmcgb2YgdGhlIHRpbWVyYW5nZVwiXG4gICAgZnJvbTogRmxvYXQhXG4gIH1cblxuICBlbnVtIEluZnJhT3BlcmF0b3Ige1xuICAgIGd0XG4gICAgZ3RlXG4gICAgbHRcbiAgICBsdGVcbiAgICBlcVxuICB9XG5cbiAgZW51bSBJbmZyYU1ldHJpY1R5cGUge1xuICAgIGNvdW50XG4gICAgY3B1XG4gICAgbG9hZFxuICAgIG1lbW9yeVxuICAgIHR4XG4gICAgcnhcbiAgICBsb2dSYXRlXG4gIH1cblxuICBpbnB1dCBJbmZyYU1ldHJpY0lucHV0IHtcbiAgICBcIlRoZSB0eXBlIG9mIG1ldHJpY1wiXG4gICAgdHlwZTogSW5mcmFNZXRyaWNUeXBlIVxuICB9XG5cbiAgZW51bSBJbmZyYVBhdGhUeXBlIHtcbiAgICB0ZXJtc1xuICAgIGZpbHRlcnNcbiAgICBob3N0c1xuICAgIHBvZHNcbiAgICBjb250YWluZXJzXG4gICAgY3VzdG9tXG4gIH1cblxuICBpbnB1dCBJbmZyYVBhdGhJbnB1dCB7XG4gICAgXCJUaGUgdHlwZSBvZiBwYXRoXCJcbiAgICB0eXBlOiBJbmZyYVBhdGhUeXBlIVxuICAgIFwiVGhlIGxhYmVsIHRvIHVzZSBpbiB0aGUgcmVzdWx0cyBmb3IgdGhlIGdyb3VwIGJ5IGZvciB0aGUgdGVybXMgZ3JvdXAgYnlcIlxuICAgIGxhYmVsOiBTdHJpbmdcbiAgICBcIlRoZSBmaWVsZCB0byBncm91cCBieSBmcm9tIGEgdGVybXMgYWdncmVnYXRpb24sIHRoaXMgaXMgaWdub3JlZCBieSB0aGUgZmlsdGVyIHR5cGVcIlxuICAgIGZpZWxkOiBTdHJpbmdcbiAgICBcIlRoZSBmaXRsZXJzIGZvciB0aGUgZmlsdGVyIGdyb3VwIGJ5XCJcbiAgICBmaWx0ZXJzOiBbSW5mcmFQYXRoRmlsdGVySW5wdXQhXVxuICB9XG5cbiAgXCJBIGdyb3VwIGJ5IGZpbHRlclwiXG4gIGlucHV0IEluZnJhUGF0aEZpbHRlcklucHV0IHtcbiAgICBcIlRoZSBsYWJlbCBmb3IgdGhlIGZpbHRlciwgdGhpcyB3aWxsIGJlIHVzZWQgYXMgdGhlIGdyb3VwIG5hbWUgaW4gdGhlIGZpbmFsIHJlc3VsdHNcIlxuICAgIGxhYmVsOiBTdHJpbmchXG4gICAgXCJUaGUgcXVlcnkgc3RyaW5nIHF1ZXJ5XCJcbiAgICBxdWVyeTogU3RyaW5nIVxuICB9XG5cbiAgdHlwZSBJbmZyYVJlc3BvbnNlIHtcbiAgICBub2RlcyhwYXRoOiBbSW5mcmFQYXRoSW5wdXQhXSEsIG1ldHJpYzogSW5mcmFNZXRyaWNJbnB1dCEpOiBbSW5mcmFOb2RlIV0hXG4gIH1cblxuICBleHRlbmQgdHlwZSBJbmZyYVNvdXJjZSB7XG4gICAgXCJBIGhpZXJhcmNoeSBvZiBob3N0cywgcG9kcywgY29udGFpbmVycywgc2VydmljZXMgb3IgYXJiaXRyYXJ5IGdyb3Vwc1wiXG4gICAgbWFwKHRpbWVyYW5nZTogSW5mcmFUaW1lcmFuZ2VJbnB1dCEsIGZpbHRlclF1ZXJ5OiBTdHJpbmcpOiBJbmZyYVJlc3BvbnNlXG4gIH1cbmA7XG4iXX0=