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
/*
 * This file contains the logic for managing the Kibana index version
 * (the shape of the mappings and documents in the index).
 */
const lodash_1 = require("lodash");
const schema_1 = require("../../schema");
const serialization_1 = require("../../serialization");
const validation_1 = require("../../validation");
const core_1 = require("../core");
const document_migrator_1 = require("../core/document_migrator");
/**
 * Manages the shape of mappings and documents in the Kibana index.
 *
 * @export
 * @class KibanaMigrator
 */
class KibanaMigrator {
    /**
     * Creates an instance of KibanaMigrator.
     *
     * @param opts
     * @prop {KbnServer} kbnServer - An instance of the Kibana server object.
     * @memberof KibanaMigrator
     */
    constructor({ kbnServer }) {
        /**
         * Migrates the mappings and documents in the Kibana index. This will run only
         * once and subsequent calls will return the result of the original call.
         *
         * @returns
         * @memberof KibanaMigrator
         */
        this.awaitMigration = lodash_1.once(async () => {
            const { server } = this.kbnServer;
            // Wait until the plugins have been found an initialized...
            await this.kbnServer.ready();
            // We can't do anything if the elasticsearch plugin has been disabled.
            if (!server.plugins.elasticsearch) {
                server.log(['warning', 'migration'], 'The elasticsearch plugin is disabled. Skipping migrations.');
                return { status: 'skipped' };
            }
            // Wait until elasticsearch is green...
            await server.plugins.elasticsearch.waitUntilReady();
            const config = server.config();
            const migrator = new core_1.IndexMigrator({
                batchSize: config.get('migrations.batchSize'),
                callCluster: server.plugins.elasticsearch.getCluster('admin').callWithInternalUser,
                documentMigrator: this.documentMigrator,
                index: config.get('kibana.index'),
                log: this.log,
                mappingProperties: this.mappingProperties,
                pollInterval: config.get('migrations.pollInterval'),
                scrollDuration: config.get('migrations.scrollDuration'),
                serializer: this.serializer,
            });
            return migrator.migrate();
        });
        this.kbnServer = kbnServer;
        this.serializer = new serialization_1.SavedObjectsSerializer(new schema_1.SavedObjectsSchema(kbnServer.uiExports.savedObjectSchemas));
        this.mappingProperties = mergeProperties(kbnServer.uiExports.savedObjectMappings || []);
        this.log = (meta, message) => kbnServer.server.log(meta, message);
        this.documentMigrator = new document_migrator_1.DocumentMigrator({
            kibanaVersion: kbnServer.version,
            migrations: kbnServer.uiExports.savedObjectMigrations || {},
            validateDoc: validation_1.docValidator(kbnServer.uiExports.savedObjectValidations || {}),
            log: this.log,
        });
    }
    /**
     * Gets the index mappings defined by Kibana's enabled plugins.
     *
     * @returns
     * @memberof KibanaMigrator
     */
    getActiveMappings() {
        return core_1.buildActiveMappings({ properties: this.mappingProperties });
    }
    /**
     * Migrates an individual doc to the latest version, as defined by the plugin migrations.
     *
     * @param {SavedObjectDoc} doc
     * @returns {SavedObjectDoc}
     * @memberof KibanaMigrator
     */
    migrateDocument(doc) {
        return this.documentMigrator.migrate(doc);
    }
}
exports.KibanaMigrator = KibanaMigrator;
/**
 * Merges savedObjectMappings properties into a single object, verifying that
 * no mappings are redefined.
 */
