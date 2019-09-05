"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
// @ts-ignore
const constants_1 = require("../../../monitoring/common/constants");
const constants_2 = require("../../common/constants");
/**
 *
 * @param callCluster
 * @param server
 * @param {boolean} spacesAvailable
 * @param withinDayRange
 * @return {ReportingUsageStats}
 */
async function getSpacesUsage(callCluster, server, spacesAvailable) {
    if (!spacesAvailable) {
        return {};
    }
    const { getSavedObjectsRepository } = server.savedObjects;
    const savedObjectsRepository = getSavedObjectsRepository(callCluster);
    const { saved_objects: spaces } = await savedObjectsRepository.find({ type: 'space' });
    return {
        count: spaces.length,
    };
}
/*
 * @param {Object} server
 * @return {Object} kibana usage stats type collection object
 */
function getSpacesUsageCollector(server) {
    const { collectorSet } = server.usage;
    return collectorSet.makeUsageCollector({
        type: constants_2.KIBANA_SPACES_STATS_TYPE,
        fetch: async (callCluster) => {
            const xpackInfo = server.plugins.xpack_main.info;
            const config = server.config();
            const available = xpackInfo && xpackInfo.isAvailable(); // some form of spaces is available for all valid licenses
            const enabled = config.get('xpack.spaces.enabled');
            const spacesAvailableAndEnabled = available && enabled;
            const usageStats = await getSpacesUsage(callCluster, server, spacesAvailableAndEnabled);
            return {
                available,
                enabled: spacesAvailableAndEnabled,
                ...usageStats,
            };
        },
        /*
         * Format the response data into a model for internal upload
         * 1. Make this data part of the "kibana_stats" type
         * 2. Organize the payload in the usage.xpack.spaces namespace of the data payload
         */
        formatForBulkUpload: (result) => {
            return {
                type: constants_1.KIBANA_STATS_TYPE_MONITORING,
                payload: {
                    usage: {
                        spaces: result,
                    },
                },
            };
        },
    });
}
exports.getSpacesUsageCollector = getSpacesUsageCollector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvZ2V0X3NwYWNlc191c2FnZV9jb2xsZWN0b3IudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3NwYWNlcy9zZXJ2ZXIvbGliL2dldF9zcGFjZXNfdXNhZ2VfY29sbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILGFBQWE7QUFDYixvRUFBb0Y7QUFDcEYsc0RBQWtFO0FBRWxFOzs7Ozs7O0dBT0c7QUFDSCxLQUFLLFVBQVUsY0FBYyxDQUFDLFdBQWdCLEVBQUUsTUFBVyxFQUFFLGVBQXdCO0lBQ25GLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDcEIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFFMUQsTUFBTSxzQkFBc0IsR0FBRyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV0RSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFdkYsT0FBTztRQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTTtLQUNyQixDQUFDO0FBQ0osQ0FBQztBQU9EOzs7R0FHRztBQUNILFNBQWdCLHVCQUF1QixDQUFDLE1BQVc7SUFDakQsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDdEMsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUM7UUFDckMsSUFBSSxFQUFFLG9DQUF3QjtRQUM5QixLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQWdCLEVBQUUsRUFBRTtZQUNoQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDakQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQy9CLE1BQU0sU0FBUyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQywwREFBMEQ7WUFDbEgsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ25ELE1BQU0seUJBQXlCLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQztZQUV2RCxNQUFNLFVBQVUsR0FBRyxNQUFNLGNBQWMsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixDQUFDLENBQUM7WUFFeEYsT0FBTztnQkFDTCxTQUFTO2dCQUNULE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLEdBQUcsVUFBVTthQUNBLENBQUM7UUFDbEIsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxtQkFBbUIsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtZQUMxQyxPQUFPO2dCQUNMLElBQUksRUFBRSx3Q0FBNEI7Z0JBQ2xDLE9BQU8sRUFBRTtvQkFDUCxLQUFLLEVBQUU7d0JBQ0wsTUFBTSxFQUFFLE1BQU07cUJBQ2Y7aUJBQ0Y7YUFDRixDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFwQ0QsMERBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cbi8vIEB0cy1pZ25vcmVcbmltcG9ydCB7IEtJQkFOQV9TVEFUU19UWVBFX01PTklUT1JJTkcgfSBmcm9tICcuLi8uLi8uLi9tb25pdG9yaW5nL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgS0lCQU5BX1NQQUNFU19TVEFUU19UWVBFIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBjYWxsQ2x1c3RlclxuICogQHBhcmFtIHNlcnZlclxuICogQHBhcmFtIHtib29sZWFufSBzcGFjZXNBdmFpbGFibGVcbiAqIEBwYXJhbSB3aXRoaW5EYXlSYW5nZVxuICogQHJldHVybiB7UmVwb3J0aW5nVXNhZ2VTdGF0c31cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0U3BhY2VzVXNhZ2UoY2FsbENsdXN0ZXI6IGFueSwgc2VydmVyOiBhbnksIHNwYWNlc0F2YWlsYWJsZTogYm9vbGVhbikge1xuICBpZiAoIXNwYWNlc0F2YWlsYWJsZSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IHsgZ2V0U2F2ZWRPYmplY3RzUmVwb3NpdG9yeSB9ID0gc2VydmVyLnNhdmVkT2JqZWN0cztcblxuICBjb25zdCBzYXZlZE9iamVjdHNSZXBvc2l0b3J5ID0gZ2V0U2F2ZWRPYmplY3RzUmVwb3NpdG9yeShjYWxsQ2x1c3Rlcik7XG5cbiAgY29uc3QgeyBzYXZlZF9vYmplY3RzOiBzcGFjZXMgfSA9IGF3YWl0IHNhdmVkT2JqZWN0c1JlcG9zaXRvcnkuZmluZCh7IHR5cGU6ICdzcGFjZScgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBjb3VudDogc3BhY2VzLmxlbmd0aCxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2FnZVN0YXRzIHtcbiAgYXZhaWxhYmxlOiBib29sZWFuO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBjb3VudD86IG51bWJlcjtcbn1cbi8qXG4gKiBAcGFyYW0ge09iamVjdH0gc2VydmVyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGtpYmFuYSB1c2FnZSBzdGF0cyB0eXBlIGNvbGxlY3Rpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGFjZXNVc2FnZUNvbGxlY3RvcihzZXJ2ZXI6IGFueSkge1xuICBjb25zdCB7IGNvbGxlY3RvclNldCB9ID0gc2VydmVyLnVzYWdlO1xuICByZXR1cm4gY29sbGVjdG9yU2V0Lm1ha2VVc2FnZUNvbGxlY3Rvcih7XG4gICAgdHlwZTogS0lCQU5BX1NQQUNFU19TVEFUU19UWVBFLFxuICAgIGZldGNoOiBhc3luYyAoY2FsbENsdXN0ZXI6IGFueSkgPT4ge1xuICAgICAgY29uc3QgeHBhY2tJbmZvID0gc2VydmVyLnBsdWdpbnMueHBhY2tfbWFpbi5pbmZvO1xuICAgICAgY29uc3QgY29uZmlnID0gc2VydmVyLmNvbmZpZygpO1xuICAgICAgY29uc3QgYXZhaWxhYmxlID0geHBhY2tJbmZvICYmIHhwYWNrSW5mby5pc0F2YWlsYWJsZSgpOyAvLyBzb21lIGZvcm0gb2Ygc3BhY2VzIGlzIGF2YWlsYWJsZSBmb3IgYWxsIHZhbGlkIGxpY2Vuc2VzXG4gICAgICBjb25zdCBlbmFibGVkID0gY29uZmlnLmdldCgneHBhY2suc3BhY2VzLmVuYWJsZWQnKTtcbiAgICAgIGNvbnN0IHNwYWNlc0F2YWlsYWJsZUFuZEVuYWJsZWQgPSBhdmFpbGFibGUgJiYgZW5hYmxlZDtcblxuICAgICAgY29uc3QgdXNhZ2VTdGF0cyA9IGF3YWl0IGdldFNwYWNlc1VzYWdlKGNhbGxDbHVzdGVyLCBzZXJ2ZXIsIHNwYWNlc0F2YWlsYWJsZUFuZEVuYWJsZWQpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhdmFpbGFibGUsXG4gICAgICAgIGVuYWJsZWQ6IHNwYWNlc0F2YWlsYWJsZUFuZEVuYWJsZWQsIC8vIHNpbWlsYXIgYmVoYXZpb3IgYXMgX3hwYWNrIEFQSSBpbiBFU1xuICAgICAgICAuLi51c2FnZVN0YXRzLFxuICAgICAgfSBhcyBVc2FnZVN0YXRzO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEZvcm1hdCB0aGUgcmVzcG9uc2UgZGF0YSBpbnRvIGEgbW9kZWwgZm9yIGludGVybmFsIHVwbG9hZFxuICAgICAqIDEuIE1ha2UgdGhpcyBkYXRhIHBhcnQgb2YgdGhlIFwia2liYW5hX3N0YXRzXCIgdHlwZVxuICAgICAqIDIuIE9yZ2FuaXplIHRoZSBwYXlsb2FkIGluIHRoZSB1c2FnZS54cGFjay5zcGFjZXMgbmFtZXNwYWNlIG9mIHRoZSBkYXRhIHBheWxvYWRcbiAgICAgKi9cbiAgICBmb3JtYXRGb3JCdWxrVXBsb2FkOiAocmVzdWx0OiBVc2FnZVN0YXRzKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBLSUJBTkFfU1RBVFNfVFlQRV9NT05JVE9SSU5HLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgdXNhZ2U6IHtcbiAgICAgICAgICAgIHNwYWNlczogcmVzdWx0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gIH0pO1xufVxuIl19