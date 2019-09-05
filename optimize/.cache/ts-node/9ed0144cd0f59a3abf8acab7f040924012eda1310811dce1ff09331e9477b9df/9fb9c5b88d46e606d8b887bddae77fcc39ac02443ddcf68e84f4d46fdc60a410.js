"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerMemory = (timeField, indexPattern, interval) => ({
    id: 'containerMemory',
    requires: ['docker.memory'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'memory',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.memory.usage.pct',
                    id: 'avg-memory',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX21lbW9yeS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX21lbW9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSxlQUFlLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUYsRUFBRSxFQUFFLGlCQUFpQjtJQUNyQixRQUFRLEVBQUUsQ0FBQyxlQUFlLENBQUM7SUFDM0IsYUFBYSxFQUFFLFlBQVk7SUFDM0IsUUFBUTtJQUNSLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLFFBQVE7WUFDWixVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLHlCQUF5QjtvQkFDaEMsRUFBRSxFQUFFLFlBQVk7b0JBQ2hCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgY29udGFpbmVyTWVtb3J5OiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnY29udGFpbmVyTWVtb3J5JyxcbiAgcmVxdWlyZXM6IFsnZG9ja2VyLm1lbW9yeSddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdtZW1vcnknLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdkb2NrZXIubWVtb3J5LnVzYWdlLnBjdCcsXG4gICAgICAgICAgaWQ6ICdhdmctbWVtb3J5JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==