"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const apm_telemetry_1 = require("../lib/apm_telemetry");
const input_validation_1 = require("../lib/helpers/input_validation");
const setup_request_1 = require("../lib/helpers/setup_request");
const get_service_1 = require("../lib/services/get_service");
const get_services_1 = require("../lib/services/get_services");
const ROOT = '/api/apm/services';
const defaultErrorHandler = (err) => {
    // tslint:disable-next-line
    console.error(err.stack);
    throw boom_1.default.boomify(err, { statusCode: 400 });
};
function initServicesApi(server) {
    server.route({
        method: 'GET',
        path: ROOT,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: async (req) => {
            const setup = setup_request_1.setupRequest(req);
            const services = await get_services_1.getServices(setup).catch(defaultErrorHandler);
            // Store telemetry data derived from services
            const agentNames = services.map(({ agentName }) => agentName);
            const apmTelemetry = apm_telemetry_1.createApmTelementry(agentNames);
            apm_telemetry_1.storeApmTelemetry(server, apmTelemetry);
            return services;
        }
    });
    server.route({
        method: 'GET',
        path: `${ROOT}/{serviceName}`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const setup = setup_request_1.setupRequest(req);
            const { serviceName } = req.params;
            return get_service_1.getService(serviceName, setup).catch(defaultErrorHandler);
        }
    });
}
exports.initServicesApi = initServicesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9yb3V0ZXMvc2VydmljZXMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvcm91dGVzL3NlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFFeEIsd0RBSThCO0FBQzlCLHNFQUF3RTtBQUN4RSxnRUFBNEQ7QUFDNUQsNkRBQXlEO0FBQ3pELCtEQUEyRDtBQUUzRCxNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQztBQUNqQyxNQUFNLG1CQUFtQixHQUFHLENBQUMsR0FBVSxFQUFFLEVBQUU7SUFDekMsMkJBQTJCO0lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMvQyxDQUFDLENBQUM7QUFFRixTQUFnQixlQUFlLENBQUMsTUFBYztJQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ1gsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsSUFBSTtRQUNWLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUsd0NBQXFCLEVBQUU7YUFDL0I7U0FDRjtRQUNELE9BQU8sRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDbkIsTUFBTSxLQUFLLEdBQUcsNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxNQUFNLFFBQVEsR0FBRyxNQUFNLDBCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFFckUsNkNBQTZDO1lBQzdDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQzdCLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsU0FBc0IsQ0FDMUMsQ0FBQztZQUNGLE1BQU0sWUFBWSxHQUFHLG1DQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELGlDQUFpQixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUV4QyxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLEdBQUcsSUFBSSxnQkFBZ0I7UUFDN0IsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSx3Q0FBcUIsRUFBRTthQUMvQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxLQUFLLEdBQUcsNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNuQyxPQUFPLHdCQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBdENELDBDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaGFwaSc7XG5pbXBvcnQge1xuICBBZ2VudE5hbWUsXG4gIGNyZWF0ZUFwbVRlbGVtZW50cnksXG4gIHN0b3JlQXBtVGVsZW1ldHJ5XG59IGZyb20gJy4uL2xpYi9hcG1fdGVsZW1ldHJ5JztcbmltcG9ydCB7IHdpdGhEZWZhdWx0VmFsaWRhdG9ycyB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2lucHV0X3ZhbGlkYXRpb24nO1xuaW1wb3J0IHsgc2V0dXBSZXF1ZXN0IH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5pbXBvcnQgeyBnZXRTZXJ2aWNlIH0gZnJvbSAnLi4vbGliL3NlcnZpY2VzL2dldF9zZXJ2aWNlJztcbmltcG9ydCB7IGdldFNlcnZpY2VzIH0gZnJvbSAnLi4vbGliL3NlcnZpY2VzL2dldF9zZXJ2aWNlcyc7XG5cbmNvbnN0IFJPT1QgPSAnL2FwaS9hcG0vc2VydmljZXMnO1xuY29uc3QgZGVmYXVsdEVycm9ySGFuZGxlciA9IChlcnI6IEVycm9yKSA9PiB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gIHRocm93IEJvb20uYm9vbWlmeShlcnIsIHsgc3RhdHVzQ29kZTogNDAwIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRTZXJ2aWNlc0FwaShzZXJ2ZXI6IFNlcnZlcikge1xuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogUk9PVCxcbiAgICBvcHRpb25zOiB7XG4gICAgICB2YWxpZGF0ZToge1xuICAgICAgICBxdWVyeTogd2l0aERlZmF1bHRWYWxpZGF0b3JzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZXI6IGFzeW5jIHJlcSA9PiB7XG4gICAgICBjb25zdCBzZXR1cCA9IHNldHVwUmVxdWVzdChyZXEpO1xuICAgICAgY29uc3Qgc2VydmljZXMgPSBhd2FpdCBnZXRTZXJ2aWNlcyhzZXR1cCkuY2F0Y2goZGVmYXVsdEVycm9ySGFuZGxlcik7XG5cbiAgICAgIC8vIFN0b3JlIHRlbGVtZXRyeSBkYXRhIGRlcml2ZWQgZnJvbSBzZXJ2aWNlc1xuICAgICAgY29uc3QgYWdlbnROYW1lcyA9IHNlcnZpY2VzLm1hcChcbiAgICAgICAgKHsgYWdlbnROYW1lIH0pID0+IGFnZW50TmFtZSBhcyBBZ2VudE5hbWVcbiAgICAgICk7XG4gICAgICBjb25zdCBhcG1UZWxlbWV0cnkgPSBjcmVhdGVBcG1UZWxlbWVudHJ5KGFnZW50TmFtZXMpO1xuICAgICAgc3RvcmVBcG1UZWxlbWV0cnkoc2VydmVyLCBhcG1UZWxlbWV0cnkpO1xuXG4gICAgICByZXR1cm4gc2VydmljZXM7XG4gICAgfVxuICB9KTtcblxuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogYCR7Uk9PVH0ve3NlcnZpY2VOYW1lfWAsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHdpdGhEZWZhdWx0VmFsaWRhdG9ycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyOiByZXEgPT4ge1xuICAgICAgY29uc3Qgc2V0dXAgPSBzZXR1cFJlcXVlc3QocmVxKTtcbiAgICAgIGNvbnN0IHsgc2VydmljZU5hbWUgfSA9IHJlcS5wYXJhbXM7XG4gICAgICByZXR1cm4gZ2V0U2VydmljZShzZXJ2aWNlTmFtZSwgc2V0dXApLmNhdGNoKGRlZmF1bHRFcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=