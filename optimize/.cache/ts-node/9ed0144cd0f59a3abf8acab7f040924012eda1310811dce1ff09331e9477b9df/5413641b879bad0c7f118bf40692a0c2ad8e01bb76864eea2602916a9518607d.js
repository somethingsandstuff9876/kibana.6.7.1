"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fill_pool_1 = require("./lib/fill_pool");
const logger_1 = require("./lib/logger");
const middleware_1 = require("./lib/middleware");
const sanitize_task_definitions_1 = require("./lib/sanitize_task_definitions");
const task_poller_1 = require("./task_poller");
const task_pool_1 = require("./task_pool");
const task_runner_1 = require("./task_runner");
const task_store_1 = require("./task_store");
/*
 * The TaskManager is the public interface into the task manager system. This glues together
 * all of the disparate modules in one integration point. The task manager operates in two different ways:
 *
 * - pre-init, it allows middleware registration, but disallows task manipulation
 * - post-init, it disallows middleware registration, but allows task manipulation
 *
 * Due to its complexity, this is mostly tested by integration tests (see readme).
 */
/**
 * The public interface into the task manager system.
 */
class TaskManager {
    /**
     * Initializes the task manager, preventing any further addition of middleware,
     * enabling the task manipulation methods, and beginning the background polling
     * mechanism.
     */
    constructor(kbnServer, server, config) {
        this.isInitialized = false;
        this.middleware = {
            beforeSave: async (saveOpts) => saveOpts,
            beforeRun: async (runOpts) => runOpts,
        };
        this.maxWorkers = config.get('xpack.task_manager.max_workers');
        this.overrideNumWorkers = config.get('xpack.task_manager.override_num_workers');
        this.definitions = {};
        const logger = new logger_1.TaskManagerLogger((...args) => server.log(...args));
        /* Kibana UUID needs to be pulled live (not cached), as it takes a long time
         * to initialize, and can change after startup */
        const store = new task_store_1.TaskStore({
            callCluster: server.plugins.elasticsearch.getCluster('admin').callWithInternalUser,
            index: config.get('xpack.task_manager.index'),
            maxAttempts: config.get('xpack.task_manager.max_attempts'),
            supportedTypes: Object.keys(this.definitions),
            logger,
            getKibanaUuid: () => config.get('server.uuid'),
        });
        const pool = new task_pool_1.TaskPool({
            logger,
            maxWorkers: this.maxWorkers,
        });
        const createRunner = (instance) => new task_runner_1.TaskManagerRunner({
            logger,
            kbnServer,
            instance,
            store,
            definitions: this.definitions,
            beforeRun: this.middleware.beforeRun,
        });
        const poller = new task_poller_1.TaskPoller({
            logger,
            pollInterval: config.get('xpack.task_manager.poll_interval'),
            store,
            work() {
                return fill_pool_1.fillPool(pool.run, store.fetchAvailableTasks, createRunner);
            },
        });
        this.logger = logger;
        this.store = store;
        this.poller = poller;
        kbnServer.afterPluginsInit(async () => {
            store.addSupportedTypes(Object.keys(this.definitions));
            const startPoller = () => {
                return poller
                    .start()
                    .then(() => {
                    this.isInitialized = true;
                })
                    .catch((err) => {
                    // FIXME: check the type of error to make sure it's actually an ES error
                    logger.warning(`PollError ${err.message}`);
                    // rety again to initialize store and poller, using the timing of
                    // task_manager's configurable poll interval
                    const retryInterval = config.get('xpack.task_manager.poll_interval');
                    setTimeout(() => startPoller(), retryInterval);
                });
            };
            return startPoller();
        });
    }
    /**
     * Method for allowing consumers to register task definitions into the system.
     * @param taskDefinitions - The Kibana task definitions dictionary
     */
    registerTaskDefinitions(taskDefinitions) {
        this.assertUninitialized('register task definitions');
        const duplicate = Object.keys(taskDefinitions).find(k => !!this.definitions[k]);
        if (duplicate) {
            throw new Error(`Task ${duplicate} is already defined!`);
        }
        try {
            const sanitized = sanitize_task_definitions_1.sanitizeTaskDefinitions(taskDefinitions, this.maxWorkers, this.overrideNumWorkers);
            Object.assign(this.definitions, sanitized);
        }
        catch (e) {
            this.logger.error('Could not sanitize task definitions');
        }
    }
    /**
     * Adds middleware to the task manager, such as adding security layers, loggers, etc.
     *
     * @param {Middleware} middleware - The middlware being added.
     */
    addMiddleware(middleware) {
        this.assertUninitialized('add middleware');
        const prevMiddleWare = this.middleware;
        this.middleware = middleware_1.addMiddlewareToChain(prevMiddleWare, middleware);
    }
    /**
     * Schedules a task.
     *
     * @param task - The task being scheduled.
     * @returns {Promise<ConcreteTaskInstance>}
     */
    async schedule(taskInstance, options) {
        this.assertInitialized('Tasks cannot be scheduled until after task manager is initialized!');
        const { taskInstance: modifiedTask } = await this.middleware.beforeSave({
            ...options,
            taskInstance,
        });
        const result = await this.store.schedule(modifiedTask);
        this.poller.attemptWork();
        return result;
    }
    /**
     * Fetches a paginatable list of scheduled tasks.
     *
     * @param opts - The query options used to filter tasks
     * @returns {Promise<FetchResult>}
     */
    async fetch(opts) {
        this.assertInitialized('Tasks cannot be fetched before task manager is initialized!');
        return this.store.fetch(opts);
    }
    /**
     * Removes the specified task from the index.
     *
     * @param {string} id
     * @returns {Promise<RemoveResult>}
     */
    async remove(id) {
        this.assertInitialized('Tasks cannot be removed before task manager is initialized!');
        return this.store.remove(id);
    }
    /**
     * Ensures task manager IS NOT already initialized
     *
     * @param {string} message shown if task manager is already initialized
     * @returns void
     */
    assertUninitialized(message) {
        if (this.isInitialized) {
            throw new Error(`Cannot ${message} after the task manager is initialized!`);
        }
    }
    /**
     * Ensures task manager IS already initialized
     *
     * @param {string} message shown if task manager is not initialized
     * @returns void
     */
    assertInitialized(message) {
        if (!this.isInitialized) {
            throw new Error(`NotInitialized: ${message}`);
        }
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfbWFuYWdlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCwrQ0FBMkM7QUFDM0MseUNBQXlEO0FBQ3pELGlEQUFnRztBQUNoRywrRUFBMEU7QUFHMUUsK0NBQTJDO0FBQzNDLDJDQUF1QztBQUN2QywrQ0FBa0Q7QUFDbEQsNkNBQStFO0FBRS9FOzs7Ozs7OztHQVFHO0FBRUg7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFhdEI7Ozs7T0FJRztJQUNILFlBQW1CLFNBQWMsRUFBRSxNQUFXLEVBQUUsTUFBVztRQWpCbkQsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFPdEIsZUFBVSxHQUFHO1lBQ25CLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBb0MsRUFBRSxFQUFFLENBQUMsUUFBUTtZQUNwRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQW1CLEVBQUUsRUFBRSxDQUFDLE9BQU87U0FDbEQsQ0FBQztRQVFBLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFdEIsTUFBTSxNQUFNLEdBQUcsSUFBSSwwQkFBaUIsQ0FBQyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUU5RTt5REFDaUQ7UUFDakQsTUFBTSxLQUFLLEdBQUcs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LENBQUMsSUFBZTtRQUNoQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUN0RixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVTtRQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUN0RixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNLLG1CQUFtQixDQUFDLE9BQWU7UUFDekMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxPQUFPLHlDQUF5QyxDQUFDLENBQUM7U0FDN0U7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxpQkFBaUIsQ0FBQyxPQUFlO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0NBQ0Y7QUFwTEQsa0NBb0xDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgZmlsbFBvb2wgfSBmcm9tICcuL2xpYi9maWxsX3Bvb2wnO1xuaW1wb3J0IHsgTG9nZ2VyLCBUYXNrTWFuYWdlckxvZ2dlciB9IGZyb20gJy4vbGliL2xvZ2dlcic7XG5pbXBvcnQgeyBhZGRNaWRkbGV3YXJlVG9DaGFpbiwgQmVmb3JlU2F2ZU1pZGRsZXdhcmVQYXJhbXMsIE1pZGRsZXdhcmUgfSBmcm9tICcuL2xpYi9taWRkbGV3YXJlJztcbmltcG9ydCB7IHNhbml0aXplVGFza0RlZmluaXRpb25zIH0gZnJvbSAnLi9saWIvc2FuaXRpemVfdGFza19kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBDb25jcmV0ZVRhc2tJbnN0YW5jZSwgUnVuQ29udGV4dCwgVGFza0luc3RhbmNlIH0gZnJvbSAnLi90YXNrJztcbmltcG9ydCB7IFNhbml0aXplZFRhc2tEZWZpbml0aW9uLCBUYXNrRGVmaW5pdGlvbiwgVGFza0RpY3Rpb25hcnkgfSBmcm9tICcuL3Rhc2snO1xuaW1wb3J0IHsgVGFza1BvbGxlciB9IGZyb20gJy4vdGFza19wb2xsZXInO1xuaW1wb3J0IHsgVGFza1Bvb2wgfSBmcm9tICcuL3Rhc2tfcG9vbCc7XG5pbXBvcnQgeyBUYXNrTWFuYWdlclJ1bm5lciB9IGZyb20gJy4vdGFza19ydW5uZXInO1xuaW1wb3J0IHsgRmV0Y2hPcHRzLCBGZXRjaFJlc3VsdCwgUmVtb3ZlUmVzdWx0LCBUYXNrU3RvcmUgfSBmcm9tICcuL3Rhc2tfc3RvcmUnO1xuXG4vKlxuICogVGhlIFRhc2tNYW5hZ2VyIGlzIHRoZSBwdWJsaWMgaW50ZXJmYWNlIGludG8gdGhlIHRhc2sgbWFuYWdlciBzeXN0ZW0uIFRoaXMgZ2x1ZXMgdG9nZXRoZXJcbiAqIGFsbCBvZiB0aGUgZGlzcGFyYXRlIG1vZHVsZXMgaW4gb25lIGludGVncmF0aW9uIHBvaW50LiBUaGUgdGFzayBtYW5hZ2VyIG9wZXJhdGVzIGluIHR3byBkaWZmZXJlbnQgd2F5czpcbiAqXG4gKiAtIHByZS1pbml0LCBpdCBhbGxvd3MgbWlkZGxld2FyZSByZWdpc3RyYXRpb24sIGJ1dCBkaXNhbGxvd3MgdGFzayBtYW5pcHVsYXRpb25cbiAqIC0gcG9zdC1pbml0LCBpdCBkaXNhbGxvd3MgbWlkZGxld2FyZSByZWdpc3RyYXRpb24sIGJ1dCBhbGxvd3MgdGFzayBtYW5pcHVsYXRpb25cbiAqXG4gKiBEdWUgdG8gaXRzIGNvbXBsZXhpdHksIHRoaXMgaXMgbW9zdGx5IHRlc3RlZCBieSBpbnRlZ3JhdGlvbiB0ZXN0cyAoc2VlIHJlYWRtZSkuXG4gKi9cblxuLyoqXG4gKiBUaGUgcHVibGljIGludGVyZmFjZSBpbnRvIHRoZSB0YXNrIG1hbmFnZXIgc3lzdGVtLlxuICovXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXIge1xuICBwcml2YXRlIGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBtYXhXb3JrZXJzOiBudW1iZXI7XG4gIHByaXZhdGUgb3ZlcnJpZGVOdW1Xb3JrZXJzOiB7IFt0YXNrVHlwZTogc3RyaW5nXTogbnVtYmVyIH07XG4gIHByaXZhdGUgZGVmaW5pdGlvbnM6IFRhc2tEaWN0aW9uYXJ5PFNhbml0aXplZFRhc2tEZWZpbml0aW9uPjtcbiAgcHJpdmF0ZSBzdG9yZTogVGFza1N0b3JlO1xuICBwcml2YXRlIHBvbGxlcjogVGFza1BvbGxlcjtcbiAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcbiAgcHJpdmF0ZSBtaWRkbGV3YXJlID0ge1xuICAgIGJlZm9yZVNhdmU6IGFzeW5jIChzYXZlT3B0czogQmVmb3JlU2F2ZU1pZGRsZXdhcmVQYXJhbXMpID0+IHNhdmVPcHRzLFxuICAgIGJlZm9yZVJ1bjogYXN5bmMgKHJ1bk9wdHM6IFJ1bkNvbnRleHQpID0+IHJ1bk9wdHMsXG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSB0YXNrIG1hbmFnZXIsIHByZXZlbnRpbmcgYW55IGZ1cnRoZXIgYWRkaXRpb24gb2YgbWlkZGxld2FyZSxcbiAgICogZW5hYmxpbmcgdGhlIHRhc2sgbWFuaXB1bGF0aW9uIG1ldGhvZHMsIGFuZCBiZWdpbm5pbmcgdGhlIGJhY2tncm91bmQgcG9sbGluZ1xuICAgKiBtZWNoYW5pc20uXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3Ioa2JuU2VydmVyOiBhbnksIHNlcnZlcjogYW55LCBjb25maWc6IGFueSkge1xuICAgIHRoaXMubWF4V29ya2VycyA9IGNvbmZpZy5nZXQoJ3hwYWNrLnRhc2tfbWFuYWdlci5tYXhfd29ya2VycycpO1xuICAgIHRoaXMub3ZlcnJpZGVOdW1Xb3JrZXJzID0gY29uZmlnLmdldCgneHBhY2sudGFza19tYW5hZ2VyLm92ZXJyaWRlX251bV93b3JrZXJzJyk7XG4gICAgdGhpcy5kZWZpbml0aW9ucyA9IHt9O1xuXG4gICAgY29uc3QgbG9nZ2VyID0gbmV3IFRhc2tNYW5hZ2VyTG9nZ2VyKCguLi5hcmdzOiBhbnlbXSkgPT4gc2VydmVyLmxvZyguLi5hcmdzKSk7XG5cbiAgICAvKiBLaWJhbmEgVVVJRCBuZWVkcyB0byBiZSBwdWxsZWQgbGl2ZSAobm90IGNhY2hlZCksIGFzIGl0IHRha2VzIGEgbG9uZyB0aW1lXG4gICAgICogdG8gaW5pdGlhbGl6ZSwgYW5kIGNhbiBjaGFuZ2UgYWZ0ZXIgc3RhcnR1cCAqL1xuICAgIGNvbnN0IHN0b3JlID0gbmV3IFRhc2tTdG9yZSh7XG4gICAgICBjYWxsQ2x1c3Rlcjogc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKCdhZG1pbicpLmNhbGxXaXRoSW50ZXJuYWxVc2VyLFxuICAgICAgaW5kZXg6IGNvbmZpZy5nZXQoJ3hwYWNrLnRhc2tfbWFuYWdlci5pbmRleCcpLFxuICAgICAgbWF4QXR0ZW1wdHM6IGNvbmZpZy5nZXQoJ3hwYWNrLnRhc2tfbWFuYWdlci5tYXhfYXR0ZW1wdHMnKSxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiBPYmplY3Qua2V5cyh0aGlzLmRlZmluaXRpb25zKSxcbiAgICAgIGxvZ2dlcixcbiAgICAgIGdldEtpYmFuYVV1aWQ6ICgpID0+IGNvbmZpZy5nZXQoJ3NlcnZlci51dWlkJyksXG4gICAgfSk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBUYXNrUG9vbCh7XG4gICAgICBsb2dnZXIsXG4gICAgICBtYXhXb3JrZXJzOiB0aGlzLm1heFdvcmtlcnMsXG4gICAgfSk7XG4gICAgY29uc3QgY3JlYXRlUnVubmVyID0gKGluc3RhbmNlOiBDb25jcmV0ZVRhc2tJbnN0YW5jZSkgPT5cbiAgICAgIG5ldyBUYXNrTWFuYWdlclJ1bm5lcih7XG4gICAgICAgIGxvZ2dlcixcbiAgICAgICAga2JuU2VydmVyLFxuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIGRlZmluaXRpb25zOiB0aGlzLmRlZmluaXRpb25zLFxuICAgICAgICBiZWZvcmVSdW46IHRoaXMubWlkZGxld2FyZS5iZWZvcmVSdW4sXG4gICAgICB9KTtcbiAgICBjb25zdCBwb2xsZXIgPSBuZXcgVGFza1BvbGxlcih7XG4gICAgICBsb2dnZXIsXG4gICAgICBwb2xsSW50ZXJ2YWw6IGNvbmZpZy5nZXQoJ3hwYWNrLnRhc2tfbWFuYWdlci5wb2xsX2ludGVydmFsJyksXG4gICAgICBzdG9yZSxcbiAgICAgIHdvcmsoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBmaWxsUG9vbChwb29sLnJ1biwgc3RvcmUuZmV0Y2hBdmFpbGFibGVUYXNrcywgY3JlYXRlUnVubmVyKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy5wb2xsZXIgPSBwb2xsZXI7XG5cbiAgICBrYm5TZXJ2ZXIuYWZ0ZXJQbHVnaW5zSW5pdChhc3luYyAoKSA9PiB7XG4gICAgICBzdG9yZS5hZGRTdXBwb3J0ZWRUeXBlcyhPYmplY3Qua2V5cyh0aGlzLmRlZmluaXRpb25zKSk7XG4gICAgICBjb25zdCBzdGFydFBvbGxlciA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHBvbGxlclxuICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgLy8gRklYTUU6IGNoZWNrIHRoZSB0eXBlIG9mIGVycm9yIHRvIG1ha2Ugc3VyZSBpdCdzIGFjdHVhbGx5IGFuIEVTIGVycm9yXG4gICAgICAgICAgICBsb2dnZXIud2FybmluZyhgUG9sbEVycm9yICR7ZXJyLm1lc3NhZ2V9YCk7XG5cbiAgICAgICAgICAgIC8vIHJldHkgYWdhaW4gdG8gaW5pdGlhbGl6ZSBzdG9yZSBhbmQgcG9sbGVyLCB1c2luZyB0aGUgdGltaW5nIG9mXG4gICAgICAgICAgICAvLyB0YXNrX21hbmFnZXIncyBjb25maWd1cmFibGUgcG9sbCBpbnRlcnZhbFxuICAgICAgICAgICAgY29uc3QgcmV0cnlJbnRlcnZhbCA9IGNvbmZpZy5nZXQoJ3hwYWNrLnRhc2tfbWFuYWdlci5wb2xsX2ludGVydmFsJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHN0YXJ0UG9sbGVyKCksIHJldHJ5SW50ZXJ2YWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBzdGFydFBvbGxlcigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBmb3IgYWxsb3dpbmcgY29uc3VtZXJzIHRvIHJlZ2lzdGVyIHRhc2sgZGVmaW5pdGlvbnMgaW50byB0aGUgc3lzdGVtLlxuICAgKiBAcGFyYW0gdGFza0RlZmluaXRpb25zIC0gVGhlIEtpYmFuYSB0YXNrIGRlZmluaXRpb25zIGRpY3Rpb25hcnlcbiAgICovXG4gIHB1YmxpYyByZWdpc3RlclRhc2tEZWZpbml0aW9ucyh0YXNrRGVmaW5pdGlvbnM6IFRhc2tEaWN0aW9uYXJ5PFRhc2tEZWZpbml0aW9uPikge1xuICAgIHRoaXMuYXNzZXJ0VW5pbml0aWFsaXplZCgncmVnaXN0ZXIgdGFzayBkZWZpbml0aW9ucycpO1xuICAgIGNvbnN0IGR1cGxpY2F0ZSA9IE9iamVjdC5rZXlzKHRhc2tEZWZpbml0aW9ucykuZmluZChrID0+ICEhdGhpcy5kZWZpbml0aW9uc1trXSk7XG4gICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUYXNrICR7ZHVwbGljYXRlfSBpcyBhbHJlYWR5IGRlZmluZWQhYCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNhbml0aXplZCA9IHNhbml0aXplVGFza0RlZmluaXRpb25zKFxuICAgICAgICB0YXNrRGVmaW5pdGlvbnMsXG4gICAgICAgIHRoaXMubWF4V29ya2VycyxcbiAgICAgICAgdGhpcy5vdmVycmlkZU51bVdvcmtlcnNcbiAgICAgICk7XG5cbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5kZWZpbml0aW9ucywgc2FuaXRpemVkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignQ291bGQgbm90IHNhbml0aXplIHRhc2sgZGVmaW5pdGlvbnMnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBtaWRkbGV3YXJlIHRvIHRoZSB0YXNrIG1hbmFnZXIsIHN1Y2ggYXMgYWRkaW5nIHNlY3VyaXR5IGxheWVycywgbG9nZ2VycywgZXRjLlxuICAgKlxuICAgKiBAcGFyYW0ge01pZGRsZXdhcmV9IG1pZGRsZXdhcmUgLSBUaGUgbWlkZGx3YXJlIGJlaW5nIGFkZGVkLlxuICAgKi9cbiAgcHVibGljIGFkZE1pZGRsZXdhcmUobWlkZGxld2FyZTogTWlkZGxld2FyZSkge1xuICAgIHRoaXMuYXNzZXJ0VW5pbml0aWFsaXplZCgnYWRkIG1pZGRsZXdhcmUnKTtcbiAgICBjb25zdCBwcmV2TWlkZGxlV2FyZSA9IHRoaXMubWlkZGxld2FyZTtcbiAgICB0aGlzLm1pZGRsZXdhcmUgPSBhZGRNaWRkbGV3YXJlVG9DaGFpbihwcmV2TWlkZGxlV2FyZSwgbWlkZGxld2FyZSk7XG4gIH1cblxuICAvKipcbiAgICogU2NoZWR1bGVzIGEgdGFzay5cbiAgICpcbiAgICogQHBhcmFtIHRhc2sgLSBUaGUgdGFzayBiZWluZyBzY2hlZHVsZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENvbmNyZXRlVGFza0luc3RhbmNlPn1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBzY2hlZHVsZSh0YXNrSW5zdGFuY2U6IFRhc2tJbnN0YW5jZSwgb3B0aW9ucz86IGFueSk6IFByb21pc2U8Q29uY3JldGVUYXNrSW5zdGFuY2U+IHtcbiAgICB0aGlzLmFzc2VydEluaXRpYWxpemVkKCdUYXNrcyBjYW5ub3QgYmUgc2NoZWR1bGVkIHVudGlsIGFmdGVyIHRhc2sgbWFuYWdlciBpcyBpbml0aWFsaXplZCEnKTtcbiAgICBjb25zdCB7IHRhc2tJbnN0YW5jZTogbW9kaWZpZWRUYXNrIH0gPSBhd2FpdCB0aGlzLm1pZGRsZXdhcmUuYmVmb3JlU2F2ZSh7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGFza0luc3RhbmNlLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuc3RvcmUuc2NoZWR1bGUobW9kaWZpZWRUYXNrKTtcbiAgICB0aGlzLnBvbGxlci5hdHRlbXB0V29yaygpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyBhIHBhZ2luYXRhYmxlIGxpc3Qgb2Ygc2NoZWR1bGVkIHRhc2tzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyAtIFRoZSBxdWVyeSBvcHRpb25zIHVzZWQgdG8gZmlsdGVyIHRhc2tzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEZldGNoUmVzdWx0Pn1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBmZXRjaChvcHRzOiBGZXRjaE9wdHMpOiBQcm9taXNlPEZldGNoUmVzdWx0PiB7XG4gICAgdGhpcy5hc3NlcnRJbml0aWFsaXplZCgnVGFza3MgY2Fubm90IGJlIGZldGNoZWQgYmVmb3JlIHRhc2sgbWFuYWdlciBpcyBpbml0aWFsaXplZCEnKTtcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5mZXRjaChvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgdGFzayBmcm9tIHRoZSBpbmRleC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJlbW92ZVJlc3VsdD59XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPFJlbW92ZVJlc3VsdD4ge1xuICAgIHRoaXMuYXNzZXJ0SW5pdGlhbGl6ZWQoJ1Rhc2tzIGNhbm5vdCBiZSByZW1vdmVkIGJlZm9yZSB0YXNrIG1hbmFnZXIgaXMgaW5pdGlhbGl6ZWQhJyk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmUucmVtb3ZlKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRhc2sgbWFuYWdlciBJUyBOT1QgYWxyZWFkeSBpbml0aWFsaXplZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBzaG93biBpZiB0YXNrIG1hbmFnZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZFxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICBwcml2YXRlIGFzc2VydFVuaW5pdGlhbGl6ZWQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgJHttZXNzYWdlfSBhZnRlciB0aGUgdGFzayBtYW5hZ2VyIGlzIGluaXRpYWxpemVkIWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRhc2sgbWFuYWdlciBJUyBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIHNob3duIGlmIHRhc2sgbWFuYWdlciBpcyBub3QgaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgcHJpdmF0ZSBhc3NlcnRJbml0aWFsaXplZChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3RJbml0aWFsaXplZDogJHttZXNzYWdlfWApO1xuICAgIH1cbiAgfVxufVxuIl19