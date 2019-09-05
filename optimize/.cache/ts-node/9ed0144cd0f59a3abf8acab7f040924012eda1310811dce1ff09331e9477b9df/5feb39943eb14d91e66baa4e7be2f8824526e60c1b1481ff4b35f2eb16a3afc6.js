"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../common/constants");
function transactionGroupsFetcher(setup, bodyQuery) {
    const { esFilterQuery, client, config } = setup;
    const params = {
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 0,
            query: bodyQuery,
            aggs: {
                transactions: {
                    terms: {
                        field: `${constants_1.TRANSACTION_NAME}.keyword`,
                        order: { sum: 'desc' },
                        size: config.get('xpack.apm.ui.transactionGroupBucketSize')
                    },
                    aggs: {
                        sample: {
                            top_hits: {
                                size: 1,
                                sort: [
                                    { _score: 'desc' },
                                    { '@timestamp': { order: 'desc' } }
                                ]
                            }
                        },
                        avg: { avg: { field: constants_1.TRANSACTION_DURATION } },
                        p95: {
                            percentiles: { field: constants_1.TRANSACTION_DURATION, percents: [95] }
                        },
                        sum: { sum: { field: constants_1.TRANSACTION_DURATION } }
                    }
                }
            }
        }
    };
    if (esFilterQuery) {
        params.body.query.bool.filter.push(esFilterQuery);
    }
    return client('search', params);
}
exports.transactionGroupsFetcher = transactionGroupsFetcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25fZ3JvdXBzL2ZldGNoZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL3RyYW5zYWN0aW9uX2dyb3Vwcy9mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUlILHlEQUdtQztBQTZCbkMsU0FBZ0Isd0JBQXdCLENBQ3RDLEtBQVksRUFDWixTQUFvQjtJQUVwQixNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBUyw0QkFBNEIsQ0FBQztRQUN2RCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQztZQUNQLEtBQUssRUFBRSxTQUFTO1lBQ2hCLElBQUksRUFBRTtnQkFDSixZQUFZLEVBQUU7b0JBQ1osS0FBSyxFQUFFO3dCQUNMLEtBQUssRUFBRSxHQUFHLDRCQUFnQixVQUFVO3dCQUNwQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO3dCQUN0QixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBUyx5Q0FBeUMsQ0FBQztxQkFDcEU7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLE1BQU0sRUFBRTs0QkFDTixRQUFRLEVBQUU7Z0NBQ1IsSUFBSSxFQUFFLENBQUM7Z0NBQ1AsSUFBSSxFQUFFO29DQUNKLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtvQ0FDbEIsRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7aUNBQ3BDOzZCQUNGO3lCQUNGO3dCQUNELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxnQ0FBb0IsRUFBRSxFQUFFO3dCQUM3QyxHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLGdDQUFvQixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO3lCQUM3RDt3QkFDRCxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsZ0NBQW9CLEVBQUUsRUFBRTtxQkFDOUM7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLElBQUksYUFBYSxFQUFFO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ25EO0lBRUQsT0FBTyxNQUFNLENBQWEsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUEzQ0QsNERBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQWdncmVnYXRpb25TZWFyY2hSZXNwb25zZSB9IGZyb20gJ2VsYXN0aWNzZWFyY2gnO1xuaW1wb3J0IHsgU3RyaW5nTWFwIH0gZnJvbSAneC1wYWNrL3BsdWdpbnMvYXBtL3R5cGluZ3MvY29tbW9uJztcbmltcG9ydCB7XG4gIFRSQU5TQUNUSU9OX0RVUkFUSU9OLFxuICBUUkFOU0FDVElPTl9OQU1FXG59IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb24gfSBmcm9tICcuLi8uLi8uLi90eXBpbmdzL2VzX3NjaGVtYXMvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgU2V0dXAgfSBmcm9tICcuLi9oZWxwZXJzL3NldHVwX3JlcXVlc3QnO1xuXG5pbnRlcmZhY2UgQnVja2V0IHtcbiAga2V5OiBzdHJpbmc7XG4gIGRvY19jb3VudDogbnVtYmVyO1xuICBhdmc6IHsgdmFsdWU6IG51bWJlciB9O1xuICBwOTU6IHsgdmFsdWVzOiB7ICc5NS4wJzogbnVtYmVyIH0gfTtcbiAgc3VtOiB7IHZhbHVlOiBudW1iZXIgfTtcbiAgc2FtcGxlOiB7XG4gICAgaGl0czoge1xuICAgICAgdG90YWw6IG51bWJlcjtcbiAgICAgIG1heF9zY29yZTogbnVtYmVyIHwgbnVsbDtcbiAgICAgIGhpdHM6IEFycmF5PHtcbiAgICAgICAgX3NvdXJjZTogVHJhbnNhY3Rpb247XG4gICAgICB9PjtcbiAgICB9O1xuICB9O1xufVxuXG5pbnRlcmZhY2UgQWdncyB7XG4gIHRyYW5zYWN0aW9uczoge1xuICAgIGJ1Y2tldHM6IEJ1Y2tldFtdO1xuICB9O1xufVxuXG5leHBvcnQgdHlwZSBFU1Jlc3BvbnNlID0gQWdncmVnYXRpb25TZWFyY2hSZXNwb25zZTx2b2lkLCBBZ2dzPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zYWN0aW9uR3JvdXBzRmV0Y2hlcihcbiAgc2V0dXA6IFNldHVwLFxuICBib2R5UXVlcnk6IFN0cmluZ01hcFxuKTogUHJvbWlzZTxFU1Jlc3BvbnNlPiB7XG4gIGNvbnN0IHsgZXNGaWx0ZXJRdWVyeSwgY2xpZW50LCBjb25maWcgfSA9IHNldHVwO1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgaW5kZXg6IGNvbmZpZy5nZXQ8c3RyaW5nPignYXBtX29zcy50cmFuc2FjdGlvbkluZGljZXMnKSxcbiAgICBib2R5OiB7XG4gICAgICBzaXplOiAwLFxuICAgICAgcXVlcnk6IGJvZHlRdWVyeSxcbiAgICAgIGFnZ3M6IHtcbiAgICAgICAgdHJhbnNhY3Rpb25zOiB7XG4gICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgIGZpZWxkOiBgJHtUUkFOU0FDVElPTl9OQU1FfS5rZXl3b3JkYCxcbiAgICAgICAgICAgIG9yZGVyOiB7IHN1bTogJ2Rlc2MnIH0sXG4gICAgICAgICAgICBzaXplOiBjb25maWcuZ2V0PG51bWJlcj4oJ3hwYWNrLmFwbS51aS50cmFuc2FjdGlvbkdyb3VwQnVja2V0U2l6ZScpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgICBzYW1wbGU6IHtcbiAgICAgICAgICAgICAgdG9wX2hpdHM6IHtcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIHNvcnQ6IFtcbiAgICAgICAgICAgICAgICAgIHsgX3Njb3JlOiAnZGVzYycgfSwgLy8gc29ydCBieSBfc2NvcmUgdG8gZW5zdXJlIHRoYXQgYnVja2V0cyB3aXRoIHNhbXBsZWQ6dHJ1ZSBlbmRzIHVwIG9uIHRvcFxuICAgICAgICAgICAgICAgICAgeyAnQHRpbWVzdGFtcCc6IHsgb3JkZXI6ICdkZXNjJyB9IH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdmc6IHsgYXZnOiB7IGZpZWxkOiBUUkFOU0FDVElPTl9EVVJBVElPTiB9IH0sXG4gICAgICAgICAgICBwOTU6IHtcbiAgICAgICAgICAgICAgcGVyY2VudGlsZXM6IHsgZmllbGQ6IFRSQU5TQUNUSU9OX0RVUkFUSU9OLCBwZXJjZW50czogWzk1XSB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VtOiB7IHN1bTogeyBmaWVsZDogVFJBTlNBQ1RJT05fRFVSQVRJT04gfSB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGlmIChlc0ZpbHRlclF1ZXJ5KSB7XG4gICAgcGFyYW1zLmJvZHkucXVlcnkuYm9vbC5maWx0ZXIucHVzaChlc0ZpbHRlclF1ZXJ5KTtcbiAgfVxuXG4gIHJldHVybiBjbGllbnQ8dm9pZCwgQWdncz4oJ3NlYXJjaCcsIHBhcmFtcyk7XG59XG4iXX0=