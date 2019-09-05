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
const layouts_1 = require("../../layouts/layouts");
const { literal, object } = config_schema_1.schema;
/**
 * Appender that formats all the `LogRecord` instances it receives and logs them via built-in `console`.
 * @internal
 */
class ConsoleAppender {
    /**
     * Creates ConsoleAppender instance.
     * @param layout Instance of `Layout` sub-class responsible for `LogRecord` formatting.
     */
    constructor(layout) {
        this.layout = layout;
    }
    /**
     * Formats specified `record` and logs it via built-in `console`.
     * @param record `LogRecord` instance to be logged.
     */
    append(record) {
        // tslint:disable no-console
        console.log(this.layout.format(record));
    }
    /**
     * Disposes `ConsoleAppender`.
     */
    dispose() {
        // noop
    }
}
ConsoleAppender.configSchema = object({
    kind: literal('console'),
    layout: layouts_1.Layouts.configSchema,
});
exports.ConsoleAppender = ConsoleAppender;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvYXBwZW5kZXJzL2NvbnNvbGUvY29uc29sZV9hcHBlbmRlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvYXBwZW5kZXJzL2NvbnNvbGUvY29uc29sZV9hcHBlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVILHNEQUE0QztBQUU1QyxtREFBd0Q7QUFJeEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxzQkFBTSxDQUFDO0FBRW5DOzs7R0FHRztBQUNILE1BQWEsZUFBZTtJQU0xQjs7O09BR0c7SUFDSCxZQUE2QixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFHLENBQUM7SUFFL0M7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLE1BQWlCO1FBQzdCLDRCQUE0QjtRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksT0FBTztRQUNaLE9BQU87SUFDVCxDQUFDOztBQXpCYSw0QkFBWSxHQUFHLE1BQU0sQ0FBQztJQUNsQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUN4QixNQUFNLEVBQUUsaUJBQU8sQ0FBQyxZQUFZO0NBQzdCLENBQUMsQ0FBQztBQUpMLDBDQTJCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBzY2hlbWEgfSBmcm9tICdAa2JuL2NvbmZpZy1zY2hlbWEnO1xuXG5pbXBvcnQgeyBMYXlvdXQsIExheW91dHMgfSBmcm9tICcuLi8uLi9sYXlvdXRzL2xheW91dHMnO1xuaW1wb3J0IHsgTG9nUmVjb3JkIH0gZnJvbSAnLi4vLi4vbG9nX3JlY29yZCc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlQXBwZW5kZXIgfSBmcm9tICcuLi9hcHBlbmRlcnMnO1xuXG5jb25zdCB7IGxpdGVyYWwsIG9iamVjdCB9ID0gc2NoZW1hO1xuXG4vKipcbiAqIEFwcGVuZGVyIHRoYXQgZm9ybWF0cyBhbGwgdGhlIGBMb2dSZWNvcmRgIGluc3RhbmNlcyBpdCByZWNlaXZlcyBhbmQgbG9ncyB0aGVtIHZpYSBidWlsdC1pbiBgY29uc29sZWAuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBpbXBsZW1lbnRzIERpc3Bvc2FibGVBcHBlbmRlciB7XG4gIHB1YmxpYyBzdGF0aWMgY29uZmlnU2NoZW1hID0gb2JqZWN0KHtcbiAgICBraW5kOiBsaXRlcmFsKCdjb25zb2xlJyksXG4gICAgbGF5b3V0OiBMYXlvdXRzLmNvbmZpZ1NjaGVtYSxcbiAgfSk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgQ29uc29sZUFwcGVuZGVyIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gbGF5b3V0IEluc3RhbmNlIG9mIGBMYXlvdXRgIHN1Yi1jbGFzcyByZXNwb25zaWJsZSBmb3IgYExvZ1JlY29yZGAgZm9ybWF0dGluZy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbGF5b3V0OiBMYXlvdXQpIHt9XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgc3BlY2lmaWVkIGByZWNvcmRgIGFuZCBsb2dzIGl0IHZpYSBidWlsdC1pbiBgY29uc29sZWAuXG4gICAqIEBwYXJhbSByZWNvcmQgYExvZ1JlY29yZGAgaW5zdGFuY2UgdG8gYmUgbG9nZ2VkLlxuICAgKi9cbiAgcHVibGljIGFwcGVuZChyZWNvcmQ6IExvZ1JlY29yZCkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyh0aGlzLmxheW91dC5mb3JtYXQocmVjb3JkKSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgYENvbnNvbGVBcHBlbmRlcmAuXG4gICAqL1xuICBwdWJsaWMgZGlzcG9zZSgpIHtcbiAgICAvLyBub29wXG4gIH1cbn1cbiJdfQ==