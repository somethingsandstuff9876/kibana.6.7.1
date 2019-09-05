"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.sourcesSchema = graphql_tag_1.default `
  "A source of infrastructure data"
  type InfraSource {
    "The id of the source"
    id: ID!
    "The version number the source configuration was last persisted with"
    version: String
    "The timestamp the source configuration was last persisted at"
    updatedAt: Float
    "The raw configuration of the source"
    configuration: InfraSourceConfiguration!
    "The status of the source"
    status: InfraSourceStatus!
  }

  "The status of an infrastructure data source"
  type InfraSourceStatus

  "A set of configuration options for an infrastructure data source"
  type InfraSourceConfiguration {
    "The name of the data source"
    name: String!
    "A description of the data source"
    description: String!
    "The alias to read metric data from"
    metricAlias: String!
    "The alias to read log data from"
    logAlias: String!
    "The field mapping to use for this source"
    fields: InfraSourceFields!
  }

  "A mapping of semantic fields to their document counterparts"
  type InfraSourceFields {
    "The field to identify a container by"
    container: String!
    "The fields to identify a host by"
    host: String!
    "The fields to use as the log message"
    message: [String!]!
    "The field to identify a pod by"
    pod: String!
    "The field to use as a tiebreaker for log events that have identical timestamps"
    tiebreaker: String!
    "The field to use as a timestamp for metrics and logs"
    timestamp: String!
  }

  extend type Query {
    """
    Get an infrastructure data source by id.

    The resolution order for the source configuration attributes is as follows
    with the first defined value winning:

    1. The attributes of the saved object with the given 'id'.
    2. The attributes defined in the static Kibana configuration key
       'xpack.infra.sources.default'.
    3. The hard-coded default values.

    As a consequence, querying a source that doesn't exist doesn't error out,
    but returns the configured or hardcoded defaults.
    """
    source("The id of the source" id: ID!): InfraSource!
    "Get a list of all infrastructure data sources"
    allSources: [InfraSource!]!
  }

  "The source to be created"
  input CreateSourceInput {
    "The name of the data source"
    name: String!
    "A description of the data source"
    description: String
    "The alias to read metric data from"
    metricAlias: String
    "The alias to read log data from"
    logAlias: String
    "The field mapping to use for this source"
    fields: CreateSourceFieldsInput
  }

  "The mapping of semantic fields of the source to be created"
  input CreateSourceFieldsInput {
    "The field to identify a container by"
    container: String
    "The fields to identify a host by"
    host: String
    "The field to identify a pod by"
    pod: String
    "The field to use as a tiebreaker for log events that have identical timestamps"
    tiebreaker: String
    "The field to use as a timestamp for metrics and logs"
    timestamp: String
  }

  "The result of a successful source creation"
  type CreateSourceResult {
    "The source that was created"
    source: InfraSource!
  }

  "The update operations to be performed"
  input UpdateSourceInput {
    "The name update operation to be performed"
    setName: UpdateSourceNameInput
    "The description update operation to be performed"
    setDescription: UpdateSourceDescriptionInput
    "The alias update operation to be performed"
    setAliases: UpdateSourceAliasInput
    "The field update operation to be performed"
    setFields: UpdateSourceFieldsInput
  }

  "A name update operation"
  input UpdateSourceNameInput {
    "The new name to be set"
    name: String!
  }

  "A description update operation"
  input UpdateSourceDescriptionInput {
    "The new description to be set"
    description: String!
  }

  "An alias update operation"
  input UpdateSourceAliasInput {
    "The new log index pattern or alias to bet set"
    logAlias: String
    "The new metric index pattern or alias to bet set"
    metricAlias: String
  }

  "A field update operations"
  input UpdateSourceFieldsInput {
    "The new container field to be set"
    container: String
    "The new host field to be set"
    host: String
    "The new pod field to be set"
    pod: String
    "The new tiebreaker field to be set"
    tiebreaker: String
    "The new timestamp field to be set"
    timestamp: String
  }

  "The result of a sequence of source update operations"
  type UpdateSourceResult {
    "The source after the operations were performed"
    source: InfraSource!
  }

  "The result of a source deletion operations"
  type DeleteSourceResult {
    "The id of the source that was deleted"
    id: ID!
  }

  extend type Mutation {
    "Create a new source of infrastructure data"
    createSource("The id of the source" id: ID!, source: CreateSourceInput!): CreateSourceResult!
    "Modify an existing source using the given sequence of update operations"
    updateSource(
      "The id of the source"
      id: ID!
      "A sequence of update operations"
      changes: [UpdateSourceInput!]!
    ): UpdateSourceResult!
    "Delete a source of infrastructure data"
    deleteSource("The id of the source" id: ID!): DeleteSourceResult!
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvc291cmNlcy9zY2hlbWEuZ3FsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvZ3JhcGhxbC9zb3VyY2VzL3NjaGVtYS5ncWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHNFQUE4QjtBQUVqQixRQUFBLGFBQWEsR0FBRyxxQkFBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTZLL0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBncWwgZnJvbSAnZ3JhcGhxbC10YWcnO1xuXG5leHBvcnQgY29uc3Qgc291cmNlc1NjaGVtYSA9IGdxbGBcbiAgXCJBIHNvdXJjZSBvZiBpbmZyYXN0cnVjdHVyZSBkYXRhXCJcbiAgdHlwZSBJbmZyYVNvdXJjZSB7XG4gICAgXCJUaGUgaWQgb2YgdGhlIHNvdXJjZVwiXG4gICAgaWQ6IElEIVxuICAgIFwiVGhlIHZlcnNpb24gbnVtYmVyIHRoZSBzb3VyY2UgY29uZmlndXJhdGlvbiB3YXMgbGFzdCBwZXJzaXN0ZWQgd2l0aFwiXG4gICAgdmVyc2lvbjogU3RyaW5nXG4gICAgXCJUaGUgdGltZXN0YW1wIHRoZSBzb3VyY2UgY29uZmlndXJhdGlvbiB3YXMgbGFzdCBwZXJzaXN0ZWQgYXRcIlxuICAgIHVwZGF0ZWRBdDogRmxvYXRcbiAgICBcIlRoZSByYXcgY29uZmlndXJhdGlvbiBvZiB0aGUgc291cmNlXCJcbiAgICBjb25maWd1cmF0aW9uOiBJbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb24hXG4gICAgXCJUaGUgc3RhdHVzIG9mIHRoZSBzb3VyY2VcIlxuICAgIHN0YXR1czogSW5mcmFTb3VyY2VTdGF0dXMhXG4gIH1cblxuICBcIlRoZSBzdGF0dXMgb2YgYW4gaW5mcmFzdHJ1Y3R1cmUgZGF0YSBzb3VyY2VcIlxuICB0eXBlIEluZnJhU291cmNlU3RhdHVzXG5cbiAgXCJBIHNldCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGFuIGluZnJhc3RydWN0dXJlIGRhdGEgc291cmNlXCJcbiAgdHlwZSBJbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb24ge1xuICAgIFwiVGhlIG5hbWUgb2YgdGhlIGRhdGEgc291cmNlXCJcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgXCJBIGRlc2NyaXB0aW9uIG9mIHRoZSBkYXRhIHNvdXJjZVwiXG4gICAgZGVzY3JpcHRpb246IFN0cmluZyFcbiAgICBcIlRoZSBhbGlhcyB0byByZWFkIG1ldHJpYyBkYXRhIGZyb21cIlxuICAgIG1ldHJpY0FsaWFzOiBTdHJpbmchXG4gICAgXCJUaGUgYWxpYXMgdG8gcmVhZCBsb2cgZGF0YSBmcm9tXCJcbiAgICBsb2dBbGlhczogU3RyaW5nIVxuICAgIFwiVGhlIGZpZWxkIG1hcHBpbmcgdG8gdXNlIGZvciB0aGlzIHNvdXJjZVwiXG4gICAgZmllbGRzOiBJbmZyYVNvdXJjZUZpZWxkcyFcbiAgfVxuXG4gIFwiQSBtYXBwaW5nIG9mIHNlbWFudGljIGZpZWxkcyB0byB0aGVpciBkb2N1bWVudCBjb3VudGVycGFydHNcIlxuICB0eXBlIEluZnJhU291cmNlRmllbGRzIHtcbiAgICBcIlRoZSBmaWVsZCB0byBpZGVudGlmeSBhIGNvbnRhaW5lciBieVwiXG4gICAgY29udGFpbmVyOiBTdHJpbmchXG4gICAgXCJUaGUgZmllbGRzIHRvIGlkZW50aWZ5IGEgaG9zdCBieVwiXG4gICAgaG9zdDogU3RyaW5nIVxuICAgIFwiVGhlIGZpZWxkcyB0byB1c2UgYXMgdGhlIGxvZyBtZXNzYWdlXCJcbiAgICBtZXNzYWdlOiBbU3RyaW5nIV0hXG4gICAgXCJUaGUgZmllbGQgdG8gaWRlbnRpZnkgYSBwb2QgYnlcIlxuICAgIHBvZDogU3RyaW5nIVxuICAgIFwiVGhlIGZpZWxkIHRvIHVzZSBhcyBhIHRpZWJyZWFrZXIgZm9yIGxvZyBldmVudHMgdGhhdCBoYXZlIGlkZW50aWNhbCB0aW1lc3RhbXBzXCJcbiAgICB0aWVicmVha2VyOiBTdHJpbmchXG4gICAgXCJUaGUgZmllbGQgdG8gdXNlIGFzIGEgdGltZXN0YW1wIGZvciBtZXRyaWNzIGFuZCBsb2dzXCJcbiAgICB0aW1lc3RhbXA6IFN0cmluZyFcbiAgfVxuXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICBcIlwiXCJcbiAgICBHZXQgYW4gaW5mcmFzdHJ1Y3R1cmUgZGF0YSBzb3VyY2UgYnkgaWQuXG5cbiAgICBUaGUgcmVzb2x1dGlvbiBvcmRlciBmb3IgdGhlIHNvdXJjZSBjb25maWd1cmF0aW9uIGF0dHJpYnV0ZXMgaXMgYXMgZm9sbG93c1xuICAgIHdpdGggdGhlIGZpcnN0IGRlZmluZWQgdmFsdWUgd2lubmluZzpcblxuICAgIDEuIFRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBzYXZlZCBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gJ2lkJy5cbiAgICAyLiBUaGUgYXR0cmlidXRlcyBkZWZpbmVkIGluIHRoZSBzdGF0aWMgS2liYW5hIGNvbmZpZ3VyYXRpb24ga2V5XG4gICAgICAgJ3hwYWNrLmluZnJhLnNvdXJjZXMuZGVmYXVsdCcuXG4gICAgMy4gVGhlIGhhcmQtY29kZWQgZGVmYXVsdCB2YWx1ZXMuXG5cbiAgICBBcyBhIGNvbnNlcXVlbmNlLCBxdWVyeWluZyBhIHNvdXJjZSB0aGF0IGRvZXNuJ3QgZXhpc3QgZG9lc24ndCBlcnJvciBvdXQsXG4gICAgYnV0IHJldHVybnMgdGhlIGNvbmZpZ3VyZWQgb3IgaGFyZGNvZGVkIGRlZmF1bHRzLlxuICAgIFwiXCJcIlxuICAgIHNvdXJjZShcIlRoZSBpZCBvZiB0aGUgc291cmNlXCIgaWQ6IElEISk6IEluZnJhU291cmNlIVxuICAgIFwiR2V0IGEgbGlzdCBvZiBhbGwgaW5mcmFzdHJ1Y3R1cmUgZGF0YSBzb3VyY2VzXCJcbiAgICBhbGxTb3VyY2VzOiBbSW5mcmFTb3VyY2UhXSFcbiAgfVxuXG4gIFwiVGhlIHNvdXJjZSB0byBiZSBjcmVhdGVkXCJcbiAgaW5wdXQgQ3JlYXRlU291cmNlSW5wdXQge1xuICAgIFwiVGhlIG5hbWUgb2YgdGhlIGRhdGEgc291cmNlXCJcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgXCJBIGRlc2NyaXB0aW9uIG9mIHRoZSBkYXRhIHNvdXJjZVwiXG4gICAgZGVzY3JpcHRpb246IFN0cmluZ1xuICAgIFwiVGhlIGFsaWFzIHRvIHJlYWQgbWV0cmljIGRhdGEgZnJvbVwiXG4gICAgbWV0cmljQWxpYXM6IFN0cmluZ1xuICAgIFwiVGhlIGFsaWFzIHRvIHJlYWQgbG9nIGRhdGEgZnJvbVwiXG4gICAgbG9nQWxpYXM6IFN0cmluZ1xuICAgIFwiVGhlIGZpZWxkIG1hcHBpbmcgdG8gdXNlIGZvciB0aGlzIHNvdXJjZVwiXG4gICAgZmllbGRzOiBDcmVhdGVTb3VyY2VGaWVsZHNJbnB1dFxuICB9XG5cbiAgXCJUaGUgbWFwcGluZyBvZiBzZW1hbnRpYyBmaWVsZHMgb2YgdGhlIHNvdXJjZSB0byBiZSBjcmVhdGVkXCJcbiAgaW5wdXQgQ3JlYXRlU291cmNlRmllbGRzSW5wdXQge1xuICAgIFwiVGhlIGZpZWxkIHRvIGlkZW50aWZ5IGEgY29udGFpbmVyIGJ5XCJcbiAgICBjb250YWluZXI6IFN0cmluZ1xuICAgIFwiVGhlIGZpZWxkcyB0byBpZGVudGlmeSBhIGhvc3QgYnlcIlxuICAgIGhvc3Q6IFN0cmluZ1xuICAgIFwiVGhlIGZpZWxkIHRvIGlkZW50aWZ5IGEgcG9kIGJ5XCJcbiAgICBwb2Q6IFN0cmluZ1xuICAgIFwiVGhlIGZpZWxkIHRvIHVzZSBhcyBhIHRpZWJyZWFrZXIgZm9yIGxvZyBldmVudHMgdGhhdCBoYXZlIGlkZW50aWNhbCB0aW1lc3RhbXBzXCJcbiAgICB0aWVicmVha2VyOiBTdHJpbmdcbiAgICBcIlRoZSBmaWVsZCB0byB1c2UgYXMgYSB0aW1lc3RhbXAgZm9yIG1ldHJpY3MgYW5kIGxvZ3NcIlxuICAgIHRpbWVzdGFtcDogU3RyaW5nXG4gIH1cblxuICBcIlRoZSByZXN1bHQgb2YgYSBzdWNjZXNzZnVsIHNvdXJjZSBjcmVhdGlvblwiXG4gIHR5cGUgQ3JlYXRlU291cmNlUmVzdWx0IHtcbiAgICBcIlRoZSBzb3VyY2UgdGhhdCB3YXMgY3JlYXRlZFwiXG4gICAgc291cmNlOiBJbmZyYVNvdXJjZSFcbiAgfVxuXG4gIFwiVGhlIHVwZGF0ZSBvcGVyYXRpb25zIHRvIGJlIHBlcmZvcm1lZFwiXG4gIGlucHV0IFVwZGF0ZVNvdXJjZUlucHV0IHtcbiAgICBcIlRoZSBuYW1lIHVwZGF0ZSBvcGVyYXRpb24gdG8gYmUgcGVyZm9ybWVkXCJcbiAgICBzZXROYW1lOiBVcGRhdGVTb3VyY2VOYW1lSW5wdXRcbiAgICBcIlRoZSBkZXNjcmlwdGlvbiB1cGRhdGUgb3BlcmF0aW9uIHRvIGJlIHBlcmZvcm1lZFwiXG4gICAgc2V0RGVzY3JpcHRpb246IFVwZGF0ZVNvdXJjZURlc2NyaXB0aW9uSW5wdXRcbiAgICBcIlRoZSBhbGlhcyB1cGRhdGUgb3BlcmF0aW9uIHRvIGJlIHBlcmZvcm1lZFwiXG4gICAgc2V0QWxpYXNlczogVXBkYXRlU291cmNlQWxpYXNJbnB1dFxuICAgIFwiVGhlIGZpZWxkIHVwZGF0ZSBvcGVyYXRpb24gdG8gYmUgcGVyZm9ybWVkXCJcbiAgICBzZXRGaWVsZHM6IFVwZGF0ZVNvdXJjZUZpZWxkc0lucHV0XG4gIH1cblxuICBcIkEgbmFtZSB1cGRhdGUgb3BlcmF0aW9uXCJcbiAgaW5wdXQgVXBkYXRlU291cmNlTmFtZUlucHV0IHtcbiAgICBcIlRoZSBuZXcgbmFtZSB0byBiZSBzZXRcIlxuICAgIG5hbWU6IFN0cmluZyFcbiAgfVxuXG4gIFwiQSBkZXNjcmlwdGlvbiB1cGRhdGUgb3BlcmF0aW9uXCJcbiAgaW5wdXQgVXBkYXRlU291cmNlRGVzY3JpcHRpb25JbnB1dCB7XG4gICAgXCJUaGUgbmV3IGRlc2NyaXB0aW9uIHRvIGJlIHNldFwiXG4gICAgZGVzY3JpcHRpb246IFN0cmluZyFcbiAgfVxuXG4gIFwiQW4gYWxpYXMgdXBkYXRlIG9wZXJhdGlvblwiXG4gIGlucHV0IFVwZGF0ZVNvdXJjZUFsaWFzSW5wdXQge1xuICAgIFwiVGhlIG5ldyBsb2cgaW5kZXggcGF0dGVybiBvciBhbGlhcyB0byBiZXQgc2V0XCJcbiAgICBsb2dBbGlhczogU3RyaW5nXG4gICAgXCJUaGUgbmV3IG1ldHJpYyBpbmRleCBwYXR0ZXJuIG9yIGFsaWFzIHRvIGJldCBzZXRcIlxuICAgIG1ldHJpY0FsaWFzOiBTdHJpbmdcbiAgfVxuXG4gIFwiQSBmaWVsZCB1cGRhdGUgb3BlcmF0aW9uc1wiXG4gIGlucHV0IFVwZGF0ZVNvdXJjZUZpZWxkc0lucHV0IHtcbiAgICBcIlRoZSBuZXcgY29udGFpbmVyIGZpZWxkIHRvIGJlIHNldFwiXG4gICAgY29udGFpbmVyOiBTdHJpbmdcbiAgICBcIlRoZSBuZXcgaG9zdCBmaWVsZCB0byBiZSBzZXRcIlxuICAgIGhvc3Q6IFN0cmluZ1xuICAgIFwiVGhlIG5ldyBwb2QgZmllbGQgdG8gYmUgc2V0XCJcbiAgICBwb2Q6IFN0cmluZ1xuICAgIFwiVGhlIG5ldyB0aWVicmVha2VyIGZpZWxkIHRvIGJlIHNldFwiXG4gICAgdGllYnJlYWtlcjogU3RyaW5nXG4gICAgXCJUaGUgbmV3IHRpbWVzdGFtcCBmaWVsZCB0byBiZSBzZXRcIlxuICAgIHRpbWVzdGFtcDogU3RyaW5nXG4gIH1cblxuICBcIlRoZSByZXN1bHQgb2YgYSBzZXF1ZW5jZSBvZiBzb3VyY2UgdXBkYXRlIG9wZXJhdGlvbnNcIlxuICB0eXBlIFVwZGF0ZVNvdXJjZVJlc3VsdCB7XG4gICAgXCJUaGUgc291cmNlIGFmdGVyIHRoZSBvcGVyYXRpb25zIHdlcmUgcGVyZm9ybWVkXCJcbiAgICBzb3VyY2U6IEluZnJhU291cmNlIVxuICB9XG5cbiAgXCJUaGUgcmVzdWx0IG9mIGEgc291cmNlIGRlbGV0aW9uIG9wZXJhdGlvbnNcIlxuICB0eXBlIERlbGV0ZVNvdXJjZVJlc3VsdCB7XG4gICAgXCJUaGUgaWQgb2YgdGhlIHNvdXJjZSB0aGF0IHdhcyBkZWxldGVkXCJcbiAgICBpZDogSUQhXG4gIH1cblxuICBleHRlbmQgdHlwZSBNdXRhdGlvbiB7XG4gICAgXCJDcmVhdGUgYSBuZXcgc291cmNlIG9mIGluZnJhc3RydWN0dXJlIGRhdGFcIlxuICAgIGNyZWF0ZVNvdXJjZShcIlRoZSBpZCBvZiB0aGUgc291cmNlXCIgaWQ6IElEISwgc291cmNlOiBDcmVhdGVTb3VyY2VJbnB1dCEpOiBDcmVhdGVTb3VyY2VSZXN1bHQhXG4gICAgXCJNb2RpZnkgYW4gZXhpc3Rpbmcgc291cmNlIHVzaW5nIHRoZSBnaXZlbiBzZXF1ZW5jZSBvZiB1cGRhdGUgb3BlcmF0aW9uc1wiXG4gICAgdXBkYXRlU291cmNlKFxuICAgICAgXCJUaGUgaWQgb2YgdGhlIHNvdXJjZVwiXG4gICAgICBpZDogSUQhXG4gICAgICBcIkEgc2VxdWVuY2Ugb2YgdXBkYXRlIG9wZXJhdGlvbnNcIlxuICAgICAgY2hhbmdlczogW1VwZGF0ZVNvdXJjZUlucHV0IV0hXG4gICAgKTogVXBkYXRlU291cmNlUmVzdWx0IVxuICAgIFwiRGVsZXRlIGEgc291cmNlIG9mIGluZnJhc3RydWN0dXJlIGRhdGFcIlxuICAgIGRlbGV0ZVNvdXJjZShcIlRoZSBpZCBvZiB0aGUgc291cmNlXCIgaWQ6IElEISk6IERlbGV0ZVNvdXJjZVJlc3VsdCFcbiAgfVxuYDtcbiJdfQ==