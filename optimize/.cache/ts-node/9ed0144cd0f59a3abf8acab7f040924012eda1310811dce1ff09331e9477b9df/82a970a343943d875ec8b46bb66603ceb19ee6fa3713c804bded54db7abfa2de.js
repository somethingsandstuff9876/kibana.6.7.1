"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const types_1 = require("../../../graphql/types");
const adapter_types_1 = require("./adapter_types");
const getNodeType = (type) => {
    switch (type) {
        case types_1.InfraPathType.pods:
            return adapter_types_1.InfraNodeType.pod;
        case types_1.InfraPathType.containers:
            return adapter_types_1.InfraNodeType.container;
        case types_1.InfraPathType.hosts:
            return adapter_types_1.InfraNodeType.host;
        default:
            throw new Error('Invalid InfraPathType');
    }
};
const isEntityType = (path) => {
    if (!path) {
        return false;
    }
    switch (path.type) {
        case types_1.InfraPathType.containers:
        case types_1.InfraPathType.hosts:
        case types_1.InfraPathType.pods:
            return true;
        default:
            return false;
    }
};
const moreThenOneEntityType = (path) => {
    return path.filter(isEntityType).length > 1;
};
function extractGroupByAndNodeFromPath(path) {
    if (moreThenOneEntityType(path)) {
        throw new Error('There can be only one entity type in the path.');
    }
    if (path.length > 3) {
        throw new Error('The path can only have a maximum of 3 elements.');
    }
    const nodePart = path[path.length - 1];
    if (!isEntityType(nodePart)) {
        throw new Error('The last element in the path should be either a "hosts", "containers" or "pods" path type.');
    }
    const nodeType = getNodeType(nodePart.type);
    const groupBy = path.slice(0, path.length - 1);
    return { groupBy, nodeType };
}
exports.extractGroupByAndNodeFromPath = extractGroupByAndNodeFromPath;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9leHRyYWN0X2dyb3VwX2J5X2FuZF9ub2RlX2Zyb21fcGF0aC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9leHRyYWN0X2dyb3VwX2J5X2FuZF9ub2RlX2Zyb21fcGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0dBSUc7QUFDSCxrREFBdUU7QUFDdkUsbURBQWdEO0FBRWhELE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBbUIsRUFBaUIsRUFBRTtJQUN6RCxRQUFRLElBQUksRUFBRTtRQUNaLEtBQUsscUJBQWEsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLENBQUM7UUFDM0IsS0FBSyxxQkFBYSxDQUFDLFVBQVU7WUFDM0IsT0FBTyw2QkFBYSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxLQUFLLHFCQUFhLENBQUMsS0FBSztZQUN0QixPQUFPLDZCQUFhLENBQUMsSUFBSSxDQUFDO1FBQzVCO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFvQixFQUFFLEVBQUU7SUFDNUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDakIsS0FBSyxxQkFBYSxDQUFDLFVBQVUsQ0FBQztRQUM5QixLQUFLLHFCQUFhLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEtBQUsscUJBQWEsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1FBQ2Q7WUFDRSxPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxJQUFzQixFQUFFLEVBQUU7SUFDdkQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDOUMsQ0FBQyxDQUFDO0FBRUYsU0FBZ0IsNkJBQTZCLENBQUMsSUFBc0I7SUFDbEUsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7S0FDbkU7SUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztLQUNwRTtJQUNELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FDYiw0RkFBNEYsQ0FDN0YsQ0FBQztLQUNIO0lBQ0QsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDL0IsQ0FBQztBQWhCRCxzRUFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgSW5mcmFQYXRoSW5wdXQsIEluZnJhUGF0aFR5cGUgfSBmcm9tICcuLi8uLi8uLi9ncmFwaHFsL3R5cGVzJztcbmltcG9ydCB7IEluZnJhTm9kZVR5cGUgfSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuXG5jb25zdCBnZXROb2RlVHlwZSA9ICh0eXBlOiBJbmZyYVBhdGhUeXBlKTogSW5mcmFOb2RlVHlwZSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgSW5mcmFQYXRoVHlwZS5wb2RzOlxuICAgICAgcmV0dXJuIEluZnJhTm9kZVR5cGUucG9kO1xuICAgIGNhc2UgSW5mcmFQYXRoVHlwZS5jb250YWluZXJzOlxuICAgICAgcmV0dXJuIEluZnJhTm9kZVR5cGUuY29udGFpbmVyO1xuICAgIGNhc2UgSW5mcmFQYXRoVHlwZS5ob3N0czpcbiAgICAgIHJldHVybiBJbmZyYU5vZGVUeXBlLmhvc3Q7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJbmZyYVBhdGhUeXBlJyk7XG4gIH1cbn07XG5cbmNvbnN0IGlzRW50aXR5VHlwZSA9IChwYXRoOiBJbmZyYVBhdGhJbnB1dCkgPT4ge1xuICBpZiAoIXBhdGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3dpdGNoIChwYXRoLnR5cGUpIHtcbiAgICBjYXNlIEluZnJhUGF0aFR5cGUuY29udGFpbmVyczpcbiAgICBjYXNlIEluZnJhUGF0aFR5cGUuaG9zdHM6XG4gICAgY2FzZSBJbmZyYVBhdGhUeXBlLnBvZHM6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5jb25zdCBtb3JlVGhlbk9uZUVudGl0eVR5cGUgPSAocGF0aDogSW5mcmFQYXRoSW5wdXRbXSkgPT4ge1xuICByZXR1cm4gcGF0aC5maWx0ZXIoaXNFbnRpdHlUeXBlKS5sZW5ndGggPiAxO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RHcm91cEJ5QW5kTm9kZUZyb21QYXRoKHBhdGg6IEluZnJhUGF0aElucHV0W10pIHtcbiAgaWYgKG1vcmVUaGVuT25lRW50aXR5VHlwZShwYXRoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgY2FuIGJlIG9ubHkgb25lIGVudGl0eSB0eXBlIGluIHRoZSBwYXRoLicpO1xuICB9XG4gIGlmIChwYXRoLmxlbmd0aCA+IDMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXRoIGNhbiBvbmx5IGhhdmUgYSBtYXhpbXVtIG9mIDMgZWxlbWVudHMuJyk7XG4gIH1cbiAgY29uc3Qgbm9kZVBhcnQgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG4gIGlmICghaXNFbnRpdHlUeXBlKG5vZGVQYXJ0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBwYXRoIHNob3VsZCBiZSBlaXRoZXIgYSBcImhvc3RzXCIsIFwiY29udGFpbmVyc1wiIG9yIFwicG9kc1wiIHBhdGggdHlwZS4nXG4gICAgKTtcbiAgfVxuICBjb25zdCBub2RlVHlwZSA9IGdldE5vZGVUeXBlKG5vZGVQYXJ0LnR5cGUpO1xuICBjb25zdCBncm91cEJ5ID0gcGF0aC5zbGljZSgwLCBwYXRoLmxlbmd0aCAtIDEpO1xuICByZXR1cm4geyBncm91cEJ5LCBub2RlVHlwZSB9O1xufVxuIl19