"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../common/constants");
async function calculateBucketSize(serviceName, transactionName, transactionType, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const params = {
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 0,
            query: {
                bool: {
                    filter: [
                        { term: { [constants_1.SERVICE_NAME]: serviceName } },
                        { term: { [constants_1.TRANSACTION_TYPE]: transactionType } },
                        { term: { [`${constants_1.TRANSACTION_NAME}.keyword`]: transactionName } },
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
                stats: {
                    extended_stats: {
                        field: constants_1.TRANSACTION_DURATION
                    }
                }
            }
        }
    };
    if (esFilterQuery) {
        params.body.query.bool.filter.push(esFilterQuery);
    }
    const resp = await client('search', params);
    const minBucketSize = config.get('xpack.apm.minimumBucketSize');
    const bucketTargetCount = config.get('xpack.apm.bucketTargetCount');
    const max = resp.aggregations.stats.max;
    const bucketSize = Math.floor(max / bucketTargetCount);
    return bucketSize > minBucketSize ? bucketSize : minBucketSize;
}
exports.calculateBucketSize = calculateBucketSize;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2Rpc3RyaWJ1dGlvbi9jYWxjdWxhdGVfYnVja2V0X3NpemUudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL3RyYW5zYWN0aW9ucy9kaXN0cmlidXRpb24vY2FsY3VsYXRlX2J1Y2tldF9zaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUdILDREQUtzQztBQUcvQixLQUFLLFVBQVUsbUJBQW1CLENBQ3ZDLFdBQW1CLEVBQ25CLGVBQXVCLEVBQ3ZCLGVBQXVCLEVBQ3ZCLEtBQVk7SUFFWixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUU1RCxNQUFNLE1BQU0sR0FBaUI7UUFDM0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7UUFDL0MsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRTt3QkFDTixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsd0JBQVksQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFO3dCQUN6QyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsNEJBQWdCLENBQUMsRUFBRSxlQUFlLEVBQUUsRUFBRTt3QkFDakQsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsNEJBQWdCLFVBQVUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxFQUFFO3dCQUM5RDs0QkFDRSxLQUFLLEVBQUU7Z0NBQ0wsWUFBWSxFQUFFO29DQUNaLEdBQUcsRUFBRSxLQUFLO29DQUNWLEdBQUcsRUFBRSxHQUFHO29DQUNSLE1BQU0sRUFBRSxjQUFjO2lDQUN2Qjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTCxjQUFjLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLGdDQUFvQjtxQkFDNUI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLElBQUksYUFBYSxFQUFFO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ25EO0lBUUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQWEsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELE1BQU0sYUFBYSxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUN4RSxNQUFNLGlCQUFpQixHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUM1RSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDeEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztJQUN2RCxPQUFPLFVBQVUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO0FBQ2pFLENBQUM7QUF4REQsa0RBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgU2VhcmNoUGFyYW1zIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQge1xuICBTRVJWSUNFX05BTUUsXG4gIFRSQU5TQUNUSU9OX0RVUkFUSU9OLFxuICBUUkFOU0FDVElPTl9OQU1FLFxuICBUUkFOU0FDVElPTl9UWVBFXG59IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgU2V0dXAgfSBmcm9tICcuLi8uLi9oZWxwZXJzL3NldHVwX3JlcXVlc3QnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FsY3VsYXRlQnVja2V0U2l6ZShcbiAgc2VydmljZU5hbWU6IHN0cmluZyxcbiAgdHJhbnNhY3Rpb25OYW1lOiBzdHJpbmcsXG4gIHRyYW5zYWN0aW9uVHlwZTogc3RyaW5nLFxuICBzZXR1cDogU2V0dXBcbikge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQsIGVzRmlsdGVyUXVlcnksIGNsaWVudCwgY29uZmlnIH0gPSBzZXR1cDtcblxuICBjb25zdCBwYXJhbXM6IFNlYXJjaFBhcmFtcyA9IHtcbiAgICBpbmRleDogY29uZmlnLmdldCgnYXBtX29zcy50cmFuc2FjdGlvbkluZGljZXMnKSxcbiAgICBib2R5OiB7XG4gICAgICBzaXplOiAwLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAgeyB0ZXJtOiB7IFtTRVJWSUNFX05BTUVdOiBzZXJ2aWNlTmFtZSB9IH0sXG4gICAgICAgICAgICB7IHRlcm06IHsgW1RSQU5TQUNUSU9OX1RZUEVdOiB0cmFuc2FjdGlvblR5cGUgfSB9LFxuICAgICAgICAgICAgeyB0ZXJtOiB7IFtgJHtUUkFOU0FDVElPTl9OQU1FfS5rZXl3b3JkYF06IHRyYW5zYWN0aW9uTmFtZSB9IH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgJ0B0aW1lc3RhbXAnOiB7XG4gICAgICAgICAgICAgICAgICBndGU6IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgbHRlOiBlbmQsXG4gICAgICAgICAgICAgICAgICBmb3JtYXQ6ICdlcG9jaF9taWxsaXMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWdnczoge1xuICAgICAgICBzdGF0czoge1xuICAgICAgICAgIGV4dGVuZGVkX3N0YXRzOiB7XG4gICAgICAgICAgICBmaWVsZDogVFJBTlNBQ1RJT05fRFVSQVRJT05cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKGVzRmlsdGVyUXVlcnkpIHtcbiAgICBwYXJhbXMuYm9keS5xdWVyeS5ib29sLmZpbHRlci5wdXNoKGVzRmlsdGVyUXVlcnkpO1xuICB9XG5cbiAgaW50ZXJmYWNlIEFnZ3Mge1xuICAgIHN0YXRzOiB7XG4gICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgcmVzcCA9IGF3YWl0IGNsaWVudDx2b2lkLCBBZ2dzPignc2VhcmNoJywgcGFyYW1zKTtcbiAgY29uc3QgbWluQnVja2V0U2l6ZTogbnVtYmVyID0gY29uZmlnLmdldCgneHBhY2suYXBtLm1pbmltdW1CdWNrZXRTaXplJyk7XG4gIGNvbnN0IGJ1Y2tldFRhcmdldENvdW50OiBudW1iZXIgPSBjb25maWcuZ2V0KCd4cGFjay5hcG0uYnVja2V0VGFyZ2V0Q291bnQnKTtcbiAgY29uc3QgbWF4ID0gcmVzcC5hZ2dyZWdhdGlvbnMuc3RhdHMubWF4O1xuICBjb25zdCBidWNrZXRTaXplID0gTWF0aC5mbG9vcihtYXggLyBidWNrZXRUYXJnZXRDb3VudCk7XG4gIHJldHVybiBidWNrZXRTaXplID4gbWluQnVja2V0U2l6ZSA/IGJ1Y2tldFNpemUgOiBtaW5CdWNrZXRTaXplO1xufVxuIl19