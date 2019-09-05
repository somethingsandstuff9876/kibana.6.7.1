"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.monitorsSchema = graphql_tag_1.default `
  type FilterBar {
    id: [String!]
    port: [Int!]
    status: [String!]
    type: [String!]
  }

  type HistogramDataPoint {
    upCount: Int
    downCount: Int
    x: UnsignedInteger
    x0: UnsignedInteger
    y: UnsignedInteger
  }

  type Snapshot {
    up: Int
    down: Int
    total: Int
    histogram: [HistogramDataPoint!]!
  }

  type DataPoint {
    x: UnsignedInteger
    y: Float
  }

  type StatusData {
    x: UnsignedInteger
    up: Int
    down: Int
    total: Int
  }

  type MonitorChartEntry {
    maxContent: DataPoint
    maxResponse: DataPoint
    maxValidate: DataPoint
    maxTotal: DataPoint
    maxWriteRequest: DataPoint
    maxTcpRtt: DataPoint
    maxDuration: DataPoint
    minDuration: DataPoint
    avgDuration: DataPoint
    status: StatusData
  }

  type MonitorKey {
    id: String
    port: Int
  }

  type MonitorSeriesPoint {
    x: UnsignedInteger
    y: Int
  }

  type LatestMonitor {
    key: MonitorKey
    ping: Ping
    upSeries: [MonitorSeriesPoint]
    downSeries: [MonitorSeriesPoint]
  }

  type LatestMonitorsResult {
    monitors: [LatestMonitor!]
  }

  type ErrorListItem {
    latestMessage: String
    monitorId: String
    type: String!
    monitorType: String
    count: Int
    statusCode: String
    timestamp: String
  }

  extend type Query {
    getMonitors(
      dateRangeStart: String!
      dateRangeEnd: String!
      filters: String
    ): LatestMonitorsResult

    getSnapshot(dateRangeStart: String!, dateRangeEnd: String!, filters: String): Snapshot

    getMonitorChartsData(
      monitorId: String!
      dateRangeStart: String!
      dateRangeEnd: String!
    ): [MonitorChartEntry]

    getLatestMonitors(dateRangeStart: String!, dateRangeEnd: String!, monitorId: String): [Ping!]!

    getFilterBar(dateRangeStart: String!, dateRangeEnd: String!): FilterBar

    getErrorsList(dateRangeStart: String!, dateRangeEnd: String!, filters: String): [ErrorListItem!]
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9ncmFwaHFsL21vbml0b3JzL3NjaGVtYS5ncWwudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwdGltZS9zZXJ2ZXIvZ3JhcGhxbC9tb25pdG9ycy9zY2hlbWEuZ3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzRUFBOEI7QUFFakIsUUFBQSxjQUFjLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQW9HaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBncWwgZnJvbSAnZ3JhcGhxbC10YWcnO1xuXG5leHBvcnQgY29uc3QgbW9uaXRvcnNTY2hlbWEgPSBncWxgXG4gIHR5cGUgRmlsdGVyQmFyIHtcbiAgICBpZDogW1N0cmluZyFdXG4gICAgcG9ydDogW0ludCFdXG4gICAgc3RhdHVzOiBbU3RyaW5nIV1cbiAgICB0eXBlOiBbU3RyaW5nIV1cbiAgfVxuXG4gIHR5cGUgSGlzdG9ncmFtRGF0YVBvaW50IHtcbiAgICB1cENvdW50OiBJbnRcbiAgICBkb3duQ291bnQ6IEludFxuICAgIHg6IFVuc2lnbmVkSW50ZWdlclxuICAgIHgwOiBVbnNpZ25lZEludGVnZXJcbiAgICB5OiBVbnNpZ25lZEludGVnZXJcbiAgfVxuXG4gIHR5cGUgU25hcHNob3Qge1xuICAgIHVwOiBJbnRcbiAgICBkb3duOiBJbnRcbiAgICB0b3RhbDogSW50XG4gICAgaGlzdG9ncmFtOiBbSGlzdG9ncmFtRGF0YVBvaW50IV0hXG4gIH1cblxuICB0eXBlIERhdGFQb2ludCB7XG4gICAgeDogVW5zaWduZWRJbnRlZ2VyXG4gICAgeTogRmxvYXRcbiAgfVxuXG4gIHR5cGUgU3RhdHVzRGF0YSB7XG4gICAgeDogVW5zaWduZWRJbnRlZ2VyXG4gICAgdXA6IEludFxuICAgIGRvd246IEludFxuICAgIHRvdGFsOiBJbnRcbiAgfVxuXG4gIHR5cGUgTW9uaXRvckNoYXJ0RW50cnkge1xuICAgIG1heENvbnRlbnQ6IERhdGFQb2ludFxuICAgIG1heFJlc3BvbnNlOiBEYXRhUG9pbnRcbiAgICBtYXhWYWxpZGF0ZTogRGF0YVBvaW50XG4gICAgbWF4VG90YWw6IERhdGFQb2ludFxuICAgIG1heFdyaXRlUmVxdWVzdDogRGF0YVBvaW50XG4gICAgbWF4VGNwUnR0OiBEYXRhUG9pbnRcbiAgICBtYXhEdXJhdGlvbjogRGF0YVBvaW50XG4gICAgbWluRHVyYXRpb246IERhdGFQb2ludFxuICAgIGF2Z0R1cmF0aW9uOiBEYXRhUG9pbnRcbiAgICBzdGF0dXM6IFN0YXR1c0RhdGFcbiAgfVxuXG4gIHR5cGUgTW9uaXRvcktleSB7XG4gICAgaWQ6IFN0cmluZ1xuICAgIHBvcnQ6IEludFxuICB9XG5cbiAgdHlwZSBNb25pdG9yU2VyaWVzUG9pbnQge1xuICAgIHg6IFVuc2lnbmVkSW50ZWdlclxuICAgIHk6IEludFxuICB9XG5cbiAgdHlwZSBMYXRlc3RNb25pdG9yIHtcbiAgICBrZXk6IE1vbml0b3JLZXlcbiAgICBwaW5nOiBQaW5nXG4gICAgdXBTZXJpZXM6IFtNb25pdG9yU2VyaWVzUG9pbnRdXG4gICAgZG93blNlcmllczogW01vbml0b3JTZXJpZXNQb2ludF1cbiAgfVxuXG4gIHR5cGUgTGF0ZXN0TW9uaXRvcnNSZXN1bHQge1xuICAgIG1vbml0b3JzOiBbTGF0ZXN0TW9uaXRvciFdXG4gIH1cblxuICB0eXBlIEVycm9yTGlzdEl0ZW0ge1xuICAgIGxhdGVzdE1lc3NhZ2U6IFN0cmluZ1xuICAgIG1vbml0b3JJZDogU3RyaW5nXG4gICAgdHlwZTogU3RyaW5nIVxuICAgIG1vbml0b3JUeXBlOiBTdHJpbmdcbiAgICBjb3VudDogSW50XG4gICAgc3RhdHVzQ29kZTogU3RyaW5nXG4gICAgdGltZXN0YW1wOiBTdHJpbmdcbiAgfVxuXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICBnZXRNb25pdG9ycyhcbiAgICAgIGRhdGVSYW5nZVN0YXJ0OiBTdHJpbmchXG4gICAgICBkYXRlUmFuZ2VFbmQ6IFN0cmluZyFcbiAgICAgIGZpbHRlcnM6IFN0cmluZ1xuICAgICk6IExhdGVzdE1vbml0b3JzUmVzdWx0XG5cbiAgICBnZXRTbmFwc2hvdChkYXRlUmFuZ2VTdGFydDogU3RyaW5nISwgZGF0ZVJhbmdlRW5kOiBTdHJpbmchLCBmaWx0ZXJzOiBTdHJpbmcpOiBTbmFwc2hvdFxuXG4gICAgZ2V0TW9uaXRvckNoYXJ0c0RhdGEoXG4gICAgICBtb25pdG9ySWQ6IFN0cmluZyFcbiAgICAgIGRhdGVSYW5nZVN0YXJ0OiBTdHJpbmchXG4gICAgICBkYXRlUmFuZ2VFbmQ6IFN0cmluZyFcbiAgICApOiBbTW9uaXRvckNoYXJ0RW50cnldXG5cbiAgICBnZXRMYXRlc3RNb25pdG9ycyhkYXRlUmFuZ2VTdGFydDogU3RyaW5nISwgZGF0ZVJhbmdlRW5kOiBTdHJpbmchLCBtb25pdG9ySWQ6IFN0cmluZyk6IFtQaW5nIV0hXG5cbiAgICBnZXRGaWx0ZXJCYXIoZGF0ZVJhbmdlU3RhcnQ6IFN0cmluZyEsIGRhdGVSYW5nZUVuZDogU3RyaW5nISk6IEZpbHRlckJhclxuXG4gICAgZ2V0RXJyb3JzTGlzdChkYXRlUmFuZ2VTdGFydDogU3RyaW5nISwgZGF0ZVJhbmdlRW5kOiBTdHJpbmchLCBmaWx0ZXJzOiBTdHJpbmcpOiBbRXJyb3JMaXN0SXRlbSFdXG4gIH1cbmA7XG4iXX0=