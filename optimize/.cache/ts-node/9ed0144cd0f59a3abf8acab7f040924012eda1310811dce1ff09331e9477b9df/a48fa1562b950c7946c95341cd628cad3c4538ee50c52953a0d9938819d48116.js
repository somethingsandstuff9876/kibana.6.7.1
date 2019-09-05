"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_optchain_1 = require("ts-optchain");
async function getMlBucketSize({ serviceName, transactionType, setup }) {
    const { client, start, end } = setup;
    const params = {
        index: `.ml-anomalies-${serviceName}-${transactionType}-high_mean_response_time`.toLowerCase(),
        body: {
            _source: 'bucket_span',
            size: 1,
            query: {
                bool: {
                    must: {
                        exists: {
                            field: 'bucket_span'
                        }
                    },
                    filter: [
                        {
                            range: {
                                timestamp: {
                                    gte: start,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ]
                }
            }
        }
    };
    try {
        const resp = await client('search', params);
        return ts_optchain_1.oc(resp).hits.hits[0]._source.bucket_span(0);
    }
    catch (err) {
        const isHttpError = 'statusCode' in err;
        if (isHttpError) {
            return 0;
        }
        throw err;
    }
}
exports.getMlBucketSize = getMlBucketSize;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2NoYXJ0cy9nZXRfYW5vbWFseV9kYXRhL2dldF9tbF9idWNrZXRfc2l6ZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2NoYXJ0cy9nZXRfYW5vbWFseV9kYXRhL2dldF9tbF9idWNrZXRfc2l6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCw2Q0FBaUM7QUFhMUIsS0FBSyxVQUFVLGVBQWUsQ0FBQyxFQUNwQyxXQUFXLEVBQ1gsZUFBZSxFQUNmLEtBQUssRUFDSTtJQUNULE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNyQyxNQUFNLE1BQU0sR0FBRztRQUNiLEtBQUssRUFBRSxpQkFBaUIsV0FBVyxJQUFJLGVBQWUsMEJBQTBCLENBQUMsV0FBVyxFQUFFO1FBQzlGLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUU7d0JBQ0osTUFBTSxFQUFFOzRCQUNOLEtBQUssRUFBRSxhQUFhO3lCQUNyQjtxQkFDRjtvQkFDRCxNQUFNLEVBQUU7d0JBQ047NEJBQ0UsS0FBSyxFQUFFO2dDQUNMLFNBQVMsRUFBRTtvQ0FDVCxHQUFHLEVBQUUsS0FBSztvQ0FDVixHQUFHLEVBQUUsR0FBRztvQ0FDUixNQUFNLEVBQUUsY0FBYztpQ0FDdkI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBYSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsT0FBTyxnQkFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyRDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxXQUFXLEdBQUcsWUFBWSxJQUFJLEdBQUcsQ0FBQztRQUN4QyxJQUFJLFdBQVcsRUFBRTtZQUNmLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFDRCxNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQztBQTVDRCwwQ0E0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBvYyB9IGZyb20gJ3RzLW9wdGNoYWluJztcbmltcG9ydCB7IFNldHVwIH0gZnJvbSAnLi4vLi4vLi4vaGVscGVycy9zZXR1cF9yZXF1ZXN0JztcblxuaW50ZXJmYWNlIElPcHRpb25zIHtcbiAgc2VydmljZU5hbWU6IHN0cmluZztcbiAgdHJhbnNhY3Rpb25UeXBlOiBzdHJpbmc7XG4gIHNldHVwOiBTZXR1cDtcbn1cblxuaW50ZXJmYWNlIEVTUmVzcG9uc2Uge1xuICBidWNrZXRfc3BhbjogbnVtYmVyO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TWxCdWNrZXRTaXplKHtcbiAgc2VydmljZU5hbWUsXG4gIHRyYW5zYWN0aW9uVHlwZSxcbiAgc2V0dXBcbn06IElPcHRpb25zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgY29uc3QgeyBjbGllbnQsIHN0YXJ0LCBlbmQgfSA9IHNldHVwO1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgaW5kZXg6IGAubWwtYW5vbWFsaWVzLSR7c2VydmljZU5hbWV9LSR7dHJhbnNhY3Rpb25UeXBlfS1oaWdoX21lYW5fcmVzcG9uc2VfdGltZWAudG9Mb3dlckNhc2UoKSxcbiAgICBib2R5OiB7XG4gICAgICBfc291cmNlOiAnYnVja2V0X3NwYW4nLFxuICAgICAgc2l6ZTogMSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGJvb2w6IHtcbiAgICAgICAgICBtdXN0OiB7XG4gICAgICAgICAgICBleGlzdHM6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdidWNrZXRfc3BhbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDoge1xuICAgICAgICAgICAgICAgICAgZ3RlOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgIGx0ZTogZW5kLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBjbGllbnQ8RVNSZXNwb25zZT4oJ3NlYXJjaCcsIHBhcmFtcyk7XG4gICAgcmV0dXJuIG9jKHJlc3ApLmhpdHMuaGl0c1swXS5fc291cmNlLmJ1Y2tldF9zcGFuKDApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zdCBpc0h0dHBFcnJvciA9ICdzdGF0dXNDb2RlJyBpbiBlcnI7XG4gICAgaWYgKGlzSHR0cEVycm9yKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iXX0=