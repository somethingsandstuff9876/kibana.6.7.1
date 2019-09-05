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
const fs_1 = require("fs");
const layouts_1 = require("../../layouts/layouts");
/**
 * Appender that formats all the `LogRecord` instances it receives and writes them to the specified file.
 * @internal
 */
class FileAppender {
    /**
     * Creates FileAppender instance with specified layout and file path.
     * @param layout Instance of `Layout` sub-class responsible for `LogRecord` formatting.
     * @param path Path to the file where log records should be stored.
     */
    constructor(layout, path) {
        this.layout = layout;
        this.path = path;
    }
    /**
     * Formats specified `record` and writes them to the specified file.
     * @param record `LogRecord` instance to be logged.
     */
    append(record) {
        if (this.outputStream === undefined) {
            this.outputStream = fs_1.createWriteStream(this.path, {
                encoding: 'utf8',
                flags: 'a',
            });
        }
        this.outputStream.write(`${this.layout.format(record)}\n`);
    }
    /**
     * Disposes `FileAppender`. Waits for the underlying file stream to be completely flushed and closed.
     */
    async dispose() {
        await new Promise(resolve => {
            if (this.outputStream === undefined) {
                return resolve();
            }
            this.outputStream.end(undefined, undefined, () => {
                this.outputStream = undefined;
                resolve();
            });
        });
    }
}
FileAppender.configSchema = config_schema_1.schema.object({
    kind: config_schema_1.schema.literal('file'),
    layout: layouts_1.Layouts.configSchema,
    path: config_schema_1.schema.string(),
});
exports.FileAppender = FileAppender;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvYXBwZW5kZXJzL2ZpbGUvZmlsZV9hcHBlbmRlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvYXBwZW5kZXJzL2ZpbGUvZmlsZV9hcHBlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVILHNEQUE0QztBQUM1QywyQkFBb0Q7QUFFcEQsbURBQXdEO0FBSXhEOzs7R0FHRztBQUNILE1BQWEsWUFBWTtJQVl2Qjs7OztPQUlHO0lBQ0gsWUFBNkIsTUFBYyxFQUFtQixJQUFZO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBbUIsU0FBSSxHQUFKLElBQUksQ0FBUTtJQUFHLENBQUM7SUFFOUU7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLE1BQWlCO1FBQzdCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxzQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUMvQyxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsS0FBSyxFQUFFLEdBQUc7YUFDWCxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDbkMsT0FBTyxPQUFPLEVBQUUsQ0FBQzthQUNsQjtZQUVELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztnQkFDOUIsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUEvQ2EseUJBQVksR0FBRyxzQkFBTSxDQUFDLE1BQU0sQ0FBQztJQUN6QyxJQUFJLEVBQUUsc0JBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzVCLE1BQU0sRUFBRSxpQkFBTyxDQUFDLFlBQVk7SUFDNUIsSUFBSSxFQUFFLHNCQUFNLENBQUMsTUFBTSxFQUFFO0NBQ3RCLENBQUMsQ0FBQztBQUxMLG9DQWlEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBzY2hlbWEgfSBmcm9tICdAa2JuL2NvbmZpZy1zY2hlbWEnO1xuaW1wb3J0IHsgY3JlYXRlV3JpdGVTdHJlYW0sIFdyaXRlU3RyZWFtIH0gZnJvbSAnZnMnO1xuXG5pbXBvcnQgeyBMYXlvdXQsIExheW91dHMgfSBmcm9tICcuLi8uLi9sYXlvdXRzL2xheW91dHMnO1xuaW1wb3J0IHsgTG9nUmVjb3JkIH0gZnJvbSAnLi4vLi4vbG9nX3JlY29yZCc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlQXBwZW5kZXIgfSBmcm9tICcuLi9hcHBlbmRlcnMnO1xuXG4vKipcbiAqIEFwcGVuZGVyIHRoYXQgZm9ybWF0cyBhbGwgdGhlIGBMb2dSZWNvcmRgIGluc3RhbmNlcyBpdCByZWNlaXZlcyBhbmQgd3JpdGVzIHRoZW0gdG8gdGhlIHNwZWNpZmllZCBmaWxlLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlQXBwZW5kZXIgaW1wbGVtZW50cyBEaXNwb3NhYmxlQXBwZW5kZXIge1xuICBwdWJsaWMgc3RhdGljIGNvbmZpZ1NjaGVtYSA9IHNjaGVtYS5vYmplY3Qoe1xuICAgIGtpbmQ6IHNjaGVtYS5saXRlcmFsKCdmaWxlJyksXG4gICAgbGF5b3V0OiBMYXlvdXRzLmNvbmZpZ1NjaGVtYSxcbiAgICBwYXRoOiBzY2hlbWEuc3RyaW5nKCksXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXcml0YWJsZSBmaWxlIHN0cmVhbSB0byB3cml0ZSBmb3JtYXR0ZWQgYExvZ1JlY29yZGAgdG8uXG4gICAqL1xuICBwcml2YXRlIG91dHB1dFN0cmVhbT86IFdyaXRlU3RyZWFtO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIEZpbGVBcHBlbmRlciBpbnN0YW5jZSB3aXRoIHNwZWNpZmllZCBsYXlvdXQgYW5kIGZpbGUgcGF0aC5cbiAgICogQHBhcmFtIGxheW91dCBJbnN0YW5jZSBvZiBgTGF5b3V0YCBzdWItY2xhc3MgcmVzcG9uc2libGUgZm9yIGBMb2dSZWNvcmRgIGZvcm1hdHRpbmcuXG4gICAqIEBwYXJhbSBwYXRoIFBhdGggdG8gdGhlIGZpbGUgd2hlcmUgbG9nIHJlY29yZHMgc2hvdWxkIGJlIHN0b3JlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbGF5b3V0OiBMYXlvdXQsIHByaXZhdGUgcmVhZG9ubHkgcGF0aDogc3RyaW5nKSB7fVxuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHNwZWNpZmllZCBgcmVjb3JkYCBhbmQgd3JpdGVzIHRoZW0gdG8gdGhlIHNwZWNpZmllZCBmaWxlLlxuICAgKiBAcGFyYW0gcmVjb3JkIGBMb2dSZWNvcmRgIGluc3RhbmNlIHRvIGJlIGxvZ2dlZC5cbiAgICovXG4gIHB1YmxpYyBhcHBlbmQocmVjb3JkOiBMb2dSZWNvcmQpIHtcbiAgICBpZiAodGhpcy5vdXRwdXRTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5vdXRwdXRTdHJlYW0gPSBjcmVhdGVXcml0ZVN0cmVhbSh0aGlzLnBhdGgsIHtcbiAgICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgICAgZmxhZ3M6ICdhJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0U3RyZWFtLndyaXRlKGAke3RoaXMubGF5b3V0LmZvcm1hdChyZWNvcmQpfVxcbmApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIGBGaWxlQXBwZW5kZXJgLiBXYWl0cyBmb3IgdGhlIHVuZGVybHlpbmcgZmlsZSBzdHJlYW0gdG8gYmUgY29tcGxldGVseSBmbHVzaGVkIGFuZCBjbG9zZWQuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzcG9zZSgpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmICh0aGlzLm91dHB1dFN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0cHV0U3RyZWFtLmVuZCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICB0aGlzLm91dHB1dFN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==