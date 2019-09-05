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
const config_schema_1 = require("@kbn/config-schema");
const appenders_1 = require("./appenders/appenders");
// We need this helper for the types to be correct
// (otherwise it assumes an array of A|B instead of a tuple [A,B])
const toTuple = (a, b) => [a, b];
/**
 * Separator string that used within nested context name (eg. plugins.pid).
 */
const CONTEXT_SEPARATOR = '.';
/**
 * Name of the `root` context that always exists and sits at the top of logger hierarchy.
 */
const ROOT_CONTEXT_NAME = 'root';
/**
 * Name of the appender that is always presented and used by `root` logger by default.
 */
const DEFAULT_APPENDER_NAME = 'default';
const createLevelSchema = config_schema_1.schema.oneOf([
    config_schema_1.schema.literal('all'),
    config_schema_1.schema.literal('fatal'),
    config_schema_1.schema.literal('error'),
    config_schema_1.schema.literal('warn'),
    config_schema_1.schema.literal('info'),
    config_schema_1.schema.literal('debug'),
    config_schema_1.schema.literal('trace'),
    config_schema_1.schema.literal('off'),
], {
    defaultValue: 'info',
});
const createLoggerSchema = config_schema_1.schema.object({
    appenders: config_schema_1.schema.arrayOf(config_schema_1.schema.string(), { defaultValue: [] }),
    context: config_schema_1.schema.string(),
    level: createLevelSchema,
});
const loggingSchema = config_schema_1.schema.object({
    appenders: config_schema_1.schema.mapOf(config_schema_1.schema.string(), appenders_1.Appenders.configSchema, {
        defaultValue: new Map(),
    }),
    loggers: config_schema_1.schema.arrayOf(createLoggerSchema, {
        defaultValue: [],
    }),
    root: config_schema_1.schema.object({
        appenders: config_schema_1.schema.arrayOf(config_schema_1.schema.string(), {
            defaultValue: [DEFAULT_APPENDER_NAME],
            minSize: 1,
        }),
        level: createLevelSchema,
    }),
});
/**
 * Describes the config used to fully setup logging subsystem.
 * @internal
 */
class LoggingConfig {
    constructor(configType) {
        /**
         * Map of the appender unique arbitrary key and its corresponding config.
         */
        this.appenders = new Map([
            [
                DEFAULT_APPENDER_NAME,
                {
                    kind: 'console',
                    layout: { kind: 'pattern', highlight: true },
                },
            ],
        ]);
        /**
         * Map of the logger unique arbitrary key (context) and its corresponding config.
         */
        this.loggers = new Map();
        this.fillAppendersConfig(configType);
        this.fillLoggersConfig(configType);
    }
    /**
     * Helper method that joins separate string context parts into single context string.
     * In case joined context is an empty string, `root` context name is returned.
     * @param contextParts List of the context parts (e.g. ['parent', 'child'].
     * @returns {string} Joined context string (e.g. 'parent.child').
     */
    static getLoggerContext(contextParts) {
        return contextParts.join(CONTEXT_SEPARATOR) || ROOT_CONTEXT_NAME;
    }
    /**
     * Helper method that returns parent context for the specified one.
     * @param context Context to find parent for.
     * @returns Name of the parent context or `root` if the context is the top level one.
     */
    static getParentLoggerContext(context) {
        const lastIndexOfSeparator = context.lastIndexOf(CONTEXT_SEPARATOR);
        if (lastIndexOfSeparator === -1) {
            return ROOT_CONTEXT_NAME;
        }
        return context.slice(0, lastIndexOfSeparator);
    }
    fillAppendersConfig(loggingConfig) {
        for (const [appenderKey, appenderSchema] of loggingConfig.appenders) {
            this.appenders.set(appenderKey, appenderSchema);
        }
    }
    fillLoggersConfig(loggingConfig) {
        // Include `root` logger into common logger list so that it can easily be a part
        // of the logger hierarchy and put all the loggers in map for easier retrieval.
        const loggers = [
            { context: ROOT_CONTEXT_NAME, ...loggingConfig.root },
            ...loggingConfig.loggers,
        ];
        const loggerConfigByContext = new Map(loggers.map(loggerConfig => toTuple(loggerConfig.context, loggerConfig)));
        for (const [loggerContext, loggerConfig] of loggerConfigByContext) {
            // Ensure logger config only contains valid appenders.
            const unsupportedAppenderKey = loggerConfig.appenders.find(appenderKey => !this.appenders.has(appenderKey));
            if (unsupportedAppenderKey) {
                throw new Error(`Logger "${loggerContext}" contains unsupported appender key "${unsupportedAppenderKey}".`);
            }
            const appenders = getAppenders(loggerConfig, loggerConfigByContext);
            // We expect `appenders` to never be empty at this point, since the `root` context config should always
            // have at least one appender that is enforced by the config schema validation.
            this.loggers.set(loggerContext, {
                ...loggerConfig,
                appenders,
            });
        }
    }
}
LoggingConfig.schema = loggingSchema;
exports.LoggingConfig = LoggingConfig;
/**
 * Get appenders for logger config.
 *
 * If config for current context doesn't have any defined appenders inherit
 * appenders from the parent context config.
 */
