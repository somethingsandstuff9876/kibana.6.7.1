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
/** @internal */
class LoggerAdapter {
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * The current logger can be updated "on the fly", e.g. when the log config
     * has changed.
     *
     * This is not intended for external use, only internally in Kibana
     *
     * @internal
     */
    updateLogger(logger) {
        this.logger = logger;
    }
    trace(message, meta) {
        this.logger.trace(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    warn(errorOrMessage, meta) {
        this.logger.warn(errorOrMessage, meta);
    }
    error(errorOrMessage, meta) {
        this.logger.error(errorOrMessage, meta);
    }
    fatal(errorOrMessage, meta) {
        this.logger.fatal(errorOrMessage, meta);
    }
    log(record) {
        this.logger.log(record);
    }
}
exports.LoggerAdapter = LoggerAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbG9nZ2VyX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9sb2dnaW5nL2xvZ2dlcl9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBS0gsZ0JBQWdCO0FBQ2hCLE1BQWEsYUFBYTtJQUN4QixZQUFvQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFHLENBQUM7SUFFdEM7Ozs7Ozs7T0FPRztJQUNJLFlBQVksQ0FBQyxNQUFjO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxLQUFLLENBQUMsT0FBZSxFQUFFLElBQWM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSxLQUFLLENBQUMsT0FBZSxFQUFFLElBQWM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSxJQUFJLENBQUMsT0FBZSxFQUFFLElBQWM7UUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxJQUFJLENBQUMsY0FBOEIsRUFBRSxJQUFjO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sS0FBSyxDQUFDLGNBQThCLEVBQUUsSUFBYztRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLEtBQUssQ0FBQyxjQUE4QixFQUFFLElBQWM7UUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxHQUFHLENBQUMsTUFBaUI7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBMUNELHNDQTBDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBMb2dSZWNvcmQgfSBmcm9tICcuL2xvZ19yZWNvcmQnO1xuaW1wb3J0IHsgTG9nZ2VyLCBMb2dNZXRhIH0gZnJvbSAnLi9sb2dnZXInO1xuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgY2xhc3MgTG9nZ2VyQWRhcHRlciBpbXBsZW1lbnRzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIpIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IGxvZ2dlciBjYW4gYmUgdXBkYXRlZCBcIm9uIHRoZSBmbHlcIiwgZS5nLiB3aGVuIHRoZSBsb2cgY29uZmlnXG4gICAqIGhhcyBjaGFuZ2VkLlxuICAgKlxuICAgKiBUaGlzIGlzIG5vdCBpbnRlbmRlZCBmb3IgZXh0ZXJuYWwgdXNlLCBvbmx5IGludGVybmFsbHkgaW4gS2liYW5hXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZUxvZ2dlcihsb2dnZXI6IExvZ2dlcikge1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB9XG5cbiAgcHVibGljIHRyYWNlKG1lc3NhZ2U6IHN0cmluZywgbWV0YT86IExvZ01ldGEpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2dlci50cmFjZShtZXNzYWdlLCBtZXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBkZWJ1ZyhtZXNzYWdlOiBzdHJpbmcsIG1ldGE/OiBMb2dNZXRhKTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcobWVzc2FnZSwgbWV0YSk7XG4gIH1cblxuICBwdWJsaWMgaW5mbyhtZXNzYWdlOiBzdHJpbmcsIG1ldGE/OiBMb2dNZXRhKTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXIuaW5mbyhtZXNzYWdlLCBtZXRhKTtcbiAgfVxuXG4gIHB1YmxpYyB3YXJuKGVycm9yT3JNZXNzYWdlOiBzdHJpbmcgfCBFcnJvciwgbWV0YT86IExvZ01ldGEpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2dlci53YXJuKGVycm9yT3JNZXNzYWdlLCBtZXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihlcnJvck9yTWVzc2FnZTogc3RyaW5nIHwgRXJyb3IsIG1ldGE/OiBMb2dNZXRhKTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3JPck1lc3NhZ2UsIG1ldGEpO1xuICB9XG5cbiAgcHVibGljIGZhdGFsKGVycm9yT3JNZXNzYWdlOiBzdHJpbmcgfCBFcnJvciwgbWV0YT86IExvZ01ldGEpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2dlci5mYXRhbChlcnJvck9yTWVzc2FnZSwgbWV0YSk7XG4gIH1cblxuICBwdWJsaWMgbG9nKHJlY29yZDogTG9nUmVjb3JkKSB7XG4gICAgdGhpcy5sb2dnZXIubG9nKHJlY29yZCk7XG4gIH1cbn1cbiJdfQ==