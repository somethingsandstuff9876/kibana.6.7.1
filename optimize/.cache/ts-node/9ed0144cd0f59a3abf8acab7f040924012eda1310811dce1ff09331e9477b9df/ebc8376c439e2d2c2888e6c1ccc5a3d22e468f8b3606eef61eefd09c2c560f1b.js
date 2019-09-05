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
 * This file contains the logic for transforming saved objects to / from
 * the raw document format as stored in ElasticSearch.
 */
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const version_1 = require("../version");
/**
 * The root document type. In 7.0, this needs to change to '_doc'.
 */
exports.ROOT_TYPE = 'doc';
function assertNonEmptyString(value, name) {
    if (!value || typeof value !== 'string') {
        throw new TypeError(`Expected "${value}" to be a ${name}`);
    }
}
class SavedObjectsSerializer {
    constructor(schema) {
        this.schema = schema;
    }
    /**
     * Determines whether or not the raw document can be converted to a saved object.
     *
     * @param {RawDoc} rawDoc - The raw ES document to be tested
     */
    isRawSavedObject(rawDoc) {
        const { type, namespace } = rawDoc._source;
        const namespacePrefix = namespace && !this.schema.isNamespaceAgnostic(type) ? `${namespace}:` : '';
        return (type &&
            rawDoc._id.startsWith(`${namespacePrefix}${type}:`) &&
            rawDoc._source.hasOwnProperty(type));
    }
    /**
     * Converts a document from the format that is stored in elasticsearch to the saved object client format.
     *
     *  @param {RawDoc} rawDoc - The raw ES document to be converted to saved object format.
     */
    rawToSavedObject({ _id, _source, _seq_no, _primary_term }) {
        const { type, namespace } = _source;
        const version = _seq_no != null || _primary_term != null
            ? version_1.encodeVersion(_seq_no, _primary_term)
            : undefined;
        return {
            type,
            id: this.trimIdPrefix(namespace, type, _id),
            ...(namespace && !this.schema.isNamespaceAgnostic(type) && { namespace }),
            attributes: _source[type],
            ...(_source.migrationVersion && { migrationVersion: _source.migrationVersion }),
            ...(_source.updated_at && { updated_at: _source.updated_at }),
            ...(version && { version }),
        };
    }
    /**
     * Converts a document from the saved object client format to the format that is stored in elasticsearch.
     *
     * @param {SavedObjectDoc} savedObj - The saved object to be converted to raw ES format.
     */
    savedObjectToRaw(savedObj) {
        const { id, type, namespace, attributes, migrationVersion, updated_at, version } = savedObj;
        const source = {
            [type]: attributes,
            type,
            ...(namespace && !this.schema.isNamespaceAgnostic(type) && { namespace }),
            ...(migrationVersion && { migrationVersion }),
            ...(updated_at && { updated_at }),
        };
        return {
            _id: this.generateRawId(namespace, type, id),
            _source: source,
            _type: exports.ROOT_TYPE,
            ...(version != null && version_1.decodeVersion(version)),
        };
    }
    /**
     * Given a saved object type and id, generates the compound id that is stored in the raw document.
     *
     * @param {string} namespace - The namespace of the saved object
     * @param {string} type - The saved object type
     * @param {string} id - The id of the saved object
     */
    generateRawId(namespace, type, id) {
        const namespacePrefix = namespace && !this.schema.isNamespaceAgnostic(type) ? `${namespace}:` : '';
        return `${namespacePrefix}${type}:${id || uuid_1.default.v1()}`;
    }
    trimIdPrefix(namespace, type, id) {
        assertNonEmptyString(id, 'document id');
        assertNonEmptyString(type, 'saved object type');
        const namespacePrefix = namespace && !this.schema.isNamespaceAgnostic(type) ? `${namespace}:` : '';
        const prefix = `${namespacePrefix}${type}:`;
        if (!id.startsWith(prefix)) {
            return id;
        }
        return id.slice(prefix.length);
    }
}
exports.SavedObjectsSerializer = SavedObjectsSerializer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL3NlcmlhbGl6YXRpb24vaW5kZXgudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9zZXJ2ZXIvc2F2ZWRfb2JqZWN0cy9zZXJpYWxpemF0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7OztBQUVIOzs7R0FHRztBQUVILHdEQUF3QjtBQUV4Qix3Q0FBMEQ7QUFFMUQ7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBRyxLQUFLLENBQUM7QUF1Qy9CLFNBQVMsb0JBQW9CLENBQUMsS0FBYSxFQUFFLElBQVk7SUFDdkQsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdkMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzVEO0FBQ0gsQ0FBQztBQUVELE1BQWEsc0JBQXNCO0lBR2pDLFlBQVksTUFBMEI7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxnQkFBZ0IsQ0FBQyxNQUFjO1FBQ3BDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMzQyxNQUFNLGVBQWUsR0FDbkIsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzdFLE9BQU8sQ0FDTCxJQUFJO1lBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQUM7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U0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzdFLE1BQU0sTUFBTSxHQUFHLEdBQUcsZUFBZSxHQUFHLElBQUksR0FBRyxDQUFDO1FBRTVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQWhHRCx3REFnR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypcbiAqIFRoaXMgZmlsZSBjb250YWlucyB0aGUgbG9naWMgZm9yIHRyYW5zZm9ybWluZyBzYXZlZCBvYmplY3RzIHRvIC8gZnJvbVxuICogdGhlIHJhdyBkb2N1bWVudCBmb3JtYXQgYXMgc3RvcmVkIGluIEVsYXN0aWNTZWFyY2guXG4gKi9cblxuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBTYXZlZE9iamVjdHNTY2hlbWEgfSBmcm9tICcuLi9zY2hlbWEnO1xuaW1wb3J0IHsgZGVjb2RlVmVyc2lvbiwgZW5jb2RlVmVyc2lvbiB9IGZyb20gJy4uL3ZlcnNpb24nO1xuXG4vKipcbiAqIFRoZSByb290IGRvY3VtZW50IHR5cGUuIEluIDcuMCwgdGhpcyBuZWVkcyB0byBjaGFuZ2UgdG8gJ19kb2MnLlxuICovXG5leHBvcnQgY29uc3QgUk9PVF9UWVBFID0gJ2RvYyc7XG5cbi8qKlxuICogQSByYXcgZG9jdW1lbnQgYXMgcmVwcmVzZW50ZWQgZGlyZWN0bHkgaW4gdGhlIHNhdmVkIG9iamVjdCBpbmRleC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSYXdEb2Mge1xuICBfaWQ6IHN0cmluZztcbiAgX3NvdXJjZTogYW55O1xuICBfdHlwZT86IHN0cmluZztcbiAgX3NlcV9ubz86IG51bWJlcjtcbiAgX3ByaW1hcnlfdGVybT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIGRpY3Rpb25hcnkgb2Ygc2F2ZWQgb2JqZWN0IHR5cGUgLT4gdmVyc2lvbiB1c2VkIHRvIGRldGVybWluZVxuICogd2hhdCBtaWdyYXRpb25zIG5lZWQgdG8gYmUgYXBwbGllZCB0byBhIHNhdmVkIG9iamVjdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNaWdyYXRpb25WZXJzaW9uIHtcbiAgW3R5cGU6IHN0cmluZ106IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHNhdmVkIG9iamVjdCB0eXBlIGRlZmluaXRpb24gdGhhdCBhbGxvd3MgZm9yIG1pc2NlbGxhbmVvdXMsIHVua25vd25cbiAqIHByb3BlcnRpZXMsIGFzIGN1cnJlbnQgZGlzY3Vzc2lvbnMgYXJvdW5kIHNlY3VyaXR5LCBBQ0xzLCBldGMgaW5kaWNhdGVcbiAqIHRoYXQgZnV0dXJlIHByb3BzIGFyZSBsaWtlbHkgdG8gYmUgYWRkZWQuIE1pZ3JhdGlvbnMgc3VwcG9ydCB0aGlzXG4gKiBzY2VuYXJpbyBvdXQgb2YgdGhlIGJveC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTYXZlZE9iamVjdERvYyB7XG4gIGF0dHJpYnV0ZXM6IG9iamVjdDtcbiAgaWQ6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lc3BhY2U/OiBzdHJpbmc7XG4gIG1pZ3JhdGlvblZlcnNpb24/OiBNaWdyYXRpb25WZXJzaW9uO1xuICB2ZXJzaW9uPzogc3RyaW5nO1xuICB1cGRhdGVkX2F0PzogRGF0ZTtcblxuICBbcm9vdFByb3A6IHN0cmluZ106IGFueTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0Tm9uRW1wdHlTdHJpbmcodmFsdWU6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIFwiJHt2YWx1ZX1cIiB0byBiZSBhICR7bmFtZX1gKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZWRPYmplY3RzU2VyaWFsaXplciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NoZW1hOiBTYXZlZE9iamVjdHNTY2hlbWE7XG5cbiAgY29uc3RydWN0b3Ioc2NoZW1hOiBTYXZlZE9iamVjdHNTY2hlbWEpIHtcbiAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYTtcbiAgfVxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgcmF3IGRvY3VtZW50IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSBzYXZlZCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7UmF3RG9jfSByYXdEb2MgLSBUaGUgcmF3IEVTIGRvY3VtZW50IHRvIGJlIHRlc3RlZFxuICAgKi9cbiAgcHVibGljIGlzUmF3U2F2ZWRPYmplY3QocmF3RG9jOiBSYXdEb2MpIHtcbiAgICBjb25zdCB7IHR5cGUsIG5hbWVzcGFjZSB9ID0gcmF3RG9jLl9zb3VyY2U7XG4gICAgY29uc3QgbmFtZXNwYWNlUHJlZml4ID1cbiAgICAgIG5hbWVzcGFjZSAmJiAhdGhpcy5zY2hlbWEuaXNOYW1lc3BhY2VBZ25vc3RpYyh0eXBlKSA/IGAke25hbWVzcGFjZX06YCA6ICcnO1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlICYmXG4gICAgICByYXdEb2MuX2lkLnN0YXJ0c1dpdGgoYCR7bmFtZXNwYWNlUHJlZml4fSR7dHlwZX06YCkgJiZcbiAgICAgIHJhd0RvYy5fc291cmNlLmhhc093blByb3BlcnR5KHR5cGUpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIGRvY3VtZW50IGZyb20gdGhlIGZvcm1hdCB0aGF0IGlzIHN0b3JlZCBpbiBlbGFzdGljc2VhcmNoIHRvIHRoZSBzYXZlZCBvYmplY3QgY2xpZW50IGZvcm1hdC5cbiAgICpcbiAgICogIEBwYXJhbSB7UmF3RG9jfSByYXdEb2MgLSBUaGUgcmF3IEVTIGRvY3VtZW50IHRvIGJlIGNvbnZlcnRlZCB0byBzYXZlZCBvYmplY3QgZm9ybWF0LlxuICAgKi9cbiAgcHVibGljIHJhd1RvU2F2ZWRPYmplY3QoeyBfaWQsIF9zb3VyY2UsIF9zZXFfbm8sIF9wcmltYXJ5X3Rlcm0gfTogUmF3RG9jKTogU2F2ZWRPYmplY3REb2Mge1xuICAgIGNvbnN0IHsgdHlwZSwgbmFtZXNwYWNlIH0gPSBfc291cmNlO1xuXG4gICAgY29uc3QgdmVyc2lvbiA9XG4gICAgICBfc2VxX25vICE9IG51bGwgfHwgX3ByaW1hcnlfdGVybSAhPSBudWxsXG4gICAgICAgID8gZW5jb2RlVmVyc2lvbihfc2VxX25vISwgX3ByaW1hcnlfdGVybSEpXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGUsXG4gICAgICBpZDogdGhpcy50cmltSWRQcmVmaXgobmFtZXNwYWNlLCB0eXBlLCBfaWQpLFxuICAgICAgLi4uKG5hbWVzcGFjZSAmJiAhdGhpcy5zY2hlbWEuaXNOYW1lc3BhY2VBZ25vc3RpYyh0eXBlKSAmJiB7IG5hbWVzcGFjZSB9KSxcbiAgICAgIGF0dHJpYnV0ZXM6IF9zb3VyY2VbdHlwZV0sXG4gICAgICAuLi4oX3NvdXJjZS5taWdyYXRpb25WZXJzaW9uICYmIHsgbWlncmF0aW9uVmVyc2lvbjogX3NvdXJjZS5taWdyYXRpb25WZXJzaW9uIH0pLFxuICAgICAgLi4uKF9zb3VyY2UudXBkYXRlZF9hdCAmJiB7IHVwZGF0ZWRfYXQ6IF9zb3VyY2UudXBkYXRlZF9hdCB9KSxcbiAgICAgIC4uLih2ZXJzaW9uICYmIHsgdmVyc2lvbiB9KSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgZG9jdW1lbnQgZnJvbSB0aGUgc2F2ZWQgb2JqZWN0IGNsaWVudCBmb3JtYXQgdG8gdGhlIGZvcm1hdCB0aGF0IGlzIHN0b3JlZCBpbiBlbGFzdGljc2VhcmNoLlxuICAgKlxuICAgKiBAcGFyYW0ge1NhdmVkT2JqZWN0RG9jfSBzYXZlZE9iaiAtIFRoZSBzYXZlZCBvYmplY3QgdG8gYmUgY29udmVydGVkIHRvIHJhdyBFUyBmb3JtYXQuXG4gICAqL1xuICBwdWJsaWMgc2F2ZWRPYmplY3RUb1JhdyhzYXZlZE9iajogU2F2ZWRPYmplY3REb2MpOiBSYXdEb2Mge1xuICAgIGNvbnN0IHsgaWQsIHR5cGUsIG5hbWVzcGFjZSwgYXR0cmlidXRlcywgbWlncmF0aW9uVmVyc2lvbiwgdXBkYXRlZF9hdCwgdmVyc2lvbiB9ID0gc2F2ZWRPYmo7XG4gICAgY29uc3Qgc291cmNlID0ge1xuICAgICAgW3R5cGVdOiBhdHRyaWJ1dGVzLFxuICAgICAgdHlwZSxcbiAgICAgIC4uLihuYW1lc3BhY2UgJiYgIXRoaXMuc2NoZW1hLmlzTmFtZXNwYWNlQWdub3N0aWModHlwZSkgJiYgeyBuYW1lc3BhY2UgfSksXG4gICAgICAuLi4obWlncmF0aW9uVmVyc2lvbiAmJiB7IG1pZ3JhdGlvblZlcnNpb24gfSksXG4gICAgICAuLi4odXBkYXRlZF9hdCAmJiB7IHVwZGF0ZWRfYXQgfSksXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBfaWQ6IHRoaXMuZ2VuZXJhdGVSYXdJZChuYW1lc3BhY2UsIHR5cGUsIGlkKSxcbiAgICAgIF9zb3VyY2U6IHNvdXJjZSxcbiAgICAgIF90eXBlOiBST09UX1RZUEUsXG4gICAgICAuLi4odmVyc2lvbiAhPSBudWxsICYmIGRlY29kZVZlcnNpb24odmVyc2lvbikpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYSBzYXZlZCBvYmplY3QgdHlwZSBhbmQgaWQsIGdlbmVyYXRlcyB0aGUgY29tcG91bmQgaWQgdGhhdCBpcyBzdG9yZWQgaW4gdGhlIHJhdyBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVzcGFjZSAtIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIHNhdmVkIG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSBzYXZlZCBvYmplY3QgdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNhdmVkIG9iamVjdFxuICAgKi9cbiAgcHVibGljIGdlbmVyYXRlUmF3SWQobmFtZXNwYWNlOiBzdHJpbmcgfCB1bmRlZmluZWQsIHR5cGU6IHN0cmluZywgaWQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VQcmVmaXggPVxuICAgICAgbmFtZXNwYWNlICYmICF0aGlzLnNjaGVtYS5pc05hbWVzcGFjZUFnbm9zdGljKHR5cGUpID8gYCR7bmFtZXNwYWNlfTpgIDogJyc7XG4gICAgcmV0dXJuIGAke25hbWVzcGFjZVByZWZpeH0ke3R5cGV9OiR7aWQgfHwgdXVpZC52MSgpfWA7XG4gIH1cblxuICBwcml2YXRlIHRyaW1JZFByZWZpeChuYW1lc3BhY2U6IHN0cmluZyB8IHVuZGVmaW5lZCwgdHlwZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgYXNzZXJ0Tm9uRW1wdHlTdHJpbmcoaWQsICdkb2N1bWVudCBpZCcpO1xuICAgIGFzc2VydE5vbkVtcHR5U3RyaW5nKHR5cGUsICdzYXZlZCBvYmplY3QgdHlwZScpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlUHJlZml4ID1cbiAgICAgIG5hbWVzcGFjZSAmJiAhdGhpcy5zY2hlbWEuaXNOYW1lc3BhY2VBZ25vc3RpYyh0eXBlKSA/IGAke25hbWVzcGFjZX06YCA6ICcnO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke25hbWVzcGFjZVByZWZpeH0ke3R5cGV9OmA7XG5cbiAgICBpZiAoIWlkLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIHJldHVybiBpZC5zbGljZShwcmVmaXgubGVuZ3RoKTtcbiAgfVxufVxuIl19