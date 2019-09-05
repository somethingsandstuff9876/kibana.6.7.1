"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const types_1 = require("../../../common/types");
const reindex_actions_1 = require("./reindex_actions");
const reindex_service_1 = require("./reindex_service");
const POLL_INTERVAL = 30000;
// If no nodes have been able to update this index in 2 minutes (due to missing credentials), set to paused.
const PAUSE_WINDOW = POLL_INTERVAL * 4;
const LOG_TAGS = ['upgrade_assistant', 'reindex_worker'];
/**
 * A singleton worker that will coordinate two polling loops:
 *   (1) A longer loop that polls for reindex operations that are in progress. If any are found, loop (2) is started.
 *   (2) A tighter loop that pushes each in progress reindex operation through ReindexService.processNextStep. If all
 *       updated reindex operations are complete, this loop will terminate.
 *
 * The worker can also be forced to start loop (2) by calling forceRefresh(). This is done when we know a new reindex
 * operation has been started.
 *
 * This worker can be ran on multiple nodes without conflicts or dropped jobs. Reindex operations are locked by the
 * ReindexService and if any operation is locked longer than the ReindexService's timeout, it is assumed to have been
 * locked by a node that is no longer running (crashed or shutdown). In this case, another node may safely acquire
 * the lock for this reindex operation.
 */
class ReindexWorker {
    constructor(client, credentialStore, callWithRequest, callWithInternalUser, xpackInfo, log) {
        this.client = client;
        this.credentialStore = credentialStore;
        this.callWithRequest = callWithRequest;
        this.callWithInternalUser = callWithInternalUser;
        this.xpackInfo = xpackInfo;
        this.log = log;
        this.continuePolling = false;
        this.updateOperationLoopRunning = false;
        this.inProgressOps = [];
        /**
         * Begins loop (1) to begin checking for in progress reindex operations.
         */
        this.start = () => {
            this.log(['debug', ...LOG_TAGS], `Starting worker...`);
            this.continuePolling = true;
            this.pollForOperations();
        };
        /**
         * Stops the worker from processing any further reindex operations.
         */
        this.stop = () => {
            this.log(['debug', ...LOG_TAGS], `Stopping worker...`);
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.updateOperationLoopRunning = false;
            this.continuePolling = false;
        };
        /**
         * Should be called immediately after this server has started a new reindex operation.
         */
        this.forceRefresh = () => {
            this.refresh();
        };
        /**
         * Returns whether or not the given ReindexOperation is in the worker's queue.
         */
        this.includes = (reindexOp) => {
            return this.inProgressOps.map(o => o.id).includes(reindexOp.id);
        };
        /**
         * Runs an async loop until all inProgress jobs are complete or failed.
         */
        this.startUpdateOperationLoop = async () => {
            this.updateOperationLoopRunning = true;
            while (this.inProgressOps.length > 0) {
                this.log(['debug', ...LOG_TAGS], `Updating ${this.inProgressOps.length} reindex operations`);
                // Push each operation through the state machine and refresh.
                await Promise.all(this.inProgressOps.map(this.processNextStep));
                await this.refresh();
            }
            this.updateOperationLoopRunning = false;
        };
        this.pollForOperations = async () => {
            this.log(['debug', ...LOG_TAGS], `Polling for reindex operations`);
            await this.refresh();
            if (this.continuePolling) {
                this.timeout = setTimeout(this.pollForOperations, POLL_INTERVAL);
            }
        };
        this.refresh = async () => {
            try {
                this.inProgressOps = await this.reindexService.findAllByStatus(types_1.ReindexStatus.inProgress);
            }
            catch (e) {
                this.log(['debug', ...LOG_TAGS], `Could not fetch riendex operations from Elasticsearch`);
                this.inProgressOps = [];
            }
            // If there are operations in progress and we're not already updating operations, kick off the update loop
            if (!this.updateOperationLoopRunning) {
                this.startUpdateOperationLoop();
            }
        };
        this.processNextStep = async (reindexOp) => {
            const credential = this.credentialStore.get(reindexOp);
            if (!credential) {
                // Set to paused state if the job hasn't been updated in PAUSE_WINDOW.
                // This indicates that no Kibana nodes currently have credentials to update this job.
                const now = moment();
                const updatedAt = moment(reindexOp.updated_at);
                if (updatedAt < now.subtract(PAUSE_WINDOW)) {
                    return this.reindexService.pauseReindexOperation(reindexOp.attributes.indexName);
                }
                else {
                    // If it has been updated recently, we assume another node has the necessary credentials,
                    // and this becomes a noop.
                    return reindexOp;
                }
            }
            // Setup a ReindexService specific to these credentials.
            const fakeRequest = { headers: credential };
            const callCluster = this.callWithRequest.bind(null, fakeRequest);
            const actions = reindex_actions_1.reindexActionsFactory(this.client, callCluster);
            const service = reindex_service_1.reindexServiceFactory(callCluster, this.xpackInfo, actions, this.log);
            reindexOp = await swallowExceptions(service.processNextStep, this.log)(reindexOp);
            // Update credential store with most recent state.
            this.credentialStore.set(reindexOp, credential);
        };
        if (ReindexWorker.workerSingleton) {
            throw new Error(`More than one ReindexWorker cannot be created.`);
        }
        this.reindexService = reindex_service_1.reindexServiceFactory(this.callWithInternalUser, this.xpackInfo, reindex_actions_1.reindexActionsFactory(this.client, this.callWithInternalUser), this.log);
        ReindexWorker.workerSingleton = this;
    }
}
exports.ReindexWorker = ReindexWorker;
/**
 * Swallows any exceptions that may occur during the reindex process. This prevents any errors from
 * stopping the worker from continuing to process more jobs.
 */
