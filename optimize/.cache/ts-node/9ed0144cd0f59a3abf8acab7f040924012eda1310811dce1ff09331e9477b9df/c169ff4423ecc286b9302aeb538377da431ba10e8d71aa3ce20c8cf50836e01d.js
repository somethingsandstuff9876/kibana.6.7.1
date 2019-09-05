"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_optchain_1 = require("ts-optchain");
const constants_1 = require("../../../common/constants");
async function getErrorGroups({ serviceName, sortField, sortDirection = 'desc', setup }) {
    const { start, end, esFilterQuery, client, config } = setup;
    const params = {
        index: config.get('apm_oss.errorIndices'),
        body: {
            size: 0,
            query: {
                bool: {
                    filter: [
                        { term: { [constants_1.SERVICE_NAME]: serviceName } },
                        { term: { [constants_1.PROCESSOR_EVENT]: 'error' } },
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
            aggs: {
                error_groups: {
                    terms: {
                        field: constants_1.ERROR_GROUP_ID,
                        size: 500,
                        order: { _count: sortDirection }
                    },
                    aggs: {
                        sample: {
                            top_hits: {
                                _source: [
                                    constants_1.ERROR_LOG_MESSAGE,
                                    constants_1.ERROR_EXC_MESSAGE,
                                    constants_1.ERROR_EXC_HANDLED,
                                    constants_1.ERROR_CULPRIT,
                                    constants_1.ERROR_GROUP_ID,
                                    '@timestamp'
                                ],
                                sort: [{ '@timestamp': 'desc' }],
                                size: 1
                            }
                        }
                    }
                }
            }
        }
    };
    if (esFilterQuery) {
        params.body.query.bool.filter.push(esFilterQuery);
    }
    // sort buckets by last occurrence of error
    if (sortField === 'latestOccurrenceAt') {
        params.body.aggs.error_groups.terms.order = {
            max_timestamp: sortDirection
        };
        params.body.aggs.error_groups.aggs.max_timestamp = {
            max: { field: '@timestamp' }
        };
    }
    const resp = await client('search', params);
    const hits = ts_optchain_1.oc(resp)
        .aggregations.error_groups.buckets([])
        .map(bucket => {
        const source = bucket.sample.hits.hits[0]._source;
        const message = ts_optchain_1.oc(source).error.log.message() || ts_optchain_1.oc(source).error.exception.message();
        return {
            message,
            occurrenceCount: bucket.doc_count,
            culprit: ts_optchain_1.oc(source).error.culprit(),
            groupId: ts_optchain_1.oc(source).error.grouping_key(),
            latestOccurrenceAt: source['@timestamp'],
            handled: ts_optchain_1.oc(source).error.exception.handled()
        };
    });
    return hits;
}
exports.getErrorGroups = getErrorGroups;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvZXJyb3JzL2dldF9lcnJvcl9ncm91cHMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL2Vycm9ycy9nZXRfZXJyb3JfZ3JvdXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILDZDQUFpQztBQUVqQyx5REFRbUM7QUFjNUIsS0FBSyxVQUFVLGNBQWMsQ0FBQyxFQUNuQyxXQUFXLEVBQ1gsU0FBUyxFQUNULGFBQWEsR0FBRyxNQUFNLEVBQ3RCLEtBQUssRUFNTjtJQUNDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRTVELE1BQU0sTUFBTSxHQUFRO1FBQ2xCLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFTLHNCQUFzQixDQUFDO1FBQ2pELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUU7d0JBQ04sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLHdCQUFZLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRTt3QkFDekMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLDJCQUFlLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRTt3QkFDeEM7NEJBQ0UsS0FBSyxFQUFFO2dDQUNMLFlBQVksRUFBRTtvQ0FDWixHQUFHLEVBQUUsS0FBSztvQ0FDVixHQUFHLEVBQUUsR0FBRztvQ0FDUixNQUFNLEVBQUUsY0FBYztpQ0FDdkI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELElBQUksRUFBRTtnQkFDSixZQUFZLEVBQUU7b0JBQ1osS0FBSyxFQUFFO3dCQUNMLEtBQUssRUFBRSwwQkFBYzt3QkFDckIsSUFBSSxFQUFFLEdBQUc7d0JBQ1QsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRTtxQkFDakM7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLE1BQU0sRUFBRTs0QkFDTixRQUFRLEVBQUU7Z0NBQ1IsT0FBTyxFQUFFO29DQUNQLDZCQUFpQjtvQ0FDakIsNkJBQWlCO29DQUNqQiw2QkFBaUI7b0NBQ2pCLHlCQUFhO29DQUNiLDBCQUFjO29DQUNkLFlBQVk7aUNBQ2I7Z0NBQ0QsSUFBSSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUM7Z0NBQ2hDLElBQUksRUFBRSxDQUFDOzZCQUNSO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixJQUFJLGFBQWEsRUFBRTtRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUNuRDtJQUVELDJDQUEyQztJQUMzQyxJQUFJLFNBQVMsS0FBSyxvQkFBb0IsRUFBRTtRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRztZQUMxQyxhQUFhLEVBQUUsYUFBYTtTQUM3QixDQUFDO1FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDakQsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtTQUM3QixDQUFDO0tBQ0g7SUFxQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQWEsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELE1BQU0sSUFBSSxHQUFHLGdCQUFFLENBQUMsSUFBSSxDQUFDO1NBQ2xCLFlBQVksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDWixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUNYLGdCQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxnQkFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFekUsT0FBTztZQUNMLE9BQU87WUFDUCxlQUFlLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDakMsT0FBTyxFQUFFLGdCQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNuQyxPQUFPLEVBQUUsZ0JBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQ3hDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDeEMsT0FBTyxFQUFFLGdCQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7U0FDOUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUwsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBbklELHdDQW1JQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IG9jIH0gZnJvbSAndHMtb3B0Y2hhaW4nO1xuaW1wb3J0IHsgQVBNRXJyb3IgfSBmcm9tICd4LXBhY2svcGx1Z2lucy9hcG0vdHlwaW5ncy9lc19zY2hlbWFzL0Vycm9yJztcbmltcG9ydCB7XG4gIEVSUk9SX0NVTFBSSVQsXG4gIEVSUk9SX0VYQ19IQU5ETEVELFxuICBFUlJPUl9FWENfTUVTU0FHRSxcbiAgRVJST1JfR1JPVVBfSUQsXG4gIEVSUk9SX0xPR19NRVNTQUdFLFxuICBQUk9DRVNTT1JfRVZFTlQsXG4gIFNFUlZJQ0VfTkFNRVxufSBmcm9tICcuLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IFNldHVwIH0gZnJvbSAnLi4vaGVscGVycy9zZXR1cF9yZXF1ZXN0JztcblxuaW50ZXJmYWNlIEVycm9yUmVzcG9uc2VJdGVtcyB7XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIG9jY3VycmVuY2VDb3VudDogbnVtYmVyO1xuICBjdWxwcml0Pzogc3RyaW5nO1xuICBncm91cElkPzogc3RyaW5nO1xuICBsYXRlc3RPY2N1cnJlbmNlQXQ6IHN0cmluZztcbiAgaGFuZGxlZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCB0eXBlIEVycm9yR3JvdXBMaXN0QVBJUmVzcG9uc2UgPSBFcnJvclJlc3BvbnNlSXRlbXNbXTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEVycm9yR3JvdXBzKHtcbiAgc2VydmljZU5hbWUsXG4gIHNvcnRGaWVsZCxcbiAgc29ydERpcmVjdGlvbiA9ICdkZXNjJyxcbiAgc2V0dXBcbn06IHtcbiAgc2VydmljZU5hbWU6IHN0cmluZztcbiAgc29ydEZpZWxkOiBzdHJpbmc7XG4gIHNvcnREaXJlY3Rpb246ICdkZXNjJyB8ICdhc2MnO1xuICBzZXR1cDogU2V0dXA7XG59KTogUHJvbWlzZTxFcnJvckdyb3VwTGlzdEFQSVJlc3BvbnNlPiB7XG4gIGNvbnN0IHsgc3RhcnQsIGVuZCwgZXNGaWx0ZXJRdWVyeSwgY2xpZW50LCBjb25maWcgfSA9IHNldHVwO1xuXG4gIGNvbnN0IHBhcmFtczogYW55ID0ge1xuICAgIGluZGV4OiBjb25maWcuZ2V0PHN0cmluZz4oJ2FwbV9vc3MuZXJyb3JJbmRpY2VzJyksXG4gICAgYm9keToge1xuICAgICAgc2l6ZTogMCxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGJvb2w6IHtcbiAgICAgICAgICBmaWx0ZXI6IFtcbiAgICAgICAgICAgIHsgdGVybTogeyBbU0VSVklDRV9OQU1FXTogc2VydmljZU5hbWUgfSB9LFxuICAgICAgICAgICAgeyB0ZXJtOiB7IFtQUk9DRVNTT1JfRVZFTlRdOiAnZXJyb3InIH0gfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAnQHRpbWVzdGFtcCc6IHtcbiAgICAgICAgICAgICAgICAgIGd0ZTogc3RhcnQsXG4gICAgICAgICAgICAgICAgICBsdGU6IGVuZCxcbiAgICAgICAgICAgICAgICAgIGZvcm1hdDogJ2Vwb2NoX21pbGxpcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZ2dzOiB7XG4gICAgICAgIGVycm9yX2dyb3Vwczoge1xuICAgICAgICAgIHRlcm1zOiB7XG4gICAgICAgICAgICBmaWVsZDogRVJST1JfR1JPVVBfSUQsXG4gICAgICAgICAgICBzaXplOiA1MDAsXG4gICAgICAgICAgICBvcmRlcjogeyBfY291bnQ6IHNvcnREaXJlY3Rpb24gfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdnczoge1xuICAgICAgICAgICAgc2FtcGxlOiB7XG4gICAgICAgICAgICAgIHRvcF9oaXRzOiB7XG4gICAgICAgICAgICAgICAgX3NvdXJjZTogW1xuICAgICAgICAgICAgICAgICAgRVJST1JfTE9HX01FU1NBR0UsXG4gICAgICAgICAgICAgICAgICBFUlJPUl9FWENfTUVTU0FHRSxcbiAgICAgICAgICAgICAgICAgIEVSUk9SX0VYQ19IQU5ETEVELFxuICAgICAgICAgICAgICAgICAgRVJST1JfQ1VMUFJJVCxcbiAgICAgICAgICAgICAgICAgIEVSUk9SX0dST1VQX0lELFxuICAgICAgICAgICAgICAgICAgJ0B0aW1lc3RhbXAnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBzb3J0OiBbeyAnQHRpbWVzdGFtcCc6ICdkZXNjJyB9XSxcbiAgICAgICAgICAgICAgICBzaXplOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKGVzRmlsdGVyUXVlcnkpIHtcbiAgICBwYXJhbXMuYm9keS5xdWVyeS5ib29sLmZpbHRlci5wdXNoKGVzRmlsdGVyUXVlcnkpO1xuICB9XG5cbiAgLy8gc29ydCBidWNrZXRzIGJ5IGxhc3Qgb2NjdXJyZW5jZSBvZiBlcnJvclxuICBpZiAoc29ydEZpZWxkID09PSAnbGF0ZXN0T2NjdXJyZW5jZUF0Jykge1xuICAgIHBhcmFtcy5ib2R5LmFnZ3MuZXJyb3JfZ3JvdXBzLnRlcm1zLm9yZGVyID0ge1xuICAgICAgbWF4X3RpbWVzdGFtcDogc29ydERpcmVjdGlvblxuICAgIH07XG5cbiAgICBwYXJhbXMuYm9keS5hZ2dzLmVycm9yX2dyb3Vwcy5hZ2dzLm1heF90aW1lc3RhbXAgPSB7XG4gICAgICBtYXg6IHsgZmllbGQ6ICdAdGltZXN0YW1wJyB9XG4gICAgfTtcbiAgfVxuXG4gIGludGVyZmFjZSBTYW1wbGVFcnJvciB7XG4gICAgJ0B0aW1lc3RhbXAnOiBBUE1FcnJvclsnQHRpbWVzdGFtcCddO1xuICAgIGVycm9yOiB7XG4gICAgICBsb2c/OiB7XG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgIH07XG4gICAgICBleGNlcHRpb24/OiB7XG4gICAgICAgIGhhbmRsZWQ/OiBib29sZWFuO1xuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgICAgfTtcbiAgICAgIGN1bHByaXQ6IEFQTUVycm9yWydlcnJvciddWydjdWxwcml0J107XG4gICAgICBncm91cGluZ19rZXk6IEFQTUVycm9yWydlcnJvciddWydncm91cGluZ19rZXknXTtcbiAgICB9O1xuICB9XG5cbiAgaW50ZXJmYWNlIEJ1Y2tldCB7XG4gICAga2V5OiBzdHJpbmc7XG4gICAgZG9jX2NvdW50OiBudW1iZXI7XG4gICAgc2FtcGxlOiB7XG4gICAgICBoaXRzOiB7XG4gICAgICAgIHRvdGFsOiBudW1iZXI7XG4gICAgICAgIG1heF9zY29yZTogbnVtYmVyIHwgbnVsbDtcbiAgICAgICAgaGl0czogQXJyYXk8e1xuICAgICAgICAgIF9zb3VyY2U6IFNhbXBsZUVycm9yO1xuICAgICAgICB9PjtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIGludGVyZmFjZSBBZ2dzIHtcbiAgICBlcnJvcl9ncm91cHM6IHtcbiAgICAgIGJ1Y2tldHM6IEJ1Y2tldFtdO1xuICAgIH07XG4gIH1cblxuICBjb25zdCByZXNwID0gYXdhaXQgY2xpZW50PHZvaWQsIEFnZ3M+KCdzZWFyY2gnLCBwYXJhbXMpO1xuICBjb25zdCBoaXRzID0gb2MocmVzcClcbiAgICAuYWdncmVnYXRpb25zLmVycm9yX2dyb3Vwcy5idWNrZXRzKFtdKVxuICAgIC5tYXAoYnVja2V0ID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IGJ1Y2tldC5zYW1wbGUuaGl0cy5oaXRzWzBdLl9zb3VyY2U7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgb2Moc291cmNlKS5lcnJvci5sb2cubWVzc2FnZSgpIHx8IG9jKHNvdXJjZSkuZXJyb3IuZXhjZXB0aW9uLm1lc3NhZ2UoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgb2NjdXJyZW5jZUNvdW50OiBidWNrZXQuZG9jX2NvdW50LFxuICAgICAgICBjdWxwcml0OiBvYyhzb3VyY2UpLmVycm9yLmN1bHByaXQoKSxcbiAgICAgICAgZ3JvdXBJZDogb2Moc291cmNlKS5lcnJvci5ncm91cGluZ19rZXkoKSxcbiAgICAgICAgbGF0ZXN0T2NjdXJyZW5jZUF0OiBzb3VyY2VbJ0B0aW1lc3RhbXAnXSxcbiAgICAgICAgaGFuZGxlZDogb2Moc291cmNlKS5lcnJvci5leGNlcHRpb24uaGFuZGxlZCgpXG4gICAgICB9O1xuICAgIH0pO1xuXG4gIHJldHVybiBoaXRzO1xufVxuIl19