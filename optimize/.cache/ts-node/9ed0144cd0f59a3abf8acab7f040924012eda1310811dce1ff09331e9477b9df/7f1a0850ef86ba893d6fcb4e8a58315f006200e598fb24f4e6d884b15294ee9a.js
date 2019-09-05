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
/*
 * This module contains various functions for querying and manipulating
 * elasticsearch indices.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const serialization_1 = require("../../serialization");
// Require rather than import gets us around the lack of TypeScript definitions
// for "getTypes"
// tslint:disable-next-line:no-var-requires
const { getTypes } = require('../../../mappings');
const settings = { number_of_shards: 1, auto_expand_replicas: '0-1' };
/**
 * A slight enhancement to indices.get, that adds indexName, and validates that the
 * index mappings are somewhat what we expect.
 */
async function fetchInfo(callCluster, index) {
    const result = await callCluster('indices.get', {
        ignore: [404],
        index,
        include_type_name: true,
    });
    if (result.status === 404) {
        return {
            aliases: {},
            exists: false,
            indexName: index,
            mappings: { doc: { dynamic: 'strict', properties: {} } },
        };
    }
    const [indexName, indexInfo] = Object.entries(result)[0];
    return assertIsSupportedIndex({ ...indexInfo, exists: true, indexName });
}
exports.fetchInfo = fetchInfo;
/**
 * Creates a reader function that serves up batches of documents from the index. We aren't using
 * an async generator, as that feature currently breaks Kibana's tooling.
 *
 * @param {CallCluster} callCluster - The elastic search connection
 * @param {string} - The index to be read from
 * @param {opts}
 * @prop {number} batchSize - The number of documents to read at a time
 * @prop {string} scrollDuration - The scroll duration used for scrolling through the index
 */
function reader(callCluster, index, { batchSize = 10, scrollDuration = '15m' }) {
    const scroll = scrollDuration;
    let scrollId;
    const nextBatch = () => scrollId !== undefined
        ? callCluster('scroll', { scroll, scrollId })
        : callCluster('search', { body: { size: batchSize }, index, scroll });
    const close = async () => scrollId && (await callCluster('clearScroll', { scrollId }));
    return async function read() {
        const result = await nextBatch();
        assertResponseIncludeAllShards(result);
        const docs = result.hits.hits;
        scrollId = result._scroll_id;
        if (!docs.length) {
            await close();
        }
        return docs;
    };
}
exports.reader = reader;
/**
 * Writes the specified documents to the index, throws an exception
 * if any of the documents fail to save.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {RawDoc[]} docs
 */
async function write(callCluster, index, docs) {
    const result = await callCluster('bulk', {
        body: docs.reduce((acc, doc) => {
            acc.push({
                index: {
                    _id: doc._id,
                    _index: index,
                    _type: serialization_1.ROOT_TYPE,
                },
            });
            acc.push(doc._source);
            return acc;
        }, []),
    });
    const err = lodash_1.default.find(result.items, 'index.error.reason');
    if (!err) {
        return;
    }
    const exception = new Error(err.index.error.reason);
    exception.detail = err;
    throw exception;
}
exports.write = write;
/**
 * Checks to see if the specified index is up to date. It does this by checking
 * that the index has the expected mappings and by counting
 * the number of documents that have a property which has migrations defined for it,
 * but which has not had those migrations applied. We don't want to cache the
 * results of this function (e.g. in context or somewhere), as it is important that
 * it performs the check *each* time it is called, rather than memoizing itself,
 * as this is used to determine if migrations are complete.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {MigrationVersion} migrationVersion - The latest versions of the migrations
 */
async function migrationsUpToDate(callCluster, index, migrationVersion, retryCount = 10) {
    try {
        const indexInfo = await fetchInfo(callCluster, index);
        if (!lodash_1.default.get(indexInfo, 'mappings.doc.properties.migrationVersion')) {
            return false;
        }
        // If no migrations are actually defined, we're up to date!
        if (Object.keys(migrationVersion).length <= 0) {
            return true;
        }
        const response = await callCluster('count', {
            body: {
                query: {
                    bool: {
                        should: Object.entries(migrationVersion).map(([type, latestVersion]) => ({
                            bool: {
                                must: [
                                    { exists: { field: type } },
                                    { bool: { must_not: { term: { [`migrationVersion.${type}`]: latestVersion } } } },
                                ],
                            },
                        })),
                    },
                },
            },
            index,
            type: serialization_1.ROOT_TYPE,
        });
        assertResponseIncludeAllShards(response);
        return response.count === 0;
    }
    catch (e) {
        // retry for Service Unavailable
        if (e.status !== 503 || retryCount === 0) {
            throw e;
        }
        await new Promise(r => setTimeout(r, 1000));
        return await migrationsUpToDate(callCluster, index, migrationVersion, retryCount - 1);
    }
}
exports.migrationsUpToDate = migrationsUpToDate;
/**
 * Applies the specified mappings to the index.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {IndexMapping} mappings
 */