const swallowExceptions = (func, log) => async (reindexOp) => {
    try {
        return await func(reindexOp);
    }
    catch (e) {
        if (reindexOp.attributes.locked) {
            log(['debug', ...LOG_TAGS], `Skipping reindexOp with unexpired lock: ${reindexOp.id}`);
        }
        else {
            log(['warning', ...LOG_TAGS], `Error when trying to process reindexOp (${reindexOp.id}): ${e.toString()}`);
        }
        return reindexOp;
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL2xpYi9yZWluZGV4aW5nL3dvcmtlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL2xpYi9yZWluZGV4aW5nL3dvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVNBLGlDQUFrQztBQUVsQyxpREFBMEU7QUFFMUUsdURBQTBEO0FBQzFELHVEQUEwRTtBQUUxRSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDNUIsNEdBQTRHO0FBQzVHLE1BQU0sWUFBWSxHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRXpEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFhLGFBQWE7SUFReEIsWUFDVSxNQUEwQixFQUMxQixlQUFnQyxFQUNoQyxlQUF1QyxFQUN2QyxvQkFBaUMsRUFDakMsU0FBb0IsRUFDWCxHQUFrQjtRQUwzQixXQUFNLEdBQU4sTUFBTSxDQUFvQjtRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsb0JBQWUsR0FBZixlQUFlLENBQXdCO1FBQ3ZDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBYTtRQUNqQyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ1gsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQVo3QixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQywrQkFBMEIsR0FBWSxLQUFLLENBQUM7UUFFNUMsa0JBQWEsR0FBeUIsRUFBRSxDQUFDO1FBeUJqRDs7V0FFRztRQUNJLFVBQUssR0FBRyxHQUFHLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFH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O1FBQ2xELENBQUMsQ0FBQztRQXJIQSxJQUFJLGFBQWEsQ0FBQyxlQUFlLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyx1Q0FBcUIsQ0FDekMsSUFBSSxDQUFDLG9CQUFvQixFQUN6QixJQUFJLENBQUMsU0FBUyxFQUNkLHVDQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQzdELElBQUksQ0FBQyxHQUFHLENBQ1QsQ0FBQztRQUVGLGFBQWEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7Q0EwR0Y7QUF0SUQsc0NBc0lDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxpQkFBaUIsR0FBRyxDQUN4QixJQUFvRSxFQUNwRSxHQUFrQixFQUNsQixFQUFFLENBQUMsS0FBSyxFQUFFLFNBQTZCLEVBQUUsRUFBRTtJQUMzQyxJQUFJO1FBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUMvQixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSwyQ0FBMkMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDeEY7YUFBTTtZQUNMLEdBQUcsQ0FDRCxDQUFDLFNBQVMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUN4QiwyQ0FBMkMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FDNUUsQ0FBQztTQUNIO1FBRUQsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgQ2FsbENsdXN0ZXIsIENhbGxDbHVzdGVyV2l0aFJlcXVlc3QgfSBmcm9tICdzcmMvbGVnYWN5L2NvcmVfcGx1Z2lucy9lbGFzdGljc2VhcmNoJztcbmltcG9ydCB7IFJlcXVlc3QsIFNlcnZlciB9IGZyb20gJ3NyYy9zZXJ2ZXIva2JuX3NlcnZlcic7XG5pbXBvcnQgeyBTYXZlZE9iamVjdHNDbGllbnQgfSBmcm9tICdzcmMvc2VydmVyL3NhdmVkX29iamVjdHMnO1xuXG5pbXBvcnQgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5pbXBvcnQgeyBYUGFja0luZm8gfSBmcm9tICd4LXBhY2svcGx1Z2lucy94cGFja19tYWluL3NlcnZlci9saWIveHBhY2tfaW5mbyc7XG5pbXBvcnQgeyBSZWluZGV4U2F2ZWRPYmplY3QsIFJlaW5kZXhTdGF0dXMgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgQ3JlZGVudGlhbFN0b3JlIH0gZnJvbSAnLi9jcmVkZW50aWFsX3N0b3JlJztcbmltcG9ydCB7IHJlaW5kZXhBY3Rpb25zRmFjdG9yeSB9IGZyb20gJy4vcmVpbmRleF9hY3Rpb25zJztcbmltcG9ydCB7IFJlaW5kZXhTZXJ2aWNlLCByZWluZGV4U2VydmljZUZhY3RvcnkgfSBmcm9tICcuL3JlaW5kZXhfc2VydmljZSc7XG5cbmNvbnN0IFBPTExfSU5URVJWQUwgPSAzMDAwMDtcbi8vIElmIG5vIG5vZGVzIGhhdmUgYmVlbiBhYmxlIHRvIHVwZGF0ZSB0aGlzIGluZGV4IGluIDIgbWludXRlcyAoZHVlIHRvIG1pc3NpbmcgY3JlZGVudGlhbHMpLCBzZXQgdG8gcGF1c2VkLlxuY29uc3QgUEFVU0VfV0lORE9XID0gUE9MTF9JTlRFUlZBTCAqIDQ7XG5cbmNvbnN0IExPR19UQUdTID0gWyd1cGdyYWRlX2Fzc2lzdGFudCcsICdyZWluZGV4X3dvcmtlciddO1xuXG4vKipcbiAqIEEgc2luZ2xldG9uIHdvcmtlciB0aGF0IHdpbGwgY29vcmRpbmF0ZSB0d28gcG9sbGluZyBsb29wczpcbiAqICAgKDEpIEEgbG9uZ2VyIGxvb3AgdGhhdCBwb2xscyBmb3IgcmVpbmRleCBvcGVyYXRpb25zIHRoYXQgYXJlIGluIHByb2dyZXNzLiBJZiBhbnkgYXJlIGZvdW5kLCBsb29wICgyKSBpcyBzdGFydGVkLlxuICogICAoMikgQSB0aWdodGVyIGxvb3AgdGhhdCBwdXNoZXMgZWFjaCBpbiBwcm9ncmVzcyByZWluZGV4IG9wZXJhdGlvbiB0aHJvdWdoIFJlaW5kZXhTZXJ2aWNlLnByb2Nlc3NOZXh0U3RlcC4gSWYgYWxsXG4gKiAgICAgICB1cGRhdGVkIHJlaW5kZXggb3BlcmF0aW9ucyBhcmUgY29tcGxldGUsIHRoaXMgbG9vcCB3aWxsIHRlcm1pbmF0ZS5cbiAqXG4gKiBUaGUgd29ya2VyIGNhbiBhbHNvIGJlIGZvcmNlZCB0byBzdGFydCBsb29wICgyKSBieSBjYWxsaW5nIGZvcmNlUmVmcmVzaCgpLiBUaGlzIGlzIGRvbmUgd2hlbiB3ZSBrbm93IGEgbmV3IHJlaW5kZXhcbiAqIG9wZXJhdGlvbiBoYXMgYmVlbiBzdGFydGVkLlxuICpcbiAqIFRoaXMgd29ya2VyIGNhbiBiZSByYW4gb24gbXVsdGlwbGUgbm9kZXMgd2l0aG91dCBjb25mbGljdHMgb3IgZHJvcHBlZCBqb2JzLiBSZWluZGV4IG9wZXJhdGlvbnMgYXJlIGxvY2tlZCBieSB0aGVcbiAqIFJlaW5kZXhTZXJ2aWNlIGFuZCBpZiBhbnkgb3BlcmF0aW9uIGlzIGxvY2tlZCBsb25nZXIgdGhhbiB0aGUgUmVpbmRleFNlcnZpY2UncyB0aW1lb3V0LCBpdCBpcyBhc3N1bWVkIHRvIGhhdmUgYmVlblxuICogbG9ja2VkIGJ5IGEgbm9kZSB0aGF0IGlzIG5vIGxvbmdlciBydW5uaW5nIChjcmFzaGVkIG9yIHNodXRkb3duKS4gSW4gdGhpcyBjYXNlLCBhbm90aGVyIG5vZGUgbWF5IHNhZmVseSBhY3F1aXJlXG4gKiB0aGUgbG9jayBmb3IgdGhpcyByZWluZGV4IG9wZXJhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlaW5kZXhXb3JrZXIge1xuICBwcml2YXRlIHN0YXRpYyB3b3JrZXJTaW5nbGV0b24/OiBSZWluZGV4V29ya2VyO1xuICBwcml2YXRlIGNvbnRpbnVlUG9sbGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZU9wZXJhdGlvbkxvb3BSdW5uaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgdGltZW91dD86IE5vZGVKUy5UaW1lb3V0O1xuICBwcml2YXRlIGluUHJvZ3Jlc3NPcHM6IFJlaW5kZXhTYXZlZE9iamVjdFtdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgcmVpbmRleFNlcnZpY2U6IFJlaW5kZXhTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2xpZW50OiBTYXZlZE9iamVjdHNDbGllbnQsXG4gICAgcHJpdmF0ZSBjcmVkZW50aWFsU3RvcmU6IENyZWRlbnRpYWxTdG9yZSxcbiAgICBwcml2YXRlIGNhbGxXaXRoUmVxdWVzdDogQ2FsbENsdXN0ZXJXaXRoUmVxdWVzdCxcbiAgICBwcml2YXRlIGNhbGxXaXRoSW50ZXJuYWxVc2VyOiBDYWxsQ2x1c3RlcixcbiAgICBwcml2YXRlIHhwYWNrSW5mbzogWFBhY2tJbmZvLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nOiBTZXJ2ZXJbJ2xvZyddXG4gICkge1xuICAgIGlmIChSZWluZGV4V29ya2VyLndvcmtlclNpbmdsZXRvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNb3JlIHRoYW4gb25lIFJlaW5kZXhXb3JrZXIgY2Fubm90IGJlIGNyZWF0ZWQuYCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWluZGV4U2VydmljZSA9IHJlaW5kZXhTZXJ2aWNlRmFjdG9yeShcbiAgICAgIHRoaXMuY2FsbFdpdGhJbnRlcm5hbFVzZXIsXG4gICAgICB0aGlzLnhwYWNrSW5mbyxcbiAgICAgIHJlaW5kZXhBY3Rpb25zRmFjdG9yeSh0aGlzLmNsaWVudCwgdGhpcy5jYWxsV2l0aEludGVybmFsVXNlciksXG4gICAgICB0aGlzLmxvZ1xuICAgICk7XG5cbiAgICBSZWluZGV4V29ya2VyLndvcmtlclNpbmdsZXRvbiA9IHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQmVnaW5zIGxvb3AgKDEpIHRvIGJlZ2luIGNoZWNraW5nIGZvciBpbiBwcm9ncmVzcyByZWluZGV4IG9wZXJhdGlvbnMuXG4gICAqL1xuICBwdWJsaWMgc3RhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5sb2coWydkZWJ1ZycsIC4uLkxPR19UQUdTXSwgYFN0YXJ0aW5nIHdvcmtlci4uLmApO1xuICAgIHRoaXMuY29udGludWVQb2xsaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnBvbGxGb3JPcGVyYXRpb25zKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3BzIHRoZSB3b3JrZXIgZnJvbSBwcm9jZXNzaW5nIGFueSBmdXJ0aGVyIHJlaW5kZXggb3BlcmF0aW9ucy5cbiAgICovXG4gIHB1YmxpYyBzdG9wID0gKCkgPT4ge1xuICAgIHRoaXMubG9nKFsnZGVidWcnLCAuLi5MT0dfVEFHU10sIGBTdG9wcGluZyB3b3JrZXIuLi5gKTtcbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZU9wZXJhdGlvbkxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jb250aW51ZVBvbGxpbmcgPSBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogU2hvdWxkIGJlIGNhbGxlZCBpbW1lZGlhdGVseSBhZnRlciB0aGlzIHNlcnZlciBoYXMgc3RhcnRlZCBhIG5ldyByZWluZGV4IG9wZXJhdGlvbi5cbiAgICovXG4gIHB1YmxpYyBmb3JjZVJlZnJlc2ggPSAoKSA9PiB7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIFJlaW5kZXhPcGVyYXRpb24gaXMgaW4gdGhlIHdvcmtlcidzIHF1ZXVlLlxuICAgKi9cbiAgcHVibGljIGluY2x1ZGVzID0gKHJlaW5kZXhPcDogUmVpbmRleFNhdmVkT2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuaW5Qcm9ncmVzc09wcy5tYXAobyA9PiBvLmlkKS5pbmNsdWRlcyhyZWluZGV4T3AuaWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSdW5zIGFuIGFzeW5jIGxvb3AgdW50aWwgYWxsIGluUHJvZ3Jlc3Mgam9icyBhcmUgY29tcGxldGUgb3IgZmFpbGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGFydFVwZGF0ZU9wZXJhdGlvbkxvb3AgPSBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy51cGRhdGVPcGVyYXRpb25Mb29wUnVubmluZyA9IHRydWU7XG5cbiAgICB3aGlsZSAodGhpcy5pblByb2dyZXNzT3BzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMubG9nKFsnZGVidWcnLCAuLi5MT0dfVEFHU10sIGBVcGRhdGluZyAke3RoaXMuaW5Qcm9ncmVzc09wcy5sZW5ndGh9IHJlaW5kZXggb3BlcmF0aW9uc2ApO1xuXG4gICAgICAvLyBQdXNoIGVhY2ggb3BlcmF0aW9uIHRocm91Z2ggdGhlIHN0YXRlIG1hY2hpbmUgYW5kIHJlZnJlc2guXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh0aGlzLmluUHJvZ3Jlc3NPcHMubWFwKHRoaXMucHJvY2Vzc05leHRTdGVwKSk7XG4gICAgICBhd2FpdCB0aGlzLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZU9wZXJhdGlvbkxvb3BSdW5uaW5nID0gZmFsc2U7XG4gIH07XG5cbiAgcHJpdmF0ZSBwb2xsRm9yT3BlcmF0aW9ucyA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLmxvZyhbJ2RlYnVnJywgLi4uTE9HX1RBR1NdLCBgUG9sbGluZyBmb3IgcmVpbmRleCBvcGVyYXRpb25zYCk7XG5cbiAgICBhd2FpdCB0aGlzLnJlZnJlc2goKTtcblxuICAgIGlmICh0aGlzLmNvbnRpbnVlUG9sbGluZykge1xuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLnBvbGxGb3JPcGVyYXRpb25zLCBQT0xMX0lOVEVSVkFMKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSByZWZyZXNoID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmluUHJvZ3Jlc3NPcHMgPSBhd2FpdCB0aGlzLnJlaW5kZXhTZXJ2aWNlLmZpbmRBbGxCeVN0YXR1cyhSZWluZGV4U3RhdHVzLmluUHJvZ3Jlc3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMubG9nKFsnZGVidWcnLCAuLi5MT0dfVEFHU10sIGBDb3VsZCBub3QgZmV0Y2ggcmllbmRleCBvcGVyYXRpb25zIGZyb20gRWxhc3RpY3NlYXJjaGApO1xuICAgICAgdGhpcy5pblByb2dyZXNzT3BzID0gW107XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG9wZXJhdGlvbnMgaW4gcHJvZ3Jlc3MgYW5kIHdlJ3JlIG5vdCBhbHJlYWR5IHVwZGF0aW5nIG9wZXJhdGlvbnMsIGtpY2sgb2ZmIHRoZSB1cGRhdGUgbG9vcFxuICAgIGlmICghdGhpcy51cGRhdGVPcGVyYXRpb25Mb29wUnVubmluZykge1xuICAgICAgdGhpcy5zdGFydFVwZGF0ZU9wZXJhdGlvbkxvb3AoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBwcm9jZXNzTmV4dFN0ZXAgPSBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgICBjb25zdCBjcmVkZW50aWFsID0gdGhpcy5jcmVkZW50aWFsU3RvcmUuZ2V0KHJlaW5kZXhPcCk7XG5cbiAgICBpZiAoIWNyZWRlbnRpYWwpIHtcbiAgICAgIC8vIFNldCB0byBwYXVzZWQgc3RhdGUgaWYgdGhlIGpvYiBoYXNuJ3QgYmVlbiB1cGRhdGVkIGluIFBBVVNFX1dJTkRPVy5cbiAgICAgIC8vIFRoaXMgaW5kaWNhdGVzIHRoYXQgbm8gS2liYW5hIG5vZGVzIGN1cnJlbnRseSBoYXZlIGNyZWRlbnRpYWxzIHRvIHVwZGF0ZSB0aGlzIGpvYi5cbiAgICAgIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICAgICAgY29uc3QgdXBkYXRlZEF0ID0gbW9tZW50KHJlaW5kZXhPcC51cGRhdGVkX2F0KTtcbiAgICAgIGlmICh1cGRhdGVkQXQgPCBub3cuc3VidHJhY3QoUEFVU0VfV0lORE9XKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWluZGV4U2VydmljZS5wYXVzZVJlaW5kZXhPcGVyYXRpb24ocmVpbmRleE9wLmF0dHJpYnV0ZXMuaW5kZXhOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGl0IGhhcyBiZWVuIHVwZGF0ZWQgcmVjZW50bHksIHdlIGFzc3VtZSBhbm90aGVyIG5vZGUgaGFzIHRoZSBuZWNlc3NhcnkgY3JlZGVudGlhbHMsXG4gICAgICAgIC8vIGFuZCB0aGlzIGJlY29tZXMgYSBub29wLlxuICAgICAgICByZXR1cm4gcmVpbmRleE9wO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldHVwIGEgUmVpbmRleFNlcnZpY2Ugc3BlY2lmaWMgdG8gdGhlc2UgY3JlZGVudGlhbHMuXG4gICAgY29uc3QgZmFrZVJlcXVlc3QgPSB7IGhlYWRlcnM6IGNyZWRlbnRpYWwgfSBhcyBSZXF1ZXN0O1xuICAgIGNvbnN0IGNhbGxDbHVzdGVyID0gdGhpcy5jYWxsV2l0aFJlcXVlc3QuYmluZChudWxsLCBmYWtlUmVxdWVzdCkgYXMgQ2FsbENsdXN0ZXI7XG4gICAgY29uc3QgYWN0aW9ucyA9IHJlaW5kZXhBY3Rpb25zRmFjdG9yeSh0aGlzLmNsaWVudCwgY2FsbENsdXN0ZXIpO1xuICAgIGNvbnN0IHNlcnZpY2UgPSByZWluZGV4U2VydmljZUZhY3RvcnkoY2FsbENsdXN0ZXIsIHRoaXMueHBhY2tJbmZvLCBhY3Rpb25zLCB0aGlzLmxvZyk7XG4gICAgcmVpbmRleE9wID0gYXdhaXQgc3dhbGxvd0V4Y2VwdGlvbnMoc2VydmljZS5wcm9jZXNzTmV4dFN0ZXAsIHRoaXMubG9nKShyZWluZGV4T3ApO1xuXG4gICAgLy8gVXBkYXRlIGNyZWRlbnRpYWwgc3RvcmUgd2l0aCBtb3N0IHJlY2VudCBzdGF0ZS5cbiAgICB0aGlzLmNyZWRlbnRpYWxTdG9yZS5zZXQocmVpbmRleE9wLCBjcmVkZW50aWFsKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBTd2FsbG93cyBhbnkgZXhjZXB0aW9ucyB0aGF0IG1heSBvY2N1ciBkdXJpbmcgdGhlIHJlaW5kZXggcHJvY2Vzcy4gVGhpcyBwcmV2ZW50cyBhbnkgZXJyb3JzIGZyb21cbiAqIHN0b3BwaW5nIHRoZSB3b3JrZXIgZnJvbSBjb250aW51aW5nIHRvIHByb2Nlc3MgbW9yZSBqb2JzLlxuICovXG5jb25zdCBzd2FsbG93RXhjZXB0aW9ucyA9IChcbiAgZnVuYzogKHJlaW5kZXhPcDogUmVpbmRleFNhdmVkT2JqZWN0KSA9PiBQcm9taXNlPFJlaW5kZXhTYXZlZE9iamVjdD4sXG4gIGxvZzogU2VydmVyWydsb2cnXVxuKSA9PiBhc3luYyAocmVpbmRleE9wOiBSZWluZGV4U2F2ZWRPYmplY3QpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZnVuYyhyZWluZGV4T3ApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKHJlaW5kZXhPcC5hdHRyaWJ1dGVzLmxvY2tlZCkge1xuICAgICAgbG9nKFsnZGVidWcnLCAuLi5MT0dfVEFHU10sIGBTa2lwcGluZyByZWluZGV4T3Agd2l0aCB1bmV4cGlyZWQgbG9jazogJHtyZWluZGV4T3AuaWR9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZyhcbiAgICAgICAgWyd3YXJuaW5nJywgLi4uTE9HX1RBR1NdLFxuICAgICAgICBgRXJyb3Igd2hlbiB0cnlpbmcgdG8gcHJvY2VzcyByZWluZGV4T3AgKCR7cmVpbmRleE9wLmlkfSk6ICR7ZS50b1N0cmluZygpfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlaW5kZXhPcDtcbiAgfVxufTtcbiJdfQ==