function getAppenders(loggerConfig, loggerConfigByContext) {
    let currentContext = loggerConfig.context;
    let appenders = loggerConfig.appenders;
    while (appenders.length === 0) {
        const parentContext = LoggingConfig.getParentLoggerContext(currentContext);
        const parentLogger = loggerConfigByContext.get(parentContext);
        if (parentLogger) {
            appenders = parentLogger.appenders;
        }
        currentContext = parentContext;
    }
    return appenders;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbG9nZ2luZ19jb25maWcudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9sb2dnaW5nL2xvZ2dpbmdfY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUgsc0RBQW9EO0FBQ3BELHFEQUFzRTtBQUV0RSxrREFBa0Q7QUFDbEQsa0VBQWtFO0FBQ2xFLE1BQU0sT0FBTyxHQUFHLENBQU8sQ0FBSSxFQUFFLENBQUksRUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFckQ7O0dBRUc7QUFDSCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUU5Qjs7R0FFRztBQUNILE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBRWpDOztHQUVHO0FBQ0gsTUFBTSxxQkFBcUIsR0FBRyxTQUFTLENBQUM7QUFFeEMsTUFBTSxpQkFBaUIsR0FBRyxzQkFBTSxDQUFDLEtBQUssQ0FDcEM7SUFDRSxzQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDckIsc0JBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLHNCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUN2QixzQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdEIsc0JBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3RCLHNCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUN2QixzQkFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDdkIsc0JBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0NBQ3RCLEVBQ0Q7SUFDRSxZQUFZLEVBQUUsTUFBTTtDQUNyQixDQUNGLENBQUM7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WUFDaEIsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7U0FDcEM7UUFFRCxjQUFjLEdBQUcsYUFBYSxDQUFDO0tBQ2hDO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBzY2hlbWEsIFR5cGVPZiB9IGZyb20gJ0BrYm4vY29uZmlnLXNjaGVtYSc7XG5pbXBvcnQgeyBBcHBlbmRlckNvbmZpZ1R5cGUsIEFwcGVuZGVycyB9IGZyb20gJy4vYXBwZW5kZXJzL2FwcGVuZGVycyc7XG5cbi8vIFdlIG5lZWQgdGhpcyBoZWxwZXIgZm9yIHRoZSB0eXBlcyB0byBiZSBjb3JyZWN0XG4vLyAob3RoZXJ3aXNlIGl0IGFzc3VtZXMgYW4gYXJyYXkgb2YgQXxCIGluc3RlYWQgb2YgYSB0dXBsZSBbQSxCXSlcbmNvbnN0IHRvVHVwbGUgPSA8QSwgQj4oYTogQSwgYjogQik6IFtBLCBCXSA9PiBbYSwgYl07XG5cbi8qKlxuICogU2VwYXJhdG9yIHN0cmluZyB0aGF0IHVzZWQgd2l0aGluIG5lc3RlZCBjb250ZXh0IG5hbWUgKGVnLiBwbHVnaW5zLnBpZCkuXG4gKi9cbmNvbnN0IENPTlRFWFRfU0VQQVJBVE9SID0gJy4nO1xuXG4vKipcbiAqIE5hbWUgb2YgdGhlIGByb290YCBjb250ZXh0IHRoYXQgYWx3YXlzIGV4aXN0cyBhbmQgc2l0cyBhdCB0aGUgdG9wIG9mIGxvZ2dlciBoaWVyYXJjaHkuXG4gKi9cbmNvbnN0IFJPT1RfQ09OVEVYVF9OQU1FID0gJ3Jvb3QnO1xuXG4vKipcbiAqIE5hbWUgb2YgdGhlIGFwcGVuZGVyIHRoYXQgaXMgYWx3YXlzIHByZXNlbnRlZCBhbmQgdXNlZCBieSBgcm9vdGAgbG9nZ2VyIGJ5IGRlZmF1bHQuXG4gKi9cbmNvbnN0IERFRkFVTFRfQVBQRU5ERVJfTkFNRSA9ICdkZWZhdWx0JztcblxuY29uc3QgY3JlYXRlTGV2ZWxTY2hlbWEgPSBzY2hlbWEub25lT2YoXG4gIFtcbiAgICBzY2hlbWEubGl0ZXJhbCgnYWxsJyksXG4gICAgc2NoZW1hLmxpdGVyYWwoJ2ZhdGFsJyksXG4gICAgc2NoZW1hLmxpdGVyYWwoJ2Vycm9yJyksXG4gICAgc2NoZW1hLmxpdGVyYWwoJ3dhcm4nKSxcbiAgICBzY2hlbWEubGl0ZXJhbCgnaW5mbycpLFxuICAgIHNjaGVtYS5saXRlcmFsKCdkZWJ1ZycpLFxuICAgIHNjaGVtYS5saXRlcmFsKCd0cmFjZScpLFxuICAgIHNjaGVtYS5saXRlcmFsKCdvZmYnKSxcbiAgXSxcbiAge1xuICAgIGRlZmF1bHRWYWx1ZTogJ2luZm8nLFxuICB9XG4pO1xuXG5jb25zdCBjcmVhdGVMb2dnZXJTY2hlbWEgPSBzY2hlbWEub2JqZWN0KHtcbiAgYXBwZW5kZXJzOiBzY2hlbWEuYXJyYXlPZihzY2hlbWEuc3RyaW5nKCksIHsgZGVmYXVsdFZhbHVlOiBbXSB9KSxcbiAgY29udGV4dDogc2NoZW1hLnN0cmluZygpLFxuICBsZXZlbDogY3JlYXRlTGV2ZWxTY2hlbWEsXG59KTtcblxuY29uc3QgbG9nZ2luZ1NjaGVtYSA9IHNjaGVtYS5vYmplY3Qoe1xuICBhcHBlbmRlcnM6IHNjaGVtYS5tYXBPZihzY2hlbWEuc3RyaW5nKCksIEFwcGVuZGVycy5jb25maWdTY2hlbWEsIHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBNYXA8c3RyaW5nLCBBcHBlbmRlckNvbmZpZ1R5cGU+KCksXG4gIH0pLFxuICBsb2dnZXJzOiBzY2hlbWEuYXJyYXlPZihjcmVhdGVMb2dnZXJTY2hlbWEsIHtcbiAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICB9KSxcbiAgcm9vdDogc2NoZW1hLm9iamVjdCh7XG4gICAgYXBwZW5kZXJzOiBzY2hlbWEuYXJyYXlPZihzY2hlbWEuc3RyaW5nKCksIHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogW0RFRkFVTFRfQVBQRU5ERVJfTkFNRV0sXG4gICAgICBtaW5TaXplOiAxLFxuICAgIH0pLFxuICAgIGxldmVsOiBjcmVhdGVMZXZlbFNjaGVtYSxcbiAgfSksXG59KTtcblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHR5cGUgTG9nZ2VyQ29uZmlnVHlwZSA9IFR5cGVPZjx0eXBlb2YgY3JlYXRlTG9nZ2VyU2NoZW1hPjtcblxudHlwZSBMb2dnaW5nQ29uZmlnVHlwZSA9IFR5cGVPZjx0eXBlb2YgbG9nZ2luZ1NjaGVtYT47XG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSBjb25maWcgdXNlZCB0byBmdWxseSBzZXR1cCBsb2dnaW5nIHN1YnN5c3RlbS5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgTG9nZ2luZ0NvbmZpZyB7XG4gIHB1YmxpYyBzdGF0aWMgc2NoZW1hID0gbG9nZ2luZ1NjaGVtYTtcblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0aGF0IGpvaW5zIHNlcGFyYXRlIHN0cmluZyBjb250ZXh0IHBhcnRzIGludG8gc2luZ2xlIGNvbnRleHQgc3RyaW5nLlxuICAgKiBJbiBjYXNlIGpvaW5lZCBjb250ZXh0IGlzIGFuIGVtcHR5IHN0cmluZywgYHJvb3RgIGNvbnRleHQgbmFtZSBpcyByZXR1cm5lZC5cbiAgICogQHBhcmFtIGNvbnRleHRQYXJ0cyBMaXN0IG9mIHRoZSBjb250ZXh0IHBhcnRzIChlLmcuIFsncGFyZW50JywgJ2NoaWxkJ10uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IEpvaW5lZCBjb250ZXh0IHN0cmluZyAoZS5nLiAncGFyZW50LmNoaWxkJykuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldExvZ2dlckNvbnRleHQoY29udGV4dFBhcnRzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBjb250ZXh0UGFydHMuam9pbihDT05URVhUX1NFUEFSQVRPUikgfHwgUk9PVF9DT05URVhUX05BTUU7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0aGF0IHJldHVybnMgcGFyZW50IGNvbnRleHQgZm9yIHRoZSBzcGVjaWZpZWQgb25lLlxuICAgKiBAcGFyYW0gY29udGV4dCBDb250ZXh0IHRvIGZpbmQgcGFyZW50IGZvci5cbiAgICogQHJldHVybnMgTmFtZSBvZiB0aGUgcGFyZW50IGNvbnRleHQgb3IgYHJvb3RgIGlmIHRoZSBjb250ZXh0IGlzIHRoZSB0b3AgbGV2ZWwgb25lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRQYXJlbnRMb2dnZXJDb250ZXh0KGNvbnRleHQ6IHN0cmluZykge1xuICAgIGNvbnN0IGxhc3RJbmRleE9mU2VwYXJhdG9yID0gY29udGV4dC5sYXN0SW5kZXhPZihDT05URVhUX1NFUEFSQVRPUik7XG4gICAgaWYgKGxhc3RJbmRleE9mU2VwYXJhdG9yID09PSAtMSkge1xuICAgICAgcmV0dXJuIFJPT1RfQ09OVEVYVF9OQU1FO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZXh0LnNsaWNlKDAsIGxhc3RJbmRleE9mU2VwYXJhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXAgb2YgdGhlIGFwcGVuZGVyIHVuaXF1ZSBhcmJpdHJhcnkga2V5IGFuZCBpdHMgY29ycmVzcG9uZGluZyBjb25maWcuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXBwZW5kZXJzOiBNYXA8c3RyaW5nLCBBcHBlbmRlckNvbmZpZ1R5cGU+ID0gbmV3IE1hcChbXG4gICAgW1xuICAgICAgREVGQVVMVF9BUFBFTkRFUl9OQU1FLFxuICAgICAge1xuICAgICAgICBraW5kOiAnY29uc29sZScsXG4gICAgICAgIGxheW91dDogeyBraW5kOiAncGF0dGVybicsIGhpZ2hsaWdodDogdHJ1ZSB9LFxuICAgICAgfSBhcyBBcHBlbmRlckNvbmZpZ1R5cGUsXG4gICAgXSxcbiAgXSk7XG5cbiAgLyoqXG4gICAqIE1hcCBvZiB0aGUgbG9nZ2VyIHVuaXF1ZSBhcmJpdHJhcnkga2V5IChjb250ZXh0KSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgY29uZmlnLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ2dlcnM6IE1hcDxzdHJpbmcsIExvZ2dlckNvbmZpZ1R5cGU+ID0gbmV3IE1hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZ1R5cGU6IExvZ2dpbmdDb25maWdUeXBlKSB7XG4gICAgdGhpcy5maWxsQXBwZW5kZXJzQ29uZmlnKGNvbmZpZ1R5cGUpO1xuICAgIHRoaXMuZmlsbExvZ2dlcnNDb25maWcoY29uZmlnVHlwZSk7XG4gIH1cblxuICBwcml2YXRlIGZpbGxBcHBlbmRlcnNDb25maWcobG9nZ2luZ0NvbmZpZzogTG9nZ2luZ0NvbmZpZ1R5cGUpIHtcbiAgICBmb3IgKGNvbnN0IFthcHBlbmRlcktleSwgYXBwZW5kZXJTY2hlbWFdIG9mIGxvZ2dpbmdDb25maWcuYXBwZW5kZXJzKSB7XG4gICAgICB0aGlzLmFwcGVuZGVycy5zZXQoYXBwZW5kZXJLZXksIGFwcGVuZGVyU2NoZW1hKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbGxMb2dnZXJzQ29uZmlnKGxvZ2dpbmdDb25maWc6IExvZ2dpbmdDb25maWdUeXBlKSB7XG4gICAgLy8gSW5jbHVkZSBgcm9vdGAgbG9nZ2VyIGludG8gY29tbW9uIGxvZ2dlciBsaXN0IHNvIHRoYXQgaXQgY2FuIGVhc2lseSBiZSBhIHBhcnRcbiAgICAvLyBvZiB0aGUgbG9nZ2VyIGhpZXJhcmNoeSBhbmQgcHV0IGFsbCB0aGUgbG9nZ2VycyBpbiBtYXAgZm9yIGVhc2llciByZXRyaWV2YWwuXG4gICAgY29uc3QgbG9nZ2VycyA9IFtcbiAgICAgIHsgY29udGV4dDogUk9PVF9DT05URVhUX05BTUUsIC4uLmxvZ2dpbmdDb25maWcucm9vdCB9LFxuICAgICAgLi4ubG9nZ2luZ0NvbmZpZy5sb2dnZXJzLFxuICAgIF07XG5cbiAgICBjb25zdCBsb2dnZXJDb25maWdCeUNvbnRleHQgPSBuZXcgTWFwKFxuICAgICAgbG9nZ2Vycy5tYXAobG9nZ2VyQ29uZmlnID0+IHRvVHVwbGUobG9nZ2VyQ29uZmlnLmNvbnRleHQsIGxvZ2dlckNvbmZpZykpXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgW2xvZ2dlckNvbnRleHQsIGxvZ2dlckNvbmZpZ10gb2YgbG9nZ2VyQ29uZmlnQnlDb250ZXh0KSB7XG4gICAgICAvLyBFbnN1cmUgbG9nZ2VyIGNvbmZpZyBvbmx5IGNvbnRhaW5zIHZhbGlkIGFwcGVuZGVycy5cbiAgICAgIGNvbnN0IHVuc3VwcG9ydGVkQXBwZW5kZXJLZXkgPSBsb2dnZXJDb25maWcuYXBwZW5kZXJzLmZpbmQoXG4gICAgICAgIGFwcGVuZGVyS2V5ID0+ICF0aGlzLmFwcGVuZGVycy5oYXMoYXBwZW5kZXJLZXkpXG4gICAgICApO1xuXG4gICAgICBpZiAodW5zdXBwb3J0ZWRBcHBlbmRlcktleSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYExvZ2dlciBcIiR7bG9nZ2VyQ29udGV4dH1cIiBjb250YWlucyB1bnN1cHBvcnRlZCBhcHBlbmRlciBrZXkgXCIke3Vuc3VwcG9ydGVkQXBwZW5kZXJLZXl9XCIuYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhcHBlbmRlcnMgPSBnZXRBcHBlbmRlcnMobG9nZ2VyQ29uZmlnLCBsb2dnZXJDb25maWdCeUNvbnRleHQpO1xuXG4gICAgICAvLyBXZSBleHBlY3QgYGFwcGVuZGVyc2AgdG8gbmV2ZXIgYmUgZW1wdHkgYXQgdGhpcyBwb2ludCwgc2luY2UgdGhlIGByb290YCBjb250ZXh0IGNvbmZpZyBzaG91bGQgYWx3YXlzXG4gICAgICAvLyBoYXZlIGF0IGxlYXN0IG9uZSBhcHBlbmRlciB0aGF0IGlzIGVuZm9yY2VkIGJ5IHRoZSBjb25maWcgc2NoZW1hIHZhbGlkYXRpb24uXG4gICAgICB0aGlzLmxvZ2dlcnMuc2V0KGxvZ2dlckNvbnRleHQsIHtcbiAgICAgICAgLi4ubG9nZ2VyQ29uZmlnLFxuICAgICAgICBhcHBlbmRlcnMsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgYXBwZW5kZXJzIGZvciBsb2dnZXIgY29uZmlnLlxuICpcbiAqIElmIGNvbmZpZyBmb3IgY3VycmVudCBjb250ZXh0IGRvZXNuJ3QgaGF2ZSBhbnkgZGVmaW5lZCBhcHBlbmRlcnMgaW5oZXJpdFxuICogYXBwZW5kZXJzIGZyb20gdGhlIHBhcmVudCBjb250ZXh0IGNvbmZpZy5cbiAqL1xuZnVuY3Rpb24gZ2V0QXBwZW5kZXJzKFxuICBsb2dnZXJDb25maWc6IExvZ2dlckNvbmZpZ1R5cGUsXG4gIGxvZ2dlckNvbmZpZ0J5Q29udGV4dDogTWFwPHN0cmluZywgTG9nZ2VyQ29uZmlnVHlwZT5cbikge1xuICBsZXQgY3VycmVudENvbnRleHQgPSBsb2dnZXJDb25maWcuY29udGV4dDtcbiAgbGV0IGFwcGVuZGVycyA9IGxvZ2dlckNvbmZpZy5hcHBlbmRlcnM7XG5cbiAgd2hpbGUgKGFwcGVuZGVycy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCBwYXJlbnRDb250ZXh0ID0gTG9nZ2luZ0NvbmZpZy5nZXRQYXJlbnRMb2dnZXJDb250ZXh0KGN1cnJlbnRDb250ZXh0KTtcblxuICAgIGNvbnN0IHBhcmVudExvZ2dlciA9IGxvZ2dlckNvbmZpZ0J5Q29udGV4dC5nZXQocGFyZW50Q29udGV4dCk7XG4gICAgaWYgKHBhcmVudExvZ2dlcikge1xuICAgICAgYXBwZW5kZXJzID0gcGFyZW50TG9nZ2VyLmFwcGVuZGVycztcbiAgICB9XG5cbiAgICBjdXJyZW50Q29udGV4dCA9IHBhcmVudENvbnRleHQ7XG4gIH1cblxuICByZXR1cm4gYXBwZW5kZXJzO1xufVxuIl19