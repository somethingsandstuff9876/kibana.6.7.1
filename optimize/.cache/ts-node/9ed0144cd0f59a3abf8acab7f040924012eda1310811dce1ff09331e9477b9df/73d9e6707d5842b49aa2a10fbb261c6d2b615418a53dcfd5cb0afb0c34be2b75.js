"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.sourceStatusSchema = graphql_tag_1.default `
  "A descriptor of a field in an index"
  type InfraIndexField {
    "The name of the field"
    name: String!
    "The type of the field's values as recognized by Kibana"
    type: String!
    "Whether the field's values can be efficiently searched for"
    searchable: Boolean!
    "Whether the field's values can be aggregated"
    aggregatable: Boolean!
  }

  extend type InfraSourceStatus {
    "Whether the configured metric alias exists"
    metricAliasExists: Boolean!
    "Whether the configured log alias exists"
    logAliasExists: Boolean!
    "Whether the configured alias or wildcard pattern resolve to any metric indices"
    metricIndicesExist: Boolean!
    "Whether the configured alias or wildcard pattern resolve to any log indices"
    logIndicesExist: Boolean!
    "The list of indices in the metric alias"
    metricIndices: [String!]!
    "The list of indices in the log alias"
    logIndices: [String!]!
    "The list of fields defined in the index mappings"
    indexFields(indexType: InfraIndexType = ANY): [InfraIndexField!]!
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvc291cmNlX3N0YXR1cy9zY2hlbWEuZ3FsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvZ3JhcGhxbC9zb3VyY2Vfc3RhdHVzL3NjaGVtYS5ncWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHNFQUE4QjtBQUVqQixRQUFBLGtCQUFrQixHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBNkJwQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XG5cbmV4cG9ydCBjb25zdCBzb3VyY2VTdGF0dXNTY2hlbWEgPSBncWxgXG4gIFwiQSBkZXNjcmlwdG9yIG9mIGEgZmllbGQgaW4gYW4gaW5kZXhcIlxuICB0eXBlIEluZnJhSW5kZXhGaWVsZCB7XG4gICAgXCJUaGUgbmFtZSBvZiB0aGUgZmllbGRcIlxuICAgIG5hbWU6IFN0cmluZyFcbiAgICBcIlRoZSB0eXBlIG9mIHRoZSBmaWVsZCdzIHZhbHVlcyBhcyByZWNvZ25pemVkIGJ5IEtpYmFuYVwiXG4gICAgdHlwZTogU3RyaW5nIVxuICAgIFwiV2hldGhlciB0aGUgZmllbGQncyB2YWx1ZXMgY2FuIGJlIGVmZmljaWVudGx5IHNlYXJjaGVkIGZvclwiXG4gICAgc2VhcmNoYWJsZTogQm9vbGVhbiFcbiAgICBcIldoZXRoZXIgdGhlIGZpZWxkJ3MgdmFsdWVzIGNhbiBiZSBhZ2dyZWdhdGVkXCJcbiAgICBhZ2dyZWdhdGFibGU6IEJvb2xlYW4hXG4gIH1cblxuICBleHRlbmQgdHlwZSBJbmZyYVNvdXJjZVN0YXR1cyB7XG4gICAgXCJXaGV0aGVyIHRoZSBjb25maWd1cmVkIG1ldHJpYyBhbGlhcyBleGlzdHNcIlxuICAgIG1ldHJpY0FsaWFzRXhpc3RzOiBCb29sZWFuIVxuICAgIFwiV2hldGhlciB0aGUgY29uZmlndXJlZCBsb2cgYWxpYXMgZXhpc3RzXCJcbiAgICBsb2dBbGlhc0V4aXN0czogQm9vbGVhbiFcbiAgICBcIldoZXRoZXIgdGhlIGNvbmZpZ3VyZWQgYWxpYXMgb3Igd2lsZGNhcmQgcGF0dGVybiByZXNvbHZlIHRvIGFueSBtZXRyaWMgaW5kaWNlc1wiXG4gICAgbWV0cmljSW5kaWNlc0V4aXN0OiBCb29sZWFuIVxuICAgIFwiV2hldGhlciB0aGUgY29uZmlndXJlZCBhbGlhcyBvciB3aWxkY2FyZCBwYXR0ZXJuIHJlc29sdmUgdG8gYW55IGxvZyBpbmRpY2VzXCJcbiAgICBsb2dJbmRpY2VzRXhpc3Q6IEJvb2xlYW4hXG4gICAgXCJUaGUgbGlzdCBvZiBpbmRpY2VzIGluIHRoZSBtZXRyaWMgYWxpYXNcIlxuICAgIG1ldHJpY0luZGljZXM6IFtTdHJpbmchXSFcbiAgICBcIlRoZSBsaXN0IG9mIGluZGljZXMgaW4gdGhlIGxvZyBhbGlhc1wiXG4gICAgbG9nSW5kaWNlczogW1N0cmluZyFdIVxuICAgIFwiVGhlIGxpc3Qgb2YgZmllbGRzIGRlZmluZWQgaW4gdGhlIGluZGV4IG1hcHBpbmdzXCJcbiAgICBpbmRleEZpZWxkcyhpbmRleFR5cGU6IEluZnJhSW5kZXhUeXBlID0gQU5ZKTogW0luZnJhSW5kZXhGaWVsZCFdIVxuICB9XG5gO1xuIl19