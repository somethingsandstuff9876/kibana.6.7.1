"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSourceConfiguration = {
    name: 'Default',
    description: '',
    metricAlias: 'metricbeat-*',
    logAlias: 'filebeat-*,kibana_sample_data_logs*',
    fields: {
        container: 'docker.container.id',
        host: 'host.name',
        message: ['message', '@message'],
        pod: 'kubernetes.pod.uid',
        tiebreaker: '_doc',
        timestamp: '@timestamp',
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9zb3VyY2VzL2RlZmF1bHRzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL3NvdXJjZXMvZGVmYXVsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRVUsUUFBQSwwQkFBMEIsR0FBRztJQUN4QyxJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFBRSxFQUFFO0lBQ2YsV0FBVyxFQUFFLGNBQWM7SUFDM0IsUUFBUSxFQUFFLHFDQUFxQztJQUMvQyxNQUFNLEVBQUU7UUFDTixTQUFTLEVBQUUscUJBQXFCO1FBQ2hDLElBQUksRUFBRSxXQUFXO1FBQ2pCLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7UUFDaEMsR0FBRyxFQUFFLG9CQUFvQjtRQUN6QixVQUFVLEVBQUUsTUFBTTtRQUNsQixTQUFTLEVBQUUsWUFBWTtLQUN4QjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdFNvdXJjZUNvbmZpZ3VyYXRpb24gPSB7XG4gIG5hbWU6ICdEZWZhdWx0JyxcbiAgZGVzY3JpcHRpb246ICcnLFxuICBtZXRyaWNBbGlhczogJ21ldHJpY2JlYXQtKicsXG4gIGxvZ0FsaWFzOiAnZmlsZWJlYXQtKixraWJhbmFfc2FtcGxlX2RhdGFfbG9ncyonLFxuICBmaWVsZHM6IHtcbiAgICBjb250YWluZXI6ICdkb2NrZXIuY29udGFpbmVyLmlkJyxcbiAgICBob3N0OiAnaG9zdC5uYW1lJyxcbiAgICBtZXNzYWdlOiBbJ21lc3NhZ2UnLCAnQG1lc3NhZ2UnXSxcbiAgICBwb2Q6ICdrdWJlcm5ldGVzLnBvZC51aWQnLFxuICAgIHRpZWJyZWFrZXI6ICdfZG9jJyxcbiAgICB0aW1lc3RhbXA6ICdAdGltZXN0YW1wJyxcbiAgfSxcbn07XG4iXX0=