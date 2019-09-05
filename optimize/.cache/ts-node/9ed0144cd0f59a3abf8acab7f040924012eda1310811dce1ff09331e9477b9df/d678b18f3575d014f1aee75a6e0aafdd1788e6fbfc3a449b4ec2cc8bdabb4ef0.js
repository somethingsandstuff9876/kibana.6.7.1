"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerCpuKernel = (timeField, indexPattern, interval) => ({
    id: 'containerCpuKernel',
    requires: ['docker.cpu'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'kernel',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.cpu.kernel.pct',
                    id: 'avg-cpu-kernel',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX2NwdV9rZXJuZWwudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvY29udGFpbmVyL2NvbnRhaW5lcl9jcHVfa2VybmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLGtCQUFrQixHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2pHLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ3hCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxRQUFRO1lBQ1osVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx1QkFBdUI7b0JBQzlCLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgY29udGFpbmVyQ3B1S2VybmVsOiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnY29udGFpbmVyQ3B1S2VybmVsJyxcbiAgcmVxdWlyZXM6IFsnZG9ja2VyLmNwdSddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdrZXJuZWwnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdkb2NrZXIuY3B1Lmtlcm5lbC5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS1rZXJuZWwnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19