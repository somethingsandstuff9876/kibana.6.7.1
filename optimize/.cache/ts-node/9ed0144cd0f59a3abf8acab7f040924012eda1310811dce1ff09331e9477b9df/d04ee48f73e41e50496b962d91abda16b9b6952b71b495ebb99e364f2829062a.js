"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const input_validation_1 = require("../lib/helpers/input_validation");
const setup_request_1 = require("../lib/helpers/setup_request");
const get_top_traces_1 = require("../lib/traces/get_top_traces");
const get_trace_1 = require("../lib/traces/get_trace");
const ROOT = '/api/apm/traces';
const defaultErrorHandler = (err) => {
    // tslint:disable-next-line
    console.error(err.stack);
    throw boom_1.default.boomify(err, { statusCode: 400 });
};
function initTracesApi(server) {
    // Get trace list
    server.route({
        method: 'GET',
        path: ROOT,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const setup = setup_request_1.setupRequest(req);
            return get_top_traces_1.getTopTraces(setup).catch(defaultErrorHandler);
        }
    });
    // Get individual trace
    server.route({
        method: 'GET',
        path: `${ROOT}/{traceId}`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const { traceId } = req.params;
            const setup = setup_request_1.setupRequest(req);
            return get_trace_1.getTrace(traceId, setup).catch(defaultErrorHandler);
        }
    });
}
exports.initTracesApi = initTracesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9yb3V0ZXMvdHJhY2VzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9hcG0vc2VydmVyL3JvdXRlcy90cmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUV4QixzRUFBd0U7QUFDeEUsZ0VBQTREO0FBQzVELGlFQUE0RDtBQUM1RCx1REFBbUQ7QUFFbkQsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUM7QUFDL0IsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEdBQVUsRUFBRSxFQUFFO0lBQ3pDLDJCQUEyQjtJQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixNQUFNLGNBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDO0FBRUYsU0FBZ0IsYUFBYSxDQUFDLE1BQWM7SUFDMUMsaUJBQWlCO0lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSx3Q0FBcUIsRUFBRTthQUMvQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxLQUFLLEdBQUcsNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoQyxPQUFPLDZCQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDeEQsQ0FBQztLQUNGLENBQUMsQ0FBQztJQUVILHVCQUF1QjtJQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ1gsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRyxJQUFJLFlBQVk7UUFDekIsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSx3Q0FBcUIsRUFBRTthQUMvQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDL0IsTUFBTSxLQUFLLEdBQUcsNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxPQUFPLG9CQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzdELENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBaENELHNDQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaGFwaSc7XG5pbXBvcnQgeyB3aXRoRGVmYXVsdFZhbGlkYXRvcnMgfSBmcm9tICcuLi9saWIvaGVscGVycy9pbnB1dF92YWxpZGF0aW9uJztcbmltcG9ydCB7IHNldHVwUmVxdWVzdCB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL3NldHVwX3JlcXVlc3QnO1xuaW1wb3J0IHsgZ2V0VG9wVHJhY2VzIH0gZnJvbSAnLi4vbGliL3RyYWNlcy9nZXRfdG9wX3RyYWNlcyc7XG5pbXBvcnQgeyBnZXRUcmFjZSB9IGZyb20gJy4uL2xpYi90cmFjZXMvZ2V0X3RyYWNlJztcblxuY29uc3QgUk9PVCA9ICcvYXBpL2FwbS90cmFjZXMnO1xuY29uc3QgZGVmYXVsdEVycm9ySGFuZGxlciA9IChlcnI6IEVycm9yKSA9PiB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gIHRocm93IEJvb20uYm9vbWlmeShlcnIsIHsgc3RhdHVzQ29kZTogNDAwIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRUcmFjZXNBcGkoc2VydmVyOiBTZXJ2ZXIpIHtcbiAgLy8gR2V0IHRyYWNlIGxpc3RcbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHBhdGg6IFJPT1QsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHdpdGhEZWZhdWx0VmFsaWRhdG9ycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyOiByZXEgPT4ge1xuICAgICAgY29uc3Qgc2V0dXAgPSBzZXR1cFJlcXVlc3QocmVxKTtcblxuICAgICAgcmV0dXJuIGdldFRvcFRyYWNlcyhzZXR1cCkuY2F0Y2goZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgfVxuICB9KTtcblxuICAvLyBHZXQgaW5kaXZpZHVhbCB0cmFjZVxuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogYCR7Uk9PVH0ve3RyYWNlSWR9YCxcbiAgICBvcHRpb25zOiB7XG4gICAgICB2YWxpZGF0ZToge1xuICAgICAgICBxdWVyeTogd2l0aERlZmF1bHRWYWxpZGF0b3JzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZXI6IHJlcSA9PiB7XG4gICAgICBjb25zdCB7IHRyYWNlSWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBzZXR1cCA9IHNldHVwUmVxdWVzdChyZXEpO1xuICAgICAgcmV0dXJuIGdldFRyYWNlKHRyYWNlSWQsIHNldHVwKS5jYXRjaChkZWZhdWx0RXJyb3JIYW5kbGVyKTtcbiAgICB9XG4gIH0pO1xufVxuIl19