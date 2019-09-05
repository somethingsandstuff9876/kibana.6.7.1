"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_optchain_1 = require("ts-optchain");
const constants_1 = require("../../../../common/constants");
async function getTransaction(transactionId, traceId, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        { term: { [constants_1.PROCESSOR_EVENT]: 'transaction' } },
        { term: { [constants_1.TRANSACTION_ID]: transactionId } },
        {
            range: {
                '@timestamp': {
                    gte: start,
                    lte: end,
                    format: 'epoch_millis'
                }
            }
        }
    ];
    if (esFilterQuery) {
        filter.push(esFilterQuery);
    }
    if (traceId) {
        filter.push({ term: { [constants_1.TRACE_ID]: traceId } });
    }
    const params = {
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 1,
            query: {
                bool: {
                    filter
                }
            }
        }
    };
    const resp = await client('search', params);
    return ts_optchain_1.oc(resp).hits.hits[0]._source();
}
exports.getTransaction = getTransaction;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2dldF90cmFuc2FjdGlvbi9pbmRleC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2dldF90cmFuc2FjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFHSCw2Q0FBaUM7QUFFakMsNERBSXNDO0FBSy9CLEtBQUssVUFBVSxjQUFjLENBQ2xDLGFBQXFCLEVBQ3JCLE9BQTJCLEVBQzNCLEtBQVk7SUFFWixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUU1RCxNQUFNLE1BQU0sR0FBZTtRQUN6QixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsMkJBQWUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxFQUFFO1FBQzlDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQywwQkFBYyxDQUFDLEVBQUUsYUFBYSxFQUFFLEVBQUU7UUFDN0M7WUFDRSxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLEdBQUcsRUFBRSxLQUFLO29CQUNWLEdBQUcsRUFBRSxHQUFHO29CQUNSLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSSxhQUFhLEVBQUU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM1QjtJQUVELElBQUksT0FBTyxFQUFFO1FBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsb0JBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNoRDtJQUVELE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQVMsNEJBQTRCLENBQUM7UUFDdkQsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLE1BQU07aUJBQ1A7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFjLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RCxPQUFPLGdCQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN6QyxDQUFDO0FBM0NELHdDQTJDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEVTRmlsdGVyIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBvYyB9IGZyb20gJ3RzLW9wdGNoYWluJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSAneC1wYWNrL3BsdWdpbnMvYXBtL3R5cGluZ3MvZXNfc2NoZW1hcy9UcmFuc2FjdGlvbic7XG5pbXBvcnQge1xuICBQUk9DRVNTT1JfRVZFTlQsXG4gIFRSQUNFX0lELFxuICBUUkFOU0FDVElPTl9JRFxufSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IFNldHVwIH0gZnJvbSAnLi4vLi4vaGVscGVycy9zZXR1cF9yZXF1ZXN0JztcblxuZXhwb3J0IHR5cGUgVHJhbnNhY3Rpb25BUElSZXNwb25zZSA9IFRyYW5zYWN0aW9uIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb24oXG4gIHRyYW5zYWN0aW9uSWQ6IHN0cmluZyxcbiAgdHJhY2VJZDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICBzZXR1cDogU2V0dXBcbik6IFByb21pc2U8VHJhbnNhY3Rpb25BUElSZXNwb25zZT4ge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQsIGVzRmlsdGVyUXVlcnksIGNsaWVudCwgY29uZmlnIH0gPSBzZXR1cDtcblxuICBjb25zdCBmaWx0ZXI6IEVTRmlsdGVyW10gPSBbXG4gICAgeyB0ZXJtOiB7IFtQUk9DRVNTT1JfRVZFTlRdOiAndHJhbnNhY3Rpb24nIH0gfSxcbiAgICB7IHRlcm06IHsgW1RSQU5TQUNUSU9OX0lEXTogdHJhbnNhY3Rpb25JZCB9IH0sXG4gICAge1xuICAgICAgcmFuZ2U6IHtcbiAgICAgICAgJ0B0aW1lc3RhbXAnOiB7XG4gICAgICAgICAgZ3RlOiBzdGFydCxcbiAgICAgICAgICBsdGU6IGVuZCxcbiAgICAgICAgICBmb3JtYXQ6ICdlcG9jaF9taWxsaXMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF07XG5cbiAgaWYgKGVzRmlsdGVyUXVlcnkpIHtcbiAgICBmaWx0ZXIucHVzaChlc0ZpbHRlclF1ZXJ5KTtcbiAgfVxuXG4gIGlmICh0cmFjZUlkKSB7XG4gICAgZmlsdGVyLnB1c2goeyB0ZXJtOiB7IFtUUkFDRV9JRF06IHRyYWNlSWQgfSB9KTtcbiAgfVxuXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBpbmRleDogY29uZmlnLmdldDxzdHJpbmc+KCdhcG1fb3NzLnRyYW5zYWN0aW9uSW5kaWNlcycpLFxuICAgIGJvZHk6IHtcbiAgICAgIHNpemU6IDEsXG4gICAgICBxdWVyeToge1xuICAgICAgICBib29sOiB7XG4gICAgICAgICAgZmlsdGVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVzcCA9IGF3YWl0IGNsaWVudDxUcmFuc2FjdGlvbj4oJ3NlYXJjaCcsIHBhcmFtcyk7XG4gIHJldHVybiBvYyhyZXNwKS5oaXRzLmhpdHNbMF0uX3NvdXJjZSgpO1xufVxuIl19