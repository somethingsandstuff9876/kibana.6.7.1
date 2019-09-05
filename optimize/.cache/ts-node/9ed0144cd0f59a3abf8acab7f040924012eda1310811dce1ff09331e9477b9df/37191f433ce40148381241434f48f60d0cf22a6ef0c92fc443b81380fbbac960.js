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
const get_all_metrics_chart_data_1 = require("../lib/metrics/get_all_metrics_chart_data");
const defaultErrorHandler = (err) => {
    // tslint:disable-next-line
    console.error(err.stack);
    throw boom_1.default.boomify(err, { statusCode: 400 });
};
function initMetricsApi(server) {
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/metrics/charts`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: async (req) => {
            const setup = setup_request_1.setupRequest(req);
            const { serviceName } = req.params;
            return await get_all_metrics_chart_data_1.getAllMetricsChartData({
                setup,
                serviceName
            }).catch(defaultErrorHandler);
        }
    });
}
exports.initMetricsApi = initMetricsApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9yb3V0ZXMvbWV0cmljcy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9yb3V0ZXMvbWV0cmljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsd0RBQXdCO0FBRXhCLHNFQUF3RTtBQUN4RSxnRUFBNEQ7QUFDNUQsMEZBQW1GO0FBRW5GLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxHQUFVLEVBQUUsRUFBRTtJQUN6QywyQkFBMkI7SUFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsTUFBTSxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FBQztBQUVGLFNBQWdCLGNBQWMsQ0FBQyxNQUFjO0lBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSxnREFBZ0Q7UUFDdEQsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSx3Q0FBcUIsRUFBRTthQUMvQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNuQixNQUFNLEtBQUssR0FBRyw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ25DLE9BQU8sTUFBTSxtREFBc0IsQ0FBQztnQkFDbEMsS0FBSztnQkFDTCxXQUFXO2FBQ1osQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBbEJELHdDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaGFwaSc7XG5pbXBvcnQgeyB3aXRoRGVmYXVsdFZhbGlkYXRvcnMgfSBmcm9tICcuLi9saWIvaGVscGVycy9pbnB1dF92YWxpZGF0aW9uJztcbmltcG9ydCB7IHNldHVwUmVxdWVzdCB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL3NldHVwX3JlcXVlc3QnO1xuaW1wb3J0IHsgZ2V0QWxsTWV0cmljc0NoYXJ0RGF0YSB9IGZyb20gJy4uL2xpYi9tZXRyaWNzL2dldF9hbGxfbWV0cmljc19jaGFydF9kYXRhJztcblxuY29uc3QgZGVmYXVsdEVycm9ySGFuZGxlciA9IChlcnI6IEVycm9yKSA9PiB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gIHRocm93IEJvb20uYm9vbWlmeShlcnIsIHsgc3RhdHVzQ29kZTogNDAwIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRNZXRyaWNzQXBpKHNlcnZlcjogU2VydmVyKSB7XG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBwYXRoOiBgL2FwaS9hcG0vc2VydmljZXMve3NlcnZpY2VOYW1lfS9tZXRyaWNzL2NoYXJ0c2AsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHdpdGhEZWZhdWx0VmFsaWRhdG9ycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyOiBhc3luYyByZXEgPT4ge1xuICAgICAgY29uc3Qgc2V0dXAgPSBzZXR1cFJlcXVlc3QocmVxKTtcbiAgICAgIGNvbnN0IHsgc2VydmljZU5hbWUgfSA9IHJlcS5wYXJhbXM7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0QWxsTWV0cmljc0NoYXJ0RGF0YSh7XG4gICAgICAgIHNldHVwLFxuICAgICAgICBzZXJ2aWNlTmFtZVxuICAgICAgfSkuY2F0Y2goZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==