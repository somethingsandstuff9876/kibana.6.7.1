"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.fieldsFilterProcessor = (options) => {
    return (doc) => {
        const result = lodash_1.cloneDeep(doc);
        /*
         TODO: Need to add the filter logic to find all the fields the user is requesting
         and then add an exists filter for each. That way we are only looking at documents
         that have the correct fields. This is because we are having to run a partioned
         terms agg at the top level. Normally we wouldn't need to do this because they would
         get filter out natually.
         */
        lodash_1.set(result, 'aggs.waffle.filter.match_all', {});
        return result;
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9wcm9jZXNzb3JzL2NvbW1vbi9maWVsZF9maWx0ZXJfcHJvY2Vzc29yLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL25vZGVzL3Byb2Nlc3NvcnMvY29tbW9uL2ZpZWxkX2ZpbHRlcl9wcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsbUNBQXdDO0FBSTNCLFFBQUEscUJBQXFCLEdBQUcsQ0FBQyxPQUFvQyxFQUFFLEVBQUU7SUFDNUUsT0FBTyxDQUFDLEdBQXNCLEVBQUUsRUFBRTtRQUNoQyxNQUFNLE1BQU0sR0FBRyxrQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCOzs7Ozs7V0FNRztRQUNILFlBQUcsQ0FBQyxNQUFNLEVBQUUsOEJBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgY2xvbmVEZWVwLCBzZXQgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBJbmZyYUVTU2VhcmNoQm9keSwgSW5mcmFQcm9jZXNvclJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBmaWVsZHNGaWx0ZXJQcm9jZXNzb3IgPSAob3B0aW9uczogSW5mcmFQcm9jZXNvclJlcXVlc3RPcHRpb25zKSA9PiB7XG4gIHJldHVybiAoZG9jOiBJbmZyYUVTU2VhcmNoQm9keSkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNsb25lRGVlcChkb2MpO1xuICAgIC8qXG4gICAgIFRPRE86IE5lZWQgdG8gYWRkIHRoZSBmaWx0ZXIgbG9naWMgdG8gZmluZCBhbGwgdGhlIGZpZWxkcyB0aGUgdXNlciBpcyByZXF1ZXN0aW5nXG4gICAgIGFuZCB0aGVuIGFkZCBhbiBleGlzdHMgZmlsdGVyIGZvciBlYWNoLiBUaGF0IHdheSB3ZSBhcmUgb25seSBsb29raW5nIGF0IGRvY3VtZW50c1xuICAgICB0aGF0IGhhdmUgdGhlIGNvcnJlY3QgZmllbGRzLiBUaGlzIGlzIGJlY2F1c2Ugd2UgYXJlIGhhdmluZyB0byBydW4gYSBwYXJ0aW9uZWRcbiAgICAgdGVybXMgYWdnIGF0IHRoZSB0b3AgbGV2ZWwuIE5vcm1hbGx5IHdlIHdvdWxkbid0IG5lZWQgdG8gZG8gdGhpcyBiZWNhdXNlIHRoZXkgd291bGRcbiAgICAgZ2V0IGZpbHRlciBvdXQgbmF0dWFsbHkuXG4gICAgICovXG4gICAgc2V0KHJlc3VsdCwgJ2FnZ3Mud2FmZmxlLmZpbHRlci5tYXRjaF9hbGwnLCB7fSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iXX0=