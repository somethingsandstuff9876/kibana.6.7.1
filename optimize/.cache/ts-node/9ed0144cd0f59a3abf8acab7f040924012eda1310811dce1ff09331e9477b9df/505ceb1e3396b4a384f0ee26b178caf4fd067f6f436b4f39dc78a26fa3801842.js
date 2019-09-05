"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const appenders_1 = require("./appenders/appenders");
const buffer_appender_1 = require("./appenders/buffer/buffer_appender");
const log_level_1 = require("./log_level");
const logger_1 = require("./logger");
const logger_adapter_1 = require("./logger_adapter");
const logging_config_1 = require("./logging_config");
/**
 * Service that is responsible for maintaining loggers and logger appenders.
 * @internal
 */
class LoggingService {
    constructor() {
        this.appenders = new Map();
        this.bufferAppender = new buffer_appender_1.BufferAppender();
        this.loggers = new Map();
    }
    get(...contextParts) {
        const context = logging_config_1.LoggingConfig.getLoggerContext(contextParts);
        if (this.loggers.has(context)) {
            return this.loggers.get(context);
        }
        this.loggers.set(context, new logger_adapter_1.LoggerAdapter(this.createLogger(context, this.config)));
        return this.loggers.get(context);
    }
    /**
     * Safe wrapper that allows passing logging service as immutable LoggerFactory.
     */
    asLoggerFactory() {
        return { get: (...contextParts) => this.get(...contextParts) };
    }
    /**
     * Updates all current active loggers with the new config values.
     * @param config New config instance.
     */
    upgrade(config) {
        // Config update is asynchronous and may require some time to complete, so we should invalidate
        // config so that new loggers will be using BufferAppender until newly configured appenders are ready.
        this.config = undefined;
        // Appenders must be reset, so we first dispose of the current ones, then
        // build up a new set of appenders.
        for (const appender of this.appenders.values()) {
            appender.dispose();
        }
        this.appenders.clear();
        for (const [appenderKey, appenderConfig] of config.appenders) {
            this.appenders.set(appenderKey, appenders_1.Appenders.create(appenderConfig));
        }
        for (const [loggerKey, loggerAdapter] of this.loggers) {
            loggerAdapter.updateLogger(this.createLogger(loggerKey, config));
        }
        this.config = config;
        // Re-log all buffered log records with newly configured appenders.
        for (const logRecord of this.bufferAppender.flush()) {
            this.get(logRecord.context).log(logRecord);
        }
    }
    /**
     * Disposes all loggers (closes log files, clears buffers etc.). Service is not usable after
     * calling of this method until new config is provided via `upgrade` method.
     * @returns Promise that is resolved once all loggers are successfully disposed.
     */
    async stop() {
        for (const appender of this.appenders.values()) {
            await appender.dispose();
        }
        await this.bufferAppender.dispose();
        this.appenders.clear();
        this.loggers.clear();
    }
    createLogger(context, config) {
        if (config === undefined) {
            // If we don't have config yet, use `buffered` appender that will store all logged messages in the memory
            // until the config is ready.
            return new logger_1.BaseLogger(context, log_level_1.LogLevel.All, [this.bufferAppender]);
        }
        const { level, appenders } = this.getLoggerConfigByContext(config, context);
        const loggerLevel = log_level_1.LogLevel.fromId(level);
        const loggerAppenders = appenders.map(appenderKey => this.appenders.get(appenderKey));
        return new logger_1.BaseLogger(context, loggerLevel, loggerAppenders);
    }
    getLoggerConfigByContext(config, context) {
        const loggerConfig = config.loggers.get(context);
        if (loggerConfig !== undefined) {
            return loggerConfig;
        }
        // If we don't have configuration for the specified context and it's the "nested" one (eg. `foo.bar.baz`),
        // let's move up to the parent context (eg. `foo.bar`) and check if it has config we can rely on. Otherwise
        // we fallback to the `root` context that should always be defined (enforced by configuration schema).
        return this.getLoggerConfigByContext(config, logging_config_1.LoggingConfig.getParentLoggerContext(context));
    }
}
exports.LoggingService = LoggingService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbG9nZ2luZ19zZXJ2aWNlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS9zZXJ2ZXIvbG9nZ2luZy9sb2dnaW5nX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxxREFBc0U7QUFDdEUsd0VBQW9FO0FBQ3BFLDJDQUF1QztBQUN2QyxxQ0FBOEM7QUFDOUMscURBQWlEO0FBRWpELHFEQUFtRTtBQUVuRTs7O0dBR0c7QUFDSCxNQUFhLGNBQWM7SUFBM0I7UUFFbUIsY0FBUyxHQUFvQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELG1CQUFjLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFDdEMsWUFBTyxHQUErQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBNkZuRSxDQUFDO0lBM0ZRLEdBQUcsQ0FBQyxHQUFHLFlBQXNCO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLDhCQUFhLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBRSxDQUFDO1NBQ25DO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksOEJBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksZUFBZTtR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QixPQUFPLFlBQVksQ0FBQztTQUNyQjtRQUVELDBHQUEwRztRQUMxRywyR0FBMkc7UUFDM0csc0dBQXNHO1FBQ3RHLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSw4QkFBYSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztDQUNGO0FBakdELHdDQWlHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgQXBwZW5kZXJzLCBEaXNwb3NhYmxlQXBwZW5kZXIgfSBmcm9tICcuL2FwcGVuZGVycy9hcHBlbmRlcnMnO1xuaW1wb3J0IHsgQnVmZmVyQXBwZW5kZXIgfSBmcm9tICcuL2FwcGVuZGVycy9idWZmZXIvYnVmZmVyX2FwcGVuZGVyJztcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSAnLi9sb2dfbGV2ZWwnO1xuaW1wb3J0IHsgQmFzZUxvZ2dlciwgTG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgTG9nZ2VyQWRhcHRlciB9IGZyb20gJy4vbG9nZ2VyX2FkYXB0ZXInO1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2VyX2ZhY3RvcnknO1xuaW1wb3J0IHsgTG9nZ2VyQ29uZmlnVHlwZSwgTG9nZ2luZ0NvbmZpZyB9IGZyb20gJy4vbG9nZ2luZ19jb25maWcnO1xuXG4vKipcbiAqIFNlcnZpY2UgdGhhdCBpcyByZXNwb25zaWJsZSBmb3IgbWFpbnRhaW5pbmcgbG9nZ2VycyBhbmQgbG9nZ2VyIGFwcGVuZGVycy5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgTG9nZ2luZ1NlcnZpY2UgaW1wbGVtZW50cyBMb2dnZXJGYWN0b3J5IHtcbiAgcHJpdmF0ZSBjb25maWc/OiBMb2dnaW5nQ29uZmlnO1xuICBwcml2YXRlIHJlYWRvbmx5IGFwcGVuZGVyczogTWFwPHN0cmluZywgRGlzcG9zYWJsZUFwcGVuZGVyPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSByZWFkb25seSBidWZmZXJBcHBlbmRlciA9IG5ldyBCdWZmZXJBcHBlbmRlcigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dlcnM6IE1hcDxzdHJpbmcsIExvZ2dlckFkYXB0ZXI+ID0gbmV3IE1hcCgpO1xuXG4gIHB1YmxpYyBnZXQoLi4uY29udGV4dFBhcnRzOiBzdHJpbmdbXSk6IExvZ2dlciB7XG4gICAgY29uc3QgY29udGV4dCA9IExvZ2dpbmdDb25maWcuZ2V0TG9nZ2VyQ29udGV4dChjb250ZXh0UGFydHMpO1xuICAgIGlmICh0aGlzLmxvZ2dlcnMuaGFzKGNvbnRleHQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2dnZXJzLmdldChjb250ZXh0KSE7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXJzLnNldChjb250ZXh0LCBuZXcgTG9nZ2VyQWRhcHRlcih0aGlzLmNyZWF0ZUxvZ2dlcihjb250ZXh0LCB0aGlzLmNvbmZpZykpKTtcblxuICAgIHJldHVybiB0aGlzLmxvZ2dlcnMuZ2V0KGNvbnRleHQpITtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYWZlIHdyYXBwZXIgdGhhdCBhbGxvd3MgcGFzc2luZyBsb2dnaW5nIHNlcnZpY2UgYXMgaW1tdXRhYmxlIExvZ2dlckZhY3RvcnkuXG4gICAqL1xuICBwdWJsaWMgYXNMb2dnZXJGYWN0b3J5KCk6IExvZ2dlckZhY3Rvcnkge1xuICAgIHJldHVybiB7IGdldDogKC4uLmNvbnRleHRQYXJ0czogc3RyaW5nW10pID0+IHRoaXMuZ2V0KC4uLmNvbnRleHRQYXJ0cykgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBjdXJyZW50IGFjdGl2ZSBsb2dnZXJzIHdpdGggdGhlIG5ldyBjb25maWcgdmFsdWVzLlxuICAgKiBAcGFyYW0gY29uZmlnIE5ldyBjb25maWcgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgdXBncmFkZShjb25maWc6IExvZ2dpbmdDb25maWcpIHtcbiAgICAvLyBDb25maWcgdXBkYXRlIGlzIGFzeW5jaHJvbm91cyBhbmQgbWF5IHJlcXVpcmUgc29tZSB0aW1lIHRvIGNvbXBsZXRlLCBzbyB3ZSBzaG91bGQgaW52YWxpZGF0ZVxuICAgIC8vIGNvbmZpZyBzbyB0aGF0IG5ldyBsb2dnZXJzIHdpbGwgYmUgdXNpbmcgQnVmZmVyQXBwZW5kZXIgdW50aWwgbmV3bHkgY29uZmlndXJlZCBhcHBlbmRlcnMgYXJlIHJlYWR5LlxuICAgIHRoaXMuY29uZmlnID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gQXBwZW5kZXJzIG11c3QgYmUgcmVzZXQsIHNvIHdlIGZpcnN0IGRpc3Bvc2Ugb2YgdGhlIGN1cnJlbnQgb25lcywgdGhlblxuICAgIC8vIGJ1aWxkIHVwIGEgbmV3IHNldCBvZiBhcHBlbmRlcnMuXG4gICAgZm9yIChjb25zdCBhcHBlbmRlciBvZiB0aGlzLmFwcGVuZGVycy52YWx1ZXMoKSkge1xuICAgICAgYXBwZW5kZXIuZGlzcG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLmFwcGVuZGVycy5jbGVhcigpO1xuXG4gICAgZm9yIChjb25zdCBbYXBwZW5kZXJLZXksIGFwcGVuZGVyQ29uZmlnXSBvZiBjb25maWcuYXBwZW5kZXJzKSB7XG4gICAgICB0aGlzLmFwcGVuZGVycy5zZXQoYXBwZW5kZXJLZXksIEFwcGVuZGVycy5jcmVhdGUoYXBwZW5kZXJDb25maWcpKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtsb2dnZXJLZXksIGxvZ2dlckFkYXB0ZXJdIG9mIHRoaXMubG9nZ2Vycykge1xuICAgICAgbG9nZ2VyQWRhcHRlci51cGRhdGVMb2dnZXIodGhpcy5jcmVhdGVMb2dnZXIobG9nZ2VyS2V5LCBjb25maWcpKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIC8vIFJlLWxvZyBhbGwgYnVmZmVyZWQgbG9nIHJlY29yZHMgd2l0aCBuZXdseSBjb25maWd1cmVkIGFwcGVuZGVycy5cbiAgICBmb3IgKGNvbnN0IGxvZ1JlY29yZCBvZiB0aGlzLmJ1ZmZlckFwcGVuZGVyLmZsdXNoKCkpIHtcbiAgICAgIHRoaXMuZ2V0KGxvZ1JlY29yZC5jb250ZXh0KS5sb2cobG9nUmVjb3JkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgYWxsIGxvZ2dlcnMgKGNsb3NlcyBsb2cgZmlsZXMsIGNsZWFycyBidWZmZXJzIGV0Yy4pLiBTZXJ2aWNlIGlzIG5vdCB1c2FibGUgYWZ0ZXJcbiAgICogY2FsbGluZyBvZiB0aGlzIG1ldGhvZCB1bnRpbCBuZXcgY29uZmlnIGlzIHByb3ZpZGVkIHZpYSBgdXBncmFkZWAgbWV0aG9kLlxuICAgKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgb25jZSBhbGwgbG9nZ2VycyBhcmUgc3VjY2Vzc2Z1bGx5IGRpc3Bvc2VkLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHN0b3AoKSB7XG4gICAgZm9yIChjb25zdCBhcHBlbmRlciBvZiB0aGlzLmFwcGVuZGVycy52YWx1ZXMoKSkge1xuICAgICAgYXdhaXQgYXBwZW5kZXIuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuYnVmZmVyQXBwZW5kZXIuZGlzcG9zZSgpO1xuXG4gICAgdGhpcy5hcHBlbmRlcnMuY2xlYXIoKTtcbiAgICB0aGlzLmxvZ2dlcnMuY2xlYXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTG9nZ2VyKGNvbnRleHQ6IHN0cmluZywgY29uZmlnOiBMb2dnaW5nQ29uZmlnIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKGNvbmZpZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGNvbmZpZyB5ZXQsIHVzZSBgYnVmZmVyZWRgIGFwcGVuZGVyIHRoYXQgd2lsbCBzdG9yZSBhbGwgbG9nZ2VkIG1lc3NhZ2VzIGluIHRoZSBtZW1vcnlcbiAgICAgIC8vIHVudGlsIHRoZSBjb25maWcgaXMgcmVhZHkuXG4gICAgICByZXR1cm4gbmV3IEJhc2VMb2dnZXIoY29udGV4dCwgTG9nTGV2ZWwuQWxsLCBbdGhpcy5idWZmZXJBcHBlbmRlcl0pO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbGV2ZWwsIGFwcGVuZGVycyB9ID0gdGhpcy5nZXRMb2dnZXJDb25maWdCeUNvbnRleHQoY29uZmlnLCBjb250ZXh0KTtcbiAgICBjb25zdCBsb2dnZXJMZXZlbCA9IExvZ0xldmVsLmZyb21JZChsZXZlbCk7XG4gICAgY29uc3QgbG9nZ2VyQXBwZW5kZXJzID0gYXBwZW5kZXJzLm1hcChhcHBlbmRlcktleSA9PiB0aGlzLmFwcGVuZGVycy5nZXQoYXBwZW5kZXJLZXkpISk7XG5cbiAgICByZXR1cm4gbmV3IEJhc2VMb2dnZXIoY29udGV4dCwgbG9nZ2VyTGV2ZWwsIGxvZ2dlckFwcGVuZGVycyk7XG4gIH1cblxuICBwcml2YXRlIGdldExvZ2dlckNvbmZpZ0J5Q29udGV4dChjb25maWc6IExvZ2dpbmdDb25maWcsIGNvbnRleHQ6IHN0cmluZyk6IExvZ2dlckNvbmZpZ1R5cGUge1xuICAgIGNvbnN0IGxvZ2dlckNvbmZpZyA9IGNvbmZpZy5sb2dnZXJzLmdldChjb250ZXh0KTtcbiAgICBpZiAobG9nZ2VyQ29uZmlnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBsb2dnZXJDb25maWc7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBjb25maWd1cmF0aW9uIGZvciB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIGl0J3MgdGhlIFwibmVzdGVkXCIgb25lIChlZy4gYGZvby5iYXIuYmF6YCksXG4gICAgLy8gbGV0J3MgbW92ZSB1cCB0byB0aGUgcGFyZW50IGNvbnRleHQgKGVnLiBgZm9vLmJhcmApIGFuZCBjaGVjayBpZiBpdCBoYXMgY29uZmlnIHdlIGNhbiByZWx5IG9uLiBPdGhlcndpc2VcbiAgICAvLyB3ZSBmYWxsYmFjayB0byB0aGUgYHJvb3RgIGNvbnRleHQgdGhhdCBzaG91bGQgYWx3YXlzIGJlIGRlZmluZWQgKGVuZm9yY2VkIGJ5IGNvbmZpZ3VyYXRpb24gc2NoZW1hKS5cbiAgICByZXR1cm4gdGhpcy5nZXRMb2dnZXJDb25maWdCeUNvbnRleHQoY29uZmlnLCBMb2dnaW5nQ29uZmlnLmdldFBhcmVudExvZ2dlckNvbnRleHQoY29udGV4dCkpO1xuICB9XG59XG4iXX0=