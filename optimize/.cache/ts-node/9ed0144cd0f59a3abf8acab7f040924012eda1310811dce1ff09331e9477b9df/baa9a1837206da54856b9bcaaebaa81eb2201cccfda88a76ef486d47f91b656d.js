"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const __1 = require("..");
const config_1 = require("../config");
const logging_1 = require("../logging");
/**
 * Top-level entry point to kick off the app and start the Kibana server.
 */
class Root {
    constructor(config$, env, onShutdown) {
        this.env = env;
        this.onShutdown = onShutdown;
        this.loggingService = new logging_1.LoggingService();
        this.logger = this.loggingService.asLoggerFactory();
        this.log = this.logger.get('root');
        this.configService = new config_1.ConfigService(config$, env, this.logger);
        this.server = new __1.Server(this.configService, this.logger, this.env);
    }
    async start() {
        this.log.debug('starting root');
        try {
            await this.setupLogging();
            await this.server.start();
        }
        catch (e) {
            await this.shutdown(e);
            throw e;
        }
    }
    async shutdown(reason) {
        this.log.debug('shutting root down');
        if (reason) {
            if (reason.code === 'EADDRINUSE' && Number.isInteger(reason.port)) {
                reason = new Error(`Port ${reason.port} is already in use. Another instance of Kibana may be running!`);
            }
            this.log.fatal(reason);
        }
        await this.server.stop();
        if (this.loggingConfigSubscription !== undefined) {
            this.loggingConfigSubscription.unsubscribe();
            this.loggingConfigSubscription = undefined;
        }
        await this.loggingService.stop();
        if (this.onShutdown !== undefined) {
            this.onShutdown(reason);
        }
    }
    async setupLogging() {
        // Stream that maps config updates to logger updates, including update failures.
        const update$ = this.configService.getConfig$().pipe(
        // always read the logging config when the underlying config object is re-read
        operators_1.switchMap(() => this.configService.atPath('logging', logging_1.LoggingConfig)), operators_1.map(config => this.loggingService.upgrade(config)), 
        // This specifically console.logs because we were not able to configure the logger.
        // tslint:disable-next-line no-console
        operators_1.tap({ error: err => console.error('Configuring logger failed:', err) }), operators_1.publishReplay(1));
        // Subscription and wait for the first update to complete and throw if it fails.
        const connectSubscription = update$.connect();
        await update$.pipe(operators_1.first()).toPromise();
        // Send subsequent update failures to this.shutdown(), stopped via loggingConfigSubscription.
        this.loggingConfigSubscription = update$.subscribe({
            error: err => this.shutdown(err),
        });
        // Add subscription we got from `connect` so that we can dispose both of them
        // at once. We can't inverse this and add consequent updates subscription to
        // the one we got from `connect` because in the error case the latter will be
        // automatically disposed before the error is forwarded to the former one so
        // the shutdown logic won't be called.
        this.loggingConfigSubscription.add(connectSubscription);
    }
}
exports.Root = Root;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL3Jvb3QvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9yb290L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBR0gsOENBQTJFO0FBRTNFLDBCQUE0QjtBQUM1QixzQ0FBdUQ7QUFDdkQsd0NBQWtGO0FBRWxGOztHQUVHO0FBQ0gsTUFBYSxJQUFJO0lBUWYsWUFDRSxPQUEyQixFQUNWLEdBQVEsRUFDUixVQUE4QztRQUQ5QyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ1IsZUFBVSxHQUFWLFVBQVUsQ0FBb0M7UUFFL0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHdCQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksc0JBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksVUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWhDLElBQUk7WUFDRixNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDM0I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsQ0FBQztTQUNUO0lBQ0gsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBWTtRQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRXJDLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFlBQVksSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakUsTUFBTSxHQUFHLElBQUksS0FBSyxDQUNoQixRQUFRLE1BQU0sQ0FBQyxJQUFJLGdFQUFnRSxDQUNwRixDQUFDO2FBQ0g7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QjtRQUVELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV6QixJQUFJLElBQUksQ0FBQyx5QkFBeUIsS0FBSyxTQUFTLEVBQUU7WUFDaEQsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLENBQUM7U0FDNUM7UUFDRCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFakMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVPLEtBQUssQ0FBQyxZQUFZO1FBQ3hCLGdGQUFnRjtRQUNoRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUk7UUFDbEQsOEVBQThFO1FBQzlFLHFCQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLHVCQUFhLENBQUMsQ0FBQyxFQUNwRSxlQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxtRkFBbUY7UUFDbkYsc0NBQXNDO1FBQ3RDLGVBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUN2RSx5QkFBYSxDQUFDLENBQUMsQ0FBQyxDQUNjLENBQUM7UUFFakMsZ0ZBQWdGO1FBQ2hGLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlDLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUV4Qyw2RkFBNkY7UUFDN0YsSUFBSSxDQUFDLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDakQsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7U0FDakMsQ0FBQyxDQUFDO1FBRUgsNkVBQTZFO1FBQzdFLDRFQUE0RTtRQUM1RSw2RUFBNkU7UUFDN0UsNEVBQTRFO1FBQzVFLHNDQUFzQztRQUN0QyxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUQsQ0FBQztDQUNGO0FBdkZELG9CQXVGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlyc3QsIG1hcCwgcHVibGlzaFJlcGxheSwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJy4uJztcbmltcG9ydCB7IENvbmZpZywgQ29uZmlnU2VydmljZSwgRW52IH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IExvZ2dlciwgTG9nZ2VyRmFjdG9yeSwgTG9nZ2luZ0NvbmZpZywgTG9nZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nJztcblxuLyoqXG4gKiBUb3AtbGV2ZWwgZW50cnkgcG9pbnQgdG8ga2ljayBvZmYgdGhlIGFwcCBhbmQgc3RhcnQgdGhlIEtpYmFuYSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBSb290IHtcbiAgcHVibGljIHJlYWRvbmx5IGxvZ2dlcjogTG9nZ2VyRmFjdG9yeTtcbiAgcHJpdmF0ZSByZWFkb25seSBjb25maWdTZXJ2aWNlOiBDb25maWdTZXJ2aWNlO1xuICBwcml2YXRlIHJlYWRvbmx5IGxvZzogTG9nZ2VyO1xuICBwcml2YXRlIHJlYWRvbmx5IHNlcnZlcjogU2VydmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dpbmdTZXJ2aWNlOiBMb2dnaW5nU2VydmljZTtcbiAgcHJpdmF0ZSBsb2dnaW5nQ29uZmlnU3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbmZpZyQ6IE9ic2VydmFibGU8Q29uZmlnPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVudjogRW52LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgb25TaHV0ZG93bj86IChyZWFzb24/OiBFcnJvciB8IHN0cmluZykgPT4gdm9pZFxuICApIHtcbiAgICB0aGlzLmxvZ2dpbmdTZXJ2aWNlID0gbmV3IExvZ2dpbmdTZXJ2aWNlKCk7XG4gICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dpbmdTZXJ2aWNlLmFzTG9nZ2VyRmFjdG9yeSgpO1xuICAgIHRoaXMubG9nID0gdGhpcy5sb2dnZXIuZ2V0KCdyb290Jyk7XG5cbiAgICB0aGlzLmNvbmZpZ1NlcnZpY2UgPSBuZXcgQ29uZmlnU2VydmljZShjb25maWckLCBlbnYsIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnNlcnZlciA9IG5ldyBTZXJ2ZXIodGhpcy5jb25maWdTZXJ2aWNlLCB0aGlzLmxvZ2dlciwgdGhpcy5lbnYpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0YXJ0KCkge1xuICAgIHRoaXMubG9nLmRlYnVnKCdzdGFydGluZyByb290Jyk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5zZXR1cExvZ2dpbmcoKTtcbiAgICAgIGF3YWl0IHRoaXMuc2VydmVyLnN0YXJ0KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXdhaXQgdGhpcy5zaHV0ZG93bihlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIHNodXRkb3duKHJlYXNvbj86IGFueSkge1xuICAgIHRoaXMubG9nLmRlYnVnKCdzaHV0dGluZyByb290IGRvd24nKTtcblxuICAgIGlmIChyZWFzb24pIHtcbiAgICAgIGlmIChyZWFzb24uY29kZSA9PT0gJ0VBRERSSU5VU0UnICYmIE51bWJlci5pc0ludGVnZXIocmVhc29uLnBvcnQpKSB7XG4gICAgICAgIHJlYXNvbiA9IG5ldyBFcnJvcihcbiAgICAgICAgICBgUG9ydCAke3JlYXNvbi5wb3J0fSBpcyBhbHJlYWR5IGluIHVzZS4gQW5vdGhlciBpbnN0YW5jZSBvZiBLaWJhbmEgbWF5IGJlIHJ1bm5pbmchYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZy5mYXRhbChyZWFzb24pO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuc2VydmVyLnN0b3AoKTtcblxuICAgIGlmICh0aGlzLmxvZ2dpbmdDb25maWdTdWJzY3JpcHRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5sb2dnaW5nQ29uZmlnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmxvZ2dpbmdDb25maWdTdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMubG9nZ2luZ1NlcnZpY2Uuc3RvcCgpO1xuXG4gICAgaWYgKHRoaXMub25TaHV0ZG93biAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9uU2h1dGRvd24ocmVhc29uKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldHVwTG9nZ2luZygpIHtcbiAgICAvLyBTdHJlYW0gdGhhdCBtYXBzIGNvbmZpZyB1cGRhdGVzIHRvIGxvZ2dlciB1cGRhdGVzLCBpbmNsdWRpbmcgdXBkYXRlIGZhaWx1cmVzLlxuICAgIGNvbnN0IHVwZGF0ZSQgPSB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnJCgpLnBpcGUoXG4gICAgICAvLyBhbHdheXMgcmVhZCB0aGUgbG9nZ2luZyBjb25maWcgd2hlbiB0aGUgdW5kZXJseWluZyBjb25maWcgb2JqZWN0IGlzIHJlLXJlYWRcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLmNvbmZpZ1NlcnZpY2UuYXRQYXRoKCdsb2dnaW5nJywgTG9nZ2luZ0NvbmZpZykpLFxuICAgICAgbWFwKGNvbmZpZyA9PiB0aGlzLmxvZ2dpbmdTZXJ2aWNlLnVwZ3JhZGUoY29uZmlnKSksXG4gICAgICAvLyBUaGlzIHNwZWNpZmljYWxseSBjb25zb2xlLmxvZ3MgYmVjYXVzZSB3ZSB3ZXJlIG5vdCBhYmxlIHRvIGNvbmZpZ3VyZSB0aGUgbG9nZ2VyLlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIHRhcCh7IGVycm9yOiBlcnIgPT4gY29uc29sZS5lcnJvcignQ29uZmlndXJpbmcgbG9nZ2VyIGZhaWxlZDonLCBlcnIpIH0pLFxuICAgICAgcHVibGlzaFJlcGxheSgxKVxuICAgICkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gICAgLy8gU3Vic2NyaXB0aW9uIGFuZCB3YWl0IGZvciB0aGUgZmlyc3QgdXBkYXRlIHRvIGNvbXBsZXRlIGFuZCB0aHJvdyBpZiBpdCBmYWlscy5cbiAgICBjb25zdCBjb25uZWN0U3Vic2NyaXB0aW9uID0gdXBkYXRlJC5jb25uZWN0KCk7XG4gICAgYXdhaXQgdXBkYXRlJC5waXBlKGZpcnN0KCkpLnRvUHJvbWlzZSgpO1xuXG4gICAgLy8gU2VuZCBzdWJzZXF1ZW50IHVwZGF0ZSBmYWlsdXJlcyB0byB0aGlzLnNodXRkb3duKCksIHN0b3BwZWQgdmlhIGxvZ2dpbmdDb25maWdTdWJzY3JpcHRpb24uXG4gICAgdGhpcy5sb2dnaW5nQ29uZmlnU3Vic2NyaXB0aW9uID0gdXBkYXRlJC5zdWJzY3JpYmUoe1xuICAgICAgZXJyb3I6IGVyciA9PiB0aGlzLnNodXRkb3duKGVyciksXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgc3Vic2NyaXB0aW9uIHdlIGdvdCBmcm9tIGBjb25uZWN0YCBzbyB0aGF0IHdlIGNhbiBkaXNwb3NlIGJvdGggb2YgdGhlbVxuICAgIC8vIGF0IG9uY2UuIFdlIGNhbid0IGludmVyc2UgdGhpcyBhbmQgYWRkIGNvbnNlcXVlbnQgdXBkYXRlcyBzdWJzY3JpcHRpb24gdG9cbiAgICAvLyB0aGUgb25lIHdlIGdvdCBmcm9tIGBjb25uZWN0YCBiZWNhdXNlIGluIHRoZSBlcnJvciBjYXNlIHRoZSBsYXR0ZXIgd2lsbCBiZVxuICAgIC8vIGF1dG9tYXRpY2FsbHkgZGlzcG9zZWQgYmVmb3JlIHRoZSBlcnJvciBpcyBmb3J3YXJkZWQgdG8gdGhlIGZvcm1lciBvbmUgc29cbiAgICAvLyB0aGUgc2h1dGRvd24gbG9naWMgd29uJ3QgYmUgY2FsbGVkLlxuICAgIHRoaXMubG9nZ2luZ0NvbmZpZ1N1YnNjcmlwdGlvbi5hZGQoY29ubmVjdFN1YnNjcmlwdGlvbik7XG4gIH1cbn1cbiJdfQ==