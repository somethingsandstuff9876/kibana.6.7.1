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
const { literal, object } = config_schema_1.schema;
const jsonLayoutSchema = object({
    kind: literal('json'),
});
/**
 * Layout that just converts `LogRecord` into JSON string.
 * @internal
 */
class JsonLayout {
    static errorToSerializableObject(error) {
        if (error === undefined) {
            return error;
        }
        return {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
    }
    format(record) {
        return JSON.stringify({
            '@timestamp': record.timestamp.toISOString(),
            context: record.context,
            error: JsonLayout.errorToSerializableObject(record.error),
            level: record.level.id.toUpperCase(),
            message: record.message,
            meta: record.meta,
        });
    }
}
JsonLayout.configSchema = jsonLayoutSchema;
exports.JsonLayout = JsonLayout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbGF5b3V0cy9qc29uX2xheW91dC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xvZ2dpbmcvbGF5b3V0cy9qc29uX2xheW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVILHNEQUFvRDtBQUtwRCxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLHNCQUFNLENBQUM7QUFFbkMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7SUFDOUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7Q0FDdEIsQ0FBQyxDQUFDO0FBS0g7OztHQUdHO0FBQ0gsTUFBYSxVQUFVO0lBR2IsTUFBTSxDQUFDLHlCQUF5QixDQUFDLEtBQXdCO1FBQy9ELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1NBQ25CLENBQUM7SUFDSixDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQWlCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNwQixZQUFZLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDNUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3ZCLEtBQUssRUFBRSxVQUFVLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN6RCxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ3BDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztZQUN2QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUF2QmEsdUJBQVksR0FBRyxnQkFBZ0IsQ0FBQztBQURoRCxnQ0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgc2NoZW1hLCBUeXBlT2YgfSBmcm9tICdAa2JuL2NvbmZpZy1zY2hlbWEnO1xuXG5pbXBvcnQgeyBMb2dSZWNvcmQgfSBmcm9tICcuLi9sb2dfcmVjb3JkJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vbGF5b3V0cyc7XG5cbmNvbnN0IHsgbGl0ZXJhbCwgb2JqZWN0IH0gPSBzY2hlbWE7XG5cbmNvbnN0IGpzb25MYXlvdXRTY2hlbWEgPSBvYmplY3Qoe1xuICBraW5kOiBsaXRlcmFsKCdqc29uJyksXG59KTtcblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHR5cGUgSnNvbkxheW91dENvbmZpZ1R5cGUgPSBUeXBlT2Y8dHlwZW9mIGpzb25MYXlvdXRTY2hlbWE+O1xuXG4vKipcbiAqIExheW91dCB0aGF0IGp1c3QgY29udmVydHMgYExvZ1JlY29yZGAgaW50byBKU09OIHN0cmluZy5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgSnNvbkxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIHB1YmxpYyBzdGF0aWMgY29uZmlnU2NoZW1hID0ganNvbkxheW91dFNjaGVtYTtcblxuICBwcml2YXRlIHN0YXRpYyBlcnJvclRvU2VyaWFsaXphYmxlT2JqZWN0KGVycm9yOiBFcnJvciB8IHVuZGVmaW5lZCkge1xuICAgIGlmIChlcnJvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICBuYW1lOiBlcnJvci5uYW1lLFxuICAgICAgc3RhY2s6IGVycm9yLnN0YWNrLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZm9ybWF0KHJlY29yZDogTG9nUmVjb3JkKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgJ0B0aW1lc3RhbXAnOiByZWNvcmQudGltZXN0YW1wLnRvSVNPU3RyaW5nKCksXG4gICAgICBjb250ZXh0OiByZWNvcmQuY29udGV4dCxcbiAgICAgIGVycm9yOiBKc29uTGF5b3V0LmVycm9yVG9TZXJpYWxpemFibGVPYmplY3QocmVjb3JkLmVycm9yKSxcbiAgICAgIGxldmVsOiByZWNvcmQubGV2ZWwuaWQudG9VcHBlckNhc2UoKSxcbiAgICAgIG1lc3NhZ2U6IHJlY29yZC5tZXNzYWdlLFxuICAgICAgbWV0YTogcmVjb3JkLm1ldGEsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==