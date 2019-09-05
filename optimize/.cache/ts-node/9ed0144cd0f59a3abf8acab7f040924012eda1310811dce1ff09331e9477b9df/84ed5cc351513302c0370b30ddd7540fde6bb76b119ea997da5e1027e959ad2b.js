"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const constants_1 = require("../../../../common/constants");
const helper_1 = require("../../helper");
class ElasticsearchPingsAdapter {
    constructor(database) {
        this.database = database;
    }
    async getAll(request, dateRangeStart, dateRangeEnd, monitorId, status, sort, size) {
        const sortParam = sort ? { sort: [{ '@timestamp': { order: sort } }] } : undefined;
        const sizeParam = size ? { size } : undefined;
        const must = [];
        if (monitorId) {
            must.push({ term: { 'monitor.id': monitorId } });
        }
        if (status) {
            must.push({ term: { 'monitor.status': status } });
        }
        const filter = [{ range: { '@timestamp': { gte: dateRangeStart, lte: dateRangeEnd } } }];
        const queryContext = { bool: { must, filter } };
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            rest_total_hits_as_int: true,
            body: {
                query: {
                    ...queryContext,
                },
                ...sortParam,
                ...sizeParam,
            },
        };
        const { hits: { hits, total }, } = await this.database.search(request, params);
        const pings = hits.map(({ _source }) => {
            const timestamp = _source['@timestamp'];
            return { timestamp, ..._source };
        });
        const results = {
            total,
            pings,
        };
        return results;
    }
    async getLatestMonitorDocs(request, dateRangeStart, dateRangeEnd, monitorId) {
        const must = [];
        if (monitorId) {
            must.push({ term: { 'monitor.id': monitorId } });
        }
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            body: {
                query: {
                    bool: {
                        must: must.length ? [...must] : undefined,
                        filter: [
                            {
                                range: {
                                    '@timestamp': {
                                        gte: dateRangeStart,
                                        lte: dateRangeEnd,
                                    },
                                },
                            },
                        ],
                    },
                },
                aggs: {
                    by_id: {
                        terms: {
                            field: 'monitor.id',
                        },
                        aggs: {
                            latest: {
                                top_hits: {
                                    size: 1,
                                    sort: {
                                        '@timestamp': { order: 'desc' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        const { aggregations: { by_id: { buckets }, }, } = await this.database.search(request, params);
        // @ts-ignore TODO fix destructuring implicit any
        return buckets.map(({ latest: { hits: { hits } } }) => {
            const timestamp = hits[0]._source[`@timestamp`];
            const momentTs = moment_1.default(timestamp);
            const millisFromNow = moment_1.default().diff(momentTs);
            return {
                ...hits[0]._source,
                timestamp,
                millisFromNow,
            };
        });
    }
    async getPingHistogram(request, dateRangeStart, dateRangeEnd, filters) {
        const query = helper_1.getFilterFromMust(dateRangeStart, dateRangeEnd, filters);
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            rest_total_hits_as_int: true,
            body: {
                query,
                size: 0,
                aggs: {
                    timeseries: {
                        auto_date_histogram: {
                            field: '@timestamp',
                            buckets: 50,
                        },
                        aggs: {
                            down: {
                                filter: {
                                    term: {
                                        'monitor.status': 'down',
                                    },
                                },
                                aggs: {
                                    bucket_count: {
                                        cardinality: {
                                            field: 'monitor.id',
                                        },
                                    },
                                },
                            },
                            bucket_total: {
                                cardinality: {
                                    field: 'monitor.id',
                                    precision_threshold: 20000,
                                },
                            },
                        },
                    },
                },
            },
        };
        const result = await this.database.search(request, params);
        const buckets = lodash_1.get(result, 'aggregations.timeseries.buckets', []);
        const mappedBuckets = buckets.map(bucket => {
            const key = lodash_1.get(bucket, 'key');
            const total = lodash_1.get(bucket, 'bucket_total.value');
            const downCount = lodash_1.get(bucket, 'down.bucket_count.value');
            return {
                key,
                downCount,
                upCount: total - downCount,
                y: 1,
            };
        });
        return helper_1.formatEsBucketsForHistogram(mappedBuckets);
    }
    async getDocCount(request) {
        const { count } = await this.database.count(request, { index: constants_1.INDEX_NAMES.HEARTBEAT });
        return { count };
    }
}
exports.ElasticsearchPingsAdapter = ElasticsearchPingsAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvYWRhcHRlcnMvcGluZ3MvZWxhc3RpY3NlYXJjaF9waW5nc19hZGFwdGVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cHRpbWUvc2VydmVyL2xpYi9hZGFwdGVycy9waW5ncy9lbGFzdGljc2VhcmNoX3BpbmdzX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILG1DQUE2QjtBQUM3Qiw0REFBNEI7QUFDNUIsNERBQTJEO0FBRTNELHlDQUE4RTtBQUk5RSxNQUFhLHlCQUF5QjtJQUdwQyxZQUFZLFFBQXlCO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTSxDQUNqQixPQUFZLEVBQ1osY0FBc0IsRUFDdEIsWUFBb0IsRUFDcEIsU0FBeUIsRUFDekIsTUFBc0IsRUFDdEIsSUFBb0IsRUFDcEIsSUFBb0I7UUFFcEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDbkYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ3ZCLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbEQ7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QUE3TEQsOERBNkxDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgZ2V0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IElOREVYX05BTUVTIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBEb2NDb3VudCwgSGlzdG9ncmFtRGF0YVBvaW50LCBQaW5nLCBQaW5nUmVzdWx0cyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9ncmFwaHFsL3R5cGVzJztcbmltcG9ydCB7IGZvcm1hdEVzQnVja2V0c0Zvckhpc3RvZ3JhbSwgZ2V0RmlsdGVyRnJvbU11c3QgfSBmcm9tICcuLi8uLi9oZWxwZXInO1xuaW1wb3J0IHsgRGF0YWJhc2VBZGFwdGVyLCBIaXN0b2dyYW1RdWVyeVJlc3VsdCB9IGZyb20gJy4uL2RhdGFiYXNlJztcbmltcG9ydCB7IFVNUGluZ3NBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIEVsYXN0aWNzZWFyY2hQaW5nc0FkYXB0ZXIgaW1wbGVtZW50cyBVTVBpbmdzQWRhcHRlciB7XG4gIHByaXZhdGUgZGF0YWJhc2U6IERhdGFiYXNlQWRhcHRlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhYmFzZTogRGF0YWJhc2VBZGFwdGVyKSB7XG4gICAgdGhpcy5kYXRhYmFzZSA9IGRhdGFiYXNlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEFsbChcbiAgICByZXF1ZXN0OiBhbnksXG4gICAgZGF0ZVJhbmdlU3RhcnQ6IHN0cmluZyxcbiAgICBkYXRlUmFuZ2VFbmQ6IHN0cmluZyxcbiAgICBtb25pdG9ySWQ/OiBzdHJpbmcgfCBudWxsLFxuICAgIHN0YXR1cz86IHN0cmluZyB8IG51bGwsXG4gICAgc29ydD86IHN0cmluZyB8IG51bGwsXG4gICAgc2l6ZT86IG51bWJlciB8IG51bGxcbiAgKTogUHJvbWlzZTxQaW5nUmVzdWx0cz4ge1xuICAgIGNvbnN0IHNvcnRQYXJhbSA9IHNvcnQgPyB7IHNvcnQ6IFt7ICdAdGltZXN0YW1wJzogeyBvcmRlcjogc29ydCB9IH1dIH0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3Qgc2l6ZVBhcmFtID0gc2l6ZSA/IHsgc2l6ZSB9IDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IG11c3Q6IGFueVtdID0gW107XG4gICAgaWYgKG1vbml0b3JJZCkge1xuICAgICAgbXVzdC5wdXNoKHsgdGVybTogeyAnbW9uaXRvci5pZCc6IG1vbml0b3JJZCB9IH0pO1xuICAgIH1cbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICBtdXN0LnB1c2goeyB0ZXJtOiB7ICdtb25pdG9yLnN0YXR1cyc6IHN0YXR1cyB9IH0pO1xuICAgIH1cbiAgICBjb25zdCBmaWx0ZXI6IGFueVtdID0gW3sgcmFuZ2U6IHsgJ0B0aW1lc3RhbXAnOiB7IGd0ZTogZGF0ZVJhbmdlU3RhcnQsIGx0ZTogZGF0ZVJhbmdlRW5kIH0gfSB9XTtcbiAgICBjb25zdCBxdWVyeUNvbnRleHQgPSB7IGJvb2w6IHsgbXVzdCwgZmlsdGVyIH0gfTtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBpbmRleDogSU5ERVhfTkFNRVMuSEVBUlRCRUFULFxuICAgICAgcmVzdF90b3RhbF9oaXRzX2FzX2ludDogdHJ1ZSxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAuLi5xdWVyeUNvbnRleHQsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLnNvcnRQYXJhbSxcbiAgICAgICAgLi4uc2l6ZVBhcmFtLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IHtcbiAgICAgIGhpdHM6IHsgaGl0cywgdG90YWwgfSxcbiAgICB9ID0gYXdhaXQgdGhpcy5kYXRhYmFzZS5zZWFyY2gocmVxdWVzdCwgcGFyYW1zKTtcblxuICAgIGNvbnN0IHBpbmdzOiBQaW5nW10gPSBoaXRzLm1hcCgoeyBfc291cmNlIH06IGFueSkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gX3NvdXJjZVsnQHRpbWVzdGFtcCddO1xuICAgICAgcmV0dXJuIHsgdGltZXN0YW1wLCAuLi5fc291cmNlIH07XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN1bHRzOiBQaW5nUmVzdWx0cyA9IHtcbiAgICAgIHRvdGFsLFxuICAgICAgcGluZ3MsXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldExhdGVzdE1vbml0b3JEb2NzKFxuICAgIHJlcXVlc3Q6IGFueSxcbiAgICBkYXRlUmFuZ2VTdGFydDogc3RyaW5nLFxuICAgIGRhdGVSYW5nZUVuZDogc3RyaW5nLFxuICAgIG1vbml0b3JJZD86IHN0cmluZyB8IG51bGxcbiAgKTogUHJvbWlzZTxQaW5nW10+IHtcbiAgICBjb25zdCBtdXN0OiBhbnlbXSA9IFtdO1xuICAgIGlmIChtb25pdG9ySWQpIHtcbiAgICAgIG11c3QucHVzaCh7IHRlcm06IHsgJ21vbml0b3IuaWQnOiBtb25pdG9ySWQgfSB9KTtcbiAgICB9XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgaW5kZXg6IElOREVYX05BTUVTLkhFQVJUQkVBVCxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICBib29sOiB7XG4gICAgICAgICAgICBtdXN0OiBtdXN0Lmxlbmd0aCA/IFsuLi5tdXN0XSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgICAgICAgICAgICBndGU6IGRhdGVSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBsdGU6IGRhdGVSYW5nZUVuZCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWdnczoge1xuICAgICAgICAgIGJ5X2lkOiB7XG4gICAgICAgICAgICB0ZXJtczoge1xuICAgICAgICAgICAgICBmaWVsZDogJ21vbml0b3IuaWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFnZ3M6IHtcbiAgICAgICAgICAgICAgbGF0ZXN0OiB7XG4gICAgICAgICAgICAgICAgdG9wX2hpdHM6IHtcbiAgICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICAgICAgICAgICdAdGltZXN0YW1wJzogeyBvcmRlcjogJ2Rlc2MnIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgY29uc3Qge1xuICAgICAgYWdncmVnYXRpb25zOiB7XG4gICAgICAgIGJ5X2lkOiB7IGJ1Y2tldHMgfSxcbiAgICAgIH0sXG4gICAgfSA9IGF3YWl0IHRoaXMuZGF0YWJhc2Uuc2VhcmNoKHJlcXVlc3QsIHBhcmFtcyk7XG5cbiAgICAvLyBAdHMtaWdub3JlIFRPRE8gZml4IGRlc3RydWN0dXJpbmcgaW1wbGljaXQgYW55XG4gICAgcmV0dXJuIGJ1Y2tldHMubWFwKCh7IGxhdGVzdDogeyBoaXRzOiB7IGhpdHMgfSB9IH0pID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IGhpdHNbMF0uX3NvdXJjZVtgQHRpbWVzdGFtcGBdO1xuICAgICAgY29uc3QgbW9tZW50VHMgPSBtb21lbnQodGltZXN0YW1wKTtcbiAgICAgIGNvbnN0IG1pbGxpc0Zyb21Ob3cgPSBtb21lbnQoKS5kaWZmKG1vbWVudFRzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmhpdHNbMF0uX3NvdXJjZSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICBtaWxsaXNGcm9tTm93LFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRQaW5nSGlzdG9ncmFtKFxuICAgIHJlcXVlc3Q6IGFueSxcbiAgICBkYXRlUmFuZ2VTdGFydDogc3RyaW5nLFxuICAgIGRhdGVSYW5nZUVuZDogc3RyaW5nLFxuICAgIGZpbHRlcnM/OiBzdHJpbmcgfCBudWxsXG4gICk6IFByb21pc2U8SGlzdG9ncmFtRGF0YVBvaW50W10+IHtcbiAgICBjb25zdCBxdWVyeSA9IGdldEZpbHRlckZyb21NdXN0KGRhdGVSYW5nZVN0YXJ0LCBkYXRlUmFuZ2VFbmQsIGZpbHRlcnMpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGluZGV4OiBJTkRFWF9OQU1FUy5IRUFSVEJFQVQsXG4gICAgICByZXN0X3RvdGFsX2hpdHNfYXNfaW50OiB0cnVlLFxuICAgICAgYm9keToge1xuICAgICAgICBxdWVyeSxcbiAgICAgICAgc2l6ZTogMCxcbiAgICAgICAgYWdnczoge1xuICAgICAgICAgIHRpbWVzZXJpZXM6IHtcbiAgICAgICAgICAgIGF1dG9fZGF0ZV9oaXN0b2dyYW06IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdAdGltZXN0YW1wJyxcbiAgICAgICAgICAgICAgYnVja2V0czogNTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWdnczoge1xuICAgICAgICAgICAgICBkb3duOiB7XG4gICAgICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgICB0ZXJtOiB7XG4gICAgICAgICAgICAgICAgICAgICdtb25pdG9yLnN0YXR1cyc6ICdkb3duJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgICAgICAgICBidWNrZXRfY291bnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZGluYWxpdHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ21vbml0b3IuaWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBidWNrZXRfdG90YWw6IHtcbiAgICAgICAgICAgICAgICBjYXJkaW5hbGl0eToge1xuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdtb25pdG9yLmlkJyxcbiAgICAgICAgICAgICAgICAgIHByZWNpc2lvbl90aHJlc2hvbGQ6IDIwMDAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmRhdGFiYXNlLnNlYXJjaChyZXF1ZXN0LCBwYXJhbXMpO1xuICAgIGNvbnN0IGJ1Y2tldHM6IEhpc3RvZ3JhbVF1ZXJ5UmVzdWx0W10gPSBnZXQocmVzdWx0LCAnYWdncmVnYXRpb25zLnRpbWVzZXJpZXMuYnVja2V0cycsIFtdKTtcbiAgICBjb25zdCBtYXBwZWRCdWNrZXRzID0gYnVja2V0cy5tYXAoYnVja2V0ID0+IHtcbiAgICAgIGNvbnN0IGtleTogbnVtYmVyID0gZ2V0KGJ1Y2tldCwgJ2tleScpO1xuICAgICAgY29uc3QgdG90YWw6IG51bWJlciA9IGdldChidWNrZXQsICdidWNrZXRfdG90YWwudmFsdWUnKTtcbiAgICAgIGNvbnN0IGRvd25Db3VudDogbnVtYmVyID0gZ2V0KGJ1Y2tldCwgJ2Rvd24uYnVja2V0X2NvdW50LnZhbHVlJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXksXG4gICAgICAgIGRvd25Db3VudCxcbiAgICAgICAgdXBDb3VudDogdG90YWwgLSBkb3duQ291bnQsXG4gICAgICAgIHk6IDEsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvcm1hdEVzQnVja2V0c0Zvckhpc3RvZ3JhbShtYXBwZWRCdWNrZXRzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXREb2NDb3VudChyZXF1ZXN0OiBhbnkpOiBQcm9taXNlPERvY0NvdW50PiB7XG4gICAgY29uc3QgeyBjb3VudCB9ID0gYXdhaXQgdGhpcy5kYXRhYmFzZS5jb3VudChyZXF1ZXN0LCB7IGluZGV4OiBJTkRFWF9OQU1FUy5IRUFSVEJFQVQgfSk7XG5cbiAgICByZXR1cm4geyBjb3VudCB9O1xuICB9XG59XG4iXX0=