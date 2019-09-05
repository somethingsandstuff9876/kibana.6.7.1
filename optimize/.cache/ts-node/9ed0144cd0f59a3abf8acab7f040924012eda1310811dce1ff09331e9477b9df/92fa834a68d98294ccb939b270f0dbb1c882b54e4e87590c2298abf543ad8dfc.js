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
/**
 * This returns a facade for `CoreContext` that will be exposed to the plugin initializer.
 * This facade should be safe to use across entire plugin lifespan.
 *
 * This is called for each plugin when it's created, so each plugin gets its own
 * version of these values.
 *
 * We should aim to be restrictive and specific in the APIs that we expose.
 *
 * @param coreContext Kibana core context
 * @param pluginManifest The manifest of the plugin we're building these values for.
 * @internal
 */
function createPluginInitializerContext(coreContext, pluginManifest) {
    return {
        /**
         * Environment information that is safe to expose to plugins and may be beneficial for them.
         */
        env: { mode: coreContext.env.mode },
        /**
         * Plugin-scoped logger
         */
        logger: {
            get(...contextParts) {
                return coreContext.logger.get('plugins', pluginManifest.id, ...contextParts);
            },
        },
        /**
         * Core configuration functionality, enables fetching a subset of the config.
         */
        config: {
            /**
             * Reads the subset of the config at the `configPath` defined in the plugin
             * manifest and validates it against the schema in the static `schema` on
             * the given `ConfigClass`.
             * @param ConfigClass A class (not an instance of a class) that contains a
             * static `schema` that we validate the config at the given `path` against.
             */
            create(ConfigClass) {
                return coreContext.configService.atPath(pluginManifest.configPath, ConfigClass);
            },
            createIfExists(ConfigClass) {
                return coreContext.configService.optionalAtPath(pluginManifest.configPath, ConfigClass);
            },
        },
    };
}
exports.createPluginInitializerContext = createPluginInitializerContext;
/**
 * This returns a facade for `CoreContext` that will be exposed to the plugin `start` method.
 * This facade should be safe to use only within `start` itself.
 *
 * This is called for each plugin when it's started, so each plugin gets its own
 * version of these values.
 *
 * We should aim to be restrictive and specific in the APIs that we expose.
 *
 * @param coreContext Kibana core context
 * @param plugin The plugin we're building these values for.
 * @internal
 */
