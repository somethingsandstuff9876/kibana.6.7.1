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
const lodash_1 = require("lodash");
const operators_1 = require("rxjs/operators");
/** @internal */
class ConfigService {
    constructor(config$, env, logger) {
        this.config$ = config$;
        this.env = env;
        /**
         * Whenever a config if read at a path, we mark that path as 'handled'. We can
         * then list all unhandled config paths when the startup process is completed.
         */
        this.handledPaths = [];
        this.log = logger.get('config');
    }
    /**
     * Returns the full config object observable. This is not intended for
     * "normal use", but for features that _need_ access to the full object.
     */
    getConfig$() {
        return this.config$;
    }
    /**
     * Reads the subset of the config at the specified `path` and validates it
     * against the static `schema` on the given `ConfigClass`.
     *
     * @param path The path to the desired subset of the config.
     * @param ConfigClass A class (not an instance of a class) that contains a
     * static `schema` that we validate the config at the given `path` against.
     */
    atPath(path, ConfigClass) {
        return this.getDistinctConfig(path).pipe(operators_1.map(config => this.createConfig(path, config, ConfigClass)));
    }
    /**
     * Same as `atPath`, but returns `undefined` if there is no config at the
     * specified path.
     *
     * @see atPath
     */
    optionalAtPath(path, ConfigClass) {
        return this.getDistinctConfig(path).pipe(operators_1.map(config => config === undefined ? undefined : this.createConfig(path, config, ConfigClass)));
    }
    async isEnabledAtPath(path) {
        const enabledPath = createPluginEnabledPath(path);
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        if (!config.has(enabledPath)) {
            return true;
        }
        const isEnabled = config.get(enabledPath);
        if (isEnabled === false) {
            // If the plugin is _not_ enabled, we mark the entire plugin path as
            // handled, as it's expected that it won't be used.
            this.markAsHandled(path);
            return false;
        }
        // If plugin enabled we mark the enabled path as handled, as we for example
        // can have plugins that don't have _any_ config except for this field, and
        // therefore have no reason to try to get the config.
        this.markAsHandled(enabledPath);
        return true;
    }
    async getUnusedPaths() {
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        const handledPaths = this.handledPaths.map(pathToString);
        return config.getFlattenedPaths().filter(path => !isPathHandled(path, handledPaths));
    }
    async getUsedPaths() {
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        const handledPaths = this.handledPaths.map(pathToString);
        return config.getFlattenedPaths().filter(path => isPathHandled(path, handledPaths));
    }
    createConfig(path, config, ConfigClass) {
        const namespace = Array.isArray(path) ? path.join('.') : path;
        const configSchema = ConfigClass.schema;
        if (configSchema === undefined || typeof configSchema.validate !== 'function') {
            throw new Error(`The config class [${ConfigClass.name}] did not contain a static 'schema' field, which is required when creating a config instance`);
        }
        const validatedConfig = ConfigClass.schema.validate(config, {
            dev: this.env.mode.dev,
            prod: this.env.mode.prod,
            ...this.env.packageInfo,
        }, namespace);
        return new ConfigClass(validatedConfig, this.env);
    }
    getDistinctConfig(path) {
        this.markAsHandled(path);
        return this.config$.pipe(operators_1.map(config => config.get(path)), operators_1.distinctUntilChanged(lodash_1.isEqual));
    }
    markAsHandled(path) {
        this.log.debug(`Marking config path as handled: ${path}`);
        this.handledPaths.push(path);
    }
}
exports.ConfigService = ConfigService;
const createPluginEnabledPath = (configPath) => {
    if (Array.isArray(configPath)) {
        return configPath.concat('enabled');
    }
    return `${configPath}.enabled`;
};
const pathToString = (path) => (Array.isArray(path) ? path.join('.') : path);
/**
 * A path is considered 'handled' if it is a subset of any of the already
 * handled paths.
 */
const isPathHandled = (path, handledPaths) => handledPaths.some(handledPath => path.startsWith(handledPath));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9jb25maWdfc2VydmljZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9jb25maWdfc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUdILG1DQUFpQztBQUVqQyw4Q0FBa0U7QUFLbEUsZ0JBQWdCO0FBQ2hCLE1BQWEsYUFBYTtJQVN4QixZQUNtQixPQUEyQixFQUNuQyxHQUFRLEVBQ2pCLE1BQXFCO1FBRkosWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFDbkMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQVJuQjs7O1dBR0c7UUFDYyxpQkFBWSxHQUFpQixFQUFFLENBQUM7UUFPL0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxVQUFVO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUNYLElBQWdCLEVBQ2hCLFdBQStDO1FBRS9DLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDdEMsZUFBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQzVELENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxjQUFjLENBQ25CLElBQWdCLEVBQ2hCLFdBQStDO1FBRS9DLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDdEMsZUFBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ1gsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQ2hGLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsZUFBZSxDQUFDLElBQWdCO1FBQzNDLE1BQU0sV0FBVyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDNUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUMsSUFBSSxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLG9FQUFvRTtZQUNwRSxtREFBbUQ7WUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsMkVBQTJFO1FBQzNFLDJFQUEyRTtRQUMzRSxxREFBcUQ7UUFDckQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxLQUFLLENBQUMsY0FBYztRQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXpELE9BQU8sTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFekQsT0FBTyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVPLFlBQVksQ0FDbEIsSUFBZ0IsRUFDaEIsTUFBMkIsRUFDM0IsV0FBK0M7UUFFL0MsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTlELE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFFeEMsSUFBSSxZQUFZLEtBQUssU0FBUyxJQUFJLE9BQU8sWUFBWSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDN0UsTUFBTSxJQUFJLEtBQUssQ0FDYixxQkFDRSxXQUFXLENBQUMsSUFDZCw4RkFBOEYsQ0FDL0YsQ0FBQztTQUNIO1FBRUQsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQ2pELE1BQU0sRUFDTjtZQUNFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHO1lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3hCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXO1NBQ3hCLEVBQ0QsU0FBUyxDQUNWLENBQUM7UUFDRixPQUFPLElBQUksV0FBVyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVPLGlCQUFpQixDQUFDLElBQWdCO1FBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDdEIsZUFBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUMvQixnQ0FBb0IsQ0FBQyxnQkFBTyxDQUFDLENBQzlCLENBQUM7SUFDSixDQUFDO0lBRU8sYUFBYSxDQUFDLElBQWdCO1FBQ3BDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQTFJRCxzQ0EwSUM7QUFFRCxNQUFNLHVCQUF1QixHQUFHLENBQUMsVUFBNkIsRUFBRSxFQUFFO0lBQ2hFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUM3QixPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDckM7SUFDRCxPQUFPLEdBQUcsVUFBVSxVQUFVLENBQUM7QUFDakMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXpGOzs7R0FHRztBQUNILE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBWSxFQUFFLFlBQXNCLEVBQUUsRUFBRSxDQUM3RCxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFR5cGUgfSBmcm9tICdAa2JuL2NvbmZpZy1zY2hlbWEnO1xuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlyc3QsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29uZmlnLCBDb25maWdQYXRoLCBDb25maWdXaXRoU2NoZW1hLCBFbnYgfSBmcm9tICcuJztcbmltcG9ydCB7IExvZ2dlciwgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4uL2xvZ2dpbmcnO1xuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgY2xhc3MgQ29uZmlnU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9nOiBMb2dnZXI7XG5cbiAgLyoqXG4gICAqIFdoZW5ldmVyIGEgY29uZmlnIGlmIHJlYWQgYXQgYSBwYXRoLCB3ZSBtYXJrIHRoYXQgcGF0aCBhcyAnaGFuZGxlZCcuIFdlIGNhblxuICAgKiB0aGVuIGxpc3QgYWxsIHVuaGFuZGxlZCBjb25maWcgcGF0aHMgd2hlbiB0aGUgc3RhcnR1cCBwcm9jZXNzIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlZFBhdGhzOiBDb25maWdQYXRoW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZyQ6IE9ic2VydmFibGU8Q29uZmlnPixcbiAgICByZWFkb25seSBlbnY6IEVudixcbiAgICBsb2dnZXI6IExvZ2dlckZhY3RvcnlcbiAgKSB7XG4gICAgdGhpcy5sb2cgPSBsb2dnZXIuZ2V0KCdjb25maWcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdWxsIGNvbmZpZyBvYmplY3Qgb2JzZXJ2YWJsZS4gVGhpcyBpcyBub3QgaW50ZW5kZWQgZm9yXG4gICAqIFwibm9ybWFsIHVzZVwiLCBidXQgZm9yIGZlYXR1cmVzIHRoYXQgX25lZWRfIGFjY2VzcyB0byB0aGUgZnVsbCBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnJCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWckO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWRzIHRoZSBzdWJzZXQgb2YgdGhlIGNvbmZpZyBhdCB0aGUgc3BlY2lmaWVkIGBwYXRoYCBhbmQgdmFsaWRhdGVzIGl0XG4gICAqIGFnYWluc3QgdGhlIHN0YXRpYyBgc2NoZW1hYCBvbiB0aGUgZ2l2ZW4gYENvbmZpZ0NsYXNzYC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gdGhlIGRlc2lyZWQgc3Vic2V0IG9mIHRoZSBjb25maWcuXG4gICAqIEBwYXJhbSBDb25maWdDbGFzcyBBIGNsYXNzIChub3QgYW4gaW5zdGFuY2Ugb2YgYSBjbGFzcykgdGhhdCBjb250YWlucyBhXG4gICAqIHN0YXRpYyBgc2NoZW1hYCB0aGF0IHdlIHZhbGlkYXRlIHRoZSBjb25maWcgYXQgdGhlIGdpdmVuIGBwYXRoYCBhZ2FpbnN0LlxuICAgKi9cbiAgcHVibGljIGF0UGF0aDxUU2NoZW1hIGV4dGVuZHMgVHlwZTxhbnk+LCBUQ29uZmlnPihcbiAgICBwYXRoOiBDb25maWdQYXRoLFxuICAgIENvbmZpZ0NsYXNzOiBDb25maWdXaXRoU2NoZW1hPFRTY2hlbWEsIFRDb25maWc+XG4gICkge1xuICAgIHJldHVybiB0aGlzLmdldERpc3RpbmN0Q29uZmlnKHBhdGgpLnBpcGUoXG4gICAgICBtYXAoY29uZmlnID0+IHRoaXMuY3JlYXRlQ29uZmlnKHBhdGgsIGNvbmZpZywgQ29uZmlnQ2xhc3MpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU2FtZSBhcyBgYXRQYXRoYCwgYnV0IHJldHVybnMgYHVuZGVmaW5lZGAgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGF0IHRoZVxuICAgKiBzcGVjaWZpZWQgcGF0aC5cbiAgICpcbiAgICogQHNlZSBhdFBhdGhcbiAgICovXG4gIHB1YmxpYyBvcHRpb25hbEF0UGF0aDxUU2NoZW1hIGV4dGVuZHMgVHlwZTxhbnk+LCBUQ29uZmlnPihcbiAgICBwYXRoOiBDb25maWdQYXRoLFxuICAgIENvbmZpZ0NsYXNzOiBDb25maWdXaXRoU2NoZW1hPFRTY2hlbWEsIFRDb25maWc+XG4gICkge1xuICAgIHJldHVybiB0aGlzLmdldERpc3RpbmN0Q29uZmlnKHBhdGgpLnBpcGUoXG4gICAgICBtYXAoY29uZmlnID0+XG4gICAgICAgIGNvbmZpZyA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogdGhpcy5jcmVhdGVDb25maWcocGF0aCwgY29uZmlnLCBDb25maWdDbGFzcylcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGlzRW5hYmxlZEF0UGF0aChwYXRoOiBDb25maWdQYXRoKSB7XG4gICAgY29uc3QgZW5hYmxlZFBhdGggPSBjcmVhdGVQbHVnaW5FbmFibGVkUGF0aChwYXRoKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuY29uZmlnJC5waXBlKGZpcnN0KCkpLnRvUHJvbWlzZSgpO1xuICAgIGlmICghY29uZmlnLmhhcyhlbmFibGVkUGF0aCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRW5hYmxlZCA9IGNvbmZpZy5nZXQoZW5hYmxlZFBhdGgpO1xuICAgIGlmIChpc0VuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBJZiB0aGUgcGx1Z2luIGlzIF9ub3RfIGVuYWJsZWQsIHdlIG1hcmsgdGhlIGVudGlyZSBwbHVnaW4gcGF0aCBhc1xuICAgICAgLy8gaGFuZGxlZCwgYXMgaXQncyBleHBlY3RlZCB0aGF0IGl0IHdvbid0IGJlIHVzZWQuXG4gICAgICB0aGlzLm1hcmtBc0hhbmRsZWQocGF0aCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSWYgcGx1Z2luIGVuYWJsZWQgd2UgbWFyayB0aGUgZW5hYmxlZCBwYXRoIGFzIGhhbmRsZWQsIGFzIHdlIGZvciBleGFtcGxlXG4gICAgLy8gY2FuIGhhdmUgcGx1Z2lucyB0aGF0IGRvbid0IGhhdmUgX2FueV8gY29uZmlnIGV4Y2VwdCBmb3IgdGhpcyBmaWVsZCwgYW5kXG4gICAgLy8gdGhlcmVmb3JlIGhhdmUgbm8gcmVhc29uIHRvIHRyeSB0byBnZXQgdGhlIGNvbmZpZy5cbiAgICB0aGlzLm1hcmtBc0hhbmRsZWQoZW5hYmxlZFBhdGgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFVudXNlZFBhdGhzKCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuY29uZmlnJC5waXBlKGZpcnN0KCkpLnRvUHJvbWlzZSgpO1xuICAgIGNvbnN0IGhhbmRsZWRQYXRocyA9IHRoaXMuaGFuZGxlZFBhdGhzLm1hcChwYXRoVG9TdHJpbmcpO1xuXG4gICAgcmV0dXJuIGNvbmZpZy5nZXRGbGF0dGVuZWRQYXRocygpLmZpbHRlcihwYXRoID0+ICFpc1BhdGhIYW5kbGVkKHBhdGgsIGhhbmRsZWRQYXRocykpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFVzZWRQYXRocygpIHtcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCB0aGlzLmNvbmZpZyQucGlwZShmaXJzdCgpKS50b1Byb21pc2UoKTtcbiAgICBjb25zdCBoYW5kbGVkUGF0aHMgPSB0aGlzLmhhbmRsZWRQYXRocy5tYXAocGF0aFRvU3RyaW5nKTtcblxuICAgIHJldHVybiBjb25maWcuZ2V0RmxhdHRlbmVkUGF0aHMoKS5maWx0ZXIocGF0aCA9PiBpc1BhdGhIYW5kbGVkKHBhdGgsIGhhbmRsZWRQYXRocykpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb25maWc8VFNjaGVtYSBleHRlbmRzIFR5cGU8YW55PiwgVENvbmZpZz4oXG4gICAgcGF0aDogQ29uZmlnUGF0aCxcbiAgICBjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgQ29uZmlnQ2xhc3M6IENvbmZpZ1dpdGhTY2hlbWE8VFNjaGVtYSwgVENvbmZpZz5cbiAgKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlID0gQXJyYXkuaXNBcnJheShwYXRoKSA/IHBhdGguam9pbignLicpIDogcGF0aDtcblxuICAgIGNvbnN0IGNvbmZpZ1NjaGVtYSA9IENvbmZpZ0NsYXNzLnNjaGVtYTtcblxuICAgIGlmIChjb25maWdTY2hlbWEgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgY29uZmlnU2NoZW1hLnZhbGlkYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUaGUgY29uZmlnIGNsYXNzIFske1xuICAgICAgICAgIENvbmZpZ0NsYXNzLm5hbWVcbiAgICAgICAgfV0gZGlkIG5vdCBjb250YWluIGEgc3RhdGljICdzY2hlbWEnIGZpZWxkLCB3aGljaCBpcyByZXF1aXJlZCB3aGVuIGNyZWF0aW5nIGEgY29uZmlnIGluc3RhbmNlYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWxpZGF0ZWRDb25maWcgPSBDb25maWdDbGFzcy5zY2hlbWEudmFsaWRhdGUoXG4gICAgICBjb25maWcsXG4gICAgICB7XG4gICAgICAgIGRldjogdGhpcy5lbnYubW9kZS5kZXYsXG4gICAgICAgIHByb2Q6IHRoaXMuZW52Lm1vZGUucHJvZCxcbiAgICAgICAgLi4udGhpcy5lbnYucGFja2FnZUluZm8sXG4gICAgICB9LFxuICAgICAgbmFtZXNwYWNlXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IENvbmZpZ0NsYXNzKHZhbGlkYXRlZENvbmZpZywgdGhpcy5lbnYpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREaXN0aW5jdENvbmZpZyhwYXRoOiBDb25maWdQYXRoKSB7XG4gICAgdGhpcy5tYXJrQXNIYW5kbGVkKHBhdGgpO1xuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnJC5waXBlKFxuICAgICAgbWFwKGNvbmZpZyA9PiBjb25maWcuZ2V0KHBhdGgpKSxcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKGlzRXF1YWwpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgbWFya0FzSGFuZGxlZChwYXRoOiBDb25maWdQYXRoKSB7XG4gICAgdGhpcy5sb2cuZGVidWcoYE1hcmtpbmcgY29uZmlnIHBhdGggYXMgaGFuZGxlZDogJHtwYXRofWApO1xuICAgIHRoaXMuaGFuZGxlZFBhdGhzLnB1c2gocGF0aCk7XG4gIH1cbn1cblxuY29uc3QgY3JlYXRlUGx1Z2luRW5hYmxlZFBhdGggPSAoY29uZmlnUGF0aDogc3RyaW5nIHwgc3RyaW5nW10pID0+IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoY29uZmlnUGF0aCkpIHtcbiAgICByZXR1cm4gY29uZmlnUGF0aC5jb25jYXQoJ2VuYWJsZWQnKTtcbiAgfVxuICByZXR1cm4gYCR7Y29uZmlnUGF0aH0uZW5hYmxlZGA7XG59O1xuXG5jb25zdCBwYXRoVG9TdHJpbmcgPSAocGF0aDogQ29uZmlnUGF0aCkgPT4gKEFycmF5LmlzQXJyYXkocGF0aCkgPyBwYXRoLmpvaW4oJy4nKSA6IHBhdGgpO1xuXG4vKipcbiAqIEEgcGF0aCBpcyBjb25zaWRlcmVkICdoYW5kbGVkJyBpZiBpdCBpcyBhIHN1YnNldCBvZiBhbnkgb2YgdGhlIGFscmVhZHlcbiAqIGhhbmRsZWQgcGF0aHMuXG4gKi9cbmNvbnN0IGlzUGF0aEhhbmRsZWQgPSAocGF0aDogc3RyaW5nLCBoYW5kbGVkUGF0aHM6IHN0cmluZ1tdKSA9PlxuICBoYW5kbGVkUGF0aHMuc29tZShoYW5kbGVkUGF0aCA9PiBwYXRoLnN0YXJ0c1dpdGgoaGFuZGxlZFBhdGgpKTtcbiJdfQ==