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
const plugin_context_1 = require("./plugin_context");
/** @internal */
class PluginsSystem {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.plugins = new Map();
        this.startedPlugins = [];
        this.log = coreContext.logger.get('plugins-system');
    }
    addPlugin(plugin) {
        this.plugins.set(plugin.name, plugin);
    }
    async startPlugins() {
        const exposedValues = new Map();
        if (this.plugins.size === 0) {
            return exposedValues;
        }
        const sortedPlugins = this.getTopologicallySortedPluginNames();
        this.log.info(`Starting [${this.plugins.size}] plugins: [${[...sortedPlugins]}]`);
        for (const pluginName of sortedPlugins) {
            const plugin = this.plugins.get(pluginName);
            if (!plugin.includesServerPlugin) {
                continue;
            }
            this.log.debug(`Starting plugin "${pluginName}"...`);
            const exposedDependencyValues = [
                ...plugin.requiredDependencies,
                ...plugin.optionalDependencies,
            ].reduce((dependencies, dependencyName) => {
                dependencies[dependencyName] = exposedValues.get(dependencyName);
                return dependencies;
            }, {});
            exposedValues.set(pluginName, await plugin.start(plugin_context_1.createPluginStartContext(this.coreContext, plugin), exposedDependencyValues));
            this.startedPlugins.push(pluginName);
        }
        return exposedValues;
    }
    async stopPlugins() {
        if (this.plugins.size === 0 || this.startedPlugins.length === 0) {
            return;
        }
        this.log.info(`Stopping all plugins.`);
        // Stop plugins in the reverse order of when they were started.
        while (this.startedPlugins.length > 0) {
            const pluginName = this.startedPlugins.pop();
            this.log.debug(`Stopping plugin "${pluginName}"...`);
            await this.plugins.get(pluginName).stop();
        }
    }
    /**
     * Gets topologically sorted plugin names that are registered with the plugin system.
     * Ordering is possible if and only if the plugins graph has no directed cycles,
     * that is, if it is a directed acyclic graph (DAG). If plugins cannot be ordered
     * an error is thrown.
     *
     * Uses Kahn's Algorithm to sort the graph.
     */
    getTopologicallySortedPluginNames() {
        // We clone plugins so we can remove handled nodes while we perform the
        // topological ordering. If the cloned graph is _not_ empty at the end, we
        // know we were not able to topologically order the graph. We exclude optional
        // dependencies that are not present in the plugins graph.
        const pluginsDependenciesGraph = new Map([...this.plugins.entries()].map(([pluginName, plugin]) => {
            return [
                pluginName,
                new Set([
                    ...plugin.requiredDependencies,
                    ...plugin.optionalDependencies.filter(dependency => this.plugins.has(dependency)),
                ]),
            ];
        }));
        // First, find a list of "start nodes" which have no outgoing edges. At least
        // one such node must exist in a non-empty acyclic graph.
        const pluginsWithAllDependenciesSorted = [...pluginsDependenciesGraph.keys()].filter(pluginName => pluginsDependenciesGraph.get(pluginName).size === 0);
        const sortedPluginNames = new Set();
        while (pluginsWithAllDependenciesSorted.length > 0) {
            const sortedPluginName = pluginsWithAllDependenciesSorted.pop();
            // We know this plugin has all its dependencies sorted, so we can remove it
            // and include into the final result.
            pluginsDependenciesGraph.delete(sortedPluginName);
            sortedPluginNames.add(sortedPluginName);
            // Go through the rest of the plugins and remove `sortedPluginName` from their
            // unsorted dependencies.
            for (const [pluginName, dependencies] of pluginsDependenciesGraph) {
                // If we managed delete `sortedPluginName` from dependencies let's check
                // whether it was the last one and we can mark plugin as sorted.
                if (dependencies.delete(sortedPluginName) && dependencies.size === 0) {
                    pluginsWithAllDependenciesSorted.push(pluginName);
                }
            }
        }
        if (pluginsDependenciesGraph.size > 0) {
            const edgesLeft = JSON.stringify([...pluginsDependenciesGraph.entries()]);
            throw new Error(`Topological ordering of plugins did not complete, these edges could not be ordered: ${edgesLeft}`);
        }
        return sortedPluginNames;
    }
}
exports.PluginsSystem = PluginsSystem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL3BsdWdpbnMvcGx1Z2luc19zeXN0ZW0udHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9wbHVnaW5zL3BsdWdpbnNfc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBS0gscURBQTREO0FBRTVELGdCQUFnQjtBQUNoQixNQUFhLGFBQWE7SUFLeEIsWUFBNkIsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFKcEMsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1FBRXhDLG1CQUFjLEdBQWlCLEVBQUUsQ0FBQztRQUdqRCxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLFNBQVMsQ0FBQyxNQUFjO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZO1FBQ3ZCLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1FBQ3JELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQzNCLE9BQU8sYUFBYSxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksZUFBZSxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWxGLEtBQUssTUFBTSxVQUFVLElBQUks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Z0NBQWdDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsRCxNQUFNLGdCQUFnQixHQUFHLGdDQUFnQyxDQUFDLEdBQUcsRUFBRyxDQUFDO1lBRWpFLDJFQUEyRTtZQUMzRSxxQ0FBcUM7WUFDckMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbEQsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEMsOEVBQThFO1lBQzlFLHlCQUF5QjtZQUN6QixLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksd0JBQXdCLEVBQUU7Z0JBQ2pFLHdFQUF3RTtnQkFDeEUsZ0VBQWdFO2dCQUNoRSxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtvQkFDcEUsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNuRDthQUNGO1NBQ0Y7UUFFRCxJQUFJLHdCQUF3QixDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsd0JBQXdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sSUFBSSxLQUFLLENBQ2IsdUZBQXVGLFNBQVMsRUFBRSxDQUNuRyxDQUFDO1NBQ0g7UUFFRCxPQUFPLGlCQUFpQixDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQW5JRCxzQ0FtSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29yZUNvbnRleHQgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi9sb2dnaW5nJztcbmltcG9ydCB7IFBsdWdpbiwgUGx1Z2luTmFtZSB9IGZyb20gJy4vcGx1Z2luJztcbmltcG9ydCB7IGNyZWF0ZVBsdWdpblN0YXJ0Q29udGV4dCB9IGZyb20gJy4vcGx1Z2luX2NvbnRleHQnO1xuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgY2xhc3MgUGx1Z2luc1N5c3RlbSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGx1Z2lucyA9IG5ldyBNYXA8UGx1Z2luTmFtZSwgUGx1Z2luPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGxvZzogTG9nZ2VyO1xuICBwcml2YXRlIHJlYWRvbmx5IHN0YXJ0ZWRQbHVnaW5zOiBQbHVnaW5OYW1lW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvcmVDb250ZXh0OiBDb3JlQ29udGV4dCkge1xuICAgIHRoaXMubG9nID0gY29yZUNvbnRleHQubG9nZ2VyLmdldCgncGx1Z2lucy1zeXN0ZW0nKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRQbHVnaW4ocGx1Z2luOiBQbHVnaW4pIHtcbiAgICB0aGlzLnBsdWdpbnMuc2V0KHBsdWdpbi5uYW1lLCBwbHVnaW4pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0YXJ0UGx1Z2lucygpIHtcbiAgICBjb25zdCBleHBvc2VkVmFsdWVzID0gbmV3IE1hcDxQbHVnaW5OYW1lLCB1bmtub3duPigpO1xuICAgIGlmICh0aGlzLnBsdWdpbnMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGV4cG9zZWRWYWx1ZXM7XG4gICAgfVxuXG4gICAgY29uc3Qgc29ydGVkUGx1Z2lucyA9IHRoaXMuZ2V0VG9wb2xvZ2ljYWxseVNvcnRlZFBsdWdpbk5hbWVzKCk7XG4gICAgdGhpcy5sb2cuaW5mbyhgU3RhcnRpbmcgWyR7dGhpcy5wbHVnaW5zLnNpemV9XSBwbHVnaW5zOiBbJHtbLi4uc29ydGVkUGx1Z2luc119XWApO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5OYW1lIG9mIHNvcnRlZFBsdWdpbnMpIHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2lucy5nZXQocGx1Z2luTmFtZSkhO1xuICAgICAgaWYgKCFwbHVnaW4uaW5jbHVkZXNTZXJ2ZXJQbHVnaW4pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nLmRlYnVnKGBTdGFydGluZyBwbHVnaW4gXCIke3BsdWdpbk5hbWV9XCIuLi5gKTtcblxuICAgICAgY29uc3QgZXhwb3NlZERlcGVuZGVuY3lWYWx1ZXMgPSBbXG4gICAgICAgIC4uLnBsdWdpbi5yZXF1aXJlZERlcGVuZGVuY2llcyxcbiAgICAgICAgLi4ucGx1Z2luLm9wdGlvbmFsRGVwZW5kZW5jaWVzLFxuICAgICAgXS5yZWR1Y2UoXG4gICAgICAgIChkZXBlbmRlbmNpZXMsIGRlcGVuZGVuY3lOYW1lKSA9PiB7XG4gICAgICAgICAgZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lOYW1lXSA9IGV4cG9zZWRWYWx1ZXMuZ2V0KGRlcGVuZGVuY3lOYW1lKTtcbiAgICAgICAgICByZXR1cm4gZGVwZW5kZW5jaWVzO1xuICAgICAgICB9LFxuICAgICAgICB7fSBhcyBSZWNvcmQ8UGx1Z2luTmFtZSwgdW5rbm93bj5cbiAgICAgICk7XG5cbiAgICAgIGV4cG9zZWRWYWx1ZXMuc2V0KFxuICAgICAgICBwbHVnaW5OYW1lLFxuICAgICAgICBhd2FpdCBwbHVnaW4uc3RhcnQoXG4gICAgICAgICAgY3JlYXRlUGx1Z2luU3RhcnRDb250ZXh0KHRoaXMuY29yZUNvbnRleHQsIHBsdWdpbiksXG4gICAgICAgICAgZXhwb3NlZERlcGVuZGVuY3lWYWx1ZXNcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5zdGFydGVkUGx1Z2lucy5wdXNoKHBsdWdpbk5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBleHBvc2VkVmFsdWVzO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0b3BQbHVnaW5zKCkge1xuICAgIGlmICh0aGlzLnBsdWdpbnMuc2l6ZSA9PT0gMCB8fCB0aGlzLnN0YXJ0ZWRQbHVnaW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubG9nLmluZm8oYFN0b3BwaW5nIGFsbCBwbHVnaW5zLmApO1xuXG4gICAgLy8gU3RvcCBwbHVnaW5zIGluIHRoZSByZXZlcnNlIG9yZGVyIG9mIHdoZW4gdGhleSB3ZXJlIHN0YXJ0ZWQuXG4gICAgd2hpbGUgKHRoaXMuc3RhcnRlZFBsdWdpbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcGx1Z2luTmFtZSA9IHRoaXMuc3RhcnRlZFBsdWdpbnMucG9wKCkhO1xuXG4gICAgICB0aGlzLmxvZy5kZWJ1ZyhgU3RvcHBpbmcgcGx1Z2luIFwiJHtwbHVnaW5OYW1lfVwiLi4uYCk7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbnMuZ2V0KHBsdWdpbk5hbWUpIS5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdG9wb2xvZ2ljYWxseSBzb3J0ZWQgcGx1Z2luIG5hbWVzIHRoYXQgYXJlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgcGx1Z2luIHN5c3RlbS5cbiAgICogT3JkZXJpbmcgaXMgcG9zc2libGUgaWYgYW5kIG9ubHkgaWYgdGhlIHBsdWdpbnMgZ3JhcGggaGFzIG5vIGRpcmVjdGVkIGN5Y2xlcyxcbiAgICogdGhhdCBpcywgaWYgaXQgaXMgYSBkaXJlY3RlZCBhY3ljbGljIGdyYXBoIChEQUcpLiBJZiBwbHVnaW5zIGNhbm5vdCBiZSBvcmRlcmVkXG4gICAqIGFuIGVycm9yIGlzIHRocm93bi5cbiAgICpcbiAgICogVXNlcyBLYWhuJ3MgQWxnb3JpdGhtIHRvIHNvcnQgdGhlIGdyYXBoLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRUb3BvbG9naWNhbGx5U29ydGVkUGx1Z2luTmFtZXMoKSB7XG4gICAgLy8gV2UgY2xvbmUgcGx1Z2lucyBzbyB3ZSBjYW4gcmVtb3ZlIGhhbmRsZWQgbm9kZXMgd2hpbGUgd2UgcGVyZm9ybSB0aGVcbiAgICAvLyB0b3BvbG9naWNhbCBvcmRlcmluZy4gSWYgdGhlIGNsb25lZCBncmFwaCBpcyBfbm90XyBlbXB0eSBhdCB0aGUgZW5kLCB3ZVxuICAgIC8vIGtub3cgd2Ugd2VyZSBub3QgYWJsZSB0byB0b3BvbG9naWNhbGx5IG9yZGVyIHRoZSBncmFwaC4gV2UgZXhjbHVkZSBvcHRpb25hbFxuICAgIC8vIGRlcGVuZGVuY2llcyB0aGF0IGFyZSBub3QgcHJlc2VudCBpbiB0aGUgcGx1Z2lucyBncmFwaC5cbiAgICBjb25zdCBwbHVnaW5zRGVwZW5kZW5jaWVzR3JhcGggPSBuZXcgTWFwKFxuICAgICAgWy4uLnRoaXMucGx1Z2lucy5lbnRyaWVzKCldLm1hcCgoW3BsdWdpbk5hbWUsIHBsdWdpbl0pID0+IHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBwbHVnaW5OYW1lLFxuICAgICAgICAgIG5ldyBTZXQoW1xuICAgICAgICAgICAgLi4ucGx1Z2luLnJlcXVpcmVkRGVwZW5kZW5jaWVzLFxuICAgICAgICAgICAgLi4ucGx1Z2luLm9wdGlvbmFsRGVwZW5kZW5jaWVzLmZpbHRlcihkZXBlbmRlbmN5ID0+IHRoaXMucGx1Z2lucy5oYXMoZGVwZW5kZW5jeSkpLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdIGFzIFtQbHVnaW5OYW1lLCBTZXQ8UGx1Z2luTmFtZT5dO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gRmlyc3QsIGZpbmQgYSBsaXN0IG9mIFwic3RhcnQgbm9kZXNcIiB3aGljaCBoYXZlIG5vIG91dGdvaW5nIGVkZ2VzLiBBdCBsZWFzdFxuICAgIC8vIG9uZSBzdWNoIG5vZGUgbXVzdCBleGlzdCBpbiBhIG5vbi1lbXB0eSBhY3ljbGljIGdyYXBoLlxuICAgIGNvbnN0IHBsdWdpbnNXaXRoQWxsRGVwZW5kZW5jaWVzU29ydGVkID0gWy4uLnBsdWdpbnNEZXBlbmRlbmNpZXNHcmFwaC5rZXlzKCldLmZpbHRlcihcbiAgICAgIHBsdWdpbk5hbWUgPT4gcGx1Z2luc0RlcGVuZGVuY2llc0dyYXBoLmdldChwbHVnaW5OYW1lKSEuc2l6ZSA9PT0gMFxuICAgICk7XG5cbiAgICBjb25zdCBzb3J0ZWRQbHVnaW5OYW1lcyA9IG5ldyBTZXQ8UGx1Z2luTmFtZT4oKTtcbiAgICB3aGlsZSAocGx1Z2luc1dpdGhBbGxEZXBlbmRlbmNpZXNTb3J0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc29ydGVkUGx1Z2luTmFtZSA9IHBsdWdpbnNXaXRoQWxsRGVwZW5kZW5jaWVzU29ydGVkLnBvcCgpITtcblxuICAgICAgLy8gV2Uga25vdyB0aGlzIHBsdWdpbiBoYXMgYWxsIGl0cyBkZXBlbmRlbmNpZXMgc29ydGVkLCBzbyB3ZSBjYW4gcmVtb3ZlIGl0XG4gICAgICAvLyBhbmQgaW5jbHVkZSBpbnRvIHRoZSBmaW5hbCByZXN1bHQuXG4gICAgICBwbHVnaW5zRGVwZW5kZW5jaWVzR3JhcGguZGVsZXRlKHNvcnRlZFBsdWdpbk5hbWUpO1xuICAgICAgc29ydGVkUGx1Z2luTmFtZXMuYWRkKHNvcnRlZFBsdWdpbk5hbWUpO1xuXG4gICAgICAvLyBHbyB0aHJvdWdoIHRoZSByZXN0IG9mIHRoZSBwbHVnaW5zIGFuZCByZW1vdmUgYHNvcnRlZFBsdWdpbk5hbWVgIGZyb20gdGhlaXJcbiAgICAgIC8vIHVuc29ydGVkIGRlcGVuZGVuY2llcy5cbiAgICAgIGZvciAoY29uc3QgW3BsdWdpbk5hbWUsIGRlcGVuZGVuY2llc10gb2YgcGx1Z2luc0RlcGVuZGVuY2llc0dyYXBoKSB7XG4gICAgICAgIC8vIElmIHdlIG1hbmFnZWQgZGVsZXRlIGBzb3J0ZWRQbHVnaW5OYW1lYCBmcm9tIGRlcGVuZGVuY2llcyBsZXQncyBjaGVja1xuICAgICAgICAvLyB3aGV0aGVyIGl0IHdhcyB0aGUgbGFzdCBvbmUgYW5kIHdlIGNhbiBtYXJrIHBsdWdpbiBhcyBzb3J0ZWQuXG4gICAgICAgIGlmIChkZXBlbmRlbmNpZXMuZGVsZXRlKHNvcnRlZFBsdWdpbk5hbWUpICYmIGRlcGVuZGVuY2llcy5zaXplID09PSAwKSB7XG4gICAgICAgICAgcGx1Z2luc1dpdGhBbGxEZXBlbmRlbmNpZXNTb3J0ZWQucHVzaChwbHVnaW5OYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwbHVnaW5zRGVwZW5kZW5jaWVzR3JhcGguc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IGVkZ2VzTGVmdCA9IEpTT04uc3RyaW5naWZ5KFsuLi5wbHVnaW5zRGVwZW5kZW5jaWVzR3JhcGguZW50cmllcygpXSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUb3BvbG9naWNhbCBvcmRlcmluZyBvZiBwbHVnaW5zIGRpZCBub3QgY29tcGxldGUsIHRoZXNlIGVkZ2VzIGNvdWxkIG5vdCBiZSBvcmRlcmVkOiAke2VkZ2VzTGVmdH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBzb3J0ZWRQbHVnaW5OYW1lcztcbiAgfVxufVxuIl19