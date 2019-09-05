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
const request_1 = require("./request");
const response_1 = require("./response");
class Router {
    constructor(path) {
        this.path = path;
        this.routes = [];
    }
    /**
     * Register a `GET` request with the router
     */
    get(route, handler) {
        const routeSchemas = this.routeSchemasFromRouteConfig(route, 'GET');
        this.routes.push({
            handler: async (req, responseToolkit) => await this.handle(routeSchemas, req, responseToolkit, handler),
            method: 'GET',
            path: route.path,
        });
    }
    /**
     * Register a `POST` request with the router
     */
    post(route, handler) {
        const routeSchemas = this.routeSchemasFromRouteConfig(route, 'POST');
        this.routes.push({
            handler: async (req, responseToolkit) => await this.handle(routeSchemas, req, responseToolkit, handler),
            method: 'POST',
            path: route.path,
        });
    }
    /**
     * Register a `PUT` request with the router
     */
    put(route, handler) {
        const routeSchemas = this.routeSchemasFromRouteConfig(route, 'POST');
        this.routes.push({
            handler: async (req, responseToolkit) => await this.handle(routeSchemas, req, responseToolkit, handler),
            method: 'PUT',
            path: route.path,
        });
    }
    /**
     * Register a `DELETE` request with the router
     */
    delete(route, handler) {
        const routeSchemas = this.routeSchemasFromRouteConfig(route, 'DELETE');
        this.routes.push({
            handler: async (req, responseToolkit) => await this.handle(routeSchemas, req, responseToolkit, handler),
            method: 'DELETE',
            path: route.path,
        });
    }
    /**
     * Returns all routes registered with the this router.
     * @returns List of registered routes.
     */
    getRoutes() {
        return [...this.routes];
    }
    /**
     * Create the schemas for a route
     *
     * @returns Route schemas if `validate` is specified on the route, otherwise
     * undefined.
     */
    routeSchemasFromRouteConfig(route, routeMethod) {
        // The type doesn't allow `validate` to be undefined, but it can still
        // happen when it's used from JavaScript.
        if (route.validate === undefined) {
            throw new Error(`The [${routeMethod}] at [${route.path}] does not have a 'validate' specified. Use 'false' as the value if you want to bypass validation.`);
        }
        return route.validate ? route.validate(config_schema_1.schema) : undefined;
    }
    async handle(routeSchemas, request, responseToolkit, handler) {
        let kibanaRequest;
        try {
            kibanaRequest = request_1.KibanaRequest.from(request, routeSchemas);
        }
        catch (e) {
            // TODO Handle failed validation
            return responseToolkit.response({ error: e.message }).code(400);
        }
        try {
            const kibanaResponse = await handler(kibanaRequest, response_1.responseFactory);
            let payload = null;
            if (kibanaResponse.payload instanceof Error) {
                // TODO Design an error format
                payload = { error: kibanaResponse.payload.message };
            }
            else if (kibanaResponse.payload !== undefined) {
                payload = kibanaResponse.payload;
            }
            return responseToolkit.response(payload).code(kibanaResponse.status);
        }
        catch (e) {
            // TODO Handle `KibanaResponseError`
            // Otherwise we default to something along the lines of
            return responseToolkit.response({ error: e.message }).code(500);
        }
    }
}
exports.Router = Router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvcm91dGVyL3JvdXRlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvcm91dGVyL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVILHNEQUFnRTtBQUdoRSx1Q0FBMEM7QUFDMUMseUNBQThFO0FBUzlFLE1BQWEsTUFBTTtJQUdqQixZQUFxQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUYxQixXQUFNLEdBQWlDLEVBQUUsQ0FBQztJQUViLENBQUM7SUFFckM7O09BRUc7SUFDSSxHQUFHLENBQ1IsS0FBMkIsRUFDM0IsT0FBZ0M7UUFFaEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQ3RDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUM7WUFDaEUsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUNULEtBQTJCLEVBQzNCLE9BQWdDO1FBRWhDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxl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QUFLLFNBQVMsRUFBRTtnQkFDL0MsT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUM7YUFDbEM7WUFFRCxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1Ysb0NBQW9DO1lBRXBDLHVEQUF1RDtZQUN2RCxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQztDQUNGO0FBdklELHdCQXVJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBPYmplY3RUeXBlLCBzY2hlbWEsIFR5cGVPZiB9IGZyb20gJ0BrYm4vY29uZmlnLXNjaGVtYSc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZU9iamVjdCwgUmVzcG9uc2VUb29sa2l0IH0gZnJvbSAnaGFwaSc7XG5cbmltcG9ydCB7IEtpYmFuYVJlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3QnO1xuaW1wb3J0IHsgS2liYW5hUmVzcG9uc2UsIFJlc3BvbnNlRmFjdG9yeSwgcmVzcG9uc2VGYWN0b3J5IH0gZnJvbSAnLi9yZXNwb25zZSc7XG5pbXBvcnQgeyBSb3V0ZUNvbmZpZywgUm91dGVNZXRob2QsIFJvdXRlU2NoZW1hcyB9IGZyb20gJy4vcm91dGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJvdXRlclJvdXRlIHtcbiAgbWV0aG9kOiAnR0VUJyB8ICdQT1NUJyB8ICdQVVQnIHwgJ0RFTEVURSc7XG4gIHBhdGg6IHN0cmluZztcbiAgaGFuZGxlcjogKHJlcTogUmVxdWVzdCwgcmVzcG9uc2VUb29sa2l0OiBSZXNwb25zZVRvb2xraXQpID0+IFByb21pc2U8UmVzcG9uc2VPYmplY3Q+O1xufVxuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgcHVibGljIHJvdXRlczogQXJyYXk8UmVhZG9ubHk8Um91dGVyUm91dGU+PiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHBhdGg6IHN0cmluZykge31cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBgR0VUYCByZXF1ZXN0IHdpdGggdGhlIHJvdXRlclxuICAgKi9cbiAgcHVibGljIGdldDxQIGV4dGVuZHMgT2JqZWN0VHlwZSwgUSBleHRlbmRzIE9iamVjdFR5cGUsIEIgZXh0ZW5kcyBPYmplY3RUeXBlPihcbiAgICByb3V0ZTogUm91dGVDb25maWc8UCwgUSwgQj4sXG4gICAgaGFuZGxlcjogUmVxdWVzdEhhbmRsZXI8UCwgUSwgQj5cbiAgKSB7XG4gICAgY29uc3Qgcm91dGVTY2hlbWFzID0gdGhpcy5yb3V0ZVNjaGVtYXNGcm9tUm91dGVDb25maWcocm91dGUsICdHRVQnKTtcbiAgICB0aGlzLnJvdXRlcy5wdXNoKHtcbiAgICAgIGhhbmRsZXI6IGFzeW5jIChyZXEsIHJlc3BvbnNlVG9vbGtpdCkgPT5cbiAgICAgICAgYXdhaXQgdGhpcy5oYW5kbGUocm91dGVTY2hlbWFzLCByZXEsIHJlc3BvbnNlVG9vbGtpdCwgaGFuZGxlciksXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcGF0aDogcm91dGUucGF0aCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGBQT1NUYCByZXF1ZXN0IHdpdGggdGhlIHJvdXRlclxuICAgKi9cbiAgcHVibGljIHBvc3Q8UCBleHRlbmRzIE9iamVjdFR5cGUsIFEgZXh0ZW5kcyBPYmplY3RUeXBlLCBCIGV4dGVuZHMgT2JqZWN0VHlwZT4oXG4gICAgcm91dGU6IFJvdXRlQ29uZmlnPFAsIFEsIEI+LFxuICAgIGhhbmRsZXI6IFJlcXVlc3RIYW5kbGVyPFAsIFEsIEI+XG4gICkge1xuICAgIGNvbnN0IHJvdXRlU2NoZW1hcyA9IHRoaXMucm91dGVTY2hlbWFzRnJvbVJvdXRlQ29uZmlnKHJvdXRlLCAnUE9TVCcpO1xuICAgIHRoaXMucm91dGVzLnB1c2goe1xuICAgICAgaGFuZGxlcjogYXN5bmMgKHJlcSwgcmVzcG9uc2VUb29sa2l0KSA9PlxuICAgICAgICBhd2FpdCB0aGlzLmhhbmRsZShyb3V0ZVNjaGVtYXMsIHJlcSwgcmVzcG9uc2VUb29sa2l0LCBoYW5kbGVyKSxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgcGF0aDogcm91dGUucGF0aCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGBQVVRgIHJlcXVlc3Qgd2l0aCB0aGUgcm91dGVyXG4gICAqL1xuICBwdWJsaWMgcHV0PFAgZXh0ZW5kcyBPYmplY3RUeXBlLCBRIGV4dGVuZHMgT2JqZWN0VHlwZSwgQiBleHRlbmRzIE9iamVjdFR5cGU+KFxuICAgIHJvdXRlOiBSb3V0ZUNvbmZpZzxQLCBRLCBCPixcbiAgICBoYW5kbGVyOiBSZXF1ZXN0SGFuZGxlcjxQLCBRLCBCPlxuICApIHtcbiAgICBjb25zdCByb3V0ZVNjaGVtYXMgPSB0aGlzLnJvdXRlU2NoZW1hc0Zyb21Sb3V0ZUNvbmZpZyhyb3V0ZSwgJ1BPU1QnKTtcbiAgICB0aGlzLnJvdXRlcy5wdXNoKHtcbiAgICAgIGhhbmRsZXI6IGFzeW5jIChyZXEsIHJlc3BvbnNlVG9vbGtpdCkgPT5cbiAgICAgICAgYXdhaXQgdGhpcy5oYW5kbGUocm91dGVTY2hlbWFzLCByZXEsIHJlc3BvbnNlVG9vbGtpdCwgaGFuZGxlciksXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgcGF0aDogcm91dGUucGF0aCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGBERUxFVEVgIHJlcXVlc3Qgd2l0aCB0aGUgcm91dGVyXG4gICAqL1xuICBwdWJsaWMgZGVsZXRlPFAgZXh0ZW5kcyBPYmplY3RUeXBlLCBRIGV4dGVuZHMgT2JqZWN0VHlwZSwgQiBleHRlbmRzIE9iamVjdFR5cGU+KFxuICAgIHJvdXRlOiBSb3V0ZUNvbmZpZzxQLCBRLCBCPixcbiAgICBoYW5kbGVyOiBSZXF1ZXN0SGFuZGxlcjxQLCBRLCBCPlxuICApIHtcbiAgICBjb25zdCByb3V0ZVNjaGVtYXMgPSB0aGlzLnJvdXRlU2NoZW1hc0Zyb21Sb3V0ZUNvbmZpZyhyb3V0ZSwgJ0RFTEVURScpO1xuICAgIHRoaXMucm91dGVzLnB1c2goe1xuICAgICAgaGFuZGxlcjogYXN5bmMgKHJlcSwgcmVzcG9uc2VUb29sa2l0KSA9PlxuICAgICAgICBhd2FpdCB0aGlzLmhhbmRsZShyb3V0ZVNjaGVtYXMsIHJlcSwgcmVzcG9uc2VUb29sa2l0LCBoYW5kbGVyKSxcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICBwYXRoOiByb3V0ZS5wYXRoLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHJvdXRlcyByZWdpc3RlcmVkIHdpdGggdGhlIHRoaXMgcm91dGVyLlxuICAgKiBAcmV0dXJucyBMaXN0IG9mIHJlZ2lzdGVyZWQgcm91dGVzLlxuICAgKi9cbiAgcHVibGljIGdldFJvdXRlcygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMucm91dGVzXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHNjaGVtYXMgZm9yIGEgcm91dGVcbiAgICpcbiAgICogQHJldHVybnMgUm91dGUgc2NoZW1hcyBpZiBgdmFsaWRhdGVgIGlzIHNwZWNpZmllZCBvbiB0aGUgcm91dGUsIG90aGVyd2lzZVxuICAgKiB1bmRlZmluZWQuXG4gICAqL1xuICBwcml2YXRlIHJvdXRlU2NoZW1hc0Zyb21Sb3V0ZUNvbmZpZzxcbiAgICBQIGV4dGVuZHMgT2JqZWN0VHlwZSxcbiAgICBRIGV4dGVuZHMgT2JqZWN0VHlwZSxcbiAgICBCIGV4dGVuZHMgT2JqZWN0VHlwZVxuICA+KHJvdXRlOiBSb3V0ZUNvbmZpZzxQLCBRLCBCPiwgcm91dGVNZXRob2Q6IFJvdXRlTWV0aG9kKSB7XG4gICAgLy8gVGhlIHR5cGUgZG9lc24ndCBhbGxvdyBgdmFsaWRhdGVgIHRvIGJlIHVuZGVmaW5lZCwgYnV0IGl0IGNhbiBzdGlsbFxuICAgIC8vIGhhcHBlbiB3aGVuIGl0J3MgdXNlZCBmcm9tIEphdmFTY3JpcHQuXG4gICAgaWYgKHJvdXRlLnZhbGlkYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFRoZSBbJHtyb3V0ZU1ldGhvZH1dIGF0IFske1xuICAgICAgICAgIHJvdXRlLnBhdGhcbiAgICAgICAgfV0gZG9lcyBub3QgaGF2ZSBhICd2YWxpZGF0ZScgc3BlY2lmaWVkLiBVc2UgJ2ZhbHNlJyBhcyB0aGUgdmFsdWUgaWYgeW91IHdhbnQgdG8gYnlwYXNzIHZhbGlkYXRpb24uYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm91dGUudmFsaWRhdGUgPyByb3V0ZS52YWxpZGF0ZShzY2hlbWEpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGU8UCBleHRlbmRzIE9iamVjdFR5cGUsIFEgZXh0ZW5kcyBPYmplY3RUeXBlLCBCIGV4dGVuZHMgT2JqZWN0VHlwZT4oXG4gICAgcm91dGVTY2hlbWFzOiBSb3V0ZVNjaGVtYXM8UCwgUSwgQj4gfCB1bmRlZmluZWQsXG4gICAgcmVxdWVzdDogUmVxdWVzdCxcbiAgICByZXNwb25zZVRvb2xraXQ6IFJlc3BvbnNlVG9vbGtpdCxcbiAgICBoYW5kbGVyOiBSZXF1ZXN0SGFuZGxlcjxQLCBRLCBCPlxuICApIHtcbiAgICBsZXQga2liYW5hUmVxdWVzdDogS2liYW5hUmVxdWVzdDxUeXBlT2Y8UD4sIFR5cGVPZjxRPiwgVHlwZU9mPEI+PjtcblxuICAgIHRyeSB7XG4gICAgICBraWJhbmFSZXF1ZXN0ID0gS2liYW5hUmVxdWVzdC5mcm9tKHJlcXVlc3QsIHJvdXRlU2NoZW1hcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gVE9ETyBIYW5kbGUgZmFpbGVkIHZhbGlkYXRpb25cbiAgICAgIHJldHVybiByZXNwb25zZVRvb2xraXQucmVzcG9uc2UoeyBlcnJvcjogZS5tZXNzYWdlIH0pLmNvZGUoNDAwKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qga2liYW5hUmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVyKGtpYmFuYVJlcXVlc3QsIHJlc3BvbnNlRmFjdG9yeSk7XG5cbiAgICAgIGxldCBwYXlsb2FkID0gbnVsbDtcbiAgICAgIGlmIChraWJhbmFSZXNwb25zZS5wYXlsb2FkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgLy8gVE9ETyBEZXNpZ24gYW4gZXJyb3IgZm9ybWF0XG4gICAgICAgIHBheWxvYWQgPSB7IGVycm9yOiBraWJhbmFSZXNwb25zZS5wYXlsb2FkLm1lc3NhZ2UgfTtcbiAgICAgIH0gZWxzZSBpZiAoa2liYW5hUmVzcG9uc2UucGF5bG9hZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBheWxvYWQgPSBraWJhbmFSZXNwb25zZS5wYXlsb2FkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzcG9uc2VUb29sa2l0LnJlc3BvbnNlKHBheWxvYWQpLmNvZGUoa2liYW5hUmVzcG9uc2Uuc3RhdHVzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUT0RPIEhhbmRsZSBgS2liYW5hUmVzcG9uc2VFcnJvcmBcblxuICAgICAgLy8gT3RoZXJ3aXNlIHdlIGRlZmF1bHQgdG8gc29tZXRoaW5nIGFsb25nIHRoZSBsaW5lcyBvZlxuICAgICAgcmV0dXJuIHJlc3BvbnNlVG9vbGtpdC5yZXNwb25zZSh7IGVycm9yOiBlLm1lc3NhZ2UgfSkuY29kZSg1MDApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdHlwZSBSZXF1ZXN0SGFuZGxlcjxQIGV4dGVuZHMgT2JqZWN0VHlwZSwgUSBleHRlbmRzIE9iamVjdFR5cGUsIEIgZXh0ZW5kcyBPYmplY3RUeXBlPiA9IChcbiAgcmVxOiBLaWJhbmFSZXF1ZXN0PFR5cGVPZjxQPiwgVHlwZU9mPFE+LCBUeXBlT2Y8Qj4+LFxuICBjcmVhdGVSZXNwb25zZTogUmVzcG9uc2VGYWN0b3J5XG4pID0+IFByb21pc2U8S2liYW5hUmVzcG9uc2U8YW55Pj47XG4iXX0=