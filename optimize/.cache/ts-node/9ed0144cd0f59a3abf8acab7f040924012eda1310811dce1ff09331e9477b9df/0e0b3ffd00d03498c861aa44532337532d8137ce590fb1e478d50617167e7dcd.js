"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.metadataSchema = graphql_tag_1.default `
  "One metadata entry for a node."
  type InfraNodeMetadata {
    id: ID!
    name: String!
    features: [InfraNodeFeature!]!
  }

  type InfraNodeFeature {
    name: String!
    source: String!
  }

  extend type InfraSource {
    "A hierarchy of metadata entries by node"
    metadataByNode(nodeId: String!, nodeType: InfraNodeType!): InfraNodeMetadata!
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbWV0YWRhdGEvc2NoZW1hLmdxbC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbWV0YWRhdGEvc2NoZW1hLmdxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsc0VBQThCO0FBRWpCLFFBQUEsY0FBYyxHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBaUJoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XG5cbmV4cG9ydCBjb25zdCBtZXRhZGF0YVNjaGVtYSA9IGdxbGBcbiAgXCJPbmUgbWV0YWRhdGEgZW50cnkgZm9yIGEgbm9kZS5cIlxuICB0eXBlIEluZnJhTm9kZU1ldGFkYXRhIHtcbiAgICBpZDogSUQhXG4gICAgbmFtZTogU3RyaW5nIVxuICAgIGZlYXR1cmVzOiBbSW5mcmFOb2RlRmVhdHVyZSFdIVxuICB9XG5cbiAgdHlwZSBJbmZyYU5vZGVGZWF0dXJlIHtcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgc291cmNlOiBTdHJpbmchXG4gIH1cblxuICBleHRlbmQgdHlwZSBJbmZyYVNvdXJjZSB7XG4gICAgXCJBIGhpZXJhcmNoeSBvZiBtZXRhZGF0YSBlbnRyaWVzIGJ5IG5vZGVcIlxuICAgIG1ldGFkYXRhQnlOb2RlKG5vZGVJZDogU3RyaW5nISwgbm9kZVR5cGU6IEluZnJhTm9kZVR5cGUhKTogSW5mcmFOb2RlTWV0YWRhdGEhXG4gIH1cbmA7XG4iXX0=