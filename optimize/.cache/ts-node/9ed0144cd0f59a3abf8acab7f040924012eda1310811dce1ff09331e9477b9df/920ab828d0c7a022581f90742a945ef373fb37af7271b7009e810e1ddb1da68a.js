"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Runs tasks in batches, taking costs into account.
 */
class TaskPool {
    /**
     * Creates an instance of TaskPool.
     *
     * @param {Opts} opts
     * @prop {number} maxWorkers - The total number of workers / work slots available
     *    (e.g. maxWorkers is 4, then 2 tasks of cost 2 can run at a time, or 4 tasks of cost 1)
     * @prop {Logger} logger - The task manager logger.
     */
    constructor(opts) {
        this.running = new Set();
        /**
         * Attempts to run the specified list of tasks. Returns true if it was able
         * to start every task in the list, false if there was not enough capacity
         * to run every task.
         *
         * @param {TaskRunner[]} tasks
         * @returns {Promise<boolean>}
         */
        this.run = (tasks) => {
            this.cancelExpiredTasks();
            return this.attemptToRun(tasks);
        };
        this.maxWorkers = opts.maxWorkers;
        this.logger = opts.logger;
    }
    /**
     * Gets how many workers are currently in use.
     */
    get occupiedWorkers() {
        const running = Array.from(this.running); // get array from a Set
        return running.reduce((total, { numWorkers }) => (total += numWorkers), 0);
    }
    /**
     * Gets how many workers are currently available.
     */
    get availableWorkers() {
        return this.maxWorkers - this.occupiedWorkers;
    }
    async attemptToRun(tasks) {
        for (const task of tasks) {
            if (this.availableWorkers < task.numWorkers) {
                return false;
            }
            if (await task.claimOwnership()) {
                this.running.add(task);
                task
                    .run()
                    .catch(err => {
                    this.logger.warning(`Task ${task} failed in attempt to run: ${err.message}`);
                })
                    .then(() => this.running.delete(task));
            }
        }
        return true;
    }
    cancelExpiredTasks() {
        for (const task of this.running) {
            if (task.isExpired) {
                this.cancelTask(task);
            }
        }
    }
    async cancelTask(task) {
        try {
            this.logger.debug(`Cancelling expired task ${task}.`);
            this.running.delete(task);
            await task.cancel();
        }
        catch (err) {
            this.logger.error(`Failed to cancel task ${task}: ${err}`);
        }
    }
}
exports.TaskPool = TaskPool;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfcG9vbC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFlSDs7R0FFRztBQUNILE1BQWEsUUFBUTtJQUtuQjs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxJQUFVO1FBWGQsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFjLENBQUM7UUErQnhDOzs7Ozs7O1dBT0c7UUFDSSxRQUFHLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQztRQTlCQSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksZUFBZTtRQUNqQixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLHVCQUF1QjtRQUNqRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDaEQsQ0FBQztJQWVPLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBbUI7UUFDNUMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDeEIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDM0MsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELElBQUksTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixJQUFJO3FCQUNELEdBQUcsRUFBRTtxQkFDTCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLDhCQUE4QixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDL0UsQ0FBQyxDQUFDO3FCQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzFDO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxrQkFBa0I7UUFDeEIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QjtTQUNGO0lBQ0gsQ0FBQztJQUVPLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBZ0I7UUFDdkMsSUFBSTtZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0NBQ0Y7QUFuRkQsNEJBbUZDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuLypcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIHRoZSBsb2dpYyB0aGF0IGVuc3VyZXMgd2UgZG9uJ3QgcnVuIHRvbyBtYW55XG4gKiB0YXNrcyBhdCBvbmNlIGluIGEgZ2l2ZW4gS2liYW5hIGluc3RhbmNlLlxuICovXG5cbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vbGliL2xvZ2dlcic7XG5pbXBvcnQgeyBUYXNrUnVubmVyIH0gZnJvbSAnLi90YXNrX3J1bm5lcic7XG5cbmludGVyZmFjZSBPcHRzIHtcbiAgbWF4V29ya2VyczogbnVtYmVyO1xuICBsb2dnZXI6IExvZ2dlcjtcbn1cblxuLyoqXG4gKiBSdW5zIHRhc2tzIGluIGJhdGNoZXMsIHRha2luZyBjb3N0cyBpbnRvIGFjY291bnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXNrUG9vbCB7XG4gIHByaXZhdGUgbWF4V29ya2VyczogbnVtYmVyO1xuICBwcml2YXRlIHJ1bm5pbmcgPSBuZXcgU2V0PFRhc2tSdW5uZXI+KCk7XG4gIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgVGFza1Bvb2wuXG4gICAqXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0c1xuICAgKiBAcHJvcCB7bnVtYmVyfSBtYXhXb3JrZXJzIC0gVGhlIHRvdGFsIG51bWJlciBvZiB3b3JrZXJzIC8gd29yayBzbG90cyBhdmFpbGFibGVcbiAgICogICAgKGUuZy4gbWF4V29ya2VycyBpcyA0LCB0aGVuIDIgdGFza3Mgb2YgY29zdCAyIGNhbiBydW4gYXQgYSB0aW1lLCBvciA0IHRhc2tzIG9mIGNvc3QgMSlcbiAgICogQHByb3Age0xvZ2dlcn0gbG9nZ2VyIC0gVGhlIHRhc2sgbWFuYWdlciBsb2dnZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzOiBPcHRzKSB7XG4gICAgdGhpcy5tYXhXb3JrZXJzID0gb3B0cy5tYXhXb3JrZXJzO1xuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBob3cgbWFueSB3b3JrZXJzIGFyZSBjdXJyZW50bHkgaW4gdXNlLlxuICAgKi9cbiAgZ2V0IG9jY3VwaWVkV29ya2VycygpIHtcbiAgICBjb25zdCBydW5uaW5nID0gQXJyYXkuZnJvbSh0aGlzLnJ1bm5pbmcpOyAvLyBnZXQgYXJyYXkgZnJvbSBhIFNldFxuICAgIHJldHVybiBydW5uaW5nLnJlZHVjZSgodG90YWwsIHsgbnVtV29ya2VycyB9KSA9PiAodG90YWwgKz0gbnVtV29ya2VycyksIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgaG93IG1hbnkgd29ya2VycyBhcmUgY3VycmVudGx5IGF2YWlsYWJsZS5cbiAgICovXG4gIGdldCBhdmFpbGFibGVXb3JrZXJzKCkge1xuICAgIHJldHVybiB0aGlzLm1heFdvcmtlcnMgLSB0aGlzLm9jY3VwaWVkV29ya2VycztcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBydW4gdGhlIHNwZWNpZmllZCBsaXN0IG9mIHRhc2tzLiBSZXR1cm5zIHRydWUgaWYgaXQgd2FzIGFibGVcbiAgICogdG8gc3RhcnQgZXZlcnkgdGFzayBpbiB0aGUgbGlzdCwgZmFsc2UgaWYgdGhlcmUgd2FzIG5vdCBlbm91Z2ggY2FwYWNpdHlcbiAgICogdG8gcnVuIGV2ZXJ5IHRhc2suXG4gICAqXG4gICAqIEBwYXJhbSB7VGFza1J1bm5lcltdfSB0YXNrc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cbiAgICovXG4gIHB1YmxpYyBydW4gPSAodGFza3M6IFRhc2tSdW5uZXJbXSkgPT4ge1xuICAgIHRoaXMuY2FuY2VsRXhwaXJlZFRhc2tzKCk7XG4gICAgcmV0dXJuIHRoaXMuYXR0ZW1wdFRvUnVuKHRhc2tzKTtcbiAgfTtcblxuICBwcml2YXRlIGFzeW5jIGF0dGVtcHRUb1J1bih0YXNrczogVGFza1J1bm5lcltdKSB7XG4gICAgZm9yIChjb25zdCB0YXNrIG9mIHRhc2tzKSB7XG4gICAgICBpZiAodGhpcy5hdmFpbGFibGVXb3JrZXJzIDwgdGFzay5udW1Xb3JrZXJzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF3YWl0IHRhc2suY2xhaW1Pd25lcnNoaXAoKSkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcuYWRkKHRhc2spO1xuICAgICAgICB0YXNrXG4gICAgICAgICAgLnJ1bigpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBUYXNrICR7dGFza30gZmFpbGVkIGluIGF0dGVtcHQgdG8gcnVuOiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5ydW5uaW5nLmRlbGV0ZSh0YXNrKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIGNhbmNlbEV4cGlyZWRUYXNrcygpIHtcbiAgICBmb3IgKGNvbnN0IHRhc2sgb2YgdGhpcy5ydW5uaW5nKSB7XG4gICAgICBpZiAodGFzay5pc0V4cGlyZWQpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxUYXNrKHRhc2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FuY2VsVGFzayh0YXNrOiBUYXNrUnVubmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBDYW5jZWxsaW5nIGV4cGlyZWQgdGFzayAke3Rhc2t9LmApO1xuICAgICAgdGhpcy5ydW5uaW5nLmRlbGV0ZSh0YXNrKTtcbiAgICAgIGF3YWl0IHRhc2suY2FuY2VsKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGNhbmNlbCB0YXNrICR7dGFza306ICR7ZXJyfWApO1xuICAgIH1cbiAgfVxufVxuIl19