"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const create_base_path_1 = require("../../lib/create_base_path");
const get_bucket_size_in_seconds_1 = require("../../lib/get_bucket_size_in_seconds");
function getBucketKey(value, interval, offset = 0) {
    return Math.floor((value - offset) / interval) * interval + offset;
}
exports.getBucketKey = getBucketKey;
exports.calculateOffsetInSeconds = (end, interval) => {
    const bucketKey = getBucketKey(end, interval);
    return Math.floor(end - interval - bucketKey);
};
exports.dateHistogramProcessor = (options) => {
    return (doc) => {
        const result = lodash_1.cloneDeep(doc);
        const { timerange, sourceConfiguration, groupBy } = options.nodeOptions;
        const bucketSizeInSeconds = get_bucket_size_in_seconds_1.getBucketSizeInSeconds(timerange.interval);
        const path = create_base_path_1.createBasePath(groupBy).concat('timeseries');
        const bucketOffset = exports.calculateOffsetInSeconds(timerange.from, bucketSizeInSeconds);
        const offset = `${Math.floor(bucketOffset)}s`;
        lodash_1.set(result, path, {
            date_histogram: {
                field: sourceConfiguration.fields.timestamp,
                interval: timerange.interval,
                min_doc_count: 0,
                offset,
                extended_bounds: {
                    min: timerange.from,
                    max: timerange.to,
                },
            },
            aggs: {},
        });
        return result;
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9wcm9jZXNzb3JzL2xhc3QvZGF0ZV9oaXN0b2dyYW1fcHJvY2Vzc29yLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL25vZGVzL3Byb2Nlc3NvcnMvbGFzdC9kYXRlX2hpc3RvZ3JhbV9wcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsbUNBQXdDO0FBRXhDLGlFQUE0RDtBQUM1RCxxRkFBOEU7QUFFOUUsU0FBZ0IsWUFBWSxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLE1BQU0sR0FBRyxDQUFDO0lBQ3RFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3JFLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsd0JBQXdCLEdBQUcsQ0FBQyxHQUFXLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ3hFLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDaEQsQ0FBQyxDQUFDO0FBRVcsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLE9BQW9DLEVBQUUsRUFBRTtJQUM3RSxPQUFPLENBQUMsR0FBc0IsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3hFLE1BQU0sbUJBQW1CLEdBQUcsbURBQXNCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sSUFBSSxHQUFHLGlDQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFELE1BQU0sWUFBWSxHQUFHLGdDQUF3QixDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUNuRixNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQztRQUM5QyxZQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtZQUNoQixjQUFjLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTO2dCQUMzQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7Z0JBQzVCLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixNQUFNO2dCQUNOLGVBQWUsRUFBRTtvQkFDZixHQUFHLEVBQUUsU0FBUyxDQUFDLElBQUk7b0JBQ25CLEdBQUcsRUFBRSxTQUFTLENBQUMsRUFBRTtpQkFDbEI7YUFDRjtZQUNELElBQUksRUFBRSxFQUFFO1NBQ1QsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgY2xvbmVEZWVwLCBzZXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgSW5mcmFFU1NlYXJjaEJvZHksIEluZnJhUHJvY2Vzb3JSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuaW1wb3J0IHsgY3JlYXRlQmFzZVBhdGggfSBmcm9tICcuLi8uLi9saWIvY3JlYXRlX2Jhc2VfcGF0aCc7XG5pbXBvcnQgeyBnZXRCdWNrZXRTaXplSW5TZWNvbmRzIH0gZnJvbSAnLi4vLi4vbGliL2dldF9idWNrZXRfc2l6ZV9pbl9zZWNvbmRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJ1Y2tldEtleSh2YWx1ZTogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKCh2YWx1ZSAtIG9mZnNldCkgLyBpbnRlcnZhbCkgKiBpbnRlcnZhbCArIG9mZnNldDtcbn1cblxuZXhwb3J0IGNvbnN0IGNhbGN1bGF0ZU9mZnNldEluU2Vjb25kcyA9IChlbmQ6IG51bWJlciwgaW50ZXJ2YWw6IG51bWJlcikgPT4ge1xuICBjb25zdCBidWNrZXRLZXkgPSBnZXRCdWNrZXRLZXkoZW5kLCBpbnRlcnZhbCk7XG4gIHJldHVybiBNYXRoLmZsb29yKGVuZCAtIGludGVydmFsIC0gYnVja2V0S2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBkYXRlSGlzdG9ncmFtUHJvY2Vzc29yID0gKG9wdGlvbnM6IEluZnJhUHJvY2Vzb3JSZXF1ZXN0T3B0aW9ucykgPT4ge1xuICByZXR1cm4gKGRvYzogSW5mcmFFU1NlYXJjaEJvZHkpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAoZG9jKTtcbiAgICBjb25zdCB7IHRpbWVyYW5nZSwgc291cmNlQ29uZmlndXJhdGlvbiwgZ3JvdXBCeSB9ID0gb3B0aW9ucy5ub2RlT3B0aW9ucztcbiAgICBjb25zdCBidWNrZXRTaXplSW5TZWNvbmRzID0gZ2V0QnVja2V0U2l6ZUluU2Vjb25kcyh0aW1lcmFuZ2UuaW50ZXJ2YWwpO1xuICAgIGNvbnN0IHBhdGggPSBjcmVhdGVCYXNlUGF0aChncm91cEJ5KS5jb25jYXQoJ3RpbWVzZXJpZXMnKTtcbiAgICBjb25zdCBidWNrZXRPZmZzZXQgPSBjYWxjdWxhdGVPZmZzZXRJblNlY29uZHModGltZXJhbmdlLmZyb20sIGJ1Y2tldFNpemVJblNlY29uZHMpO1xuICAgIGNvbnN0IG9mZnNldCA9IGAke01hdGguZmxvb3IoYnVja2V0T2Zmc2V0KX1zYDtcbiAgICBzZXQocmVzdWx0LCBwYXRoLCB7XG4gICAgICBkYXRlX2hpc3RvZ3JhbToge1xuICAgICAgICBmaWVsZDogc291cmNlQ29uZmlndXJhdGlvbi5maWVsZHMudGltZXN0YW1wLFxuICAgICAgICBpbnRlcnZhbDogdGltZXJhbmdlLmludGVydmFsLFxuICAgICAgICBtaW5fZG9jX2NvdW50OiAwLFxuICAgICAgICBvZmZzZXQsXG4gICAgICAgIGV4dGVuZGVkX2JvdW5kczoge1xuICAgICAgICAgIG1pbjogdGltZXJhbmdlLmZyb20sXG4gICAgICAgICAgbWF4OiB0aW1lcmFuZ2UudG8sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYWdnczoge30sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iXX0=