function mergeProperties(mappings) {
    return mappings.reduce((acc, { pluginId, properties }) => {
        const duplicate = Object.keys(properties).find(k => acc.hasOwnProperty(k));
        if (duplicate) {
            throw new Error(`Plugin ${pluginId} is attempting to redefine mapping "${duplicate}".`);
        }
        return Object.assign(acc, properties);
    }, {});
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMva2liYW5hL2tpYmFuYV9taWdyYXRvci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMva2liYW5hL2tpYmFuYV9taWdyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVIOzs7R0FHRztBQUVILG1DQUE4QjtBQUM5Qix5Q0FBZ0Y7QUFDaEYsdURBQTZFO0FBQzdFLGlEQUFnRDtBQUNoRCxrQ0FBb0c7QUFDcEcsaUVBQW1GO0FBOEJuRjs7Ozs7R0FLRztBQUNILE1BQWEsY0FBYztJQWdEekI7Ozs7OztPQU1HO0lBQ0gsWUFBWSxFQUFFLFNBQVMsRUFBNEI7UUF0RG5EOzs7Ozs7V0FNRztRQUNJLG1CQUFjLEdBQUcsYUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBRWxDLDJEQUEyRDtZQUMzRCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFN0Isc0VBQXNFO1lBQ3RFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtnQkFDakMsTUFBTSxDQUFDLEdBQUcsQ0FDUixDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsRUFDeEIsNERBQTRELENBQzdELENBQUM7Z0JBQ0YsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQzthQUM5QjtZQUVELHVDQUF1QztZQUN2QyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRXBELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFhLENBQUM7Z0JBQ2pDLFNBQVMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFjLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQjtnQkFDbkYsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtnQkFDdkMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO2dCQUNqQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtnQkFDekMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7Z0JBQ25ELGNBQWMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDO2dCQUN2RCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7YUFDNUIsQ0FBQyxDQUFDO1lBRUgsT0FBTyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFnQkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNDQUFzQixDQUMxQyxJQUFJLDJCQUFrQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FDL0QsQ0FBQztRQUNGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBYyxFQUFFLE9BQWUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG9DQUFnQixDQUFDO1lBQzNDLGFBQWEsRUFBRSxTQUFTLENBQUMsT0FBTztZQUNoQyxVQUFVLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsSUFBSSxFQUFFO1lBQzNELFdBQVcsRUFBRSx5QkFBWSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLElBQUksRUFBRSxDQUFDO1lBQzNFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztTQUNkLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLGlCQUFpQjtRQUN0QixPQUFPLDBCQUFtQixDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGVBQWUsQ0FBQyxHQUFtQjtRQUN4QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNGO0FBMUZELHdDQTBGQztBQUVEOzs7R0FHRztBQUNILFNBQVMsZUFBZSxDQUFDLFFBQWU7SUFDdEMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUU7UUFDdkQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsUUFBUSx1Q0FBdUMsU0FBUyxJQUFJLENBQUMsQ0FBQztTQUN6RjtRQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDeEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBsb2dpYyBmb3IgbWFuYWdpbmcgdGhlIEtpYmFuYSBpbmRleCB2ZXJzaW9uXG4gKiAodGhlIHNoYXBlIG9mIHRoZSBtYXBwaW5ncyBhbmQgZG9jdW1lbnRzIGluIHRoZSBpbmRleCkuXG4gKi9cblxuaW1wb3J0IHsgb25jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBTYXZlZE9iamVjdHNTY2hlbWEsIFNhdmVkT2JqZWN0c1NjaGVtYURlZmluaXRpb24gfSBmcm9tICcuLi8uLi9zY2hlbWEnO1xuaW1wb3J0IHsgU2F2ZWRPYmplY3REb2MsIFNhdmVkT2JqZWN0c1NlcmlhbGl6ZXIgfSBmcm9tICcuLi8uLi9zZXJpYWxpemF0aW9uJztcbmltcG9ydCB7IGRvY1ZhbGlkYXRvciB9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24nO1xuaW1wb3J0IHsgYnVpbGRBY3RpdmVNYXBwaW5ncywgQ2FsbENsdXN0ZXIsIEluZGV4TWlncmF0b3IsIExvZ0ZuLCBNYXBwaW5nUHJvcGVydGllcyB9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHsgRG9jdW1lbnRNaWdyYXRvciwgVmVyc2lvbmVkVHJhbnNmb3JtZXIgfSBmcm9tICcuLi9jb3JlL2RvY3VtZW50X21pZ3JhdG9yJztcblxuZXhwb3J0IGludGVyZmFjZSBLYm5TZXJ2ZXIge1xuICBzZXJ2ZXI6IFNlcnZlcjtcbiAgdmVyc2lvbjogc3RyaW5nO1xuICByZWFkeTogKCkgPT4gUHJvbWlzZTxhbnk+O1xuICB1aUV4cG9ydHM6IHtcbiAgICBzYXZlZE9iamVjdE1hcHBpbmdzOiBhbnlbXTtcbiAgICBzYXZlZE9iamVjdE1pZ3JhdGlvbnM6IGFueTtcbiAgICBzYXZlZE9iamVjdFZhbGlkYXRpb25zOiBhbnk7XG4gICAgc2F2ZWRPYmplY3RTY2hlbWFzOiBTYXZlZE9iamVjdHNTY2hlbWFEZWZpbml0aW9uO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgU2VydmVyIHtcbiAgbG9nOiBMb2dGbjtcbiAgY29uZmlnOiAoKSA9PiB7XG4gICAgZ2V0OiB7XG4gICAgICAocGF0aDogJ2tpYmFuYS5pbmRleCcgfCAnbWlncmF0aW9ucy5zY3JvbGxEdXJhdGlvbicpOiBzdHJpbmc7XG4gICAgICAocGF0aDogJ21pZ3JhdGlvbnMuYmF0Y2hTaXplJyB8ICdtaWdyYXRpb25zLnBvbGxJbnRlcnZhbCcpOiBudW1iZXI7XG4gICAgfTtcbiAgfTtcbiAgcGx1Z2luczogeyBlbGFzdGljc2VhcmNoOiBFbGFzdGljc2VhcmNoUGx1Z2luIHwgdW5kZWZpbmVkIH07XG59XG5cbmludGVyZmFjZSBFbGFzdGljc2VhcmNoUGx1Z2luIHtcbiAgZ2V0Q2x1c3RlcjogKChuYW1lOiAnYWRtaW4nKSA9PiB7IGNhbGxXaXRoSW50ZXJuYWxVc2VyOiBDYWxsQ2x1c3RlciB9KTtcbiAgd2FpdFVudGlsUmVhZHk6ICgpID0+IFByb21pc2U8YW55Pjtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBzaGFwZSBvZiBtYXBwaW5ncyBhbmQgZG9jdW1lbnRzIGluIHRoZSBLaWJhbmEgaW5kZXguXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIEtpYmFuYU1pZ3JhdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBLaWJhbmFNaWdyYXRvciB7XG4gIC8qKlxuICAgKiBNaWdyYXRlcyB0aGUgbWFwcGluZ3MgYW5kIGRvY3VtZW50cyBpbiB0aGUgS2liYW5hIGluZGV4LiBUaGlzIHdpbGwgcnVuIG9ubHlcbiAgICogb25jZSBhbmQgc3Vic2VxdWVudCBjYWxscyB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBvcmlnaW5hbCBjYWxsLlxuICAgKlxuICAgKiBAcmV0dXJuc1xuICAgKiBAbWVtYmVyb2YgS2liYW5hTWlncmF0b3JcbiAgICovXG4gIHB1YmxpYyBhd2FpdE1pZ3JhdGlvbiA9IG9uY2UoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgc2VydmVyIH0gPSB0aGlzLmtiblNlcnZlcjtcblxuICAgIC8vIFdhaXQgdW50aWwgdGhlIHBsdWdpbnMgaGF2ZSBiZWVuIGZvdW5kIGFuIGluaXRpYWxpemVkLi4uXG4gICAgYXdhaXQgdGhpcy5rYm5TZXJ2ZXIucmVhZHkoKTtcblxuICAgIC8vIFdlIGNhbid0IGRvIGFueXRoaW5nIGlmIHRoZSBlbGFzdGljc2VhcmNoIHBsdWdpbiBoYXMgYmVlbiBkaXNhYmxlZC5cbiAgICBpZiAoIXNlcnZlci5wbHVnaW5zLmVsYXN0aWNzZWFyY2gpIHtcbiAgICAgIHNlcnZlci5sb2coXG4gICAgICAgIFsnd2FybmluZycsICdtaWdyYXRpb24nXSxcbiAgICAgICAgJ1RoZSBlbGFzdGljc2VhcmNoIHBsdWdpbiBpcyBkaXNhYmxlZC4gU2tpcHBpbmcgbWlncmF0aW9ucy4nXG4gICAgICApO1xuICAgICAgcmV0dXJuIHsgc3RhdHVzOiAnc2tpcHBlZCcgfTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHVudGlsIGVsYXN0aWNzZWFyY2ggaXMgZ3JlZW4uLi5cbiAgICBhd2FpdCBzZXJ2ZXIucGx1Z2lucy5lbGFzdGljc2VhcmNoLndhaXRVbnRpbFJlYWR5KCk7XG5cbiAgICBjb25zdCBjb25maWcgPSBzZXJ2ZXIuY29uZmlnKCk7XG4gICAgY29uc3QgbWlncmF0b3IgPSBuZXcgSW5kZXhNaWdyYXRvcih7XG4gICAgICBiYXRjaFNpemU6IGNvbmZpZy5nZXQoJ21pZ3JhdGlvbnMuYmF0Y2hTaXplJyksXG4gICAgICBjYWxsQ2x1c3Rlcjogc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaCEuZ2V0Q2x1c3RlcignYWRtaW4nKS5jYWxsV2l0aEludGVybmFsVXNlcixcbiAgICAgIGRvY3VtZW50TWlncmF0b3I6IHRoaXMuZG9jdW1lbnRNaWdyYXRvcixcbiAgICAgIGluZGV4OiBjb25maWcuZ2V0KCdraWJhbmEuaW5kZXgnKSxcbiAgICAgIGxvZzogdGhpcy5sb2csXG4gICAgICBtYXBwaW5nUHJvcGVydGllczogdGhpcy5tYXBwaW5nUHJvcGVydGllcyxcbiAgICAgIHBvbGxJbnRlcnZhbDogY29uZmlnLmdldCgnbWlncmF0aW9ucy5wb2xsSW50ZXJ2YWwnKSxcbiAgICAgIHNjcm9sbER1cmF0aW9uOiBjb25maWcuZ2V0KCdtaWdyYXRpb25zLnNjcm9sbER1cmF0aW9uJyksXG4gICAgICBzZXJpYWxpemVyOiB0aGlzLnNlcmlhbGl6ZXIsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWlncmF0b3IubWlncmF0ZSgpO1xuICB9KTtcblxuICBwcml2YXRlIGtiblNlcnZlcjogS2JuU2VydmVyO1xuICBwcml2YXRlIGRvY3VtZW50TWlncmF0b3I6IFZlcnNpb25lZFRyYW5zZm9ybWVyO1xuICBwcml2YXRlIG1hcHBpbmdQcm9wZXJ0aWVzOiBNYXBwaW5nUHJvcGVydGllcztcbiAgcHJpdmF0ZSBsb2c6IExvZ0ZuO1xuICBwcml2YXRlIHNlcmlhbGl6ZXI6IFNhdmVkT2JqZWN0c1NlcmlhbGl6ZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgS2liYW5hTWlncmF0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzXG4gICAqIEBwcm9wIHtLYm5TZXJ2ZXJ9IGtiblNlcnZlciAtIEFuIGluc3RhbmNlIG9mIHRoZSBLaWJhbmEgc2VydmVyIG9iamVjdC5cbiAgICogQG1lbWJlcm9mIEtpYmFuYU1pZ3JhdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7IGtiblNlcnZlciB9OiB7IGtiblNlcnZlcjogS2JuU2VydmVyIH0pIHtcbiAgICB0aGlzLmtiblNlcnZlciA9IGtiblNlcnZlcjtcbiAgICB0aGlzLnNlcmlhbGl6ZXIgPSBuZXcgU2F2ZWRPYmplY3RzU2VyaWFsaXplcihcbiAgICAgIG5ldyBTYXZlZE9iamVjdHNTY2hlbWEoa2JuU2VydmVyLnVpRXhwb3J0cy5zYXZlZE9iamVjdFNjaGVtYXMpXG4gICAgKTtcbiAgICB0aGlzLm1hcHBpbmdQcm9wZXJ0aWVzID0gbWVyZ2VQcm9wZXJ0aWVzKGtiblNlcnZlci51aUV4cG9ydHMuc2F2ZWRPYmplY3RNYXBwaW5ncyB8fCBbXSk7XG4gICAgdGhpcy5sb2cgPSAobWV0YTogc3RyaW5nW10sIG1lc3NhZ2U6IHN0cmluZykgPT4ga2JuU2VydmVyLnNlcnZlci5sb2cobWV0YSwgbWVzc2FnZSk7XG4gICAgdGhpcy5kb2N1bWVudE1pZ3JhdG9yID0gbmV3IERvY3VtZW50TWlncmF0b3Ioe1xuICAgICAga2liYW5hVmVyc2lvbjoga2JuU2VydmVyLnZlcnNpb24sXG4gICAgICBtaWdyYXRpb25zOiBrYm5TZXJ2ZXIudWlFeHBvcnRzLnNhdmVkT2JqZWN0TWlncmF0aW9ucyB8fCB7fSxcbiAgICAgIHZhbGlkYXRlRG9jOiBkb2NWYWxpZGF0b3Ioa2JuU2VydmVyLnVpRXhwb3J0cy5zYXZlZE9iamVjdFZhbGlkYXRpb25zIHx8IHt9KSxcbiAgICAgIGxvZzogdGhpcy5sb2csXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5kZXggbWFwcGluZ3MgZGVmaW5lZCBieSBLaWJhbmEncyBlbmFibGVkIHBsdWdpbnMuXG4gICAqXG4gICAqIEByZXR1cm5zXG4gICAqIEBtZW1iZXJvZiBLaWJhbmFNaWdyYXRvclxuICAgKi9cbiAgcHVibGljIGdldEFjdGl2ZU1hcHBpbmdzKCkge1xuICAgIHJldHVybiBidWlsZEFjdGl2ZU1hcHBpbmdzKHsgcHJvcGVydGllczogdGhpcy5tYXBwaW5nUHJvcGVydGllcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNaWdyYXRlcyBhbiBpbmRpdmlkdWFsIGRvYyB0byB0aGUgbGF0ZXN0IHZlcnNpb24sIGFzIGRlZmluZWQgYnkgdGhlIHBsdWdpbiBtaWdyYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge1NhdmVkT2JqZWN0RG9jfSBkb2NcbiAgICogQHJldHVybnMge1NhdmVkT2JqZWN0RG9jfVxuICAgKiBAbWVtYmVyb2YgS2liYW5hTWlncmF0b3JcbiAgICovXG4gIHB1YmxpYyBtaWdyYXRlRG9jdW1lbnQoZG9jOiBTYXZlZE9iamVjdERvYyk6IFNhdmVkT2JqZWN0RG9jIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudE1pZ3JhdG9yLm1pZ3JhdGUoZG9jKTtcbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlcyBzYXZlZE9iamVjdE1hcHBpbmdzIHByb3BlcnRpZXMgaW50byBhIHNpbmdsZSBvYmplY3QsIHZlcmlmeWluZyB0aGF0XG4gKiBubyBtYXBwaW5ncyBhcmUgcmVkZWZpbmVkLlxuICovXG5mdW5jdGlvbiBtZXJnZVByb3BlcnRpZXMobWFwcGluZ3M6IGFueVtdKTogTWFwcGluZ1Byb3BlcnRpZXMge1xuICByZXR1cm4gbWFwcGluZ3MucmVkdWNlKChhY2MsIHsgcGx1Z2luSWQsIHByb3BlcnRpZXMgfSkgPT4ge1xuICAgIGNvbnN0IGR1cGxpY2F0ZSA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZpbmQoayA9PiBhY2MuaGFzT3duUHJvcGVydHkoaykpO1xuICAgIGlmIChkdXBsaWNhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGx1Z2luICR7cGx1Z2luSWR9IGlzIGF0dGVtcHRpbmcgdG8gcmVkZWZpbmUgbWFwcGluZyBcIiR7ZHVwbGljYXRlfVwiLmApO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHByb3BlcnRpZXMpO1xuICB9LCB7fSk7XG59XG4iXX0=