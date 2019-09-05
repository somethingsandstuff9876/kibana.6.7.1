"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../common/constants");
// Deprecated and will be removed in 7.0. Only needed for backwards compatability pre 6.5 (introducition of v2 API and distributed tracing)
async function getSpans(transactionId, setup) {
    const { start, end, client, config } = setup;
    const params = {
        index: config.get('apm_oss.spanIndices'),
        body: {
            size: 500,
            query: {
                bool: {
                    filter: [
                        { term: { [constants_1.TRANSACTION_ID]: transactionId } },
                        { term: { [constants_1.PROCESSOR_EVENT]: 'span' } },
                        {
                            range: {
                                '@timestamp': {
                                    gte: start,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ]
                }
            },
            sort: [{ [constants_1.SPAN_START]: { order: 'asc' } }]
        }
    };
    const resp = await client('search', params);
    return resp.hits.hits.map(hit => hit._source);
}
exports.getSpans = getSpans;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL3NwYW5zL2dldF9zcGFucy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL3NwYW5zL2dldF9zcGFucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFHSCw0REFJc0M7QUFLdEMsMklBQTJJO0FBQ3BJLEtBQUssVUFBVSxRQUFRLENBQzVCLGFBQXFCLEVBQ3JCLEtBQVk7SUFFWixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRTdDLE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQVMscUJBQXFCLENBQUM7UUFDaEQsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLEdBQUc7WUFDVCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRTt3QkFDTixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsMEJBQWMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxFQUFFO3dCQUM3QyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsMkJBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFO3dCQUN2Qzs0QkFDRSxLQUFLLEVBQUU7Z0NBQ0wsWUFBWSxFQUFFO29DQUNaLEdBQUcsRUFBRSxLQUFLO29DQUNWLEdBQUcsRUFBRSxHQUFHO29DQUNSLE1BQU0sRUFBRSxjQUFjO2lDQUN2Qjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLHNCQUFVLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1NBQzNDO0tBQ0YsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFPLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBakNELDRCQWlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFNwYW4gfSBmcm9tICd4LXBhY2svcGx1Z2lucy9hcG0vdHlwaW5ncy9lc19zY2hlbWFzL1NwYW4nO1xuaW1wb3J0IHtcbiAgUFJPQ0VTU09SX0VWRU5ULFxuICBTUEFOX1NUQVJULFxuICBUUkFOU0FDVElPTl9JRFxufSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IFNldHVwIH0gZnJvbSAnLi4vLi4vaGVscGVycy9zZXR1cF9yZXF1ZXN0JztcblxuZXhwb3J0IHR5cGUgU3Bhbkxpc3RBUElSZXNwb25zZSA9IFNwYW5bXTtcblxuLy8gRGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIDcuMC4gT25seSBuZWVkZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5IHByZSA2LjUgKGludHJvZHVjaXRpb24gb2YgdjIgQVBJIGFuZCBkaXN0cmlidXRlZCB0cmFjaW5nKVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNwYW5zKFxuICB0cmFuc2FjdGlvbklkOiBzdHJpbmcsXG4gIHNldHVwOiBTZXR1cFxuKTogUHJvbWlzZTxTcGFuTGlzdEFQSVJlc3BvbnNlPiB7XG4gIGNvbnN0IHsgc3RhcnQsIGVuZCwgY2xpZW50LCBjb25maWcgfSA9IHNldHVwO1xuXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBpbmRleDogY29uZmlnLmdldDxzdHJpbmc+KCdhcG1fb3NzLnNwYW5JbmRpY2VzJyksXG4gICAgYm9keToge1xuICAgICAgc2l6ZTogNTAwLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAgeyB0ZXJtOiB7IFtUUkFOU0FDVElPTl9JRF06IHRyYW5zYWN0aW9uSWQgfSB9LFxuICAgICAgICAgICAgeyB0ZXJtOiB7IFtQUk9DRVNTT1JfRVZFTlRdOiAnc3BhbicgfSB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgICAgICAgICAgZ3RlOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgIGx0ZTogZW5kLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNvcnQ6IFt7IFtTUEFOX1NUQVJUXTogeyBvcmRlcjogJ2FzYycgfSB9XVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZXNwID0gYXdhaXQgY2xpZW50PFNwYW4+KCdzZWFyY2gnLCBwYXJhbXMpO1xuICByZXR1cm4gcmVzcC5oaXRzLmhpdHMubWFwKGhpdCA9PiBoaXQuX3NvdXJjZSk7XG59XG4iXX0=