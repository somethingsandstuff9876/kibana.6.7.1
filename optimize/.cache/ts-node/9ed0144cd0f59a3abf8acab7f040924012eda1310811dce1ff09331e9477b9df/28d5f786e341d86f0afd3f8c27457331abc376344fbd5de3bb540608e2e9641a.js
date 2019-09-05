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
const get_transaction_1 = require("../lib/transactions/get_transaction");
const get_spans_1 = require("../lib/transactions/spans/get_spans");
function initTransactionsApi(server) {
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/transactions/{transactionId}`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators({
                    traceId: joi_1.default.string().allow('') // TODO: this should be a path param and made required by 7.0
                })
            }
        },
        handler: async (req) => {
            const { transactionId } = req.params;
            const { traceId } = req.query;
            const setup = setup_request_1.setupRequest(req);
            const transaction = await get_transaction_1.getTransaction(transactionId, traceId, setup);
            if (transaction) {
                return transaction;
            }
            else {
                throw boom_1.default.notFound('Cannot find the requested page');
            }
        }
    });
    // TODO: this can be removed by 7.0 when v1 compatability can be dropped
    server.route({
        method: 'GET',
        path: `/api/apm/services/{serviceName}/transactions/{transactionId}/spans`,
        options: {
            validate: {
                query: input_validation_1.withDefaultValidators()
            }
        },
        handler: req => {
            const { transactionId } = req.params;
            const setup = setup_request_1.setupRequest(req);
            return get_spans_1.getSpans(transactionId, setup);
        }
    });
}
exports.initTransactionsApi = initTransactionsApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9yb3V0ZXMvdHJhbnNhY3Rpb25zLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9hcG0vc2VydmVyL3JvdXRlcy90cmFuc2FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUV4QixzREFBc0I7QUFDdEIsc0VBQXdFO0FBQ3hFLGdFQUE0RDtBQUM1RCx5RUFBcUU7QUFDckUsbUVBQStEO0FBRS9ELFNBQWdCLG1CQUFtQixDQUFDLE1BQWM7SUFDaEQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLDhEQUE4RDtRQUNwRSxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFLHdDQUFxQixDQUFDO29CQUMzQixPQUFPLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyw2REFBNkQ7aUJBQzlGLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNuQixNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNyQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQTRCLENBQUM7WUFDckQsTUFBTSxLQUFLLEdBQUcsNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLGdDQUFjLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4RSxJQUFJLFdBQVcsRUFBRTtnQkFDZixPQUFPLFdBQVcsQ0FBQzthQUNwQjtpQkFBTTtnQkFDTCxNQUFNLGNBQUksQ0FBQyxRQUFRLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzthQUN2RDtRQUNILENBQUM7S0FDRixDQUFDLENBQUM7SUFFSCx3RUFBd0U7SUFDeEUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLG9FQUFvRTtRQUMxRSxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFLHdDQUFxQixFQUFFO2FBQy9CO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDYixNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNyQyxNQUFNLEtBQUssR0FBRyw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sb0JBQVEsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUF2Q0Qsa0RBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdoYXBpJztcbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IHdpdGhEZWZhdWx0VmFsaWRhdG9ycyB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2lucHV0X3ZhbGlkYXRpb24nO1xuaW1wb3J0IHsgc2V0dXBSZXF1ZXN0IH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5pbXBvcnQgeyBnZXRUcmFuc2FjdGlvbiB9IGZyb20gJy4uL2xpYi90cmFuc2FjdGlvbnMvZ2V0X3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IGdldFNwYW5zIH0gZnJvbSAnLi4vbGliL3RyYW5zYWN0aW9ucy9zcGFucy9nZXRfc3BhbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFRyYW5zYWN0aW9uc0FwaShzZXJ2ZXI6IFNlcnZlcikge1xuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogYC9hcGkvYXBtL3NlcnZpY2VzL3tzZXJ2aWNlTmFtZX0vdHJhbnNhY3Rpb25zL3t0cmFuc2FjdGlvbklkfWAsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHdpdGhEZWZhdWx0VmFsaWRhdG9ycyh7XG4gICAgICAgICAgdHJhY2VJZDogSm9pLnN0cmluZygpLmFsbG93KCcnKSAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBhIHBhdGggcGFyYW0gYW5kIG1hZGUgcmVxdWlyZWQgYnkgNy4wXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyOiBhc3luYyByZXEgPT4ge1xuICAgICAgY29uc3QgeyB0cmFuc2FjdGlvbklkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgeyB0cmFjZUlkIH0gPSByZXEucXVlcnkgYXMgeyB0cmFjZUlkOiBzdHJpbmcgfTtcbiAgICAgIGNvbnN0IHNldHVwID0gc2V0dXBSZXF1ZXN0KHJlcSk7XG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IGdldFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uSWQsIHRyYWNlSWQsIHNldHVwKTtcbiAgICAgIGlmICh0cmFuc2FjdGlvbikge1xuICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBCb29tLm5vdEZvdW5kKCdDYW5ub3QgZmluZCB0aGUgcmVxdWVzdGVkIHBhZ2UnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRPRE86IHRoaXMgY2FuIGJlIHJlbW92ZWQgYnkgNy4wIHdoZW4gdjEgY29tcGF0YWJpbGl0eSBjYW4gYmUgZHJvcHBlZFxuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogYC9hcGkvYXBtL3NlcnZpY2VzL3tzZXJ2aWNlTmFtZX0vdHJhbnNhY3Rpb25zL3t0cmFuc2FjdGlvbklkfS9zcGFuc2AsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHdpdGhEZWZhdWx0VmFsaWRhdG9ycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyOiByZXEgPT4ge1xuICAgICAgY29uc3QgeyB0cmFuc2FjdGlvbklkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3Qgc2V0dXAgPSBzZXR1cFJlcXVlc3QocmVxKTtcbiAgICAgIHJldHVybiBnZXRTcGFucyh0cmFuc2FjdGlvbklkLCBzZXR1cCk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==