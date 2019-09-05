"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../adapter_types");
const FIELDS = {
    [adapter_types_1.InfraNodeType.host]: 'system.cpu.user.pct',
    [adapter_types_1.InfraNodeType.pod]: 'kubernetes.pod.cpu.usage.node.pct',
    [adapter_types_1.InfraNodeType.container]: 'docker.cpu.total.pct',
};
exports.cpu = (nodeType) => {
    if (nodeType === adapter_types_1.InfraNodeType.host) {
        return {
            cpu_user: {
                avg: {
                    field: 'system.cpu.user.pct',
                },
            },
            cpu_system: {
                avg: {
                    field: 'system.cpu.system.pct',
                },
            },
            cpu_cores: {
                max: {
                    field: 'system.cpu.cores',
                },
            },
            cpu: {
                bucket_script: {
                    buckets_path: {
                        user: 'cpu_user',
                        system: 'cpu_system',
                        cores: 'cpu_cores',
                    },
                    script: {
                        source: '(params.user + params.system) / params.cores',
                        lang: 'painless',
                    },
                    gap_policy: 'skip',
                },
            },
        };
    }
    const field = FIELDS[nodeType];
    return {
        cpu: {
            avg: {
                field,
            },
        },
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9tZXRyaWNfYWdncmVnYXRpb25fY3JlYXRvcnMvY3B1LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL25vZGVzL21ldHJpY19hZ2dyZWdhdGlvbl9jcmVhdG9ycy9jcHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsb0RBQW9FO0FBRXBFLE1BQU0sTUFBTSxHQUFHO0lBQ2IsQ0FBQyw2QkFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLHFCQUFxQjtJQUMzQyxDQUFDLDZCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsbUNBQW1DO0lBQ3hELENBQUMsNkJBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxzQkFBc0I7Q0FDbEQsQ0FBQztBQUVXLFFBQUEsR0FBRyxHQUFzQixDQUFDLFFBQXVCLEVBQUUsRUFBRTtJQUNoRSxJQUFJLFFBQVEsS0FBSyw2QkFBYSxDQUFDLElBQUksRUFBRTtRQUNuQyxPQUFPO1lBQ0wsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRTtvQkFDSCxLQUFLLEVBQUUscUJBQXFCO2lCQUM3QjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRTtvQkFDSCxLQUFLLEVBQUUsdUJBQXVCO2lCQUMvQjthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULEdBQUcsRUFBRTtvQkFDSCxLQUFLLEVBQUUsa0JBQWtCO2lCQUMxQjthQUNGO1lBQ0QsR0FBRyxFQUFFO2dCQUNILGFBQWEsRUFBRTtvQkFDYixZQUFZLEVBQUU7d0JBQ1osSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLE1BQU0sRUFBRSxZQUFZO3dCQUNwQixLQUFLLEVBQUUsV0FBVztxQkFDbkI7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLE1BQU0sRUFBRSw4Q0FBOEM7d0JBQ3RELElBQUksRUFBRSxVQUFVO3FCQUNqQjtvQkFDRCxVQUFVLEVBQUUsTUFBTTtpQkFDbkI7YUFDRjtTQUNGLENBQUM7S0FDSDtJQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQixPQUFPO1FBQ0wsR0FBRyxFQUFFO1lBQ0gsR0FBRyxFQUFFO2dCQUNILEtBQUs7YUFDTjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTm9kZU1ldHJpY0ZuLCBJbmZyYU5vZGVUeXBlIH0gZnJvbSAnLi4vYWRhcHRlcl90eXBlcyc7XG5cbmNvbnN0IEZJRUxEUyA9IHtcbiAgW0luZnJhTm9kZVR5cGUuaG9zdF06ICdzeXN0ZW0uY3B1LnVzZXIucGN0JyxcbiAgW0luZnJhTm9kZVR5cGUucG9kXTogJ2t1YmVybmV0ZXMucG9kLmNwdS51c2FnZS5ub2RlLnBjdCcsXG4gIFtJbmZyYU5vZGVUeXBlLmNvbnRhaW5lcl06ICdkb2NrZXIuY3B1LnRvdGFsLnBjdCcsXG59O1xuXG5leHBvcnQgY29uc3QgY3B1OiBJbmZyYU5vZGVNZXRyaWNGbiA9IChub2RlVHlwZTogSW5mcmFOb2RlVHlwZSkgPT4ge1xuICBpZiAobm9kZVR5cGUgPT09IEluZnJhTm9kZVR5cGUuaG9zdCkge1xuICAgIHJldHVybiB7XG4gICAgICBjcHVfdXNlcjoge1xuICAgICAgICBhdmc6IHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUudXNlci5wY3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNwdV9zeXN0ZW06IHtcbiAgICAgICAgYXZnOiB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LnN5c3RlbS5wY3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNwdV9jb3Jlczoge1xuICAgICAgICBtYXg6IHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUuY29yZXMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNwdToge1xuICAgICAgICBidWNrZXRfc2NyaXB0OiB7XG4gICAgICAgICAgYnVja2V0c19wYXRoOiB7XG4gICAgICAgICAgICB1c2VyOiAnY3B1X3VzZXInLFxuICAgICAgICAgICAgc3lzdGVtOiAnY3B1X3N5c3RlbScsXG4gICAgICAgICAgICBjb3JlczogJ2NwdV9jb3JlcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzY3JpcHQ6IHtcbiAgICAgICAgICAgIHNvdXJjZTogJyhwYXJhbXMudXNlciArIHBhcmFtcy5zeXN0ZW0pIC8gcGFyYW1zLmNvcmVzJyxcbiAgICAgICAgICAgIGxhbmc6ICdwYWlubGVzcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYXBfcG9saWN5OiAnc2tpcCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjb25zdCBmaWVsZCA9IEZJRUxEU1tub2RlVHlwZV07XG4gIHJldHVybiB7XG4gICAgY3B1OiB7XG4gICAgICBhdmc6IHtcbiAgICAgICAgZmllbGQsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59O1xuIl19