function createPluginStartContext(coreContext, plugin) {
    return {};
}
exports.createPluginStartContext = createPluginStartContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL3BsdWdpbnMvcGx1Z2luX2NvbnRleHQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9wbHVnaW5zL3BsdWdpbl9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBeUJIOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILFNBQWdCLDhCQUE4QixDQUM1QyxXQUF3QixFQUN4QixjQUE4QjtJQUU5QixPQUFPO1FBQ0w7O1dBRUc7UUFDSCxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7UUFFbkM7O1dBRUc7UUFDSCxNQUFNLEVBQUU7WUFDTixHQUFHLENBQUMsR0FBRyxZQUFZO2dCQUNqQixPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBRSxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDL0UsQ0FBQztTQUNGO1FBRUQ7O1dBRUc7UUFDSCxNQUFNLEVBQUU7WUFDTjs7Ozs7O2VBTUc7WUFDSCxNQUFNLENBQUMsV0FBVztnQkFDaEIsT0FBTyxXQUFXLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ2xGLENBQUM7WUFDRCxjQUFjLENBQUMsV0FBVztnQkFDeEIsT0FBTyxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFGLENBQUM7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBdENELHdFQXNDQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILFNBQWdCLHdCQUF3QixDQUN0QyxXQUF3QixFQUN4QixNQUFvRDtJQUVwRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFMRCw0REFLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSAnQGtibi9jb25maWctc2NoZW1hJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENvcmVDb250ZXh0IH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgQ29uZmlnV2l0aFNjaGVtYSwgRW52aXJvbm1lbnRNb2RlIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuLi9sb2dnaW5nJztcbmltcG9ydCB7IFBsdWdpbiwgUGx1Z2luTWFuaWZlc3QgfSBmcm9tICcuL3BsdWdpbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGx1Z2luSW5pdGlhbGl6ZXJDb250ZXh0IHtcbiAgZW52OiB7IG1vZGU6IEVudmlyb25tZW50TW9kZSB9O1xuICBsb2dnZXI6IExvZ2dlckZhY3Rvcnk7XG4gIGNvbmZpZzoge1xuICAgIGNyZWF0ZTogPFNjaGVtYSBleHRlbmRzIFR5cGU8YW55PiwgQ29uZmlnPihcbiAgICAgIENvbmZpZ0NsYXNzOiBDb25maWdXaXRoU2NoZW1hPFNjaGVtYSwgQ29uZmlnPlxuICAgICkgPT4gT2JzZXJ2YWJsZTxDb25maWc+O1xuICAgIGNyZWF0ZUlmRXhpc3RzOiA8U2NoZW1hIGV4dGVuZHMgVHlwZTxhbnk+LCBDb25maWc+KFxuICAgICAgQ29uZmlnQ2xhc3M6IENvbmZpZ1dpdGhTY2hlbWE8U2NoZW1hLCBDb25maWc+XG4gICAgKSA9PiBPYnNlcnZhYmxlPENvbmZpZyB8IHVuZGVmaW5lZD47XG4gIH07XG59XG5cbi8vIHRzbGludDpkaXNhYmxlIG5vLWVtcHR5LWludGVyZmFjZVxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5TdGFydENvbnRleHQge31cblxuLyoqXG4gKiBUaGlzIHJldHVybnMgYSBmYWNhZGUgZm9yIGBDb3JlQ29udGV4dGAgdGhhdCB3aWxsIGJlIGV4cG9zZWQgdG8gdGhlIHBsdWdpbiBpbml0aWFsaXplci5cbiAqIFRoaXMgZmFjYWRlIHNob3VsZCBiZSBzYWZlIHRvIHVzZSBhY3Jvc3MgZW50aXJlIHBsdWdpbiBsaWZlc3Bhbi5cbiAqXG4gKiBUaGlzIGlzIGNhbGxlZCBmb3IgZWFjaCBwbHVnaW4gd2hlbiBpdCdzIGNyZWF0ZWQsIHNvIGVhY2ggcGx1Z2luIGdldHMgaXRzIG93blxuICogdmVyc2lvbiBvZiB0aGVzZSB2YWx1ZXMuXG4gKlxuICogV2Ugc2hvdWxkIGFpbSB0byBiZSByZXN0cmljdGl2ZSBhbmQgc3BlY2lmaWMgaW4gdGhlIEFQSXMgdGhhdCB3ZSBleHBvc2UuXG4gKlxuICogQHBhcmFtIGNvcmVDb250ZXh0IEtpYmFuYSBjb3JlIGNvbnRleHRcbiAqIEBwYXJhbSBwbHVnaW5NYW5pZmVzdCBUaGUgbWFuaWZlc3Qgb2YgdGhlIHBsdWdpbiB3ZSdyZSBidWlsZGluZyB0aGVzZSB2YWx1ZXMgZm9yLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQbHVnaW5Jbml0aWFsaXplckNvbnRleHQoXG4gIGNvcmVDb250ZXh0OiBDb3JlQ29udGV4dCxcbiAgcGx1Z2luTWFuaWZlc3Q6IFBsdWdpbk1hbmlmZXN0XG4pOiBQbHVnaW5Jbml0aWFsaXplckNvbnRleHQge1xuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIEVudmlyb25tZW50IGluZm9ybWF0aW9uIHRoYXQgaXMgc2FmZSB0byBleHBvc2UgdG8gcGx1Z2lucyBhbmQgbWF5IGJlIGJlbmVmaWNpYWwgZm9yIHRoZW0uXG4gICAgICovXG4gICAgZW52OiB7IG1vZGU6IGNvcmVDb250ZXh0LmVudi5tb2RlIH0sXG5cbiAgICAvKipcbiAgICAgKiBQbHVnaW4tc2NvcGVkIGxvZ2dlclxuICAgICAqL1xuICAgIGxvZ2dlcjoge1xuICAgICAgZ2V0KC4uLmNvbnRleHRQYXJ0cykge1xuICAgICAgICByZXR1cm4gY29yZUNvbnRleHQubG9nZ2VyLmdldCgncGx1Z2lucycsIHBsdWdpbk1hbmlmZXN0LmlkLCAuLi5jb250ZXh0UGFydHMpO1xuICAgICAgfSxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29yZSBjb25maWd1cmF0aW9uIGZ1bmN0aW9uYWxpdHksIGVuYWJsZXMgZmV0Y2hpbmcgYSBzdWJzZXQgb2YgdGhlIGNvbmZpZy5cbiAgICAgKi9cbiAgICBjb25maWc6IHtcbiAgICAgIC8qKlxuICAgICAgICogUmVhZHMgdGhlIHN1YnNldCBvZiB0aGUgY29uZmlnIGF0IHRoZSBgY29uZmlnUGF0aGAgZGVmaW5lZCBpbiB0aGUgcGx1Z2luXG4gICAgICAgKiBtYW5pZmVzdCBhbmQgdmFsaWRhdGVzIGl0IGFnYWluc3QgdGhlIHNjaGVtYSBpbiB0aGUgc3RhdGljIGBzY2hlbWFgIG9uXG4gICAgICAgKiB0aGUgZ2l2ZW4gYENvbmZpZ0NsYXNzYC5cbiAgICAgICAqIEBwYXJhbSBDb25maWdDbGFzcyBBIGNsYXNzIChub3QgYW4gaW5zdGFuY2Ugb2YgYSBjbGFzcykgdGhhdCBjb250YWlucyBhXG4gICAgICAgKiBzdGF0aWMgYHNjaGVtYWAgdGhhdCB3ZSB2YWxpZGF0ZSB0aGUgY29uZmlnIGF0IHRoZSBnaXZlbiBgcGF0aGAgYWdhaW5zdC5cbiAgICAgICAqL1xuICAgICAgY3JlYXRlKENvbmZpZ0NsYXNzKSB7XG4gICAgICAgIHJldHVybiBjb3JlQ29udGV4dC5jb25maWdTZXJ2aWNlLmF0UGF0aChwbHVnaW5NYW5pZmVzdC5jb25maWdQYXRoLCBDb25maWdDbGFzcyk7XG4gICAgICB9LFxuICAgICAgY3JlYXRlSWZFeGlzdHMoQ29uZmlnQ2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIGNvcmVDb250ZXh0LmNvbmZpZ1NlcnZpY2Uub3B0aW9uYWxBdFBhdGgocGx1Z2luTWFuaWZlc3QuY29uZmlnUGF0aCwgQ29uZmlnQ2xhc3MpO1xuICAgICAgfSxcbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgcmV0dXJucyBhIGZhY2FkZSBmb3IgYENvcmVDb250ZXh0YCB0aGF0IHdpbGwgYmUgZXhwb3NlZCB0byB0aGUgcGx1Z2luIGBzdGFydGAgbWV0aG9kLlxuICogVGhpcyBmYWNhZGUgc2hvdWxkIGJlIHNhZmUgdG8gdXNlIG9ubHkgd2l0aGluIGBzdGFydGAgaXRzZWxmLlxuICpcbiAqIFRoaXMgaXMgY2FsbGVkIGZvciBlYWNoIHBsdWdpbiB3aGVuIGl0J3Mgc3RhcnRlZCwgc28gZWFjaCBwbHVnaW4gZ2V0cyBpdHMgb3duXG4gKiB2ZXJzaW9uIG9mIHRoZXNlIHZhbHVlcy5cbiAqXG4gKiBXZSBzaG91bGQgYWltIHRvIGJlIHJlc3RyaWN0aXZlIGFuZCBzcGVjaWZpYyBpbiB0aGUgQVBJcyB0aGF0IHdlIGV4cG9zZS5cbiAqXG4gKiBAcGFyYW0gY29yZUNvbnRleHQgS2liYW5hIGNvcmUgY29udGV4dFxuICogQHBhcmFtIHBsdWdpbiBUaGUgcGx1Z2luIHdlJ3JlIGJ1aWxkaW5nIHRoZXNlIHZhbHVlcyBmb3IuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBsdWdpblN0YXJ0Q29udGV4dDxUUGx1Z2luQ29udHJhY3QsIFRQbHVnaW5EZXBlbmRlbmNpZXM+KFxuICBjb3JlQ29udGV4dDogQ29yZUNvbnRleHQsXG4gIHBsdWdpbjogUGx1Z2luPFRQbHVnaW5Db250cmFjdCwgVFBsdWdpbkRlcGVuZGVuY2llcz5cbik6IFBsdWdpblN0YXJ0Q29udGV4dCB7XG4gIHJldHVybiB7fTtcbn1cbiJdfQ==