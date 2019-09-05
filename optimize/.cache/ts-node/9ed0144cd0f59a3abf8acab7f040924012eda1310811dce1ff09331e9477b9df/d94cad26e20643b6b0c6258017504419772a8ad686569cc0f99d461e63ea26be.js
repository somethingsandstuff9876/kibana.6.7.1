"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/*
 * The logic for ID is: XXYYZZAA, where XX is major version, YY is minor
 * version, ZZ is revision, and AA is alpha/beta/rc indicator.
 *
 * AA values below 25 are for alpha builder (since 5.0), and above 25 and below
 * 50 are beta builds, and below 99 are RC builds, with 99 indicating a release
 * the (internal) format of the id is there so we can easily do after/before
 * checks on the id
 *
 * Note: the conversion method is carried over from Elasticsearch:
 * https://github.com/elastic/elasticsearch/blob/de962b2/server/src/main/java/org/elasticsearch/Version.java
 */
function getTemplateVersion(versionStr) {
    // break up the string parts
    const splitted = versionStr.split('.');
    const minorStr = splitted[2] || '';
    // pad each part with leading 0 to make 2 characters
    const padded = splitted.map((v) => {
        const vMatches = v.match(/\d+/);
        if (vMatches) {
            return lodash_1.padLeft(vMatches[0], 2, '0');
        }
        return '00';
    });
    const [majorV, minorV, patchV] = padded;
    // append the alpha/beta/rc indicator
    let buildV;
    if (minorStr.match('alpha')) {
        const matches = minorStr.match(/alpha(?<alpha>\d+)/);
        if (matches != null && matches.groups != null) {
            const alphaVerInt = parseInt(matches.groups.alpha, 10); // alpha build indicator
            buildV = lodash_1.padLeft(`${alphaVerInt}`, 2, '0');
        }
    }
    else if (minorStr.match('beta')) {
        const matches = minorStr.match(/beta(?<beta>\d+)/);
        if (matches != null && matches.groups != null) {
            const alphaVerInt = parseInt(matches.groups.beta, 10) + 25; // beta build indicator
            buildV = lodash_1.padLeft(`${alphaVerInt}`, 2, '0');
        }
    }
    else {
        buildV = '99'; // release build indicator
    }
    const joinedParts = [majorV, minorV, patchV, buildV].join('');
    return parseInt(joinedParts, 10);
}
exports.getTemplateVersion = getTemplateVersion;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL2xpYi9nZXRfdGVtcGxhdGVfdmVyc2lvbi50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL2xpYi9nZXRfdGVtcGxhdGVfdmVyc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCxtQ0FBaUM7QUFFakM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxVQUFrQjtJQUNuRCw0QkFBNEI7SUFDNUIsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRW5DLG9EQUFvRDtJQUNwRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDeEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxJQUFJLFFBQVEsRUFBRTtZQUNaLE9BQU8sZ0JBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUV4QyxxQ0FBcUM7SUFDckMsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDM0IsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3JELElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUM3QyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBd0I7WUFDaEYsTUFBTSxHQUFHLGdCQUFPLENBQUMsR0FBRyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUM7S0FDRjtTQUFNLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNqQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQzdDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7WUFDbkYsTUFBTSxHQUFHLGdCQUFPLENBQUMsR0FBRyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUM7S0FDRjtTQUFNO1FBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLDBCQUEwQjtLQUMxQztJQUVELE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlELE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBbkNELGdEQW1DQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHBhZExlZnQgfSBmcm9tICdsb2Rhc2gnO1xuXG4vKlxuICogVGhlIGxvZ2ljIGZvciBJRCBpczogWFhZWVpaQUEsIHdoZXJlIFhYIGlzIG1ham9yIHZlcnNpb24sIFlZIGlzIG1pbm9yXG4gKiB2ZXJzaW9uLCBaWiBpcyByZXZpc2lvbiwgYW5kIEFBIGlzIGFscGhhL2JldGEvcmMgaW5kaWNhdG9yLlxuICpcbiAqIEFBIHZhbHVlcyBiZWxvdyAyNSBhcmUgZm9yIGFscGhhIGJ1aWxkZXIgKHNpbmNlIDUuMCksIGFuZCBhYm92ZSAyNSBhbmQgYmVsb3dcbiAqIDUwIGFyZSBiZXRhIGJ1aWxkcywgYW5kIGJlbG93IDk5IGFyZSBSQyBidWlsZHMsIHdpdGggOTkgaW5kaWNhdGluZyBhIHJlbGVhc2VcbiAqIHRoZSAoaW50ZXJuYWwpIGZvcm1hdCBvZiB0aGUgaWQgaXMgdGhlcmUgc28gd2UgY2FuIGVhc2lseSBkbyBhZnRlci9iZWZvcmVcbiAqIGNoZWNrcyBvbiB0aGUgaWRcbiAqXG4gKiBOb3RlOiB0aGUgY29udmVyc2lvbiBtZXRob2QgaXMgY2FycmllZCBvdmVyIGZyb20gRWxhc3RpY3NlYXJjaDpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGFzdGljL2VsYXN0aWNzZWFyY2gvYmxvYi9kZTk2MmIyL3NlcnZlci9zcmMvbWFpbi9qYXZhL29yZy9lbGFzdGljc2VhcmNoL1ZlcnNpb24uamF2YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcGxhdGVWZXJzaW9uKHZlcnNpb25TdHI6IHN0cmluZyk6IG51bWJlciB7XG4gIC8vIGJyZWFrIHVwIHRoZSBzdHJpbmcgcGFydHNcbiAgY29uc3Qgc3BsaXR0ZWQgPSB2ZXJzaW9uU3RyLnNwbGl0KCcuJyk7XG4gIGNvbnN0IG1pbm9yU3RyID0gc3BsaXR0ZWRbMl0gfHwgJyc7XG5cbiAgLy8gcGFkIGVhY2ggcGFydCB3aXRoIGxlYWRpbmcgMCB0byBtYWtlIDIgY2hhcmFjdGVyc1xuICBjb25zdCBwYWRkZWQgPSBzcGxpdHRlZC5tYXAoKHY6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHZNYXRjaGVzID0gdi5tYXRjaCgvXFxkKy8pO1xuICAgIGlmICh2TWF0Y2hlcykge1xuICAgICAgcmV0dXJuIHBhZExlZnQodk1hdGNoZXNbMF0sIDIsICcwJyk7XG4gICAgfVxuICAgIHJldHVybiAnMDAnO1xuICB9KTtcbiAgY29uc3QgW21ham9yViwgbWlub3JWLCBwYXRjaFZdID0gcGFkZGVkO1xuXG4gIC8vIGFwcGVuZCB0aGUgYWxwaGEvYmV0YS9yYyBpbmRpY2F0b3JcbiAgbGV0IGJ1aWxkVjtcbiAgaWYgKG1pbm9yU3RyLm1hdGNoKCdhbHBoYScpKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IG1pbm9yU3RyLm1hdGNoKC9hbHBoYSg/PGFscGhhPlxcZCspLyk7XG4gICAgaWYgKG1hdGNoZXMgIT0gbnVsbCAmJiBtYXRjaGVzLmdyb3VwcyAhPSBudWxsKSB7XG4gICAgICBjb25zdCBhbHBoYVZlckludCA9IHBhcnNlSW50KG1hdGNoZXMuZ3JvdXBzLmFscGhhLCAxMCk7IC8vIGFscGhhIGJ1aWxkIGluZGljYXRvclxuICAgICAgYnVpbGRWID0gcGFkTGVmdChgJHthbHBoYVZlckludH1gLCAyLCAnMCcpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChtaW5vclN0ci5tYXRjaCgnYmV0YScpKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IG1pbm9yU3RyLm1hdGNoKC9iZXRhKD88YmV0YT5cXGQrKS8pO1xuICAgIGlmIChtYXRjaGVzICE9IG51bGwgJiYgbWF0Y2hlcy5ncm91cHMgIT0gbnVsbCkge1xuICAgICAgY29uc3QgYWxwaGFWZXJJbnQgPSBwYXJzZUludChtYXRjaGVzLmdyb3Vwcy5iZXRhLCAxMCkgKyAyNTsgLy8gYmV0YSBidWlsZCBpbmRpY2F0b3JcbiAgICAgIGJ1aWxkViA9IHBhZExlZnQoYCR7YWxwaGFWZXJJbnR9YCwgMiwgJzAnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVpbGRWID0gJzk5JzsgLy8gcmVsZWFzZSBidWlsZCBpbmRpY2F0b3JcbiAgfVxuXG4gIGNvbnN0IGpvaW5lZFBhcnRzID0gW21ham9yViwgbWlub3JWLCBwYXRjaFYsIGJ1aWxkVl0uam9pbignJyk7XG4gIHJldHVybiBwYXJzZUludChqb2luZWRQYXJ0cywgMTApO1xufVxuIl19