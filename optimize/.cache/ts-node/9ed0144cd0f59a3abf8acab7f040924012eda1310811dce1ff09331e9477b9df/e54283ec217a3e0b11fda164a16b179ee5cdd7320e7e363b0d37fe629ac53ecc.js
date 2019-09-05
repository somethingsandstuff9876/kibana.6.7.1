"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.getFilteredQuery = (dateRangeStart, dateRangeEnd, filters) => {
    let filtersObj;
    // TODO: handle bad JSON gracefully
    if (typeof filters === 'string') {
        filtersObj = JSON.parse(filters);
    }
    else {
        filtersObj = filters;
    }
    if (lodash_1.get(filtersObj, 'bool.must', undefined)) {
        const userFilters = lodash_1.get(filtersObj, 'bool.must', []);
        delete filtersObj.bool.must;
        filtersObj.bool.filter = [...userFilters];
    }
    const query = { ...filtersObj };
    const rangeSection = {
        range: {
            '@timestamp': {
                gte: dateRangeStart,
                lte: dateRangeEnd,
            },
        },
    };
    if (lodash_1.get(query, 'bool.filter', undefined)) {
        query.bool.filter.push(rangeSection);
    }
    else {
        lodash_1.set(query, 'bool.filter', [rangeSection]);
    }
    return query;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvaGVscGVyL2dldF9maWx0ZXJlZF9xdWVyeS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvaGVscGVyL2dldF9maWx0ZXJlZF9xdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCxtQ0FBa0M7QUFFckIsUUFBQSxnQkFBZ0IsR0FBRyxDQUM5QixjQUFzQixFQUN0QixZQUFvQixFQUNwQixPQUE2QixFQUM3QixFQUFFO0lBQ0YsSUFBSSxVQUFVLENBQUM7SUFDZixtQ0FBbUM7SUFDbkMsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbEM7U0FBTTtRQUNMLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDdEI7SUFDRCxJQUFJLFlBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQzNDLE1BQU0sV0FBVyxHQUFHLFlBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLFVBQVUsRUFBRSxDQUFDO0lBQ2hDLE1BQU0sWUFBWSxHQUFHO1FBQ25CLEtBQUssRUFBRTtZQUNMLFlBQVksRUFBRTtnQkFDWixHQUFHLEVBQUUsY0FBYztnQkFDbkIsR0FBRyxFQUFFLFlBQVk7YUFDbEI7U0FDRjtLQUNGLENBQUM7SUFDRixJQUFJLFlBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN0QztTQUFNO1FBQ0wsWUFBRyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBnZXQsIHNldCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBjb25zdCBnZXRGaWx0ZXJlZFF1ZXJ5ID0gKFxuICBkYXRlUmFuZ2VTdGFydDogc3RyaW5nLFxuICBkYXRlUmFuZ2VFbmQ6IHN0cmluZyxcbiAgZmlsdGVycz86IHN0cmluZyB8IG51bGwgfCBhbnlcbikgPT4ge1xuICBsZXQgZmlsdGVyc09iajtcbiAgLy8gVE9ETzogaGFuZGxlIGJhZCBKU09OIGdyYWNlZnVsbHlcbiAgaWYgKHR5cGVvZiBmaWx0ZXJzID09PSAnc3RyaW5nJykge1xuICAgIGZpbHRlcnNPYmogPSBKU09OLnBhcnNlKGZpbHRlcnMpO1xuICB9IGVsc2Uge1xuICAgIGZpbHRlcnNPYmogPSBmaWx0ZXJzO1xuICB9XG4gIGlmIChnZXQoZmlsdGVyc09iaiwgJ2Jvb2wubXVzdCcsIHVuZGVmaW5lZCkpIHtcbiAgICBjb25zdCB1c2VyRmlsdGVycyA9IGdldChmaWx0ZXJzT2JqLCAnYm9vbC5tdXN0JywgW10pO1xuICAgIGRlbGV0ZSBmaWx0ZXJzT2JqLmJvb2wubXVzdDtcbiAgICBmaWx0ZXJzT2JqLmJvb2wuZmlsdGVyID0gWy4uLnVzZXJGaWx0ZXJzXTtcbiAgfVxuICBjb25zdCBxdWVyeSA9IHsgLi4uZmlsdGVyc09iaiB9O1xuICBjb25zdCByYW5nZVNlY3Rpb24gPSB7XG4gICAgcmFuZ2U6IHtcbiAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICBndGU6IGRhdGVSYW5nZVN0YXJ0LFxuICAgICAgICBsdGU6IGRhdGVSYW5nZUVuZCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbiAgaWYgKGdldChxdWVyeSwgJ2Jvb2wuZmlsdGVyJywgdW5kZWZpbmVkKSkge1xuICAgIHF1ZXJ5LmJvb2wuZmlsdGVyLnB1c2gocmFuZ2VTZWN0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBzZXQocXVlcnksICdib29sLmZpbHRlcicsIFtyYW5nZVNlY3Rpb25dKTtcbiAgfVxuICByZXR1cm4gcXVlcnk7XG59O1xuIl19