function putMappings(callCluster, index, mappings) {
    return callCluster('indices.putMapping', { body: mappings.doc, index, type: serialization_1.ROOT_TYPE });
}
exports.putMappings = putMappings;
async function createIndex(callCluster, index, mappings) {
    await callCluster('indices.create', {
        body: { mappings, settings },
        index,
        include_type_name: true,
    });
}
exports.createIndex = createIndex;
async function deleteIndex(callCluster, index) {
    await callCluster('indices.delete', { index });
}
exports.deleteIndex = deleteIndex;
/**
 * Converts an index to an alias. The `alias` parameter is the desired alias name which currently
 * is a concrete index. This function will reindex `alias` into a new index, delete the `alias`
 * index, and then create an alias `alias` that points to the new index.
 *
 * @param {CallCluster} callCluster - The connection to ElasticSearch
 * @param {FullIndexInfo} info - Information about the mappings and name of the new index
 * @param {string} alias - The name of the index being converted to an alias
 */
async function convertToAlias(callCluster, info, alias, batchSize) {
    await callCluster('indices.create', {
        body: { mappings: info.mappings, settings },
        index: info.indexName,
        include_type_name: true,
    });
    await reindex(callCluster, alias, info.indexName, batchSize);
    await claimAlias(callCluster, info.indexName, alias, [{ remove_index: { index: alias } }]);
}
exports.convertToAlias = convertToAlias;
/**
 * Points the specified alias to the specified index. This is an exclusive
 * alias, meaning that it will only point to one index at a time, so we
 * remove any other indices from the alias.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {string} alias
 * @param {AliasAction[]} aliasActions - Optional actions to be added to the updateAliases call
 */
async function claimAlias(callCluster, index, alias, aliasActions = []) {
    const result = await callCluster('indices.getAlias', { ignore: [404], name: alias });
    const aliasInfo = result.status === 404 ? {} : result;
    const removeActions = Object.keys(aliasInfo).map(key => ({ remove: { index: key, alias } }));
    await callCluster('indices.updateAliases', {
        body: {
            actions: aliasActions.concat(removeActions).concat({ add: { index, alias } }),
        },
    });
    await callCluster('indices.refresh', { index });
}
exports.claimAlias = claimAlias;
/**
 * This is a rough check to ensure that the index being migrated satisfies at least
 * some rudimentary expectations. Past Kibana indices had multiple root documents, etc
 * and the migration system does not (yet?) handle those indices. They need to be upgraded
 * via v5 -> v6 upgrade tools first. This file contains index-agnostic logic, and this
 * check is itself index-agnostic, though the error hint is a bit Kibana specific.
 *
 * @param {FullIndexInfo} indexInfo
 */
async function assertIsSupportedIndex(indexInfo) {
    const currentTypes = getTypes(indexInfo.mappings);
    const isV5Index = currentTypes.length > 1 || currentTypes[0] !== serialization_1.ROOT_TYPE;
    if (isV5Index) {
        throw new Error(`Index ${indexInfo.indexName} belongs to a version of Kibana ` +
            `that cannot be automatically migrated. Reset it or use the X-Pack upgrade assistant.`);
    }
    return indexInfo;
}
/**
 * Provides protection against reading/re-indexing against an index with missing
 * shards which could result in data loss. This shouldn't be common, as the Saved
 * Object indices should only ever have a single shard. This is more to handle
 * instances where customers manually expand the shards of an index.
 */
function assertResponseIncludeAllShards({ _shards }) {
    if (!lodash_1.default.has(_shards, 'total') || !lodash_1.default.has(_shards, 'successful')) {
        return;
    }
    const failed = _shards.total - _shards.successful;
    if (failed > 0) {
        throw new Error(`Re-index failed :: ${failed} of ${_shards.total} shards failed. ` +
            `Check Elasticsearch cluster health for more information.`);
    }
}
/**
 * Reindexes from source to dest, polling for the reindex completion.
 */
