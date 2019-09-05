"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("./type_guards");
function createQuery(options) {
    const { timerange, sourceConfiguration, groupBy, filterQuery } = options;
    const mustClause = [];
    const shouldClause = [];
    const filterClause = [];
    const rangeFilter = {
        range: {
            [sourceConfiguration.fields.timestamp]: {
                format: 'epoch_millis',
                gte: timerange.from,
                lte: timerange.to,
            },
        },
    };
    filterClause.push(rangeFilter);
    if (groupBy) {
        groupBy.forEach((group) => {
            if (type_guards_1.isGroupByTerms(group) && group.field) {
                mustClause.push({
                    exists: {
                        field: group.field,
                    },
                });
            }
            if (type_guards_1.isGroupByFilters(group) && group.filters) {
                group.filters.forEach((groupFilter) => {
                    if (groupFilter != null && groupFilter.query) {
                        shouldClause.push({
                            query_string: {
                                analyze_wildcard: true,
                                query: groupFilter.query,
                            },
                        });
                    }
                });
            }
        });
    }
    if (filterQuery) {
        mustClause.push(filterQuery);
    }
    const query = {
        bool: {
            filter: filterClause,
            must: mustClause,
            should: shouldClause,
        },
    };
    return query;
}
exports.createQuery = createQuery;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9saWIvY3JlYXRlX3F1ZXJ5LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL25vZGVzL2xpYi9jcmVhdGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBV0gsK0NBQWlFO0FBRWpFLFNBQWdCLFdBQVcsQ0FBQyxPQUFnQztJQUMxRCxNQUFNLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsR0FBNEIsT0FBTyxDQUFDO0lBQ2xHLE1BQU0sVUFBVSxHQUFtQixFQUFFLENBQUM7SUFDdEMsTUFBTSxZQUFZLEdBQW1CLEVBQUUsQ0FBQztJQUN4QyxNQUFNLFlBQVksR0FBbUIsRUFBRSxDQUFDO0lBRXhDLE1BQU0sV0FBVyxHQUFzQjtRQUNyQyxLQUFLLEVBQUU7WUFDTCxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDdEMsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLEdBQUcsRUFBRSxTQUFTLENBQUMsSUFBSTtnQkFDbkIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxFQUFFO2FBQ2xCO1NBQ0Y7S0FDRixDQUFDO0lBRUYsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUUvQixJQUFJLE9BQU8sRUFBRTtRQUNYLE9BQU8sQ0FBQyxPQUFPLENBQ2IsQ0FBQyxLQUFxQixFQUFRLEVBQUU7WUFDOUIsSUFBSSw0QkFBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hDLFVBQVUsQ0FBQyxJQUFJLENBQUM7b0JBQ2QsTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztxQkFDbkI7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxJQUFJLDhCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7Z0JBQzVDLEtBQUssQ0FBQyxPQUFRLENBQUMsT0FBTyxDQUNwQixDQUFDLFdBQXdDLEVBQVEsRUFBRTtvQkFDakQsSUFBSSxXQUFXLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7d0JBQzVDLFlBQVksQ0FBQyxJQUFJLENBQUM7NEJBQ2hCLFlBQVksRUFBRTtnQ0FDWixnQkFBZ0IsRUFBRSxJQUFJO2dDQUN0QixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7NkJBQ3pCO3lCQUNGLENBQUMsQ0FBQztxQkFDSjtnQkFDSCxDQUFDLENBQ0YsQ0FBQzthQUNIO1FBQ0gsQ0FBQyxDQUNGLENBQUM7S0FDSDtJQUVELElBQUksV0FBVyxFQUFFO1FBQ2YsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM5QjtJQUVELE1BQU0sS0FBSyxHQUFxQjtRQUM5QixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsWUFBWTtZQUNwQixJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUUsWUFBWTtTQUNyQjtLQUNGLENBQUM7SUFFRixPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUEzREQsa0NBMkRDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFQYXRoRmlsdGVySW5wdXQsIEluZnJhUGF0aElucHV0IH0gZnJvbSAnLi4vLi4vLi4vLi4vZ3JhcGhxbC90eXBlcyc7XG5cbmltcG9ydCB7XG4gIEluZnJhRVNCb29sUXVlcnksXG4gIEluZnJhRVNRdWVyeSxcbiAgSW5mcmFFU1JhbmdlUXVlcnksXG4gIEluZnJhTm9kZVJlcXVlc3RPcHRpb25zLFxufSBmcm9tICcuLi9hZGFwdGVyX3R5cGVzJztcblxuaW1wb3J0IHsgaXNHcm91cEJ5RmlsdGVycywgaXNHcm91cEJ5VGVybXMgfSBmcm9tICcuL3R5cGVfZ3VhcmRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5KG9wdGlvbnM6IEluZnJhTm9kZVJlcXVlc3RPcHRpb25zKTogSW5mcmFFU1F1ZXJ5IHtcbiAgY29uc3QgeyB0aW1lcmFuZ2UsIHNvdXJjZUNvbmZpZ3VyYXRpb24sIGdyb3VwQnksIGZpbHRlclF1ZXJ5IH06IEluZnJhTm9kZVJlcXVlc3RPcHRpb25zID0gb3B0aW9ucztcbiAgY29uc3QgbXVzdENsYXVzZTogSW5mcmFFU1F1ZXJ5W10gPSBbXTtcbiAgY29uc3Qgc2hvdWxkQ2xhdXNlOiBJbmZyYUVTUXVlcnlbXSA9IFtdO1xuICBjb25zdCBmaWx0ZXJDbGF1c2U6IEluZnJhRVNRdWVyeVtdID0gW107XG5cbiAgY29uc3QgcmFuZ2VGaWx0ZXI6IEluZnJhRVNSYW5nZVF1ZXJ5ID0ge1xuICAgIHJhbmdlOiB7XG4gICAgICBbc291cmNlQ29uZmlndXJhdGlvbi5maWVsZHMudGltZXN0YW1wXToge1xuICAgICAgICBmb3JtYXQ6ICdlcG9jaF9taWxsaXMnLFxuICAgICAgICBndGU6IHRpbWVyYW5nZS5mcm9tLFxuICAgICAgICBsdGU6IHRpbWVyYW5nZS50byxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICBmaWx0ZXJDbGF1c2UucHVzaChyYW5nZUZpbHRlcik7XG5cbiAgaWYgKGdyb3VwQnkpIHtcbiAgICBncm91cEJ5LmZvckVhY2goXG4gICAgICAoZ3JvdXA6IEluZnJhUGF0aElucHV0KTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChpc0dyb3VwQnlUZXJtcyhncm91cCkgJiYgZ3JvdXAuZmllbGQpIHtcbiAgICAgICAgICBtdXN0Q2xhdXNlLnB1c2goe1xuICAgICAgICAgICAgZXhpc3RzOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBncm91cC5maWVsZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzR3JvdXBCeUZpbHRlcnMoZ3JvdXApICYmIGdyb3VwLmZpbHRlcnMpIHtcbiAgICAgICAgICBncm91cC5maWx0ZXJzIS5mb3JFYWNoKFxuICAgICAgICAgICAgKGdyb3VwRmlsdGVyOiBJbmZyYVBhdGhGaWx0ZXJJbnB1dCB8IG51bGwpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdyb3VwRmlsdGVyICE9IG51bGwgJiYgZ3JvdXBGaWx0ZXIucXVlcnkpIHtcbiAgICAgICAgICAgICAgICBzaG91bGRDbGF1c2UucHVzaCh7XG4gICAgICAgICAgICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgYW5hbHl6ZV93aWxkY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IGdyb3VwRmlsdGVyLnF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgaWYgKGZpbHRlclF1ZXJ5KSB7XG4gICAgbXVzdENsYXVzZS5wdXNoKGZpbHRlclF1ZXJ5KTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5OiBJbmZyYUVTQm9vbFF1ZXJ5ID0ge1xuICAgIGJvb2w6IHtcbiAgICAgIGZpbHRlcjogZmlsdGVyQ2xhdXNlLFxuICAgICAgbXVzdDogbXVzdENsYXVzZSxcbiAgICAgIHNob3VsZDogc2hvdWxkQ2xhdXNlLFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuIl19