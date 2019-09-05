"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importStar(require("lodash"));
const get_next_midnight_1 = require("../../get_next_midnight");
/*
 * Parse the response data into telemetry payload
 */
async function getStats(callCluster, index) {
    const searchParams = {
        size: 10000,
        index,
        ignoreUnavailable: true,
        filterPath: ['hits.hits._id', 'hits.hits._source.visualization'],
        body: {
            query: {
                bool: { filter: { term: { type: 'visualization' } } },
            },
        },
    };
    const esResponse = await callCluster('search', searchParams);
    const size = lodash_1.default.get(esResponse, 'hits.hits.length');
    if (size < 1) {
        return;
    }
    // `map` to get the raw types
    const visSummaries = esResponse.hits.hits.map((hit) => {
        const spacePhrases = hit._id.split(':');
        const space = spacePhrases.length === 3 ? spacePhrases[0] : 'default'; // if in a custom space, the format of a saved object ID is space:type:id
        const visualization = lodash_1.default.get(hit, '_source.visualization', { visState: '{}' });
        const visState = JSON.parse(visualization.visState);
        return {
            type: visState.type || '_na_',
            space,
        };
    });
    // organize stats per type
    const visTypes = lodash_1.groupBy(visSummaries, 'type');
    // get the final result
    return lodash_1.mapValues(visTypes, curr => {
        const total = curr.length;
        const spacesBreakdown = lodash_1.countBy(curr, 'space');
        const spaceCounts = lodash_1.default.values(spacesBreakdown);
        return {
            total,
            spaces_min: lodash_1.default.min(spaceCounts),
            spaces_max: lodash_1.default.max(spaceCounts),
            spaces_avg: total / spaceCounts.length,
        };
    });
}
function visualizationsTaskRunner(taskInstance, kbnServer) {
    const { server } = kbnServer;
    const { callWithInternalUser: callCluster } = server.plugins.elasticsearch.getCluster('data');
    const config = server.config();
    const index = config.get('kibana.index').toString(); // cast to string for TypeScript
    return async () => {
        let stats;
        let error;
        try {
            stats = await getStats(callCluster, index);
        }
        catch (err) {
            if (err.constructor === Error) {
                error = err.message;
            }
            else {
                error = err;
            }
        }
        return {
            runAt: get_next_midnight_1.getNextMidnight(),
            state: {
                runs: taskInstance.state.runs + 1,
                stats,
            },
            error,
        };
    };
}
exports.visualizationsTaskRunner = visualizationsTaskRunner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvb3NzX3RlbGVtZXRyeS9zZXJ2ZXIvbGliL3Rhc2tzL3Zpc3VhbGl6YXRpb25zL3Rhc2tfcnVubmVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9vc3NfdGVsZW1ldHJ5L3NlcnZlci9saWIvdGFza3MvdmlzdWFsaXphdGlvbnMvdGFza19ydW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHlEQUF3RDtBQVN4RCwrREFBMEQ7QUFPMUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsUUFBUSxDQUFDLFdBQTBELEVBQUUsS0FBYTtJQUMvRixNQUFNLFlBQVksR0FBRztRQUNuQixJQUFJLEVBQUUsS0FBSztRQUNYLEtBQUs7UUFDTCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLFVBQVUsRUFBRSxDQUFDLGVBQWUsRUFBRSxpQ0FBaUMsQ0FBQztRQUNoRSxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUU7YUFDdEQ7U0FDRjtLQUNGLENBQUM7SUFDRixNQUFNLFVBQVUsR0FBb0IsTUFBTSxXQUFXLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzlFLE1BQU0sSUFBSSxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ25ELElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtRQUNaLE9BQU87S0FDUjtJQUVELDZCQUE2QjtJQUM3QixNQUFNLFlBQVksR0FBaUIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBbUIsRUFBRSxFQUFFO1FBQ2xGLE1BQU0sWUFBWSxHQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLHlFQUF5RTtRQUNoSixNQUFNLGFBQWEsR0FBa0IsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHVCQUF1QixFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0YsTUFBTSxRQUFRLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUQsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxJQUFJLE1BQU07WUFDN0IsS0FBSztTQUNOLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILDBCQUEwQjtJQUMxQixNQUFNLFFBQVEsR0FBRyxnQkFBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUvQyx1QkFBdUI7SUFDdkIsT0FBTyxrQkFBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtRQUNoQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzFCLE1BQU0sZUFBZSxHQUFHLGdCQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sV0FBVyxHQUFhLGdCQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXhELE9BQU87WUFDTCxLQUFLO1lBQ0wsVUFBVSxFQUFFLGdCQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztZQUM5QixVQUFVLEVBQUUsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQzlCLFVBQVUsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU07U0FDdkMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQWdCLHdCQUF3QixDQUN0QyxZQUEwQixFQUMxQixTQUFpQztJQUVqQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQzdCLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9CLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxnQ0FBZ0M7SUFFckYsT0FBTyxLQUFLLElBQUksRUFBRTtRQUNoQixJQUFJLEtBQUssQ0FBQztRQUNWLElBQUksS0FBSyxDQUFDO1FBRVYsSUFBSTtZQUNGLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7Z0JBQzdCLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO2FBQ3JCO2lCQUFNO2dCQUNMLEtBQUssR0FBRyxHQUFHLENBQUM7YUFDYjtTQUNGO1FBRUQsT0FBTztZQUNMLEtBQUssRUFBRSxtQ0FBZSxFQUFFO1lBQ3hCLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQztnQkFDakMsS0FBSzthQUNOO1lBQ0QsS0FBSztTQUNOLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBaENELDREQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBfLCB7IGNvdW50QnksIGdyb3VwQnksIG1hcFZhbHVlcyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBFU1F1ZXJ5UmVzcG9uc2UsXG4gIEhhcGlTZXJ2ZXIsXG4gIFNhdmVkT2JqZWN0RG9jLFxuICBUYXNrSW5zdGFuY2UsXG4gIFZpc1N0YXRlLFxuICBWaXN1YWxpemF0aW9uLFxufSBmcm9tICcuLi8uLi8uLi8uLi8nO1xuaW1wb3J0IHsgZ2V0TmV4dE1pZG5pZ2h0IH0gZnJvbSAnLi4vLi4vZ2V0X25leHRfbWlkbmlnaHQnO1xuXG5pbnRlcmZhY2UgVmlzU3VtbWFyeSB7XG4gIHR5cGU6IHN0cmluZztcbiAgc3BhY2U6IHN0cmluZztcbn1cblxuLypcbiAqIFBhcnNlIHRoZSByZXNwb25zZSBkYXRhIGludG8gdGVsZW1ldHJ5IHBheWxvYWRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0U3RhdHMoY2FsbENsdXN0ZXI6IChtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBhbnkpID0+IFByb21pc2U8YW55PiwgaW5kZXg6IHN0cmluZykge1xuICBjb25zdCBzZWFyY2hQYXJhbXMgPSB7XG4gICAgc2l6ZTogMTAwMDAsIC8vIGVsYXN0aWNzZWFyY2ggaW5kZXgubWF4X3Jlc3VsdF93aW5kb3cgZGVmYXVsdCB2YWx1ZVxuICAgIGluZGV4LFxuICAgIGlnbm9yZVVuYXZhaWxhYmxlOiB0cnVlLFxuICAgIGZpbHRlclBhdGg6IFsnaGl0cy5oaXRzLl9pZCcsICdoaXRzLmhpdHMuX3NvdXJjZS52aXN1YWxpemF0aW9uJ10sXG4gICAgYm9keToge1xuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDogeyBmaWx0ZXI6IHsgdGVybTogeyB0eXBlOiAndmlzdWFsaXphdGlvbicgfSB9IH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG4gIGNvbnN0IGVzUmVzcG9uc2U6IEVTUXVlcnlSZXNwb25zZSA9IGF3YWl0IGNhbGxDbHVzdGVyKCdzZWFyY2gnLCBzZWFyY2hQYXJhbXMpO1xuICBjb25zdCBzaXplID0gXy5nZXQoZXNSZXNwb25zZSwgJ2hpdHMuaGl0cy5sZW5ndGgnKTtcbiAgaWYgKHNpemUgPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gYG1hcGAgdG8gZ2V0IHRoZSByYXcgdHlwZXNcbiAgY29uc3QgdmlzU3VtbWFyaWVzOiBWaXNTdW1tYXJ5W10gPSBlc1Jlc3BvbnNlLmhpdHMuaGl0cy5tYXAoKGhpdDogU2F2ZWRPYmplY3REb2MpID0+IHtcbiAgICBjb25zdCBzcGFjZVBocmFzZXM6IHN0cmluZ1tdID0gaGl0Ll9pZC5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHNwYWNlID0gc3BhY2VQaHJhc2VzLmxlbmd0aCA9PT0gMyA/IHNwYWNlUGhyYXNlc1swXSA6ICdkZWZhdWx0JzsgLy8gaWYgaW4gYSBjdXN0b20gc3BhY2UsIHRoZSBmb3JtYXQgb2YgYSBzYXZlZCBvYmplY3QgSUQgaXMgc3BhY2U6dHlwZTppZFxuICAgIGNvbnN0IHZpc3VhbGl6YXRpb246IFZpc3VhbGl6YXRpb24gPSBfLmdldChoaXQsICdfc291cmNlLnZpc3VhbGl6YXRpb24nLCB7IHZpc1N0YXRlOiAne30nIH0pO1xuICAgIGNvbnN0IHZpc1N0YXRlOiBWaXNTdGF0ZSA9IEpTT04ucGFyc2UodmlzdWFsaXphdGlvbi52aXNTdGF0ZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdmlzU3RhdGUudHlwZSB8fCAnX25hXycsXG4gICAgICBzcGFjZSxcbiAgICB9O1xuICB9KTtcblxuICAvLyBvcmdhbml6ZSBzdGF0cyBwZXIgdHlwZVxuICBjb25zdCB2aXNUeXBlcyA9IGdyb3VwQnkodmlzU3VtbWFyaWVzLCAndHlwZScpO1xuXG4gIC8vIGdldCB0aGUgZmluYWwgcmVzdWx0XG4gIHJldHVybiBtYXBWYWx1ZXModmlzVHlwZXMsIGN1cnIgPT4ge1xuICAgIGNvbnN0IHRvdGFsID0gY3Vyci5sZW5ndGg7XG4gICAgY29uc3Qgc3BhY2VzQnJlYWtkb3duID0gY291bnRCeShjdXJyLCAnc3BhY2UnKTtcbiAgICBjb25zdCBzcGFjZUNvdW50czogbnVtYmVyW10gPSBfLnZhbHVlcyhzcGFjZXNCcmVha2Rvd24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvdGFsLFxuICAgICAgc3BhY2VzX21pbjogXy5taW4oc3BhY2VDb3VudHMpLFxuICAgICAgc3BhY2VzX21heDogXy5tYXgoc3BhY2VDb3VudHMpLFxuICAgICAgc3BhY2VzX2F2ZzogdG90YWwgLyBzcGFjZUNvdW50cy5sZW5ndGgsXG4gICAgfTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXN1YWxpemF0aW9uc1Rhc2tSdW5uZXIoXG4gIHRhc2tJbnN0YW5jZTogVGFza0luc3RhbmNlLFxuICBrYm5TZXJ2ZXI6IHsgc2VydmVyOiBIYXBpU2VydmVyIH1cbikge1xuICBjb25zdCB7IHNlcnZlciB9ID0ga2JuU2VydmVyO1xuICBjb25zdCB7IGNhbGxXaXRoSW50ZXJuYWxVc2VyOiBjYWxsQ2x1c3RlciB9ID0gc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKCdkYXRhJyk7XG4gIGNvbnN0IGNvbmZpZyA9IHNlcnZlci5jb25maWcoKTtcbiAgY29uc3QgaW5kZXggPSBjb25maWcuZ2V0KCdraWJhbmEuaW5kZXgnKS50b1N0cmluZygpOyAvLyBjYXN0IHRvIHN0cmluZyBmb3IgVHlwZVNjcmlwdFxuXG4gIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgbGV0IHN0YXRzO1xuICAgIGxldCBlcnJvcjtcblxuICAgIHRyeSB7XG4gICAgICBzdGF0cyA9IGF3YWl0IGdldFN0YXRzKGNhbGxDbHVzdGVyLCBpbmRleCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLmNvbnN0cnVjdG9yID09PSBFcnJvcikge1xuICAgICAgICBlcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJ1bkF0OiBnZXROZXh0TWlkbmlnaHQoKSxcbiAgICAgIHN0YXRlOiB7XG4gICAgICAgIHJ1bnM6IHRhc2tJbnN0YW5jZS5zdGF0ZS5ydW5zICsgMSxcbiAgICAgICAgc3RhdHMsXG4gICAgICB9LFxuICAgICAgZXJyb3IsXG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==