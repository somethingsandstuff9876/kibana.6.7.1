"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Performs work on a scheduled interval, logging any errors. This waits for work to complete
 * (or error) prior to attempting another run.
 */
class TaskPoller {
    /**
     * Constructs a new TaskPoller.
     *
     * @param opts
     * @prop {number} pollInterval - How often, in milliseconds, we will run the work function
     * @prop {Logger} logger - The task manager logger
     * @prop {WorkFn} work - An empty, asynchronous function that performs the desired work
     */
    constructor(opts) {
        this.isStarted = false;
        this.isWorking = false;
        this.pollInterval = opts.pollInterval;
        this.logger = opts.logger;
        this.store = opts.store;
        this.work = opts.work;
    }
    /**
     * Starts the poller. If the poller is already running, this has no effect.
     */
    async start() {
        if (this.isStarted) {
            return;
        }
        if (!this.store.isInitialized) {
            await this.store.init();
        }
        this.isStarted = true;
        const poll = async () => {
            await this.attemptWork();
            if (this.isStarted) {
                this.timeout = setTimeout(poll, this.pollInterval);
            }
        };
        poll();
    }
    /**
     * Stops the poller.
     */
    stop() {
        this.isStarted = false;
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
    /**
     * Runs the work function. If the work function is currently running,
     * this has no effect.
     */
    async attemptWork() {
        if (!this.isStarted || this.isWorking) {
            return;
        }
        this.isWorking = true;
        try {
            await this.work();
        }
        catch (err) {
            this.logger.error(`Failed to poll for work: ${err}`);
        }
        finally {
            this.isWorking = false;
        }
    }
}
exports.TaskPoller = TaskPoller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfcG9sbGVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy90YXNrX21hbmFnZXIvdGFza19wb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBa0JIOzs7R0FHRztBQUNILE1BQWEsVUFBVTtJQVNyQjs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxJQUFVO1FBaEJkLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQWdCeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDN0IsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDdEIsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFekIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3BEO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBSSxFQUFFLENBQUM7SUFDVCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxJQUFJO1FBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLFdBQVc7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNyQyxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUV0QixJQUFJO1lBQ0YsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDRCQUE0QixHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ3REO2dCQUFTO1lBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDeEI7SUFDSCxDQUFDO0NBQ0Y7QUE3RUQsZ0NBNkVDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuLypcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIHRoZSBsb2dpYyBmb3IgcG9sbGluZyB0aGUgdGFzayBtYW5hZ2VyIGluZGV4IGZvciBuZXcgd29yay5cbiAqL1xuXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL2xpYi9sb2dnZXInO1xuaW1wb3J0IHsgVGFza1N0b3JlIH0gZnJvbSAnLi90YXNrX3N0b3JlJztcblxudHlwZSBXb3JrRm4gPSAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG5pbnRlcmZhY2UgT3B0cyB7XG4gIHBvbGxJbnRlcnZhbDogbnVtYmVyO1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgc3RvcmU6IFRhc2tTdG9yZTtcbiAgd29yazogV29ya0ZuO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIHdvcmsgb24gYSBzY2hlZHVsZWQgaW50ZXJ2YWwsIGxvZ2dpbmcgYW55IGVycm9ycy4gVGhpcyB3YWl0cyBmb3Igd29yayB0byBjb21wbGV0ZVxuICogKG9yIGVycm9yKSBwcmlvciB0byBhdHRlbXB0aW5nIGFub3RoZXIgcnVuLlxuICovXG5leHBvcnQgY2xhc3MgVGFza1BvbGxlciB7XG4gIHByaXZhdGUgaXNTdGFydGVkID0gZmFsc2U7XG4gIHByaXZhdGUgaXNXb3JraW5nID0gZmFsc2U7XG4gIHByaXZhdGUgdGltZW91dDogYW55O1xuICBwcml2YXRlIHBvbGxJbnRlcnZhbDogbnVtYmVyO1xuICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyO1xuICBwcml2YXRlIHN0b3JlOiBUYXNrU3RvcmU7XG4gIHByaXZhdGUgd29yazogV29ya0ZuO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IFRhc2tQb2xsZXIuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzXG4gICAqIEBwcm9wIHtudW1iZXJ9IHBvbGxJbnRlcnZhbCAtIEhvdyBvZnRlbiwgaW4gbWlsbGlzZWNvbmRzLCB3ZSB3aWxsIHJ1biB0aGUgd29yayBmdW5jdGlvblxuICAgKiBAcHJvcCB7TG9nZ2VyfSBsb2dnZXIgLSBUaGUgdGFzayBtYW5hZ2VyIGxvZ2dlclxuICAgKiBAcHJvcCB7V29ya0ZufSB3b3JrIC0gQW4gZW1wdHksIGFzeW5jaHJvbm91cyBmdW5jdGlvbiB0aGF0IHBlcmZvcm1zIHRoZSBkZXNpcmVkIHdvcmtcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHM6IE9wdHMpIHtcbiAgICB0aGlzLnBvbGxJbnRlcnZhbCA9IG9wdHMucG9sbEludGVydmFsO1xuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXI7XG4gICAgdGhpcy5zdG9yZSA9IG9wdHMuc3RvcmU7XG4gICAgdGhpcy53b3JrID0gb3B0cy53b3JrO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgcG9sbGVyLiBJZiB0aGUgcG9sbGVyIGlzIGFscmVhZHkgcnVubmluZywgdGhpcyBoYXMgbm8gZWZmZWN0LlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLmlzU3RhcnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdG9yZS5pc0luaXRpYWxpemVkKSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLmluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzU3RhcnRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBwb2xsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5hdHRlbXB0V29yaygpO1xuXG4gICAgICBpZiAodGhpcy5pc1N0YXJ0ZWQpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChwb2xsLCB0aGlzLnBvbGxJbnRlcnZhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBvbGwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyB0aGUgcG9sbGVyLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKSB7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB0aGlzLnRpbWVvdXQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUnVucyB0aGUgd29yayBmdW5jdGlvbi4gSWYgdGhlIHdvcmsgZnVuY3Rpb24gaXMgY3VycmVudGx5IHJ1bm5pbmcsXG4gICAqIHRoaXMgaGFzIG5vIGVmZmVjdC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBhdHRlbXB0V29yaygpIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkIHx8IHRoaXMuaXNXb3JraW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pc1dvcmtpbmcgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMud29yaygpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBwb2xsIGZvciB3b3JrOiAke2Vycn1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc1dvcmtpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==