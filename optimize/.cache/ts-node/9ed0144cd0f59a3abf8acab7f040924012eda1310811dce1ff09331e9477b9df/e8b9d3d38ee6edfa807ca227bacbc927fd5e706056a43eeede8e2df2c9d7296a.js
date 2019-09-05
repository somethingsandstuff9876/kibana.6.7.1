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
const dev_utils_1 = require("@kbn/dev-utils");
const fail_1 = require("./fail");
const flags_1 = require("./flags");
async function run(fn, options = {}) {
    const flags = flags_1.getFlags(process.argv.slice(2));
    if (flags.help) {
        process.stderr.write(flags_1.getHelp(options));
        process.exit(1);
    }
    const log = new dev_utils_1.ToolingLog({
        level: dev_utils_1.pickLevelFromFlags(flags),
        writeTo: process.stdout,
    });
    try {
        await fn({ log, flags });
    }
    catch (error) {
        if (fail_1.isFailError(error)) {
            log.error(error.message);
            process.exit(error.exitCode);
        }
        else {
            log.error('UNHANDLED ERROR');
            log.error(error);
            process.exit(1);
        }
    }
}
exports.run = run;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2Rldi9ydW4vcnVuLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvZGV2L3J1bi9ydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFFSCw4Q0FBZ0U7QUFDaEUsaUNBQXFDO0FBQ3JDLG1DQUFtRDtBQVE1QyxLQUFLLFVBQVUsR0FBRyxDQUFDLEVBQVMsRUFBRSxVQUFtQixFQUFFO0lBQ3hELE1BQU0sS0FBSyxHQUFHLGdCQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5QyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDZCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO0lBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBVSxDQUFDO1FBQ3pCLEtBQUssRUFBRSw4QkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDaEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNO0tBQ3hCLENBQUMsQ0FBQztJQUVILElBQUk7UUFDRixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzFCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxJQUFJLGtCQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakI7S0FDRjtBQUNILENBQUM7QUF6QkQsa0JBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHBpY2tMZXZlbEZyb21GbGFncywgVG9vbGluZ0xvZyB9IGZyb20gJ0BrYm4vZGV2LXV0aWxzJztcbmltcG9ydCB7IGlzRmFpbEVycm9yIH0gZnJvbSAnLi9mYWlsJztcbmltcG9ydCB7IEZsYWdzLCBnZXRGbGFncywgZ2V0SGVscCB9IGZyb20gJy4vZmxhZ3MnO1xuXG50eXBlIFJ1bkZuID0gKGFyZ3M6IHsgbG9nOiBUb29saW5nTG9nOyBmbGFnczogRmxhZ3MgfSkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9ucyB7XG4gIGhlbHBEZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bihmbjogUnVuRm4sIG9wdGlvbnM6IE9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBmbGFncyA9IGdldEZsYWdzKHByb2Nlc3MuYXJndi5zbGljZSgyKSk7XG5cbiAgaWYgKGZsYWdzLmhlbHApIHtcbiAgICBwcm9jZXNzLnN0ZGVyci53cml0ZShnZXRIZWxwKG9wdGlvbnMpKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cblxuICBjb25zdCBsb2cgPSBuZXcgVG9vbGluZ0xvZyh7XG4gICAgbGV2ZWw6IHBpY2tMZXZlbEZyb21GbGFncyhmbGFncyksXG4gICAgd3JpdGVUbzogcHJvY2Vzcy5zdGRvdXQsXG4gIH0pO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgZm4oeyBsb2csIGZsYWdzIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChpc0ZhaWxFcnJvcihlcnJvcikpIHtcbiAgICAgIGxvZy5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgIHByb2Nlc3MuZXhpdChlcnJvci5leGl0Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5lcnJvcignVU5IQU5ETEVEIEVSUk9SJyk7XG4gICAgICBsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbiAgfVxufVxuIl19