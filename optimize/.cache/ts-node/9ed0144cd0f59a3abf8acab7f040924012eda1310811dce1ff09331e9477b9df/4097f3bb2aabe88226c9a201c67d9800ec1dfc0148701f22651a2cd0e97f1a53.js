"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const types_1 = require("../../common/types");
const es_version_precheck_1 = require("../lib/es_version_precheck");
const reindexing_1 = require("../lib/reindexing");
const reindex_actions_1 = require("../lib/reindexing/reindex_actions");
function registerReindexWorker(server, credentialStore) {
    const { callWithRequest, callWithInternalUser } = server.plugins.elasticsearch.getCluster('admin');
    const xpackInfo = server.plugins.xpack_main.info;
    const savedObjectsRepository = server.savedObjects.getSavedObjectsRepository(callWithInternalUser);
    const savedObjectsClient = new server.savedObjects.SavedObjectsClient(savedObjectsRepository);
    // Cannot pass server.log directly because it's value changes during startup (?).
    // Use this function to proxy through.
    const log = (tags, data, timestamp) => server.log(tags, data, timestamp);
    const worker = new reindexing_1.ReindexWorker(savedObjectsClient, credentialStore, callWithRequest, callWithInternalUser, xpackInfo, log);
    // Wait for ES connection before starting the polling loop.
    server.plugins.elasticsearch.waitUntilReady().then(() => {
        worker.start();
        server.events.on('stop', () => worker.stop());
    });
    return worker;
}
exports.registerReindexWorker = registerReindexWorker;
function registerReindexIndicesRoutes(server, worker, credentialStore) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
    const xpackInfo = server.plugins.xpack_main.info;
    const BASE_PATH = '/api/upgrade_assistant/reindex';
    // Start reindex for an index
    server.route({
        path: `${BASE_PATH}/{indexName}`,
        method: 'POST',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
        },
        async handler(request) {
            const client = request.getSavedObjectsClient();
            const { indexName } = request.params;
            const callCluster = callWithRequest.bind(null, request);
            const reindexActions = reindex_actions_1.reindexActionsFactory(client, callCluster);
            const reindexService = reindexing_1.reindexServiceFactory(callCluster, xpackInfo, reindexActions, server.log);
            try {
                if (!(await reindexService.hasRequiredPrivileges(indexName))) {
                    throw boom_1.default.forbidden(`You do not have adequate privileges to reindex this index.`);
                }
                const existingOp = await reindexService.findReindexOperation(indexName);
                // If the reindexOp already exists and it's paused, resume it. Otherwise create a new one.
                const reindexOp = existingOp && existingOp.attributes.status === types_1.ReindexStatus.paused
                    ? await reindexService.resumeReindexOperation(indexName)
                    : await reindexService.createReindexOperation(indexName);
                // Add users credentials for the worker to use
                credentialStore.set(reindexOp, request.headers);
                // Kick the worker on this node to immediately pickup the new reindex operation.
                worker.forceRefresh();
                return reindexOp.attributes;
            }
            catch (e) {
                if (!e.isBoom) {
                    return boom_1.default.boomify(e, { statusCode: 500 });
                }
                return e;
            }
        },
    });
    // Get status
    server.route({
        path: `${BASE_PATH}/{indexName}`,
        method: 'GET',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
        },
        async handler(request) {
            const client = request.getSavedObjectsClient();
            const { indexName } = request.params;
            const callCluster = callWithRequest.bind(null, request);
            const reindexActions = reindex_actions_1.reindexActionsFactory(client, callCluster);
            const reindexService = reindexing_1.reindexServiceFactory(callCluster, xpackInfo, reindexActions, server.log);
            try {
                const hasRequiredPrivileges = await reindexService.hasRequiredPrivileges(indexName);
                const reindexOp = await reindexService.findReindexOperation(indexName);
                // If the user doesn't have privileges than querying for warnings is going to fail.
                const warnings = hasRequiredPrivileges
                    ? await reindexService.detectReindexWarnings(indexName)
                    : [];
                const indexGroup = reindexService.getIndexGroup(indexName);
                return {
                    reindexOp: reindexOp ? reindexOp.attributes : null,
                    warnings,
                    indexGroup,
                    hasRequiredPrivileges,
                };
            }
            catch (e) {
                if (!e.isBoom) {
                    return boom_1.default.boomify(e, { statusCode: 500 });
                }
                return e;
            }
        },
    });
    // Cancel reindex
    server.route({
        path: `${BASE_PATH}/{indexName}/cancel`,
        method: 'POST',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
        },
        async handler(request) {
            const client = request.getSavedObjectsClient();
            const { indexName } = request.params;
            const callCluster = callWithRequest.bind(null, request);
            const reindexActions = reindex_actions_1.reindexActionsFactory(client, callCluster);
            const reindexService = reindexing_1.reindexServiceFactory(callCluster, xpackInfo, reindexActions, server.log);
            try {
                await reindexService.cancelReindexing(indexName);
                return { acknowledged: true };
            }
            catch (e) {
                if (!e.isBoom) {
                    return boom_1.default.boomify(e, { statusCode: 500 });
                }
                return e;
            }
        },
    });
}
exports.registerReindexIndicesRoutes = registerReindexIndicesRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL3JvdXRlcy9yZWluZGV4X2luZGljZXMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwZ3JhZGVfYXNzaXN0YW50L3NlcnZlci9yb3V0ZXMvcmVpbmRleF9pbmRpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFLeEIsOENBQW1EO0FBQ25ELG9FQUErRDtBQUMvRCxrREFBeUU7QUFFekUsdUVBQTBFO0FBRTFFLFNBQWdCLHFCQUFxQixDQUFDLE1BQWMsRUFBRSxlQUFnQztJQUNwRixNQUFNLEVBQUUsZUFBZSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUN2RixPQUFPLENBQ1IsQ0FBQztJQUNGLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNqRCxNQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQzFFLG9CQUFvQixDQUNyQixDQUFDO0lBQ0YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQ25FLHNCQUFzQixDQUNELENBQUM7SUFFeEIsaUZBQWlGO0lBQ2pGLHNDQUFzQztJQUN0QyxNQUFNLEdBQUcsR0FBa0IsQ0FDekIsSUFBdUIsRUFDdkIsSUFBb0MsRUFDcEMsU0FBa0IsRUFDbEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLDBCQUFhLENBQzlCLGtCQUFrQixFQUNsQixl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QUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQzdDO2dCQUVELE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXRJRCxvRUFzSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQm9vbSBmcm9tICdib29tJztcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2hhcGknO1xuXG5pbXBvcnQgeyBDYWxsQ2x1c3RlciB9IGZyb20gJ3NyYy9sZWdhY3kvY29yZV9wbHVnaW5zL2VsYXN0aWNzZWFyY2gnO1xuaW1wb3J0IHsgU2F2ZWRPYmplY3RzQ2xpZW50IH0gZnJvbSAnc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzJztcbmltcG9ydCB7IFJlaW5kZXhTdGF0dXMgfSBmcm9tICcuLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgRXNWZXJzaW9uUHJlY2hlY2sgfSBmcm9tICcuLi9saWIvZXNfdmVyc2lvbl9wcmVjaGVjayc7XG5pbXBvcnQgeyByZWluZGV4U2VydmljZUZhY3RvcnksIFJlaW5kZXhXb3JrZXIgfSBmcm9tICcuLi9saWIvcmVpbmRleGluZyc7XG5pbXBvcnQgeyBDcmVkZW50aWFsU3RvcmUgfSBmcm9tICcuLi9saWIvcmVpbmRleGluZy9jcmVkZW50aWFsX3N0b3JlJztcbmltcG9ydCB7IHJlaW5kZXhBY3Rpb25zRmFjdG9yeSB9IGZyb20gJy4uL2xpYi9yZWluZGV4aW5nL3JlaW5kZXhfYWN0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclJlaW5kZXhXb3JrZXIoc2VydmVyOiBTZXJ2ZXIsIGNyZWRlbnRpYWxTdG9yZTogQ3JlZGVudGlhbFN0b3JlKSB7XG4gIGNvbnN0IHsgY2FsbFdpdGhSZXF1ZXN0LCBjYWxsV2l0aEludGVybmFsVXNlciB9ID0gc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKFxuICAgICdhZG1pbidcbiAgKTtcbiAgY29uc3QgeHBhY2tJbmZvID0gc2VydmVyLnBsdWdpbnMueHBhY2tfbWFpbi5pbmZvO1xuICBjb25zdCBzYXZlZE9iamVjdHNSZXBvc2l0b3J5ID0gc2VydmVyLnNhdmVkT2JqZWN0cy5nZXRTYXZlZE9iamVjdHNSZXBvc2l0b3J5KFxuICAgIGNhbGxXaXRoSW50ZXJuYWxVc2VyXG4gICk7XG4gIGNvbnN0IHNhdmVkT2JqZWN0c0NsaWVudCA9IG5ldyBzZXJ2ZXIuc2F2ZWRPYmplY3RzLlNhdmVkT2JqZWN0c0NsaWVudChcbiAgICBzYXZlZE9iamVjdHNSZXBvc2l0b3J5XG4gICkgYXMgU2F2ZWRPYmplY3RzQ2xpZW50O1xuXG4gIC8vIENhbm5vdCBwYXNzIHNlcnZlci5sb2cgZGlyZWN0bHkgYmVjYXVzZSBpdCdzIHZhbHVlIGNoYW5nZXMgZHVyaW5nIHN0YXJ0dXAgKD8pLlxuICAvLyBVc2UgdGhpcyBmdW5jdGlvbiB0byBwcm94eSB0aHJvdWdoLlxuICBjb25zdCBsb2c6IFNlcnZlclsnbG9nJ10gPSAoXG4gICAgdGFnczogc3RyaW5nIHwgc3RyaW5nW10sXG4gICAgZGF0YT86IHN0cmluZyB8IG9iamVjdCB8ICgoKSA9PiBhbnkpLFxuICAgIHRpbWVzdGFtcD86IG51bWJlclxuICApID0+IHNlcnZlci5sb2codGFncywgZGF0YSwgdGltZXN0YW1wKTtcblxuICBjb25zdCB3b3JrZXIgPSBuZXcgUmVpbmRleFdvcmtlcihcbiAgICBzYXZlZE9iamVjdHNDbGllbnQsXG4gICAgY3JlZGVudGlhbFN0b3JlLFxuICAgIGNhbGxXaXRoUmVxdWVzdCxcbiAgICBjYWxsV2l0aEludGVybmFsVXNlcixcbiAgICB4cGFja0luZm8sXG4gICAgbG9nXG4gICk7XG5cbiAgLy8gV2FpdCBmb3IgRVMgY29ubmVjdGlvbiBiZWZvcmUgc3RhcnRpbmcgdGhlIHBvbGxpbmcgbG9vcC5cbiAgc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC53YWl0VW50aWxSZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgIHdvcmtlci5zdGFydCgpO1xuICAgIHNlcnZlci5ldmVudHMub24oJ3N0b3AnLCAoKSA9PiB3b3JrZXIuc3RvcCgpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHdvcmtlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyUmVpbmRleEluZGljZXNSb3V0ZXMoXG4gIHNlcnZlcjogU2VydmVyLFxuICB3b3JrZXI6IFJlaW5kZXhXb3JrZXIsXG4gIGNyZWRlbnRpYWxTdG9yZTogQ3JlZGVudGlhbFN0b3JlXG4pIHtcbiAgY29uc3QgeyBjYWxsV2l0aFJlcXVlc3QgfSA9IHNlcnZlci5wbHVnaW5zLmVsYXN0aWNzZWFyY2guZ2V0Q2x1c3RlcignYWRtaW4nKTtcbiAgY29uc3QgeHBhY2tJbmZvID0gc2VydmVyLnBsdWdpbnMueHBhY2tfbWFpbi5pbmZvO1xuICBjb25zdCBCQVNFX1BBVEggPSAnL2FwaS91cGdyYWRlX2Fzc2lzdGFudC9yZWluZGV4JztcblxuICAvLyBTdGFydCByZWluZGV4IGZvciBhbiBpbmRleFxuICBzZXJ2ZXIucm91dGUoe1xuICAgIHBhdGg6IGAke0JBU0VfUEFUSH0ve2luZGV4TmFtZX1gLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHByZTogW0VzVmVyc2lvblByZWNoZWNrXSxcbiAgICB9LFxuICAgIGFzeW5jIGhhbmRsZXIocmVxdWVzdCkge1xuICAgICAgY29uc3QgY2xpZW50ID0gcmVxdWVzdC5nZXRTYXZlZE9iamVjdHNDbGllbnQoKTtcbiAgICAgIGNvbnN0IHsgaW5kZXhOYW1lIH0gPSByZXF1ZXN0LnBhcmFtcztcbiAgICAgIGNvbnN0IGNhbGxDbHVzdGVyID0gY2FsbFdpdGhSZXF1ZXN0LmJpbmQobnVsbCwgcmVxdWVzdCkgYXMgQ2FsbENsdXN0ZXI7XG4gICAgICBjb25zdCByZWluZGV4QWN0aW9ucyA9IHJlaW5kZXhBY3Rpb25zRmFjdG9yeShjbGllbnQsIGNhbGxDbHVzdGVyKTtcbiAgICAgIGNvbnN0IHJlaW5kZXhTZXJ2aWNlID0gcmVpbmRleFNlcnZpY2VGYWN0b3J5KFxuICAgICAgICBjYWxsQ2x1c3RlcixcbiAgICAgICAgeHBhY2tJbmZvLFxuICAgICAgICByZWluZGV4QWN0aW9ucyxcbiAgICAgICAgc2VydmVyLmxvZ1xuICAgICAgKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCEoYXdhaXQgcmVpbmRleFNlcnZpY2UuaGFzUmVxdWlyZWRQcml2aWxlZ2VzKGluZGV4TmFtZSkpKSB7XG4gICAgICAgICAgdGhyb3cgQm9vbS5mb3JiaWRkZW4oYFlvdSBkbyBub3QgaGF2ZSBhZGVxdWF0ZSBwcml2aWxlZ2VzIHRvIHJlaW5kZXggdGhpcyBpbmRleC5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nT3AgPSBhd2FpdCByZWluZGV4U2VydmljZS5maW5kUmVpbmRleE9wZXJhdGlvbihpbmRleE5hbWUpO1xuXG4gICAgICAgIC8vIElmIHRoZSByZWluZGV4T3AgYWxyZWFkeSBleGlzdHMgYW5kIGl0J3MgcGF1c2VkLCByZXN1bWUgaXQuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgb25lLlxuICAgICAgICBjb25zdCByZWluZGV4T3AgPVxuICAgICAgICAgIGV4aXN0aW5nT3AgJiYgZXhpc3RpbmdPcC5hdHRyaWJ1dGVzLnN0YXR1cyA9PT0gUmVpbmRleFN0YXR1cy5wYXVzZWRcbiAgICAgICAgICAgID8gYXdhaXQgcmVpbmRleFNlcnZpY2UucmVzdW1lUmVpbmRleE9wZXJhdGlvbihpbmRleE5hbWUpXG4gICAgICAgICAgICA6IGF3YWl0IHJlaW5kZXhTZXJ2aWNlLmNyZWF0ZVJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lKTtcblxuICAgICAgICAvLyBBZGQgdXNlcnMgY3JlZGVudGlhbHMgZm9yIHRoZSB3b3JrZXIgdG8gdXNlXG4gICAgICAgIGNyZWRlbnRpYWxTdG9yZS5zZXQocmVpbmRleE9wLCByZXF1ZXN0LmhlYWRlcnMpO1xuXG4gICAgICAgIC8vIEtpY2sgdGhlIHdvcmtlciBvbiB0aGlzIG5vZGUgdG8gaW1tZWRpYXRlbHkgcGlja3VwIHRoZSBuZXcgcmVpbmRleCBvcGVyYXRpb24uXG4gICAgICAgIHdvcmtlci5mb3JjZVJlZnJlc2goKTtcblxuICAgICAgICByZXR1cm4gcmVpbmRleE9wLmF0dHJpYnV0ZXM7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmICghZS5pc0Jvb20pIHtcbiAgICAgICAgICByZXR1cm4gQm9vbS5ib29taWZ5KGUsIHsgc3RhdHVzQ29kZTogNTAwIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gR2V0IHN0YXR1c1xuICBzZXJ2ZXIucm91dGUoe1xuICAgIHBhdGg6IGAke0JBU0VfUEFUSH0ve2luZGV4TmFtZX1gLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgb3B0aW9uczoge1xuICAgICAgcHJlOiBbRXNWZXJzaW9uUHJlY2hlY2tdLFxuICAgIH0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXF1ZXN0KSB7XG4gICAgICBjb25zdCBjbGllbnQgPSByZXF1ZXN0LmdldFNhdmVkT2JqZWN0c0NsaWVudCgpO1xuICAgICAgY29uc3QgeyBpbmRleE5hbWUgfSA9IHJlcXVlc3QucGFyYW1zO1xuICAgICAgY29uc3QgY2FsbENsdXN0ZXIgPSBjYWxsV2l0aFJlcXVlc3QuYmluZChudWxsLCByZXF1ZXN0KSBhcyBDYWxsQ2x1c3RlcjtcbiAgICAgIGNvbnN0IHJlaW5kZXhBY3Rpb25zID0gcmVpbmRleEFjdGlvbnNGYWN0b3J5KGNsaWVudCwgY2FsbENsdXN0ZXIpO1xuICAgICAgY29uc3QgcmVpbmRleFNlcnZpY2UgPSByZWluZGV4U2VydmljZUZhY3RvcnkoXG4gICAgICAgIGNhbGxDbHVzdGVyLFxuICAgICAgICB4cGFja0luZm8sXG4gICAgICAgIHJlaW5kZXhBY3Rpb25zLFxuICAgICAgICBzZXJ2ZXIubG9nXG4gICAgICApO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYXNSZXF1aXJlZFByaXZpbGVnZXMgPSBhd2FpdCByZWluZGV4U2VydmljZS5oYXNSZXF1aXJlZFByaXZpbGVnZXMoaW5kZXhOYW1lKTtcbiAgICAgICAgY29uc3QgcmVpbmRleE9wID0gYXdhaXQgcmVpbmRleFNlcnZpY2UuZmluZFJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lKTtcbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgZG9lc24ndCBoYXZlIHByaXZpbGVnZXMgdGhhbiBxdWVyeWluZyBmb3Igd2FybmluZ3MgaXMgZ29pbmcgdG8gZmFpbC5cbiAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBoYXNSZXF1aXJlZFByaXZpbGVnZXNcbiAgICAgICAgICA/IGF3YWl0IHJlaW5kZXhTZXJ2aWNlLmRldGVjdFJlaW5kZXhXYXJuaW5ncyhpbmRleE5hbWUpXG4gICAgICAgICAgOiBbXTtcbiAgICAgICAgY29uc3QgaW5kZXhHcm91cCA9IHJlaW5kZXhTZXJ2aWNlLmdldEluZGV4R3JvdXAoaW5kZXhOYW1lKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlaW5kZXhPcDogcmVpbmRleE9wID8gcmVpbmRleE9wLmF0dHJpYnV0ZXMgOiBudWxsLFxuICAgICAgICAgIHdhcm5pbmdzLFxuICAgICAgICAgIGluZGV4R3JvdXAsXG4gICAgICAgICAgaGFzUmVxdWlyZWRQcml2aWxlZ2VzLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIWUuaXNCb29tKSB7XG4gICAgICAgICAgcmV0dXJuIEJvb20uYm9vbWlmeShlLCB7IHN0YXR1c0NvZGU6IDUwMCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIENhbmNlbCByZWluZGV4XG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgcGF0aDogYCR7QkFTRV9QQVRIfS97aW5kZXhOYW1lfS9jYW5jZWxgLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHByZTogW0VzVmVyc2lvblByZWNoZWNrXSxcbiAgICB9LFxuICAgIGFzeW5jIGhhbmRsZXIocmVxdWVzdCkge1xuICAgICAgY29uc3QgY2xpZW50ID0gcmVxdWVzdC5nZXRTYXZlZE9iamVjdHNDbGllbnQoKTtcbiAgICAgIGNvbnN0IHsgaW5kZXhOYW1lIH0gPSByZXF1ZXN0LnBhcmFtcztcbiAgICAgIGNvbnN0IGNhbGxDbHVzdGVyID0gY2FsbFdpdGhSZXF1ZXN0LmJpbmQobnVsbCwgcmVxdWVzdCkgYXMgQ2FsbENsdXN0ZXI7XG4gICAgICBjb25zdCByZWluZGV4QWN0aW9ucyA9IHJlaW5kZXhBY3Rpb25zRmFjdG9yeShjbGllbnQsIGNhbGxDbHVzdGVyKTtcbiAgICAgIGNvbnN0IHJlaW5kZXhTZXJ2aWNlID0gcmVpbmRleFNlcnZpY2VGYWN0b3J5KFxuICAgICAgICBjYWxsQ2x1c3RlcixcbiAgICAgICAgeHBhY2tJbmZvLFxuICAgICAgICByZWluZGV4QWN0aW9ucyxcbiAgICAgICAgc2VydmVyLmxvZ1xuICAgICAgKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgcmVpbmRleFNlcnZpY2UuY2FuY2VsUmVpbmRleGluZyhpbmRleE5hbWUpO1xuXG4gICAgICAgIHJldHVybiB7IGFja25vd2xlZGdlZDogdHJ1ZSB9O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIWUuaXNCb29tKSB7XG4gICAgICAgICAgcmV0dXJuIEJvb20uYm9vbWlmeShlLCB7IHN0YXR1c0NvZGU6IDUwMCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufVxuIl19