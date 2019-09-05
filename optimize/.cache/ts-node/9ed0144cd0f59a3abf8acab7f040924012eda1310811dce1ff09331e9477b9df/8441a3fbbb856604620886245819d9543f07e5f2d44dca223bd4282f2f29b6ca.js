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
const discovery_1 = require("./discovery");
const plugins_config_1 = require("./plugins_config");
const plugins_system_1 = require("./plugins_system");
/** @internal */
class PluginsService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.log = coreContext.logger.get('plugins-service');
        this.pluginsSystem = new plugins_system_1.PluginsSystem(coreContext);
    }
    async start() {
        this.log.debug('Starting plugins service');
        const config = await this.coreContext.configService
            .atPath('plugins', plugins_config_1.PluginsConfig)
            .pipe(operators_1.first())
            .toPromise();
        const { error$, plugin$ } = discovery_1.discover(config, this.coreContext);
        await this.handleDiscoveryErrors(error$);
        await this.handleDiscoveredPlugins(plugin$);
        if (!config.initialize || this.coreContext.env.isDevClusterMaster) {
            this.log.info('Plugin initialization disabled.');
            return new Map();
        }
        return await this.pluginsSystem.startPlugins();
    }
    async stop() {
        this.log.debug('Stopping plugins service');
        await this.pluginsSystem.stopPlugins();
    }
    async handleDiscoveryErrors(error$) {
        // At this stage we report only errors that can occur when new platform plugin
        // manifest is present, otherwise we can't be sure that the plugin is for the new
        // platform and let legacy platform to handle it.
        const errorTypesToReport = [
            discovery_1.PluginDiscoveryErrorType.IncompatibleVersion,
            discovery_1.PluginDiscoveryErrorType.InvalidManifest,
        ];
        const errors = await error$
            .pipe(operators_1.filter(error => errorTypesToReport.includes(error.type)), operators_1.tap(pluginError => this.log.error(pluginError)), operators_1.toArray())
            .toPromise();
        if (errors.length > 0) {
            throw new Error(`Failed to initialize plugins:${errors.map(err => `\n\t${err.message}`).join('')}`);
        }
    }
    async handleDiscoveredPlugins(plugin$) {
        const pluginEnableStatuses = new Map();
        await plugin$
            .pipe(operators_1.mergeMap(async (plugin) => {
            const isEnabled = await this.coreContext.configService.isEnabledAtPath(plugin.configPath);
            if (pluginEnableStatuses.has(plugin.name)) {
                throw new Error(`Plugin with id "${plugin.name}" is already registered!`);
            }
            pluginEnableStatuses.set(plugin.name, {
                plugin,
                isEnabled,
            });
        }))
            .toPromise();
        for (const [pluginName, { plugin, isEnabled }] of pluginEnableStatuses) {
            if (this.shouldEnablePlugin(pluginName, pluginEnableStatuses)) {
                this.pluginsSystem.addPlugin(plugin);
            }
            else if (isEnabled) {
                this.log.info(`Plugin "${pluginName}" has been disabled since some of its direct or transitive dependencies are missing or disabled.`);
            }
            else {
                this.log.info(`Plugin "${pluginName}" is disabled.`);
            }
        }
        this.log.debug(`Discovered ${pluginEnableStatuses.size} plugins.`);
    }
    shouldEnablePlugin(pluginName, pluginEnableStatuses) {
        const pluginInfo = pluginEnableStatuses.get(pluginName);
        return (pluginInfo !== undefined &&
            pluginInfo.isEnabled &&
            pluginInfo.plugin.requiredDependencies.every(dependencyName => this.shouldEnablePlugin(dependencyName, pluginEnableStatuses)));
    }
}
exports.PluginsService = PluginsService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL3BsdWdpbnMvcGx1Z2luc19zZXJ2aWNlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS9zZXJ2ZXIvcGx1Z2lucy9wbHVnaW5zX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFHSCw4Q0FBdUU7QUFHdkUsMkNBQXVGO0FBRXZGLHFEQUFpRDtBQUNqRCxxREFBaUQ7QUFLakQsZ0JBQWdCO0FBQ2hCLE1BQWEsY0FBYztJQUl6QixZQUE2QixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNuRCxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDhCQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWE7YUFDaEQsTUFBTSxDQUFDLFNBQVMsRUFBRSw4QkFBYSxDQUFDO2FBQ2hDLElBQUksQ0FBQyxpQkFBSyxFQUFFLENBQUM7YUFDYixTQUFTLEVBQUUsQ0FBQztRQUVmLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsb0JBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FB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Q0FBQyxDQUFDO2FBQ3REO1NBQ0Y7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLG9CQUFvQixDQUFDLElBQUksV0FBVyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVPLGtCQUFrQixDQUN4QixVQUFzQixFQUN0QixvQkFBNkU7UUFFN0UsTUFBTSxVQUFVLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sQ0FDTCxVQUFVLEtBQUssU0FBUztZQUN4QixVQUFVLENBQUMsU0FBUztZQUNwQixVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUM1RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLG9CQUFvQixDQUFDLENBQzlELENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXhHRCx3Q0F3R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgbWVyZ2VNYXAsIHRhcCwgdG9BcnJheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENvcmVDb250ZXh0LCBDb3JlU2VydmljZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL2xvZ2dpbmcnO1xuaW1wb3J0IHsgZGlzY292ZXIsIFBsdWdpbkRpc2NvdmVyeUVycm9yLCBQbHVnaW5EaXNjb3ZlcnlFcnJvclR5cGUgfSBmcm9tICcuL2Rpc2NvdmVyeSc7XG5pbXBvcnQgeyBQbHVnaW4sIFBsdWdpbk5hbWUgfSBmcm9tICcuL3BsdWdpbic7XG5pbXBvcnQgeyBQbHVnaW5zQ29uZmlnIH0gZnJvbSAnLi9wbHVnaW5zX2NvbmZpZyc7XG5pbXBvcnQgeyBQbHVnaW5zU3lzdGVtIH0gZnJvbSAnLi9wbHVnaW5zX3N5c3RlbSc7XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB0eXBlIFBsdWdpbnNTZXJ2aWNlU3RhcnRDb250cmFjdCA9IE1hcDxQbHVnaW5OYW1lLCB1bmtub3duPjtcblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGNsYXNzIFBsdWdpbnNTZXJ2aWNlIGltcGxlbWVudHMgQ29yZVNlcnZpY2U8UGx1Z2luc1NlcnZpY2VTdGFydENvbnRyYWN0PiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9nOiBMb2dnZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGx1Z2luc1N5c3RlbTogUGx1Z2luc1N5c3RlbTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvcmVDb250ZXh0OiBDb3JlQ29udGV4dCkge1xuICAgIHRoaXMubG9nID0gY29yZUNvbnRleHQubG9nZ2VyLmdldCgncGx1Z2lucy1zZXJ2aWNlJyk7XG4gICAgdGhpcy5wbHVnaW5zU3lzdGVtID0gbmV3IFBsdWdpbnNTeXN0ZW0oY29yZUNvbnRleHQpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0YXJ0KCkge1xuICAgIHRoaXMubG9nLmRlYnVnKCdTdGFydGluZyBwbHVnaW5zIHNlcnZpY2UnKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuY29yZUNvbnRleHQuY29uZmlnU2VydmljZVxuICAgICAgLmF0UGF0aCgncGx1Z2lucycsIFBsdWdpbnNDb25maWcpXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnRvUHJvbWlzZSgpO1xuXG4gICAgY29uc3QgeyBlcnJvciQsIHBsdWdpbiQgfSA9IGRpc2NvdmVyKGNvbmZpZywgdGhpcy5jb3JlQ29udGV4dCk7XG4gICAgYXdhaXQgdGhpcy5oYW5kbGVEaXNjb3ZlcnlFcnJvcnMoZXJyb3IkKTtcbiAgICBhd2FpdCB0aGlzLmhhbmRsZURpc2NvdmVyZWRQbHVnaW5zKHBsdWdpbiQpO1xuXG4gICAgaWYgKCFjb25maWcuaW5pdGlhbGl6ZSB8fCB0aGlzLmNvcmVDb250ZXh0LmVudi5pc0RldkNsdXN0ZXJNYXN0ZXIpIHtcbiAgICAgIHRoaXMubG9nLmluZm8oJ1BsdWdpbiBpbml0aWFsaXphdGlvbiBkaXNhYmxlZC4nKTtcbiAgICAgIHJldHVybiBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucGx1Z2luc1N5c3RlbS5zdGFydFBsdWdpbnMoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdG9wKCkge1xuICAgIHRoaXMubG9nLmRlYnVnKCdTdG9wcGluZyBwbHVnaW5zIHNlcnZpY2UnKTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbnNTeXN0ZW0uc3RvcFBsdWdpbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlRGlzY292ZXJ5RXJyb3JzKGVycm9yJDogT2JzZXJ2YWJsZTxQbHVnaW5EaXNjb3ZlcnlFcnJvcj4pIHtcbiAgICAvLyBBdCB0aGlzIHN0YWdlIHdlIHJlcG9ydCBvbmx5IGVycm9ycyB0aGF0IGNhbiBvY2N1ciB3aGVuIG5ldyBwbGF0Zm9ybSBwbHVnaW5cbiAgICAvLyBtYW5pZmVzdCBpcyBwcmVzZW50LCBvdGhlcndpc2Ugd2UgY2FuJ3QgYmUgc3VyZSB0aGF0IHRoZSBwbHVnaW4gaXMgZm9yIHRoZSBuZXdcbiAgICAvLyBwbGF0Zm9ybSBhbmQgbGV0IGxlZ2FjeSBwbGF0Zm9ybSB0byBoYW5kbGUgaXQuXG4gICAgY29uc3QgZXJyb3JUeXBlc1RvUmVwb3J0ID0gW1xuICAgICAgUGx1Z2luRGlzY292ZXJ5RXJyb3JUeXBlLkluY29tcGF0aWJsZVZlcnNpb24sXG4gICAgICBQbHVnaW5EaXNjb3ZlcnlFcnJvclR5cGUuSW52YWxpZE1hbmlmZXN0LFxuICAgIF07XG5cbiAgICBjb25zdCBlcnJvcnMgPSBhd2FpdCBlcnJvciRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXJyb3IgPT4gZXJyb3JUeXBlc1RvUmVwb3J0LmluY2x1ZGVzKGVycm9yLnR5cGUpKSxcbiAgICAgICAgdGFwKHBsdWdpbkVycm9yID0+IHRoaXMubG9nLmVycm9yKHBsdWdpbkVycm9yKSksXG4gICAgICAgIHRvQXJyYXkoKVxuICAgICAgKVxuICAgICAgLnRvUHJvbWlzZSgpO1xuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRmFpbGVkIHRvIGluaXRpYWxpemUgcGx1Z2luczoke2Vycm9ycy5tYXAoZXJyID0+IGBcXG5cXHQke2Vyci5tZXNzYWdlfWApLmpvaW4oJycpfWBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVEaXNjb3ZlcmVkUGx1Z2lucyhwbHVnaW4kOiBPYnNlcnZhYmxlPFBsdWdpbj4pIHtcbiAgICBjb25zdCBwbHVnaW5FbmFibGVTdGF0dXNlcyA9IG5ldyBNYXA8UGx1Z2luTmFtZSwgeyBwbHVnaW46IFBsdWdpbjsgaXNFbmFibGVkOiBib29sZWFuIH0+KCk7XG4gICAgYXdhaXQgcGx1Z2luJFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKGFzeW5jIHBsdWdpbiA9PiB7XG4gICAgICAgICAgY29uc3QgaXNFbmFibGVkID0gYXdhaXQgdGhpcy5jb3JlQ29udGV4dC5jb25maWdTZXJ2aWNlLmlzRW5hYmxlZEF0UGF0aChwbHVnaW4uY29uZmlnUGF0aCk7XG5cbiAgICAgICAgICBpZiAocGx1Z2luRW5hYmxlU3RhdHVzZXMuaGFzKHBsdWdpbi5uYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQbHVnaW4gd2l0aCBpZCBcIiR7cGx1Z2luLm5hbWV9XCIgaXMgYWxyZWFkeSByZWdpc3RlcmVkIWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBsdWdpbkVuYWJsZVN0YXR1c2VzLnNldChwbHVnaW4ubmFtZSwge1xuICAgICAgICAgICAgcGx1Z2luLFxuICAgICAgICAgICAgaXNFbmFibGVkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnRvUHJvbWlzZSgpO1xuXG4gICAgZm9yIChjb25zdCBbcGx1Z2luTmFtZSwgeyBwbHVnaW4sIGlzRW5hYmxlZCB9XSBvZiBwbHVnaW5FbmFibGVTdGF0dXNlcykge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkRW5hYmxlUGx1Z2luKHBsdWdpbk5hbWUsIHBsdWdpbkVuYWJsZVN0YXR1c2VzKSkge1xuICAgICAgICB0aGlzLnBsdWdpbnNTeXN0ZW0uYWRkUGx1Z2luKHBsdWdpbik7XG4gICAgICB9IGVsc2UgaWYgKGlzRW5hYmxlZCkge1xuICAgICAgICB0aGlzLmxvZy5pbmZvKFxuICAgICAgICAgIGBQbHVnaW4gXCIke3BsdWdpbk5hbWV9XCIgaGFzIGJlZW4gZGlzYWJsZWQgc2luY2Ugc29tZSBvZiBpdHMgZGlyZWN0IG9yIHRyYW5zaXRpdmUgZGVwZW5kZW5jaWVzIGFyZSBtaXNzaW5nIG9yIGRpc2FibGVkLmBcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9nLmluZm8oYFBsdWdpbiBcIiR7cGx1Z2luTmFtZX1cIiBpcyBkaXNhYmxlZC5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmxvZy5kZWJ1ZyhgRGlzY292ZXJlZCAke3BsdWdpbkVuYWJsZVN0YXR1c2VzLnNpemV9IHBsdWdpbnMuYCk7XG4gIH1cblxuICBwcml2YXRlIHNob3VsZEVuYWJsZVBsdWdpbihcbiAgICBwbHVnaW5OYW1lOiBQbHVnaW5OYW1lLFxuICAgIHBsdWdpbkVuYWJsZVN0YXR1c2VzOiBNYXA8UGx1Z2luTmFtZSwgeyBwbHVnaW46IFBsdWdpbjsgaXNFbmFibGVkOiBib29sZWFuIH0+XG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBsdWdpbkluZm8gPSBwbHVnaW5FbmFibGVTdGF0dXNlcy5nZXQocGx1Z2luTmFtZSk7XG4gICAgcmV0dXJuIChcbiAgICAgIHBsdWdpbkluZm8gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgcGx1Z2luSW5mby5pc0VuYWJsZWQgJiZcbiAgICAgIHBsdWdpbkluZm8ucGx1Z2luLnJlcXVpcmVkRGVwZW5kZW5jaWVzLmV2ZXJ5KGRlcGVuZGVuY3lOYW1lID0+XG4gICAgICAgIHRoaXMuc2hvdWxkRW5hYmxlUGx1Z2luKGRlcGVuZGVuY3lOYW1lLCBwbHVnaW5FbmFibGVTdGF0dXNlcylcbiAgICAgIClcbiAgICApO1xuICB9XG59XG4iXX0=