async function reindex(callCluster, source, dest, batchSize) {
    // We poll instead of having the request wait for completion, as for large indices,
    // the request times out on the Elasticsearch side of things. We have a relatively tight
    // polling interval, as the request is fairly efficent, and we don't
    // want to block index migrations for too long on this.
    const pollInterval = 250;
    const { task } = await callCluster('reindex', {
        body: {
            dest: { index: dest },
            source: { index: source, size: batchSize },
        },
        refresh: true,
        waitForCompletion: false,
    });
    let completed = false;
    while (!completed) {
        await new Promise(r => setTimeout(r, pollInterval));
        completed = await callCluster('tasks.get', {
            taskId: task,
        }).then(result => {
            if (result.error) {
                const e = result.error;
                throw new Error(`Re-index failed [${e.type}] ${e.reason} :: ${JSON.stringify(e)}`);
            }
            return result.completed;
        });
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9lbGFzdGljX2luZGV4LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvc2VydmVyL3NhdmVkX29iamVjdHMvbWlncmF0aW9ucy9jb3JlL2VsYXN0aWNfaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7O0FBRUg7OztHQUdHO0FBRUgsNERBQXVCO0FBQ3ZCLHVEQUFrRTtBQVVsRSwrRUFBK0U7QUFDL0UsaUJBQWlCO0FBQ2pCLDJDQUEyQztBQUMzQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFbEQsTUFBTSxRQUFRLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFTdEU7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLFNBQVMsQ0FBQyxXQUF3QixFQUFFLEtBQWE7SUFDckUsTUFBTSxNQUFNLEdBQUcsTUFBTSxXQUFXLENBQUMsYUFBYSxFQUFFO1FBQzlDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNiLEtBQUs7UUFDTCxpQkFBaUIsRUFBRSxJQUFJO0tBQ3hCLENBQUMsQ0FBQztJQUVILElBQUssTUFBbUIsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO1FBQ3ZDLE9BQU87WUFDTCxPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxLQUFLO1lBQ2IsU0FBUyxFQUFFLEtBQUs7WUFDaEIsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUU7U0FDekQsQ0FBQztLQUNIO0lBRUQsTUFBTSxDQUFDLFNBQVMsRUFBRSxT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LlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIHZhcmlvdXMgZnVuY3Rpb25zIGZvciBxdWVyeWluZyBhbmQgbWFuaXB1bGF0aW5nXG4gKiBlbGFzdGljc2VhcmNoIGluZGljZXMuXG4gKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IE1pZ3JhdGlvblZlcnNpb24sIFJPT1RfVFlQRSB9IGZyb20gJy4uLy4uL3NlcmlhbGl6YXRpb24nO1xuaW1wb3J0IHtcbiAgQWxpYXNBY3Rpb24sXG4gIENhbGxDbHVzdGVyLFxuICBJbmRleE1hcHBpbmcsXG4gIE5vdEZvdW5kLFxuICBSYXdEb2MsXG4gIFNoYXJkc0luZm8sXG59IGZyb20gJy4vY2FsbF9jbHVzdGVyJztcblxuLy8gUmVxdWlyZSByYXRoZXIgdGhhbiBpbXBvcnQgZ2V0cyB1cyBhcm91bmQgdGhlIGxhY2sgb2YgVHlwZVNjcmlwdCBkZWZpbml0aW9uc1xuLy8gZm9yIFwiZ2V0VHlwZXNcIlxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXZhci1yZXF1aXJlc1xuY29uc3QgeyBnZXRUeXBlcyB9ID0gcmVxdWlyZSgnLi4vLi4vLi4vbWFwcGluZ3MnKTtcblxuY29uc3Qgc2V0dGluZ3MgPSB7IG51bWJlcl9vZl9zaGFyZHM6IDEsIGF1dG9fZXhwYW5kX3JlcGxpY2FzOiAnMC0xJyB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bGxJbmRleEluZm8ge1xuICBhbGlhc2VzOiB7IFtuYW1lOiBzdHJpbmddOiBvYmplY3QgfTtcbiAgZXhpc3RzOiBib29sZWFuO1xuICBpbmRleE5hbWU6IHN0cmluZztcbiAgbWFwcGluZ3M6IEluZGV4TWFwcGluZztcbn1cblxuLyoqXG4gKiBBIHNsaWdodCBlbmhhbmNlbWVudCB0byBpbmRpY2VzLmdldCwgdGhhdCBhZGRzIGluZGV4TmFtZSwgYW5kIHZhbGlkYXRlcyB0aGF0IHRoZVxuICogaW5kZXggbWFwcGluZ3MgYXJlIHNvbWV3aGF0IHdoYXQgd2UgZXhwZWN0LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hJbmZvKGNhbGxDbHVzdGVyOiBDYWxsQ2x1c3RlciwgaW5kZXg6IHN0cmluZyk6IFByb21pc2U8RnVsbEluZGV4SW5mbz4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjYWxsQ2x1c3RlcignaW5kaWNlcy5nZXQnLCB7XG4gICAgaWdub3JlOiBbNDA0XSxcbiAgICBpbmRleCxcbiAgICBpbmNsdWRlX3R5cGVfbmFtZTogdHJ1ZSxcbiAgfSk7XG5cbiAgaWYgKChyZXN1bHQgYXMgTm90Rm91bmQpLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFsaWFzZXM6IHt9LFxuICAgICAgZXhpc3RzOiBmYWxzZSxcbiAgICAgIGluZGV4TmFtZTogaW5kZXgsXG4gICAgICBtYXBwaW5nczogeyBkb2M6IHsgZHluYW1pYzogJ3N0cmljdCcsIHByb3BlcnRpZXM6IHt9IH0gfSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgW2luZGV4TmFtZSwgaW5kZXhJbmZvXSA9IE9iamVjdC5lbnRyaWVzKHJlc3VsdClbMF07XG5cbiAgcmV0dXJuIGFzc2VydElzU3VwcG9ydGVkSW5kZXgoeyAuLi5pbmRleEluZm8sIGV4aXN0czogdHJ1ZSwgaW5kZXhOYW1lIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSByZWFkZXIgZnVuY3Rpb24gdGhhdCBzZXJ2ZXMgdXAgYmF0Y2hlcyBvZiBkb2N1bWVudHMgZnJvbSB0aGUgaW5kZXguIFdlIGFyZW4ndCB1c2luZ1xuICogYW4gYXN5bmMgZ2VuZXJhdG9yLCBhcyB0aGF0IGZlYXR1cmUgY3VycmVudGx5IGJyZWFrcyBLaWJhbmEncyB0b29saW5nLlxuICpcbiAqIEBwYXJhbSB7Q2FsbENsdXN0ZXJ9IGNhbGxDbHVzdGVyIC0gVGhlIGVsYXN0aWMgc2VhcmNoIGNvbm5lY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSAtIFRoZSBpbmRleCB0byBiZSByZWFkIGZyb21cbiAqIEBwYXJhbSB7b3B0c31cbiAqIEBwcm9wIHtudW1iZXJ9IGJhdGNoU2l6ZSAtIFRoZSBudW1iZXIgb2YgZG9jdW1lbnRzIHRvIHJlYWQgYXQgYSB0aW1lXG4gKiBAcHJvcCB7c3RyaW5nfSBzY3JvbGxEdXJhdGlvbiAtIFRoZSBzY3JvbGwgZHVyYXRpb24gdXNlZCBmb3Igc2Nyb2xsaW5nIHRocm91Z2ggdGhlIGluZGV4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkZXIoXG4gIGNhbGxDbHVzdGVyOiBDYWxsQ2x1c3RlcixcbiAgaW5kZXg6IHN0cmluZyxcbiAgeyBiYXRjaFNpemUgPSAxMCwgc2Nyb2xsRHVyYXRpb24gPSAnMTVtJyB9OiB7IGJhdGNoU2l6ZTogbnVtYmVyOyBzY3JvbGxEdXJhdGlvbjogc3RyaW5nIH1cbikge1xuICBjb25zdCBzY3JvbGwgPSBzY3JvbGxEdXJhdGlvbjtcbiAgbGV0IHNjcm9sbElkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3QgbmV4dEJhdGNoID0gKCkgPT5cbiAgICBzY3JvbGxJZCAhPT0gdW5kZWZpbmVkXG4gICAgICA/IGNhbGxDbHVzdGVyKCdzY3JvbGwnLCB7IHNjcm9sbCwgc2Nyb2xsSWQgfSlcbiAgICAgIDogY2FsbENsdXN0ZXIoJ3NlYXJjaCcsIHsgYm9keTogeyBzaXplOiBiYXRjaFNpemUgfSwgaW5kZXgsIHNjcm9sbCB9KTtcblxuICBjb25zdCBjbG9zZSA9IGFzeW5jICgpID0+IHNjcm9sbElkICYmIChhd2FpdCBjYWxsQ2x1c3RlcignY2xlYXJTY3JvbGwnLCB7IHNjcm9sbElkIH0pKTtcblxuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gcmVhZCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBuZXh0QmF0Y2goKTtcbiAgICBhc3NlcnRSZXNwb25zZUluY2x1ZGVBbGxTaGFyZHMocmVzdWx0KTtcblxuICAgIGNvbnN0IGRvY3MgPSByZXN1bHQuaGl0cy5oaXRzO1xuXG4gICAgc2Nyb2xsSWQgPSByZXN1bHQuX3Njcm9sbF9pZDtcblxuICAgIGlmICghZG9jcy5sZW5ndGgpIHtcbiAgICAgIGF3YWl0IGNsb3NlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvY3M7XG4gIH07XG59XG5cbi8qKlxuICogV3JpdGVzIHRoZSBzcGVjaWZpZWQgZG9jdW1lbnRzIHRvIHRoZSBpbmRleCwgdGhyb3dzIGFuIGV4Y2VwdGlvblxuICogaWYgYW55IG9mIHRoZSBkb2N1bWVudHMgZmFpbCB0byBzYXZlLlxuICpcbiAqIEBwYXJhbSB7Q2FsbENsdXN0ZXJ9IGNhbGxDbHVzdGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5kZXhcbiAqIEBwYXJhbSB7UmF3RG9jW119IGRvY3NcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlKGNhbGxDbHVzdGVyOiBDYWxsQ2x1c3RlciwgaW5kZXg6IHN0cmluZywgZG9jczogUmF3RG9jW10pIHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2FsbENsdXN0ZXIoJ2J1bGsnLCB7XG4gICAgYm9keTogZG9jcy5yZWR1Y2UoKGFjYzogb2JqZWN0W10sIGRvYzogUmF3RG9jKSA9PiB7XG4gICAgICBhY2MucHVzaCh7XG4gICAgICAgIGluZGV4OiB7XG4gICAgICAgICAgX2lkOiBkb2MuX2lkLFxuICAgICAgICAgIF9pbmRleDogaW5kZXgsXG4gICAgICAgICAgX3R5cGU6IFJPT1RfVFlQRSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhY2MucHVzaChkb2MuX3NvdXJjZSk7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgW10pLFxuICB9KTtcblxuICBjb25zdCBlcnIgPSBfLmZpbmQocmVzdWx0Lml0ZW1zLCAnaW5kZXguZXJyb3IucmVhc29uJyk7XG5cbiAgaWYgKCFlcnIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBleGNlcHRpb246IGFueSA9IG5ldyBFcnJvcihlcnIuaW5kZXguZXJyb3IhLnJlYXNvbik7XG4gIGV4Y2VwdGlvbi5kZXRhaWwgPSBlcnI7XG4gIHRocm93IGV4Y2VwdGlvbjtcbn1cblxuLyoqXG4gKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBzcGVjaWZpZWQgaW5kZXggaXMgdXAgdG8gZGF0ZS4gSXQgZG9lcyB0aGlzIGJ5IGNoZWNraW5nXG4gKiB0aGF0IHRoZSBpbmRleCBoYXMgdGhlIGV4cGVjdGVkIG1hcHBpbmdzIGFuZCBieSBjb3VudGluZ1xuICogdGhlIG51bWJlciBvZiBkb2N1bWVudHMgdGhhdCBoYXZlIGEgcHJvcGVydHkgd2hpY2ggaGFzIG1pZ3JhdGlvbnMgZGVmaW5lZCBmb3IgaXQsXG4gKiBidXQgd2hpY2ggaGFzIG5vdCBoYWQgdGhvc2UgbWlncmF0aW9ucyBhcHBsaWVkLiBXZSBkb24ndCB3YW50IHRvIGNhY2hlIHRoZVxuICogcmVzdWx0cyBvZiB0aGlzIGZ1bmN0aW9uIChlLmcuIGluIGNvbnRleHQgb3Igc29tZXdoZXJlKSwgYXMgaXQgaXMgaW1wb3J0YW50IHRoYXRcbiAqIGl0IHBlcmZvcm1zIHRoZSBjaGVjayAqZWFjaCogdGltZSBpdCBpcyBjYWxsZWQsIHJhdGhlciB0aGFuIG1lbW9pemluZyBpdHNlbGYsXG4gKiBhcyB0aGlzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIG1pZ3JhdGlvbnMgYXJlIGNvbXBsZXRlLlxuICpcbiAqIEBwYXJhbSB7Q2FsbENsdXN0ZXJ9IGNhbGxDbHVzdGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5kZXhcbiAqIEBwYXJhbSB7TWlncmF0aW9uVmVyc2lvbn0gbWlncmF0aW9uVmVyc2lvbiAtIFRoZSBsYXRlc3QgdmVyc2lvbnMgb2YgdGhlIG1pZ3JhdGlvbnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGlvbnNVcFRvRGF0ZShcbiAgY2FsbENsdXN0ZXI6IENhbGxDbHVzdGVyLFxuICBpbmRleDogc3RyaW5nLFxuICBtaWdyYXRpb25WZXJzaW9uOiBNaWdyYXRpb25WZXJzaW9uLFxuICByZXRyeUNvdW50OiBudW1iZXIgPSAxMFxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaW5kZXhJbmZvID0gYXdhaXQgZmV0Y2hJbmZvKGNhbGxDbHVzdGVyLCBpbmRleCk7XG5cbiAgICBpZiAoIV8uZ2V0KGluZGV4SW5mbywgJ21hcHBpbmdzLmRvYy5wcm9wZXJ0aWVzLm1pZ3JhdGlvblZlcnNpb24nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIElmIG5vIG1pZ3JhdGlvbnMgYXJlIGFjdHVhbGx5IGRlZmluZWQsIHdlJ3JlIHVwIHRvIGRhdGUhXG4gICAgaWYgKE9iamVjdC5rZXlzKG1pZ3JhdGlvblZlcnNpb24pLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNhbGxDbHVzdGVyKCdjb3VudCcsIHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICBib29sOiB7XG4gICAgICAgICAgICBzaG91bGQ6IE9iamVjdC5lbnRyaWVzKG1pZ3JhdGlvblZlcnNpb24pLm1hcCgoW3R5cGUsIGxhdGVzdFZlcnNpb25dKSA9PiAoe1xuICAgICAgICAgICAgICBib29sOiB7XG4gICAgICAgICAgICAgICAgbXVzdDogW1xuICAgICAgICAgICAgICAgICAgeyBleGlzdHM6IHsgZmllbGQ6IHR5cGUgfSB9LFxuICAgICAgICAgICAgICAgICAgeyBib29sOiB7IG11c3Rfbm90OiB7IHRlcm06IHsgW2BtaWdyYXRpb25WZXJzaW9uLiR7dHlwZX1gXTogbGF0ZXN0VmVyc2lvbiB9IH0gfSB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBpbmRleCxcbiAgICAgIHR5cGU6IFJPT1RfVFlQRSxcbiAgICB9KTtcblxuICAgIGFzc2VydFJlc3BvbnNlSW5jbHVkZUFsbFNoYXJkcyhyZXNwb25zZSk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuY291bnQgPT09IDA7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyByZXRyeSBmb3IgU2VydmljZSBVbmF2YWlsYWJsZVxuICAgIGlmIChlLnN0YXR1cyAhPT0gNTAzIHx8IHJldHJ5Q291bnQgPT09IDApIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIDEwMDApKTtcblxuICAgIHJldHVybiBhd2FpdCBtaWdyYXRpb25zVXBUb0RhdGUoY2FsbENsdXN0ZXIsIGluZGV4LCBtaWdyYXRpb25WZXJzaW9uLCByZXRyeUNvdW50IC0gMSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIHRoZSBzcGVjaWZpZWQgbWFwcGluZ3MgdG8gdGhlIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7Q2FsbENsdXN0ZXJ9IGNhbGxDbHVzdGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5kZXhcbiAqIEBwYXJhbSB7SW5kZXhNYXBwaW5nfSBtYXBwaW5nc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcHV0TWFwcGluZ3MoY2FsbENsdXN0ZXI6IENhbGxDbHVzdGVyLCBpbmRleDogc3RyaW5nLCBtYXBwaW5nczogSW5kZXhNYXBwaW5nKSB7XG4gIHJldHVybiBjYWxsQ2x1c3RlcignaW5kaWNlcy5wdXRNYXBwaW5nJywgeyBib2R5OiBtYXBwaW5ncy5kb2MsIGluZGV4LCB0eXBlOiBST09UX1RZUEUgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVJbmRleChcbiAgY2FsbENsdXN0ZXI6IENhbGxDbHVzdGVyLFxuICBpbmRleDogc3RyaW5nLFxuICBtYXBwaW5ncz86IEluZGV4TWFwcGluZ1xuKSB7XG4gIGF3YWl0IGNhbGxDbHVzdGVyKCdpbmRpY2VzLmNyZWF0ZScsIHtcbiAgICBib2R5OiB7IG1hcHBpbmdzLCBzZXR0aW5ncyB9LFxuICAgIGluZGV4LFxuICAgIGluY2x1ZGVfdHlwZV9uYW1lOiB0cnVlLFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUluZGV4KGNhbGxDbHVzdGVyOiBDYWxsQ2x1c3RlciwgaW5kZXg6IHN0cmluZykge1xuICBhd2FpdCBjYWxsQ2x1c3RlcignaW5kaWNlcy5kZWxldGUnLCB7IGluZGV4IH0pO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGluZGV4IHRvIGFuIGFsaWFzLiBUaGUgYGFsaWFzYCBwYXJhbWV0ZXIgaXMgdGhlIGRlc2lyZWQgYWxpYXMgbmFtZSB3aGljaCBjdXJyZW50bHlcbiAqIGlzIGEgY29uY3JldGUgaW5kZXguIFRoaXMgZnVuY3Rpb24gd2lsbCByZWluZGV4IGBhbGlhc2AgaW50byBhIG5ldyBpbmRleCwgZGVsZXRlIHRoZSBgYWxpYXNgXG4gKiBpbmRleCwgYW5kIHRoZW4gY3JlYXRlIGFuIGFsaWFzIGBhbGlhc2AgdGhhdCBwb2ludHMgdG8gdGhlIG5ldyBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge0NhbGxDbHVzdGVyfSBjYWxsQ2x1c3RlciAtIFRoZSBjb25uZWN0aW9uIHRvIEVsYXN0aWNTZWFyY2hcbiAqIEBwYXJhbSB7RnVsbEluZGV4SW5mb30gaW5mbyAtIEluZm9ybWF0aW9uIGFib3V0IHRoZSBtYXBwaW5ncyBhbmQgbmFtZSBvZiB0aGUgbmV3IGluZGV4XG4gKiBAcGFyYW0ge3N0cmluZ30gYWxpYXMgLSBUaGUgbmFtZSBvZiB0aGUgaW5kZXggYmVpbmcgY29udmVydGVkIHRvIGFuIGFsaWFzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb252ZXJ0VG9BbGlhcyhcbiAgY2FsbENsdXN0ZXI6IENhbGxDbHVzdGVyLFxuICBpbmZvOiBGdWxsSW5kZXhJbmZvLFxuICBhbGlhczogc3RyaW5nLFxuICBiYXRjaFNpemU6IG51bWJlclxuKSB7XG4gIGF3YWl0IGNhbGxDbHVzdGVyKCdpbmRpY2VzLmNyZWF0ZScsIHtcbiAgICBib2R5OiB7IG1hcHBpbmdzOiBpbmZvLm1hcHBpbmdzLCBzZXR0aW5ncyB9LFxuICAgIGluZGV4OiBpbmZvLmluZGV4TmFtZSxcbiAgICBpbmNsdWRlX3R5cGVfbmFtZTogdHJ1ZSxcbiAgfSk7XG5cbiAgYXdhaXQgcmVpbmRleChjYWxsQ2x1c3RlciwgYWxpYXMsIGluZm8uaW5kZXhOYW1lLCBiYXRjaFNpemUpO1xuXG4gIGF3YWl0IGNsYWltQWxpYXMoY2FsbENsdXN0ZXIsIGluZm8uaW5kZXhOYW1lLCBhbGlhcywgW3sgcmVtb3ZlX2luZGV4OiB7IGluZGV4OiBhbGlhcyB9IH1dKTtcbn1cblxuLyoqXG4gKiBQb2ludHMgdGhlIHNwZWNpZmllZCBhbGlhcyB0byB0aGUgc3BlY2lmaWVkIGluZGV4LiBUaGlzIGlzIGFuIGV4Y2x1c2l2ZVxuICogYWxpYXMsIG1lYW5pbmcgdGhhdCBpdCB3aWxsIG9ubHkgcG9pbnQgdG8gb25lIGluZGV4IGF0IGEgdGltZSwgc28gd2VcbiAqIHJlbW92ZSBhbnkgb3RoZXIgaW5kaWNlcyBmcm9tIHRoZSBhbGlhcy5cbiAqXG4gKiBAcGFyYW0ge0NhbGxDbHVzdGVyfSBjYWxsQ2x1c3RlclxuICogQHBhcmFtIHtzdHJpbmd9IGluZGV4XG4gKiBAcGFyYW0ge3N0cmluZ30gYWxpYXNcbiAqIEBwYXJhbSB7QWxpYXNBY3Rpb25bXX0gYWxpYXNBY3Rpb25zIC0gT3B0aW9uYWwgYWN0aW9ucyB0byBiZSBhZGRlZCB0byB0aGUgdXBkYXRlQWxpYXNlcyBjYWxsXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGFpbUFsaWFzKFxuICBjYWxsQ2x1c3RlcjogQ2FsbENsdXN0ZXIsXG4gIGluZGV4OiBzdHJpbmcsXG4gIGFsaWFzOiBzdHJpbmcsXG4gIGFsaWFzQWN0aW9uczogQWxpYXNBY3Rpb25bXSA9IFtdXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2FsbENsdXN0ZXIoJ2luZGljZXMuZ2V0QWxpYXMnLCB7IGlnbm9yZTogWzQwNF0sIG5hbWU6IGFsaWFzIH0pO1xuICBjb25zdCBhbGlhc0luZm8gPSAocmVzdWx0IGFzIE5vdEZvdW5kKS5zdGF0dXMgPT09IDQwNCA/IHt9IDogcmVzdWx0O1xuICBjb25zdCByZW1vdmVBY3Rpb25zID0gT2JqZWN0LmtleXMoYWxpYXNJbmZvKS5tYXAoa2V5ID0+ICh7IHJlbW92ZTogeyBpbmRleDoga2V5LCBhbGlhcyB9IH0pKTtcblxuICBhd2FpdCBjYWxsQ2x1c3RlcignaW5kaWNlcy51cGRhdGVBbGlhc2VzJywge1xuICAgIGJvZHk6IHtcbiAgICAgIGFjdGlvbnM6IGFsaWFzQWN0aW9ucy5jb25jYXQocmVtb3ZlQWN0aW9ucykuY29uY2F0KHsgYWRkOiB7IGluZGV4LCBhbGlhcyB9IH0pLFxuICAgIH0sXG4gIH0pO1xuXG4gIGF3YWl0IGNhbGxDbHVzdGVyKCdpbmRpY2VzLnJlZnJlc2gnLCB7IGluZGV4IH0pO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgYSByb3VnaCBjaGVjayB0byBlbnN1cmUgdGhhdCB0aGUgaW5kZXggYmVpbmcgbWlncmF0ZWQgc2F0aXNmaWVzIGF0IGxlYXN0XG4gKiBzb21lIHJ1ZGltZW50YXJ5IGV4cGVjdGF0aW9ucy4gUGFzdCBLaWJhbmEgaW5kaWNlcyBoYWQgbXVsdGlwbGUgcm9vdCBkb2N1bWVudHMsIGV0Y1xuICogYW5kIHRoZSBtaWdyYXRpb24gc3lzdGVtIGRvZXMgbm90ICh5ZXQ/KSBoYW5kbGUgdGhvc2UgaW5kaWNlcy4gVGhleSBuZWVkIHRvIGJlIHVwZ3JhZGVkXG4gKiB2aWEgdjUgLT4gdjYgdXBncmFkZSB0b29scyBmaXJzdC4gVGhpcyBmaWxlIGNvbnRhaW5zIGluZGV4LWFnbm9zdGljIGxvZ2ljLCBhbmQgdGhpc1xuICogY2hlY2sgaXMgaXRzZWxmIGluZGV4LWFnbm9zdGljLCB0aG91Z2ggdGhlIGVycm9yIGhpbnQgaXMgYSBiaXQgS2liYW5hIHNwZWNpZmljLlxuICpcbiAqIEBwYXJhbSB7RnVsbEluZGV4SW5mb30gaW5kZXhJbmZvXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFzc2VydElzU3VwcG9ydGVkSW5kZXgoaW5kZXhJbmZvOiBGdWxsSW5kZXhJbmZvKSB7XG4gIGNvbnN0IGN1cnJlbnRUeXBlcyA9IGdldFR5cGVzKGluZGV4SW5mby5tYXBwaW5ncyk7XG4gIGNvbnN0IGlzVjVJbmRleCA9IGN1cnJlbnRUeXBlcy5sZW5ndGggPiAxIHx8IGN1cnJlbnRUeXBlc1swXSAhPT0gUk9PVF9UWVBFO1xuICBpZiAoaXNWNUluZGV4KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEluZGV4ICR7aW5kZXhJbmZvLmluZGV4TmFtZX0gYmVsb25ncyB0byBhIHZlcnNpb24gb2YgS2liYW5hIGAgK1xuICAgICAgICBgdGhhdCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBtaWdyYXRlZC4gUmVzZXQgaXQgb3IgdXNlIHRoZSBYLVBhY2sgdXBncmFkZSBhc3Npc3RhbnQuYFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGluZGV4SW5mbztcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBwcm90ZWN0aW9uIGFnYWluc3QgcmVhZGluZy9yZS1pbmRleGluZyBhZ2FpbnN0IGFuIGluZGV4IHdpdGggbWlzc2luZ1xuICogc2hhcmRzIHdoaWNoIGNvdWxkIHJlc3VsdCBpbiBkYXRhIGxvc3MuIFRoaXMgc2hvdWxkbid0IGJlIGNvbW1vbiwgYXMgdGhlIFNhdmVkXG4gKiBPYmplY3QgaW5kaWNlcyBzaG91bGQgb25seSBldmVyIGhhdmUgYSBzaW5nbGUgc2hhcmQuIFRoaXMgaXMgbW9yZSB0byBoYW5kbGVcbiAqIGluc3RhbmNlcyB3aGVyZSBjdXN0b21lcnMgbWFudWFsbHkgZXhwYW5kIHRoZSBzaGFyZHMgb2YgYW4gaW5kZXguXG4gKi9cbmZ1bmN0aW9uIGFzc2VydFJlc3BvbnNlSW5jbHVkZUFsbFNoYXJkcyh7IF9zaGFyZHMgfTogeyBfc2hhcmRzOiBTaGFyZHNJbmZvIH0pIHtcbiAgaWYgKCFfLmhhcyhfc2hhcmRzLCAndG90YWwnKSB8fCAhXy5oYXMoX3NoYXJkcywgJ3N1Y2Nlc3NmdWwnKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGZhaWxlZCA9IF9zaGFyZHMudG90YWwgLSBfc2hhcmRzLnN1Y2Nlc3NmdWw7XG5cbiAgaWYgKGZhaWxlZCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgUmUtaW5kZXggZmFpbGVkIDo6ICR7ZmFpbGVkfSBvZiAke19zaGFyZHMudG90YWx9IHNoYXJkcyBmYWlsZWQuIGAgK1xuICAgICAgICBgQ2hlY2sgRWxhc3RpY3NlYXJjaCBjbHVzdGVyIGhlYWx0aCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5gXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlaW5kZXhlcyBmcm9tIHNvdXJjZSB0byBkZXN0LCBwb2xsaW5nIGZvciB0aGUgcmVpbmRleCBjb21wbGV0aW9uLlxuICovXG5hc3luYyBmdW5jdGlvbiByZWluZGV4KGNhbGxDbHVzdGVyOiBDYWxsQ2x1c3Rlciwgc291cmNlOiBzdHJpbmcsIGRlc3Q6IHN0cmluZywgYmF0Y2hTaXplOiBudW1iZXIpIHtcbiAgLy8gV2UgcG9sbCBpbnN0ZWFkIG9mIGhhdmluZyB0aGUgcmVxdWVzdCB3YWl0IGZvciBjb21wbGV0aW9uLCBhcyBmb3IgbGFyZ2UgaW5kaWNlcyxcbiAgLy8gdGhlIHJlcXVlc3QgdGltZXMgb3V0IG9uIHRoZSBFbGFzdGljc2VhcmNoIHNpZGUgb2YgdGhpbmdzLiBXZSBoYXZlIGEgcmVsYXRpdmVseSB0aWdodFxuICAvLyBwb2xsaW5nIGludGVydmFsLCBhcyB0aGUgcmVxdWVzdCBpcyBmYWlybHkgZWZmaWNlbnQsIGFuZCB3ZSBkb24ndFxuICAvLyB3YW50IHRvIGJsb2NrIGluZGV4IG1pZ3JhdGlvbnMgZm9yIHRvbyBsb25nIG9uIHRoaXMuXG4gIGNvbnN0IHBvbGxJbnRlcnZhbCA9IDI1MDtcbiAgY29uc3QgeyB0YXNrIH0gPSBhd2FpdCBjYWxsQ2x1c3RlcigncmVpbmRleCcsIHtcbiAgICBib2R5OiB7XG4gICAgICBkZXN0OiB7IGluZGV4OiBkZXN0IH0sXG4gICAgICBzb3VyY2U6IHsgaW5kZXg6IHNvdXJjZSwgc2l6ZTogYmF0Y2hTaXplIH0sXG4gICAgfSxcbiAgICByZWZyZXNoOiB0cnVlLFxuICAgIHdhaXRGb3JDb21wbGV0aW9uOiBmYWxzZSxcbiAgfSk7XG5cbiAgbGV0IGNvbXBsZXRlZCA9IGZhbHNlO1xuXG4gIHdoaWxlICghY29tcGxldGVkKSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIHBvbGxJbnRlcnZhbCkpO1xuXG4gICAgY29tcGxldGVkID0gYXdhaXQgY2FsbENsdXN0ZXIoJ3Rhc2tzLmdldCcsIHtcbiAgICAgIHRhc2tJZDogdGFzayxcbiAgICB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIGNvbnN0IGUgPSByZXN1bHQuZXJyb3I7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUmUtaW5kZXggZmFpbGVkIFske2UudHlwZX1dICR7ZS5yZWFzb259IDo6ICR7SlNPTi5zdHJpbmdpZnkoZSl9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQuY29tcGxldGVkO1xuICAgIH0pO1xuICB9XG59XG4iXX0=