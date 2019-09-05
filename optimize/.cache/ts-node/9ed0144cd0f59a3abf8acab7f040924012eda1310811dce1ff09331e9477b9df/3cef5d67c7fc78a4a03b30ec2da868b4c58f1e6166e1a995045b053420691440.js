"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("../../../../common/constants");
const helper_1 = require("../../helper");
// the values for these charts are stored as μs, but should be displayed as ms
const formatChartValue = (time, chartPoint) => ({
    x: time,
    y: chartPoint.value === null ? null : chartPoint.value / 1000,
});
const formatStatusBuckets = (time, buckets, docCount) => {
    let up = null;
    let down = null;
    buckets.forEach((bucket) => {
        if (bucket.key === 'up') {
            up = bucket.doc_count;
        }
        else if (bucket.key === 'down') {
            down = bucket.doc_count;
        }
    });
    return {
        x: time,
        up,
        down,
        total: docCount,
    };
};
const getFilteredQuery = (dateRangeStart, dateRangeEnd, filters) => {
    let filtersObj;
    // TODO: handle bad JSON gracefully
    filtersObj = filters ? JSON.parse(filters) : undefined;
    const query = { ...filtersObj };
    const rangeSection = {
        range: {
            '@timestamp': {
                gte: dateRangeStart,
                lte: dateRangeEnd,
            },
        },
    };
    if (lodash_1.get(query, 'bool.must', undefined)) {
        query.bool.must.push({
            ...rangeSection,
        });
    }
    else {
        lodash_1.set(query, 'bool.must', [rangeSection]);
    }
    return query;
};
class ElasticsearchMonitorsAdapter {
    constructor(database) {
        this.database = database;
        this.database = database;
    }
    async getMonitorChartsData(request, monitorId, dateRangeStart, dateRangeEnd) {
        const query = {
            bool: {
                must: [{ term: { 'monitor.id': monitorId } }],
                filter: [{ range: { '@timestamp': { gte: dateRangeStart, lte: dateRangeEnd } } }],
            },
        };
        const aggs = {
            timeseries: {
                auto_date_histogram: {
                    field: '@timestamp',
                    buckets: 50,
                },
                aggs: {
                    max_content: { max: { field: 'http.rtt.content.us' } },
                    max_response: { max: { field: 'http.rtt.response_header.us' } },
                    max_validate: { max: { field: 'http.rtt.validate.us' } },
                    max_total: { max: { field: 'http.rtt.total.us' } },
                    max_write_request: { max: { field: 'http.rtt.write_request.us' } },
                    max_tcp_rtt: { max: { field: 'tcp.rtt.connect.us' } },
                    status: { terms: { field: 'monitor.status' } },
                    max_duration: { max: { field: 'monitor.duration.us' } },
                    min_duration: { min: { field: 'monitor.duration.us' } },
                    avg_duration: { avg: { field: 'monitor.duration.us' } },
                },
            },
        };
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            body: { query, aggs },
        };
        const { aggregations: { timeseries: { buckets }, }, } = await this.database.search(request, params);
        return buckets.map(({ key, max_content, avg_duration, max_write_request, max_validate, max_tcp_rtt, max_response, min_duration, max_total, max_duration, status, doc_count, }) => {
            return {
                maxContent: formatChartValue(key, max_content),
                avgDuration: formatChartValue(key, avg_duration),
                maxWriteRequest: formatChartValue(key, max_write_request),
                maxValidate: formatChartValue(key, max_validate),
                maxTcpRtt: formatChartValue(key, max_tcp_rtt),
                maxResponse: formatChartValue(key, max_response),
                minDuration: formatChartValue(key, min_duration),
                maxTotal: formatChartValue(key, max_total),
                maxDuration: formatChartValue(key, max_duration),
                status: formatStatusBuckets(key, status.buckets, doc_count),
            };
        });
    }
    async getSnapshotCount(request, dateRangeStart, dateRangeEnd, filter) {
        const { statusFilter, query } = helper_1.getFilteredQueryAndStatusFilter(dateRangeStart, dateRangeEnd, filter);
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            body: {
                query,
                size: 0,
                aggs: {
                    ids: {
                        composite: {
                            sources: [
                                {
                                    id: {
                                        terms: {
                                            field: 'monitor.id',
                                        },
                                    },
                                },
                            ],
                            size: 10000,
                        },
                        aggs: {
                            latest: {
                                top_hits: {
                                    sort: [
                                        {
                                            '@timestamp': { order: 'desc' },
                                        },
                                    ],
                                    size: 1,
                                },
                            },
                        },
                    },
                },
            },
        };
        let up = 0;
        let down = 0;
        let searchAfter = null;
        do {
            if (searchAfter) {
                lodash_1.set(params, 'body.aggs.ids.composite.after', searchAfter);
            }
            const queryResult = await this.database.search(request, params);
            const idBuckets = lodash_1.get(queryResult, 'aggregations.ids.buckets', []);
            idBuckets.forEach(bucket => {
                // We only get the latest doc
                const status = lodash_1.get(bucket, 'latest.hits.hits[0]._source.monitor.status', null);
                if (!statusFilter || (statusFilter && statusFilter === status)) {
                    if (status === 'up') {
                        up++;
                    }
                    else {
                        down++;
                    }
                }
            });
            searchAfter = lodash_1.get(queryResult, 'aggregations.ids.after_key');
        } while (searchAfter);
        return { up, down, total: up + down };
    }
    async getLatestMonitors(request, dateRangeStart, dateRangeEnd, filters) {
        const { statusFilter, query } = helper_1.getFilteredQueryAndStatusFilter(dateRangeStart, dateRangeEnd, filters);
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            body: {
                size: 0,
                query,
                aggs: {
                    hosts: {
                        composite: {
                            sources: [
                                {
                                    id: {
                                        terms: {
                                            field: 'monitor.id',
                                        },
                                    },
                                },
                                {
                                    port: {
                                        terms: {
                                            field: 'tcp.port',
                                            missing_bucket: true,
                                        },
                                    },
                                },
                            ],
                            size: 50,
                        },
                        aggs: {
                            latest: {
                                top_hits: {
                                    sort: [
                                        {
                                            '@timestamp': { order: 'desc' },
                                        },
                                    ],
                                    size: 1,
                                },
                            },
                            histogram: {
                                auto_date_histogram: {
                                    field: '@timestamp',
                                    buckets: 25,
                                },
                                aggs: {
                                    status: {
                                        terms: {
                                            field: 'monitor.status',
                                            size: 10,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        const httpTcpResult = await this.database.search(request, params);
        const result = lodash_1.get(httpTcpResult, 'aggregations.hosts.buckets', [])
            .map((resultBucket) => {
            const key = lodash_1.get(resultBucket, 'key');
            const buckets = lodash_1.get(resultBucket, 'histogram.buckets', []);
            const hits = lodash_1.get(resultBucket, 'latest.hits.hits', []);
            const latestStatus = lodash_1.get(hits, '[0]._source.monitor.status', undefined);
            if (statusFilter && latestStatus !== statusFilter) {
                return undefined;
            }
            const upSeries = [];
            const downSeries = [];
            // @ts-ignore TODO update typings and remove this comment
            buckets.forEach(bucket => {
                const status = lodash_1.get(bucket, 'status.buckets', []);
                // @ts-ignore TODO update typings and remove this comment
                const up = status.find(f => f.key === 'up');
                // @ts-ignore TODO update typings and remove this comment
                const down = status.find(f => f.key === 'down');
                // @ts-ignore TODO update typings and remove this comment
                upSeries.push({ x: bucket.key, y: up ? up.doc_count : null });
                // @ts-ignore TODO update typings and remove this comment
                downSeries.push({ x: bucket.key, y: down ? down.doc_count : null });
            });
            return {
                key,
                ping: {
                    ...hits[0]._source,
                    timestamp: hits[0]._source['@timestamp'],
                },
                upSeries,
                downSeries,
            };
        })
            .filter((f) => f !== undefined);
        return result;
    }
    async getFilterBar(request, dateRangeStart, dateRangeEnd) {
        const MONITOR_SOURCE_ID_KEY = 'monitor.id';
        const MONITOR_SOURCE_TCP_KEY = 'tcp.port';
        const MONITOR_SOURCE_TYPE_KEY = 'monitor.type';
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            body: {
                _source: [MONITOR_SOURCE_ID_KEY, MONITOR_SOURCE_TCP_KEY, MONITOR_SOURCE_TYPE_KEY],
                size: 1000,
                query: {
                    range: {
                        '@timestamp': {
                            gte: dateRangeStart,
                            lte: dateRangeEnd,
                        },
                    },
                },
                collapse: {
                    field: 'monitor.id',
                },
                sort: {
                    '@timestamp': 'desc',
                },
            },
        };
        const result = await this.database.search(request, params);
        const ids = [];
        const ports = new Set();
        const types = new Set();
        const hits = lodash_1.get(result, 'hits.hits', []);
        hits.forEach((hit) => {
            const key = lodash_1.get(hit, `_source.${MONITOR_SOURCE_ID_KEY}`);
            const portValue = lodash_1.get(hit, `_source.${MONITOR_SOURCE_TCP_KEY}`, undefined);
            const typeValue = lodash_1.get(hit, `_source.${MONITOR_SOURCE_TYPE_KEY}`, undefined);
            if (key) {
                ids.push(key);
            }
            if (portValue) {
                ports.add(portValue);
            }
            if (typeValue) {
                types.add(typeValue);
            }
        });
        return {
            type: Array.from(types).sort(),
            port: Array.from(ports).sort((a, b) => a - b),
            id: ids.sort(),
            status: ['up', 'down'],
        };
    }
    async getErrorsList(request, dateRangeStart, dateRangeEnd, filters) {
        const statusDown = {
            term: {
                'monitor.status': {
                    value: 'down',
                },
            },
        };
        const query = getFilteredQuery(dateRangeStart, dateRangeEnd, filters);
        if (lodash_1.get(query, 'bool.must', undefined)) {
            query.bool.must.push(statusDown);
        }
        else {
            lodash_1.set(query, 'bool.must', [{ ...statusDown }]);
        }
        const params = {
            index: constants_1.INDEX_NAMES.HEARTBEAT,
            body: {
                query,
                aggs: {
                    error_type: {
                        terms: {
                            field: 'error.type',
                        },
                        aggs: {
                            by_id: {
                                terms: {
                                    field: 'monitor.id',
                                },
                                aggs: {
                                    latest: {
                                        top_hits: {
                                            sort: [{ '@timestamp': { order: 'desc' } }],
                                            size: 1,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        const queryResult = await this.database.search(request, params);
        const errorsList = [];
        lodash_1.get(queryResult, 'aggregations.error_type.buckets', []).forEach(({ key: errorType, by_id: { buckets: monitorBuckets }, }) => {
            monitorBuckets.forEach(bucket => {
                const count = lodash_1.get(bucket, 'doc_count', null);
                const monitorId = lodash_1.get(bucket, 'key', null);
                const source = lodash_1.get(bucket, 'latest.hits.hits[0]._source', null);
                const errorMessage = lodash_1.get(source, 'error.message', null);
                const statusCode = lodash_1.get(source, 'http.response.status_code', null);
                const timestamp = lodash_1.get(source, '@timestamp', null);
                const monitorType = lodash_1.get(source, 'monitor.type', null);
                errorsList.push({
                    latestMessage: errorMessage,
                    monitorId,
                    type: errorType,
                    monitorType,
                    count,
                    statusCode,
                    timestamp,
                });
            });
        });
        return errorsList;
    }
}
exports.ElasticsearchMonitorsAdapter = ElasticsearchMonitorsAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvYWRhcHRlcnMvbW9uaXRvcnMvZWxhc3RpY3NlYXJjaF9tb25pdG9yc19hZGFwdGVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cHRpbWUvc2VydmVyL2xpYi9hZGFwdGVycy9tb25pdG9ycy9lbGFzdGljc2VhcmNoX21vbml0b3JzX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsbUNBQWtDO0FBQ2xDLDREQUEyRDtBQUUzRCx5Q0FBK0Q7QUFJL0QsOEVBQThFO0FBQzlFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFTLEVBQUUsVUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSTtDQUM5RCxDQUFDLENBQUM7QUFFSCxNQUFNLG1CQUFtQixHQUFHLENBQUMsSUFBUyxFQUFFLE9BQVksRUFBRSxRQUFhLEVBQUUsRUFBRTtJQUNyRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDZCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFFaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1FBQzlCLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDdkIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7U0FDdkI7YUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssTUFBTSxFQUFFO1lBQ2hDLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1NBQ3pC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LFlBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0RCxVQUFVLENBQUMsSUFBSSxDQUFDO29CQUNkLGFBQWEsRUFBRSxZQUFZO29CQUMzQixTQUFTO29CQUNULElBQUksRUFBRSxTQUFTO29CQUNmLFdBQVc7b0JBQ1gsS0FBSztvQkFDTCxVQUFVO29CQUNWLFNBQVM7aUJBQ1YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztRQUNGLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQTNaRCxvRUEyWkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBnZXQsIHNldCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBJTkRFWF9OQU1FUyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgRXJyb3JMaXN0SXRlbSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9ncmFwaHFsL3R5cGVzJztcbmltcG9ydCB7IGdldEZpbHRlcmVkUXVlcnlBbmRTdGF0dXNGaWx0ZXIgfSBmcm9tICcuLi8uLi9oZWxwZXInO1xuaW1wb3J0IHsgRGF0YWJhc2VBZGFwdGVyIH0gZnJvbSAnLi4vZGF0YWJhc2UnO1xuaW1wb3J0IHsgVU1Nb25pdG9yc0FkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuXG4vLyB0aGUgdmFsdWVzIGZvciB0aGVzZSBjaGFydHMgYXJlIHN0b3JlZCBhcyDOvHMsIGJ1dCBzaG91bGQgYmUgZGlzcGxheWVkIGFzIG1zXG5jb25zdCBmb3JtYXRDaGFydFZhbHVlID0gKHRpbWU6IGFueSwgY2hhcnRQb2ludDogYW55KSA9PiAoe1xuICB4OiB0aW1lLFxuICB5OiBjaGFydFBvaW50LnZhbHVlID09PSBudWxsID8gbnVsbCA6IGNoYXJ0UG9pbnQudmFsdWUgLyAxMDAwLFxufSk7XG5cbmNvbnN0IGZvcm1hdFN0YXR1c0J1Y2tldHMgPSAodGltZTogYW55LCBidWNrZXRzOiBhbnksIGRvY0NvdW50OiBhbnkpID0+IHtcbiAgbGV0IHVwID0gbnVsbDtcbiAgbGV0IGRvd24gPSBudWxsO1xuXG4gIGJ1Y2tldHMuZm9yRWFjaCgoYnVja2V0OiBhbnkpID0+IHtcbiAgICBpZiAoYnVja2V0LmtleSA9PT0gJ3VwJykge1xuICAgICAgdXAgPSBidWNrZXQuZG9jX2NvdW50O1xuICAgIH0gZWxzZSBpZiAoYnVja2V0LmtleSA9PT0gJ2Rvd24nKSB7XG4gICAgICBkb3duID0gYnVja2V0LmRvY19jb3VudDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgeDogdGltZSxcbiAgICB1cCxcbiAgICBkb3duLFxuICAgIHRvdGFsOiBkb2NDb3VudCxcbiAgfTtcbn07XG5cbmNvbnN0IGdldEZpbHRlcmVkUXVlcnkgPSAoXG4gIGRhdGVSYW5nZVN0YXJ0OiBzdHJpbmcsXG4gIGRhdGVSYW5nZUVuZDogc3RyaW5nLFxuICBmaWx0ZXJzPzogc3RyaW5nIHwgbnVsbFxuKSA9PiB7XG4gIGxldCBmaWx0ZXJzT2JqO1xuICAvLyBUT0RPOiBoYW5kbGUgYmFkIEpTT04gZ3JhY2VmdWxseVxuICBmaWx0ZXJzT2JqID0gZmlsdGVycyA/IEpTT04ucGFyc2UoZmlsdGVycykgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHF1ZXJ5ID0geyAuLi5maWx0ZXJzT2JqIH07XG4gIGNvbnN0IHJhbmdlU2VjdGlvbiA9IHtcbiAgICByYW5nZToge1xuICAgICAgJ0B0aW1lc3RhbXAnOiB7XG4gICAgICAgIGd0ZTogZGF0ZVJhbmdlU3RhcnQsXG4gICAgICAgIGx0ZTogZGF0ZVJhbmdlRW5kLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuICBpZiAoZ2V0KHF1ZXJ5LCAnYm9vbC5tdXN0JywgdW5kZWZpbmVkKSkge1xuICAgIHF1ZXJ5LmJvb2wubXVzdC5wdXNoKHtcbiAgICAgIC4uLnJhbmdlU2VjdGlvbixcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzZXQocXVlcnksICdib29sLm11c3QnLCBbcmFuZ2VTZWN0aW9uXSk7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufTtcblxuZXhwb3J0IGNsYXNzIEVsYXN0aWNzZWFyY2hNb25pdG9yc0FkYXB0ZXIgaW1wbGVtZW50cyBVTU1vbml0b3JzQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZGF0YWJhc2U6IERhdGFiYXNlQWRhcHRlcikge1xuICAgIHRoaXMuZGF0YWJhc2UgPSBkYXRhYmFzZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRNb25pdG9yQ2hhcnRzRGF0YShcbiAgICByZXF1ZXN0OiBhbnksXG4gICAgbW9uaXRvcklkOiBzdHJpbmcsXG4gICAgZGF0ZVJhbmdlU3RhcnQ6IHN0cmluZyxcbiAgICBkYXRlUmFuZ2VFbmQ6IHN0cmluZ1xuICApOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0ge1xuICAgICAgYm9vbDoge1xuICAgICAgICBtdXN0OiBbeyB0ZXJtOiB7ICdtb25pdG9yLmlkJzogbW9uaXRvcklkIH0gfV0sXG4gICAgICAgIGZpbHRlcjogW3sgcmFuZ2U6IHsgJ0B0aW1lc3RhbXAnOiB7IGd0ZTogZGF0ZVJhbmdlU3RhcnQsIGx0ZTogZGF0ZVJhbmdlRW5kIH0gfSB9XSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBhZ2dzID0ge1xuICAgICAgdGltZXNlcmllczoge1xuICAgICAgICBhdXRvX2RhdGVfaGlzdG9ncmFtOiB7XG4gICAgICAgICAgZmllbGQ6ICdAdGltZXN0YW1wJyxcbiAgICAgICAgICBidWNrZXRzOiA1MCxcbiAgICAgICAgfSxcbiAgICAgICAgYWdnczoge1xuICAgICAgICAgIG1heF9jb250ZW50OiB7IG1heDogeyBmaWVsZDogJ2h0dHAucnR0LmNvbnRlbnQudXMnIH0gfSxcbiAgICAgICAgICBtYXhfcmVzcG9uc2U6IHsgbWF4OiB7IGZpZWxkOiAnaHR0cC5ydHQucmVzcG9uc2VfaGVhZGVyLnVzJyB9IH0sXG4gICAgICAgICAgbWF4X3ZhbGlkYXRlOiB7IG1heDogeyBmaWVsZDogJ2h0dHAucnR0LnZhbGlkYXRlLnVzJyB9IH0sXG4gICAgICAgICAgbWF4X3RvdGFsOiB7IG1heDogeyBmaWVsZDogJ2h0dHAucnR0LnRvdGFsLnVzJyB9IH0sXG4gICAgICAgICAgbWF4X3dyaXRlX3JlcXVlc3Q6IHsgbWF4OiB7IGZpZWxkOiAnaHR0cC5ydHQud3JpdGVfcmVxdWVzdC51cycgfSB9LFxuICAgICAgICAgIG1heF90Y3BfcnR0OiB7IG1heDogeyBmaWVsZDogJ3RjcC5ydHQuY29ubmVjdC51cycgfSB9LFxuICAgICAgICAgIHN0YXR1czogeyB0ZXJtczogeyBmaWVsZDogJ21vbml0b3Iuc3RhdHVzJyB9IH0sXG4gICAgICAgICAgbWF4X2R1cmF0aW9uOiB7IG1heDogeyBmaWVsZDogJ21vbml0b3IuZHVyYXRpb24udXMnIH0gfSxcbiAgICAgICAgICBtaW5fZHVyYXRpb246IHsgbWluOiB7IGZpZWxkOiAnbW9uaXRvci5kdXJhdGlvbi51cycgfSB9LFxuICAgICAgICAgIGF2Z19kdXJhdGlvbjogeyBhdmc6IHsgZmllbGQ6ICdtb25pdG9yLmR1cmF0aW9uLnVzJyB9IH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgaW5kZXg6IElOREVYX05BTUVTLkhFQVJUQkVBVCxcbiAgICAgIGJvZHk6IHsgcXVlcnksIGFnZ3MgfSxcbiAgICB9O1xuXG4gICAgY29uc3Qge1xuICAgICAgYWdncmVnYXRpb25zOiB7XG4gICAgICAgIHRpbWVzZXJpZXM6IHsgYnVja2V0cyB9LFxuICAgICAgfSxcbiAgICB9ID0gYXdhaXQgdGhpcy5kYXRhYmFzZS5zZWFyY2gocmVxdWVzdCwgcGFyYW1zKTtcblxuICAgIHJldHVybiBidWNrZXRzLm1hcChcbiAgICAgICh7XG4gICAgICAgIGtleSxcbiAgICAgICAgbWF4X2NvbnRlbnQsXG4gICAgICAgIGF2Z19kdXJhdGlvbixcbiAgICAgICAgbWF4X3dyaXRlX3JlcXVlc3QsXG4gICAgICAgIG1heF92YWxpZGF0ZSxcbiAgICAgICAgbWF4X3RjcF9ydHQsXG4gICAgICAgIG1heF9yZXNwb25zZSxcbiAgICAgICAgbWluX2R1cmF0aW9uLFxuICAgICAgICBtYXhfdG90YWwsXG4gICAgICAgIG1heF9kdXJhdGlvbixcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBkb2NfY291bnQsXG4gICAgICB9OiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBtYXhDb250ZW50OiBmb3JtYXRDaGFydFZhbHVlKGtleSwgbWF4X2NvbnRlbnQpLFxuICAgICAgICAgIGF2Z0R1cmF0aW9uOiBmb3JtYXRDaGFydFZhbHVlKGtleSwgYXZnX2R1cmF0aW9uKSxcbiAgICAgICAgICBtYXhXcml0ZVJlcXVlc3Q6IGZvcm1hdENoYXJ0VmFsdWUoa2V5LCBtYXhfd3JpdGVfcmVxdWVzdCksXG4gICAgICAgICAgbWF4VmFsaWRhdGU6IGZvcm1hdENoYXJ0VmFsdWUoa2V5LCBtYXhfdmFsaWRhdGUpLFxuICAgICAgICAgIG1heFRjcFJ0dDogZm9ybWF0Q2hhcnRWYWx1ZShrZXksIG1heF90Y3BfcnR0KSxcbiAgICAgICAgICBtYXhSZXNwb25zZTogZm9ybWF0Q2hhcnRWYWx1ZShrZXksIG1heF9yZXNwb25zZSksXG4gICAgICAgICAgbWluRHVyYXRpb246IGZvcm1hdENoYXJ0VmFsdWUoa2V5LCBtaW5fZHVyYXRpb24pLFxuICAgICAgICAgIG1heFRvdGFsOiBmb3JtYXRDaGFydFZhbHVlKGtleSwgbWF4X3RvdGFsKSxcbiAgICAgICAgICBtYXhEdXJhdGlvbjogZm9ybWF0Q2hhcnRWYWx1ZShrZXksIG1heF9kdXJhdGlvbiksXG4gICAgICAgICAgc3RhdHVzOiBmb3JtYXRTdGF0dXNCdWNrZXRzKGtleSwgc3RhdHVzLmJ1Y2tldHMsIGRvY19jb3VudCksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRTbmFwc2hvdENvdW50KFxuICAgIHJlcXVlc3Q6IGFueSxcbiAgICBkYXRlUmFuZ2VTdGFydDogc3RyaW5nLFxuICAgIGRhdGVSYW5nZUVuZDogc3RyaW5nLFxuICAgIGZpbHRlcj86IHN0cmluZyB8IG51bGxcbiAgKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCB7IHN0YXR1c0ZpbHRlciwgcXVlcnkgfSA9IGdldEZpbHRlcmVkUXVlcnlBbmRTdGF0dXNGaWx0ZXIoXG4gICAgICBkYXRlUmFuZ2VTdGFydCxcbiAgICAgIGRhdGVSYW5nZUVuZCxcbiAgICAgIGZpbHRlclxuICAgICk7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgaW5kZXg6IElOREVYX05BTUVTLkhFQVJUQkVBVCxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHNpemU6IDAsXG4gICAgICAgIGFnZ3M6IHtcbiAgICAgICAgICBpZHM6IHtcbiAgICAgICAgICAgIGNvbXBvc2l0ZToge1xuICAgICAgICAgICAgICBzb3VyY2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ21vbml0b3IuaWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBzaXplOiAxMDAwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgICAgIGxhdGVzdDoge1xuICAgICAgICAgICAgICAgIHRvcF9oaXRzOiB7XG4gICAgICAgICAgICAgICAgICBzb3J0OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnQHRpbWVzdGFtcCc6IHsgb3JkZXI6ICdkZXNjJyB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGxldCB1cDogbnVtYmVyID0gMDtcbiAgICBsZXQgZG93bjogbnVtYmVyID0gMDtcbiAgICBsZXQgc2VhcmNoQWZ0ZXI6IGFueSA9IG51bGw7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoc2VhcmNoQWZ0ZXIpIHtcbiAgICAgICAgc2V0KHBhcmFtcywgJ2JvZHkuYWdncy5pZHMuY29tcG9zaXRlLmFmdGVyJywgc2VhcmNoQWZ0ZXIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWVyeVJlc3VsdCA9IGF3YWl0IHRoaXMuZGF0YWJhc2Uuc2VhcmNoKHJlcXVlc3QsIHBhcmFtcyk7XG4gICAgICBjb25zdCBpZEJ1Y2tldHMgPSBnZXQocXVlcnlSZXN1bHQsICdhZ2dyZWdhdGlvbnMuaWRzLmJ1Y2tldHMnLCBbXSk7XG5cbiAgICAgIGlkQnVja2V0cy5mb3JFYWNoKGJ1Y2tldCA9PiB7XG4gICAgICAgIC8vIFdlIG9ubHkgZ2V0IHRoZSBsYXRlc3QgZG9jXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IGdldChidWNrZXQsICdsYXRlc3QuaGl0cy5oaXRzWzBdLl9zb3VyY2UubW9uaXRvci5zdGF0dXMnLCBudWxsKTtcbiAgICAgICAgaWYgKCFzdGF0dXNGaWx0ZXIgfHwgKHN0YXR1c0ZpbHRlciAmJiBzdGF0dXNGaWx0ZXIgPT09IHN0YXR1cykpIHtcbiAgICAgICAgICBpZiAoc3RhdHVzID09PSAndXAnKSB7XG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3duKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2VhcmNoQWZ0ZXIgPSBnZXQocXVlcnlSZXN1bHQsICdhZ2dyZWdhdGlvbnMuaWRzLmFmdGVyX2tleScpO1xuICAgIH0gd2hpbGUgKHNlYXJjaEFmdGVyKTtcblxuICAgIHJldHVybiB7IHVwLCBkb3duLCB0b3RhbDogdXAgKyBkb3duIH07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0TGF0ZXN0TW9uaXRvcnMoXG4gICAgcmVxdWVzdDogYW55LFxuICAgIGRhdGVSYW5nZVN0YXJ0OiBzdHJpbmcsXG4gICAgZGF0ZVJhbmdlRW5kOiBzdHJpbmcsXG4gICAgZmlsdGVycz86IHN0cmluZyB8IG51bGxcbiAgKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCB7IHN0YXR1c0ZpbHRlciwgcXVlcnkgfSA9IGdldEZpbHRlcmVkUXVlcnlBbmRTdGF0dXNGaWx0ZXIoXG4gICAgICBkYXRlUmFuZ2VTdGFydCxcbiAgICAgIGRhdGVSYW5nZUVuZCxcbiAgICAgIGZpbHRlcnNcbiAgICApO1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGluZGV4OiBJTkRFWF9OQU1FUy5IRUFSVEJFQVQsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHNpemU6IDAsXG4gICAgICAgIHF1ZXJ5LFxuICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgaG9zdHM6IHtcbiAgICAgICAgICAgIGNvbXBvc2l0ZToge1xuICAgICAgICAgICAgICBzb3VyY2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ21vbml0b3IuaWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBvcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ3RjcC5wb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nX2J1Y2tldDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgc2l6ZTogNTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWdnczoge1xuICAgICAgICAgICAgICBsYXRlc3Q6IHtcbiAgICAgICAgICAgICAgICB0b3BfaGl0czoge1xuICAgICAgICAgICAgICAgICAgc29ydDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0B0aW1lc3RhbXAnOiB7IG9yZGVyOiAnZGVzYycgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGhpc3RvZ3JhbToge1xuICAgICAgICAgICAgICAgIGF1dG9fZGF0ZV9oaXN0b2dyYW06IHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiAnQHRpbWVzdGFtcCcsXG4gICAgICAgICAgICAgICAgICBidWNrZXRzOiAyNSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFnZ3M6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICB0ZXJtczoge1xuICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnbW9uaXRvci5zdGF0dXMnLFxuICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDEwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgaHR0cFRjcFJlc3VsdCA9IGF3YWl0IHRoaXMuZGF0YWJhc2Uuc2VhcmNoKHJlcXVlc3QsIHBhcmFtcyk7XG4gICAgY29uc3QgcmVzdWx0ID0gZ2V0KGh0dHBUY3BSZXN1bHQsICdhZ2dyZWdhdGlvbnMuaG9zdHMuYnVja2V0cycsIFtdKVxuICAgICAgLm1hcCgocmVzdWx0QnVja2V0OiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0KHJlc3VsdEJ1Y2tldCwgJ2tleScpO1xuICAgICAgICBjb25zdCBidWNrZXRzOiBhbnlbXSA9IGdldChyZXN1bHRCdWNrZXQsICdoaXN0b2dyYW0uYnVja2V0cycsIFtdKTtcbiAgICAgICAgY29uc3QgaGl0czogYW55W10gPSBnZXQocmVzdWx0QnVja2V0LCAnbGF0ZXN0LmhpdHMuaGl0cycsIFtdKTtcbiAgICAgICAgY29uc3QgbGF0ZXN0U3RhdHVzOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBnZXQoaGl0cywgJ1swXS5fc291cmNlLm1vbml0b3Iuc3RhdHVzJywgdW5kZWZpbmVkKTtcbiAgICAgICAgaWYgKHN0YXR1c0ZpbHRlciAmJiBsYXRlc3RTdGF0dXMgIT09IHN0YXR1c0ZpbHRlcikge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXBTZXJpZXM6IGFueVtdID0gW107XG4gICAgICAgIGNvbnN0IGRvd25TZXJpZXM6IGFueVtdID0gW107XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgVE9ETyB1cGRhdGUgdHlwaW5ncyBhbmQgcmVtb3ZlIHRoaXMgY29tbWVudFxuICAgICAgICBidWNrZXRzLmZvckVhY2goYnVja2V0ID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSBnZXQoYnVja2V0LCAnc3RhdHVzLmJ1Y2tldHMnLCBbXSk7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZSBUT0RPIHVwZGF0ZSB0eXBpbmdzIGFuZCByZW1vdmUgdGhpcyBjb21tZW50XG4gICAgICAgICAgY29uc3QgdXAgPSBzdGF0dXMuZmluZChmID0+IGYua2V5ID09PSAndXAnKTtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlIFRPRE8gdXBkYXRlIHR5cGluZ3MgYW5kIHJlbW92ZSB0aGlzIGNvbW1lbnRcbiAgICAgICAgICBjb25zdCBkb3duID0gc3RhdHVzLmZpbmQoZiA9PiBmLmtleSA9PT0gJ2Rvd24nKTtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlIFRPRE8gdXBkYXRlIHR5cGluZ3MgYW5kIHJlbW92ZSB0aGlzIGNvbW1lbnRcbiAgICAgICAgICB1cFNlcmllcy5wdXNoKHsgeDogYnVja2V0LmtleSwgeTogdXAgPyB1cC5kb2NfY291bnQgOiBudWxsIH0pO1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmUgVE9ETyB1cGRhdGUgdHlwaW5ncyBhbmQgcmVtb3ZlIHRoaXMgY29tbWVudFxuICAgICAgICAgIGRvd25TZXJpZXMucHVzaCh7IHg6IGJ1Y2tldC5rZXksIHk6IGRvd24gPyBkb3duLmRvY19jb3VudCA6IG51bGwgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleSxcbiAgICAgICAgICBwaW5nOiB7XG4gICAgICAgICAgICAuLi5oaXRzWzBdLl9zb3VyY2UsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IGhpdHNbMF0uX3NvdXJjZVsnQHRpbWVzdGFtcCddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXBTZXJpZXMsXG4gICAgICAgICAgZG93blNlcmllcyxcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKChmOiBhbnkpID0+IGYgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRGaWx0ZXJCYXIoXG4gICAgcmVxdWVzdDogYW55LFxuICAgIGRhdGVSYW5nZVN0YXJ0OiBzdHJpbmcsXG4gICAgZGF0ZVJhbmdlRW5kOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBNT05JVE9SX1NPVVJDRV9JRF9LRVkgPSAnbW9uaXRvci5pZCc7XG4gICAgY29uc3QgTU9OSVRPUl9TT1VSQ0VfVENQX0tFWSA9ICd0Y3AucG9ydCc7XG4gICAgY29uc3QgTU9OSVRPUl9TT1VSQ0VfVFlQRV9LRVkgPSAnbW9uaXRvci50eXBlJztcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBpbmRleDogSU5ERVhfTkFNRVMuSEVBUlRCRUFULFxuICAgICAgYm9keToge1xuICAgICAgICBfc291cmNlOiBbTU9OSVRPUl9TT1VSQ0VfSURfS0VZLCBNT05JVE9SX1NPVVJDRV9UQ1BfS0VZLCBNT05JVE9SX1NPVVJDRV9UWVBFX0tFWV0sXG4gICAgICAgIHNpemU6IDEwMDAsXG4gICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgICAgICBndGU6IGRhdGVSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgICBsdGU6IGRhdGVSYW5nZUVuZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgY29sbGFwc2U6IHtcbiAgICAgICAgICBmaWVsZDogJ21vbml0b3IuaWQnLFxuICAgICAgICB9LFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgJ0B0aW1lc3RhbXAnOiAnZGVzYycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5kYXRhYmFzZS5zZWFyY2gocmVxdWVzdCwgcGFyYW1zKTtcbiAgICBjb25zdCBpZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgcG9ydHMgPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICBjb25zdCB0eXBlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgY29uc3QgaGl0cyA9IGdldChyZXN1bHQsICdoaXRzLmhpdHMnLCBbXSk7XG4gICAgaGl0cy5mb3JFYWNoKChoaXQ6IGFueSkgPT4ge1xuICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBnZXQoaGl0LCBgX3NvdXJjZS4ke01PTklUT1JfU09VUkNFX0lEX0tFWX1gKTtcbiAgICAgIGNvbnN0IHBvcnRWYWx1ZTogbnVtYmVyIHwgdW5kZWZpbmVkID0gZ2V0KFxuICAgICAgICBoaXQsXG4gICAgICAgIGBfc291cmNlLiR7TU9OSVRPUl9TT1VSQ0VfVENQX0tFWX1gLFxuICAgICAgICB1bmRlZmluZWRcbiAgICAgICk7XG4gICAgICBjb25zdCB0eXBlVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGdldChcbiAgICAgICAgaGl0LFxuICAgICAgICBgX3NvdXJjZS4ke01PTklUT1JfU09VUkNFX1RZUEVfS0VZfWAsXG4gICAgICAgIHVuZGVmaW5lZFxuICAgICAgKTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBpZHMucHVzaChrZXkpO1xuICAgICAgfVxuICAgICAgaWYgKHBvcnRWYWx1ZSkge1xuICAgICAgICBwb3J0cy5hZGQocG9ydFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlVmFsdWUpIHtcbiAgICAgICAgdHlwZXMuYWRkKHR5cGVWYWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogQXJyYXkuZnJvbSh0eXBlcykuc29ydCgpLFxuICAgICAgcG9ydDogQXJyYXkuZnJvbShwb3J0cykuc29ydCgoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IGEgLSBiKSxcbiAgICAgIGlkOiBpZHMuc29ydCgpLFxuICAgICAgc3RhdHVzOiBbJ3VwJywgJ2Rvd24nXSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEVycm9yc0xpc3QoXG4gICAgcmVxdWVzdDogYW55LFxuICAgIGRhdGVSYW5nZVN0YXJ0OiBzdHJpbmcsXG4gICAgZGF0ZVJhbmdlRW5kOiBzdHJpbmcsXG4gICAgZmlsdGVycz86IHN0cmluZyB8IG51bGxcbiAgKTogUHJvbWlzZTxFcnJvckxpc3RJdGVtW10+IHtcbiAgICBjb25zdCBzdGF0dXNEb3duID0ge1xuICAgICAgdGVybToge1xuICAgICAgICAnbW9uaXRvci5zdGF0dXMnOiB7XG4gICAgICAgICAgdmFsdWU6ICdkb3duJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBxdWVyeSA9IGdldEZpbHRlcmVkUXVlcnkoZGF0ZVJhbmdlU3RhcnQsIGRhdGVSYW5nZUVuZCwgZmlsdGVycyk7XG4gICAgaWYgKGdldChxdWVyeSwgJ2Jvb2wubXVzdCcsIHVuZGVmaW5lZCkpIHtcbiAgICAgIHF1ZXJ5LmJvb2wubXVzdC5wdXNoKHN0YXR1c0Rvd24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXQocXVlcnksICdib29sLm11c3QnLCBbeyAuLi5zdGF0dXNEb3duIH1dKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBpbmRleDogSU5ERVhfTkFNRVMuSEVBUlRCRUFULFxuICAgICAgYm9keToge1xuICAgICAgICBxdWVyeSxcbiAgICAgICAgYWdnczoge1xuICAgICAgICAgIGVycm9yX3R5cGU6IHtcbiAgICAgICAgICAgIHRlcm1zOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnZXJyb3IudHlwZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWdnczoge1xuICAgICAgICAgICAgICBieV9pZDoge1xuICAgICAgICAgICAgICAgIHRlcm1zOiB7XG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ21vbml0b3IuaWQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWdnczoge1xuICAgICAgICAgICAgICAgICAgbGF0ZXN0OiB7XG4gICAgICAgICAgICAgICAgICAgIHRvcF9oaXRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgc29ydDogW3sgJ0B0aW1lc3RhbXAnOiB7IG9yZGVyOiAnZGVzYycgfSB9XSxcbiAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcXVlcnlSZXN1bHQgPSBhd2FpdCB0aGlzLmRhdGFiYXNlLnNlYXJjaChyZXF1ZXN0LCBwYXJhbXMpO1xuICAgIGNvbnN0IGVycm9yc0xpc3Q6IEVycm9yTGlzdEl0ZW1bXSA9IFtdO1xuICAgIGdldChxdWVyeVJlc3VsdCwgJ2FnZ3JlZ2F0aW9ucy5lcnJvcl90eXBlLmJ1Y2tldHMnLCBbXSkuZm9yRWFjaChcbiAgICAgICh7XG4gICAgICAgIGtleTogZXJyb3JUeXBlLFxuICAgICAgICBieV9pZDogeyBidWNrZXRzOiBtb25pdG9yQnVja2V0cyB9LFxuICAgICAgfToge1xuICAgICAgICBrZXk6IHN0cmluZztcbiAgICAgICAgYnlfaWQ6IHsgYnVja2V0czogYW55W10gfTtcbiAgICAgIH0pID0+IHtcbiAgICAgICAgbW9uaXRvckJ1Y2tldHMuZm9yRWFjaChidWNrZXQgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvdW50ID0gZ2V0KGJ1Y2tldCwgJ2RvY19jb3VudCcsIG51bGwpO1xuICAgICAgICAgIGNvbnN0IG1vbml0b3JJZCA9IGdldChidWNrZXQsICdrZXknLCBudWxsKTtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBnZXQoYnVja2V0LCAnbGF0ZXN0LmhpdHMuaGl0c1swXS5fc291cmNlJywgbnVsbCk7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZ2V0KHNvdXJjZSwgJ2Vycm9yLm1lc3NhZ2UnLCBudWxsKTtcbiAgICAgICAgICBjb25zdCBzdGF0dXNDb2RlID0gZ2V0KHNvdXJjZSwgJ2h0dHAucmVzcG9uc2Uuc3RhdHVzX2NvZGUnLCBudWxsKTtcbiAgICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBnZXQoc291cmNlLCAnQHRpbWVzdGFtcCcsIG51bGwpO1xuICAgICAgICAgIGNvbnN0IG1vbml0b3JUeXBlID0gZ2V0KHNvdXJjZSwgJ21vbml0b3IudHlwZScsIG51bGwpO1xuICAgICAgICAgIGVycm9yc0xpc3QucHVzaCh7XG4gICAgICAgICAgICBsYXRlc3RNZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgICAgICBtb25pdG9ySWQsXG4gICAgICAgICAgICB0eXBlOiBlcnJvclR5cGUsXG4gICAgICAgICAgICBtb25pdG9yVHlwZSxcbiAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgc3RhdHVzQ29kZSxcbiAgICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gZXJyb3JzTGlzdDtcbiAgfVxufVxuIl19