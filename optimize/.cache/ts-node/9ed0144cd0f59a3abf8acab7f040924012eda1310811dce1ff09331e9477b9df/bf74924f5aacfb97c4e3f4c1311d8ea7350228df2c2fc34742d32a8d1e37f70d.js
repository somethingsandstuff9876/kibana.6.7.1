"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const types_1 = require("../../../common/types");
const index_settings_1 = require("./index_settings");
const VERSION_REGEX = new RegExp(/^([1-9]+)\.([0-9]+)\.([0-9]+)/);
const ML_INDICES = ['.ml-state', '.ml-anomalies', '.ml-config'];
const WATCHER_INDICES = ['.watches', '.triggered-watches'];
exports.reindexServiceFactory = (callCluster, xpackInfo, actions, log) => {
    // ------ Utility functions
    /**
     * If the index is a ML index that will cause jobs to fail when set to readonly,
     * turn on 'upgrade mode' to pause all ML jobs.
     * @param reindexOp
     */
    const stopMlJobs = async () => {
        await actions.incrementIndexGroupReindexes(types_1.IndexGroup.ml);
        await actions.runWhileIndexGroupLocked(types_1.IndexGroup.ml, async (mlDoc) => {
            await validateNodesMinimumVersion(6, 7);
            const res = await callCluster('transport.request', {
                path: '/_xpack/ml/set_upgrade_mode?enabled=true',
                method: 'POST',
            });
            if (!res.acknowledged) {
                throw new Error(`Could not stop ML jobs`);
            }
            return mlDoc;
        });
    };
    /**
     * Resumes ML jobs if there are no more remaining reindex operations.
     */
    const resumeMlJobs = async () => {
        await actions.decrementIndexGroupReindexes(types_1.IndexGroup.ml);
        await actions.runWhileIndexGroupLocked(types_1.IndexGroup.ml, async (mlDoc) => {
            if (mlDoc.attributes.runningReindexCount === 0) {
                const res = await callCluster('transport.request', {
                    path: '/_xpack/ml/set_upgrade_mode?enabled=false',
                    method: 'POST',
                });
                if (!res.acknowledged) {
                    throw new Error(`Could not resume ML jobs`);
                }
            }
            return mlDoc;
        });
    };
    /**
     * Stops Watcher in Elasticsearch.
     */
    const stopWatcher = async () => {
        await actions.incrementIndexGroupReindexes(types_1.IndexGroup.watcher);
        await actions.runWhileIndexGroupLocked(types_1.IndexGroup.watcher, async (watcherDoc) => {
            const { acknowledged } = await callCluster('transport.request', {
                path: '/_xpack/watcher/_stop',
                method: 'POST',
            });
            if (!acknowledged) {
                throw new Error('Could not stop Watcher');
            }
            return watcherDoc;
        });
    };
    /**
     * Starts Watcher in Elasticsearch.
     */
    const startWatcher = async () => {
        await actions.decrementIndexGroupReindexes(types_1.IndexGroup.watcher);
        await actions.runWhileIndexGroupLocked(types_1.IndexGroup.watcher, async (watcherDoc) => {
            if (watcherDoc.attributes.runningReindexCount === 0) {
                const { acknowledged } = await callCluster('transport.request', {
                    path: '/_xpack/watcher/_start',
                    method: 'POST',
                });
                if (!acknowledged) {
                    throw new Error('Could not start Watcher');
                }
            }
            return watcherDoc;
        });
    };
    const cleanupChanges = async (reindexOp) => {
        // Cancel reindex task if it was started but not completed
        if (reindexOp.attributes.lastCompletedStep === types_1.ReindexStep.reindexStarted) {
            await callCluster('tasks.cancel', {
                taskId: reindexOp.attributes.reindexTaskId,
            }).catch(e => undefined); // Ignore any exceptions trying to cancel (it may have already completed).
        }
        // Set index back to writable if we ever got past this point.
        if (reindexOp.attributes.lastCompletedStep >= types_1.ReindexStep.readonly) {
            await callCluster('indices.putSettings', {
                index: reindexOp.attributes.indexName,
                body: { 'index.blocks.write': false },
            });
        }
        if (reindexOp.attributes.lastCompletedStep >= types_1.ReindexStep.newIndexCreated &&
            reindexOp.attributes.lastCompletedStep < types_1.ReindexStep.aliasCreated) {
            await callCluster('indices.delete', { index: reindexOp.attributes.newIndexName });
        }
        // Resume consumers if we ever got past this point.
        if (reindexOp.attributes.lastCompletedStep >= types_1.ReindexStep.indexGroupServicesStopped) {
            await resumeIndexGroupServices(reindexOp);
        }
        return reindexOp;
    };
    // ------ Functions used to process the state machine
    const validateNodesMinimumVersion = async (minMajor, minMinor) => {
        const nodesResponse = await callCluster('transport.request', {
            path: '/_nodes',
            method: 'GET',
        });
        const outDatedNodes = Object.values(nodesResponse.nodes).filter((node) => {
            const matches = node.version.match(VERSION_REGEX);
            const major = parseInt(matches[1], 10);
            const minor = parseInt(matches[2], 10);
            // All ES nodes must be >= 6.7.0 to pause ML jobs
            return !(major > minMajor || (major === minMajor && minor >= minMinor));
        });
        if (outDatedNodes.length > 0) {
            const nodeList = JSON.stringify(outDatedNodes.map((n) => n.name));
            throw new Error(`Some nodes are not on minimum version (${minMajor}.${minMinor}.0)  required: ${nodeList}`);
        }
    };
    const stopIndexGroupServices = async (reindexOp) => {
        if (exports.isMlIndex(reindexOp.attributes.indexName)) {
            await stopMlJobs();
        }
        else if (exports.isWatcherIndex(reindexOp.attributes.indexName)) {
            await stopWatcher();
        }
        return actions.updateReindexOp(reindexOp, {
            lastCompletedStep: types_1.ReindexStep.indexGroupServicesStopped,
        });
    };
    /**
     * Sets the original index as readonly so new data can be indexed until the reindex
     * is completed.
     * @param reindexOp
     */
    const setReadonly = async (reindexOp) => {
        const { indexName } = reindexOp.attributes;
        const putReadonly = await callCluster('indices.putSettings', {
            index: indexName,
            body: { 'index.blocks.write': true },
        });
        if (!putReadonly.acknowledged) {
            throw new Error(`Index could not be set to readonly.`);
        }
        return actions.updateReindexOp(reindexOp, { lastCompletedStep: types_1.ReindexStep.readonly });
    };
    /**
     * Creates a new index with the same mappings and settings as the original index.
     * @param reindexOp
     */
    const createNewIndex = async (reindexOp) => {
        const { indexName, newIndexName } = reindexOp.attributes;
        const flatSettings = await actions.getFlatSettings(indexName);
        if (!flatSettings) {
            throw boom_1.default.notFound(`Index ${indexName} does not exist.`);
        }
        const { settings, mappings } = index_settings_1.transformFlatSettings(flatSettings);
        const createIndex = await callCluster('indices.create', {
            index: newIndexName,
            body: {
                settings,
                mappings,
            },
        });
        if (!createIndex.acknowledged) {
            throw boom_1.default.badImplementation(`Index could not be created: ${newIndexName}`);
        }
        return actions.updateReindexOp(reindexOp, {
            lastCompletedStep: types_1.ReindexStep.newIndexCreated,
        });
    };
    /**
     * Begins the reindex process via Elasticsearch's Reindex API.
     * @param reindexOp
     */
    const startReindexing = async (reindexOp) => {
        const { indexName } = reindexOp.attributes;
        const reindexBody = {
            source: { index: indexName },
            dest: { index: reindexOp.attributes.newIndexName },
        };
        const booleanFieldPaths = await actions.getBooleanFieldPaths(indexName);
        if (booleanFieldPaths.length) {
            reindexBody.script = {
                lang: 'painless',
                source: `
          // Updates a single field in a Map
          void updateField(Map data, String fieldName) {
            if (
              data[fieldName] == 'yes' ||
              data[fieldName] == '1' ||
              (data[fieldName] instanceof Integer && data[fieldName] == 1) ||
              data[fieldName] == 'on'
            ) {
              data[fieldName] = true;
            } else if (
              data[fieldName] == 'no' ||
              data[fieldName] == '0' ||
              (data[fieldName] instanceof Integer && data[fieldName] == 0) ||
              data[fieldName] == 'off'
            ) {
              data[fieldName] = false;
            }
          }

          // Recursively walks the fieldPath list and calls
          void updateFieldPath(def data, List fieldPath) {
            String pathHead = fieldPath[0];

            if (fieldPath.getLength() == 1) {
              if (data.get(pathHead) !== null) {
                updateField(data, pathHead);
              }
            } else {
              List fieldPathTail = fieldPath.subList(1, fieldPath.getLength());

              if (data.get(pathHead) instanceof List) {
                for (item in data[pathHead]) {
                  updateFieldPath(item, fieldPathTail);
                }
              } else if (data.get(pathHead) instanceof Map) {
                updateFieldPath(data[pathHead], fieldPathTail);
              }
            }
          }

          for (fieldPath in params.booleanFieldPaths) {
            updateFieldPath(ctx._source, fieldPath)
          }
        `,
                params: { booleanFieldPaths },
            };
        }
        const startReindex = (await callCluster('reindex', {
            refresh: true,
            waitForCompletion: false,
            body: reindexBody,
        }));
        return actions.updateReindexOp(reindexOp, {
            lastCompletedStep: types_1.ReindexStep.reindexStarted,
            reindexTaskId: startReindex.task,
            reindexTaskPercComplete: 0,
        });
    };
    /**
     * Polls Elasticsearch's Tasks API to see if the reindex operation has been completed.
     * @param reindexOp
     */
    const updateReindexStatus = async (reindexOp) => {
        const taskId = reindexOp.attributes.reindexTaskId;
        // Check reindexing task progress
        const taskResponse = await callCluster('tasks.get', {
            taskId,
            waitForCompletion: false,
        });
        if (!taskResponse.completed) {
            // Updated the percent complete
            const perc = taskResponse.task.status.created / taskResponse.task.status.total;
            return actions.updateReindexOp(reindexOp, {
                reindexTaskPercComplete: perc,
            });
        }
        else if (taskResponse.task.status.canceled === 'by user request') {
            // Set the status to cancelled
            reindexOp = await actions.updateReindexOp(reindexOp, {
                status: types_1.ReindexStatus.cancelled,
            });
            // Do any other cleanup work necessary
            reindexOp = await cleanupChanges(reindexOp);
        }
        else {
            // Check that it reindexed all documents
            const { count } = await callCluster('count', { index: reindexOp.attributes.indexName });
            if (taskResponse.task.status.created < count) {
                // Include the entire task result in the error message. This should be guaranteed
                // to be JSON-serializable since it just came back from Elasticsearch.
                throw boom_1.default.badData(`Reindexing failed: ${JSON.stringify(taskResponse)}`);
            }
            // Update the status
            reindexOp = await actions.updateReindexOp(reindexOp, {
                lastCompletedStep: types_1.ReindexStep.reindexCompleted,
                reindexTaskPercComplete: 1,
            });
        }
        // Delete the task from ES .tasks index
        const deleteTaskResp = await callCluster('delete', {
            index: '.tasks',
            type: 'task',
            id: taskId,
        });
        if (deleteTaskResp.result !== 'deleted') {
            throw boom_1.default.badImplementation(`Could not delete reindexing task ${taskId}`);
        }
        return reindexOp;
    };
    /**
     * Creates an alias that points the old index to the new index, deletes the old index.
     * @param reindexOp
     */
    const switchAlias = async (reindexOp) => {
        const { indexName, newIndexName } = reindexOp.attributes;
        const existingAliases = (await callCluster('indices.getAlias', {
            index: indexName,
        }))[indexName].aliases;
        const extraAlises = Object.keys(existingAliases).map(aliasName => ({
            add: { index: newIndexName, alias: aliasName, ...existingAliases[aliasName] },
        }));
        const aliasResponse = await callCluster('indices.updateAliases', {
            body: {
                actions: [
                    { add: { index: newIndexName, alias: indexName } },
                    { remove_index: { index: indexName } },
                    ...extraAlises,
                ],
            },
        });
        if (!aliasResponse.acknowledged) {
            throw boom_1.default.badImplementation(`Index aliases could not be created.`);
        }
        return actions.updateReindexOp(reindexOp, {
            lastCompletedStep: types_1.ReindexStep.aliasCreated,
        });
    };
    const resumeIndexGroupServices = async (reindexOp) => {
        if (exports.isMlIndex(reindexOp.attributes.indexName)) {
            await resumeMlJobs();
        }
        else if (exports.isWatcherIndex(reindexOp.attributes.indexName)) {
            await startWatcher();
        }
        // Only change the status if we're still in-progress (this function is also called when the reindex fails or is cancelled)
        if (reindexOp.attributes.status === types_1.ReindexStatus.inProgress) {
            return actions.updateReindexOp(reindexOp, {
                lastCompletedStep: types_1.ReindexStep.indexGroupServicesStarted,
            });
        }
        else {
            return reindexOp;
        }
    };
    // ------ The service itself
    return {
        async hasRequiredPrivileges(indexName) {
            // If security is disabled or unavailable, return true.
            const security = xpackInfo.feature('security');
            if (!security.isAvailable() || !security.isEnabled()) {
                return true;
            }
            const names = [indexName, index_settings_1.generateNewIndexName(indexName)];
            const sourceName = index_settings_1.sourceNameForIndex(indexName);
            // if we have re-indexed this in the past, there will be an
            // underlying alias we will also need to update.
            if (sourceName !== indexName) {
                names.push(sourceName);
            }
            // Otherwise, query for required privileges for this index.
            const body = {
                cluster: ['manage'],
                index: [
                    {
                        names,
                        allow_restricted_indices: true,
                        privileges: ['all'],
                    },
                    {
                        names: ['.tasks'],
                        privileges: ['read', 'delete'],
                    },
                ],
            };
            if (exports.isMlIndex(indexName)) {
                body.cluster = [...body.cluster, 'manage_ml'];
            }
            if (exports.isWatcherIndex(indexName)) {
                body.cluster = [...body.cluster, 'manage_watcher'];
            }
            const resp = await callCluster('transport.request', {
                path: '/_security/user/_has_privileges',
                method: 'POST',
                body,
            });
            return resp.has_all_requested;
        },
        async detectReindexWarnings(indexName) {
            const flatSettings = await actions.getFlatSettings(indexName);
            if (!flatSettings) {
                return null;
            }
            else {
                return index_settings_1.getReindexWarnings(flatSettings);
            }
        },
        getIndexGroup(indexName) {
            if (exports.isMlIndex(indexName)) {
                return types_1.IndexGroup.ml;
            }
            else if (exports.isWatcherIndex(indexName)) {
                return types_1.IndexGroup.watcher;
            }
        },
        async createReindexOperation(indexName) {
            const indexExists = await callCluster('indices.exists', { index: indexName });
            if (!indexExists) {
                throw boom_1.default.notFound(`Index ${indexName} does not exist in this cluster.`);
            }
            const existingReindexOps = await actions.findReindexOperations(indexName);
            if (existingReindexOps.total !== 0) {
                const existingOp = existingReindexOps.saved_objects[0];
                if (existingOp.attributes.status === types_1.ReindexStatus.failed ||
                    existingOp.attributes.status === types_1.ReindexStatus.cancelled) {
                    // Delete the existing one if it failed or was cancelled to give a chance to retry.
                    await actions.deleteReindexOp(existingOp);
                }
                else {
                    throw boom_1.default.badImplementation(`A reindex operation already in-progress for ${indexName}`);
                }
            }
            return actions.createReindexOp(indexName);
        },
        async findReindexOperation(indexName) {
            const findResponse = await actions.findReindexOperations(indexName);
            // Bail early if it does not exist or there is more than one.
            if (findResponse.total === 0) {
                return null;
            }
            else if (findResponse.total > 1) {
                throw boom_1.default.badImplementation(`More than one reindex operation found for ${indexName}`);
            }
            return findResponse.saved_objects[0];
        },
        findAllByStatus: actions.findAllByStatus,
        async processNextStep(reindexOp) {
            return actions.runWhileLocked(reindexOp, async (lockedReindexOp) => {
                try {
                    switch (lockedReindexOp.attributes.lastCompletedStep) {
                        case types_1.ReindexStep.created:
                            lockedReindexOp = await stopIndexGroupServices(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.indexGroupServicesStopped:
                            lockedReindexOp = await setReadonly(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.readonly:
                            lockedReindexOp = await createNewIndex(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.newIndexCreated:
                            lockedReindexOp = await startReindexing(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.reindexStarted:
                            lockedReindexOp = await updateReindexStatus(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.reindexCompleted:
                            lockedReindexOp = await switchAlias(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.aliasCreated:
                            lockedReindexOp = await resumeIndexGroupServices(lockedReindexOp);
                            break;
                        case types_1.ReindexStep.indexGroupServicesStarted:
                            lockedReindexOp = await actions.updateReindexOp(lockedReindexOp, {
                                status: types_1.ReindexStatus.completed,
                            });
                        default:
                            break;
                    }
                }
                catch (e) {
                    log(['upgrade_assistant', 'error'], `Reindexing step failed: ${e instanceof Error ? e.stack : e.toString()}`);
                    // Trap the exception and add the message to the object so the UI can display it.
                    lockedReindexOp = await actions.updateReindexOp(lockedReindexOp, {
                        status: types_1.ReindexStatus.failed,
                        errorMessage: e.toString(),
                    });
                    // Cleanup any changes, ignoring any errors.
                    lockedReindexOp = await cleanupChanges(lockedReindexOp).catch(e => lockedReindexOp);
                }
                return lockedReindexOp;
            });
        },
        async pauseReindexOperation(indexName) {
            const reindexOp = await this.findReindexOperation(indexName);
            if (!reindexOp) {
                throw new Error(`No reindex operation found for index ${indexName}`);
            }
            return actions.runWhileLocked(reindexOp, async (op) => {
                if (op.attributes.status === types_1.ReindexStatus.paused) {
                    // Another node already paused the operation, don't do anything
                    return reindexOp;
                }
                else if (op.attributes.status !== types_1.ReindexStatus.inProgress) {
                    throw new Error(`Reindex operation must be inProgress in order to be paused.`);
                }
                return actions.updateReindexOp(op, { status: types_1.ReindexStatus.paused });
            });
        },
        async resumeReindexOperation(indexName) {
            const reindexOp = await this.findReindexOperation(indexName);
            if (!reindexOp) {
                throw new Error(`No reindex operation found for index ${indexName}`);
            }
            return actions.runWhileLocked(reindexOp, async (op) => {
                if (op.attributes.status === types_1.ReindexStatus.inProgress) {
                    // Another node already resumed the operation, don't do anything
                    return reindexOp;
                }
                else if (op.attributes.status !== types_1.ReindexStatus.paused) {
                    throw new Error(`Reindex operation must be paused in order to be resumed.`);
                }
                return actions.updateReindexOp(op, { status: types_1.ReindexStatus.inProgress });
            });
        },
        async cancelReindexing(indexName) {
            const reindexOp = await this.findReindexOperation(indexName);
            if (!reindexOp) {
                throw new Error(`No reindex operation found for index ${indexName}`);
            }
            else if (reindexOp.attributes.status !== types_1.ReindexStatus.inProgress) {
                throw new Error(`Reindex operation is not in progress`);
            }
            else if (reindexOp.attributes.lastCompletedStep !== types_1.ReindexStep.reindexStarted) {
                throw new Error(`Reindex operation is not current waiting for reindex task to complete`);
            }
            const resp = await callCluster('tasks.cancel', {
                taskId: reindexOp.attributes.reindexTaskId,
            });
            if (resp.node_failures && resp.node_failures.length > 0) {
                throw new Error(`Could not cancel reindex.`);
            }
            return reindexOp;
        },
    };
};
exports.isMlIndex = (indexName) => {
    const sourceName = index_settings_1.sourceNameForIndex(indexName);
    return ML_INDICES.indexOf(sourceName) >= 0;
};
exports.isWatcherIndex = (indexName) => {
    const sourceName = index_settings_1.sourceNameForIndex(indexName);
    return WATCHER_INDICES.indexOf(sourceName) >= 0;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL2xpYi9yZWluZGV4aW5nL3JlaW5kZXhfc2VydmljZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL2xpYi9yZWluZGV4aW5nL3JlaW5kZXhfc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsd0RBQXdCO0FBS3hCLGlEQU0rQjtBQUMvQixxREFLMEI7QUFHMUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNsRSxNQUFNLFVBQVUsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDaEUsTUFBTSxlQUFlLEdBQUcsQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQXNFOUMsUUFBQSxxQkFBcUIsR0FBRyxDQUNuQyxXQUF3QixFQUN4QixTQUFvQixFQUNwQixPQUF1QixFQUN2QixHQUFrQixFQUNGLEVBQUU7SUFDbEIsMkJBQTJCO0lBRTNCOzs7O09BSUc7SUFDSCxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQUksRUFBRTtRQUM1QixNQUFNLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxrQkFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFELE1BQU0sT0FBTyxDQUFDLHdCQUF3QixDQUFDLGtCQUFVLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRTtZQUNsRSxNQUFNLDJCQUEyQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUV4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLFdBQVcsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDakQsSUFBSSxFQUFFLDBDQUEw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VSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdoYXBpJztcbmltcG9ydCB7IENhbGxDbHVzdGVyIH0gZnJvbSAnc3JjL2xlZ2FjeS9jb3JlX3BsdWdpbnMvZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBYUGFja0luZm8gfSBmcm9tICd4LXBhY2svcGx1Z2lucy94cGFja19tYWluL3NlcnZlci9saWIveHBhY2tfaW5mbyc7XG5pbXBvcnQge1xuICBJbmRleEdyb3VwLFxuICBSZWluZGV4U2F2ZWRPYmplY3QsXG4gIFJlaW5kZXhTdGF0dXMsXG4gIFJlaW5kZXhTdGVwLFxuICBSZWluZGV4V2FybmluZyxcbn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7XG4gIGdlbmVyYXRlTmV3SW5kZXhOYW1lLFxuICBnZXRSZWluZGV4V2FybmluZ3MsXG4gIHNvdXJjZU5hbWVGb3JJbmRleCxcbiAgdHJhbnNmb3JtRmxhdFNldHRpbmdzLFxufSBmcm9tICcuL2luZGV4X3NldHRpbmdzJztcbmltcG9ydCB7IFJlaW5kZXhBY3Rpb25zIH0gZnJvbSAnLi9yZWluZGV4X2FjdGlvbnMnO1xuXG5jb25zdCBWRVJTSU9OX1JFR0VYID0gbmV3IFJlZ0V4cCgvXihbMS05XSspXFwuKFswLTldKylcXC4oWzAtOV0rKS8pO1xuY29uc3QgTUxfSU5ESUNFUyA9IFsnLm1sLXN0YXRlJywgJy5tbC1hbm9tYWxpZXMnLCAnLm1sLWNvbmZpZyddO1xuY29uc3QgV0FUQ0hFUl9JTkRJQ0VTID0gWycud2F0Y2hlcycsICcudHJpZ2dlcmVkLXdhdGNoZXMnXTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWluZGV4U2VydmljZSB7XG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhlIHVzZXIgaGFzIHByb3BlciBwcml2aWxlZ2VzIHJlcXVpcmVkIHRvIHJlaW5kZXggdGhpcyBpbmRleC5cbiAgICogQHBhcmFtIGluZGV4TmFtZVxuICAgKi9cbiAgaGFzUmVxdWlyZWRQcml2aWxlZ2VzKGluZGV4TmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPjtcblxuICAvKipcbiAgICogQ2hlY2tzIGFuIGluZGV4J3Mgc2V0dGluZ3MgYW5kIG1hcHBpbmdzIHRvIGZsYWcgcG90ZW50aWFsIGlzc3VlcyBkdXJpbmcgcmVpbmRleC5cbiAgICogUmVzb2x2ZXMgdG8gbnVsbCBpZiBpbmRleCBkb2VzIG5vdCBleGlzdC5cbiAgICogQHBhcmFtIGluZGV4TmFtZVxuICAgKi9cbiAgZGV0ZWN0UmVpbmRleFdhcm5pbmdzKGluZGV4TmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWluZGV4V2FybmluZ1tdIHwgbnVsbD47XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gSW5kZXhHcm91cCBpZiB0aGUgaW5kZXggYmVsb25ncyB0byBvbmUsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSBpbmRleE5hbWVcbiAgICovXG4gIGdldEluZGV4R3JvdXAoaW5kZXhOYW1lOiBzdHJpbmcpOiBJbmRleEdyb3VwIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHJlaW5kZXggb3BlcmF0aW9uIGZvciBhIGdpdmVuIGluZGV4LlxuICAgKiBAcGFyYW0gaW5kZXhOYW1lXG4gICAqL1xuICBjcmVhdGVSZWluZGV4T3BlcmF0aW9uKGluZGV4TmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWluZGV4U2F2ZWRPYmplY3Q+O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYWxsIHJlaW5kZXggb3BlcmF0aW9ucyB0aGF0IGhhdmUgdGhlIGdpdmVuIHN0YXR1cy5cbiAgICogQHBhcmFtIHN0YXR1c1xuICAgKi9cbiAgZmluZEFsbEJ5U3RhdHVzKHN0YXR1czogUmVpbmRleFN0YXR1cyk6IFByb21pc2U8UmVpbmRleFNhdmVkT2JqZWN0W10+O1xuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgcmVpbmRleCBvcGVyYXRpb24gZm9yIHRoZSBnaXZlbiBpbmRleC5cbiAgICogUmVzb2x2ZXMgdG8gbnVsbCBpZiB0aGVyZSBpcyBubyBleGlzdGluZyByZWluZGV4IG9wZXJhdGlvbiBmb3IgdGhpcyBpbmRleC5cbiAgICogQHBhcmFtIGluZGV4TmFtZVxuICAgKi9cbiAgZmluZFJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlaW5kZXhTYXZlZE9iamVjdCB8IG51bGw+O1xuXG4gIC8qKlxuICAgKiBQcm9jZXNzIHRoZSByZWluZGV4IG9wZXJhdGlvbiB0aHJvdWdoIG9uZSBzdGVwIG9mIHRoZSBzdGF0ZSBtYWNoaW5lIGFuZCByZXNvbHZlc1xuICAgKiB0byB0aGUgdXBkYXRlZCByZWluZGV4IG9wZXJhdGlvbi5cbiAgICogQHBhcmFtIHJlaW5kZXhPcFxuICAgKi9cbiAgcHJvY2Vzc05leHRTdGVwKHJlaW5kZXhPcDogUmVpbmRleFNhdmVkT2JqZWN0KTogUHJvbWlzZTxSZWluZGV4U2F2ZWRPYmplY3Q+O1xuXG4gIC8qKlxuICAgKiBQYXVzZXMgdGhlIGluLXByb2dyZXNzIHJlaW5kZXggb3BlcmF0aW9uIGZvciBhIGdpdmVuIGluZGV4LlxuICAgKiBAcGFyYW0gaW5kZXhOYW1lXG4gICAqL1xuICBwYXVzZVJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlaW5kZXhTYXZlZE9iamVjdD47XG5cbiAgLyoqXG4gICAqIFJlc3VtZXMgdGhlIHBhdXNlZCByZWluZGV4IG9wZXJhdGlvbiBmb3IgYSBnaXZlbiBpbmRleC5cbiAgICogQHBhcmFtIGluZGV4TmFtZVxuICAgKi9cbiAgcmVzdW1lUmVpbmRleE9wZXJhdGlvbihpbmRleE5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVpbmRleFNhdmVkT2JqZWN0PjtcblxuICAvKipcbiAgICogQ2FuY2VsIGFuIGluLXByb2dyZXNzIHJlaW5kZXggb3BlcmF0aW9uIGZvciBhIGdpdmVuIGluZGV4LiBPbmx5IGFsbG93ZWQgd2hlbiB0aGVcbiAgICogcmVpbmRleCBvcGVyYXRpb24gaXMgaW4gdGhlIFJlaW5kZXhTdGVwLnJlaW5kZXhTdGFydGVkIHN0ZXAuIFJlbGllcyBvbiB0aGUgUmVpbmRleFdvcmtlclxuICAgKiB0byBjb250aW51ZSBwcm9jZXNzaW5nIHRoZSByZWluZGV4IG9wZXJhdGlvbiB0byBkZXRlY3QgdGhhdCB0aGUgUmVpbmRleCBUYXNrIGluIEVTIGhhcyBiZWVuXG4gICAqIGNhbmNlbGxlZC5cbiAgICogQHBhcmFtIGluZGV4TmFtZVxuICAgKi9cbiAgY2FuY2VsUmVpbmRleGluZyhpbmRleE5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVpbmRleFNhdmVkT2JqZWN0Pjtcbn1cblxuZXhwb3J0IGNvbnN0IHJlaW5kZXhTZXJ2aWNlRmFjdG9yeSA9IChcbiAgY2FsbENsdXN0ZXI6IENhbGxDbHVzdGVyLFxuICB4cGFja0luZm86IFhQYWNrSW5mbyxcbiAgYWN0aW9uczogUmVpbmRleEFjdGlvbnMsXG4gIGxvZzogU2VydmVyWydsb2cnXVxuKTogUmVpbmRleFNlcnZpY2UgPT4ge1xuICAvLyAtLS0tLS0gVXRpbGl0eSBmdW5jdGlvbnNcblxuICAvKipcbiAgICogSWYgdGhlIGluZGV4IGlzIGEgTUwgaW5kZXggdGhhdCB3aWxsIGNhdXNlIGpvYnMgdG8gZmFpbCB3aGVuIHNldCB0byByZWFkb25seSxcbiAgICogdHVybiBvbiAndXBncmFkZSBtb2RlJyB0byBwYXVzZSBhbGwgTUwgam9icy5cbiAgICogQHBhcmFtIHJlaW5kZXhPcFxuICAgKi9cbiAgY29uc3Qgc3RvcE1sSm9icyA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhY3Rpb25zLmluY3JlbWVudEluZGV4R3JvdXBSZWluZGV4ZXMoSW5kZXhHcm91cC5tbCk7XG4gICAgYXdhaXQgYWN0aW9ucy5ydW5XaGlsZUluZGV4R3JvdXBMb2NrZWQoSW5kZXhHcm91cC5tbCwgYXN5bmMgbWxEb2MgPT4ge1xuICAgICAgYXdhaXQgdmFsaWRhdGVOb2Rlc01pbmltdW1WZXJzaW9uKDYsIDcpO1xuXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBjYWxsQ2x1c3RlcigndHJhbnNwb3J0LnJlcXVlc3QnLCB7XG4gICAgICAgIHBhdGg6ICcvX3hwYWNrL21sL3NldF91cGdyYWRlX21vZGU/ZW5hYmxlZD10cnVlJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFyZXMuYWNrbm93bGVkZ2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHN0b3AgTUwgam9ic2ApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWxEb2M7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc3VtZXMgTUwgam9icyBpZiB0aGVyZSBhcmUgbm8gbW9yZSByZW1haW5pbmcgcmVpbmRleCBvcGVyYXRpb25zLlxuICAgKi9cbiAgY29uc3QgcmVzdW1lTWxKb2JzID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGFjdGlvbnMuZGVjcmVtZW50SW5kZXhHcm91cFJlaW5kZXhlcyhJbmRleEdyb3VwLm1sKTtcbiAgICBhd2FpdCBhY3Rpb25zLnJ1bldoaWxlSW5kZXhHcm91cExvY2tlZChJbmRleEdyb3VwLm1sLCBhc3luYyBtbERvYyA9PiB7XG4gICAgICBpZiAobWxEb2MuYXR0cmlidXRlcy5ydW5uaW5nUmVpbmRleENvdW50ID09PSAwKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGNhbGxDbHVzdGVyKCd0cmFuc3BvcnQucmVxdWVzdCcsIHtcbiAgICAgICAgICBwYXRoOiAnL194cGFjay9tbC9zZXRfdXBncmFkZV9tb2RlP2VuYWJsZWQ9ZmFsc2UnLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXJlcy5hY2tub3dsZWRnZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCByZXN1bWUgTUwgam9ic2ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtbERvYztcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogU3RvcHMgV2F0Y2hlciBpbiBFbGFzdGljc2VhcmNoLlxuICAgKi9cbiAgY29uc3Qgc3RvcFdhdGNoZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYWN0aW9ucy5pbmNyZW1lbnRJbmRleEdyb3VwUmVpbmRleGVzKEluZGV4R3JvdXAud2F0Y2hlcik7XG4gICAgYXdhaXQgYWN0aW9ucy5ydW5XaGlsZUluZGV4R3JvdXBMb2NrZWQoSW5kZXhHcm91cC53YXRjaGVyLCBhc3luYyB3YXRjaGVyRG9jID0+IHtcbiAgICAgIGNvbnN0IHsgYWNrbm93bGVkZ2VkIH0gPSBhd2FpdCBjYWxsQ2x1c3RlcigndHJhbnNwb3J0LnJlcXVlc3QnLCB7XG4gICAgICAgIHBhdGg6ICcvX3hwYWNrL3dhdGNoZXIvX3N0b3AnLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWFja25vd2xlZGdlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBzdG9wIFdhdGNoZXInKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdhdGNoZXJEb2M7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyBXYXRjaGVyIGluIEVsYXN0aWNzZWFyY2guXG4gICAqL1xuICBjb25zdCBzdGFydFdhdGNoZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYWN0aW9ucy5kZWNyZW1lbnRJbmRleEdyb3VwUmVpbmRleGVzKEluZGV4R3JvdXAud2F0Y2hlcik7XG4gICAgYXdhaXQgYWN0aW9ucy5ydW5XaGlsZUluZGV4R3JvdXBMb2NrZWQoSW5kZXhHcm91cC53YXRjaGVyLCBhc3luYyB3YXRjaGVyRG9jID0+IHtcbiAgICAgIGlmICh3YXRjaGVyRG9jLmF0dHJpYnV0ZXMucnVubmluZ1JlaW5kZXhDb3VudCA9PT0gMCkge1xuICAgICAgICBjb25zdCB7IGFja25vd2xlZGdlZCB9ID0gYXdhaXQgY2FsbENsdXN0ZXIoJ3RyYW5zcG9ydC5yZXF1ZXN0Jywge1xuICAgICAgICAgIHBhdGg6ICcvX3hwYWNrL3dhdGNoZXIvX3N0YXJ0JyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFhY2tub3dsZWRnZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBzdGFydCBXYXRjaGVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdhdGNoZXJEb2M7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgY2xlYW51cENoYW5nZXMgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICAvLyBDYW5jZWwgcmVpbmRleCB0YXNrIGlmIGl0IHdhcyBzdGFydGVkIGJ1dCBub3QgY29tcGxldGVkXG4gICAgaWYgKHJlaW5kZXhPcC5hdHRyaWJ1dGVzLmxhc3RDb21wbGV0ZWRTdGVwID09PSBSZWluZGV4U3RlcC5yZWluZGV4U3RhcnRlZCkge1xuICAgICAgYXdhaXQgY2FsbENsdXN0ZXIoJ3Rhc2tzLmNhbmNlbCcsIHtcbiAgICAgICAgdGFza0lkOiByZWluZGV4T3AuYXR0cmlidXRlcy5yZWluZGV4VGFza0lkLFxuICAgICAgfSkuY2F0Y2goZSA9PiB1bmRlZmluZWQpOyAvLyBJZ25vcmUgYW55IGV4Y2VwdGlvbnMgdHJ5aW5nIHRvIGNhbmNlbCAoaXQgbWF5IGhhdmUgYWxyZWFkeSBjb21wbGV0ZWQpLlxuICAgIH1cblxuICAgIC8vIFNldCBpbmRleCBiYWNrIHRvIHdyaXRhYmxlIGlmIHdlIGV2ZXIgZ290IHBhc3QgdGhpcyBwb2ludC5cbiAgICBpZiAocmVpbmRleE9wLmF0dHJpYnV0ZXMubGFzdENvbXBsZXRlZFN0ZXAgPj0gUmVpbmRleFN0ZXAucmVhZG9ubHkpIHtcbiAgICAgIGF3YWl0IGNhbGxDbHVzdGVyKCdpbmRpY2VzLnB1dFNldHRpbmdzJywge1xuICAgICAgICBpbmRleDogcmVpbmRleE9wLmF0dHJpYnV0ZXMuaW5kZXhOYW1lLFxuICAgICAgICBib2R5OiB7ICdpbmRleC5ibG9ja3Mud3JpdGUnOiBmYWxzZSB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgcmVpbmRleE9wLmF0dHJpYnV0ZXMubGFzdENvbXBsZXRlZFN0ZXAgPj0gUmVpbmRleFN0ZXAubmV3SW5kZXhDcmVhdGVkICYmXG4gICAgICByZWluZGV4T3AuYXR0cmlidXRlcy5sYXN0Q29tcGxldGVkU3RlcCA8IFJlaW5kZXhTdGVwLmFsaWFzQ3JlYXRlZFxuICAgICkge1xuICAgICAgYXdhaXQgY2FsbENsdXN0ZXIoJ2luZGljZXMuZGVsZXRlJywgeyBpbmRleDogcmVpbmRleE9wLmF0dHJpYnV0ZXMubmV3SW5kZXhOYW1lIH0pO1xuICAgIH1cblxuICAgIC8vIFJlc3VtZSBjb25zdW1lcnMgaWYgd2UgZXZlciBnb3QgcGFzdCB0aGlzIHBvaW50LlxuICAgIGlmIChyZWluZGV4T3AuYXR0cmlidXRlcy5sYXN0Q29tcGxldGVkU3RlcCA+PSBSZWluZGV4U3RlcC5pbmRleEdyb3VwU2VydmljZXNTdG9wcGVkKSB7XG4gICAgICBhd2FpdCByZXN1bWVJbmRleEdyb3VwU2VydmljZXMocmVpbmRleE9wKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVpbmRleE9wO1xuICB9O1xuXG4gIC8vIC0tLS0tLSBGdW5jdGlvbnMgdXNlZCB0byBwcm9jZXNzIHRoZSBzdGF0ZSBtYWNoaW5lXG5cbiAgY29uc3QgdmFsaWRhdGVOb2Rlc01pbmltdW1WZXJzaW9uID0gYXN5bmMgKG1pbk1ham9yOiBudW1iZXIsIG1pbk1pbm9yOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBub2Rlc1Jlc3BvbnNlID0gYXdhaXQgY2FsbENsdXN0ZXIoJ3RyYW5zcG9ydC5yZXF1ZXN0Jywge1xuICAgICAgcGF0aDogJy9fbm9kZXMnLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG91dERhdGVkTm9kZXMgPSBPYmplY3QudmFsdWVzKG5vZGVzUmVzcG9uc2Uubm9kZXMpLmZpbHRlcigobm9kZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBtYXRjaGVzID0gbm9kZS52ZXJzaW9uLm1hdGNoKFZFUlNJT05fUkVHRVgpO1xuICAgICAgY29uc3QgbWFqb3IgPSBwYXJzZUludChtYXRjaGVzWzFdLCAxMCk7XG4gICAgICBjb25zdCBtaW5vciA9IHBhcnNlSW50KG1hdGNoZXNbMl0sIDEwKTtcblxuICAgICAgLy8gQWxsIEVTIG5vZGVzIG11c3QgYmUgPj0gNi43LjAgdG8gcGF1c2UgTUwgam9ic1xuICAgICAgcmV0dXJuICEobWFqb3IgPiBtaW5NYWpvciB8fCAobWFqb3IgPT09IG1pbk1ham9yICYmIG1pbm9yID49IG1pbk1pbm9yKSk7XG4gICAgfSk7XG5cbiAgICBpZiAob3V0RGF0ZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBub2RlTGlzdCA9IEpTT04uc3RyaW5naWZ5KG91dERhdGVkTm9kZXMubWFwKChuOiBhbnkpID0+IG4ubmFtZSkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgU29tZSBub2RlcyBhcmUgbm90IG9uIG1pbmltdW0gdmVyc2lvbiAoJHttaW5NYWpvcn0uJHttaW5NaW5vcn0uMCkgIHJlcXVpcmVkOiAke25vZGVMaXN0fWBcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN0b3BJbmRleEdyb3VwU2VydmljZXMgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBpZiAoaXNNbEluZGV4KHJlaW5kZXhPcC5hdHRyaWJ1dGVzLmluZGV4TmFtZSkpIHtcbiAgICAgIGF3YWl0IHN0b3BNbEpvYnMoKTtcbiAgICB9IGVsc2UgaWYgKGlzV2F0Y2hlckluZGV4KHJlaW5kZXhPcC5hdHRyaWJ1dGVzLmluZGV4TmFtZSkpIHtcbiAgICAgIGF3YWl0IHN0b3BXYXRjaGVyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbnMudXBkYXRlUmVpbmRleE9wKHJlaW5kZXhPcCwge1xuICAgICAgbGFzdENvbXBsZXRlZFN0ZXA6IFJlaW5kZXhTdGVwLmluZGV4R3JvdXBTZXJ2aWNlc1N0b3BwZWQsXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9yaWdpbmFsIGluZGV4IGFzIHJlYWRvbmx5IHNvIG5ldyBkYXRhIGNhbiBiZSBpbmRleGVkIHVudGlsIHRoZSByZWluZGV4XG4gICAqIGlzIGNvbXBsZXRlZC5cbiAgICogQHBhcmFtIHJlaW5kZXhPcFxuICAgKi9cbiAgY29uc3Qgc2V0UmVhZG9ubHkgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBjb25zdCB7IGluZGV4TmFtZSB9ID0gcmVpbmRleE9wLmF0dHJpYnV0ZXM7XG4gICAgY29uc3QgcHV0UmVhZG9ubHkgPSBhd2FpdCBjYWxsQ2x1c3RlcignaW5kaWNlcy5wdXRTZXR0aW5ncycsIHtcbiAgICAgIGluZGV4OiBpbmRleE5hbWUsXG4gICAgICBib2R5OiB7ICdpbmRleC5ibG9ja3Mud3JpdGUnOiB0cnVlIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIXB1dFJlYWRvbmx5LmFja25vd2xlZGdlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmRleCBjb3VsZCBub3QgYmUgc2V0IHRvIHJlYWRvbmx5LmApO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChyZWluZGV4T3AsIHsgbGFzdENvbXBsZXRlZFN0ZXA6IFJlaW5kZXhTdGVwLnJlYWRvbmx5IH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluZGV4IHdpdGggdGhlIHNhbWUgbWFwcGluZ3MgYW5kIHNldHRpbmdzIGFzIHRoZSBvcmlnaW5hbCBpbmRleC5cbiAgICogQHBhcmFtIHJlaW5kZXhPcFxuICAgKi9cbiAgY29uc3QgY3JlYXRlTmV3SW5kZXggPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBjb25zdCB7IGluZGV4TmFtZSwgbmV3SW5kZXhOYW1lIH0gPSByZWluZGV4T3AuYXR0cmlidXRlcztcblxuICAgIGNvbnN0IGZsYXRTZXR0aW5ncyA9IGF3YWl0IGFjdGlvbnMuZ2V0RmxhdFNldHRpbmdzKGluZGV4TmFtZSk7XG4gICAgaWYgKCFmbGF0U2V0dGluZ3MpIHtcbiAgICAgIHRocm93IEJvb20ubm90Rm91bmQoYEluZGV4ICR7aW5kZXhOYW1lfSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNldHRpbmdzLCBtYXBwaW5ncyB9ID0gdHJhbnNmb3JtRmxhdFNldHRpbmdzKGZsYXRTZXR0aW5ncyk7XG4gICAgY29uc3QgY3JlYXRlSW5kZXggPSBhd2FpdCBjYWxsQ2x1c3RlcignaW5kaWNlcy5jcmVhdGUnLCB7XG4gICAgICBpbmRleDogbmV3SW5kZXhOYW1lLFxuICAgICAgYm9keToge1xuICAgICAgICBzZXR0aW5ncyxcbiAgICAgICAgbWFwcGluZ3MsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFjcmVhdGVJbmRleC5hY2tub3dsZWRnZWQpIHtcbiAgICAgIHRocm93IEJvb20uYmFkSW1wbGVtZW50YXRpb24oYEluZGV4IGNvdWxkIG5vdCBiZSBjcmVhdGVkOiAke25ld0luZGV4TmFtZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9ucy51cGRhdGVSZWluZGV4T3AocmVpbmRleE9wLCB7XG4gICAgICBsYXN0Q29tcGxldGVkU3RlcDogUmVpbmRleFN0ZXAubmV3SW5kZXhDcmVhdGVkLFxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCZWdpbnMgdGhlIHJlaW5kZXggcHJvY2VzcyB2aWEgRWxhc3RpY3NlYXJjaCdzIFJlaW5kZXggQVBJLlxuICAgKiBAcGFyYW0gcmVpbmRleE9wXG4gICAqL1xuICBjb25zdCBzdGFydFJlaW5kZXhpbmcgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBjb25zdCB7IGluZGV4TmFtZSB9ID0gcmVpbmRleE9wLmF0dHJpYnV0ZXM7XG4gICAgY29uc3QgcmVpbmRleEJvZHkgPSB7XG4gICAgICBzb3VyY2U6IHsgaW5kZXg6IGluZGV4TmFtZSB9LFxuICAgICAgZGVzdDogeyBpbmRleDogcmVpbmRleE9wLmF0dHJpYnV0ZXMubmV3SW5kZXhOYW1lIH0sXG4gICAgfSBhcyBhbnk7XG5cbiAgICBjb25zdCBib29sZWFuRmllbGRQYXRocyA9IGF3YWl0IGFjdGlvbnMuZ2V0Qm9vbGVhbkZpZWxkUGF0aHMoaW5kZXhOYW1lKTtcbiAgICBpZiAoYm9vbGVhbkZpZWxkUGF0aHMubGVuZ3RoKSB7XG4gICAgICByZWluZGV4Qm9keS5zY3JpcHQgPSB7XG4gICAgICAgIGxhbmc6ICdwYWlubGVzcycsXG4gICAgICAgIHNvdXJjZTogYFxuICAgICAgICAgIC8vIFVwZGF0ZXMgYSBzaW5nbGUgZmllbGQgaW4gYSBNYXBcbiAgICAgICAgICB2b2lkIHVwZGF0ZUZpZWxkKE1hcCBkYXRhLCBTdHJpbmcgZmllbGROYW1lKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGRhdGFbZmllbGROYW1lXSA9PSAneWVzJyB8fFxuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPT0gJzEnIHx8XG4gICAgICAgICAgICAgIChkYXRhW2ZpZWxkTmFtZV0gaW5zdGFuY2VvZiBJbnRlZ2VyICYmIGRhdGFbZmllbGROYW1lXSA9PSAxKSB8fFxuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPT0gJ29uJ1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGRhdGFbZmllbGROYW1lXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPT0gJ25vJyB8fFxuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPT0gJzAnIHx8XG4gICAgICAgICAgICAgIChkYXRhW2ZpZWxkTmFtZV0gaW5zdGFuY2VvZiBJbnRlZ2VyICYmIGRhdGFbZmllbGROYW1lXSA9PSAwKSB8fFxuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPT0gJ29mZidcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWN1cnNpdmVseSB3YWxrcyB0aGUgZmllbGRQYXRoIGxpc3QgYW5kIGNhbGxzXG4gICAgICAgICAgdm9pZCB1cGRhdGVGaWVsZFBhdGgoZGVmIGRhdGEsIExpc3QgZmllbGRQYXRoKSB7XG4gICAgICAgICAgICBTdHJpbmcgcGF0aEhlYWQgPSBmaWVsZFBhdGhbMF07XG5cbiAgICAgICAgICAgIGlmIChmaWVsZFBhdGguZ2V0TGVuZ3RoKCkgPT0gMSkge1xuICAgICAgICAgICAgICBpZiAoZGF0YS5nZXQocGF0aEhlYWQpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQoZGF0YSwgcGF0aEhlYWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBMaXN0IGZpZWxkUGF0aFRhaWwgPSBmaWVsZFBhdGguc3ViTGlzdCgxLCBmaWVsZFBhdGguZ2V0TGVuZ3RoKCkpO1xuXG4gICAgICAgICAgICAgIGlmIChkYXRhLmdldChwYXRoSGVhZCkgaW5zdGFuY2VvZiBMaXN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChpdGVtIGluIGRhdGFbcGF0aEhlYWRdKSB7XG4gICAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZFBhdGgoaXRlbSwgZmllbGRQYXRoVGFpbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZ2V0KHBhdGhIZWFkKSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkUGF0aChkYXRhW3BhdGhIZWFkXSwgZmllbGRQYXRoVGFpbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGZpZWxkUGF0aCBpbiBwYXJhbXMuYm9vbGVhbkZpZWxkUGF0aHMpIHtcbiAgICAgICAgICAgIHVwZGF0ZUZpZWxkUGF0aChjdHguX3NvdXJjZSwgZmllbGRQYXRoKVxuICAgICAgICAgIH1cbiAgICAgICAgYCxcbiAgICAgICAgcGFyYW1zOiB7IGJvb2xlYW5GaWVsZFBhdGhzIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0UmVpbmRleCA9IChhd2FpdCBjYWxsQ2x1c3RlcigncmVpbmRleCcsIHtcbiAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgICB3YWl0Rm9yQ29tcGxldGlvbjogZmFsc2UsXG4gICAgICBib2R5OiByZWluZGV4Qm9keSxcbiAgICB9KSkgYXMgeyB0YXNrOiBzdHJpbmcgfTtcblxuICAgIHJldHVybiBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChyZWluZGV4T3AsIHtcbiAgICAgIGxhc3RDb21wbGV0ZWRTdGVwOiBSZWluZGV4U3RlcC5yZWluZGV4U3RhcnRlZCxcbiAgICAgIHJlaW5kZXhUYXNrSWQ6IHN0YXJ0UmVpbmRleC50YXNrLFxuICAgICAgcmVpbmRleFRhc2tQZXJjQ29tcGxldGU6IDAsXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBvbGxzIEVsYXN0aWNzZWFyY2gncyBUYXNrcyBBUEkgdG8gc2VlIGlmIHRoZSByZWluZGV4IG9wZXJhdGlvbiBoYXMgYmVlbiBjb21wbGV0ZWQuXG4gICAqIEBwYXJhbSByZWluZGV4T3BcbiAgICovXG4gIGNvbnN0IHVwZGF0ZVJlaW5kZXhTdGF0dXMgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBjb25zdCB0YXNrSWQgPSByZWluZGV4T3AuYXR0cmlidXRlcy5yZWluZGV4VGFza0lkO1xuXG4gICAgLy8gQ2hlY2sgcmVpbmRleGluZyB0YXNrIHByb2dyZXNzXG4gICAgY29uc3QgdGFza1Jlc3BvbnNlID0gYXdhaXQgY2FsbENsdXN0ZXIoJ3Rhc2tzLmdldCcsIHtcbiAgICAgIHRhc2tJZCxcbiAgICAgIHdhaXRGb3JDb21wbGV0aW9uOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGlmICghdGFza1Jlc3BvbnNlLmNvbXBsZXRlZCkge1xuICAgICAgLy8gVXBkYXRlZCB0aGUgcGVyY2VudCBjb21wbGV0ZVxuICAgICAgY29uc3QgcGVyYyA9IHRhc2tSZXNwb25zZS50YXNrLnN0YXR1cy5jcmVhdGVkIC8gdGFza1Jlc3BvbnNlLnRhc2suc3RhdHVzLnRvdGFsO1xuICAgICAgcmV0dXJuIGFjdGlvbnMudXBkYXRlUmVpbmRleE9wKHJlaW5kZXhPcCwge1xuICAgICAgICByZWluZGV4VGFza1BlcmNDb21wbGV0ZTogcGVyYyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGFza1Jlc3BvbnNlLnRhc2suc3RhdHVzLmNhbmNlbGVkID09PSAnYnkgdXNlciByZXF1ZXN0Jykge1xuICAgICAgLy8gU2V0IHRoZSBzdGF0dXMgdG8gY2FuY2VsbGVkXG4gICAgICByZWluZGV4T3AgPSBhd2FpdCBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChyZWluZGV4T3AsIHtcbiAgICAgICAgc3RhdHVzOiBSZWluZGV4U3RhdHVzLmNhbmNlbGxlZCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBEbyBhbnkgb3RoZXIgY2xlYW51cCB3b3JrIG5lY2Vzc2FyeVxuICAgICAgcmVpbmRleE9wID0gYXdhaXQgY2xlYW51cENoYW5nZXMocmVpbmRleE9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2hlY2sgdGhhdCBpdCByZWluZGV4ZWQgYWxsIGRvY3VtZW50c1xuICAgICAgY29uc3QgeyBjb3VudCB9ID0gYXdhaXQgY2FsbENsdXN0ZXIoJ2NvdW50JywgeyBpbmRleDogcmVpbmRleE9wLmF0dHJpYnV0ZXMuaW5kZXhOYW1lIH0pO1xuXG4gICAgICBpZiAodGFza1Jlc3BvbnNlLnRhc2suc3RhdHVzLmNyZWF0ZWQgPCBjb3VudCkge1xuICAgICAgICAvLyBJbmNsdWRlIHRoZSBlbnRpcmUgdGFzayByZXN1bHQgaW4gdGhlIGVycm9yIG1lc3NhZ2UuIFRoaXMgc2hvdWxkIGJlIGd1YXJhbnRlZWRcbiAgICAgICAgLy8gdG8gYmUgSlNPTi1zZXJpYWxpemFibGUgc2luY2UgaXQganVzdCBjYW1lIGJhY2sgZnJvbSBFbGFzdGljc2VhcmNoLlxuICAgICAgICB0aHJvdyBCb29tLmJhZERhdGEoYFJlaW5kZXhpbmcgZmFpbGVkOiAke0pTT04uc3RyaW5naWZ5KHRhc2tSZXNwb25zZSl9YCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdHVzXG4gICAgICByZWluZGV4T3AgPSBhd2FpdCBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChyZWluZGV4T3AsIHtcbiAgICAgICAgbGFzdENvbXBsZXRlZFN0ZXA6IFJlaW5kZXhTdGVwLnJlaW5kZXhDb21wbGV0ZWQsXG4gICAgICAgIHJlaW5kZXhUYXNrUGVyY0NvbXBsZXRlOiAxLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIHRoZSB0YXNrIGZyb20gRVMgLnRhc2tzIGluZGV4XG4gICAgY29uc3QgZGVsZXRlVGFza1Jlc3AgPSBhd2FpdCBjYWxsQ2x1c3RlcignZGVsZXRlJywge1xuICAgICAgaW5kZXg6ICcudGFza3MnLFxuICAgICAgdHlwZTogJ3Rhc2snLFxuICAgICAgaWQ6IHRhc2tJZCxcbiAgICB9KTtcblxuICAgIGlmIChkZWxldGVUYXNrUmVzcC5yZXN1bHQgIT09ICdkZWxldGVkJykge1xuICAgICAgdGhyb3cgQm9vbS5iYWRJbXBsZW1lbnRhdGlvbihgQ291bGQgbm90IGRlbGV0ZSByZWluZGV4aW5nIHRhc2sgJHt0YXNrSWR9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlaW5kZXhPcDtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhbGlhcyB0aGF0IHBvaW50cyB0aGUgb2xkIGluZGV4IHRvIHRoZSBuZXcgaW5kZXgsIGRlbGV0ZXMgdGhlIG9sZCBpbmRleC5cbiAgICogQHBhcmFtIHJlaW5kZXhPcFxuICAgKi9cbiAgY29uc3Qgc3dpdGNoQWxpYXMgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBjb25zdCB7IGluZGV4TmFtZSwgbmV3SW5kZXhOYW1lIH0gPSByZWluZGV4T3AuYXR0cmlidXRlcztcblxuICAgIGNvbnN0IGV4aXN0aW5nQWxpYXNlcyA9IChhd2FpdCBjYWxsQ2x1c3RlcignaW5kaWNlcy5nZXRBbGlhcycsIHtcbiAgICAgIGluZGV4OiBpbmRleE5hbWUsXG4gICAgfSkpW2luZGV4TmFtZV0uYWxpYXNlcztcblxuICAgIGNvbnN0IGV4dHJhQWxpc2VzID0gT2JqZWN0LmtleXMoZXhpc3RpbmdBbGlhc2VzKS5tYXAoYWxpYXNOYW1lID0+ICh7XG4gICAgICBhZGQ6IHsgaW5kZXg6IG5ld0luZGV4TmFtZSwgYWxpYXM6IGFsaWFzTmFtZSwgLi4uZXhpc3RpbmdBbGlhc2VzW2FsaWFzTmFtZV0gfSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBhbGlhc1Jlc3BvbnNlID0gYXdhaXQgY2FsbENsdXN0ZXIoJ2luZGljZXMudXBkYXRlQWxpYXNlcycsIHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIHsgYWRkOiB7IGluZGV4OiBuZXdJbmRleE5hbWUsIGFsaWFzOiBpbmRleE5hbWUgfSB9LFxuICAgICAgICAgIHsgcmVtb3ZlX2luZGV4OiB7IGluZGV4OiBpbmRleE5hbWUgfSB9LFxuICAgICAgICAgIC4uLmV4dHJhQWxpc2VzLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghYWxpYXNSZXNwb25zZS5hY2tub3dsZWRnZWQpIHtcbiAgICAgIHRocm93IEJvb20uYmFkSW1wbGVtZW50YXRpb24oYEluZGV4IGFsaWFzZXMgY291bGQgbm90IGJlIGNyZWF0ZWQuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbnMudXBkYXRlUmVpbmRleE9wKHJlaW5kZXhPcCwge1xuICAgICAgbGFzdENvbXBsZXRlZFN0ZXA6IFJlaW5kZXhTdGVwLmFsaWFzQ3JlYXRlZCxcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCByZXN1bWVJbmRleEdyb3VwU2VydmljZXMgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBpZiAoaXNNbEluZGV4KHJlaW5kZXhPcC5hdHRyaWJ1dGVzLmluZGV4TmFtZSkpIHtcbiAgICAgIGF3YWl0IHJlc3VtZU1sSm9icygpO1xuICAgIH0gZWxzZSBpZiAoaXNXYXRjaGVySW5kZXgocmVpbmRleE9wLmF0dHJpYnV0ZXMuaW5kZXhOYW1lKSkge1xuICAgICAgYXdhaXQgc3RhcnRXYXRjaGVyKCk7XG4gICAgfVxuXG4gICAgLy8gT25seSBjaGFuZ2UgdGhlIHN0YXR1cyBpZiB3ZSdyZSBzdGlsbCBpbi1wcm9ncmVzcyAodGhpcyBmdW5jdGlvbiBpcyBhbHNvIGNhbGxlZCB3aGVuIHRoZSByZWluZGV4IGZhaWxzIG9yIGlzIGNhbmNlbGxlZClcbiAgICBpZiAocmVpbmRleE9wLmF0dHJpYnV0ZXMuc3RhdHVzID09PSBSZWluZGV4U3RhdHVzLmluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybiBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChyZWluZGV4T3AsIHtcbiAgICAgICAgbGFzdENvbXBsZXRlZFN0ZXA6IFJlaW5kZXhTdGVwLmluZGV4R3JvdXBTZXJ2aWNlc1N0YXJ0ZWQsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlaW5kZXhPcDtcbiAgICB9XG4gIH07XG5cbiAgLy8gLS0tLS0tIFRoZSBzZXJ2aWNlIGl0c2VsZlxuXG4gIHJldHVybiB7XG4gICAgYXN5bmMgaGFzUmVxdWlyZWRQcml2aWxlZ2VzKGluZGV4TmFtZTogc3RyaW5nKSB7XG4gICAgICAvLyBJZiBzZWN1cml0eSBpcyBkaXNhYmxlZCBvciB1bmF2YWlsYWJsZSwgcmV0dXJuIHRydWUuXG4gICAgICBjb25zdCBzZWN1cml0eSA9IHhwYWNrSW5mby5mZWF0dXJlKCdzZWN1cml0eScpO1xuICAgICAgaWYgKCFzZWN1cml0eS5pc0F2YWlsYWJsZSgpIHx8ICFzZWN1cml0eS5pc0VuYWJsZWQoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmFtZXMgPSBbaW5kZXhOYW1lLCBnZW5lcmF0ZU5ld0luZGV4TmFtZShpbmRleE5hbWUpXTtcbiAgICAgIGNvbnN0IHNvdXJjZU5hbWUgPSBzb3VyY2VOYW1lRm9ySW5kZXgoaW5kZXhOYW1lKTtcblxuICAgICAgLy8gaWYgd2UgaGF2ZSByZS1pbmRleGVkIHRoaXMgaW4gdGhlIHBhc3QsIHRoZXJlIHdpbGwgYmUgYW5cbiAgICAgIC8vIHVuZGVybHlpbmcgYWxpYXMgd2Ugd2lsbCBhbHNvIG5lZWQgdG8gdXBkYXRlLlxuICAgICAgaWYgKHNvdXJjZU5hbWUgIT09IGluZGV4TmFtZSkge1xuICAgICAgICBuYW1lcy5wdXNoKHNvdXJjZU5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBPdGhlcndpc2UsIHF1ZXJ5IGZvciByZXF1aXJlZCBwcml2aWxlZ2VzIGZvciB0aGlzIGluZGV4LlxuICAgICAgY29uc3QgYm9keSA9IHtcbiAgICAgICAgY2x1c3RlcjogWydtYW5hZ2UnXSxcbiAgICAgICAgaW5kZXg6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lcyxcbiAgICAgICAgICAgIGFsbG93X3Jlc3RyaWN0ZWRfaW5kaWNlczogdHJ1ZSxcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IFsnYWxsJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lczogWycudGFza3MnXSxcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IFsncmVhZCcsICdkZWxldGUnXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSBhcyBhbnk7XG5cbiAgICAgIGlmIChpc01sSW5kZXgoaW5kZXhOYW1lKSkge1xuICAgICAgICBib2R5LmNsdXN0ZXIgPSBbLi4uYm9keS5jbHVzdGVyLCAnbWFuYWdlX21sJ107XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1dhdGNoZXJJbmRleChpbmRleE5hbWUpKSB7XG4gICAgICAgIGJvZHkuY2x1c3RlciA9IFsuLi5ib2R5LmNsdXN0ZXIsICdtYW5hZ2Vfd2F0Y2hlciddO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgY2FsbENsdXN0ZXIoJ3RyYW5zcG9ydC5yZXF1ZXN0Jywge1xuICAgICAgICBwYXRoOiAnL19zZWN1cml0eS91c2VyL19oYXNfcHJpdmlsZWdlcycsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwLmhhc19hbGxfcmVxdWVzdGVkO1xuICAgIH0sXG5cbiAgICBhc3luYyBkZXRlY3RSZWluZGV4V2FybmluZ3MoaW5kZXhOYW1lOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGZsYXRTZXR0aW5ncyA9IGF3YWl0IGFjdGlvbnMuZ2V0RmxhdFNldHRpbmdzKGluZGV4TmFtZSk7XG4gICAgICBpZiAoIWZsYXRTZXR0aW5ncykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXRSZWluZGV4V2FybmluZ3MoZmxhdFNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0SW5kZXhHcm91cChpbmRleE5hbWU6IHN0cmluZykge1xuICAgICAgaWYgKGlzTWxJbmRleChpbmRleE5hbWUpKSB7XG4gICAgICAgIHJldHVybiBJbmRleEdyb3VwLm1sO1xuICAgICAgfSBlbHNlIGlmIChpc1dhdGNoZXJJbmRleChpbmRleE5hbWUpKSB7XG4gICAgICAgIHJldHVybiBJbmRleEdyb3VwLndhdGNoZXI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFzeW5jIGNyZWF0ZVJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGluZGV4RXhpc3RzID0gYXdhaXQgY2FsbENsdXN0ZXIoJ2luZGljZXMuZXhpc3RzJywgeyBpbmRleDogaW5kZXhOYW1lIH0pO1xuICAgICAgaWYgKCFpbmRleEV4aXN0cykge1xuICAgICAgICB0aHJvdyBCb29tLm5vdEZvdW5kKGBJbmRleCAke2luZGV4TmFtZX0gZG9lcyBub3QgZXhpc3QgaW4gdGhpcyBjbHVzdGVyLmApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleGlzdGluZ1JlaW5kZXhPcHMgPSBhd2FpdCBhY3Rpb25zLmZpbmRSZWluZGV4T3BlcmF0aW9ucyhpbmRleE5hbWUpO1xuICAgICAgaWYgKGV4aXN0aW5nUmVpbmRleE9wcy50b3RhbCAhPT0gMCkge1xuICAgICAgICBjb25zdCBleGlzdGluZ09wID0gZXhpc3RpbmdSZWluZGV4T3BzLnNhdmVkX29iamVjdHNbMF07XG4gICAgICAgIGlmIChcbiAgICAgICAgICBleGlzdGluZ09wLmF0dHJpYnV0ZXMuc3RhdHVzID09PSBSZWluZGV4U3RhdHVzLmZhaWxlZCB8fFxuICAgICAgICAgIGV4aXN0aW5nT3AuYXR0cmlidXRlcy5zdGF0dXMgPT09IFJlaW5kZXhTdGF0dXMuY2FuY2VsbGVkXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIERlbGV0ZSB0aGUgZXhpc3Rpbmcgb25lIGlmIGl0IGZhaWxlZCBvciB3YXMgY2FuY2VsbGVkIHRvIGdpdmUgYSBjaGFuY2UgdG8gcmV0cnkuXG4gICAgICAgICAgYXdhaXQgYWN0aW9ucy5kZWxldGVSZWluZGV4T3AoZXhpc3RpbmdPcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgQm9vbS5iYWRJbXBsZW1lbnRhdGlvbihgQSByZWluZGV4IG9wZXJhdGlvbiBhbHJlYWR5IGluLXByb2dyZXNzIGZvciAke2luZGV4TmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWN0aW9ucy5jcmVhdGVSZWluZGV4T3AoaW5kZXhOYW1lKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmluZFJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGZpbmRSZXNwb25zZSA9IGF3YWl0IGFjdGlvbnMuZmluZFJlaW5kZXhPcGVyYXRpb25zKGluZGV4TmFtZSk7XG5cbiAgICAgIC8vIEJhaWwgZWFybHkgaWYgaXQgZG9lcyBub3QgZXhpc3Qgb3IgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZS5cbiAgICAgIGlmIChmaW5kUmVzcG9uc2UudG90YWwgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGZpbmRSZXNwb25zZS50b3RhbCA+IDEpIHtcbiAgICAgICAgdGhyb3cgQm9vbS5iYWRJbXBsZW1lbnRhdGlvbihgTW9yZSB0aGFuIG9uZSByZWluZGV4IG9wZXJhdGlvbiBmb3VuZCBmb3IgJHtpbmRleE5hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5kUmVzcG9uc2Uuc2F2ZWRfb2JqZWN0c1swXTtcbiAgICB9LFxuXG4gICAgZmluZEFsbEJ5U3RhdHVzOiBhY3Rpb25zLmZpbmRBbGxCeVN0YXR1cyxcblxuICAgIGFzeW5jIHByb2Nlc3NOZXh0U3RlcChyZWluZGV4T3A6IFJlaW5kZXhTYXZlZE9iamVjdCkge1xuICAgICAgcmV0dXJuIGFjdGlvbnMucnVuV2hpbGVMb2NrZWQocmVpbmRleE9wLCBhc3luYyBsb2NrZWRSZWluZGV4T3AgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN3aXRjaCAobG9ja2VkUmVpbmRleE9wLmF0dHJpYnV0ZXMubGFzdENvbXBsZXRlZFN0ZXApIHtcbiAgICAgICAgICAgIGNhc2UgUmVpbmRleFN0ZXAuY3JlYXRlZDpcbiAgICAgICAgICAgICAgbG9ja2VkUmVpbmRleE9wID0gYXdhaXQgc3RvcEluZGV4R3JvdXBTZXJ2aWNlcyhsb2NrZWRSZWluZGV4T3ApO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUmVpbmRleFN0ZXAuaW5kZXhHcm91cFNlcnZpY2VzU3RvcHBlZDpcbiAgICAgICAgICAgICAgbG9ja2VkUmVpbmRleE9wID0gYXdhaXQgc2V0UmVhZG9ubHkobG9ja2VkUmVpbmRleE9wKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFJlaW5kZXhTdGVwLnJlYWRvbmx5OlxuICAgICAgICAgICAgICBsb2NrZWRSZWluZGV4T3AgPSBhd2FpdCBjcmVhdGVOZXdJbmRleChsb2NrZWRSZWluZGV4T3ApO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUmVpbmRleFN0ZXAubmV3SW5kZXhDcmVhdGVkOlxuICAgICAgICAgICAgICBsb2NrZWRSZWluZGV4T3AgPSBhd2FpdCBzdGFydFJlaW5kZXhpbmcobG9ja2VkUmVpbmRleE9wKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFJlaW5kZXhTdGVwLnJlaW5kZXhTdGFydGVkOlxuICAgICAgICAgICAgICBsb2NrZWRSZWluZGV4T3AgPSBhd2FpdCB1cGRhdGVSZWluZGV4U3RhdHVzKGxvY2tlZFJlaW5kZXhPcCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBSZWluZGV4U3RlcC5yZWluZGV4Q29tcGxldGVkOlxuICAgICAgICAgICAgICBsb2NrZWRSZWluZGV4T3AgPSBhd2FpdCBzd2l0Y2hBbGlhcyhsb2NrZWRSZWluZGV4T3ApO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUmVpbmRleFN0ZXAuYWxpYXNDcmVhdGVkOlxuICAgICAgICAgICAgICBsb2NrZWRSZWluZGV4T3AgPSBhd2FpdCByZXN1bWVJbmRleEdyb3VwU2VydmljZXMobG9ja2VkUmVpbmRleE9wKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFJlaW5kZXhTdGVwLmluZGV4R3JvdXBTZXJ2aWNlc1N0YXJ0ZWQ6XG4gICAgICAgICAgICAgIGxvY2tlZFJlaW5kZXhPcCA9IGF3YWl0IGFjdGlvbnMudXBkYXRlUmVpbmRleE9wKGxvY2tlZFJlaW5kZXhPcCwge1xuICAgICAgICAgICAgICAgIHN0YXR1czogUmVpbmRleFN0YXR1cy5jb21wbGV0ZWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbG9nKFxuICAgICAgICAgICAgWyd1cGdyYWRlX2Fzc2lzdGFudCcsICdlcnJvciddLFxuICAgICAgICAgICAgYFJlaW5kZXhpbmcgc3RlcCBmYWlsZWQ6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5zdGFjayA6IGUudG9TdHJpbmcoKX1gXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIFRyYXAgdGhlIGV4Y2VwdGlvbiBhbmQgYWRkIHRoZSBtZXNzYWdlIHRvIHRoZSBvYmplY3Qgc28gdGhlIFVJIGNhbiBkaXNwbGF5IGl0LlxuICAgICAgICAgIGxvY2tlZFJlaW5kZXhPcCA9IGF3YWl0IGFjdGlvbnMudXBkYXRlUmVpbmRleE9wKGxvY2tlZFJlaW5kZXhPcCwge1xuICAgICAgICAgICAgc3RhdHVzOiBSZWluZGV4U3RhdHVzLmZhaWxlZCxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS50b1N0cmluZygpLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gQ2xlYW51cCBhbnkgY2hhbmdlcywgaWdub3JpbmcgYW55IGVycm9ycy5cbiAgICAgICAgICBsb2NrZWRSZWluZGV4T3AgPSBhd2FpdCBjbGVhbnVwQ2hhbmdlcyhsb2NrZWRSZWluZGV4T3ApLmNhdGNoKGUgPT4gbG9ja2VkUmVpbmRleE9wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NrZWRSZWluZGV4T3A7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgcGF1c2VSZWluZGV4T3BlcmF0aW9uKGluZGV4TmFtZTogc3RyaW5nKSB7XG4gICAgICBjb25zdCByZWluZGV4T3AgPSBhd2FpdCB0aGlzLmZpbmRSZWluZGV4T3BlcmF0aW9uKGluZGV4TmFtZSk7XG5cbiAgICAgIGlmICghcmVpbmRleE9wKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcmVpbmRleCBvcGVyYXRpb24gZm91bmQgZm9yIGluZGV4ICR7aW5kZXhOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWN0aW9ucy5ydW5XaGlsZUxvY2tlZChyZWluZGV4T3AsIGFzeW5jIG9wID0+IHtcbiAgICAgICAgaWYgKG9wLmF0dHJpYnV0ZXMuc3RhdHVzID09PSBSZWluZGV4U3RhdHVzLnBhdXNlZCkge1xuICAgICAgICAgIC8vIEFub3RoZXIgbm9kZSBhbHJlYWR5IHBhdXNlZCB0aGUgb3BlcmF0aW9uLCBkb24ndCBkbyBhbnl0aGluZ1xuICAgICAgICAgIHJldHVybiByZWluZGV4T3A7XG4gICAgICAgIH0gZWxzZSBpZiAob3AuYXR0cmlidXRlcy5zdGF0dXMgIT09IFJlaW5kZXhTdGF0dXMuaW5Qcm9ncmVzcykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVpbmRleCBvcGVyYXRpb24gbXVzdCBiZSBpblByb2dyZXNzIGluIG9yZGVyIHRvIGJlIHBhdXNlZC5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChvcCwgeyBzdGF0dXM6IFJlaW5kZXhTdGF0dXMucGF1c2VkIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIHJlc3VtZVJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IHJlaW5kZXhPcCA9IGF3YWl0IHRoaXMuZmluZFJlaW5kZXhPcGVyYXRpb24oaW5kZXhOYW1lKTtcblxuICAgICAgaWYgKCFyZWluZGV4T3ApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyByZWluZGV4IG9wZXJhdGlvbiBmb3VuZCBmb3IgaW5kZXggJHtpbmRleE5hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhY3Rpb25zLnJ1bldoaWxlTG9ja2VkKHJlaW5kZXhPcCwgYXN5bmMgb3AgPT4ge1xuICAgICAgICBpZiAob3AuYXR0cmlidXRlcy5zdGF0dXMgPT09IFJlaW5kZXhTdGF0dXMuaW5Qcm9ncmVzcykge1xuICAgICAgICAgIC8vIEFub3RoZXIgbm9kZSBhbHJlYWR5IHJlc3VtZWQgdGhlIG9wZXJhdGlvbiwgZG9uJ3QgZG8gYW55dGhpbmdcbiAgICAgICAgICByZXR1cm4gcmVpbmRleE9wO1xuICAgICAgICB9IGVsc2UgaWYgKG9wLmF0dHJpYnV0ZXMuc3RhdHVzICE9PSBSZWluZGV4U3RhdHVzLnBhdXNlZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVpbmRleCBvcGVyYXRpb24gbXVzdCBiZSBwYXVzZWQgaW4gb3JkZXIgdG8gYmUgcmVzdW1lZC5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhY3Rpb25zLnVwZGF0ZVJlaW5kZXhPcChvcCwgeyBzdGF0dXM6IFJlaW5kZXhTdGF0dXMuaW5Qcm9ncmVzcyB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBjYW5jZWxSZWluZGV4aW5nKGluZGV4TmFtZTogc3RyaW5nKSB7XG4gICAgICBjb25zdCByZWluZGV4T3AgPSBhd2FpdCB0aGlzLmZpbmRSZWluZGV4T3BlcmF0aW9uKGluZGV4TmFtZSk7XG5cbiAgICAgIGlmICghcmVpbmRleE9wKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcmVpbmRleCBvcGVyYXRpb24gZm91bmQgZm9yIGluZGV4ICR7aW5kZXhOYW1lfWApO1xuICAgICAgfSBlbHNlIGlmIChyZWluZGV4T3AuYXR0cmlidXRlcy5zdGF0dXMgIT09IFJlaW5kZXhTdGF0dXMuaW5Qcm9ncmVzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlaW5kZXggb3BlcmF0aW9uIGlzIG5vdCBpbiBwcm9ncmVzc2ApO1xuICAgICAgfSBlbHNlIGlmIChyZWluZGV4T3AuYXR0cmlidXRlcy5sYXN0Q29tcGxldGVkU3RlcCAhPT0gUmVpbmRleFN0ZXAucmVpbmRleFN0YXJ0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZWluZGV4IG9wZXJhdGlvbiBpcyBub3QgY3VycmVudCB3YWl0aW5nIGZvciByZWluZGV4IHRhc2sgdG8gY29tcGxldGVgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGNhbGxDbHVzdGVyKCd0YXNrcy5jYW5jZWwnLCB7XG4gICAgICAgIHRhc2tJZDogcmVpbmRleE9wLmF0dHJpYnV0ZXMucmVpbmRleFRhc2tJZCxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVzcC5ub2RlX2ZhaWx1cmVzICYmIHJlc3Aubm9kZV9mYWlsdXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGNhbmNlbCByZWluZGV4LmApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVpbmRleE9wO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgaXNNbEluZGV4ID0gKGluZGV4TmFtZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHNvdXJjZU5hbWUgPSBzb3VyY2VOYW1lRm9ySW5kZXgoaW5kZXhOYW1lKTtcbiAgcmV0dXJuIE1MX0lORElDRVMuaW5kZXhPZihzb3VyY2VOYW1lKSA+PSAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzV2F0Y2hlckluZGV4ID0gKGluZGV4TmFtZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHNvdXJjZU5hbWUgPSBzb3VyY2VOYW1lRm9ySW5kZXgoaW5kZXhOYW1lKTtcbiAgcmV0dXJuIFdBVENIRVJfSU5ESUNFUy5pbmRleE9mKHNvdXJjZU5hbWUpID49IDA7XG59O1xuIl19