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
const utils_1 = require("../../utils");
/**
 * Represents the log level, manages string -> `LogLevel` conversion and comparison of log level
 * priorities between themselves.
 * @internal
 */
class LogLevel {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
    /**
     * Converts string representation of log level into `LogLevel` instance.
     * @param level String representation of log level.
     * @returns Instance of `LogLevel` class.
     */
    static fromId(level) {
        switch (level) {
            case 'all':
                return LogLevel.All;
            case 'fatal':
                return LogLevel.Fatal;
            case 'error':
                return LogLevel.Error;
            case 'warn':
                return LogLevel.Warn;
            case 'info':
                return LogLevel.Info;
            case 'debug':
                return LogLevel.Debug;
            case 'trace':
                return LogLevel.Trace;
            case 'off':
                return LogLevel.Off;
            default:
                return utils_1.assertNever(level);
        }
    }
    /**
     * Indicates whether current log level covers the one that is passed as an argument.
     * @param level Instance of `LogLevel` to compare to.
     * @returns True if specified `level` is covered by this log level.
     */
    supports(level) {
        return this.value >= level.value;
    }
}
LogLevel.Off = new LogLevel('off', 1);
LogLevel.Fatal = new LogLevel('fatal', 2);
LogLevel.Error = new LogLevel('error', 3);
LogLevel.Warn = new LogLevel('warn', 4);
LogLevel.Info = new LogLevel('info', 5);
LogLevel.Debug = new LogLevel('debug', 6);
LogLevel.Trace = new LogLevel('trace', 7);
LogLevel.All = new LogLevel('all', 8);
exports.LogLevel = LogLevel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbG9nX2xldmVsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS9zZXJ2ZXIvbG9nZ2luZy9sb2dfbGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFFSCx1Q0FBMEM7QUFRMUM7Ozs7R0FJRztBQUNILE1BQWEsUUFBUTtJQXNDbkIsWUFBNkIsRUFBYyxFQUFXLEtBQWE7UUFBdEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFXLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBNUJ2RTs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFpQjtRQUNwQyxRQUFRLEtBQUssRUFBRTtZQUNiLEtBQUssS0FBSztnQkFDUixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDdEIsS0FBSyxPQUFPO2dCQUNWLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztZQUN4QixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3hCLEtBQUssTUFBTTtnQkFDVCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDdkIsS0FBSyxNQUFNO2dCQUNULE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztZQUN2QixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3hCLEtBQUssT0FBTztnQkFDVixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDeEIsS0FBSyxLQUFLO2dCQUNSLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUN0QjtnQkFDRSxPQUFPLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBSUQ7Ozs7T0FJRztJQUNJLFFBQVEsQ0FBQyxLQUFlO1FBQzdCLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ25DLENBQUM7O0FBOUNzQixZQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdCLGNBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsY0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQyxhQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLGFBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsY0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQyxjQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLFlBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFSdEQsNEJBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGFzc2VydE5ldmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG4vKipcbiAqIFBvc3NpYmxlIGxvZyBsZXZlbCBzdHJpbmcgdmFsdWVzLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCB0eXBlIExvZ0xldmVsSWQgPSAnYWxsJyB8ICdmYXRhbCcgfCAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nIHwgJ2RlYnVnJyB8ICd0cmFjZScgfCAnb2ZmJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBsb2cgbGV2ZWwsIG1hbmFnZXMgc3RyaW5nIC0+IGBMb2dMZXZlbGAgY29udmVyc2lvbiBhbmQgY29tcGFyaXNvbiBvZiBsb2cgbGV2ZWxcbiAqIHByaW9yaXRpZXMgYmV0d2VlbiB0aGVtc2VsdmVzLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dMZXZlbCB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT2ZmID0gbmV3IExvZ0xldmVsKCdvZmYnLCAxKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBGYXRhbCA9IG5ldyBMb2dMZXZlbCgnZmF0YWwnLCAyKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBFcnJvciA9IG5ldyBMb2dMZXZlbCgnZXJyb3InLCAzKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBXYXJuID0gbmV3IExvZ0xldmVsKCd3YXJuJywgNCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSW5mbyA9IG5ldyBMb2dMZXZlbCgnaW5mbycsIDUpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERlYnVnID0gbmV3IExvZ0xldmVsKCdkZWJ1ZycsIDYpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRyYWNlID0gbmV3IExvZ0xldmVsKCd0cmFjZScsIDcpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFsbCA9IG5ldyBMb2dMZXZlbCgnYWxsJywgOCk7XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBsb2cgbGV2ZWwgaW50byBgTG9nTGV2ZWxgIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gbGV2ZWwgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGxvZyBsZXZlbC5cbiAgICogQHJldHVybnMgSW5zdGFuY2Ugb2YgYExvZ0xldmVsYCBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUlkKGxldmVsOiBMb2dMZXZlbElkKTogTG9nTGV2ZWwge1xuICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgIHJldHVybiBMb2dMZXZlbC5BbGw7XG4gICAgICBjYXNlICdmYXRhbCc6XG4gICAgICAgIHJldHVybiBMb2dMZXZlbC5GYXRhbDtcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgcmV0dXJuIExvZ0xldmVsLkVycm9yO1xuICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgIHJldHVybiBMb2dMZXZlbC5XYXJuO1xuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIHJldHVybiBMb2dMZXZlbC5JbmZvO1xuICAgICAgY2FzZSAnZGVidWcnOlxuICAgICAgICByZXR1cm4gTG9nTGV2ZWwuRGVidWc7XG4gICAgICBjYXNlICd0cmFjZSc6XG4gICAgICAgIHJldHVybiBMb2dMZXZlbC5UcmFjZTtcbiAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgIHJldHVybiBMb2dMZXZlbC5PZmY7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gYXNzZXJ0TmV2ZXIobGV2ZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IExvZ0xldmVsSWQsIHJlYWRvbmx5IHZhbHVlOiBudW1iZXIpIHt9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGN1cnJlbnQgbG9nIGxldmVsIGNvdmVycyB0aGUgb25lIHRoYXQgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50LlxuICAgKiBAcGFyYW0gbGV2ZWwgSW5zdGFuY2Ugb2YgYExvZ0xldmVsYCB0byBjb21wYXJlIHRvLlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHNwZWNpZmllZCBgbGV2ZWxgIGlzIGNvdmVyZWQgYnkgdGhpcyBsb2cgbGV2ZWwuXG4gICAqL1xuICBwdWJsaWMgc3VwcG9ydHMobGV2ZWw6IExvZ0xldmVsKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPj0gbGV2ZWwudmFsdWU7XG4gIH1cbn1cbiJdfQ==