"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const input_validation_1 = require("../lib/helpers/input_validation");
const setup_request_1 = require("../lib/helpers/setup_request");
const charts_1 = require("../lib/transactions/charts");
const distribution_1 = require("../lib/transactions/distribution");
const get_top_transactions_1 = require("../lib/transactions/get_top_transactions");
const defaultErrorHandler = (err) => {
    // tslint:disable-next-line
    console.error(err.stack);
    throw boom_1.default.boomify(err, { statusCode: 400 });
};
function initTransactionGroupsApi(server) {
    server.route({
        method: 'GET',
        path: '/api/apm/services/{serviceName}/transaction_groups/{transactionType}',
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators({
                    query: joi_1.default.string()
                })
            }
        },
        handler: req => {
            const { serviceName, transactionType } = req.params;
            const setup = setup_request_1.setupRequest(req);
            return get_top_transactions_1.getTopTransactions({
                serviceName,
                transactionType,
                setup
            }).catch(defaultErrorHandler);
        }
    });
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/transaction_groups/{transactionType}/charts`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const setup = setup_request_1.setupRequest(req);
            const { serviceName, transactionType } = req.params;
            return charts_1.getChartsData({
                serviceName,
                transactionType,
                setup
            }).catch(defaultErrorHandler);
        }
    });
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/transaction_groups/charts`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const setup = setup_request_1.setupRequest(req);
            const { serviceName } = req.params;
            return charts_1.getChartsData({
                serviceName,
                setup
            }).catch(defaultErrorHandler);
        }
    });
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/transaction_groups/{transactionType}/{transactionName}/charts`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const setup = setup_request_1.setupRequest(req);
            const { serviceName, transactionType, transactionName } = req.params;
            return charts_1.getChartsData({
                serviceName,
                transactionType,
                transactionName,
                setup
            }).catch(defaultErrorHandler);
        }
    });
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/transaction_groups/{transactionType}/{transactionName}/distribution`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators({
                    transactionId: joi_1.default.string().default(''),
                    traceId: joi_1.default.string().default('')
                })
            }
        },
        handler: req => {
            const setup = setup_request_1.setupRequest(req);
            const { serviceName, transactionType, transactionName } = req.params;
            const { transactionId, traceId } = req.query;
            return distribution_1.getDistribution(serviceName, transactionName, transactionType, transactionId, traceId, setup).catch(defaultErrorHandler);
        }
    });
}
exports.initTransactionGroupsApi = initTransactionGroupsApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9yb3V0ZXMvdHJhbnNhY3Rpb25fZ3JvdXBzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9hcG0vc2VydmVyL3JvdXRlcy90cmFuc2FjdGlvbl9ncm91cHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUV4QixzREFBc0I7QUFDdEIsc0VBQXdFO0FBQ3hFLGdFQUE0RDtBQUM1RCx1REFBMkQ7QUFDM0QsbUVBQW1FO0FBQ25FLG1GQUE4RTtBQUU5RSxNQUFNLG1CQUFtQixHQUFHLENBQUMsR0FBVSxFQUFFLEVBQUU7SUFDekMsMkJBQTJCO0lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMvQyxDQUFDLENBQUM7QUFFRixTQUFnQix3QkFBd0IsQ0FBQyxNQUFjO0lBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFDRixzRUFBc0U7UUFDeEUsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSx3Q0FBcUIsQ0FBQztvQkFDM0IsS0FBSyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7aUJBQ3BCLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ3BELE1BQU0sS0FBSyxHQUFHLDRCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFF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RixPQUFPLDhCQUFlLENBQ3BCLFdBQVcsRUFDWCxlQUFlLEVBQ2YsZUFBZSxFQUNmLGFBQWEsRUFDYixPQUFPLEVBQ1AsS0FBSyxDQUNOLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFoSEQsNERBZ0hDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdoYXBpJztcbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IHdpdGhEZWZhdWx0VmFsaWRhdG9ycyB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2lucHV0X3ZhbGlkYXRpb24nO1xuaW1wb3J0IHsgc2V0dXBSZXF1ZXN0IH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5pbXBvcnQgeyBnZXRDaGFydHNEYXRhIH0gZnJvbSAnLi4vbGliL3RyYW5zYWN0aW9ucy9jaGFydHMnO1xuaW1wb3J0IHsgZ2V0RGlzdHJpYnV0aW9uIH0gZnJvbSAnLi4vbGliL3RyYW5zYWN0aW9ucy9kaXN0cmlidXRpb24nO1xuaW1wb3J0IHsgZ2V0VG9wVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi4vbGliL3RyYW5zYWN0aW9ucy9nZXRfdG9wX3RyYW5zYWN0aW9ucyc7XG5cbmNvbnN0IGRlZmF1bHRFcnJvckhhbmRsZXIgPSAoZXJyOiBFcnJvcikgPT4ge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICB0aHJvdyBCb29tLmJvb21pZnkoZXJyLCB7IHN0YXR1c0NvZGU6IDQwMCB9KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0VHJhbnNhY3Rpb25Hcm91cHNBcGkoc2VydmVyOiBTZXJ2ZXIpIHtcbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHBhdGg6XG4gICAgICAnL2FwaS9hcG0vc2VydmljZXMve3NlcnZpY2VOYW1lfS90cmFuc2FjdGlvbl9ncm91cHMve3RyYW5zYWN0aW9uVHlwZX0nLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHF1ZXJ5OiB3aXRoRGVmYXVsdFZhbGlkYXRvcnMoe1xuICAgICAgICAgIHF1ZXJ5OiBKb2kuc3RyaW5nKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZXI6IHJlcSA9PiB7XG4gICAgICBjb25zdCB7IHNlcnZpY2VOYW1lLCB0cmFuc2FjdGlvblR5cGUgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBzZXR1cCA9IHNldHVwUmVxdWVzdChyZXEpO1xuXG4gICAgICByZXR1cm4gZ2V0VG9wVHJhbnNhY3Rpb25zKHtcbiAgICAgICAgc2VydmljZU5hbWUsXG4gICAgICAgIHRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgc2V0dXBcbiAgICAgIH0pLmNhdGNoKGRlZmF1bHRFcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHBhdGg6IGAvYXBpL2FwbS9zZXJ2aWNlcy97c2VydmljZU5hbWV9L3RyYW5zYWN0aW9uX2dyb3Vwcy97dHJhbnNhY3Rpb25UeXBlfS9jaGFydHNgLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHF1ZXJ5OiB3aXRoRGVmYXVsdFZhbGlkYXRvcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlcjogcmVxID0+IHtcbiAgICAgIGNvbnN0IHNldHVwID0gc2V0dXBSZXF1ZXN0KHJlcSk7XG4gICAgICBjb25zdCB7IHNlcnZpY2VOYW1lLCB0cmFuc2FjdGlvblR5cGUgfSA9IHJlcS5wYXJhbXM7XG5cbiAgICAgIHJldHVybiBnZXRDaGFydHNEYXRhKHtcbiAgICAgICAgc2VydmljZU5hbWUsXG4gICAgICAgIHRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgc2V0dXBcbiAgICAgIH0pLmNhdGNoKGRlZmF1bHRFcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHBhdGg6IGAvYXBpL2FwbS9zZXJ2aWNlcy97c2VydmljZU5hbWV9L3RyYW5zYWN0aW9uX2dyb3Vwcy9jaGFydHNgLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHF1ZXJ5OiB3aXRoRGVmYXVsdFZhbGlkYXRvcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlcjogcmVxID0+IHtcbiAgICAgIGNvbnN0IHNldHVwID0gc2V0dXBSZXF1ZXN0KHJlcSk7XG4gICAgICBjb25zdCB7IHNlcnZpY2VOYW1lIH0gPSByZXEucGFyYW1zO1xuXG4gICAgICByZXR1cm4gZ2V0Q2hhcnRzRGF0YSh7XG4gICAgICAgIHNlcnZpY2VOYW1lLFxuICAgICAgICBzZXR1cFxuICAgICAgfSkuY2F0Y2goZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgfVxuICB9KTtcblxuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogYC9hcGkvYXBtL3NlcnZpY2VzL3tzZXJ2aWNlTmFtZX0vdHJhbnNhY3Rpb25fZ3JvdXBzL3t0cmFuc2FjdGlvblR5cGV9L3t0cmFuc2FjdGlvbk5hbWV9L2NoYXJ0c2AsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHdpdGhEZWZhdWx0VmFsaWRhdG9ycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyOiByZXEgPT4ge1xuICAgICAgY29uc3Qgc2V0dXAgPSBzZXR1cFJlcXVlc3QocmVxKTtcbiAgICAgIGNvbnN0IHsgc2VydmljZU5hbWUsIHRyYW5zYWN0aW9uVHlwZSwgdHJhbnNhY3Rpb25OYW1lIH0gPSByZXEucGFyYW1zO1xuXG4gICAgICByZXR1cm4gZ2V0Q2hhcnRzRGF0YSh7XG4gICAgICAgIHNlcnZpY2VOYW1lLFxuICAgICAgICB0cmFuc2FjdGlvblR5cGUsXG4gICAgICAgIHRyYW5zYWN0aW9uTmFtZSxcbiAgICAgICAgc2V0dXBcbiAgICAgIH0pLmNhdGNoKGRlZmF1bHRFcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHBhdGg6IGAvYXBpL2FwbS9zZXJ2aWNlcy97c2VydmljZU5hbWV9L3RyYW5zYWN0aW9uX2dyb3Vwcy97dHJhbnNhY3Rpb25UeXBlfS97dHJhbnNhY3Rpb25OYW1lfS9kaXN0cmlidXRpb25gLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHF1ZXJ5OiB3aXRoRGVmYXVsdFZhbGlkYXRvcnMoe1xuICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IEpvaS5zdHJpbmcoKS5kZWZhdWx0KCcnKSxcbiAgICAgICAgICB0cmFjZUlkOiBKb2kuc3RyaW5nKCkuZGVmYXVsdCgnJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZXI6IHJlcSA9PiB7XG4gICAgICBjb25zdCBzZXR1cCA9IHNldHVwUmVxdWVzdChyZXEpO1xuICAgICAgY29uc3QgeyBzZXJ2aWNlTmFtZSwgdHJhbnNhY3Rpb25UeXBlLCB0cmFuc2FjdGlvbk5hbWUgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB7IHRyYW5zYWN0aW9uSWQsIHRyYWNlSWQgfSA9IHJlcS5xdWVyeSBhcyB7XG4gICAgICAgIHRyYW5zYWN0aW9uSWQ6IHN0cmluZztcbiAgICAgICAgdHJhY2VJZDogc3RyaW5nO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBnZXREaXN0cmlidXRpb24oXG4gICAgICAgIHNlcnZpY2VOYW1lLFxuICAgICAgICB0cmFuc2FjdGlvbk5hbWUsXG4gICAgICAgIHRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgdHJhbnNhY3Rpb25JZCxcbiAgICAgICAgdHJhY2VJZCxcbiAgICAgICAgc2V0dXBcbiAgICAgICkuY2F0Y2goZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==