"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
exports.parseFilterQuery = (filterQuery) => {
    try {
        if (filterQuery) {
            const parsedFilterQuery = JSON.parse(filterQuery);
            if (!parsedFilterQuery ||
                ['string', 'number', 'boolean'].includes(typeof parsedFilterQuery) ||
                Array.isArray(parsedFilterQuery)) {
                throw new Error('expected value to be an object');
            }
            return parsedFilterQuery;
        }
        else {
            return undefined;
        }
    }
    catch (err) {
        throw new apollo_server_errors_1.UserInputError(`Failed to parse query: ${err}`, {
            query: filterQuery,
            originalError: err,
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL3V0aWxzL3NlcmlhbGl6ZWRfcXVlcnkudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci91dGlscy9zZXJpYWxpemVkX3F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILCtEQUFzRDtBQUl6QyxRQUFBLGdCQUFnQixHQUFHLENBQzlCLFdBQXNDLEVBQ2QsRUFBRTtJQUMxQixJQUFJO1FBQ0YsSUFBSSxXQUFXLEVBQUU7WUFDZixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEQsSUFDRSxDQUFDLGlCQUFpQjtnQkFDbEIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLGlCQUFpQixDQUFDO2dCQUNsRSxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQ2hDO2dCQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzthQUNuRDtZQUNELE9BQU8saUJBQWlCLENBQUM7U0FDMUI7YUFBTTtZQUNMLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0tBQ0Y7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sSUFBSSxxQ0FBYyxDQUFDLDBCQUEwQixHQUFHLEVBQUUsRUFBRTtZQUN4RCxLQUFLLEVBQUUsV0FBVztZQUNsQixhQUFhLEVBQUUsR0FBRztTQUNuQixDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFVzZXJJbnB1dEVycm9yIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1lcnJvcnMnO1xuXG5pbXBvcnQgeyBKc29uT2JqZWN0IH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVkX2pzb24nO1xuXG5leHBvcnQgY29uc3QgcGFyc2VGaWx0ZXJRdWVyeSA9IChcbiAgZmlsdGVyUXVlcnk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWRcbik6IEpzb25PYmplY3QgfCB1bmRlZmluZWQgPT4ge1xuICB0cnkge1xuICAgIGlmIChmaWx0ZXJRdWVyeSkge1xuICAgICAgY29uc3QgcGFyc2VkRmlsdGVyUXVlcnkgPSBKU09OLnBhcnNlKGZpbHRlclF1ZXJ5KTtcbiAgICAgIGlmIChcbiAgICAgICAgIXBhcnNlZEZpbHRlclF1ZXJ5IHx8XG4gICAgICAgIFsnc3RyaW5nJywgJ251bWJlcicsICdib29sZWFuJ10uaW5jbHVkZXModHlwZW9mIHBhcnNlZEZpbHRlclF1ZXJ5KSB8fFxuICAgICAgICBBcnJheS5pc0FycmF5KHBhcnNlZEZpbHRlclF1ZXJ5KVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgdmFsdWUgdG8gYmUgYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VkRmlsdGVyUXVlcnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgVXNlcklucHV0RXJyb3IoYEZhaWxlZCB0byBwYXJzZSBxdWVyeTogJHtlcnJ9YCwge1xuICAgICAgcXVlcnk6IGZpbHRlclF1ZXJ5LFxuICAgICAgb3JpZ2luYWxFcnJvcjogZXJyLFxuICAgIH0pO1xuICB9XG59O1xuIl19