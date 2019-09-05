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
const determine_migration_action_1 = require("./determine_migration_action");
const Index = tslib_1.__importStar(require("./elastic_index"));
const migrate_raw_docs_1 = require("./migrate_raw_docs");
const migration_context_1 = require("./migration_context");
const migration_coordinator_1 = require("./migration_coordinator");
/*
 * Core logic for migrating the mappings and documents in an index.
 */
class IndexMigrator {
    /**
     * Creates an instance of IndexMigrator.
     *
     * @param {MigrationOpts} opts
     */
    constructor(opts) {
        this.opts = opts;
    }
    /**
     * Migrates the index, or, if another Kibana instance appears to be running the migration,
     * waits for the migration to complete.
     *
     * @returns {Promise<MigrationResult>}
     */
    async migrate() {
        const context = await migration_context_1.migrationContext(this.opts);
        return migration_coordinator_1.coordinateMigration({
            log: context.log,
            pollInterval: context.pollInterval,
            async isMigrated() {
                const action = await requiredAction(context);
                return action === determine_migration_action_1.MigrationAction.None;
            },
            async runMigration() {
                const action = await requiredAction(context);
                if (action === determine_migration_action_1.MigrationAction.None) {
                    return { status: 'skipped' };
                }
                if (action === determine_migration_action_1.MigrationAction.Patch) {
                    return patchSourceMappings(context);
                }
                return migrateIndex(context);
            },
        });
    }
}
exports.IndexMigrator = IndexMigrator;
/**
 * Determines what action the migration system needs to take (none, patch, migrate).
 */
async function requiredAction(context) {
    const { callCluster, alias, documentMigrator, dest } = context;
    const hasMigrations = await Index.migrationsUpToDate(callCluster, alias, documentMigrator.migrationVersion);
    if (!hasMigrations) {
        return determine_migration_action_1.MigrationAction.Migrate;
    }
    const refreshedSource = await Index.fetchInfo(callCluster, alias);
    if (!refreshedSource.aliases[alias]) {
        return determine_migration_action_1.MigrationAction.Migrate;
    }
    return determine_migration_action_1.determineMigrationAction(refreshedSource.mappings, dest.mappings);
}
/**
 * Applies the latest mappings to the index.
 */
async function patchSourceMappings(context) {
    const { callCluster, log, source, dest } = context;
    log.info(`Patching ${source.indexName} mappings`);
    await Index.putMappings(callCluster, source.indexName, dest.mappings);
    return { status: 'patched' };
}
/**
 * Performs an index migration if the source index exists, otherwise
 * this simply creates the dest index with the proper mappings.
 */
async function migrateIndex(context) {
    const startTime = Date.now();
    const { callCluster, alias, source, dest, log } = context;
    log.info(`Creating index ${dest.indexName}.`);
    await Index.createIndex(callCluster, dest.indexName, dest.mappings);
    await migrateSourceToDest(context);
    log.info(`Pointing alias ${alias} to ${dest.indexName}.`);
    await Index.claimAlias(callCluster, dest.indexName, alias);
    const result = {
        status: 'migrated',
        destIndex: dest.indexName,
        sourceIndex: source.indexName,
        elapsedMs: Date.now() - startTime,
    };
    log.info(`Finished in ${result.elapsedMs}ms.`);
    return result;
}
/**
 * Moves all docs from sourceIndex to destIndex, migrating each as necessary.
 * This moves documents from the concrete index, rather than the alias, to prevent
 * a situation where the alias moves out from under us as we're migrating docs.
 */
