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
 * Simple appender that just buffers `LogRecord` instances it receives. It is a *reserved* appender
 * that can't be set via configuration file.
 * @internal
 */
class BufferAppender {
    constructor() {
        /**
         * List of the buffered `LogRecord` instances.
         */
        this.buffer = [];
    }
    /**
     * Appends new `LogRecord` to the buffer.
     * @param record `LogRecord` instance to add to the buffer.
     */
    append(record) {
        this.buffer.push(record);
    }
    /**
     * Clears buffer and returns all records that it had.
     */
    flush() {
        return this.buffer.splice(0, this.buffer.length);
    }
    /**
     * Disposes `BufferAppender` and clears internal `LogRecord` buffer.
     */
    async dispose() {
        this.flush();
    }
}
exports.BufferAppender = BufferAppender;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvYXBwZW5kZXJzL2J1ZmZlci9idWZmZXJfYXBwZW5kZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9sb2dnaW5nL2FwcGVuZGVycy9idWZmZXIvYnVmZmVyX2FwcGVuZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBS0g7Ozs7R0FJRztBQUNILE1BQWEsY0FBYztJQUEzQjtRQUNFOztXQUVHO1FBQ2MsV0FBTSxHQUFnQixFQUFFLENBQUM7SUF1QjVDLENBQUM7SUFyQkM7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLE1BQWlCO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7Q0FDRjtBQTNCRCx3Q0EyQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgTG9nUmVjb3JkIH0gZnJvbSAnLi4vLi4vbG9nX3JlY29yZCc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlQXBwZW5kZXIgfSBmcm9tICcuLi9hcHBlbmRlcnMnO1xuXG4vKipcbiAqIFNpbXBsZSBhcHBlbmRlciB0aGF0IGp1c3QgYnVmZmVycyBgTG9nUmVjb3JkYCBpbnN0YW5jZXMgaXQgcmVjZWl2ZXMuIEl0IGlzIGEgKnJlc2VydmVkKiBhcHBlbmRlclxuICogdGhhdCBjYW4ndCBiZSBzZXQgdmlhIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgQnVmZmVyQXBwZW5kZXIgaW1wbGVtZW50cyBEaXNwb3NhYmxlQXBwZW5kZXIge1xuICAvKipcbiAgICogTGlzdCBvZiB0aGUgYnVmZmVyZWQgYExvZ1JlY29yZGAgaW5zdGFuY2VzLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBidWZmZXI6IExvZ1JlY29yZFtdID0gW107XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgbmV3IGBMb2dSZWNvcmRgIHRvIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSByZWNvcmQgYExvZ1JlY29yZGAgaW5zdGFuY2UgdG8gYWRkIHRvIHRoZSBidWZmZXIuXG4gICAqL1xuICBwdWJsaWMgYXBwZW5kKHJlY29yZDogTG9nUmVjb3JkKSB7XG4gICAgdGhpcy5idWZmZXIucHVzaChyZWNvcmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBidWZmZXIgYW5kIHJldHVybnMgYWxsIHJlY29yZHMgdGhhdCBpdCBoYWQuXG4gICAqL1xuICBwdWJsaWMgZmx1c2goKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZSgwLCB0aGlzLmJ1ZmZlci5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIGBCdWZmZXJBcHBlbmRlcmAgYW5kIGNsZWFycyBpbnRlcm5hbCBgTG9nUmVjb3JkYCBidWZmZXIuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmZsdXNoKCk7XG4gIH1cbn1cbiJdfQ==