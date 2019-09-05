"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_optchain_1 = require("ts-optchain");
const constants_1 = require("../../../common/constants");
async function getService(serviceName, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        { term: { [constants_1.SERVICE_NAME]: serviceName } },
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
    const params = {
        index: [
            config.get('apm_oss.errorIndices'),
            config.get('apm_oss.transactionIndices')
        ],
        body: {
            size: 0,
            query: {
                bool: {
                    filter
                }
            },
            aggs: {
                types: {
                    terms: { field: constants_1.TRANSACTION_TYPE, size: 100 }
                },
                agents: {
                    terms: { field: constants_1.SERVICE_AGENT_NAME, size: 1 }
                }
            }
        }
    };
    const { aggregations } = await client('search', params);
    return {
        serviceName,
        types: ts_optchain_1.oc(aggregations)
            .types.buckets([])
            .map(bucket => bucket.key),
        agentName: ts_optchain_1.oc(aggregations).agents.buckets[0].key()
    };
}
exports.getService = getService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvc2VydmljZXMvZ2V0X3NlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL3NlcnZpY2VzL2dldF9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUlILDZDQUFpQztBQUNqQyx5REFJbUM7QUFTNUIsS0FBSyxVQUFVLFVBQVUsQ0FDOUIsV0FBbUIsRUFDbkIsS0FBWTtJQUVaLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRTVELE1BQU0sTUFBTSxHQUFlO1FBQ3pCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyx3QkFBWSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUU7UUFDekM7WUFDRSxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLEdBQUcsRUFBRSxLQUFLO29CQUNWLEdBQUcsRUFBRSxHQUFHO29CQUNSLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSSxhQUFhLEVBQUU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM1QjtJQUVELE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFO1lBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBUyxzQkFBc0IsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBRyxDQUFTLDRCQUE0QixDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLE1BQU07aUJBQ1A7YUFDRjtZQUNELElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLDRCQUFnQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7aUJBQzlDO2dCQUNELE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsOEJBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtpQkFDOUM7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQVdGLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBYSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEUsT0FBTztRQUNMLFdBQVc7UUFDWCxLQUFLLEVBQUUsZ0JBQUUsQ0FBQyxZQUFZLENBQUM7YUFDcEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDakIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUM1QixTQUFTLEVBQUUsZ0JBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtLQUNwRCxDQUFDO0FBQ0osQ0FBQztBQS9ERCxnQ0ErREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBCdWNrZXRBZ2cgfSBmcm9tICdlbGFzdGljc2VhcmNoJztcbmltcG9ydCB7IEVTRmlsdGVyIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBvYyB9IGZyb20gJ3RzLW9wdGNoYWluJztcbmltcG9ydCB7XG4gIFNFUlZJQ0VfQUdFTlRfTkFNRSxcbiAgU0VSVklDRV9OQU1FLFxuICBUUkFOU0FDVElPTl9UWVBFXG59IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgU2V0dXAgfSBmcm9tICcuLi9oZWxwZXJzL3NldHVwX3JlcXVlc3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VBUElSZXNwb25zZSB7XG4gIHNlcnZpY2VOYW1lOiBzdHJpbmc7XG4gIHR5cGVzOiBzdHJpbmdbXTtcbiAgYWdlbnROYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2VydmljZShcbiAgc2VydmljZU5hbWU6IHN0cmluZyxcbiAgc2V0dXA6IFNldHVwXG4pOiBQcm9taXNlPFNlcnZpY2VBUElSZXNwb25zZT4ge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQsIGVzRmlsdGVyUXVlcnksIGNsaWVudCwgY29uZmlnIH0gPSBzZXR1cDtcblxuICBjb25zdCBmaWx0ZXI6IEVTRmlsdGVyW10gPSBbXG4gICAgeyB0ZXJtOiB7IFtTRVJWSUNFX05BTUVdOiBzZXJ2aWNlTmFtZSB9IH0sXG4gICAge1xuICAgICAgcmFuZ2U6IHtcbiAgICAgICAgJ0B0aW1lc3RhbXAnOiB7XG4gICAgICAgICAgZ3RlOiBzdGFydCxcbiAgICAgICAgICBsdGU6IGVuZCxcbiAgICAgICAgICBmb3JtYXQ6ICdlcG9jaF9taWxsaXMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF07XG5cbiAgaWYgKGVzRmlsdGVyUXVlcnkpIHtcbiAgICBmaWx0ZXIucHVzaChlc0ZpbHRlclF1ZXJ5KTtcbiAgfVxuXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBpbmRleDogW1xuICAgICAgY29uZmlnLmdldDxzdHJpbmc+KCdhcG1fb3NzLmVycm9ySW5kaWNlcycpLFxuICAgICAgY29uZmlnLmdldDxzdHJpbmc+KCdhcG1fb3NzLnRyYW5zYWN0aW9uSW5kaWNlcycpXG4gICAgXSxcbiAgICBib2R5OiB7XG4gICAgICBzaXplOiAwLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlclxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWdnczoge1xuICAgICAgICB0eXBlczoge1xuICAgICAgICAgIHRlcm1zOiB7IGZpZWxkOiBUUkFOU0FDVElPTl9UWVBFLCBzaXplOiAxMDAgfVxuICAgICAgICB9LFxuICAgICAgICBhZ2VudHM6IHtcbiAgICAgICAgICB0ZXJtczogeyBmaWVsZDogU0VSVklDRV9BR0VOVF9OQU1FLCBzaXplOiAxIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpbnRlcmZhY2UgQWdncyB7XG4gICAgdHlwZXM6IHtcbiAgICAgIGJ1Y2tldHM6IEJ1Y2tldEFnZ1tdO1xuICAgIH07XG4gICAgYWdlbnRzOiB7XG4gICAgICBidWNrZXRzOiBCdWNrZXRBZ2dbXTtcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgeyBhZ2dyZWdhdGlvbnMgfSA9IGF3YWl0IGNsaWVudDx2b2lkLCBBZ2dzPignc2VhcmNoJywgcGFyYW1zKTtcbiAgcmV0dXJuIHtcbiAgICBzZXJ2aWNlTmFtZSxcbiAgICB0eXBlczogb2MoYWdncmVnYXRpb25zKVxuICAgICAgLnR5cGVzLmJ1Y2tldHMoW10pXG4gICAgICAubWFwKGJ1Y2tldCA9PiBidWNrZXQua2V5KSxcbiAgICBhZ2VudE5hbWU6IG9jKGFnZ3JlZ2F0aW9ucykuYWdlbnRzLmJ1Y2tldHNbMF0ua2V5KClcbiAgfTtcbn1cbiJdfQ==