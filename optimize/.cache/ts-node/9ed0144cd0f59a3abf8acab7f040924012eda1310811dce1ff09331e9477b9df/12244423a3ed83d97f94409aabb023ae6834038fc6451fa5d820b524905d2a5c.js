"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../common/constants");
const coerceToArray = (param) => {
    if (Array.isArray(param)) {
        return param;
    }
    return [param];
};
const getNamespace = (spaceId) => {
    if (spaceId === constants_1.DEFAULT_SPACE_ID) {
        return undefined;
    }
    return spaceId;
};
const throwErrorIfNamespaceSpecified = (options) => {
    if (options.namespace) {
        throw new Error('Spaces currently determines the namespaces');
    }
};
const throwErrorIfTypeIsSpace = (type) => {
    if (type === 'space') {
        throw new Error('Spaces can not be accessed using the SavedObjectsClient');
    }
};
const throwErrorIfTypesContainsSpace = (types) => {
    for (const type of types) {
        throwErrorIfTypeIsSpace(type);
    }
};
class SpacesSavedObjectsClient {
    constructor(options) {
        const { baseClient, request, spacesService, types } = options;
        this.errors = baseClient.errors;
        this.client = baseClient;
        this.spaceId = spacesService.getSpaceId(request);
        this.types = types;
    }
    /**
     * Persists an object
     *
     * @param {string} type
     * @param {object} attributes
     * @param {object} [options={}]
     * @property {string} [options.id] - force id on creation, not recommended
     * @property {boolean} [options.overwrite=false]
     * @property {string} [options.namespace]
     * @returns {promise} - { id, type, version, attributes }
     */
    async create(type, attributes = {}, options = {}) {
        throwErrorIfTypeIsSpace(type);
        throwErrorIfNamespaceSpecified(options);
        return await this.client.create(type, attributes, {
            ...options,
            namespace: getNamespace(this.spaceId),
        });
    }
    /**
     * Creates multiple documents at once
     *
     * @param {array} objects - [{ type, id, attributes, extraDocumentProperties }]
     * @param {object} [options={}]
     * @property {boolean} [options.overwrite=false] - overwrites existing documents
     * @property {string} [options.namespace]
     * @returns {promise} - { saved_objects: [{ id, type, version, attributes, error: { message } }]}
     */
    async bulkCreate(objects, options = {}) {
        throwErrorIfTypesContainsSpace(objects.map(object => object.type));
        throwErrorIfNamespaceSpecified(options);
        return await this.client.bulkCreate(objects, {
            ...options,
            namespace: getNamespace(this.spaceId),
        });
    }
    /**
     * Deletes an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} [options={}]
     * @property {string} [options.namespace]
     * @returns {promise}
     */
    async delete(type, id, options = {}) {
        throwErrorIfTypeIsSpace(type);
        throwErrorIfNamespaceSpecified(options);
        return await this.client.delete(type, id, {
            ...options,
            namespace: getNamespace(this.spaceId),
        });
    }
    /**
     * @param {object} [options={}]
     * @property {(string|Array<string>)} [options.type]
     * @property {string} [options.search]
     * @property {Array<string>} [options.searchFields] - see Elasticsearch Simple Query String
     *                                        Query field argument for more information
     * @property {integer} [options.page=1]
     * @property {integer} [options.perPage=20]
     * @property {string} [options.sortField]
     * @property {string} [options.sortOrder]
     * @property {Array<string>} [options.fields]
     * @property {string} [options.namespace]
     * @returns {promise} - { saved_objects: [{ id, type, version, attributes }], total, per_page, page }
     */
    async find(options = {}) {
        if (options.type) {
            throwErrorIfTypesContainsSpace(coerceToArray(options.type));
        }
        throwErrorIfNamespaceSpecified(options);
        return await this.client.find({
            ...options,
            type: (options.type ? coerceToArray(options.type) : this.types).filter(type => type !== 'space'),
            namespace: getNamespace(this.spaceId),
        });
    }
    /**
     * Returns an array of objects by id
     *
     * @param {array} objects - an array ids, or an array of objects containing id and optionally type
     * @param {object} [options={}]
     * @property {string} [options.namespace]
     * @returns {promise} - { saved_objects: [{ id, type, version, attributes }] }
     * @example
     *
     * bulkGet([
     *   { id: 'one', type: 'config' },
     *   { id: 'foo', type: 'index-pattern' }
     * ])
     */
    async bulkGet(objects = [], options = {}) {
        throwErrorIfTypesContainsSpace(objects.map(object => object.type));
        throwErrorIfNamespaceSpecified(options);
        return await this.client.bulkGet(objects, {
            ...options,
            namespace: getNamespace(this.spaceId),
        });
    }
    /**
     * Gets a single object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} [options={}]
     * @property {string} [options.namespace]
     * @returns {promise} - { id, type, version, attributes }
     */
    async get(type, id, options = {}) {
        throwErrorIfTypeIsSpace(type);
        throwErrorIfNamespaceSpecified(options);
        return await this.client.get(type, id, {
            ...options,
            namespace: getNamespace(this.spaceId),
        });
    }
    /**
     * Updates an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} [options={}]
     * @property {string} options.version - ensures version matches that of persisted object
     * @property {string} [options.namespace]
     * @returns {promise}
     */
    async update(type, id, attributes, options = {}) {
        throwErrorIfTypeIsSpace(type);
        throwErrorIfNamespaceSpecified(options);
        return await this.client.update(type, id, attributes, {
            ...options,
            namespace: getNamespace(this.spaceId),
        });
    }
}
exports.SpacesSavedObjectsClient = SpacesSavedObjectsClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvc2F2ZWRfb2JqZWN0c19jbGllbnQvc3BhY2VzX3NhdmVkX29iamVjdHNfY2xpZW50LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9zcGFjZXMvc2VydmVyL2xpYi9zYXZlZF9vYmplY3RzX2NsaWVudC9zcGFjZXNfc2F2ZWRfb2JqZWN0c19jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBWUgseURBQTZEO0FBVTdELE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBd0IsRUFBRSxFQUFFO0lBQ2pELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUU7SUFDdkMsSUFBSSxPQUFPLEtBQUssNEJBQWdCLEVBQUU7UUFDaEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRixNQUFNLDhCQUE4QixHQUFHLENBQUMsT0FBWSxFQUFFLEVBQUU7SUFDdEQsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztLQUMvRDtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUMvQyxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0tBQzVFO0FBQ0gsQ0FBQyxDQUFDO0FB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RCxHQUFHLE9BQU87WUFDVixTQUFTLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBL0tELDREQStLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gIEJhc2VPcHRpb25zLFxuICBCdWxrQ3JlYXRlT2JqZWN0LFxuICBCdWxrR2V0T2JqZWN0cyxcbiAgQ3JlYXRlT3B0aW9ucyxcbiAgRmluZE9wdGlvbnMsXG4gIFNhdmVkT2JqZWN0QXR0cmlidXRlcyxcbiAgU2F2ZWRPYmplY3RzQ2xpZW50LFxuICBVcGRhdGVPcHRpb25zLFxufSBmcm9tICdzcmMvc2VydmVyL3NhdmVkX29iamVjdHMvc2VydmljZS9zYXZlZF9vYmplY3RzX2NsaWVudCc7XG5pbXBvcnQgeyBERUZBVUxUX1NQQUNFX0lEIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBTcGFjZXNTZXJ2aWNlIH0gZnJvbSAnLi4vY3JlYXRlX3NwYWNlc19zZXJ2aWNlJztcblxuaW50ZXJmYWNlIFNwYWNlc1NhdmVkT2JqZWN0c0NsaWVudE9wdGlvbnMge1xuICBiYXNlQ2xpZW50OiBTYXZlZE9iamVjdHNDbGllbnQ7XG4gIHJlcXVlc3Q6IGFueTtcbiAgc3BhY2VzU2VydmljZTogU3BhY2VzU2VydmljZTtcbiAgdHlwZXM6IHN0cmluZ1tdO1xufVxuXG5jb25zdCBjb2VyY2VUb0FycmF5ID0gKHBhcmFtOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbSkpIHtcbiAgICByZXR1cm4gcGFyYW07XG4gIH1cblxuICByZXR1cm4gW3BhcmFtXTtcbn07XG5cbmNvbnN0IGdldE5hbWVzcGFjZSA9IChzcGFjZUlkOiBzdHJpbmcpID0+IHtcbiAgaWYgKHNwYWNlSWQgPT09IERFRkFVTFRfU1BBQ0VfSUQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHNwYWNlSWQ7XG59O1xuXG5jb25zdCB0aHJvd0Vycm9ySWZOYW1lc3BhY2VTcGVjaWZpZWQgPSAob3B0aW9uczogYW55KSA9PiB7XG4gIGlmIChvcHRpb25zLm5hbWVzcGFjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU3BhY2VzIGN1cnJlbnRseSBkZXRlcm1pbmVzIHRoZSBuYW1lc3BhY2VzJyk7XG4gIH1cbn07XG5cbmNvbnN0IHRocm93RXJyb3JJZlR5cGVJc1NwYWNlID0gKHR5cGU6IHN0cmluZykgPT4ge1xuICBpZiAodHlwZSA9PT0gJ3NwYWNlJykge1xuICAgIHRocm93IG5ldyBFcnJvcignU3BhY2VzIGNhbiBub3QgYmUgYWNjZXNzZWQgdXNpbmcgdGhlIFNhdmVkT2JqZWN0c0NsaWVudCcpO1xuICB9XG59O1xuXG5jb25zdCB0aHJvd0Vycm9ySWZUeXBlc0NvbnRhaW5zU3BhY2UgPSAodHlwZXM6IHN0cmluZ1tdKSA9PiB7XG4gIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgIHRocm93RXJyb3JJZlR5cGVJc1NwYWNlKHR5cGUpO1xuICB9XG59O1xuXG5leHBvcnQgY2xhc3MgU3BhY2VzU2F2ZWRPYmplY3RzQ2xpZW50IGltcGxlbWVudHMgU2F2ZWRPYmplY3RzQ2xpZW50IHtcbiAgcHVibGljIHJlYWRvbmx5IGVycm9yczogYW55O1xuICBwcml2YXRlIHJlYWRvbmx5IGNsaWVudDogU2F2ZWRPYmplY3RzQ2xpZW50O1xuICBwcml2YXRlIHJlYWRvbmx5IHNwYWNlSWQ6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSB0eXBlczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogU3BhY2VzU2F2ZWRPYmplY3RzQ2xpZW50T3B0aW9ucykge1xuICAgIGNvbnN0IHsgYmFzZUNsaWVudCwgcmVxdWVzdCwgc3BhY2VzU2VydmljZSwgdHlwZXMgfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmVycm9ycyA9IGJhc2VDbGllbnQuZXJyb3JzO1xuICAgIHRoaXMuY2xpZW50ID0gYmFzZUNsaWVudDtcbiAgICB0aGlzLnNwYWNlSWQgPSBzcGFjZXNTZXJ2aWNlLmdldFNwYWNlSWQocmVxdWVzdCk7XG4gICAgdGhpcy50eXBlcyA9IHR5cGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcnNpc3RzIGFuIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnM9e31dXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbb3B0aW9ucy5pZF0gLSBmb3JjZSBpZCBvbiBjcmVhdGlvbiwgbm90IHJlY29tbWVuZGVkXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW29wdGlvbnMub3ZlcndyaXRlPWZhbHNlXVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gW29wdGlvbnMubmFtZXNwYWNlXVxuICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gLSB7IGlkLCB0eXBlLCB2ZXJzaW9uLCBhdHRyaWJ1dGVzIH1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjcmVhdGU8VCBleHRlbmRzIFNhdmVkT2JqZWN0QXR0cmlidXRlcz4oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIGF0dHJpYnV0ZXM6IFQgPSB7fSBhcyBULFxuICAgIG9wdGlvbnM6IENyZWF0ZU9wdGlvbnMgPSB7fVxuICApIHtcbiAgICB0aHJvd0Vycm9ySWZUeXBlSXNTcGFjZSh0eXBlKTtcbiAgICB0aHJvd0Vycm9ySWZOYW1lc3BhY2VTcGVjaWZpZWQob3B0aW9ucyk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuY3JlYXRlKHR5cGUsIGF0dHJpYnV0ZXMsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBuYW1lc3BhY2U6IGdldE5hbWVzcGFjZSh0aGlzLnNwYWNlSWQpLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbXVsdGlwbGUgZG9jdW1lbnRzIGF0IG9uY2VcbiAgICpcbiAgICogQHBhcmFtIHthcnJheX0gb2JqZWN0cyAtIFt7IHR5cGUsIGlkLCBhdHRyaWJ1dGVzLCBleHRyYURvY3VtZW50UHJvcGVydGllcyB9XVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnM9e31dXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW29wdGlvbnMub3ZlcndyaXRlPWZhbHNlXSAtIG92ZXJ3cml0ZXMgZXhpc3RpbmcgZG9jdW1lbnRzXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lc3BhY2VdXG4gICAqIEByZXR1cm5zIHtwcm9taXNlfSAtIHsgc2F2ZWRfb2JqZWN0czogW3sgaWQsIHR5cGUsIHZlcnNpb24sIGF0dHJpYnV0ZXMsIGVycm9yOiB7IG1lc3NhZ2UgfSB9XX1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBidWxrQ3JlYXRlKG9iamVjdHM6IEJ1bGtDcmVhdGVPYmplY3RbXSwgb3B0aW9uczogQmFzZU9wdGlvbnMgPSB7fSkge1xuICAgIHRocm93RXJyb3JJZlR5cGVzQ29udGFpbnNTcGFjZShvYmplY3RzLm1hcChvYmplY3QgPT4gb2JqZWN0LnR5cGUpKTtcbiAgICB0aHJvd0Vycm9ySWZOYW1lc3BhY2VTcGVjaWZpZWQob3B0aW9ucyk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuYnVsa0NyZWF0ZShvYmplY3RzLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgbmFtZXNwYWNlOiBnZXROYW1lc3BhY2UodGhpcy5zcGFjZUlkKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zPXt9XVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gW29wdGlvbnMubmFtZXNwYWNlXVxuICAgKiBAcmV0dXJucyB7cHJvbWlzZX1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBkZWxldGUodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zOiBCYXNlT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhyb3dFcnJvcklmVHlwZUlzU3BhY2UodHlwZSk7XG4gICAgdGhyb3dFcnJvcklmTmFtZXNwYWNlU3BlY2lmaWVkKG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50LmRlbGV0ZSh0eXBlLCBpZCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIG5hbWVzcGFjZTogZ2V0TmFtZXNwYWNlKHRoaXMuc3BhY2VJZCksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zPXt9XVxuICAgKiBAcHJvcGVydHkgeyhzdHJpbmd8QXJyYXk8c3RyaW5nPil9IFtvcHRpb25zLnR5cGVdXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbb3B0aW9ucy5zZWFyY2hdXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXk8c3RyaW5nPn0gW29wdGlvbnMuc2VhcmNoRmllbGRzXSAtIHNlZSBFbGFzdGljc2VhcmNoIFNpbXBsZSBRdWVyeSBTdHJpbmdcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUXVlcnkgZmllbGQgYXJndW1lbnQgZm9yIG1vcmUgaW5mb3JtYXRpb25cbiAgICogQHByb3BlcnR5IHtpbnRlZ2VyfSBbb3B0aW9ucy5wYWdlPTFdXG4gICAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gW29wdGlvbnMucGVyUGFnZT0yMF1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IFtvcHRpb25zLnNvcnRGaWVsZF1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IFtvcHRpb25zLnNvcnRPcmRlcl1cbiAgICogQHByb3BlcnR5IHtBcnJheTxzdHJpbmc+fSBbb3B0aW9ucy5maWVsZHNdXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lc3BhY2VdXG4gICAqIEByZXR1cm5zIHtwcm9taXNlfSAtIHsgc2F2ZWRfb2JqZWN0czogW3sgaWQsIHR5cGUsIHZlcnNpb24sIGF0dHJpYnV0ZXMgfV0sIHRvdGFsLCBwZXJfcGFnZSwgcGFnZSB9XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZmluZChvcHRpb25zOiBGaW5kT3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMudHlwZSkge1xuICAgICAgdGhyb3dFcnJvcklmVHlwZXNDb250YWluc1NwYWNlKGNvZXJjZVRvQXJyYXkob3B0aW9ucy50eXBlKSk7XG4gICAgfVxuXG4gICAgdGhyb3dFcnJvcklmTmFtZXNwYWNlU3BlY2lmaWVkKG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50LmZpbmQoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHR5cGU6IChvcHRpb25zLnR5cGUgPyBjb2VyY2VUb0FycmF5KG9wdGlvbnMudHlwZSkgOiB0aGlzLnR5cGVzKS5maWx0ZXIoXG4gICAgICAgIHR5cGUgPT4gdHlwZSAhPT0gJ3NwYWNlJ1xuICAgICAgKSxcbiAgICAgIG5hbWVzcGFjZTogZ2V0TmFtZXNwYWNlKHRoaXMuc3BhY2VJZCksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIGJ5IGlkXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXl9IG9iamVjdHMgLSBhbiBhcnJheSBpZHMsIG9yIGFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmluZyBpZCBhbmQgb3B0aW9uYWxseSB0eXBlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucz17fV1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IFtvcHRpb25zLm5hbWVzcGFjZV1cbiAgICogQHJldHVybnMge3Byb21pc2V9IC0geyBzYXZlZF9vYmplY3RzOiBbeyBpZCwgdHlwZSwgdmVyc2lvbiwgYXR0cmlidXRlcyB9XSB9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGJ1bGtHZXQoW1xuICAgKiAgIHsgaWQ6ICdvbmUnLCB0eXBlOiAnY29uZmlnJyB9LFxuICAgKiAgIHsgaWQ6ICdmb28nLCB0eXBlOiAnaW5kZXgtcGF0dGVybicgfVxuICAgKiBdKVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGJ1bGtHZXQob2JqZWN0czogQnVsa0dldE9iamVjdHMgPSBbXSwgb3B0aW9uczogQmFzZU9wdGlvbnMgPSB7fSkge1xuICAgIHRocm93RXJyb3JJZlR5cGVzQ29udGFpbnNTcGFjZShvYmplY3RzLm1hcChvYmplY3QgPT4gb2JqZWN0LnR5cGUpKTtcbiAgICB0aHJvd0Vycm9ySWZOYW1lc3BhY2VTcGVjaWZpZWQob3B0aW9ucyk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuYnVsa0dldChvYmplY3RzLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgbmFtZXNwYWNlOiBnZXROYW1lc3BhY2UodGhpcy5zcGFjZUlkKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc2luZ2xlIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zPXt9XVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gW29wdGlvbnMubmFtZXNwYWNlXVxuICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gLSB7IGlkLCB0eXBlLCB2ZXJzaW9uLCBhdHRyaWJ1dGVzIH1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBnZXQodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zOiBCYXNlT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhyb3dFcnJvcklmVHlwZUlzU3BhY2UodHlwZSk7XG4gICAgdGhyb3dFcnJvcklmTmFtZXNwYWNlU3BlY2lmaWVkKG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50LmdldCh0eXBlLCBpZCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIG5hbWVzcGFjZTogZ2V0TmFtZXNwYWNlKHRoaXMuc3BhY2VJZCksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbiBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucz17fV1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG9wdGlvbnMudmVyc2lvbiAtIGVuc3VyZXMgdmVyc2lvbiBtYXRjaGVzIHRoYXQgb2YgcGVyc2lzdGVkIG9iamVjdFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gW29wdGlvbnMubmFtZXNwYWNlXVxuICAgKiBAcmV0dXJucyB7cHJvbWlzZX1cbiAgICovXG4gIHB1YmxpYyBhc3luYyB1cGRhdGU8VCBleHRlbmRzIFNhdmVkT2JqZWN0QXR0cmlidXRlcz4oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgYXR0cmlidXRlczogUGFydGlhbDxUPixcbiAgICBvcHRpb25zOiBVcGRhdGVPcHRpb25zID0ge31cbiAgKSB7XG4gICAgdGhyb3dFcnJvcklmVHlwZUlzU3BhY2UodHlwZSk7XG4gICAgdGhyb3dFcnJvcklmTmFtZXNwYWNlU3BlY2lmaWVkKG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50LnVwZGF0ZSh0eXBlLCBpZCwgYXR0cmlidXRlcywge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIG5hbWVzcGFjZTogZ2V0TmFtZXNwYWNlKHRoaXMuc3BhY2VJZCksXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==