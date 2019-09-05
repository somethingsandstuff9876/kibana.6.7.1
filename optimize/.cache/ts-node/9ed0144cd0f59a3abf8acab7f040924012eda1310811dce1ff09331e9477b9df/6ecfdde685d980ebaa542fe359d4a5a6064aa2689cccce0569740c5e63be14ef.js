"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../common/constants");
const transaction_groups_1 = require("../transaction_groups");
async function getTopTraces(setup) {
    const { start, end } = setup;
    const bodyQuery = {
        bool: {
            must: {
                // this criterion safeguards against data that lacks a transaction
                // parent ID but still is not a "trace" by way of not having a
                // trace ID (e.g. old data before parent ID was implemented, etc)
                exists: {
                    field: constants_1.TRACE_ID
                }
            },
            must_not: {
                // no parent ID alongside a trace ID means this transaction is a
                // "root" transaction, i.e. a trace
                exists: {
                    field: constants_1.PARENT_ID
                }
            },
            filter: [
                {
                    range: {
                        '@timestamp': {
                            gte: start,
                            lte: end,
                            format: 'epoch_millis'
                        }
                    }
                },
                { term: { [constants_1.PROCESSOR_EVENT]: 'transaction' } }
            ],
            should: [{ term: { [constants_1.TRANSACTION_SAMPLED]: true } }]
        }
    };
    return transaction_groups_1.getTransactionGroups(setup, bodyQuery);
}
exports.getTopTraces = getTopTraces;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhY2VzL2dldF90b3BfdHJhY2VzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9hcG0vc2VydmVyL2xpYi90cmFjZXMvZ2V0X3RvcF90cmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgseURBS21DO0FBRW5DLDhEQUE2RDtBQUt0RCxLQUFLLFVBQVUsWUFBWSxDQUNoQyxLQUFZO0lBRVosTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFN0IsTUFBTSxTQUFTLEdBQUc7UUFDaEIsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFO2dCQUNKLGtFQUFrRTtnQkFDbEUsOERBQThEO2dCQUM5RCxpRUFBaUU7Z0JBQ2pFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsb0JBQVE7aUJBQ2hCO2FBQ0Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsZ0VBQWdFO2dCQUNoRSxtQ0FBbUM7Z0JBQ25DLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUscUJBQVM7aUJBQ2pCO2FBQ0Y7WUFDRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsS0FBSyxFQUFFO3dCQUNMLFlBQVksRUFBRTs0QkFDWixHQUFHLEVBQUUsS0FBSzs0QkFDVixHQUFHLEVBQUUsR0FBRzs0QkFDUixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLDJCQUFlLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRTthQUMvQztZQUNELE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQywrQkFBbUIsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7U0FDcEQ7S0FDRixDQUFDO0lBRUYsT0FBTyx5Q0FBb0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQXZDRCxvQ0F1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICBQQVJFTlRfSUQsXG4gIFBST0NFU1NPUl9FVkVOVCxcbiAgVFJBQ0VfSUQsXG4gIFRSQU5TQUNUSU9OX1NBTVBMRURcbn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBTZXR1cCB9IGZyb20gJy4uL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5pbXBvcnQgeyBnZXRUcmFuc2FjdGlvbkdyb3VwcyB9IGZyb20gJy4uL3RyYW5zYWN0aW9uX2dyb3Vwcyc7XG5pbXBvcnQgeyBJVHJhbnNhY3Rpb25Hcm91cCB9IGZyb20gJy4uL3RyYW5zYWN0aW9uX2dyb3Vwcy90cmFuc2Zvcm0nO1xuXG5leHBvcnQgdHlwZSBUcmFjZUxpc3RBUElSZXNwb25zZSA9IElUcmFuc2FjdGlvbkdyb3VwW107XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRUb3BUcmFjZXMoXG4gIHNldHVwOiBTZXR1cFxuKTogUHJvbWlzZTxUcmFjZUxpc3RBUElSZXNwb25zZT4ge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHNldHVwO1xuXG4gIGNvbnN0IGJvZHlRdWVyeSA9IHtcbiAgICBib29sOiB7XG4gICAgICBtdXN0OiB7XG4gICAgICAgIC8vIHRoaXMgY3JpdGVyaW9uIHNhZmVndWFyZHMgYWdhaW5zdCBkYXRhIHRoYXQgbGFja3MgYSB0cmFuc2FjdGlvblxuICAgICAgICAvLyBwYXJlbnQgSUQgYnV0IHN0aWxsIGlzIG5vdCBhIFwidHJhY2VcIiBieSB3YXkgb2Ygbm90IGhhdmluZyBhXG4gICAgICAgIC8vIHRyYWNlIElEIChlLmcuIG9sZCBkYXRhIGJlZm9yZSBwYXJlbnQgSUQgd2FzIGltcGxlbWVudGVkLCBldGMpXG4gICAgICAgIGV4aXN0czoge1xuICAgICAgICAgIGZpZWxkOiBUUkFDRV9JRFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbXVzdF9ub3Q6IHtcbiAgICAgICAgLy8gbm8gcGFyZW50IElEIGFsb25nc2lkZSBhIHRyYWNlIElEIG1lYW5zIHRoaXMgdHJhbnNhY3Rpb24gaXMgYVxuICAgICAgICAvLyBcInJvb3RcIiB0cmFuc2FjdGlvbiwgaS5lLiBhIHRyYWNlXG4gICAgICAgIGV4aXN0czoge1xuICAgICAgICAgIGZpZWxkOiBQQVJFTlRfSURcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlcjogW1xuICAgICAgICB7XG4gICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgICAgICBndGU6IHN0YXJ0LFxuICAgICAgICAgICAgICBsdGU6IGVuZCxcbiAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgeyB0ZXJtOiB7IFtQUk9DRVNTT1JfRVZFTlRdOiAndHJhbnNhY3Rpb24nIH0gfVxuICAgICAgXSxcbiAgICAgIHNob3VsZDogW3sgdGVybTogeyBbVFJBTlNBQ1RJT05fU0FNUExFRF06IHRydWUgfSB9XVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZ2V0VHJhbnNhY3Rpb25Hcm91cHMoc2V0dXAsIGJvZHlRdWVyeSk7XG59XG4iXX0=