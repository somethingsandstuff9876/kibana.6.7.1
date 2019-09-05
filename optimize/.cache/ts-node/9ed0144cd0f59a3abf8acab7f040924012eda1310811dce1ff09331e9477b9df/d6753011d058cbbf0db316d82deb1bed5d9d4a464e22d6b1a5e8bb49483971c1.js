"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const d3_time_1 = require("d3-time");
const first_1 = tslib_1.__importDefault(require("lodash/fp/first"));
const get_1 = tslib_1.__importDefault(require("lodash/fp/get"));
const has_1 = tslib_1.__importDefault(require("lodash/fp/has"));
const zip_1 = tslib_1.__importDefault(require("lodash/fp/zip"));
const time_1 = require("../../../../common/time");
const DAY_MILLIS = 24 * 60 * 60 * 1000;
const LOOKUP_OFFSETS = [0, 1, 7, 30, 365, 10000, Infinity].map(days => days * DAY_MILLIS);
const TIMESTAMP_FORMAT = 'epoch_millis';
class InfraKibanaLogEntriesAdapter {
    constructor(framework) {
        this.framework = framework;
    }
    async getAdjacentLogEntryDocuments(request, sourceConfiguration, fields, start, direction, maxCount, filterQuery, highlightQuery) {
        if (maxCount <= 0) {
            return [];
        }
        const intervals = getLookupIntervals(start.time, direction);
        let documents = [];
        for (const [intervalStart, intervalEnd] of intervals) {
            if (documents.length >= maxCount) {
                break;
            }
            const documentsInInterval = await this.getLogEntryDocumentsBetween(request, sourceConfiguration, fields, intervalStart, intervalEnd, documents.length > 0 ? documents[documents.length - 1].key : start, maxCount - documents.length, filterQuery, highlightQuery);
            documents = [...documents, ...documentsInInterval];
        }
        return direction === 'asc' ? documents : documents.reverse();
    }
    async getContainedLogEntryDocuments(request, sourceConfiguration, fields, start, end, filterQuery, highlightQuery) {
        const documents = await this.getLogEntryDocumentsBetween(request, sourceConfiguration, fields, start.time, end.time, start, 10000, filterQuery, highlightQuery);
        return documents.filter(document => time_1.compareTimeKeys(document.key, end) < 0);
    }
    async getContainedLogSummaryBuckets(request, sourceConfiguration, start, end, bucketSize, filterQuery) {
        const bucketIntervalStarts = d3_time_1.timeMilliseconds(new Date(start), new Date(end), bucketSize);
        const query = {
            allowNoIndices: true,
            index: sourceConfiguration.logAlias,
            ignoreUnavailable: true,
            body: {
                aggregations: {
                    count_by_date: {
                        date_range: {
                            field: sourceConfiguration.fields.timestamp,
                            format: TIMESTAMP_FORMAT,
                            ranges: bucketIntervalStarts.map(bucketIntervalStart => ({
                                from: bucketIntervalStart.getTime(),
                                to: bucketIntervalStart.getTime() + bucketSize,
                            })),
                        },
                    },
                },
                query: {
                    bool: {
                        filter: [
                            ...createQueryFilterClauses(filterQuery),
                            {
                                range: {
                                    [sourceConfiguration.fields.timestamp]: {
                                        gte: start,
                                        lte: end,
                                        format: TIMESTAMP_FORMAT,
                                    },
                                },
                            },
                        ],
                    },
                },
                size: 0,
            },
        };
        const response = await this.framework.callWithRequest(request, 'search', query);
        return response.aggregations && response.aggregations.count_by_date
            ? response.aggregations.count_by_date.buckets
            : [];
    }
    async getLogItem(request, id, sourceConfiguration) {
        const search = (searchOptions) => this.framework.callWithRequest(request, 'search', searchOptions);
        const params = {
            index: sourceConfiguration.logAlias,
            terminate_after: 1,
            body: {
                size: 1,
                query: {
                    ids: {
                        values: [id],
                    },
                },
            },
        };
        const response = await search(params);
        const document = first_1.default(response.hits.hits);
        if (!document) {
            throw new Error('Document not found');
        }
        return document;
    }
    async getLogEntryDocumentsBetween(request, sourceConfiguration, fields, start, end, after, maxCount, filterQuery, highlightQuery) {
        if (maxCount <= 0) {
            return [];
        }
        const sortDirection = start <= end ? 'asc' : 'desc';
        const startRange = {
            [sortDirection === 'asc' ? 'gte' : 'lte']: start,
        };
        const endRange = end === Infinity
            ? {}
            : {
                [sortDirection === 'asc' ? 'lte' : 'gte']: end,
            };
        const highlightClause = highlightQuery
            ? {
                highlight: {
                    boundary_scanner: 'word',
                    fields: fields.reduce((highlightFieldConfigs, fieldName) => ({
                        ...highlightFieldConfigs,
                        [fieldName]: {},
                    }), {}),
                    fragment_size: 1,
                    number_of_fragments: 100,
                    post_tags: [''],
                    pre_tags: [''],
                },
            }
            : {};
        const searchAfterClause = time_1.isTimeKey(after)
            ? {
                search_after: [after.time, after.tiebreaker],
            }
            : {};
        const query = {
            allowNoIndices: true,
            index: sourceConfiguration.logAlias,
            ignoreUnavailable: true,
            body: {
                query: {
                    bool: {
                        filter: [
                            ...createQueryFilterClauses(filterQuery),
                            {
                                range: {
                                    [sourceConfiguration.fields.timestamp]: {
                                        ...startRange,
                                        ...endRange,
                                        format: TIMESTAMP_FORMAT,
                                    },
                                },
                            },
                        ],
                    },
                },
                ...highlightClause,
                ...searchAfterClause,
                _source: fields,
                size: maxCount,
                sort: [
                    { [sourceConfiguration.fields.timestamp]: sortDirection },
                    { [sourceConfiguration.fields.tiebreaker]: sortDirection },
                ],
                track_total_hits: false,
            },
        };
        const response = await this.framework.callWithRequest(request, 'search', query);
        const hits = response.hits.hits;
        const documents = hits.map(convertHitToLogEntryDocument(fields));
        return documents;
    }
}
exports.InfraKibanaLogEntriesAdapter = InfraKibanaLogEntriesAdapter;
function getLookupIntervals(start, direction) {
    const offsetSign = direction === 'asc' ? 1 : -1;
    const translatedOffsets = LOOKUP_OFFSETS.map(offset => start + offset * offsetSign);
    const intervals = zip_1.default(translatedOffsets.slice(0, -1), translatedOffsets.slice(1));
    return intervals;
}
const convertHitToLogEntryDocument = (fields) => (hit) => ({
    gid: hit._id,
    fields: fields.reduce((flattenedFields, fieldName) => has_1.default(fieldName, hit._source)
        ? {
            ...flattenedFields,
            [fieldName]: get_1.default(fieldName, hit._source),
        }
        : flattenedFields, {}),
    key: {
        time: hit.sort[0],
        tiebreaker: hit.sort[1],
    },
});
const createQueryFilterClauses = (filterQuery) => filterQuery ? [filterQuery] : [];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9sb2dfZW50cmllcy9raWJhbmFfbG9nX2VudHJpZXNfYWRhcHRlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9sb2dfZW50cmllcy9raWJhbmFfbG9nX2VudHJpZXNfYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgscUNBQTJDO0FBQzNDLG9FQUFvQztBQUNwQyxnRUFBZ0M7QUFDaEMsZ0VBQWdDO0FBQ2hDLGdFQUFnQztBQUdoQyxrREFBOEU7QUFlOUUsTUFBTSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQzFGLE1BQU0sZ0JBQWdCLEdBQUcsY0FBYyxDQUFDO0FBUXhDLE1BQWEsNEJBQTRCO0lBQ3ZDLFlBQTZCLFNBQXVDO1FBQXZDLGNBQVMsR0FBVCxTQUFTLENBQThCO0lBQUcsQ0FBQztJQUVqRSxLQUFLLENBQUMsNEJBQTRCLENBQ3ZDLE9BQThCLEVBQzlCLG1CQUE2QyxFQUM3QyxNQUFnQixFQUNoQixLQUFjLEVBQ2QsU0FBeUIsRUFDekIsUUFBZ0IsRUFDaEIsV0FBMEIsRUFDMUIsY0FBc0I7UUFFdEIsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxNQUFNLFNB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LEdBQUcsQ0FBQyxPQUFPLENBQUM7U0FDekM7UUFDSCxDQUFDLENBQUMsZUFBZSxFQUNyQixFQUErRCxDQUNoRTtJQUNELEdBQUcsRUFBRTtRQUNILElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixVQUFVLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDeEI7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLHdCQUF3QixHQUFHLENBQUMsV0FBc0MsRUFBRSxFQUFFLENBQzFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgdGltZU1pbGxpc2Vjb25kcyB9IGZyb20gJ2QzLXRpbWUnO1xuaW1wb3J0IGZpcnN0IGZyb20gJ2xvZGFzaC9mcC9maXJzdCc7XG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC9mcC9nZXQnO1xuaW1wb3J0IGhhcyBmcm9tICdsb2Rhc2gvZnAvaGFzJztcbmltcG9ydCB6aXAgZnJvbSAnbG9kYXNoL2ZwL3ppcCc7XG5cbmltcG9ydCB7IEpzb25PYmplY3QgfSBmcm9tICd4LXBhY2svcGx1Z2lucy9pbmZyYS9jb21tb24vdHlwZWRfanNvbic7XG5pbXBvcnQgeyBjb21wYXJlVGltZUtleXMsIGlzVGltZUtleSwgVGltZUtleSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi90aW1lJztcbmltcG9ydCB7XG4gIExvZ0VudHJpZXNBZGFwdGVyLFxuICBMb2dFbnRyeURvY3VtZW50LFxuICBMb2dFbnRyeVF1ZXJ5LFxufSBmcm9tICcuLi8uLi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbic7XG5pbXBvcnQgeyBJbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9zb3VyY2VzJztcbmltcG9ydCB7XG4gIEluZnJhRGF0ZVJhbmdlQWdncmVnYXRpb25CdWNrZXQsXG4gIEluZnJhRGF0ZVJhbmdlQWdncmVnYXRpb25SZXNwb25zZSxcbiAgSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICBTb3J0ZWRTZWFyY2hIaXQsXG59IGZyb20gJy4uL2ZyYW1ld29yayc7XG5pbXBvcnQgeyBJbmZyYUJhY2tlbmRGcmFtZXdvcmtBZGFwdGVyIH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcblxuY29uc3QgREFZX01JTExJUyA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5jb25zdCBMT09LVVBfT0ZGU0VUUyA9IFswLCAxLCA3LCAzMCwgMzY1LCAxMDAwMCwgSW5maW5pdHldLm1hcChkYXlzID0+IGRheXMgKiBEQVlfTUlMTElTKTtcbmNvbnN0IFRJTUVTVEFNUF9GT1JNQVQgPSAnZXBvY2hfbWlsbGlzJztcblxuaW50ZXJmYWNlIExvZ0l0ZW1IaXQge1xuICBfaW5kZXg6IHN0cmluZztcbiAgX2lkOiBzdHJpbmc7XG4gIF9zb3VyY2U6IEpzb25PYmplY3Q7XG59XG5cbmV4cG9ydCBjbGFzcyBJbmZyYUtpYmFuYUxvZ0VudHJpZXNBZGFwdGVyIGltcGxlbWVudHMgTG9nRW50cmllc0FkYXB0ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZyYW1ld29yazogSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcikge31cblxuICBwdWJsaWMgYXN5bmMgZ2V0QWRqYWNlbnRMb2dFbnRyeURvY3VtZW50cyhcbiAgICByZXF1ZXN0OiBJbmZyYUZyYW1ld29ya1JlcXVlc3QsXG4gICAgc291cmNlQ29uZmlndXJhdGlvbjogSW5mcmFTb3VyY2VDb25maWd1cmF0aW9uLFxuICAgIGZpZWxkczogc3RyaW5nW10sXG4gICAgc3RhcnQ6IFRpbWVLZXksXG4gICAgZGlyZWN0aW9uOiAnYXNjJyB8ICdkZXNjJyxcbiAgICBtYXhDb3VudDogbnVtYmVyLFxuICAgIGZpbHRlclF1ZXJ5OiBMb2dFbnRyeVF1ZXJ5LFxuICAgIGhpZ2hsaWdodFF1ZXJ5OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxMb2dFbnRyeURvY3VtZW50W10+IHtcbiAgICBpZiAobWF4Q291bnQgPD0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGludGVydmFscyA9IGdldExvb2t1cEludGVydmFscyhzdGFydC50aW1lLCBkaXJlY3Rpb24pO1xuXG4gICAgbGV0IGRvY3VtZW50czogTG9nRW50cnlEb2N1bWVudFtdID0gW107XG4gICAgZm9yIChjb25zdCBbaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxFbmRdIG9mIGludGVydmFscykge1xuICAgICAgaWYgKGRvY3VtZW50cy5sZW5ndGggPj0gbWF4Q291bnQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRvY3VtZW50c0luSW50ZXJ2YWwgPSBhd2FpdCB0aGlzLmdldExvZ0VudHJ5RG9jdW1lbnRzQmV0d2VlbihcbiAgICAgICAgcmVxdWVzdCxcbiAgICAgICAgc291cmNlQ29uZmlndXJhdGlvbixcbiAgICAgICAgZmllbGRzLFxuICAgICAgICBpbnRlcnZhbFN0YXJ0LFxuICAgICAgICBpbnRlcnZhbEVuZCxcbiAgICAgICAgZG9jdW1lbnRzLmxlbmd0aCA+IDAgPyBkb2N1bWVudHNbZG9jdW1lbnRzLmxlbmd0aCAtIDFdLmtleSA6IHN0YXJ0LFxuICAgICAgICBtYXhDb3VudCAtIGRvY3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGZpbHRlclF1ZXJ5LFxuICAgICAgICBoaWdobGlnaHRRdWVyeVxuICAgICAgKTtcblxuICAgICAgZG9jdW1lbnRzID0gWy4uLmRvY3VtZW50cywgLi4uZG9jdW1lbnRzSW5JbnRlcnZhbF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGlvbiA9PT0gJ2FzYycgPyBkb2N1bWVudHMgOiBkb2N1bWVudHMucmV2ZXJzZSgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENvbnRhaW5lZExvZ0VudHJ5RG9jdW1lbnRzKFxuICAgIHJlcXVlc3Q6IEluZnJhRnJhbWV3b3JrUmVxdWVzdCxcbiAgICBzb3VyY2VDb25maWd1cmF0aW9uOiBJbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb24sXG4gICAgZmllbGRzOiBzdHJpbmdbXSxcbiAgICBzdGFydDogVGltZUtleSxcbiAgICBlbmQ6IFRpbWVLZXksXG4gICAgZmlsdGVyUXVlcnk6IExvZ0VudHJ5UXVlcnksXG4gICAgaGlnaGxpZ2h0UXVlcnk6IHN0cmluZ1xuICApOiBQcm9taXNlPExvZ0VudHJ5RG9jdW1lbnRbXT4ge1xuICAgIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IHRoaXMuZ2V0TG9nRW50cnlEb2N1bWVudHNCZXR3ZWVuKFxuICAgICAgcmVxdWVzdCxcbiAgICAgIHNvdXJjZUNvbmZpZ3VyYXRpb24sXG4gICAgICBmaWVsZHMsXG4gICAgICBzdGFydC50aW1lLFxuICAgICAgZW5kLnRpbWUsXG4gICAgICBzdGFydCxcbiAgICAgIDEwMDAwLFxuICAgICAgZmlsdGVyUXVlcnksXG4gICAgICBoaWdobGlnaHRRdWVyeVxuICAgICk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnRzLmZpbHRlcihkb2N1bWVudCA9PiBjb21wYXJlVGltZUtleXMoZG9jdW1lbnQua2V5LCBlbmQpIDwgMCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q29udGFpbmVkTG9nU3VtbWFyeUJ1Y2tldHMoXG4gICAgcmVxdWVzdDogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICAgIHNvdXJjZUNvbmZpZ3VyYXRpb246IEluZnJhU291cmNlQ29uZmlndXJhdGlvbixcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIGVuZDogbnVtYmVyLFxuICAgIGJ1Y2tldFNpemU6IG51bWJlcixcbiAgICBmaWx0ZXJRdWVyeTogTG9nRW50cnlRdWVyeVxuICApOiBQcm9taXNlPEluZnJhRGF0ZVJhbmdlQWdncmVnYXRpb25CdWNrZXRbXT4ge1xuICAgIGNvbnN0IGJ1Y2tldEludGVydmFsU3RhcnRzID0gdGltZU1pbGxpc2Vjb25kcyhuZXcgRGF0ZShzdGFydCksIG5ldyBEYXRlKGVuZCksIGJ1Y2tldFNpemUpO1xuXG4gICAgY29uc3QgcXVlcnkgPSB7XG4gICAgICBhbGxvd05vSW5kaWNlczogdHJ1ZSxcbiAgICAgIGluZGV4OiBzb3VyY2VDb25maWd1cmF0aW9uLmxvZ0FsaWFzLFxuICAgICAgaWdub3JlVW5hdmFpbGFibGU6IHRydWUsXG4gICAgICBib2R5OiB7XG4gICAgICAgIGFnZ3JlZ2F0aW9uczoge1xuICAgICAgICAgIGNvdW50X2J5X2RhdGU6IHtcbiAgICAgICAgICAgIGRhdGVfcmFuZ2U6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IHNvdXJjZUNvbmZpZ3VyYXRpb24uZmllbGRzLnRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgZm9ybWF0OiBUSU1FU1RBTVBfRk9STUFULFxuICAgICAgICAgICAgICByYW5nZXM6IGJ1Y2tldEludGVydmFsU3RhcnRzLm1hcChidWNrZXRJbnRlcnZhbFN0YXJ0ID0+ICh7XG4gICAgICAgICAgICAgICAgZnJvbTogYnVja2V0SW50ZXJ2YWxTdGFydC5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgdG86IGJ1Y2tldEludGVydmFsU3RhcnQuZ2V0VGltZSgpICsgYnVja2V0U2l6ZSxcbiAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBxdWVyeToge1xuICAgICAgICAgIGJvb2w6IHtcbiAgICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAgICAuLi5jcmVhdGVRdWVyeUZpbHRlckNsYXVzZXMoZmlsdGVyUXVlcnkpLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgIFtzb3VyY2VDb25maWd1cmF0aW9uLmZpZWxkcy50aW1lc3RhbXBdOiB7XG4gICAgICAgICAgICAgICAgICAgIGd0ZTogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGx0ZTogZW5kLFxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFRJTUVTVEFNUF9GT1JNQVQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6IDAsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZnJhbWV3b3JrLmNhbGxXaXRoUmVxdWVzdDxcbiAgICAgIGFueSxcbiAgICAgIHsgY291bnRfYnlfZGF0ZT86IEluZnJhRGF0ZVJhbmdlQWdncmVnYXRpb25SZXNwb25zZSB9XG4gICAgPihyZXF1ZXN0LCAnc2VhcmNoJywgcXVlcnkpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucyAmJiByZXNwb25zZS5hZ2dyZWdhdGlvbnMuY291bnRfYnlfZGF0ZVxuICAgICAgPyByZXNwb25zZS5hZ2dyZWdhdGlvbnMuY291bnRfYnlfZGF0ZS5idWNrZXRzXG4gICAgICA6IFtdO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldExvZ0l0ZW0oXG4gICAgcmVxdWVzdDogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgc291cmNlQ29uZmlndXJhdGlvbjogSW5mcmFTb3VyY2VDb25maWd1cmF0aW9uXG4gICkge1xuICAgIGNvbnN0IHNlYXJjaCA9IChzZWFyY2hPcHRpb25zOiBvYmplY3QpID0+XG4gICAgICB0aGlzLmZyYW1ld29yay5jYWxsV2l0aFJlcXVlc3Q8TG9nSXRlbUhpdCwge30+KHJlcXVlc3QsICdzZWFyY2gnLCBzZWFyY2hPcHRpb25zKTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGluZGV4OiBzb3VyY2VDb25maWd1cmF0aW9uLmxvZ0FsaWFzLFxuICAgICAgdGVybWluYXRlX2FmdGVyOiAxLFxuICAgICAgYm9keToge1xuICAgICAgICBzaXplOiAxLFxuICAgICAgICBxdWVyeToge1xuICAgICAgICAgIGlkczoge1xuICAgICAgICAgICAgdmFsdWVzOiBbaWRdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlYXJjaChwYXJhbXMpO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gZmlyc3QocmVzcG9uc2UuaGl0cy5oaXRzKTtcbiAgICBpZiAoIWRvY3VtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvY3VtZW50IG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICByZXR1cm4gZG9jdW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldExvZ0VudHJ5RG9jdW1lbnRzQmV0d2VlbihcbiAgICByZXF1ZXN0OiBJbmZyYUZyYW1ld29ya1JlcXVlc3QsXG4gICAgc291cmNlQ29uZmlndXJhdGlvbjogSW5mcmFTb3VyY2VDb25maWd1cmF0aW9uLFxuICAgIGZpZWxkczogc3RyaW5nW10sXG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICBhZnRlcjogVGltZUtleSB8IG51bGwsXG4gICAgbWF4Q291bnQ6IG51bWJlcixcbiAgICBmaWx0ZXJRdWVyeT86IExvZ0VudHJ5UXVlcnksXG4gICAgaGlnaGxpZ2h0UXVlcnk/OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxMb2dFbnRyeURvY3VtZW50W10+IHtcbiAgICBpZiAobWF4Q291bnQgPD0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHNvcnREaXJlY3Rpb246ICdhc2MnIHwgJ2Rlc2MnID0gc3RhcnQgPD0gZW5kID8gJ2FzYycgOiAnZGVzYyc7XG5cbiAgICBjb25zdCBzdGFydFJhbmdlID0ge1xuICAgICAgW3NvcnREaXJlY3Rpb24gPT09ICdhc2MnID8gJ2d0ZScgOiAnbHRlJ106IHN0YXJ0LFxuICAgIH07XG4gICAgY29uc3QgZW5kUmFuZ2UgPVxuICAgICAgZW5kID09PSBJbmZpbml0eVxuICAgICAgICA/IHt9XG4gICAgICAgIDoge1xuICAgICAgICAgICAgW3NvcnREaXJlY3Rpb24gPT09ICdhc2MnID8gJ2x0ZScgOiAnZ3RlJ106IGVuZCxcbiAgICAgICAgICB9O1xuXG4gICAgY29uc3QgaGlnaGxpZ2h0Q2xhdXNlID0gaGlnaGxpZ2h0UXVlcnlcbiAgICAgID8ge1xuICAgICAgICAgIGhpZ2hsaWdodDoge1xuICAgICAgICAgICAgYm91bmRhcnlfc2Nhbm5lcjogJ3dvcmQnLFxuICAgICAgICAgICAgZmllbGRzOiBmaWVsZHMucmVkdWNlKFxuICAgICAgICAgICAgICAoaGlnaGxpZ2h0RmllbGRDb25maWdzLCBmaWVsZE5hbWUpID0+ICh7XG4gICAgICAgICAgICAgICAgLi4uaGlnaGxpZ2h0RmllbGRDb25maWdzLFxuICAgICAgICAgICAgICAgIFtmaWVsZE5hbWVdOiB7fSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIHt9XG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgZnJhZ21lbnRfc2l6ZTogMSxcbiAgICAgICAgICAgIG51bWJlcl9vZl9mcmFnbWVudHM6IDEwMCxcbiAgICAgICAgICAgIHBvc3RfdGFnczogWycnXSxcbiAgICAgICAgICAgIHByZV90YWdzOiBbJyddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIDoge307XG5cbiAgICBjb25zdCBzZWFyY2hBZnRlckNsYXVzZSA9IGlzVGltZUtleShhZnRlcilcbiAgICAgID8ge1xuICAgICAgICAgIHNlYXJjaF9hZnRlcjogW2FmdGVyLnRpbWUsIGFmdGVyLnRpZWJyZWFrZXJdLFxuICAgICAgICB9XG4gICAgICA6IHt9O1xuXG4gICAgY29uc3QgcXVlcnkgPSB7XG4gICAgICBhbGxvd05vSW5kaWNlczogdHJ1ZSxcbiAgICAgIGluZGV4OiBzb3VyY2VDb25maWd1cmF0aW9uLmxvZ0FsaWFzLFxuICAgICAgaWdub3JlVW5hdmFpbGFibGU6IHRydWUsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgZmlsdGVyOiBbXG4gICAgICAgICAgICAgIC4uLmNyZWF0ZVF1ZXJ5RmlsdGVyQ2xhdXNlcyhmaWx0ZXJRdWVyeSksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgW3NvdXJjZUNvbmZpZ3VyYXRpb24uZmllbGRzLnRpbWVzdGFtcF06IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uc3RhcnRSYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgLi4uZW5kUmFuZ2UsXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogVElNRVNUQU1QX0ZPUk1BVCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uaGlnaGxpZ2h0Q2xhdXNlLFxuICAgICAgICAuLi5zZWFyY2hBZnRlckNsYXVzZSxcbiAgICAgICAgX3NvdXJjZTogZmllbGRzLFxuICAgICAgICBzaXplOiBtYXhDb3VudCxcbiAgICAgICAgc29ydDogW1xuICAgICAgICAgIHsgW3NvdXJjZUNvbmZpZ3VyYXRpb24uZmllbGRzLnRpbWVzdGFtcF06IHNvcnREaXJlY3Rpb24gfSxcbiAgICAgICAgICB7IFtzb3VyY2VDb25maWd1cmF0aW9uLmZpZWxkcy50aWVicmVha2VyXTogc29ydERpcmVjdGlvbiB9LFxuICAgICAgICBdLFxuICAgICAgICB0cmFja190b3RhbF9oaXRzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5mcmFtZXdvcmsuY2FsbFdpdGhSZXF1ZXN0PFNvcnRlZFNlYXJjaEhpdD4oXG4gICAgICByZXF1ZXN0LFxuICAgICAgJ3NlYXJjaCcsXG4gICAgICBxdWVyeVxuICAgICk7XG4gICAgY29uc3QgaGl0cyA9IHJlc3BvbnNlLmhpdHMuaGl0cztcbiAgICBjb25zdCBkb2N1bWVudHMgPSBoaXRzLm1hcChjb252ZXJ0SGl0VG9Mb2dFbnRyeURvY3VtZW50KGZpZWxkcykpO1xuXG4gICAgcmV0dXJuIGRvY3VtZW50cztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRMb29rdXBJbnRlcnZhbHMoc3RhcnQ6IG51bWJlciwgZGlyZWN0aW9uOiAnYXNjJyB8ICdkZXNjJyk6IEFycmF5PFtudW1iZXIsIG51bWJlcl0+IHtcbiAgY29uc3Qgb2Zmc2V0U2lnbiA9IGRpcmVjdGlvbiA9PT0gJ2FzYycgPyAxIDogLTE7XG4gIGNvbnN0IHRyYW5zbGF0ZWRPZmZzZXRzID0gTE9PS1VQX09GRlNFVFMubWFwKG9mZnNldCA9PiBzdGFydCArIG9mZnNldCAqIG9mZnNldFNpZ24pO1xuICBjb25zdCBpbnRlcnZhbHMgPSB6aXAodHJhbnNsYXRlZE9mZnNldHMuc2xpY2UoMCwgLTEpLCB0cmFuc2xhdGVkT2Zmc2V0cy5zbGljZSgxKSkgYXMgQXJyYXk8XG4gICAgW251bWJlciwgbnVtYmVyXVxuICA+O1xuICByZXR1cm4gaW50ZXJ2YWxzO1xufVxuXG5jb25zdCBjb252ZXJ0SGl0VG9Mb2dFbnRyeURvY3VtZW50ID0gKGZpZWxkczogc3RyaW5nW10pID0+IChcbiAgaGl0OiBTb3J0ZWRTZWFyY2hIaXRcbik6IExvZ0VudHJ5RG9jdW1lbnQgPT4gKHtcbiAgZ2lkOiBoaXQuX2lkLFxuICBmaWVsZHM6IGZpZWxkcy5yZWR1Y2UoXG4gICAgKGZsYXR0ZW5lZEZpZWxkcywgZmllbGROYW1lKSA9PlxuICAgICAgaGFzKGZpZWxkTmFtZSwgaGl0Ll9zb3VyY2UpXG4gICAgICAgID8ge1xuICAgICAgICAgICAgLi4uZmxhdHRlbmVkRmllbGRzLFxuICAgICAgICAgICAgW2ZpZWxkTmFtZV06IGdldChmaWVsZE5hbWUsIGhpdC5fc291cmNlKSxcbiAgICAgICAgICB9XG4gICAgICAgIDogZmxhdHRlbmVkRmllbGRzLFxuICAgIHt9IGFzIHsgW2ZpZWxkTmFtZTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IG51bGwgfVxuICApLFxuICBrZXk6IHtcbiAgICB0aW1lOiBoaXQuc29ydFswXSxcbiAgICB0aWVicmVha2VyOiBoaXQuc29ydFsxXSxcbiAgfSxcbn0pO1xuXG5jb25zdCBjcmVhdGVRdWVyeUZpbHRlckNsYXVzZXMgPSAoZmlsdGVyUXVlcnk6IExvZ0VudHJ5UXVlcnkgfCB1bmRlZmluZWQpID0+XG4gIGZpbHRlclF1ZXJ5ID8gW2ZpbHRlclF1ZXJ5XSA6IFtdO1xuIl19