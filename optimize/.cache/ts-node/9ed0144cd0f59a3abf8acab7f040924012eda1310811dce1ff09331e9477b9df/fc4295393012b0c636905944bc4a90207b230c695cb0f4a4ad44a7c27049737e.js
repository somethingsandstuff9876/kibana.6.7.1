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
const utils_1 = require("../../../utils");
const json_layout_1 = require("./json_layout");
const pattern_layout_1 = require("./pattern_layout");
const { oneOf } = config_schema_1.schema;
/** @internal */
class Layouts {
    /**
     * Factory method that creates specific `Layout` instances based on the passed `config` parameter.
     * @param config Configuration specific to a particular `Layout` implementation.
     * @returns Fully constructed `Layout` instance.
     */
    static create(config) {
        switch (config.kind) {
            case 'json':
                return new json_layout_1.JsonLayout();
            case 'pattern':
                return new pattern_layout_1.PatternLayout(config.pattern, config.highlight);
            default:
                return utils_1.assertNever(config);
        }
    }
}
Layouts.configSchema = oneOf([json_layout_1.JsonLayout.configSchema, pattern_layout_1.PatternLayout.configSchema]);
exports.Layouts = Layouts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbGF5b3V0cy9sYXlvdXRzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS9zZXJ2ZXIvbG9nZ2luZy9sYXlvdXRzL2xheW91dHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFFSCxzREFBNEM7QUFFNUMsMENBQTZDO0FBRTdDLCtDQUFpRTtBQUNqRSxxREFBMEU7QUFFMUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLHNCQUFNLENBQUM7QUFZekIsZ0JBQWdCO0FBQ2hCLE1BQWEsT0FBTztJQUdsQjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUF3QjtRQUMzQyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDbkIsS0FBSyxNQUFNO2dCQUNULE9BQU8sSUFBSSx3QkFBVSxFQUFFLENBQUM7WUFFMUIsS0FBSyxTQUFTO2dCQUNaLE9BQU8sSUFBSSw4QkFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTdEO2dCQUNFLE9BQU8sbUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7O0FBbEJhLG9CQUFZLEdBQUcsS0FBSyxDQUFDLENBQUMsd0JBQVUsQ0FBQyxZQUFZLEVBQUUsOEJBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBRDVGLDBCQW9CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBzY2hlbWEgfSBmcm9tICdAa2JuL2NvbmZpZy1zY2hlbWEnO1xuXG5pbXBvcnQgeyBhc3NlcnROZXZlciB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IExvZ1JlY29yZCB9IGZyb20gJy4uL2xvZ19yZWNvcmQnO1xuaW1wb3J0IHsgSnNvbkxheW91dCwgSnNvbkxheW91dENvbmZpZ1R5cGUgfSBmcm9tICcuL2pzb25fbGF5b3V0JztcbmltcG9ydCB7IFBhdHRlcm5MYXlvdXQsIFBhdHRlcm5MYXlvdXRDb25maWdUeXBlIH0gZnJvbSAnLi9wYXR0ZXJuX2xheW91dCc7XG5cbmNvbnN0IHsgb25lT2YgfSA9IHNjaGVtYTtcblxudHlwZSBMYXlvdXRDb25maWdUeXBlID0gUGF0dGVybkxheW91dENvbmZpZ1R5cGUgfCBKc29uTGF5b3V0Q29uZmlnVHlwZTtcblxuLyoqXG4gKiBFbnRpdHkgdGhhdCBjYW4gZm9ybWF0IGBMb2dSZWNvcmRgIGluc3RhbmNlIGludG8gYSBzdHJpbmcuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXlvdXQge1xuICBmb3JtYXQocmVjb3JkOiBMb2dSZWNvcmQpOiBzdHJpbmc7XG59XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBjbGFzcyBMYXlvdXRzIHtcbiAgcHVibGljIHN0YXRpYyBjb25maWdTY2hlbWEgPSBvbmVPZihbSnNvbkxheW91dC5jb25maWdTY2hlbWEsIFBhdHRlcm5MYXlvdXQuY29uZmlnU2NoZW1hXSk7XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBzcGVjaWZpYyBgTGF5b3V0YCBpbnN0YW5jZXMgYmFzZWQgb24gdGhlIHBhc3NlZCBgY29uZmlnYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlndXJhdGlvbiBzcGVjaWZpYyB0byBhIHBhcnRpY3VsYXIgYExheW91dGAgaW1wbGVtZW50YXRpb24uXG4gICAqIEByZXR1cm5zIEZ1bGx5IGNvbnN0cnVjdGVkIGBMYXlvdXRgIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcmVhdGUoY29uZmlnOiBMYXlvdXRDb25maWdUeXBlKTogTGF5b3V0IHtcbiAgICBzd2l0Y2ggKGNvbmZpZy5raW5kKSB7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uTGF5b3V0KCk7XG5cbiAgICAgIGNhc2UgJ3BhdHRlcm4nOlxuICAgICAgICByZXR1cm4gbmV3IFBhdHRlcm5MYXlvdXQoY29uZmlnLnBhdHRlcm4sIGNvbmZpZy5oaWdobGlnaHQpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gYXNzZXJ0TmV2ZXIoY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==