async function migrateSourceToDest(context) {
    const { callCluster, alias, dest, source, batchSize } = context;
    const { scrollDuration, documentMigrator, log, serializer } = context;
    if (!source.exists) {
        return;
    }
    if (!source.aliases[alias]) {
        log.info(`Reindexing ${alias} to ${source.indexName}`);
        await Index.convertToAlias(callCluster, source, alias, batchSize);
    }
    const read = Index.reader(callCluster, source.indexName, { batchSize, scrollDuration });
    log.info(`Migrating ${source.indexName} saved objects to ${dest.indexName}`);
    while (true) {
        const docs = await read();
        if (!docs || !docs.length) {
            return;
        }
        log.debug(`Migrating saved objects ${docs.map(d => d._id).join(', ')}`);
        await Index.write(callCluster, dest.indexName, migrate_raw_docs_1.migrateRawDocs(serializer, documentMigrator.migrate, docs));
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9pbmRleF9taWdyYXRvci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9pbmRleF9taWdyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOzs7QUFFSCw2RUFBeUY7QUFDekYsK0RBQXlDO0FBQ3pDLHlEQUFvRDtBQUNwRCwyREFBK0U7QUFDL0UsbUVBQStFO0FBRS9FOztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBR3hCOzs7O09BSUc7SUFDSCxZQUFZLElBQW1CO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLE1BQU0sT0FBTyxHQUFHLE1BQU0sb0NBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxELE9BQU8sMkNBQW1CLENBQUM7WUFDekIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1lBRWhCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtZQUVsQyxLQUFLLENBQUMsVUFBVTtnQkFDZCxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0MsT0FBTyxNQUFNLEtBQUssNENBQWUsQ0FBQyxJQUFJLENBQUM7WUFDekMsQ0FBQztZQUVELEtBQUssQ0FBQyxZQUFZO2dCQUNoQixNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFN0MsSUFBSSxNQUFNLEtBQUssNENBQWUsQ0FBQyxJQUFJLEVBQUU7b0JBQ25DLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FB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QUFLLENBQUMsS0FBSyxDQUNmLFdBQVcsRUFDWCxJQUFJLENBQUMsU0FBUyxFQUNkLGlDQUFjLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FDM0QsQ0FBQztLQUNIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBkZXRlcm1pbmVNaWdyYXRpb25BY3Rpb24sIE1pZ3JhdGlvbkFjdGlvbiB9IGZyb20gJy4vZGV0ZXJtaW5lX21pZ3JhdGlvbl9hY3Rpb24nO1xuaW1wb3J0ICogYXMgSW5kZXggZnJvbSAnLi9lbGFzdGljX2luZGV4JztcbmltcG9ydCB7IG1pZ3JhdGVSYXdEb2NzIH0gZnJvbSAnLi9taWdyYXRlX3Jhd19kb2NzJztcbmltcG9ydCB7IENvbnRleHQsIG1pZ3JhdGlvbkNvbnRleHQsIE1pZ3JhdGlvbk9wdHMgfSBmcm9tICcuL21pZ3JhdGlvbl9jb250ZXh0JztcbmltcG9ydCB7IGNvb3JkaW5hdGVNaWdyYXRpb24sIE1pZ3JhdGlvblJlc3VsdCB9IGZyb20gJy4vbWlncmF0aW9uX2Nvb3JkaW5hdG9yJztcblxuLypcbiAqIENvcmUgbG9naWMgZm9yIG1pZ3JhdGluZyB0aGUgbWFwcGluZ3MgYW5kIGRvY3VtZW50cyBpbiBhbiBpbmRleC5cbiAqL1xuZXhwb3J0IGNsYXNzIEluZGV4TWlncmF0b3Ige1xuICBwcml2YXRlIG9wdHM6IE1pZ3JhdGlvbk9wdHM7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgSW5kZXhNaWdyYXRvci5cbiAgICpcbiAgICogQHBhcmFtIHtNaWdyYXRpb25PcHRzfSBvcHRzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzOiBNaWdyYXRpb25PcHRzKSB7XG4gICAgdGhpcy5vcHRzID0gb3B0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBNaWdyYXRlcyB0aGUgaW5kZXgsIG9yLCBpZiBhbm90aGVyIEtpYmFuYSBpbnN0YW5jZSBhcHBlYXJzIHRvIGJlIHJ1bm5pbmcgdGhlIG1pZ3JhdGlvbixcbiAgICogd2FpdHMgZm9yIHRoZSBtaWdyYXRpb24gdG8gY29tcGxldGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE1pZ3JhdGlvblJlc3VsdD59XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgbWlncmF0ZSgpOiBQcm9taXNlPE1pZ3JhdGlvblJlc3VsdD4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSBhd2FpdCBtaWdyYXRpb25Db250ZXh0KHRoaXMub3B0cyk7XG5cbiAgICByZXR1cm4gY29vcmRpbmF0ZU1pZ3JhdGlvbih7XG4gICAgICBsb2c6IGNvbnRleHQubG9nLFxuXG4gICAgICBwb2xsSW50ZXJ2YWw6IGNvbnRleHQucG9sbEludGVydmFsLFxuXG4gICAgICBhc3luYyBpc01pZ3JhdGVkKCkge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBhd2FpdCByZXF1aXJlZEFjdGlvbihjb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gTWlncmF0aW9uQWN0aW9uLk5vbmU7XG4gICAgICB9LFxuXG4gICAgICBhc3luYyBydW5NaWdyYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGF3YWl0IHJlcXVpcmVkQWN0aW9uKGNvbnRleHQpO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT09IE1pZ3JhdGlvbkFjdGlvbi5Ob25lKSB7XG4gICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAnc2tpcHBlZCcgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhY3Rpb24gPT09IE1pZ3JhdGlvbkFjdGlvbi5QYXRjaCkge1xuICAgICAgICAgIHJldHVybiBwYXRjaFNvdXJjZU1hcHBpbmdzKGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1pZ3JhdGVJbmRleChjb250ZXh0KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoYXQgYWN0aW9uIHRoZSBtaWdyYXRpb24gc3lzdGVtIG5lZWRzIHRvIHRha2UgKG5vbmUsIHBhdGNoLCBtaWdyYXRlKS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVxdWlyZWRBY3Rpb24oY29udGV4dDogQ29udGV4dCk6IFByb21pc2U8TWlncmF0aW9uQWN0aW9uPiB7XG4gIGNvbnN0IHsgY2FsbENsdXN0ZXIsIGFsaWFzLCBkb2N1bWVudE1pZ3JhdG9yLCBkZXN0IH0gPSBjb250ZXh0O1xuXG4gIGNvbnN0IGhhc01pZ3JhdGlvbnMgPSBhd2FpdCBJbmRleC5taWdyYXRpb25zVXBUb0RhdGUoXG4gICAgY2FsbENsdXN0ZXIsXG4gICAgYWxpYXMsXG4gICAgZG9jdW1lbnRNaWdyYXRvci5taWdyYXRpb25WZXJzaW9uXG4gICk7XG5cbiAgaWYgKCFoYXNNaWdyYXRpb25zKSB7XG4gICAgcmV0dXJuIE1pZ3JhdGlvbkFjdGlvbi5NaWdyYXRlO1xuICB9XG5cbiAgY29uc3QgcmVmcmVzaGVkU291cmNlID0gYXdhaXQgSW5kZXguZmV0Y2hJbmZvKGNhbGxDbHVzdGVyLCBhbGlhcyk7XG5cbiAgaWYgKCFyZWZyZXNoZWRTb3VyY2UuYWxpYXNlc1thbGlhc10pIHtcbiAgICByZXR1cm4gTWlncmF0aW9uQWN0aW9uLk1pZ3JhdGU7XG4gIH1cblxuICByZXR1cm4gZGV0ZXJtaW5lTWlncmF0aW9uQWN0aW9uKHJlZnJlc2hlZFNvdXJjZS5tYXBwaW5ncywgZGVzdC5tYXBwaW5ncyk7XG59XG5cbi8qKlxuICogQXBwbGllcyB0aGUgbGF0ZXN0IG1hcHBpbmdzIHRvIHRoZSBpbmRleC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGF0Y2hTb3VyY2VNYXBwaW5ncyhjb250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxNaWdyYXRpb25SZXN1bHQ+IHtcbiAgY29uc3QgeyBjYWxsQ2x1c3RlciwgbG9nLCBzb3VyY2UsIGRlc3QgfSA9IGNvbnRleHQ7XG5cbiAgbG9nLmluZm8oYFBhdGNoaW5nICR7c291cmNlLmluZGV4TmFtZX0gbWFwcGluZ3NgKTtcblxuICBhd2FpdCBJbmRleC5wdXRNYXBwaW5ncyhjYWxsQ2x1c3Rlciwgc291cmNlLmluZGV4TmFtZSwgZGVzdC5tYXBwaW5ncyk7XG5cbiAgcmV0dXJuIHsgc3RhdHVzOiAncGF0Y2hlZCcgfTtcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhbiBpbmRleCBtaWdyYXRpb24gaWYgdGhlIHNvdXJjZSBpbmRleCBleGlzdHMsIG90aGVyd2lzZVxuICogdGhpcyBzaW1wbHkgY3JlYXRlcyB0aGUgZGVzdCBpbmRleCB3aXRoIHRoZSBwcm9wZXIgbWFwcGluZ3MuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVJbmRleChjb250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxNaWdyYXRpb25SZXN1bHQ+IHtcbiAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgeyBjYWxsQ2x1c3RlciwgYWxpYXMsIHNvdXJjZSwgZGVzdCwgbG9nIH0gPSBjb250ZXh0O1xuXG4gIGxvZy5pbmZvKGBDcmVhdGluZyBpbmRleCAke2Rlc3QuaW5kZXhOYW1lfS5gKTtcblxuICBhd2FpdCBJbmRleC5jcmVhdGVJbmRleChjYWxsQ2x1c3RlciwgZGVzdC5pbmRleE5hbWUsIGRlc3QubWFwcGluZ3MpO1xuXG4gIGF3YWl0IG1pZ3JhdGVTb3VyY2VUb0Rlc3QoY29udGV4dCk7XG5cbiAgbG9nLmluZm8oYFBvaW50aW5nIGFsaWFzICR7YWxpYXN9IHRvICR7ZGVzdC5pbmRleE5hbWV9LmApO1xuXG4gIGF3YWl0IEluZGV4LmNsYWltQWxpYXMoY2FsbENsdXN0ZXIsIGRlc3QuaW5kZXhOYW1lLCBhbGlhcyk7XG5cbiAgY29uc3QgcmVzdWx0OiBNaWdyYXRpb25SZXN1bHQgPSB7XG4gICAgc3RhdHVzOiAnbWlncmF0ZWQnLFxuICAgIGRlc3RJbmRleDogZGVzdC5pbmRleE5hbWUsXG4gICAgc291cmNlSW5kZXg6IHNvdXJjZS5pbmRleE5hbWUsXG4gICAgZWxhcHNlZE1zOiBEYXRlLm5vdygpIC0gc3RhcnRUaW1lLFxuICB9O1xuXG4gIGxvZy5pbmZvKGBGaW5pc2hlZCBpbiAke3Jlc3VsdC5lbGFwc2VkTXN9bXMuYCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBNb3ZlcyBhbGwgZG9jcyBmcm9tIHNvdXJjZUluZGV4IHRvIGRlc3RJbmRleCwgbWlncmF0aW5nIGVhY2ggYXMgbmVjZXNzYXJ5LlxuICogVGhpcyBtb3ZlcyBkb2N1bWVudHMgZnJvbSB0aGUgY29uY3JldGUgaW5kZXgsIHJhdGhlciB0aGFuIHRoZSBhbGlhcywgdG8gcHJldmVudFxuICogYSBzaXR1YXRpb24gd2hlcmUgdGhlIGFsaWFzIG1vdmVzIG91dCBmcm9tIHVuZGVyIHVzIGFzIHdlJ3JlIG1pZ3JhdGluZyBkb2NzLlxuICovXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRlU291cmNlVG9EZXN0KGNvbnRleHQ6IENvbnRleHQpIHtcbiAgY29uc3QgeyBjYWxsQ2x1c3RlciwgYWxpYXMsIGRlc3QsIHNvdXJjZSwgYmF0Y2hTaXplIH0gPSBjb250ZXh0O1xuICBjb25zdCB7IHNjcm9sbER1cmF0aW9uLCBkb2N1bWVudE1pZ3JhdG9yLCBsb2csIHNlcmlhbGl6ZXIgfSA9IGNvbnRleHQ7XG5cbiAgaWYgKCFzb3VyY2UuZXhpc3RzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFzb3VyY2UuYWxpYXNlc1thbGlhc10pIHtcbiAgICBsb2cuaW5mbyhgUmVpbmRleGluZyAke2FsaWFzfSB0byAke3NvdXJjZS5pbmRleE5hbWV9YCk7XG5cbiAgICBhd2FpdCBJbmRleC5jb252ZXJ0VG9BbGlhcyhjYWxsQ2x1c3Rlciwgc291cmNlLCBhbGlhcywgYmF0Y2hTaXplKTtcbiAgfVxuXG4gIGNvbnN0IHJlYWQgPSBJbmRleC5yZWFkZXIoY2FsbENsdXN0ZXIsIHNvdXJjZS5pbmRleE5hbWUsIHsgYmF0Y2hTaXplLCBzY3JvbGxEdXJhdGlvbiB9KTtcblxuICBsb2cuaW5mbyhgTWlncmF0aW5nICR7c291cmNlLmluZGV4TmFtZX0gc2F2ZWQgb2JqZWN0cyB0byAke2Rlc3QuaW5kZXhOYW1lfWApO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgY29uc3QgZG9jcyA9IGF3YWl0IHJlYWQoKTtcblxuICAgIGlmICghZG9jcyB8fCAhZG9jcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cuZGVidWcoYE1pZ3JhdGluZyBzYXZlZCBvYmplY3RzICR7ZG9jcy5tYXAoZCA9PiBkLl9pZCkuam9pbignLCAnKX1gKTtcblxuICAgIGF3YWl0IEluZGV4LndyaXRlKFxuICAgICAgY2FsbENsdXN0ZXIsXG4gICAgICBkZXN0LmluZGV4TmFtZSxcbiAgICAgIG1pZ3JhdGVSYXdEb2NzKHNlcmlhbGl6ZXIsIGRvY3VtZW50TWlncmF0b3IubWlncmF0ZSwgZG9jcylcbiAgICApO1xuICB9XG59XG4iXX0=