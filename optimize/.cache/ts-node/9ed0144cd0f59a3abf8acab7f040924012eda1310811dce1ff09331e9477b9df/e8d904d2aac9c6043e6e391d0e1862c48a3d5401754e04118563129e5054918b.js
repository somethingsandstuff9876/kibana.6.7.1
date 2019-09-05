"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.metricsSchema = graphql_tag_1.default `
  enum InfraMetric {
    hostSystemOverview
    hostCpuUsage
    hostFilesystem
    hostK8sOverview
    hostK8sCpuCap
    hostK8sDiskCap
    hostK8sMemoryCap
    hostK8sPodCap
    hostLoad
    hostMemoryUsage
    hostNetworkTraffic
    podOverview
    podCpuUsage
    podMemoryUsage
    podLogUsage
    podNetworkTraffic
    containerOverview
    containerCpuKernel
    containerCpuUsage
    containerDiskIOOps
    containerDiskIOBytes
    containerMemory
    containerNetworkTraffic
    nginxHits
    nginxRequestRate
    nginxActiveConnections
    nginxRequestsPerConnection
  }

  type InfraMetricData {
    id: InfraMetric
    series: [InfraDataSeries!]!
  }

  type InfraDataSeries {
    id: ID!
    data: [InfraDataPoint!]!
  }

  type InfraDataPoint {
    timestamp: Float!
    value: Float
  }

  extend type InfraSource {
    metrics(
      nodeId: ID!
      nodeType: InfraNodeType!
      timerange: InfraTimerangeInput!
      metrics: [InfraMetric!]!
    ): [InfraMetricData!]!
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2dyYXBocWwvbWV0cmljcy9zY2hlbWEuZ3FsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvZ3JhcGhxbC9tZXRyaWNzL3NjaGVtYS5ncWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHNFQUE4QjtBQUVqQixRQUFBLGFBQWEsR0FBUSxxQkFBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FzRHBDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJztcblxuZXhwb3J0IGNvbnN0IG1ldHJpY3NTY2hlbWE6IGFueSA9IGdxbGBcbiAgZW51bSBJbmZyYU1ldHJpYyB7XG4gICAgaG9zdFN5c3RlbU92ZXJ2aWV3XG4gICAgaG9zdENwdVVzYWdlXG4gICAgaG9zdEZpbGVzeXN0ZW1cbiAgICBob3N0SzhzT3ZlcnZpZXdcbiAgICBob3N0SzhzQ3B1Q2FwXG4gICAgaG9zdEs4c0Rpc2tDYXBcbiAgICBob3N0SzhzTWVtb3J5Q2FwXG4gICAgaG9zdEs4c1BvZENhcFxuICAgIGhvc3RMb2FkXG4gICAgaG9zdE1lbW9yeVVzYWdlXG4gICAgaG9zdE5ldHdvcmtUcmFmZmljXG4gICAgcG9kT3ZlcnZpZXdcbiAgICBwb2RDcHVVc2FnZVxuICAgIHBvZE1lbW9yeVVzYWdlXG4gICAgcG9kTG9nVXNhZ2VcbiAgICBwb2ROZXR3b3JrVHJhZmZpY1xuICAgIGNvbnRhaW5lck92ZXJ2aWV3XG4gICAgY29udGFpbmVyQ3B1S2VybmVsXG4gICAgY29udGFpbmVyQ3B1VXNhZ2VcbiAgICBjb250YWluZXJEaXNrSU9PcHNcbiAgICBjb250YWluZXJEaXNrSU9CeXRlc1xuICAgIGNvbnRhaW5lck1lbW9yeVxuICAgIGNvbnRhaW5lck5ldHdvcmtUcmFmZmljXG4gICAgbmdpbnhIaXRzXG4gICAgbmdpbnhSZXF1ZXN0UmF0ZVxuICAgIG5naW54QWN0aXZlQ29ubmVjdGlvbnNcbiAgICBuZ2lueFJlcXVlc3RzUGVyQ29ubmVjdGlvblxuICB9XG5cbiAgdHlwZSBJbmZyYU1ldHJpY0RhdGEge1xuICAgIGlkOiBJbmZyYU1ldHJpY1xuICAgIHNlcmllczogW0luZnJhRGF0YVNlcmllcyFdIVxuICB9XG5cbiAgdHlwZSBJbmZyYURhdGFTZXJpZXMge1xuICAgIGlkOiBJRCFcbiAgICBkYXRhOiBbSW5mcmFEYXRhUG9pbnQhXSFcbiAgfVxuXG4gIHR5cGUgSW5mcmFEYXRhUG9pbnQge1xuICAgIHRpbWVzdGFtcDogRmxvYXQhXG4gICAgdmFsdWU6IEZsb2F0XG4gIH1cblxuICBleHRlbmQgdHlwZSBJbmZyYVNvdXJjZSB7XG4gICAgbWV0cmljcyhcbiAgICAgIG5vZGVJZDogSUQhXG4gICAgICBub2RlVHlwZTogSW5mcmFOb2RlVHlwZSFcbiAgICAgIHRpbWVyYW5nZTogSW5mcmFUaW1lcmFuZ2VJbnB1dCFcbiAgICAgIG1ldHJpY3M6IFtJbmZyYU1ldHJpYyFdIVxuICAgICk6IFtJbmZyYU1ldHJpY0RhdGEhXSFcbiAgfVxuYDtcbiJdfQ==