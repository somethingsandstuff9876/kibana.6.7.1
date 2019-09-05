"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This module contains helpers for managing the task manager storage layer.
 */
const constants_1 = require("./constants");
const DOC_TYPE = '_doc';
/**
 * Wraps an elasticsearch connection and provides a task manager-specific
 * interface into the index.
 */
class TaskStore {
    /**
     * Constructs a new TaskStore.
     * @param {StoreOpts} opts
     * @prop {CallCluster} callCluster - The elastic search connection
     * @prop {string} index - The name of the task manager index
     * @prop {number} maxAttempts - The maximum number of attempts before a task will be abandoned
     * @prop {string[]} supportedTypes - The task types supported by this store
     * @prop {Logger} logger - The task manager logger.
     */
    constructor(opts) {
        this._isInitialized = false; // tslint:disable-line:variable-name
        this.callCluster = opts.callCluster;
        this.index = opts.index;
        this.maxAttempts = opts.maxAttempts;
        this.supportedTypes = opts.supportedTypes;
        this.logger = opts.logger;
        this.getKibanaUuid = opts.getKibanaUuid;
        this.fetchAvailableTasks = this.fetchAvailableTasks.bind(this);
    }
    addSupportedTypes(types) {
        if (!this._isInitialized) {
            this.supportedTypes = this.supportedTypes.concat(types);
        }
        else {
            throw new Error('Cannot add task types after initialization');
        }
    }
    /**
     * Initializes the store, ensuring the task manager index template is created
     * and the version is up to date.
     */
    async init() {
        if (this._isInitialized) {
            throw new Error('TaskStore has already been initialized!');
        }
        let existingVersion = -Infinity;
        const templateName = this.index;
        try {
            // check if template exists
            const templateCheck = await this.callCluster('indices.getTemplate', {
                name: templateName,
                include_type_name: true,
                filter_path: '*.version',
            });
            // extract the existing version
            const template = templateCheck[templateName] || {};
            existingVersion = template.version || 0;
        }
        catch (err) {
            if (err.statusCode !== 404) {
                throw err; // ignore not found
            }
        }
        if (existingVersion > constants_1.TASK_MANAGER_TEMPLATE_VERSION) {
            // Do not trample a newer version template
            this.logger.warning(`This Kibana instance defines an older template version (${constants_1.TASK_MANAGER_TEMPLATE_VERSION}) than is currently in Elasticsearch (${existingVersion}). ` +
                `Because of the potential for non-backwards compatible changes, this Kibana instance will only be able to claim scheduled tasks with ` +
                `"kibana.apiVersion" <= ${constants_1.TASK_MANAGER_API_VERSION} in the task metadata.`);
            return;
        }
        else if (existingVersion === constants_1.TASK_MANAGER_TEMPLATE_VERSION) {
            // The latest template is already saved, so just log a debug line.
            this.logger.debug(`Not installing ${this.index} index template: version ${constants_1.TASK_MANAGER_TEMPLATE_VERSION} already exists.`);
            return;
        }
        // Activate template creation / update
        if (existingVersion > 0) {
            this.logger.info(`Upgrading ${this.index} index template. Old version: ${existingVersion}, New version: ${constants_1.TASK_MANAGER_TEMPLATE_VERSION}.`);
        }
        else {
            this.logger.info(`Installing ${this.index} index template version: ${constants_1.TASK_MANAGER_TEMPLATE_VERSION}.`);
        }
        const templateResult = await this.callCluster('indices.putTemplate', {
            name: templateName,
            include_type_name: true,
            body: {
                index_patterns: [this.index],
                mappings: {
                    [DOC_TYPE]: {
                        dynamic: false,
                        properties: {
                            type: { type: 'keyword' },
                            task: {
                                properties: {
                                    taskType: { type: 'keyword' },
                                    scheduledAt: { type: 'date' },
                                    runAt: { type: 'date' },
                                    interval: { type: 'text' },
                                    attempts: { type: 'integer' },
                                    status: { type: 'keyword' },
                                    params: { type: 'text' },
                                    state: { type: 'text' },
                                    user: { type: 'keyword' },
                                    scope: { type: 'keyword' },
                                },
                            },
                            kibana: {
                                properties: {
                                    apiVersion: { type: 'integer' },
                                    uuid: { type: 'keyword' },
                                    version: { type: 'integer' },
                                },
                            },
                        },
                    },
                },
                settings: {
                    number_of_shards: 1,
                    auto_expand_replicas: '0-1',
                },
                version: constants_1.TASK_MANAGER_TEMPLATE_VERSION,
            },
        });
        this._isInitialized = true;
        this.logger.info(`Installed ${this.index} index template: version ${constants_1.TASK_MANAGER_TEMPLATE_VERSION} (API version ${constants_1.TASK_MANAGER_API_VERSION})`);
        return templateResult;
    }
    get isInitialized() {
        return this._isInitialized;
    }
    /**
     * Schedules a task.
     *
     * @param task - The task being scheduled.
     */
    async schedule(taskInstance) {
        if (!this._isInitialized) {
            await this.init();
        }
        if (!this.supportedTypes.includes(taskInstance.taskType)) {
            throw new Error(`Unsupported task type "${taskInstance.taskType}". Supported types are ${this.supportedTypes.join(', ')}`);
        }
        const { id, ...body } = rawSource(taskInstance, this);
        const result = await this.callCluster('index', {
            id,
            body,
            index: this.index,
            type: DOC_TYPE,
            refresh: true,
        });
        const { task } = body;
        return {
            ...taskInstance,
            id: result._id,
            sequenceNumber: result._seq_no,
            primaryTerm: result._primary_term,
            attempts: 0,
            status: task.status,
            scheduledAt: task.scheduledAt,
            runAt: task.runAt,
            state: taskInstance.state || {},
        };
    }
    /**
     * Fetches a paginatable list of scheduled tasks.
     *
     * @param opts - The query options used to filter tasks
     */
    async fetch(opts = {}) {
        const sort = paginatableSort(opts.sort);
        return this.search({
            sort,
            search_after: opts.searchAfter,
            query: opts.query,
        });
    }
    /**
     * Fetches tasks from the index, which are ready to be run.
     * - runAt is now or past
     * - id is not currently running in this instance of Kibana
     * - has a type that is in our task definitions
     *
     * @param {TaskQuery} query
     * @prop {string[]} types - Task types to be queried
     * @prop {number} size - The number of task instances to retrieve
     * @returns {Promise<ConcreteTaskInstance[]>}
     */
    async fetchAvailableTasks() {
        const { docs } = await this.search({
            query: {
                bool: {
                    must: [
                        { terms: { 'task.taskType': this.supportedTypes } },
                        { range: { 'task.attempts': { lte: this.maxAttempts } } },
                        { range: { 'task.runAt': { lte: 'now' } } },
                        { range: { 'kibana.apiVersion': { lte: constants_1.TASK_MANAGER_API_VERSION } } },
                    ],
                },
            },
            size: 10,
            sort: { 'task.runAt': { order: 'asc' } },
            seq_no_primary_term: true,
        });
        return docs;
    }
    /**
     * Updates the specified doc in the index, returning the doc
     * with its version up to date.
     *
     * @param {TaskDoc} doc
     * @returns {Promise<TaskDoc>}
     */
    async update(doc) {
        const rawDoc = taskDocToRaw(doc, this);
        const result = await this.callCluster('update', {
            body: {
                doc: rawDoc._source,
            },
            id: doc.id,
            index: this.index,
            type: DOC_TYPE,
            if_seq_no: doc.sequenceNumber,
            if_primary_term: doc.primaryTerm,
            // The refresh is important so that if we immediately look for work,
            // we don't pick up this task.
            refresh: true,
        });
        return {
            ...doc,
            sequenceNumber: result._seq_no,
            primaryTerm: result._primary_term,
        };
    }
    /**
     * Removes the specified task from the index.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const result = await this.callCluster('delete', {
            id,
            index: this.index,
            type: DOC_TYPE,
            // The refresh is important so that if we immediately look for work,
            // we don't pick up this task.
            refresh: true,
        });
        return {
            index: result._index,
            id: result._id,
            sequenceNumber: result._seq_no,
            primaryTerm: result._primary_term,
            result: result.result,
        };
    }
    async search(opts = {}) {
        const originalQuery = opts.query;
        const queryOnlyTasks = { term: { type: 'task' } };
        const query = originalQuery
            ? { bool: { must: [queryOnlyTasks, originalQuery] } }
            : queryOnlyTasks;
        const result = await this.callCluster('search', {
            type: DOC_TYPE,
            index: this.index,
            ignoreUnavailable: true,
            body: {
                ...opts,
                query,
            },
        });
        const rawDocs = result.hits.hits;
        return {
            docs: rawDocs.map(rawToTaskDoc),
            searchAfter: (rawDocs.length && rawDocs[rawDocs.length - 1].sort) || [],
        };
    }
}
exports.TaskStore = TaskStore;
function paginatableSort(sort = []) {
    const sortById = { _id: 'desc' };
    if (!sort.length) {
        return [{ 'task.runAt': 'asc' }, sortById];
    }
    if (sort.find(({ _id }) => !!_id)) {
        return sort;
    }
    return [...sort, sortById];
}
function rawSource(doc, store) {
    const { id, ...taskFields } = doc;
    const source = {
        ...taskFields,
        params: JSON.stringify(doc.params || {}),
        state: JSON.stringify(doc.state || {}),
        attempts: doc.attempts || 0,
        scheduledAt: doc.scheduledAt || new Date(),
        runAt: doc.runAt || new Date(),
        status: doc.status || 'idle',
    };
    delete source.id;
    delete source.sequenceNumber;
    delete source.primaryTerm;
    delete source.type;
    return {
        id,
        type: 'task',
        task: source,
        kibana: {
            uuid: store.getKibanaUuid(),
            version: constants_1.TASK_MANAGER_TEMPLATE_VERSION,
            apiVersion: constants_1.TASK_MANAGER_API_VERSION,
        },
    };
}
function taskDocToRaw(doc, store) {
    const { type, task, kibana } = rawSource(doc, store);
    return {
        _id: doc.id,
        _index: store.index,
        _source: { type, task, kibana },
        _type: DOC_TYPE,
        _seq_no: doc.sequenceNumber,
        _primary_term: doc.primaryTerm,
    };
}
function rawToTaskDoc(doc) {
    return {
        ...doc._source.task,
        id: doc._id,
        sequenceNumber: doc._seq_no,
        primaryTerm: doc._primary_term,
        params: parseJSONField(doc._source.task.params, 'params', doc),
        state: parseJSONField(doc._source.task.state, 'state', doc),
    };
}
function parseJSONField(json, fieldName, doc) {
    try {
        return json ? JSON.parse(json) : {};
    }
    catch (error) {
        throw new Error(`Task "${doc._id}"'s ${fieldName} field has invalid JSON: ${json}`);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL3Rhc2tfc3RvcmUudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3Rhc2tfbWFuYWdlci90YXNrX3N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVIOztHQUVHO0FBRUgsMkNBR3FCO0FBSXJCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQztBQTJEeEI7OztHQUdHO0FBQ0gsTUFBYSxTQUFTO0lBU3BCOzs7Ozs7OztPQVFHO0lBQ0gsWUFBWSxJQUFlO1FBWm5CLG1CQUFjLEdBQUcsS0FBSyxDQUFDLENBQUMsb0NBQW9DO1FBYWxFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBRXhDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxLQUFlO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekQ7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUMvRDtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLGVBQWUsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRWhDLElBQUk7WUFDRiwyQkFBMkI7WUFDM0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFO2dCQUNsRSxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsaUJBQWlCLEVBQUUsSUFBSTtnQkFDdkIsV0FBVyxFQUFFLFdBQVc7YUFDekIsQ0FBQyxDQUFDO1lBQ0gsK0JBQStCO1lBQy9CLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkQsZUFBZSxHQUFHLFFBQVEsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO1NBQ3pDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFFO2dCQUMxQixNQUFNLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQjthQUMvQjtTQUNGO1FBRUQsSUFBSSxlQUFlLEdBQUcseUNBQWdCLEVBQUU7WUFDdEMsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUNqQiwyREFBMkQseUNBQWdCLHlDQUF5QyxlQUFlLEtBQUs7Z0JBQ3RJLHNJQUFzSTtnQkFDdEksMEJBQTBCLG9DQUFXLHdCQUF3QixDQUNoRSxDQUFDO1lBQ0YsT0FBTztTQUNSO2FBQU0sSUFBSSxlQUFlLEtBQUsseUNBQWdCLEVBQUU7WUFDL0Msa0VBQWtFO1lBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNmLGtCQUFrQixJQUFJLENBQUMsS0FBSyw0QkFBNEIseUNBQWdCLGtCQUFrQixDQUMzRixDQUFDO1lBQ0YsT0FBTztTQUNSO1FBRUQsc0NBQXNDO1FBQ3RDLElBQUksZUFBZSxHQUFHLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDZCxhQUNFLElBQUksQ0FBQyxLQUNQLGlDQUFpQyxlQUFlLGtCQUFrQix5Q0FBZ0IsR0FBRyxDQUN0RixDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLEtBQUssNEJBQTRCLHlDQUFnQixHQUFHLENBQUMsQ0FBQztTQUMzRjtRQUVELE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRTtZQUNuRSxJQUFJLEVBQUUsWUFBWTtZQUNsQixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLElBQUksRUFBRTtnQkFDSixjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM1QixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDVixPQUFPLEVBQUUsS0FBSzt3QkFDZCxVQUFVLEVBQUU7NEJBQ1YsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTs0QkFDekIsSUFBSSxFQUFFO2dDQUNKLFVBQVUsRUFBRTtvQ0FDVixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO29DQUM3QixXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29DQUM3QixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29DQUN2QixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29DQUMxQixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO29DQUM3QixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO29DQUMzQixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29DQUN4QixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29DQUN2QixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO29DQUN6QixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO2lDQUMzQjs2QkFDRjs0QkFDRCxNQUFNLEVBQUU7Z0NBQ04sVUFBVSxFQUFFO29DQUNWLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7b0NBQy9CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7b0NBQ3pCLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7aUNBQzdCOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixnQkFBZ0IsRUFBRSxDQUFDO29CQUNuQixvQkFBb0IsRUFBRSxLQUFLO2lCQUM1QjtnQkFDRCxPQUFPLEVBQUUseUNBQWdCO2FBQzFCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2QsYUFDRSxJQUFJLENBQUMsS0FDUCw0QkFBNEIseUNBQWdCLGlCQUFpQixvQ0FBVyxHQUFHLENBQzVFLENBQUM7UUFFRixPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUEwQjtRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FDYiwwQkFDRSxZQUFZLENBQUMsUUFDZiwwQkFBMEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDM0QsQ0FBQztTQUNIO1FBRUQsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUM3QyxFQUFFO1lBQ0YsSUFBSTtZQUNKLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUN0QixPQUFPO1lBQ0wsR0FBRyxZQUFZO1lBQ2YsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHO1lBQ2QsY0FBYyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQzlCLFdBQVcsRUFBRSxNQUFNLENBQUMsYUFBYTtZQUNqQyxRQUFRLEVBQUUsQ0FBQztZQUNYLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSyxJQUFJLEVBQUU7U0FDaEMsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFrQixFQUFFO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2pCLElBQUk7WUFDSixZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDOUIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksS0FBSyxDQUFDLG1CQUFtQjtRQUM5QixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2pDLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFO3dCQUNKLEVBQUUsS0FBSyxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTt3QkFDbkQsRUFBRSxLQUFLLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUU7d0JBQ3pELEVBQUUsS0FBSyxFQUFFLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7d0JBQzNDLEVBQUUsS0FBSyxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxHQUFHLEVBQUUsb0NBQVcsRUFBRSxFQUFFLEVBQUU7cUJBQ3pEO2lCQUNGO2FBQ0Y7WUFDRCxJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4QyxtQkFBbUIsRUFBRSxJQUFJO1NBQzFCLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBeUI7UUFDM0MsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV2QyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzlDLElBQUksRUFBRTtnQkFDSixHQUFHLEVBQUUsTUFBTSxDQUFDLE9BQU87YUFDcEI7WUFDRCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsR0FBRyxDQUFDLGNBQWM7WUFDN0IsZUFBZSxFQUFFLEdBQUcsQ0FBQyxXQUFXO1lBQ2hDLG9FQUFvRTtZQUNwRSw4QkFBOEI7WUFDOUIsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0wsR0FBRyxHQUFHO1lBQ04sY0FBYyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQzlCLFdBQVcsRUFBRSxNQUFNLENBQUMsYUFBYTtTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDOUMsRUFBRTtZQUNGLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsUUFBUTtZQUNkLG9FQUFvRTtZQUNwRSw4QkFBOEI7WUFDOUIsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0wsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3BCLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRztZQUNkLGNBQWMsRUFBRSxNQUFNLENBQUMsT0FBTztZQUM5QixXQUFXLEVBQUUsTUFBTSxDQUFDLGFBQWE7WUFDakMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1NBQ3RCLENBQUM7SUFDSixDQUFDO0lBRU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFZLEVBQUU7UUFDakMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQyxNQUFNLGNBQWMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQ2xELE1BQU0sS0FBSyxHQUFHLGFBQWE7WUFDekIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUU7WUFDckQsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUVuQixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzlDLElBQUksRUFBRSxRQUFRO1lBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsSUFBSSxFQUFFO2dCQUNKLEdBQUcsSUFBSTtnQkFDUCxLQUFLO2FBQ047U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUVqQyxPQUFPO1lBQ0wsSUFBSSxFQUFHLE9BQXdCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztZQUNqRCxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7U0FDeEUsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTFURCw4QkEwVEM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxPQUFjLEVBQUU7SUFDdkMsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFFakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDaEIsT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO0lBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2pDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLEdBQWlCLEVBQUUsS0FBZ0I7SUFDcEQsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNsQyxNQUFNLE1BQU0sR0FBRztRQUNiLEdBQUcsVUFBVTtRQUNiLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ3hDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3RDLFFBQVEsRUFBRyxHQUE0QixDQUFDLFFBQVEsSUFBSSxDQUFDO1FBQ3JELFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxJQUFJLElBQUksSUFBSSxFQUFFO1FBQzFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxFQUFFO1FBQzlCLE1BQU0sRUFBRyxHQUE0QixDQUFDLE1BQU0sSUFBSSxNQUFNO0tBQ3ZELENBQUM7SUFFRixPQUFRLE1BQWMsQ0FBQyxFQUFFLENBQUM7SUFDMUIsT0FBUSxNQUFjLENBQUMsY0FBYyxDQUFDO0lBQ3RDLE9BQVEsTUFBYyxDQUFDLFdBQVcsQ0FBQztJQUNuQyxPQUFRLE1BQWMsQ0FBQyxJQUFJLENBQUM7SUFFNUIsT0FBTztRQUNMLEVBQUU7UUFDRixJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDM0IsT0FBTyxFQUFFLHlDQUFnQjtZQUN6QixVQUFVLEVBQUUsb0NBQVc7U0FDeEI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEdBQXlCLEVBQUUsS0FBZ0I7SUFDL0QsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVyRCxPQUFPO1FBQ0wsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ1gsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLO1FBQ25CLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQy9CLEtBQUssRUFBRSxRQUFRO1FBQ2YsT0FBTyxFQUFFLEdBQUcsQ0FBQyxjQUFjO1FBQzNCLGFBQWEsRUFBRSxHQUFHLENBQUMsV0FBVztLQUMvQixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEdBQWU7SUFDbkMsT0FBTztRQUNMLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1FBQ25CLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRztRQUNYLGNBQWMsRUFBRSxHQUFHLENBQUMsT0FBTztRQUMzQixXQUFXLEVBQUUsR0FBRyxDQUFDLGFBQWE7UUFDOUIsTUFBTSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQztRQUM5RCxLQUFLLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDO0tBQzVELENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBWSxFQUFFLFNBQWlCLEVBQUUsR0FBZTtJQUN0RSxJQUFJO1FBQ0YsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUNyQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLE9BQU8sU0FBUyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNyRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG4vKlxuICogVGhpcyBtb2R1bGUgY29udGFpbnMgaGVscGVycyBmb3IgbWFuYWdpbmcgdGhlIHRhc2sgbWFuYWdlciBzdG9yYWdlIGxheWVyLlxuICovXG5cbmltcG9ydCB7XG4gIFRBU0tfTUFOQUdFUl9BUElfVkVSU0lPTiBhcyBBUElfVkVSU0lPTixcbiAgVEFTS19NQU5BR0VSX1RFTVBMQVRFX1ZFUlNJT04gYXMgVEVNUExBVEVfVkVSU0lPTixcbn0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9saWIvbG9nZ2VyJztcbmltcG9ydCB7IENvbmNyZXRlVGFza0luc3RhbmNlLCBFbGFzdGljSnMsIFRhc2tJbnN0YW5jZSwgVGFza1N0YXR1cyB9IGZyb20gJy4vdGFzayc7XG5cbmNvbnN0IERPQ19UWVBFID0gJ19kb2MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlT3B0cyB7XG4gIGNhbGxDbHVzdGVyOiBFbGFzdGljSnM7XG4gIGdldEtpYmFuYVV1aWQ6ICgpID0+IHN0cmluZztcbiAgaW5kZXg6IHN0cmluZztcbiAgbWF4QXR0ZW1wdHM6IG51bWJlcjtcbiAgc3VwcG9ydGVkVHlwZXM6IHN0cmluZ1tdO1xuICBsb2dnZXI6IExvZ2dlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGZXRjaE9wdHMge1xuICBzZWFyY2hBZnRlcj86IGFueVtdO1xuICBzb3J0Pzogb2JqZWN0W107XG4gIHF1ZXJ5Pzogb2JqZWN0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZldGNoUmVzdWx0IHtcbiAgc2VhcmNoQWZ0ZXI6IGFueVtdO1xuICBkb2NzOiBDb25jcmV0ZVRhc2tJbnN0YW5jZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlbW92ZVJlc3VsdCB7XG4gIGluZGV4OiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIHNlcXVlbmNlTnVtYmVyOiBudW1iZXI7XG4gIHByaW1hcnlUZXJtOiBudW1iZXI7XG4gIHJlc3VsdDogc3RyaW5nO1xufVxuXG4vLyBJbnRlcm5hbCwgdGhlIHJhdyBkb2N1bWVudCwgYXMgc3RvcmVkIGluIHRoZSBLaWJhbmEgaW5kZXguXG5leHBvcnQgaW50ZXJmYWNlIFJhd1Rhc2tEb2Mge1xuICBfaWQ6IHN0cmluZztcbiAgX2luZGV4OiBzdHJpbmc7XG4gIF90eXBlOiBzdHJpbmc7XG4gIF9zZXFfbm86IG51bWJlcjtcbiAgX3ByaW1hcnlfdGVybTogbnVtYmVyO1xuICBfc291cmNlOiB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGtpYmFuYToge1xuICAgICAgdXVpZDogc3RyaW5nO1xuICAgICAgdmVyc2lvbjogbnVtYmVyO1xuICAgICAgYXBpVmVyc2lvbjogbnVtYmVyO1xuICAgIH07XG4gICAgdGFzazoge1xuICAgICAgdGFza1R5cGU6IHN0cmluZztcbiAgICAgIHNjaGVkdWxlZEF0OiBEYXRlO1xuICAgICAgcnVuQXQ6IERhdGU7XG4gICAgICBpbnRlcnZhbD86IHN0cmluZztcbiAgICAgIGF0dGVtcHRzOiBudW1iZXI7XG4gICAgICBzdGF0dXM6IFRhc2tTdGF0dXM7XG4gICAgICBwYXJhbXM6IHN0cmluZztcbiAgICAgIHN0YXRlOiBzdHJpbmc7XG4gICAgICB1c2VyPzogc3RyaW5nO1xuICAgICAgc2NvcGU/OiBzdHJpbmdbXTtcbiAgICB9O1xuICB9O1xufVxuXG4vKipcbiAqIFdyYXBzIGFuIGVsYXN0aWNzZWFyY2ggY29ubmVjdGlvbiBhbmQgcHJvdmlkZXMgYSB0YXNrIG1hbmFnZXItc3BlY2lmaWNcbiAqIGludGVyZmFjZSBpbnRvIHRoZSBpbmRleC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhc2tTdG9yZSB7XG4gIHB1YmxpYyByZWFkb25seSBtYXhBdHRlbXB0czogbnVtYmVyO1xuICBwdWJsaWMgZ2V0S2liYW5hVXVpZDogKCkgPT4gc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgaW5kZXg6IHN0cmluZztcbiAgcHJpdmF0ZSBjYWxsQ2x1c3RlcjogRWxhc3RpY0pzO1xuICBwcml2YXRlIHN1cHBvcnRlZFR5cGVzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZCA9IGZhbHNlOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBUYXNrU3RvcmUuXG4gICAqIEBwYXJhbSB7U3RvcmVPcHRzfSBvcHRzXG4gICAqIEBwcm9wIHtDYWxsQ2x1c3Rlcn0gY2FsbENsdXN0ZXIgLSBUaGUgZWxhc3RpYyBzZWFyY2ggY29ubmVjdGlvblxuICAgKiBAcHJvcCB7c3RyaW5nfSBpbmRleCAtIFRoZSBuYW1lIG9mIHRoZSB0YXNrIG1hbmFnZXIgaW5kZXhcbiAgICogQHByb3Age251bWJlcn0gbWF4QXR0ZW1wdHMgLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXR0ZW1wdHMgYmVmb3JlIGEgdGFzayB3aWxsIGJlIGFiYW5kb25lZFxuICAgKiBAcHJvcCB7c3RyaW5nW119IHN1cHBvcnRlZFR5cGVzIC0gVGhlIHRhc2sgdHlwZXMgc3VwcG9ydGVkIGJ5IHRoaXMgc3RvcmVcbiAgICogQHByb3Age0xvZ2dlcn0gbG9nZ2VyIC0gVGhlIHRhc2sgbWFuYWdlciBsb2dnZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzOiBTdG9yZU9wdHMpIHtcbiAgICB0aGlzLmNhbGxDbHVzdGVyID0gb3B0cy5jYWxsQ2x1c3RlcjtcbiAgICB0aGlzLmluZGV4ID0gb3B0cy5pbmRleDtcbiAgICB0aGlzLm1heEF0dGVtcHRzID0gb3B0cy5tYXhBdHRlbXB0cztcbiAgICB0aGlzLnN1cHBvcnRlZFR5cGVzID0gb3B0cy5zdXBwb3J0ZWRUeXBlcztcbiAgICB0aGlzLmxvZ2dlciA9IG9wdHMubG9nZ2VyO1xuICAgIHRoaXMuZ2V0S2liYW5hVXVpZCA9IG9wdHMuZ2V0S2liYW5hVXVpZDtcblxuICAgIHRoaXMuZmV0Y2hBdmFpbGFibGVUYXNrcyA9IHRoaXMuZmV0Y2hBdmFpbGFibGVUYXNrcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFkZFN1cHBvcnRlZFR5cGVzKHR5cGVzOiBzdHJpbmdbXSkge1xuICAgIGlmICghdGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlcyA9IHRoaXMuc3VwcG9ydGVkVHlwZXMuY29uY2F0KHR5cGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIHRhc2sgdHlwZXMgYWZ0ZXIgaW5pdGlhbGl6YXRpb24nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHN0b3JlLCBlbnN1cmluZyB0aGUgdGFzayBtYW5hZ2VyIGluZGV4IHRlbXBsYXRlIGlzIGNyZWF0ZWRcbiAgICogYW5kIHRoZSB2ZXJzaW9uIGlzIHVwIHRvIGRhdGUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYXNrU3RvcmUgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCEnKTtcbiAgICB9XG5cbiAgICBsZXQgZXhpc3RpbmdWZXJzaW9uID0gLUluZmluaXR5O1xuICAgIGNvbnN0IHRlbXBsYXRlTmFtZSA9IHRoaXMuaW5kZXg7XG5cbiAgICB0cnkge1xuICAgICAgLy8gY2hlY2sgaWYgdGVtcGxhdGUgZXhpc3RzXG4gICAgICBjb25zdCB0ZW1wbGF0ZUNoZWNrID0gYXdhaXQgdGhpcy5jYWxsQ2x1c3RlcignaW5kaWNlcy5nZXRUZW1wbGF0ZScsIHtcbiAgICAgICAgbmFtZTogdGVtcGxhdGVOYW1lLFxuICAgICAgICBpbmNsdWRlX3R5cGVfbmFtZTogdHJ1ZSxcbiAgICAgICAgZmlsdGVyX3BhdGg6ICcqLnZlcnNpb24nLFxuICAgICAgfSk7XG4gICAgICAvLyBleHRyYWN0IHRoZSBleGlzdGluZyB2ZXJzaW9uXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRlbXBsYXRlQ2hlY2tbdGVtcGxhdGVOYW1lXSB8fCB7fTtcbiAgICAgIGV4aXN0aW5nVmVyc2lvbiA9IHRlbXBsYXRlLnZlcnNpb24gfHwgMDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIuc3RhdHVzQ29kZSAhPT0gNDA0KSB7XG4gICAgICAgIHRocm93IGVycjsgLy8gaWdub3JlIG5vdCBmb3VuZFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChleGlzdGluZ1ZlcnNpb24gPiBURU1QTEFURV9WRVJTSU9OKSB7XG4gICAgICAvLyBEbyBub3QgdHJhbXBsZSBhIG5ld2VyIHZlcnNpb24gdGVtcGxhdGVcbiAgICAgIHRoaXMubG9nZ2VyLndhcm5pbmcoXG4gICAgICAgIGBUaGlzIEtpYmFuYSBpbnN0YW5jZSBkZWZpbmVzIGFuIG9sZGVyIHRlbXBsYXRlIHZlcnNpb24gKCR7VEVNUExBVEVfVkVSU0lPTn0pIHRoYW4gaXMgY3VycmVudGx5IGluIEVsYXN0aWNzZWFyY2ggKCR7ZXhpc3RpbmdWZXJzaW9ufSkuIGAgK1xuICAgICAgICAgIGBCZWNhdXNlIG9mIHRoZSBwb3RlbnRpYWwgZm9yIG5vbi1iYWNrd2FyZHMgY29tcGF0aWJsZSBjaGFuZ2VzLCB0aGlzIEtpYmFuYSBpbnN0YW5jZSB3aWxsIG9ubHkgYmUgYWJsZSB0byBjbGFpbSBzY2hlZHVsZWQgdGFza3Mgd2l0aCBgICtcbiAgICAgICAgICBgXCJraWJhbmEuYXBpVmVyc2lvblwiIDw9ICR7QVBJX1ZFUlNJT059IGluIHRoZSB0YXNrIG1ldGFkYXRhLmBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChleGlzdGluZ1ZlcnNpb24gPT09IFRFTVBMQVRFX1ZFUlNJT04pIHtcbiAgICAgIC8vIFRoZSBsYXRlc3QgdGVtcGxhdGUgaXMgYWxyZWFkeSBzYXZlZCwgc28ganVzdCBsb2cgYSBkZWJ1ZyBsaW5lLlxuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXG4gICAgICAgIGBOb3QgaW5zdGFsbGluZyAke3RoaXMuaW5kZXh9IGluZGV4IHRlbXBsYXRlOiB2ZXJzaW9uICR7VEVNUExBVEVfVkVSU0lPTn0gYWxyZWFkeSBleGlzdHMuYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBY3RpdmF0ZSB0ZW1wbGF0ZSBjcmVhdGlvbiAvIHVwZGF0ZVxuICAgIGlmIChleGlzdGluZ1ZlcnNpb24gPiAwKSB7XG4gICAgICB0aGlzLmxvZ2dlci5pbmZvKFxuICAgICAgICBgVXBncmFkaW5nICR7XG4gICAgICAgICAgdGhpcy5pbmRleFxuICAgICAgICB9IGluZGV4IHRlbXBsYXRlLiBPbGQgdmVyc2lvbjogJHtleGlzdGluZ1ZlcnNpb259LCBOZXcgdmVyc2lvbjogJHtURU1QTEFURV9WRVJTSU9OfS5gXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlci5pbmZvKGBJbnN0YWxsaW5nICR7dGhpcy5pbmRleH0gaW5kZXggdGVtcGxhdGUgdmVyc2lvbjogJHtURU1QTEFURV9WRVJTSU9OfS5gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9IGF3YWl0IHRoaXMuY2FsbENsdXN0ZXIoJ2luZGljZXMucHV0VGVtcGxhdGUnLCB7XG4gICAgICBuYW1lOiB0ZW1wbGF0ZU5hbWUsXG4gICAgICBpbmNsdWRlX3R5cGVfbmFtZTogdHJ1ZSxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgaW5kZXhfcGF0dGVybnM6IFt0aGlzLmluZGV4XSxcbiAgICAgICAgbWFwcGluZ3M6IHtcbiAgICAgICAgICBbRE9DX1RZUEVdOiB7XG4gICAgICAgICAgICBkeW5hbWljOiBmYWxzZSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogeyB0eXBlOiAna2V5d29yZCcgfSxcbiAgICAgICAgICAgICAgdGFzazoge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgIHRhc2tUeXBlOiB7IHR5cGU6ICdrZXl3b3JkJyB9LFxuICAgICAgICAgICAgICAgICAgc2NoZWR1bGVkQXQ6IHsgdHlwZTogJ2RhdGUnIH0sXG4gICAgICAgICAgICAgICAgICBydW5BdDogeyB0eXBlOiAnZGF0ZScgfSxcbiAgICAgICAgICAgICAgICAgIGludGVydmFsOiB7IHR5cGU6ICd0ZXh0JyB9LFxuICAgICAgICAgICAgICAgICAgYXR0ZW1wdHM6IHsgdHlwZTogJ2ludGVnZXInIH0sXG4gICAgICAgICAgICAgICAgICBzdGF0dXM6IHsgdHlwZTogJ2tleXdvcmQnIH0sXG4gICAgICAgICAgICAgICAgICBwYXJhbXM6IHsgdHlwZTogJ3RleHQnIH0sXG4gICAgICAgICAgICAgICAgICBzdGF0ZTogeyB0eXBlOiAndGV4dCcgfSxcbiAgICAgICAgICAgICAgICAgIHVzZXI6IHsgdHlwZTogJ2tleXdvcmQnIH0sXG4gICAgICAgICAgICAgICAgICBzY29wZTogeyB0eXBlOiAna2V5d29yZCcgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBraWJhbmE6IHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICBhcGlWZXJzaW9uOiB7IHR5cGU6ICdpbnRlZ2VyJyB9LCAvLyAxLCAyLCAzLCBldGNcbiAgICAgICAgICAgICAgICAgIHV1aWQ6IHsgdHlwZTogJ2tleXdvcmQnIH0sIC8vXG4gICAgICAgICAgICAgICAgICB2ZXJzaW9uOiB7IHR5cGU6ICdpbnRlZ2VyJyB9LCAvLyA3MDAwMDk5LCBldGNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgIG51bWJlcl9vZl9zaGFyZHM6IDEsXG4gICAgICAgICAgYXV0b19leHBhbmRfcmVwbGljYXM6ICcwLTEnLFxuICAgICAgICB9LFxuICAgICAgICB2ZXJzaW9uOiBURU1QTEFURV9WRVJTSU9OLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMubG9nZ2VyLmluZm8oXG4gICAgICBgSW5zdGFsbGVkICR7XG4gICAgICAgIHRoaXMuaW5kZXhcbiAgICAgIH0gaW5kZXggdGVtcGxhdGU6IHZlcnNpb24gJHtURU1QTEFURV9WRVJTSU9OfSAoQVBJIHZlcnNpb24gJHtBUElfVkVSU0lPTn0pYFxuICAgICk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVSZXN1bHQ7XG4gIH1cblxuICBnZXQgaXNJbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNJbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYSB0YXNrLlxuICAgKlxuICAgKiBAcGFyYW0gdGFzayAtIFRoZSB0YXNrIGJlaW5nIHNjaGVkdWxlZC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBzY2hlZHVsZSh0YXNrSW5zdGFuY2U6IFRhc2tJbnN0YW5jZSk6IFByb21pc2U8Q29uY3JldGVUYXNrSW5zdGFuY2U+IHtcbiAgICBpZiAoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdXBwb3J0ZWRUeXBlcy5pbmNsdWRlcyh0YXNrSW5zdGFuY2UudGFza1R5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbnN1cHBvcnRlZCB0YXNrIHR5cGUgXCIke1xuICAgICAgICAgIHRhc2tJbnN0YW5jZS50YXNrVHlwZVxuICAgICAgICB9XCIuIFN1cHBvcnRlZCB0eXBlcyBhcmUgJHt0aGlzLnN1cHBvcnRlZFR5cGVzLmpvaW4oJywgJyl9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGlkLCAuLi5ib2R5IH0gPSByYXdTb3VyY2UodGFza0luc3RhbmNlLCB0aGlzKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmNhbGxDbHVzdGVyKCdpbmRleCcsIHtcbiAgICAgIGlkLFxuICAgICAgYm9keSxcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgdHlwZTogRE9DX1RZUEUsXG4gICAgICByZWZyZXNoOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgeyB0YXNrIH0gPSBib2R5O1xuICAgIHJldHVybiB7XG4gICAgICAuLi50YXNrSW5zdGFuY2UsXG4gICAgICBpZDogcmVzdWx0Ll9pZCxcbiAgICAgIHNlcXVlbmNlTnVtYmVyOiByZXN1bHQuX3NlcV9ubyxcbiAgICAgIHByaW1hcnlUZXJtOiByZXN1bHQuX3ByaW1hcnlfdGVybSxcbiAgICAgIGF0dGVtcHRzOiAwLFxuICAgICAgc3RhdHVzOiB0YXNrLnN0YXR1cyxcbiAgICAgIHNjaGVkdWxlZEF0OiB0YXNrLnNjaGVkdWxlZEF0LFxuICAgICAgcnVuQXQ6IHRhc2sucnVuQXQsXG4gICAgICBzdGF0ZTogdGFza0luc3RhbmNlLnN0YXRlIHx8IHt9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyBhIHBhZ2luYXRhYmxlIGxpc3Qgb2Ygc2NoZWR1bGVkIHRhc2tzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyAtIFRoZSBxdWVyeSBvcHRpb25zIHVzZWQgdG8gZmlsdGVyIHRhc2tzXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZmV0Y2gob3B0czogRmV0Y2hPcHRzID0ge30pOiBQcm9taXNlPEZldGNoUmVzdWx0PiB7XG4gICAgY29uc3Qgc29ydCA9IHBhZ2luYXRhYmxlU29ydChvcHRzLnNvcnQpO1xuICAgIHJldHVybiB0aGlzLnNlYXJjaCh7XG4gICAgICBzb3J0LFxuICAgICAgc2VhcmNoX2FmdGVyOiBvcHRzLnNlYXJjaEFmdGVyLFxuICAgICAgcXVlcnk6IG9wdHMucXVlcnksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0YXNrcyBmcm9tIHRoZSBpbmRleCwgd2hpY2ggYXJlIHJlYWR5IHRvIGJlIHJ1bi5cbiAgICogLSBydW5BdCBpcyBub3cgb3IgcGFzdFxuICAgKiAtIGlkIGlzIG5vdCBjdXJyZW50bHkgcnVubmluZyBpbiB0aGlzIGluc3RhbmNlIG9mIEtpYmFuYVxuICAgKiAtIGhhcyBhIHR5cGUgdGhhdCBpcyBpbiBvdXIgdGFzayBkZWZpbml0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge1Rhc2tRdWVyeX0gcXVlcnlcbiAgICogQHByb3Age3N0cmluZ1tdfSB0eXBlcyAtIFRhc2sgdHlwZXMgdG8gYmUgcXVlcmllZFxuICAgKiBAcHJvcCB7bnVtYmVyfSBzaXplIC0gVGhlIG51bWJlciBvZiB0YXNrIGluc3RhbmNlcyB0byByZXRyaWV2ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxDb25jcmV0ZVRhc2tJbnN0YW5jZVtdPn1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBmZXRjaEF2YWlsYWJsZVRhc2tzKCk6IFByb21pc2U8Q29uY3JldGVUYXNrSW5zdGFuY2VbXT4ge1xuICAgIGNvbnN0IHsgZG9jcyB9ID0gYXdhaXQgdGhpcy5zZWFyY2goe1xuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIG11c3Q6IFtcbiAgICAgICAgICAgIHsgdGVybXM6IHsgJ3Rhc2sudGFza1R5cGUnOiB0aGlzLnN1cHBvcnRlZFR5cGVzIH0gfSxcbiAgICAgICAgICAgIHsgcmFuZ2U6IHsgJ3Rhc2suYXR0ZW1wdHMnOiB7IGx0ZTogdGhpcy5tYXhBdHRlbXB0cyB9IH0gfSxcbiAgICAgICAgICAgIHsgcmFuZ2U6IHsgJ3Rhc2sucnVuQXQnOiB7IGx0ZTogJ25vdycgfSB9IH0sXG4gICAgICAgICAgICB7IHJhbmdlOiB7ICdraWJhbmEuYXBpVmVyc2lvbic6IHsgbHRlOiBBUElfVkVSU0lPTiB9IH0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNpemU6IDEwLFxuICAgICAgc29ydDogeyAndGFzay5ydW5BdCc6IHsgb3JkZXI6ICdhc2MnIH0gfSxcbiAgICAgIHNlcV9ub19wcmltYXJ5X3Rlcm06IHRydWUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZG9jcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzcGVjaWZpZWQgZG9jIGluIHRoZSBpbmRleCwgcmV0dXJuaW5nIHRoZSBkb2NcbiAgICogd2l0aCBpdHMgdmVyc2lvbiB1cCB0byBkYXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge1Rhc2tEb2N9IGRvY1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUYXNrRG9jPn1cbiAgICovXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUoZG9jOiBDb25jcmV0ZVRhc2tJbnN0YW5jZSk6IFByb21pc2U8Q29uY3JldGVUYXNrSW5zdGFuY2U+IHtcbiAgICBjb25zdCByYXdEb2MgPSB0YXNrRG9jVG9SYXcoZG9jLCB0aGlzKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY2FsbENsdXN0ZXIoJ3VwZGF0ZScsIHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgZG9jOiByYXdEb2MuX3NvdXJjZSxcbiAgICAgIH0sXG4gICAgICBpZDogZG9jLmlkLFxuICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICB0eXBlOiBET0NfVFlQRSxcbiAgICAgIGlmX3NlcV9ubzogZG9jLnNlcXVlbmNlTnVtYmVyLFxuICAgICAgaWZfcHJpbWFyeV90ZXJtOiBkb2MucHJpbWFyeVRlcm0sXG4gICAgICAvLyBUaGUgcmVmcmVzaCBpcyBpbXBvcnRhbnQgc28gdGhhdCBpZiB3ZSBpbW1lZGlhdGVseSBsb29rIGZvciB3b3JrLFxuICAgICAgLy8gd2UgZG9uJ3QgcGljayB1cCB0aGlzIHRhc2suXG4gICAgICByZWZyZXNoOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmRvYyxcbiAgICAgIHNlcXVlbmNlTnVtYmVyOiByZXN1bHQuX3NlcV9ubyxcbiAgICAgIHByaW1hcnlUZXJtOiByZXN1bHQuX3ByaW1hcnlfdGVybSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCB0YXNrIGZyb20gdGhlIGluZGV4LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPFJlbW92ZVJlc3VsdD4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY2FsbENsdXN0ZXIoJ2RlbGV0ZScsIHtcbiAgICAgIGlkLFxuICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICB0eXBlOiBET0NfVFlQRSxcbiAgICAgIC8vIFRoZSByZWZyZXNoIGlzIGltcG9ydGFudCBzbyB0aGF0IGlmIHdlIGltbWVkaWF0ZWx5IGxvb2sgZm9yIHdvcmssXG4gICAgICAvLyB3ZSBkb24ndCBwaWNrIHVwIHRoaXMgdGFzay5cbiAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXg6IHJlc3VsdC5faW5kZXgsXG4gICAgICBpZDogcmVzdWx0Ll9pZCxcbiAgICAgIHNlcXVlbmNlTnVtYmVyOiByZXN1bHQuX3NlcV9ubyxcbiAgICAgIHByaW1hcnlUZXJtOiByZXN1bHQuX3ByaW1hcnlfdGVybSxcbiAgICAgIHJlc3VsdDogcmVzdWx0LnJlc3VsdCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZWFyY2gob3B0czogYW55ID0ge30pOiBQcm9taXNlPEZldGNoUmVzdWx0PiB7XG4gICAgY29uc3Qgb3JpZ2luYWxRdWVyeSA9IG9wdHMucXVlcnk7XG4gICAgY29uc3QgcXVlcnlPbmx5VGFza3MgPSB7IHRlcm06IHsgdHlwZTogJ3Rhc2snIH0gfTtcbiAgICBjb25zdCBxdWVyeSA9IG9yaWdpbmFsUXVlcnlcbiAgICAgID8geyBib29sOiB7IG11c3Q6IFtxdWVyeU9ubHlUYXNrcywgb3JpZ2luYWxRdWVyeV0gfSB9XG4gICAgICA6IHF1ZXJ5T25seVRhc2tzO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jYWxsQ2x1c3Rlcignc2VhcmNoJywge1xuICAgICAgdHlwZTogRE9DX1RZUEUsXG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIGlnbm9yZVVuYXZhaWxhYmxlOiB0cnVlLFxuICAgICAgYm9keToge1xuICAgICAgICAuLi5vcHRzLFxuICAgICAgICBxdWVyeSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCByYXdEb2NzID0gcmVzdWx0LmhpdHMuaGl0cztcblxuICAgIHJldHVybiB7XG4gICAgICBkb2NzOiAocmF3RG9jcyBhcyBSYXdUYXNrRG9jW10pLm1hcChyYXdUb1Rhc2tEb2MpLFxuICAgICAgc2VhcmNoQWZ0ZXI6IChyYXdEb2NzLmxlbmd0aCAmJiByYXdEb2NzW3Jhd0RvY3MubGVuZ3RoIC0gMV0uc29ydCkgfHwgW10sXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYWdpbmF0YWJsZVNvcnQoc29ydDogYW55W10gPSBbXSkge1xuICBjb25zdCBzb3J0QnlJZCA9IHsgX2lkOiAnZGVzYycgfTtcblxuICBpZiAoIXNvcnQubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFt7ICd0YXNrLnJ1bkF0JzogJ2FzYycgfSwgc29ydEJ5SWRdO1xuICB9XG5cbiAgaWYgKHNvcnQuZmluZCgoeyBfaWQgfSkgPT4gISFfaWQpKSB7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cblxuICByZXR1cm4gWy4uLnNvcnQsIHNvcnRCeUlkXTtcbn1cblxuZnVuY3Rpb24gcmF3U291cmNlKGRvYzogVGFza0luc3RhbmNlLCBzdG9yZTogVGFza1N0b3JlKSB7XG4gIGNvbnN0IHsgaWQsIC4uLnRhc2tGaWVsZHMgfSA9IGRvYztcbiAgY29uc3Qgc291cmNlID0ge1xuICAgIC4uLnRhc2tGaWVsZHMsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeShkb2MucGFyYW1zIHx8IHt9KSxcbiAgICBzdGF0ZTogSlNPTi5zdHJpbmdpZnkoZG9jLnN0YXRlIHx8IHt9KSxcbiAgICBhdHRlbXB0czogKGRvYyBhcyBDb25jcmV0ZVRhc2tJbnN0YW5jZSkuYXR0ZW1wdHMgfHwgMCxcbiAgICBzY2hlZHVsZWRBdDogZG9jLnNjaGVkdWxlZEF0IHx8IG5ldyBEYXRlKCksXG4gICAgcnVuQXQ6IGRvYy5ydW5BdCB8fCBuZXcgRGF0ZSgpLFxuICAgIHN0YXR1czogKGRvYyBhcyBDb25jcmV0ZVRhc2tJbnN0YW5jZSkuc3RhdHVzIHx8ICdpZGxlJyxcbiAgfTtcblxuICBkZWxldGUgKHNvdXJjZSBhcyBhbnkpLmlkO1xuICBkZWxldGUgKHNvdXJjZSBhcyBhbnkpLnNlcXVlbmNlTnVtYmVyO1xuICBkZWxldGUgKHNvdXJjZSBhcyBhbnkpLnByaW1hcnlUZXJtO1xuICBkZWxldGUgKHNvdXJjZSBhcyBhbnkpLnR5cGU7XG5cbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICB0eXBlOiAndGFzaycsXG4gICAgdGFzazogc291cmNlLFxuICAgIGtpYmFuYToge1xuICAgICAgdXVpZDogc3RvcmUuZ2V0S2liYW5hVXVpZCgpLCAvLyBuZWVkcyB0byBiZSBwdWxsZWQgbGl2ZVxuICAgICAgdmVyc2lvbjogVEVNUExBVEVfVkVSU0lPTixcbiAgICAgIGFwaVZlcnNpb246IEFQSV9WRVJTSU9OLFxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRhc2tEb2NUb1Jhdyhkb2M6IENvbmNyZXRlVGFza0luc3RhbmNlLCBzdG9yZTogVGFza1N0b3JlKTogUmF3VGFza0RvYyB7XG4gIGNvbnN0IHsgdHlwZSwgdGFzaywga2liYW5hIH0gPSByYXdTb3VyY2UoZG9jLCBzdG9yZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBfaWQ6IGRvYy5pZCxcbiAgICBfaW5kZXg6IHN0b3JlLmluZGV4LFxuICAgIF9zb3VyY2U6IHsgdHlwZSwgdGFzaywga2liYW5hIH0sXG4gICAgX3R5cGU6IERPQ19UWVBFLFxuICAgIF9zZXFfbm86IGRvYy5zZXF1ZW5jZU51bWJlcixcbiAgICBfcHJpbWFyeV90ZXJtOiBkb2MucHJpbWFyeVRlcm0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJhd1RvVGFza0RvYyhkb2M6IFJhd1Rhc2tEb2MpOiBDb25jcmV0ZVRhc2tJbnN0YW5jZSB7XG4gIHJldHVybiB7XG4gICAgLi4uZG9jLl9zb3VyY2UudGFzayxcbiAgICBpZDogZG9jLl9pZCxcbiAgICBzZXF1ZW5jZU51bWJlcjogZG9jLl9zZXFfbm8sXG4gICAgcHJpbWFyeVRlcm06IGRvYy5fcHJpbWFyeV90ZXJtLFxuICAgIHBhcmFtczogcGFyc2VKU09ORmllbGQoZG9jLl9zb3VyY2UudGFzay5wYXJhbXMsICdwYXJhbXMnLCBkb2MpLFxuICAgIHN0YXRlOiBwYXJzZUpTT05GaWVsZChkb2MuX3NvdXJjZS50YXNrLnN0YXRlLCAnc3RhdGUnLCBkb2MpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZUpTT05GaWVsZChqc29uOiBzdHJpbmcsIGZpZWxkTmFtZTogc3RyaW5nLCBkb2M6IFJhd1Rhc2tEb2MpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4ganNvbiA/IEpTT04ucGFyc2UoanNvbikgOiB7fTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRhc2sgXCIke2RvYy5faWR9XCIncyAke2ZpZWxkTmFtZX0gZmllbGQgaGFzIGludmFsaWQgSlNPTjogJHtqc29ufWApO1xuICB9XG59XG4iXX0=