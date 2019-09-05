"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.logEntriesSchema = graphql_tag_1.default `
  "A segment of the log entry message that was derived from a field"
  type InfraLogMessageFieldSegment {
    "The field the segment was derived from"
    field: String!
    "The segment's message"
    value: String!
    "A list of highlighted substrings of the value"
    highlights: [String!]!
  }

  "A segment of the log entry message that was derived from a field"
  type InfraLogMessageConstantSegment {
    "The segment's message"
    constant: String!
  }

  "A segment of the log entry message"
  union InfraLogMessageSegment = InfraLogMessageFieldSegment | InfraLogMessageConstantSegment

  "A log entry"
  type InfraLogEntry {
    "A unique representation of the log entry's position in the event stream"
    key: InfraTimeKey!
    "The log entry's id"
    gid: String!
    "The source id"
    source: String!
    "A list of the formatted log entry segments"
    message: [InfraLogMessageSegment!]!
  }

  "A log summary bucket"
  type InfraLogSummaryBucket {
    "The start timestamp of the bucket"
    start: Float!
    "The end timestamp of the bucket"
    end: Float!
    "The number of entries inside the bucket"
    entriesCount: Int!
  }

  "A consecutive sequence of log entries"
  type InfraLogEntryInterval {
    "The key corresponding to the start of the interval covered by the entries"
    start: InfraTimeKey
    "The key corresponding to the end of the interval covered by the entries"
    end: InfraTimeKey
    "Whether there are more log entries available before the start"
    hasMoreBefore: Boolean!
    "Whether there are more log entries available after the end"
    hasMoreAfter: Boolean!
    "The query the log entries were filtered by"
    filterQuery: String
    "The query the log entries were highlighted with"
    highlightQuery: String
    "A list of the log entries"
    entries: [InfraLogEntry!]!
  }

  "A consecutive sequence of log summary buckets"
  type InfraLogSummaryInterval {
    "The millisecond timestamp corresponding to the start of the interval covered by the summary"
    start: Float
    "The millisecond timestamp corresponding to the end of the interval covered by the summary"
    end: Float
    "The query the log entries were filtered by"
    filterQuery: String
    "A list of the log entries"
    buckets: [InfraLogSummaryBucket!]!
  }

  type InfraLogItemField {
    "The flattened field name"
    field: String!
    "The value for the Field as a string"
    value: String!
  }

  type InfraLogItem {
    "The ID of the document"
    id: ID!
    "The index where the document was found"
    index: String!
    "An array of flattened fields and values"
    fields: [InfraLogItemField!]!
  }

  extend type InfraSource {
    "A consecutive span of log entries surrounding a point in time"
    logEntriesAround(
      "The sort key that corresponds to the point in time"
      key: InfraTimeKeyInput!
      "The maximum number of preceding to return"
      countBefore: Int = 0
      "The maximum number of following to return"
      countAfter: Int = 0
      "The query to filter the log entries by"
      filterQuery: String
      "The query to highlight the log entries with"
      highlightQuery: String
    ): InfraLogEntryInterval!
    "A consecutive span of log entries within an interval"
    logEntriesBetween(
      "The sort key that corresponds to the start of the interval"
      startKey: InfraTimeKeyInput!
      "The sort key that corresponds to the end of the interval"
      endKey: InfraTimeKeyInput!
      "The query to filter the log entries by"
      filterQuery: String
      "The query to highlight the log entries with"
      highlightQuery: String
    ): InfraLogEntryInterval!
    "A consecutive span of summary buckets within an interval"
    logSummaryBetween(
      "The millisecond timestamp that corresponds to the start of the interval"
      start: Float!
      "The millisecond timestamp that corresponds to the end of the interval"
      end: Float!
      "The size of each bucket in milliseconds"
      bucketSize: Float!
      "The query to filter the log entries by"
      filterQuery: String
    ): InfraLogSummaryInterval!
    logItem(id: ID!): InfraLogItem!
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbG9nX2VudHJpZXMvc2NoZW1hLmdxbC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbG9nX2VudHJpZXMvc2NoZW1hLmdxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsc0VBQThCO0FBRWpCLFFBQUEsZ0JBQWdCLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBOEhsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XG5cbmV4cG9ydCBjb25zdCBsb2dFbnRyaWVzU2NoZW1hID0gZ3FsYFxuICBcIkEgc2VnbWVudCBvZiB0aGUgbG9nIGVudHJ5IG1lc3NhZ2UgdGhhdCB3YXMgZGVyaXZlZCBmcm9tIGEgZmllbGRcIlxuICB0eXBlIEluZnJhTG9nTWVzc2FnZUZpZWxkU2VnbWVudCB7XG4gICAgXCJUaGUgZmllbGQgdGhlIHNlZ21lbnQgd2FzIGRlcml2ZWQgZnJvbVwiXG4gICAgZmllbGQ6IFN0cmluZyFcbiAgICBcIlRoZSBzZWdtZW50J3MgbWVzc2FnZVwiXG4gICAgdmFsdWU6IFN0cmluZyFcbiAgICBcIkEgbGlzdCBvZiBoaWdobGlnaHRlZCBzdWJzdHJpbmdzIG9mIHRoZSB2YWx1ZVwiXG4gICAgaGlnaGxpZ2h0czogW1N0cmluZyFdIVxuICB9XG5cbiAgXCJBIHNlZ21lbnQgb2YgdGhlIGxvZyBlbnRyeSBtZXNzYWdlIHRoYXQgd2FzIGRlcml2ZWQgZnJvbSBhIGZpZWxkXCJcbiAgdHlwZSBJbmZyYUxvZ01lc3NhZ2VDb25zdGFudFNlZ21lbnQge1xuICAgIFwiVGhlIHNlZ21lbnQncyBtZXNzYWdlXCJcbiAgICBjb25zdGFudDogU3RyaW5nIVxuICB9XG5cbiAgXCJBIHNlZ21lbnQgb2YgdGhlIGxvZyBlbnRyeSBtZXNzYWdlXCJcbiAgdW5pb24gSW5mcmFMb2dNZXNzYWdlU2VnbWVudCA9IEluZnJhTG9nTWVzc2FnZUZpZWxkU2VnbWVudCB8IEluZnJhTG9nTWVzc2FnZUNvbnN0YW50U2VnbWVudFxuXG4gIFwiQSBsb2cgZW50cnlcIlxuICB0eXBlIEluZnJhTG9nRW50cnkge1xuICAgIFwiQSB1bmlxdWUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGxvZyBlbnRyeSdzIHBvc2l0aW9uIGluIHRoZSBldmVudCBzdHJlYW1cIlxuICAgIGtleTogSW5mcmFUaW1lS2V5IVxuICAgIFwiVGhlIGxvZyBlbnRyeSdzIGlkXCJcbiAgICBnaWQ6IFN0cmluZyFcbiAgICBcIlRoZSBzb3VyY2UgaWRcIlxuICAgIHNvdXJjZTogU3RyaW5nIVxuICAgIFwiQSBsaXN0IG9mIHRoZSBmb3JtYXR0ZWQgbG9nIGVudHJ5IHNlZ21lbnRzXCJcbiAgICBtZXNzYWdlOiBbSW5mcmFMb2dNZXNzYWdlU2VnbWVudCFdIVxuICB9XG5cbiAgXCJBIGxvZyBzdW1tYXJ5IGJ1Y2tldFwiXG4gIHR5cGUgSW5mcmFMb2dTdW1tYXJ5QnVja2V0IHtcbiAgICBcIlRoZSBzdGFydCB0aW1lc3RhbXAgb2YgdGhlIGJ1Y2tldFwiXG4gICAgc3RhcnQ6IEZsb2F0IVxuICAgIFwiVGhlIGVuZCB0aW1lc3RhbXAgb2YgdGhlIGJ1Y2tldFwiXG4gICAgZW5kOiBGbG9hdCFcbiAgICBcIlRoZSBudW1iZXIgb2YgZW50cmllcyBpbnNpZGUgdGhlIGJ1Y2tldFwiXG4gICAgZW50cmllc0NvdW50OiBJbnQhXG4gIH1cblxuICBcIkEgY29uc2VjdXRpdmUgc2VxdWVuY2Ugb2YgbG9nIGVudHJpZXNcIlxuICB0eXBlIEluZnJhTG9nRW50cnlJbnRlcnZhbCB7XG4gICAgXCJUaGUga2V5IGNvcnJlc3BvbmRpbmcgdG8gdGhlIHN0YXJ0IG9mIHRoZSBpbnRlcnZhbCBjb3ZlcmVkIGJ5IHRoZSBlbnRyaWVzXCJcbiAgICBzdGFydDogSW5mcmFUaW1lS2V5XG4gICAgXCJUaGUga2V5IGNvcnJlc3BvbmRpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW50ZXJ2YWwgY292ZXJlZCBieSB0aGUgZW50cmllc1wiXG4gICAgZW5kOiBJbmZyYVRpbWVLZXlcbiAgICBcIldoZXRoZXIgdGhlcmUgYXJlIG1vcmUgbG9nIGVudHJpZXMgYXZhaWxhYmxlIGJlZm9yZSB0aGUgc3RhcnRcIlxuICAgIGhhc01vcmVCZWZvcmU6IEJvb2xlYW4hXG4gICAgXCJXaGV0aGVyIHRoZXJlIGFyZSBtb3JlIGxvZyBlbnRyaWVzIGF2YWlsYWJsZSBhZnRlciB0aGUgZW5kXCJcbiAgICBoYXNNb3JlQWZ0ZXI6IEJvb2xlYW4hXG4gICAgXCJUaGUgcXVlcnkgdGhlIGxvZyBlbnRyaWVzIHdlcmUgZmlsdGVyZWQgYnlcIlxuICAgIGZpbHRlclF1ZXJ5OiBTdHJpbmdcbiAgICBcIlRoZSBxdWVyeSB0aGUgbG9nIGVudHJpZXMgd2VyZSBoaWdobGlnaHRlZCB3aXRoXCJcbiAgICBoaWdobGlnaHRRdWVyeTogU3RyaW5nXG4gICAgXCJBIGxpc3Qgb2YgdGhlIGxvZyBlbnRyaWVzXCJcbiAgICBlbnRyaWVzOiBbSW5mcmFMb2dFbnRyeSFdIVxuICB9XG5cbiAgXCJBIGNvbnNlY3V0aXZlIHNlcXVlbmNlIG9mIGxvZyBzdW1tYXJ5IGJ1Y2tldHNcIlxuICB0eXBlIEluZnJhTG9nU3VtbWFyeUludGVydmFsIHtcbiAgICBcIlRoZSBtaWxsaXNlY29uZCB0aW1lc3RhbXAgY29ycmVzcG9uZGluZyB0byB0aGUgc3RhcnQgb2YgdGhlIGludGVydmFsIGNvdmVyZWQgYnkgdGhlIHN1bW1hcnlcIlxuICAgIHN0YXJ0OiBGbG9hdFxuICAgIFwiVGhlIG1pbGxpc2Vjb25kIHRpbWVzdGFtcCBjb3JyZXNwb25kaW5nIHRvIHRoZSBlbmQgb2YgdGhlIGludGVydmFsIGNvdmVyZWQgYnkgdGhlIHN1bW1hcnlcIlxuICAgIGVuZDogRmxvYXRcbiAgICBcIlRoZSBxdWVyeSB0aGUgbG9nIGVudHJpZXMgd2VyZSBmaWx0ZXJlZCBieVwiXG4gICAgZmlsdGVyUXVlcnk6IFN0cmluZ1xuICAgIFwiQSBsaXN0IG9mIHRoZSBsb2cgZW50cmllc1wiXG4gICAgYnVja2V0czogW0luZnJhTG9nU3VtbWFyeUJ1Y2tldCFdIVxuICB9XG5cbiAgdHlwZSBJbmZyYUxvZ0l0ZW1GaWVsZCB7XG4gICAgXCJUaGUgZmxhdHRlbmVkIGZpZWxkIG5hbWVcIlxuICAgIGZpZWxkOiBTdHJpbmchXG4gICAgXCJUaGUgdmFsdWUgZm9yIHRoZSBGaWVsZCBhcyBhIHN0cmluZ1wiXG4gICAgdmFsdWU6IFN0cmluZyFcbiAgfVxuXG4gIHR5cGUgSW5mcmFMb2dJdGVtIHtcbiAgICBcIlRoZSBJRCBvZiB0aGUgZG9jdW1lbnRcIlxuICAgIGlkOiBJRCFcbiAgICBcIlRoZSBpbmRleCB3aGVyZSB0aGUgZG9jdW1lbnQgd2FzIGZvdW5kXCJcbiAgICBpbmRleDogU3RyaW5nIVxuICAgIFwiQW4gYXJyYXkgb2YgZmxhdHRlbmVkIGZpZWxkcyBhbmQgdmFsdWVzXCJcbiAgICBmaWVsZHM6IFtJbmZyYUxvZ0l0ZW1GaWVsZCFdIVxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgSW5mcmFTb3VyY2Uge1xuICAgIFwiQSBjb25zZWN1dGl2ZSBzcGFuIG9mIGxvZyBlbnRyaWVzIHN1cnJvdW5kaW5nIGEgcG9pbnQgaW4gdGltZVwiXG4gICAgbG9nRW50cmllc0Fyb3VuZChcbiAgICAgIFwiVGhlIHNvcnQga2V5IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIHBvaW50IGluIHRpbWVcIlxuICAgICAga2V5OiBJbmZyYVRpbWVLZXlJbnB1dCFcbiAgICAgIFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHByZWNlZGluZyB0byByZXR1cm5cIlxuICAgICAgY291bnRCZWZvcmU6IEludCA9IDBcbiAgICAgIFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIGZvbGxvd2luZyB0byByZXR1cm5cIlxuICAgICAgY291bnRBZnRlcjogSW50ID0gMFxuICAgICAgXCJUaGUgcXVlcnkgdG8gZmlsdGVyIHRoZSBsb2cgZW50cmllcyBieVwiXG4gICAgICBmaWx0ZXJRdWVyeTogU3RyaW5nXG4gICAgICBcIlRoZSBxdWVyeSB0byBoaWdobGlnaHQgdGhlIGxvZyBlbnRyaWVzIHdpdGhcIlxuICAgICAgaGlnaGxpZ2h0UXVlcnk6IFN0cmluZ1xuICAgICk6IEluZnJhTG9nRW50cnlJbnRlcnZhbCFcbiAgICBcIkEgY29uc2VjdXRpdmUgc3BhbiBvZiBsb2cgZW50cmllcyB3aXRoaW4gYW4gaW50ZXJ2YWxcIlxuICAgIGxvZ0VudHJpZXNCZXR3ZWVuKFxuICAgICAgXCJUaGUgc29ydCBrZXkgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgc3RhcnQgb2YgdGhlIGludGVydmFsXCJcbiAgICAgIHN0YXJ0S2V5OiBJbmZyYVRpbWVLZXlJbnB1dCFcbiAgICAgIFwiVGhlIHNvcnQga2V5IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGVuZCBvZiB0aGUgaW50ZXJ2YWxcIlxuICAgICAgZW5kS2V5OiBJbmZyYVRpbWVLZXlJbnB1dCFcbiAgICAgIFwiVGhlIHF1ZXJ5IHRvIGZpbHRlciB0aGUgbG9nIGVudHJpZXMgYnlcIlxuICAgICAgZmlsdGVyUXVlcnk6IFN0cmluZ1xuICAgICAgXCJUaGUgcXVlcnkgdG8gaGlnaGxpZ2h0IHRoZSBsb2cgZW50cmllcyB3aXRoXCJcbiAgICAgIGhpZ2hsaWdodFF1ZXJ5OiBTdHJpbmdcbiAgICApOiBJbmZyYUxvZ0VudHJ5SW50ZXJ2YWwhXG4gICAgXCJBIGNvbnNlY3V0aXZlIHNwYW4gb2Ygc3VtbWFyeSBidWNrZXRzIHdpdGhpbiBhbiBpbnRlcnZhbFwiXG4gICAgbG9nU3VtbWFyeUJldHdlZW4oXG4gICAgICBcIlRoZSBtaWxsaXNlY29uZCB0aW1lc3RhbXAgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgc3RhcnQgb2YgdGhlIGludGVydmFsXCJcbiAgICAgIHN0YXJ0OiBGbG9hdCFcbiAgICAgIFwiVGhlIG1pbGxpc2Vjb25kIHRpbWVzdGFtcCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBlbmQgb2YgdGhlIGludGVydmFsXCJcbiAgICAgIGVuZDogRmxvYXQhXG4gICAgICBcIlRoZSBzaXplIG9mIGVhY2ggYnVja2V0IGluIG1pbGxpc2Vjb25kc1wiXG4gICAgICBidWNrZXRTaXplOiBGbG9hdCFcbiAgICAgIFwiVGhlIHF1ZXJ5IHRvIGZpbHRlciB0aGUgbG9nIGVudHJpZXMgYnlcIlxuICAgICAgZmlsdGVyUXVlcnk6IFN0cmluZ1xuICAgICk6IEluZnJhTG9nU3VtbWFyeUludGVydmFsIVxuICAgIGxvZ0l0ZW0oaWQ6IElEISk6IEluZnJhTG9nSXRlbSFcbiAgfVxuYDtcbiJdfQ==