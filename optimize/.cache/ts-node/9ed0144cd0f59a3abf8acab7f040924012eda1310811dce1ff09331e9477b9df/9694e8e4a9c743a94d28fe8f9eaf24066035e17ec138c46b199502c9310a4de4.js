"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
class InfraElasticsearchSourceStatusAdapter {
    constructor(framework) {
        this.framework = framework;
    }
    async getIndexNames(request, aliasName) {
        const indexMaps = await Promise.all([
            this.framework
                .callWithRequest(request, 'indices.getAlias', {
                name: aliasName,
                filterPath: '*.settings.index.uuid',
            })
                .catch(withDefaultIfNotFound({})),
            this.framework
                .callWithRequest(request, 'indices.get', {
                index: aliasName,
                filterPath: '*.settings.index.uuid',
            })
                .catch(withDefaultIfNotFound({})),
        ]);
        return indexMaps.reduce((indexNames, indexMap) => [...indexNames, ...Object.keys(indexMap)], []);
    }
    async hasAlias(request, aliasName) {
        return await this.framework.callWithRequest(request, 'indices.existsAlias', {
            name: aliasName,
        });
    }
    async hasIndices(request, indexNames) {
        return await this.framework
            .callWithRequest(request, 'search', {
            ignore_unavailable: true,
            allow_no_indices: true,
            index: indexNames,
            size: 0,
            terminate_after: 1,
        })
            .then(response => response._shards.total > 0, err => {
            if (err.status === 404) {
                return false;
            }
            throw err;
        });
    }
}
exports.InfraElasticsearchSourceStatusAdapter = InfraElasticsearchSourceStatusAdapter;
const withDefaultIfNotFound = (defaultValue) => (error) => {
    if (error && error.status === 404) {
        return defaultValue;
    }
    throw error;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9zb3VyY2Vfc3RhdHVzL2VsYXN0aWNzZWFyY2hfc291cmNlX3N0YXR1c19hZGFwdGVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL3NvdXJjZV9zdGF0dXMvZWxhc3RpY3NlYXJjaF9zb3VyY2Vfc3RhdHVzX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBU0gsTUFBYSxxQ0FBcUM7SUFDaEQsWUFBNkIsU0FBdUM7UUFBdkMsY0FBUyxHQUFULFNBQVMsQ0FBOEI7SUFBRyxDQUFDO0lBRWpFLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBOEIsRUFBRSxTQUFpQjtRQUMxRSxNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDbEMsSUFBSSxDQUFDLFNBQVM7aUJBQ1gsZUFBZSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRTtnQkFDNUMsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsVUFBVSxFQUFFLHVCQUF1QjthQUNwQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxxQkFBcUIsQ0FBa0MsRUFBRSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFNBQVM7aUJBQ1gsZUFBZSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZDLEtBQUssRUFBRSxTQUFTO2dCQUNoQixVQUFVLEVBQUUsdUJBQXVCO2FBQ3BDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLHFCQUFxQixDQUFrQyxFQUFFLENBQUMsQ0FBQztTQUNyRSxDQUFDLENBQUM7UUFFSCxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQ3JCLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDbkUsRUFBYyxDQUNmLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUE4QixFQUFFLFNBQWlCO1FBQ3JFLE9BQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUU7WUFDMUUsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBOEIsRUFBRSxVQUFrQjtRQUN4RSxPQUFPLE1BQU0sSUFBSSxDQUFDLFNBQVM7YUFDeEIsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7WUFDbEMsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLElBQUksRUFBRSxDQUFDO1lBQ1AsZUFBZSxFQUFFLENBQUM7U0FDbkIsQ0FBQzthQUNELElBQUksQ0FDSCxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsRUFDdEMsR0FBRyxDQUFDLEVBQUU7WUFDSixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsTUFBTSxHQUFHLENBQUM7UUFDWixDQUFDLENBQ0YsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQWxERCxzRkFrREM7QUFFRCxNQUFNLHFCQUFxQixHQUFHLENBQWUsWUFBMEIsRUFBRSxFQUFFLENBQUMsQ0FDMUUsS0FBVSxFQUNJLEVBQUU7SUFDaEIsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7UUFDakMsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFDRCxNQUFNLEtBQUssQ0FBQztBQUNkLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhU291cmNlU3RhdHVzQWRhcHRlciB9IGZyb20gJy4uLy4uL3NvdXJjZV9zdGF0dXMnO1xuaW1wb3J0IHtcbiAgSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcixcbiAgSW5mcmFEYXRhYmFzZUdldEluZGljZXNSZXNwb25zZSxcbiAgSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxufSBmcm9tICcuLi9mcmFtZXdvcmsnO1xuXG5leHBvcnQgY2xhc3MgSW5mcmFFbGFzdGljc2VhcmNoU291cmNlU3RhdHVzQWRhcHRlciBpbXBsZW1lbnRzIEluZnJhU291cmNlU3RhdHVzQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZnJhbWV3b3JrOiBJbmZyYUJhY2tlbmRGcmFtZXdvcmtBZGFwdGVyKSB7fVxuXG4gIHB1YmxpYyBhc3luYyBnZXRJbmRleE5hbWVzKHJlcXVlc3Q6IEluZnJhRnJhbWV3b3JrUmVxdWVzdCwgYWxpYXNOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbmRleE1hcHMgPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmZyYW1ld29ya1xuICAgICAgICAuY2FsbFdpdGhSZXF1ZXN0KHJlcXVlc3QsICdpbmRpY2VzLmdldEFsaWFzJywge1xuICAgICAgICAgIG5hbWU6IGFsaWFzTmFtZSxcbiAgICAgICAgICBmaWx0ZXJQYXRoOiAnKi5zZXR0aW5ncy5pbmRleC51dWlkJywgLy8gdG8ga2VlcCB0aGUgcmVzcG9uc2Ugc2l6ZSBhcyBzbWFsbCBhcyBwb3NzaWJsZVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2god2l0aERlZmF1bHRJZk5vdEZvdW5kPEluZnJhRGF0YWJhc2VHZXRJbmRpY2VzUmVzcG9uc2U+KHt9KSksXG4gICAgICB0aGlzLmZyYW1ld29ya1xuICAgICAgICAuY2FsbFdpdGhSZXF1ZXN0KHJlcXVlc3QsICdpbmRpY2VzLmdldCcsIHtcbiAgICAgICAgICBpbmRleDogYWxpYXNOYW1lLFxuICAgICAgICAgIGZpbHRlclBhdGg6ICcqLnNldHRpbmdzLmluZGV4LnV1aWQnLCAvLyB0byBrZWVwIHRoZSByZXNwb25zZSBzaXplIGFzIHNtYWxsIGFzIHBvc3NpYmxlXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCh3aXRoRGVmYXVsdElmTm90Rm91bmQ8SW5mcmFEYXRhYmFzZUdldEluZGljZXNSZXNwb25zZT4oe30pKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBpbmRleE1hcHMucmVkdWNlKFxuICAgICAgKGluZGV4TmFtZXMsIGluZGV4TWFwKSA9PiBbLi4uaW5kZXhOYW1lcywgLi4uT2JqZWN0LmtleXMoaW5kZXhNYXApXSxcbiAgICAgIFtdIGFzIHN0cmluZ1tdXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBoYXNBbGlhcyhyZXF1ZXN0OiBJbmZyYUZyYW1ld29ya1JlcXVlc3QsIGFsaWFzTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZnJhbWV3b3JrLmNhbGxXaXRoUmVxdWVzdChyZXF1ZXN0LCAnaW5kaWNlcy5leGlzdHNBbGlhcycsIHtcbiAgICAgIG5hbWU6IGFsaWFzTmFtZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBoYXNJbmRpY2VzKHJlcXVlc3Q6IEluZnJhRnJhbWV3b3JrUmVxdWVzdCwgaW5kZXhOYW1lczogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZnJhbWV3b3JrXG4gICAgICAuY2FsbFdpdGhSZXF1ZXN0KHJlcXVlc3QsICdzZWFyY2gnLCB7XG4gICAgICAgIGlnbm9yZV91bmF2YWlsYWJsZTogdHJ1ZSxcbiAgICAgICAgYWxsb3dfbm9faW5kaWNlczogdHJ1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4TmFtZXMsXG4gICAgICAgIHNpemU6IDAsXG4gICAgICAgIHRlcm1pbmF0ZV9hZnRlcjogMSxcbiAgICAgIH0pXG4gICAgICAudGhlbihcbiAgICAgICAgcmVzcG9uc2UgPT4gcmVzcG9uc2UuX3NoYXJkcy50b3RhbCA+IDAsXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cbn1cblxuY29uc3Qgd2l0aERlZmF1bHRJZk5vdEZvdW5kID0gPERlZmF1bHRWYWx1ZT4oZGVmYXVsdFZhbHVlOiBEZWZhdWx0VmFsdWUpID0+IChcbiAgZXJyb3I6IGFueVxuKTogRGVmYXVsdFZhbHVlID0+IHtcbiAgaWYgKGVycm9yICYmIGVycm9yLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuICB0aHJvdyBlcnJvcjtcbn07XG4iXX0=