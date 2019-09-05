"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const type_guards_1 = require("../../lib/type_guards");
exports.groupByProcessor = (options) => {
    return (doc) => {
        const result = lodash_1.cloneDeep(doc);
        const { groupBy } = options.nodeOptions;
        let aggs = lodash_1.get(result, 'aggs.waffle.aggs.nodes.aggs', {});
        lodash_1.set(result, 'aggs.waffle.aggs.nodes.aggs', aggs);
        groupBy.forEach((grouping, index) => {
            if (type_guards_1.isGroupByTerms(grouping)) {
                const termsAgg = {
                    aggs: {},
                    terms: {
                        field: grouping.field,
                        size: 10,
                    },
                };
                lodash_1.set(aggs, `path_${index}`, termsAgg);
                aggs = termsAgg.aggs;
            }
            if (grouping && type_guards_1.isGroupByFilters(grouping)) {
                const filtersAgg = {
                    aggs: {},
                    filters: {
                        filters: grouping.filters.map((filter) => {
                            return {
                                query_string: {
                                    analyze_wildcard: true,
                                    query: (filter && filter.query) || '*',
                                },
                            };
                        }),
                    },
                };
                lodash_1.set(aggs, `path_${index}`, filtersAgg);
                aggs = filtersAgg.aggs;
            }
        });
        return result;
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9wcm9jZXNzb3JzL2NvbW1vbi9ncm91cF9ieV9wcm9jZXNzb3IudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbm9kZXMvcHJvY2Vzc29ycy9jb21tb24vZ3JvdXBfYnlfcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILG1DQUE2QztBQVE3Qyx1REFBeUU7QUFFNUQsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLE9BQW9DLEVBQUUsRUFBRTtJQUN2RSxPQUFPLENBQUMsR0FBc0IsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDeEMsSUFBSSxJQUFJLEdBQUcsWUFBRyxDQUFDLE1BQU0sRUFBRSw2QkFBNkIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMxRCxZQUFHLENBQUMsTUFBTSxFQUFFLDZCQUE2QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUF3QixFQUFFLEtBQWEsRUFBRSxFQUFFO1lBQzFELElBQUksNEJBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxRQUFRLEdBQUc7b0JBQ2YsSUFBSSxFQUFFLEVBQUU7b0JBQ1IsS0FBSyxFQUFFO3dCQUNMLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSzt3QkFDckIsSUFBSSxFQUFFLEVBQUU7cUJBQ1Q7aUJBQ0YsQ0FBQztnQkFDRixZQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsS0FBSyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO2FBQ3RCO1lBRUQsSUFBSSxRQUFRLElBQUksOEJBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzFDLE1BQU0sVUFBVSxHQUFHO29CQUNqQixJQUFJLEVBQUUsRUFBRTtvQkFDUixPQUFPLEVBQUU7d0JBQ1AsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUMsR0FBRyxDQUM1QixDQUFDLE1BQTRCLEVBQTJCLEVBQUU7NEJBQ3hELE9BQU87Z0NBQ0wsWUFBWSxFQUFFO29DQUNaLGdCQUFnQixFQUFFLElBQUk7b0NBQ3RCLEtBQUssRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRztpQ0FDdkM7NkJBQ0YsQ0FBQzt3QkFDSixDQUFDLENBQ0Y7cUJBQ0Y7aUJBQ0YsQ0FBQztnQkFDRixZQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsS0FBSyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBjbG9uZURlZXAsIGdldCwgc2V0IH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgSW5mcmFQYXRoRmlsdGVySW5wdXQsIEluZnJhUGF0aElucHV0IH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZ3JhcGhxbC90eXBlcyc7XG5pbXBvcnQge1xuICBJbmZyYUVTUXVlcnlTdHJpbmdRdWVyeSxcbiAgSW5mcmFFU1NlYXJjaEJvZHksXG4gIEluZnJhUHJvY2Vzb3JSZXF1ZXN0T3B0aW9ucyxcbn0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBpc0dyb3VwQnlGaWx0ZXJzLCBpc0dyb3VwQnlUZXJtcyB9IGZyb20gJy4uLy4uL2xpYi90eXBlX2d1YXJkcyc7XG5cbmV4cG9ydCBjb25zdCBncm91cEJ5UHJvY2Vzc29yID0gKG9wdGlvbnM6IEluZnJhUHJvY2Vzb3JSZXF1ZXN0T3B0aW9ucykgPT4ge1xuICByZXR1cm4gKGRvYzogSW5mcmFFU1NlYXJjaEJvZHkpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAoZG9jKTtcbiAgICBjb25zdCB7IGdyb3VwQnkgfSA9IG9wdGlvbnMubm9kZU9wdGlvbnM7XG4gICAgbGV0IGFnZ3MgPSBnZXQocmVzdWx0LCAnYWdncy53YWZmbGUuYWdncy5ub2Rlcy5hZ2dzJywge30pO1xuICAgIHNldChyZXN1bHQsICdhZ2dzLndhZmZsZS5hZ2dzLm5vZGVzLmFnZ3MnLCBhZ2dzKTtcbiAgICBncm91cEJ5LmZvckVhY2goKGdyb3VwaW5nOiBJbmZyYVBhdGhJbnB1dCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKGlzR3JvdXBCeVRlcm1zKGdyb3VwaW5nKSkge1xuICAgICAgICBjb25zdCB0ZXJtc0FnZyA9IHtcbiAgICAgICAgICBhZ2dzOiB7fSxcbiAgICAgICAgICB0ZXJtczoge1xuICAgICAgICAgICAgZmllbGQ6IGdyb3VwaW5nLmZpZWxkLFxuICAgICAgICAgICAgc2l6ZTogMTAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc2V0KGFnZ3MsIGBwYXRoXyR7aW5kZXh9YCwgdGVybXNBZ2cpO1xuICAgICAgICBhZ2dzID0gdGVybXNBZ2cuYWdncztcbiAgICAgIH1cblxuICAgICAgaWYgKGdyb3VwaW5nICYmIGlzR3JvdXBCeUZpbHRlcnMoZ3JvdXBpbmcpKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcnNBZ2cgPSB7XG4gICAgICAgICAgYWdnczoge30sXG4gICAgICAgICAgZmlsdGVyczoge1xuICAgICAgICAgICAgZmlsdGVyczogZ3JvdXBpbmcuZmlsdGVycyEubWFwKFxuICAgICAgICAgICAgICAoZmlsdGVyOiBJbmZyYVBhdGhGaWx0ZXJJbnB1dCk6IEluZnJhRVNRdWVyeVN0cmluZ1F1ZXJ5ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgcXVlcnlfc3RyaW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIGFuYWx5emVfd2lsZGNhcmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiAoZmlsdGVyICYmIGZpbHRlci5xdWVyeSkgfHwgJyonLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNldChhZ2dzLCBgcGF0aF8ke2luZGV4fWAsIGZpbHRlcnNBZ2cpO1xuICAgICAgICBhZ2dzID0gZmlsdGVyc0FnZy5hZ2dzO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuIl19