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
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const del_1 = tslib_1.__importDefault(require("del"));
const delete_empty_1 = tslib_1.__importDefault(require("delete-empty"));
const globby_1 = tslib_1.__importDefault(require("globby"));
const normalize_path_1 = tslib_1.__importDefault(require("normalize-path"));
const readAsync = util_1.promisify(fs_1.readFile);
const writeAsync = util_1.promisify(fs_1.writeFile);
class WatchCache {
    constructor(params) {
        this.logWithMetadata = params.logWithMetadata;
        this.outputPath = params.outputPath;
        this.dllsPath = params.dllsPath;
        this.cachePath = params.cachePath;
        this.isInitialized = false;
        this.statePath = '';
        this.cacheState = {};
        this.diskCacheState = {};
        this.cacheState.yarnLockSha = '';
        this.cacheState.optimizerConfigSha = '';
    }
    async tryInit() {
        if (!this.isInitialized) {
            this.statePath = path_1.resolve(this.outputPath, 'watch_optimizer_cache_state.json');
            this.diskCacheState = await this.read();
            this.cacheState.yarnLockSha = await this.buildYarnLockSha();
            this.cacheState.optimizerConfigSha = await this.buildOptimizerConfigSha();
            this.isInitialized = true;
        }
    }
    async tryReset() {
        await this.tryInit();
        if (!this.isResetNeeded()) {
            return;
        }
        await this.reset();
    }
    async reset() {
        this.logWithMetadata(['info', 'optimize:watch_cache'], 'The optimizer watch cache will reset');
        // start by deleting the state file to lower the
        // amount of time that another process might be able to
        // successfully read it once we decide to delete it
        await del_1.default(this.statePath, { force: true });
        // delete everything in optimize/.cache directory
        // except ts-node
        await del_1.default(await globby_1.default([
            normalize_path_1.default(this.cachePath),
            `${normalize_path_1.default(`!${this.cachePath}/ts-node/**`)}`,
        ], { dot: true }));
        // delete some empty folder that could be left
        // from the previous cache path reset action
        await delete_empty_1.default(this.cachePath);
        // delete dlls
        await del_1.default(this.dllsPath);
        // re-write new cache state file
        await this.write();
        this.logWithMetadata(['info', 'optimize:watch_cache'], 'The optimizer watch cache has reset');
    }
    async buildShaWithMultipleFiles(filePaths) {
        const shaHash = crypto_1.createHash('sha1');
        for (const filePath of filePaths) {
            try {
                shaHash.update(await readAsync(filePath, 'utf8'), 'utf8');
            }
            catch (e) {
                /* no-op */
            }
        }
        return shaHash.digest('hex');
    }
    async buildYarnLockSha() {
        const kibanaYarnLock = path_1.resolve(__dirname, '../../../yarn.lock');
        return await this.buildShaWithMultipleFiles([kibanaYarnLock]);
    }
    async buildOptimizerConfigSha() {
        const baseOptimizer = path_1.resolve(__dirname, '../base_optimizer.js');
        const dynamicDllConfigModel = path_1.resolve(__dirname, '../dynamic_dll_plugin/dll_config_model.js');
        const dynamicDllPlugin = path_1.resolve(__dirname, '../dynamic_dll_plugin/dynamic_dll_plugin.js');
        return await this.buildShaWithMultipleFiles([
            baseOptimizer,
            dynamicDllConfigModel,
            dynamicDllPlugin,
        ]);
    }
    isResetNeeded() {
        return this.hasYarnLockChanged() || this.hasOptimizerConfigChanged();
    }
    hasYarnLockChanged() {
        return this.cacheState.yarnLockSha !== this.diskCacheState.yarnLockSha;
    }
    hasOptimizerConfigChanged() {
        return this.cacheState.optimizerConfigSha !== this.diskCacheState.optimizerConfigSha;
    }
    async write() {
        await writeAsync(this.statePath, JSON.stringify(this.cacheState, null, 2), 'utf8');
        this.diskCacheState = this.cacheState;
    }
    async read() {
        try {
            return JSON.parse(await readAsync(this.statePath, 'utf8'));
        }
        catch (error) {
            return {};
        }
    }
}
exports.WatchCache = WatchCache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL29wdGltaXplL3dhdGNoL3dhdGNoX2NhY2hlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvb3B0aW1pemUvd2F0Y2gvd2F0Y2hfY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7O0FBRUgsbUNBQW9DO0FBQ3BDLDJCQUF5QztBQUN6QywrQkFBK0I7QUFDL0IsK0JBQWlDO0FBRWpDLHNEQUFzQjtBQUN0Qix3RUFBdUM7QUFDdkMsNERBQTRCO0FBQzVCLDRFQUFnRDtBQUVoRCxNQUFNLFNBQVMsR0FBRyxnQkFBUyxDQUFDLGFBQVEsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sVUFBVSxHQUFHLGdCQUFTLENBQUMsY0FBUyxDQUFDLENBQUM7QUFjeEMsTUFBYSxVQUFVO0lBVXJCLFlBQVksTUFBYztRQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFFbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFTSxLQUFL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IHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgeyByZWFkRmlsZSwgd3JpdGVGaWxlIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XG5cbmltcG9ydCBkZWwgZnJvbSAnZGVsJztcbmltcG9ydCBkZWxldGVFbXB0eSBmcm9tICdkZWxldGUtZW1wdHknO1xuaW1wb3J0IGdsb2JieSBmcm9tICdnbG9iYnknO1xuaW1wb3J0IG5vcm1hbGl6ZVBvc2l4UGF0aCBmcm9tICdub3JtYWxpemUtcGF0aCc7XG5cbmNvbnN0IHJlYWRBc3luYyA9IHByb21pc2lmeShyZWFkRmlsZSk7XG5jb25zdCB3cml0ZUFzeW5jID0gcHJvbWlzaWZ5KHdyaXRlRmlsZSk7XG5cbmludGVyZmFjZSBQYXJhbXMge1xuICBsb2dXaXRoTWV0YWRhdGE6ICh0YWdzOiBzdHJpbmdbXSwgbWVzc2FnZTogc3RyaW5nLCBtZXRhZGF0YT86IHsgW2tleTogc3RyaW5nXTogYW55IH0pID0+IHZvaWQ7XG4gIG91dHB1dFBhdGg6IHN0cmluZztcbiAgZGxsc1BhdGg6IHN0cmluZztcbiAgY2FjaGVQYXRoOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBXYXRjaENhY2hlU3RhdGVDb250ZW50IHtcbiAgb3B0aW1pemVyQ29uZmlnU2hhPzogc3RyaW5nO1xuICB5YXJuTG9ja1NoYT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFdhdGNoQ2FjaGUge1xuICBwcml2YXRlIHJlYWRvbmx5IGxvZ1dpdGhNZXRhZGF0YTogUGFyYW1zWydsb2dXaXRoTWV0YWRhdGEnXTtcbiAgcHJpdmF0ZSByZWFkb25seSBvdXRwdXRQYXRoOiBQYXJhbXNbJ291dHB1dFBhdGgnXTtcbiAgcHJpdmF0ZSByZWFkb25seSBkbGxzUGF0aDogUGFyYW1zWydkbGxzUGF0aCddO1xuICBwcml2YXRlIHJlYWRvbmx5IGNhY2hlUGF0aDogUGFyYW1zWydjYWNoZVBhdGgnXTtcbiAgcHJpdmF0ZSByZWFkb25seSBjYWNoZVN0YXRlOiBXYXRjaENhY2hlU3RhdGVDb250ZW50O1xuICBwcml2YXRlIHN0YXRlUGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGRpc2tDYWNoZVN0YXRlOiBXYXRjaENhY2hlU3RhdGVDb250ZW50O1xuICBwcml2YXRlIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocGFyYW1zOiBQYXJhbXMpIHtcbiAgICB0aGlzLmxvZ1dpdGhNZXRhZGF0YSA9IHBhcmFtcy5sb2dXaXRoTWV0YWRhdGE7XG4gICAgdGhpcy5vdXRwdXRQYXRoID0gcGFyYW1zLm91dHB1dFBhdGg7XG4gICAgdGhpcy5kbGxzUGF0aCA9IHBhcmFtcy5kbGxzUGF0aDtcbiAgICB0aGlzLmNhY2hlUGF0aCA9IHBhcmFtcy5jYWNoZVBhdGg7XG5cbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXRlUGF0aCA9ICcnO1xuICAgIHRoaXMuY2FjaGVTdGF0ZSA9IHt9O1xuICAgIHRoaXMuZGlza0NhY2hlU3RhdGUgPSB7fTtcbiAgICB0aGlzLmNhY2hlU3RhdGUueWFybkxvY2tTaGEgPSAnJztcbiAgICB0aGlzLmNhY2hlU3RhdGUub3B0aW1pemVyQ29uZmlnU2hhID0gJyc7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdHJ5SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5zdGF0ZVBhdGggPSByZXNvbHZlKHRoaXMub3V0cHV0UGF0aCwgJ3dhdGNoX29wdGltaXplcl9jYWNoZV9zdGF0ZS5qc29uJyk7XG4gICAgICB0aGlzLmRpc2tDYWNoZVN0YXRlID0gYXdhaXQgdGhpcy5yZWFkKCk7XG4gICAgICB0aGlzLmNhY2hlU3RhdGUueWFybkxvY2tTaGEgPSBhd2FpdCB0aGlzLmJ1aWxkWWFybkxvY2tTaGEoKTtcbiAgICAgIHRoaXMuY2FjaGVTdGF0ZS5vcHRpbWl6ZXJDb25maWdTaGEgPSBhd2FpdCB0aGlzLmJ1aWxkT3B0aW1pemVyQ29uZmlnU2hhKCk7XG4gICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB0cnlSZXNldCgpIHtcbiAgICBhd2FpdCB0aGlzLnRyeUluaXQoKTtcblxuICAgIGlmICghdGhpcy5pc1Jlc2V0TmVlZGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVzZXQoKSB7XG4gICAgdGhpcy5sb2dXaXRoTWV0YWRhdGEoWydpbmZvJywgJ29wdGltaXplOndhdGNoX2NhY2hlJ10sICdUaGUgb3B0aW1pemVyIHdhdGNoIGNhY2hlIHdpbGwgcmVzZXQnKTtcblxuICAgIC8vIHN0YXJ0IGJ5IGRlbGV0aW5nIHRoZSBzdGF0ZSBmaWxlIHRvIGxvd2VyIHRoZVxuICAgIC8vIGFtb3VudCBvZiB0aW1lIHRoYXQgYW5vdGhlciBwcm9jZXNzIG1pZ2h0IGJlIGFibGUgdG9cbiAgICAvLyBzdWNjZXNzZnVsbHkgcmVhZCBpdCBvbmNlIHdlIGRlY2lkZSB0byBkZWxldGUgaXRcbiAgICBhd2FpdCBkZWwodGhpcy5zdGF0ZVBhdGgsIHsgZm9yY2U6IHRydWUgfSk7XG5cbiAgICAvLyBkZWxldGUgZXZlcnl0aGluZyBpbiBvcHRpbWl6ZS8uY2FjaGUgZGlyZWN0b3J5XG4gICAgLy8gZXhjZXB0IHRzLW5vZGVcbiAgICBhd2FpdCBkZWwoXG4gICAgICBhd2FpdCBnbG9iYnkoXG4gICAgICAgIFtcbiAgICAgICAgICBub3JtYWxpemVQb3NpeFBhdGgodGhpcy5jYWNoZVBhdGgpLFxuICAgICAgICAgIGAke25vcm1hbGl6ZVBvc2l4UGF0aChgISR7dGhpcy5jYWNoZVBhdGh9L3RzLW5vZGUvKipgKX1gLFxuICAgICAgICBdLFxuICAgICAgICB7IGRvdDogdHJ1ZSB9XG4gICAgICApXG4gICAgKTtcblxuICAgIC8vIGRlbGV0ZSBzb21lIGVtcHR5IGZvbGRlciB0aGF0IGNvdWxkIGJlIGxlZnRcbiAgICAvLyBmcm9tIHRoZSBwcmV2aW91cyBjYWNoZSBwYXRoIHJlc2V0IGFjdGlvblxuICAgIGF3YWl0IGRlbGV0ZUVtcHR5KHRoaXMuY2FjaGVQYXRoKTtcblxuICAgIC8vIGRlbGV0ZSBkbGxzXG4gICAgYXdhaXQgZGVsKHRoaXMuZGxsc1BhdGgpO1xuXG4gICAgLy8gcmUtd3JpdGUgbmV3IGNhY2hlIHN0YXRlIGZpbGVcbiAgICBhd2FpdCB0aGlzLndyaXRlKCk7XG5cbiAgICB0aGlzLmxvZ1dpdGhNZXRhZGF0YShbJ2luZm8nLCAnb3B0aW1pemU6d2F0Y2hfY2FjaGUnXSwgJ1RoZSBvcHRpbWl6ZXIgd2F0Y2ggY2FjaGUgaGFzIHJlc2V0Jyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGJ1aWxkU2hhV2l0aE11bHRpcGxlRmlsZXMoZmlsZVBhdGhzOiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IHNoYUhhc2ggPSBjcmVhdGVIYXNoKCdzaGExJyk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIG9mIGZpbGVQYXRocykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2hhSGFzaC51cGRhdGUoYXdhaXQgcmVhZEFzeW5jKGZpbGVQYXRoLCAndXRmOCcpLCAndXRmOCcpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvKiBuby1vcCAqL1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzaGFIYXNoLmRpZ2VzdCgnaGV4Jyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGJ1aWxkWWFybkxvY2tTaGEoKSB7XG4gICAgY29uc3Qga2liYW5hWWFybkxvY2sgPSByZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uLy4uL3lhcm4ubG9jaycpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYnVpbGRTaGFXaXRoTXVsdGlwbGVGaWxlcyhba2liYW5hWWFybkxvY2tdKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYnVpbGRPcHRpbWl6ZXJDb25maWdTaGEoKSB7XG4gICAgY29uc3QgYmFzZU9wdGltaXplciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vYmFzZV9vcHRpbWl6ZXIuanMnKTtcbiAgICBjb25zdCBkeW5hbWljRGxsQ29uZmlnTW9kZWwgPSByZXNvbHZlKF9fZGlybmFtZSwgJy4uL2R5bmFtaWNfZGxsX3BsdWdpbi9kbGxfY29uZmlnX21vZGVsLmpzJyk7XG4gICAgY29uc3QgZHluYW1pY0RsbFBsdWdpbiA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vZHluYW1pY19kbGxfcGx1Z2luL2R5bmFtaWNfZGxsX3BsdWdpbi5qcycpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYnVpbGRTaGFXaXRoTXVsdGlwbGVGaWxlcyhbXG4gICAgICBiYXNlT3B0aW1pemVyLFxuICAgICAgZHluYW1pY0RsbENvbmZpZ01vZGVsLFxuICAgICAgZHluYW1pY0RsbFBsdWdpbixcbiAgICBdKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNSZXNldE5lZWRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5oYXNZYXJuTG9ja0NoYW5nZWQoKSB8fCB0aGlzLmhhc09wdGltaXplckNvbmZpZ0NoYW5nZWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFzWWFybkxvY2tDaGFuZ2VkKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlU3RhdGUueWFybkxvY2tTaGEgIT09IHRoaXMuZGlza0NhY2hlU3RhdGUueWFybkxvY2tTaGE7XG4gIH1cblxuICBwcml2YXRlIGhhc09wdGltaXplckNvbmZpZ0NoYW5nZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGVTdGF0ZS5vcHRpbWl6ZXJDb25maWdTaGEgIT09IHRoaXMuZGlza0NhY2hlU3RhdGUub3B0aW1pemVyQ29uZmlnU2hhO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB3cml0ZSgpIHtcbiAgICBhd2FpdCB3cml0ZUFzeW5jKHRoaXMuc3RhdGVQYXRoLCBKU09OLnN0cmluZ2lmeSh0aGlzLmNhY2hlU3RhdGUsIG51bGwsIDIpLCAndXRmOCcpO1xuICAgIHRoaXMuZGlza0NhY2hlU3RhdGUgPSB0aGlzLmNhY2hlU3RhdGU7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlYWQoKTogUHJvbWlzZTxXYXRjaENhY2hlU3RhdGVDb250ZW50PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHJlYWRBc3luYyh0aGlzLnN0YXRlUGF0aCwgJ3V0ZjgnKSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==