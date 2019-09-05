"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ts_optchain_1 = require("ts-optchain");
const constants_1 = require("../../../common/constants");
const get_transaction_1 = require("../transactions/get_transaction");
// TODO: rename from "getErrorGroup"  to "getErrorGroupSample" (since a single error is returned, not an errorGroup)
async function getErrorGroup({ serviceName, groupId, setup }) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        { term: { [constants_1.SERVICE_NAME]: serviceName } },
        { term: { [constants_1.ERROR_GROUP_ID]: groupId } },
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
        index: config.get('apm_oss.errorIndices'),
        body: {
            size: 1,
            query: {
                bool: {
                    filter,
                    should: [{ term: { [constants_1.TRANSACTION_SAMPLED]: true } }]
                }
            },
            sort: [
                { _score: 'desc' },
                { '@timestamp': { order: 'desc' } } // sort by timestamp to get the most recent error
            ]
        }
    };
    const resp = await client('search', params);
    const error = ts_optchain_1.oc(resp).hits.hits[0]._source();
    const transactionId = ts_optchain_1.oc(error).transaction.id();
    const traceId = lodash_1.get(error, 'trace.id'); // cannot use oc because 'trace' doesn't exist on v1 errors
    let transaction;
    if (transactionId) {
        transaction = await get_transaction_1.getTransaction(transactionId, traceId, setup);
    }
    return {
        transaction,
        error,
        occurrencesCount: resp.hits.total
    };
}
exports.getErrorGroup = getErrorGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvZXJyb3JzL2dldF9lcnJvcl9ncm91cC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvZXJyb3JzL2dldF9lcnJvcl9ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFHSCxtQ0FBNkI7QUFDN0IsNkNBQWlDO0FBR2pDLHlEQUltQztBQUVuQyxxRUFBaUU7QUFRakUsb0hBQW9IO0FBQzdHLEtBQUssVUFBVSxhQUFhLENBQUMsRUFDbEMsV0FBVyxFQUNYLE9BQU8sRUFDUCxLQUFLLEVBS047SUFDQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUM1RCxNQUFNLE1BQU0sR0FBZTtRQUN6QixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsd0JBQVksQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3pDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQywwQkFBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDdkM7WUFDRSxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLEdBQUcsRUFBRSxLQUFLO29CQUNWLEdBQUcsRUFBRSxHQUFHO29CQUNSLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSSxhQUFhLEVBQUU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM1QjtJQUVELE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQVMsc0JBQXNCLENBQUM7UUFDakQsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLE1BQU07b0JBQ04sTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLCtCQUFtQixDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztpQkFDcEQ7YUFDRjtZQUNELElBQUksRUFBRTtnQkFDSixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7Z0JBQ2xCLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsaURBQWlEO2FBQ3RGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQVcsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELE1BQU0sS0FBSyxHQUFHLGdCQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxNQUFNLGFBQWEsR0FBRyxnQkFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNqRCxNQUFNLE9BQU8sR0FBdUIsWUFBRyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLDJEQUEyRDtJQUV2SCxJQUFJLFdBQVcsQ0FBQztJQUNoQixJQUFJLGFBQWEsRUFBRTtRQUNqQixXQUFXLEdBQUcsTUFBTSxnQ0FBYyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbkU7SUFFRCxPQUFPO1FBQ0wsV0FBVztRQUNYLEtBQUs7UUFDTCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7S0FDbEMsQ0FBQztBQUNKLENBQUM7QUE1REQsc0NBNERDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRVNGaWx0ZXIgfSBmcm9tICdlbGFzdGljc2VhcmNoJztcbmltcG9ydCB7IGdldCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBvYyB9IGZyb20gJ3RzLW9wdGNoYWluJztcbmltcG9ydCB7IEFQTUVycm9yIH0gZnJvbSAneC1wYWNrL3BsdWdpbnMvYXBtL3R5cGluZ3MvZXNfc2NoZW1hcy9FcnJvcic7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbiB9IGZyb20gJ3gtcGFjay9wbHVnaW5zL2FwbS90eXBpbmdzL2VzX3NjaGVtYXMvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IHtcbiAgRVJST1JfR1JPVVBfSUQsXG4gIFNFUlZJQ0VfTkFNRSxcbiAgVFJBTlNBQ1RJT05fU0FNUExFRFxufSBmcm9tICcuLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IFNldHVwIH0gZnJvbSAnLi4vaGVscGVycy9zZXR1cF9yZXF1ZXN0JztcbmltcG9ydCB7IGdldFRyYW5zYWN0aW9uIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2dldF90cmFuc2FjdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JHcm91cEFQSVJlc3BvbnNlIHtcbiAgdHJhbnNhY3Rpb24/OiBUcmFuc2FjdGlvbjtcbiAgZXJyb3I/OiBBUE1FcnJvcjtcbiAgb2NjdXJyZW5jZXNDb3VudDogbnVtYmVyO1xufVxuXG4vLyBUT0RPOiByZW5hbWUgZnJvbSBcImdldEVycm9yR3JvdXBcIiAgdG8gXCJnZXRFcnJvckdyb3VwU2FtcGxlXCIgKHNpbmNlIGEgc2luZ2xlIGVycm9yIGlzIHJldHVybmVkLCBub3QgYW4gZXJyb3JHcm91cClcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRFcnJvckdyb3VwKHtcbiAgc2VydmljZU5hbWUsXG4gIGdyb3VwSWQsXG4gIHNldHVwXG59OiB7XG4gIHNlcnZpY2VOYW1lOiBzdHJpbmc7XG4gIGdyb3VwSWQ6IHN0cmluZztcbiAgc2V0dXA6IFNldHVwO1xufSk6IFByb21pc2U8RXJyb3JHcm91cEFQSVJlc3BvbnNlPiB7XG4gIGNvbnN0IHsgc3RhcnQsIGVuZCwgZXNGaWx0ZXJRdWVyeSwgY2xpZW50LCBjb25maWcgfSA9IHNldHVwO1xuICBjb25zdCBmaWx0ZXI6IEVTRmlsdGVyW10gPSBbXG4gICAgeyB0ZXJtOiB7IFtTRVJWSUNFX05BTUVdOiBzZXJ2aWNlTmFtZSB9IH0sXG4gICAgeyB0ZXJtOiB7IFtFUlJPUl9HUk9VUF9JRF06IGdyb3VwSWQgfSB9LFxuICAgIHtcbiAgICAgIHJhbmdlOiB7XG4gICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgIGd0ZTogc3RhcnQsXG4gICAgICAgICAgbHRlOiBlbmQsXG4gICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBdO1xuXG4gIGlmIChlc0ZpbHRlclF1ZXJ5KSB7XG4gICAgZmlsdGVyLnB1c2goZXNGaWx0ZXJRdWVyeSk7XG4gIH1cblxuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgaW5kZXg6IGNvbmZpZy5nZXQ8c3RyaW5nPignYXBtX29zcy5lcnJvckluZGljZXMnKSxcbiAgICBib2R5OiB7XG4gICAgICBzaXplOiAxLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICBzaG91bGQ6IFt7IHRlcm06IHsgW1RSQU5TQUNUSU9OX1NBTVBMRURdOiB0cnVlIH0gfV1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNvcnQ6IFtcbiAgICAgICAgeyBfc2NvcmU6ICdkZXNjJyB9LCAvLyBzb3J0IGJ5IF9zY29yZSBmaXJzdCB0byBlbnN1cmUgdGhhdCBlcnJvcnMgd2l0aCB0cmFuc2FjdGlvbi5zYW1wbGVkOnRydWUgZW5kcyB1cCBvbiB0b3BcbiAgICAgICAgeyAnQHRpbWVzdGFtcCc6IHsgb3JkZXI6ICdkZXNjJyB9IH0gLy8gc29ydCBieSB0aW1lc3RhbXAgdG8gZ2V0IHRoZSBtb3N0IHJlY2VudCBlcnJvclxuICAgICAgXVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZXNwID0gYXdhaXQgY2xpZW50PEFQTUVycm9yPignc2VhcmNoJywgcGFyYW1zKTtcbiAgY29uc3QgZXJyb3IgPSBvYyhyZXNwKS5oaXRzLmhpdHNbMF0uX3NvdXJjZSgpO1xuICBjb25zdCB0cmFuc2FjdGlvbklkID0gb2MoZXJyb3IpLnRyYW5zYWN0aW9uLmlkKCk7XG4gIGNvbnN0IHRyYWNlSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGdldChlcnJvciwgJ3RyYWNlLmlkJyk7IC8vIGNhbm5vdCB1c2Ugb2MgYmVjYXVzZSAndHJhY2UnIGRvZXNuJ3QgZXhpc3Qgb24gdjEgZXJyb3JzXG5cbiAgbGV0IHRyYW5zYWN0aW9uO1xuICBpZiAodHJhbnNhY3Rpb25JZCkge1xuICAgIHRyYW5zYWN0aW9uID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb24odHJhbnNhY3Rpb25JZCwgdHJhY2VJZCwgc2V0dXApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0cmFuc2FjdGlvbixcbiAgICBlcnJvcixcbiAgICBvY2N1cnJlbmNlc0NvdW50OiByZXNwLmhpdHMudG90YWxcbiAgfTtcbn1cbiJdfQ==