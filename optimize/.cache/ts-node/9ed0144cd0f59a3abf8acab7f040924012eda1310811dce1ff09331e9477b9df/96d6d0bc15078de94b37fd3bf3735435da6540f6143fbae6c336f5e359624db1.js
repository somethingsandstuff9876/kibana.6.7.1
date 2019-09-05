"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * This module contains the core logic for running an individual task.
 * It handles the full lifecycle of a task run, including error handling,
 * rescheduling, middleware application, etc.
 */
const joi_1 = tslib_1.__importDefault(require("joi"));
const intervals_1 = require("./lib/intervals");
const task_1 = require("./task");
/**
 * Runs a background task, ensures that errors are properly handled,
 * allows for cancellation.
 *
 * @export
 * @class TaskManagerRunner
 * @implements {TaskRunner}
 */
class TaskManagerRunner {
    /**
     * Creates an instance of TaskManagerRunner.
     * @param {Opts} opts
     * @prop {Logger} logger - The task manager logger
     * @prop {TaskDefinition} definition - The definition of the task being run
     * @prop {ConcreteTaskInstance} instance - The record describing this particular task instance
     * @prop {Updatable} store - The store used to read / write tasks instance info
     * @prop {kbnServer} kbnServer - An async function that provides the task's run context
     * @prop {BeforeRunFunction} beforeRun - A function that adjusts the run context prior to running the task
     * @memberof TaskManagerRunner
     */
    constructor(opts) {
        this.instance = sanitizeInstance(opts.instance);
        this.definitions = opts.definitions;
        this.logger = opts.logger;
        this.store = opts.store;
        this.kbnServer = opts.kbnServer;
        this.beforeRun = opts.beforeRun;
    }
    /**
     * Gets how many workers are occupied by this task instance.
     * Per Joi validation logic, this will return a number >= 1
     */
    get numWorkers() {
        return this.definition.numWorkers;
    }
    /**
     * Gets the id of this task instance.
     */
    get id() {
        return this.instance.id;
    }
    /**
     * Gets the task type of this task instance.
     */
    get taskType() {
        return this.instance.taskType;
    }
    /**
     * Gets the task defintion from the dictionary.
     */
    get definition() {
        return this.definitions[this.taskType];
    }
    /**
     * Gets whether or not this task has run longer than its expiration setting allows.
     */
    get isExpired() {
        return this.instance.runAt < new Date();
    }
    /**
     * Returns a log-friendly representation of this task.
     */
    toString() {
        return `${this.taskType} "${this.id}"`;
    }
    /**
     * Runs the task, handling the task result, errors, etc, rescheduling if need
     * be. NOTE: the time of applying the middleware's beforeRun is incorporated
     * into the total timeout time the task in configured with. We may decide to
     * start the timer after beforeRun resolves
     *
     * @returns {Promise<RunResult>}
     */
    async run() {
        this.logger.debug(`Running task ${this}`);
        const modifiedContext = await this.beforeRun({
            kbnServer: this.kbnServer,
            taskInstance: this.instance,
        });
        try {
            this.task = this.definition.createTaskRunner(modifiedContext);
            const result = await this.task.run();
            const validatedResult = this.validateResult(result);
            return this.processResult(validatedResult);
        }
        catch (err) {
            this.logger.error(`Task ${this} failed: ${err}`);
            // in error scenario, we can not get the RunResult
            // re-use modifiedContext's state, which is correct as of beforeRun
            return this.processResult({ error: err, state: modifiedContext.taskInstance.state });
        }
    }
    /**
     * Attempts to claim exclusive rights to run the task. If the attempt fails
     * with a 409 (http conflict), we assume another Kibana instance beat us to the punch.
     *
     * @returns {Promise<boolean>}
     */
    async claimOwnership() {
        const VERSION_CONFLICT_STATUS = 409;
        try {
            this.instance = await this.store.update({
                ...this.instance,
                status: 'running',
                runAt: intervals_1.intervalFromNow(this.definition.timeout),
            });
            return true;
        }
        catch (error) {
            if (error.statusCode !== VERSION_CONFLICT_STATUS) {
                throw error;
            }
        }
        return false;
    }
    /**
     * Attempts to cancel the task.
     *
     * @returns {Promise<void>}
     */
    async cancel() {
        const { task } = this;
        if (task && task.cancel) {
            this.task = undefined;
            return task.cancel();
        }
        this.logger.warning(`The task ${this} is not cancellable.`);
    }
    validateResult(result) {
        const { error } = joi_1.default.validate(result, task_1.validateRunResult);
        if (error) {
            this.logger.warning(`Invalid task result for ${this}: ${error.message}`);
        }
        return result || { state: {} };
    }
    async processResultForRecurringTask(result) {
        // recurring task: update the task instance
        const state = result.state || this.instance.state || {};
        const status = this.instance.attempts < this.store.maxAttempts ? 'idle' : 'failed';
        let runAt;
        if (status === 'failed') {
            // task run errored, keep the same runAt
            runAt = this.instance.runAt;
        }
        else {
            runAt =
                result.runAt ||
                    intervals_1.intervalFromNow(this.instance.interval) ||
                    // when result.error is truthy, then we're retrying because it failed
                    intervals_1.minutesFromNow((this.instance.attempts + 1) * 5); // incrementally backs off an extra 5m per failure
        }
        await this.store.update({
            ...this.instance,
            runAt,
            state,
            status,
            attempts: result.error ? this.instance.attempts + 1 : 0,
        });
        return result;
    }
    async processResultWhenDone(result) {
        // not a recurring task: clean up by removing the task instance from store
        try {
            await this.store.remove(this.instance.id);
        }
        catch (err) {
            if (err.statusCode === 404) {
                this.logger.warning(`Task cleanup of ${this} failed in processing. Was remove called twice?`);
            }
            else {
                throw err;
            }
        }
        return result;
    }
    async processResult(result) {
        if (result.runAt || this.instance.interval || result.error) {
            await this.processResultForRecurringTask(result);
        }
        else {
            await this.processResultWhenDone(result);
        }
        return result;
    }
}
exports.TaskManagerRunner = TaskManagerRunner;
function sanitizeInstance(instance) {
    return {
        ...instance,
        params: instance.params || {},
        state: instance.state || {},
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfcnVubmVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy90YXNrX21hbmFnZXIvdGFza19ydW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVIOzs7O0dBSUc7QUFFSCxzREFBc0I7QUFDdEIsK0NBQWtFO0FBR2xFLGlDQVFnQjtBQTJCaEI7Ozs7Ozs7R0FPRztBQUNILE1BQWEsaUJBQWlCO0lBUzVCOzs7Ozs7Ozs7O09BVUc7SUFDSCxZQUFZLElBQVU7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxVQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxFQUFFO1FBQ1gsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFVBQVU7UUFDbkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDYixPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxLQUFLLENBQUMsR0FBRztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUMzQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQzVCLENBQUMsQ0FBQztRQUVILElBQUk7WUFDRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDOUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzVDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRWpELGtEQUFrRDtZQUNsRCxtRUFBbUU7WUFDbkUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3RGO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGNBQWM7UUFDekIsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLENBQUM7UUFFcEMsSUFBSTtZQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsR0FBRyxJQUFJLENBQUMsUUFBUTtnQkFDaEIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLEtBQUssRUFBRSwyQkFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFFO2FBQ2pELENBQUMsQ0FBQztZQUVILE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyx1QkFBdUIsRUFBRTtnQkFDaEQsTUFBTSxLQUFLLENBQUM7YUFDYjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxNQUFNO1FBQ2pCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUN0QixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxzQkFBc0IsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFTyxjQUFjLENBQUMsTUFBeUI7UUFDOUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLGFBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHdCQUFpQixDQUFDLENBQUM7UUFFMUQsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsT0FBTyxNQUFNLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVPLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxNQUFpQjtRQUMzRCwyQ0FBMkM7UUFDM0MsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDeEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRW5GLElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ3ZCLHdDQUF3QztZQUN4QyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDN0I7YUFBTTtZQUNMLEtBQUs7Z0JBQ0gsTUFBTSxDQUFDLEtBQUs7b0JBQ1osMkJBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztvQkFDdkMscUVBQXFFO29CQUNyRSwwQkFBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrREFBa0Q7U0FDdkc7UUFFRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3RCLEdBQUcsSUFBSSxDQUFDLFFBQVE7WUFDaEIsS0FBSztZQUNMLEtBQUs7WUFDTCxNQUFNO1lBQ04sUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RCxDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU8sS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQWlCO1FBQ25ELDBFQUEwRTtRQUMxRSxJQUFJO1lBQ0YsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzNDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFFO2dCQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDakIsbUJBQW1CLElBQUksaURBQWlELENBQ3pFLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsQ0FBQzthQUNYO1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFpQjtRQUMzQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUMxRCxNQUFNLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRDthQUFNO1lBQ0wsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUE3TUQsOENBNk1DO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxRQUE4QjtJQUN0RCxPQUFPO1FBQ0wsR0FBRyxRQUFRO1FBQ1gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLElBQUksRUFBRTtRQUM3QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO0tBQzVCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuLypcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIHRoZSBjb3JlIGxvZ2ljIGZvciBydW5uaW5nIGFuIGluZGl2aWR1YWwgdGFzay5cbiAqIEl0IGhhbmRsZXMgdGhlIGZ1bGwgbGlmZWN5Y2xlIG9mIGEgdGFzayBydW4sIGluY2x1ZGluZyBlcnJvciBoYW5kbGluZyxcbiAqIHJlc2NoZWR1bGluZywgbWlkZGxld2FyZSBhcHBsaWNhdGlvbiwgZXRjLlxuICovXG5cbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IGludGVydmFsRnJvbU5vdywgbWludXRlc0Zyb21Ob3cgfSBmcm9tICcuL2xpYi9pbnRlcnZhbHMnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9saWIvbG9nZ2VyJztcbmltcG9ydCB7IEJlZm9yZVJ1bkZ1bmN0aW9uIH0gZnJvbSAnLi9saWIvbWlkZGxld2FyZSc7XG5pbXBvcnQge1xuICBDYW5jZWxGdW5jdGlvbixcbiAgQ2FuY2VsbGFibGVUYXNrLFxuICBDb25jcmV0ZVRhc2tJbnN0YW5jZSxcbiAgUnVuUmVzdWx0LFxuICBTYW5pdGl6ZWRUYXNrRGVmaW5pdGlvbixcbiAgVGFza0RpY3Rpb25hcnksXG4gIHZhbGlkYXRlUnVuUmVzdWx0LFxufSBmcm9tICcuL3Rhc2snO1xuaW1wb3J0IHsgUmVtb3ZlUmVzdWx0IH0gZnJvbSAnLi90YXNrX3N0b3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBUYXNrUnVubmVyIHtcbiAgbnVtV29ya2VyczogbnVtYmVyO1xuICBpc0V4cGlyZWQ6IGJvb2xlYW47XG4gIGNhbmNlbDogQ2FuY2VsRnVuY3Rpb247XG4gIGNsYWltT3duZXJzaGlwOiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICBydW46ICgpID0+IFByb21pc2U8UnVuUmVzdWx0PjtcbiAgdG9TdHJpbmc/OiAoKSA9PiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBVcGRhdGFibGUge1xuICByZWFkb25seSBtYXhBdHRlbXB0czogbnVtYmVyO1xuICB1cGRhdGUoZG9jOiBDb25jcmV0ZVRhc2tJbnN0YW5jZSk6IFByb21pc2U8Q29uY3JldGVUYXNrSW5zdGFuY2U+O1xuICByZW1vdmUoaWQ6IHN0cmluZyk6IFByb21pc2U8UmVtb3ZlUmVzdWx0Pjtcbn1cblxuaW50ZXJmYWNlIE9wdHMge1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgZGVmaW5pdGlvbnM6IFRhc2tEaWN0aW9uYXJ5PFNhbml0aXplZFRhc2tEZWZpbml0aW9uPjtcbiAgaW5zdGFuY2U6IENvbmNyZXRlVGFza0luc3RhbmNlO1xuICBzdG9yZTogVXBkYXRhYmxlO1xuICBrYm5TZXJ2ZXI6IGFueTtcbiAgYmVmb3JlUnVuOiBCZWZvcmVSdW5GdW5jdGlvbjtcbn1cblxuLyoqXG4gKiBSdW5zIGEgYmFja2dyb3VuZCB0YXNrLCBlbnN1cmVzIHRoYXQgZXJyb3JzIGFyZSBwcm9wZXJseSBoYW5kbGVkLFxuICogYWxsb3dzIGZvciBjYW5jZWxsYXRpb24uXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFRhc2tNYW5hZ2VyUnVubmVyXG4gKiBAaW1wbGVtZW50cyB7VGFza1J1bm5lcn1cbiAqL1xuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2VyUnVubmVyIGltcGxlbWVudHMgVGFza1J1bm5lciB7XG4gIHByaXZhdGUgdGFzaz86IENhbmNlbGxhYmxlVGFzaztcbiAgcHJpdmF0ZSBpbnN0YW5jZTogQ29uY3JldGVUYXNrSW5zdGFuY2U7XG4gIHByaXZhdGUgZGVmaW5pdGlvbnM6IFRhc2tEaWN0aW9uYXJ5PFNhbml0aXplZFRhc2tEZWZpbml0aW9uPjtcbiAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcbiAgcHJpdmF0ZSBzdG9yZTogVXBkYXRhYmxlO1xuICBwcml2YXRlIGtiblNlcnZlcjogYW55O1xuICBwcml2YXRlIGJlZm9yZVJ1bjogQmVmb3JlUnVuRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgVGFza01hbmFnZXJSdW5uZXIuXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0c1xuICAgKiBAcHJvcCB7TG9nZ2VyfSBsb2dnZXIgLSBUaGUgdGFzayBtYW5hZ2VyIGxvZ2dlclxuICAgKiBAcHJvcCB7VGFza0RlZmluaXRpb259IGRlZmluaXRpb24gLSBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgdGFzayBiZWluZyBydW5cbiAgICogQHByb3Age0NvbmNyZXRlVGFza0luc3RhbmNlfSBpbnN0YW5jZSAtIFRoZSByZWNvcmQgZGVzY3JpYmluZyB0aGlzIHBhcnRpY3VsYXIgdGFzayBpbnN0YW5jZVxuICAgKiBAcHJvcCB7VXBkYXRhYmxlfSBzdG9yZSAtIFRoZSBzdG9yZSB1c2VkIHRvIHJlYWQgLyB3cml0ZSB0YXNrcyBpbnN0YW5jZSBpbmZvXG4gICAqIEBwcm9wIHtrYm5TZXJ2ZXJ9IGtiblNlcnZlciAtIEFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgcHJvdmlkZXMgdGhlIHRhc2sncyBydW4gY29udGV4dFxuICAgKiBAcHJvcCB7QmVmb3JlUnVuRnVuY3Rpb259IGJlZm9yZVJ1biAtIEEgZnVuY3Rpb24gdGhhdCBhZGp1c3RzIHRoZSBydW4gY29udGV4dCBwcmlvciB0byBydW5uaW5nIHRoZSB0YXNrXG4gICAqIEBtZW1iZXJvZiBUYXNrTWFuYWdlclJ1bm5lclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0czogT3B0cykge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBzYW5pdGl6ZUluc3RhbmNlKG9wdHMuaW5zdGFuY2UpO1xuICAgIHRoaXMuZGVmaW5pdGlvbnMgPSBvcHRzLmRlZmluaXRpb25zO1xuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXI7XG4gICAgdGhpcy5zdG9yZSA9IG9wdHMuc3RvcmU7XG4gICAgdGhpcy5rYm5TZXJ2ZXIgPSBvcHRzLmtiblNlcnZlcjtcbiAgICB0aGlzLmJlZm9yZVJ1biA9IG9wdHMuYmVmb3JlUnVuO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgaG93IG1hbnkgd29ya2VycyBhcmUgb2NjdXBpZWQgYnkgdGhpcyB0YXNrIGluc3RhbmNlLlxuICAgKiBQZXIgSm9pIHZhbGlkYXRpb24gbG9naWMsIHRoaXMgd2lsbCByZXR1cm4gYSBudW1iZXIgPj0gMVxuICAgKi9cbiAgcHVibGljIGdldCBudW1Xb3JrZXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmluaXRpb24ubnVtV29ya2VycztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpZCBvZiB0aGlzIHRhc2sgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRhc2sgdHlwZSBvZiB0aGlzIHRhc2sgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRhc2tUeXBlKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnRhc2tUeXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRhc2sgZGVmaW50aW9uIGZyb20gdGhlIGRpY3Rpb25hcnkuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGRlZmluaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbnNbdGhpcy50YXNrVHlwZV07XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB3aGV0aGVyIG9yIG5vdCB0aGlzIHRhc2sgaGFzIHJ1biBsb25nZXIgdGhhbiBpdHMgZXhwaXJhdGlvbiBzZXR0aW5nIGFsbG93cy5cbiAgICovXG4gIHB1YmxpYyBnZXQgaXNFeHBpcmVkKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJ1bkF0IDwgbmV3IERhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbG9nLWZyaWVuZGx5IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdGFzay5cbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50YXNrVHlwZX0gXCIke3RoaXMuaWR9XCJgO1xuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgdGhlIHRhc2ssIGhhbmRsaW5nIHRoZSB0YXNrIHJlc3VsdCwgZXJyb3JzLCBldGMsIHJlc2NoZWR1bGluZyBpZiBuZWVkXG4gICAqIGJlLiBOT1RFOiB0aGUgdGltZSBvZiBhcHBseWluZyB0aGUgbWlkZGxld2FyZSdzIGJlZm9yZVJ1biBpcyBpbmNvcnBvcmF0ZWRcbiAgICogaW50byB0aGUgdG90YWwgdGltZW91dCB0aW1lIHRoZSB0YXNrIGluIGNvbmZpZ3VyZWQgd2l0aC4gV2UgbWF5IGRlY2lkZSB0b1xuICAgKiBzdGFydCB0aGUgdGltZXIgYWZ0ZXIgYmVmb3JlUnVuIHJlc29sdmVzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJ1blJlc3VsdD59XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcnVuKCk6IFByb21pc2U8UnVuUmVzdWx0PiB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoYFJ1bm5pbmcgdGFzayAke3RoaXN9YCk7XG4gICAgY29uc3QgbW9kaWZpZWRDb250ZXh0ID0gYXdhaXQgdGhpcy5iZWZvcmVSdW4oe1xuICAgICAga2JuU2VydmVyOiB0aGlzLmtiblNlcnZlcixcbiAgICAgIHRhc2tJbnN0YW5jZTogdGhpcy5pbnN0YW5jZSxcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnRhc2sgPSB0aGlzLmRlZmluaXRpb24uY3JlYXRlVGFza1J1bm5lcihtb2RpZmllZENvbnRleHQpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy50YXNrLnJ1bigpO1xuICAgICAgY29uc3QgdmFsaWRhdGVkUmVzdWx0ID0gdGhpcy52YWxpZGF0ZVJlc3VsdChyZXN1bHQpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Jlc3VsdCh2YWxpZGF0ZWRSZXN1bHQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYFRhc2sgJHt0aGlzfSBmYWlsZWQ6ICR7ZXJyfWApO1xuXG4gICAgICAvLyBpbiBlcnJvciBzY2VuYXJpbywgd2UgY2FuIG5vdCBnZXQgdGhlIFJ1blJlc3VsdFxuICAgICAgLy8gcmUtdXNlIG1vZGlmaWVkQ29udGV4dCdzIHN0YXRlLCB3aGljaCBpcyBjb3JyZWN0IGFzIG9mIGJlZm9yZVJ1blxuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Jlc3VsdCh7IGVycm9yOiBlcnIsIHN0YXRlOiBtb2RpZmllZENvbnRleHQudGFza0luc3RhbmNlLnN0YXRlIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBjbGFpbSBleGNsdXNpdmUgcmlnaHRzIHRvIHJ1biB0aGUgdGFzay4gSWYgdGhlIGF0dGVtcHQgZmFpbHNcbiAgICogd2l0aCBhIDQwOSAoaHR0cCBjb25mbGljdCksIHdlIGFzc3VtZSBhbm90aGVyIEtpYmFuYSBpbnN0YW5jZSBiZWF0IHVzIHRvIHRoZSBwdW5jaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY2xhaW1Pd25lcnNoaXAoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgVkVSU0lPTl9DT05GTElDVF9TVEFUVVMgPSA0MDk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IGF3YWl0IHRoaXMuc3RvcmUudXBkYXRlKHtcbiAgICAgICAgLi4udGhpcy5pbnN0YW5jZSxcbiAgICAgICAgc3RhdHVzOiAncnVubmluZycsXG4gICAgICAgIHJ1bkF0OiBpbnRlcnZhbEZyb21Ob3codGhpcy5kZWZpbml0aW9uLnRpbWVvdXQpISxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yLnN0YXR1c0NvZGUgIT09IFZFUlNJT05fQ09ORkxJQ1RfU1RBVFVTKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBjYW5jZWwgdGhlIHRhc2suXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNhbmNlbCgpIHtcbiAgICBjb25zdCB7IHRhc2sgfSA9IHRoaXM7XG4gICAgaWYgKHRhc2sgJiYgdGFzay5jYW5jZWwpIHtcbiAgICAgIHRoaXMudGFzayA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiB0YXNrLmNhbmNlbCgpO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLndhcm5pbmcoYFRoZSB0YXNrICR7dGhpc30gaXMgbm90IGNhbmNlbGxhYmxlLmApO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVJlc3VsdChyZXN1bHQ/OiBSdW5SZXN1bHQgfCB2b2lkKTogUnVuUmVzdWx0IHtcbiAgICBjb25zdCB7IGVycm9yIH0gPSBKb2kudmFsaWRhdGUocmVzdWx0LCB2YWxpZGF0ZVJ1blJlc3VsdCk7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm5pbmcoYEludmFsaWQgdGFzayByZXN1bHQgZm9yICR7dGhpc306ICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0IHx8IHsgc3RhdGU6IHt9IH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NSZXN1bHRGb3JSZWN1cnJpbmdUYXNrKHJlc3VsdDogUnVuUmVzdWx0KTogUHJvbWlzZTxSdW5SZXN1bHQ+IHtcbiAgICAvLyByZWN1cnJpbmcgdGFzazogdXBkYXRlIHRoZSB0YXNrIGluc3RhbmNlXG4gICAgY29uc3Qgc3RhdGUgPSByZXN1bHQuc3RhdGUgfHwgdGhpcy5pbnN0YW5jZS5zdGF0ZSB8fCB7fTtcbiAgICBjb25zdCBzdGF0dXMgPSB0aGlzLmluc3RhbmNlLmF0dGVtcHRzIDwgdGhpcy5zdG9yZS5tYXhBdHRlbXB0cyA/ICdpZGxlJyA6ICdmYWlsZWQnO1xuXG4gICAgbGV0IHJ1bkF0O1xuICAgIGlmIChzdGF0dXMgPT09ICdmYWlsZWQnKSB7XG4gICAgICAvLyB0YXNrIHJ1biBlcnJvcmVkLCBrZWVwIHRoZSBzYW1lIHJ1bkF0XG4gICAgICBydW5BdCA9IHRoaXMuaW5zdGFuY2UucnVuQXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ1bkF0ID1cbiAgICAgICAgcmVzdWx0LnJ1bkF0IHx8XG4gICAgICAgIGludGVydmFsRnJvbU5vdyh0aGlzLmluc3RhbmNlLmludGVydmFsKSB8fFxuICAgICAgICAvLyB3aGVuIHJlc3VsdC5lcnJvciBpcyB0cnV0aHksIHRoZW4gd2UncmUgcmV0cnlpbmcgYmVjYXVzZSBpdCBmYWlsZWRcbiAgICAgICAgbWludXRlc0Zyb21Ob3coKHRoaXMuaW5zdGFuY2UuYXR0ZW1wdHMgKyAxKSAqIDUpOyAvLyBpbmNyZW1lbnRhbGx5IGJhY2tzIG9mZiBhbiBleHRyYSA1bSBwZXIgZmFpbHVyZVxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuc3RvcmUudXBkYXRlKHtcbiAgICAgIC4uLnRoaXMuaW5zdGFuY2UsXG4gICAgICBydW5BdCxcbiAgICAgIHN0YXRlLFxuICAgICAgc3RhdHVzLFxuICAgICAgYXR0ZW1wdHM6IHJlc3VsdC5lcnJvciA/IHRoaXMuaW5zdGFuY2UuYXR0ZW1wdHMgKyAxIDogMCxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NSZXN1bHRXaGVuRG9uZShyZXN1bHQ6IFJ1blJlc3VsdCk6IFByb21pc2U8UnVuUmVzdWx0PiB7XG4gICAgLy8gbm90IGEgcmVjdXJyaW5nIHRhc2s6IGNsZWFuIHVwIGJ5IHJlbW92aW5nIHRoZSB0YXNrIGluc3RhbmNlIGZyb20gc3RvcmVcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5yZW1vdmUodGhpcy5pbnN0YW5jZS5pZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLnN0YXR1c0NvZGUgPT09IDQwNCkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKFxuICAgICAgICAgIGBUYXNrIGNsZWFudXAgb2YgJHt0aGlzfSBmYWlsZWQgaW4gcHJvY2Vzc2luZy4gV2FzIHJlbW92ZSBjYWxsZWQgdHdpY2U/YFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NSZXN1bHQocmVzdWx0OiBSdW5SZXN1bHQpOiBQcm9taXNlPFJ1blJlc3VsdD4ge1xuICAgIGlmIChyZXN1bHQucnVuQXQgfHwgdGhpcy5pbnN0YW5jZS5pbnRlcnZhbCB8fCByZXN1bHQuZXJyb3IpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvY2Vzc1Jlc3VsdEZvclJlY3VycmluZ1Rhc2socmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzUmVzdWx0V2hlbkRvbmUocmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzYW5pdGl6ZUluc3RhbmNlKGluc3RhbmNlOiBDb25jcmV0ZVRhc2tJbnN0YW5jZSk6IENvbmNyZXRlVGFza0luc3RhbmNlIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5pbnN0YW5jZSxcbiAgICBwYXJhbXM6IGluc3RhbmNlLnBhcmFtcyB8fCB7fSxcbiAgICBzdGF0ZTogaW5zdGFuY2Uuc3RhdGUgfHwge30sXG4gIH07XG59XG4iXX0=