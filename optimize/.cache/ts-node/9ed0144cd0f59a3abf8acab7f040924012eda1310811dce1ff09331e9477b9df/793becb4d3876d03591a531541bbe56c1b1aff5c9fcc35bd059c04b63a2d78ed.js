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
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const lodash_1 = require("lodash");
const ensure_deep_object_1 = require("./ensure_deep_object");
const readYaml = (path) => js_yaml_1.safeLoad(fs_1.readFileSync(path, 'utf8'));
function replaceEnvVarRefs(val) {
    return val.replace(/\$\{(\w+)\}/g, (match, envVarName) => {
        const envVarValue = process.env[envVarName];
        if (envVarValue !== undefined) {
            return envVarValue;
        }
        throw new Error(`Unknown environment variable referenced in config : ${envVarName}`);
    });
}
function merge(target, value, key) {
    if ((lodash_1.isPlainObject(value) || Array.isArray(value)) && Object.keys(value).length > 0) {
        for (const [subKey, subVal] of Object.entries(value)) {
            merge(target, subVal, key ? `${key}.${subKey}` : subKey);
        }
    }
    else if (key !== undefined) {
        lodash_1.set(target, key, typeof value === 'string' ? replaceEnvVarRefs(value) : value);
    }
    return target;
}
/** @internal */
exports.getConfigFromFiles = (configFiles) => {
    let mergedYaml = {};
    for (const configFile of configFiles) {
        const yaml = readYaml(configFile);
        if (yaml !== null) {
            mergedYaml = merge(mergedYaml, yaml);
        }
    }
    return ensure_deep_object_1.ensureDeepObject(mergedYaml);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9yZWFkX2NvbmZpZy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9yZWFkX2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVILDJCQUFrQztBQUNsQyxxQ0FBbUM7QUFFbkMsbUNBQTRDO0FBQzVDLDZEQUF3RDtBQUV4RCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsa0JBQVEsQ0FBQyxpQkFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBRXhFLFNBQVMsaUJBQWlCLENBQUMsR0FBVztJQUNwQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzdCLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUN2RixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxNQUEyQixFQUFFLEtBQVUsRUFBRSxHQUFZO0lBQ2xFLElBQUksQ0FBQyxzQkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDbkYsS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEQsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUQ7S0FDRjtTQUFNLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUM1QixZQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoRjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxnQkFBZ0I7QUFDSCxRQUFBLGtCQUFrQixHQUFHLENBQUMsV0FBa0MsRUFBRSxFQUFFO0lBQ3ZFLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUVwQixLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsRUFBRTtRQUNwQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3RDO0tBQ0Y7SUFFRCxPQUFPLHFDQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBzYWZlTG9hZCB9IGZyb20gJ2pzLXlhbWwnO1xuXG5pbXBvcnQgeyBpc1BsYWluT2JqZWN0LCBzZXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZW5zdXJlRGVlcE9iamVjdCB9IGZyb20gJy4vZW5zdXJlX2RlZXBfb2JqZWN0JztcblxuY29uc3QgcmVhZFlhbWwgPSAocGF0aDogc3RyaW5nKSA9PiBzYWZlTG9hZChyZWFkRmlsZVN5bmMocGF0aCwgJ3V0ZjgnKSk7XG5cbmZ1bmN0aW9uIHJlcGxhY2VFbnZWYXJSZWZzKHZhbDogc3RyaW5nKSB7XG4gIHJldHVybiB2YWwucmVwbGFjZSgvXFwkXFx7KFxcdyspXFx9L2csIChtYXRjaCwgZW52VmFyTmFtZSkgPT4ge1xuICAgIGNvbnN0IGVudlZhclZhbHVlID0gcHJvY2Vzcy5lbnZbZW52VmFyTmFtZV07XG4gICAgaWYgKGVudlZhclZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBlbnZWYXJWYWx1ZTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZW52aXJvbm1lbnQgdmFyaWFibGUgcmVmZXJlbmNlZCBpbiBjb25maWcgOiAke2VudlZhck5hbWV9YCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtZXJnZSh0YXJnZXQ6IFJlY29yZDxzdHJpbmcsIGFueT4sIHZhbHVlOiBhbnksIGtleT86IHN0cmluZykge1xuICBpZiAoKGlzUGxhaW5PYmplY3QodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgIGZvciAoY29uc3QgW3N1YktleSwgc3ViVmFsXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcbiAgICAgIG1lcmdlKHRhcmdldCwgc3ViVmFsLCBrZXkgPyBgJHtrZXl9LiR7c3ViS2V5fWAgOiBzdWJLZXkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuICAgIHNldCh0YXJnZXQsIGtleSwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHJlcGxhY2VFbnZWYXJSZWZzKHZhbHVlKSA6IHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBjb25zdCBnZXRDb25maWdGcm9tRmlsZXMgPSAoY29uZmlnRmlsZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPikgPT4ge1xuICBsZXQgbWVyZ2VkWWFtbCA9IHt9O1xuXG4gIGZvciAoY29uc3QgY29uZmlnRmlsZSBvZiBjb25maWdGaWxlcykge1xuICAgIGNvbnN0IHlhbWwgPSByZWFkWWFtbChjb25maWdGaWxlKTtcbiAgICBpZiAoeWFtbCAhPT0gbnVsbCkge1xuICAgICAgbWVyZ2VkWWFtbCA9IG1lcmdlKG1lcmdlZFlhbWwsIHlhbWwpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnN1cmVEZWVwT2JqZWN0KG1lcmdlZFlhbWwpO1xufTtcbiJdfQ==