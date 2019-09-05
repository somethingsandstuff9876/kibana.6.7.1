"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("../nodes/constants");
class ElasticsearchMetadataAdapter {
    constructor(framework) {
        this.framework = framework;
    }
    async getMetricMetadata(req, sourceConfiguration, nodeId, nodeType) {
        const idFieldName = getIdFieldName(sourceConfiguration, nodeType);
        const metricQuery = {
            index: sourceConfiguration.metricAlias,
            body: {
                query: {
                    bool: {
                        filter: {
                            term: { [idFieldName]: nodeId },
                        },
                    },
                },
                size: 1,
                _source: [constants_1.NAME_FIELDS[nodeType]],
                aggs: {
                    metrics: {
                        terms: {
                            field: 'metricset.module',
                            size: 1000,
                        },
                        aggs: {
                            names: {
                                terms: {
                                    field: 'metricset.name',
                                    size: 1000,
                                },
                            },
                        },
                    },
                },
            },
        };
        const response = await this.framework.callWithRequest(req, 'search', metricQuery);
        const buckets = response.aggregations && response.aggregations.metrics
            ? response.aggregations.metrics.buckets
            : [];
        const sampleDoc = lodash_1.first(response.hits.hits);
        return {
            id: nodeId,
            name: lodash_1.get(sampleDoc, `_source.${constants_1.NAME_FIELDS[nodeType]}`),
            buckets,
        };
    }
    async getLogMetadata(req, sourceConfiguration, nodeId, nodeType) {
        const idFieldName = getIdFieldName(sourceConfiguration, nodeType);
        const logQuery = {
            index: sourceConfiguration.logAlias,
            body: {
                query: {
                    bool: {
                        filter: {
                            term: { [idFieldName]: nodeId },
                        },
                    },
                },
                size: 1,
                _source: [constants_1.NAME_FIELDS[nodeType]],
                aggs: {
                    metrics: {
                        terms: {
                            field: 'fileset.module',
                            size: 1000,
                        },
                        aggs: {
                            names: {
                                terms: {
                                    field: 'fileset.name',
                                    size: 1000,
                                },
                            },
                        },
                    },
                },
            },
        };
        const response = await this.framework.callWithRequest(req, 'search', logQuery);
        const buckets = response.aggregations && response.aggregations.metrics
            ? response.aggregations.metrics.buckets
            : [];
        const sampleDoc = lodash_1.first(response.hits.hits);
        return {
            id: nodeId,
            name: lodash_1.get(sampleDoc, `_source.${constants_1.NAME_FIELDS[nodeType]}`),
            buckets,
        };
    }
}
exports.ElasticsearchMetadataAdapter = ElasticsearchMetadataAdapter;
const getIdFieldName = (sourceConfiguration, nodeType) => {
    switch (nodeType) {
        case 'host':
            return sourceConfiguration.fields.host;
        case 'container':
            return sourceConfiguration.fields.container;
        default:
            return sourceConfiguration.fields.pod;
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRhZGF0YS9lbGFzdGljc2VhcmNoX21ldGFkYXRhX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0YWRhdGEvZWxhc3RpY3NlYXJjaF9tZXRhZGF0YV9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILG1DQUFvQztBQU9wQyxrREFBaUQ7QUFHakQsTUFBYSw0QkFBNEI7SUFFdkMsWUFBWSxTQUF1QztRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRU0sS0FBSyxDQUFDLGlCQUFpQixDQUM1QixHQUEwQixFQUMxQixtQkFBNkMsRUFDN0MsTUFBYyxFQUNkLFFBQXNDO1FBRXRDLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRSxNQUFNLFdBQVcsR0FBRztZQUNsQixLQUFLLEVBQUUsbUJBQW1CLENBQUMsV0FBVztZQUN0QyxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUU7NEJBQ04sSUFBSSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUU7eUJBQ2hDO3FCQUNGO2lCQUNGO2dCQUNELElBQUksRUFBRSxDQUFDO2dCQUNQLE9BQU8sRUFBRSxDQUFDLHVCQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUU7d0JBQ1AsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxrQkFBa0I7NEJBQ3pCLElBQUksRUFBRSxJQUFJO3lC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QUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDOUM7WUFDRSxPQUFPLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDekM7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBmaXJzdCwgZ2V0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEluZnJhU291cmNlQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL3NvdXJjZXMnO1xuaW1wb3J0IHtcbiAgSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcixcbiAgSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICBJbmZyYU1ldGFkYXRhQWdncmVnYXRpb25SZXNwb25zZSxcbn0gZnJvbSAnLi4vZnJhbWV3b3JrJztcbmltcG9ydCB7IE5BTUVfRklFTERTIH0gZnJvbSAnLi4vbm9kZXMvY29uc3RhbnRzJztcbmltcG9ydCB7IEluZnJhTWV0YWRhdGFBZGFwdGVyLCBJbmZyYU1ldHJpY3NBZGFwdGVyUmVzcG9uc2UgfSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgRWxhc3RpY3NlYXJjaE1ldGFkYXRhQWRhcHRlciBpbXBsZW1lbnRzIEluZnJhTWV0YWRhdGFBZGFwdGVyIHtcbiAgcHJpdmF0ZSBmcmFtZXdvcms6IEluZnJhQmFja2VuZEZyYW1ld29ya0FkYXB0ZXI7XG4gIGNvbnN0cnVjdG9yKGZyYW1ld29yazogSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcikge1xuICAgIHRoaXMuZnJhbWV3b3JrID0gZnJhbWV3b3JrO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldE1ldHJpY01ldGFkYXRhKFxuICAgIHJlcTogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICAgIHNvdXJjZUNvbmZpZ3VyYXRpb246IEluZnJhU291cmNlQ29uZmlndXJhdGlvbixcbiAgICBub2RlSWQ6IHN0cmluZyxcbiAgICBub2RlVHlwZTogJ2hvc3QnIHwgJ2NvbnRhaW5lcicgfCAncG9kJ1xuICApOiBQcm9taXNlPEluZnJhTWV0cmljc0FkYXB0ZXJSZXNwb25zZT4ge1xuICAgIGNvbnN0IGlkRmllbGROYW1lID0gZ2V0SWRGaWVsZE5hbWUoc291cmNlQ29uZmlndXJhdGlvbiwgbm9kZVR5cGUpO1xuICAgIGNvbnN0IG1ldHJpY1F1ZXJ5ID0ge1xuICAgICAgaW5kZXg6IHNvdXJjZUNvbmZpZ3VyYXRpb24ubWV0cmljQWxpYXMsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHRlcm06IHsgW2lkRmllbGROYW1lXTogbm9kZUlkIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIF9zb3VyY2U6IFtOQU1FX0ZJRUxEU1tub2RlVHlwZV1dLFxuICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgbWV0cmljczoge1xuICAgICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdtZXRyaWNzZXQubW9kdWxlJyxcbiAgICAgICAgICAgICAgc2l6ZTogMTAwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgICAgIG5hbWVzOiB7XG4gICAgICAgICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiAnbWV0cmljc2V0Lm5hbWUnLFxuICAgICAgICAgICAgICAgICAgc2l6ZTogMTAwMCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZyYW1ld29yay5jYWxsV2l0aFJlcXVlc3Q8XG4gICAgICBhbnksXG4gICAgICB7IG1ldHJpY3M/OiBJbmZyYU1ldGFkYXRhQWdncmVnYXRpb25SZXNwb25zZSB9XG4gICAgPihyZXEsICdzZWFyY2gnLCBtZXRyaWNRdWVyeSk7XG5cbiAgICBjb25zdCBidWNrZXRzID1cbiAgICAgIHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucyAmJiByZXNwb25zZS5hZ2dyZWdhdGlvbnMubWV0cmljc1xuICAgICAgICA/IHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucy5tZXRyaWNzLmJ1Y2tldHNcbiAgICAgICAgOiBbXTtcblxuICAgIGNvbnN0IHNhbXBsZURvYyA9IGZpcnN0KHJlc3BvbnNlLmhpdHMuaGl0cyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IG5vZGVJZCxcbiAgICAgIG5hbWU6IGdldChzYW1wbGVEb2MsIGBfc291cmNlLiR7TkFNRV9GSUVMRFNbbm9kZVR5cGVdfWApLFxuICAgICAgYnVja2V0cyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldExvZ01ldGFkYXRhKFxuICAgIHJlcTogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICAgIHNvdXJjZUNvbmZpZ3VyYXRpb246IEluZnJhU291cmNlQ29uZmlndXJhdGlvbixcbiAgICBub2RlSWQ6IHN0cmluZyxcbiAgICBub2RlVHlwZTogJ2hvc3QnIHwgJ2NvbnRhaW5lcicgfCAncG9kJ1xuICApOiBQcm9taXNlPEluZnJhTWV0cmljc0FkYXB0ZXJSZXNwb25zZT4ge1xuICAgIGNvbnN0IGlkRmllbGROYW1lID0gZ2V0SWRGaWVsZE5hbWUoc291cmNlQ29uZmlndXJhdGlvbiwgbm9kZVR5cGUpO1xuICAgIGNvbnN0IGxvZ1F1ZXJ5ID0ge1xuICAgICAgaW5kZXg6IHNvdXJjZUNvbmZpZ3VyYXRpb24ubG9nQWxpYXMsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHRlcm06IHsgW2lkRmllbGROYW1lXTogbm9kZUlkIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIF9zb3VyY2U6IFtOQU1FX0ZJRUxEU1tub2RlVHlwZV1dLFxuICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgbWV0cmljczoge1xuICAgICAgICAgICAgdGVybXM6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdmaWxlc2V0Lm1vZHVsZScsXG4gICAgICAgICAgICAgIHNpemU6IDEwMDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWdnczoge1xuICAgICAgICAgICAgICBuYW1lczoge1xuICAgICAgICAgICAgICAgIHRlcm1zOiB7XG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ2ZpbGVzZXQubmFtZScsXG4gICAgICAgICAgICAgICAgICBzaXplOiAxMDAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZnJhbWV3b3JrLmNhbGxXaXRoUmVxdWVzdDxcbiAgICAgIGFueSxcbiAgICAgIHsgbWV0cmljcz86IEluZnJhTWV0YWRhdGFBZ2dyZWdhdGlvblJlc3BvbnNlIH1cbiAgICA+KHJlcSwgJ3NlYXJjaCcsIGxvZ1F1ZXJ5KTtcblxuICAgIGNvbnN0IGJ1Y2tldHMgPVxuICAgICAgcmVzcG9uc2UuYWdncmVnYXRpb25zICYmIHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucy5tZXRyaWNzXG4gICAgICAgID8gcmVzcG9uc2UuYWdncmVnYXRpb25zLm1ldHJpY3MuYnVja2V0c1xuICAgICAgICA6IFtdO1xuXG4gICAgY29uc3Qgc2FtcGxlRG9jID0gZmlyc3QocmVzcG9uc2UuaGl0cy5oaXRzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpZDogbm9kZUlkLFxuICAgICAgbmFtZTogZ2V0KHNhbXBsZURvYywgYF9zb3VyY2UuJHtOQU1FX0ZJRUxEU1tub2RlVHlwZV19YCksXG4gICAgICBidWNrZXRzLFxuICAgIH07XG4gIH1cbn1cblxuY29uc3QgZ2V0SWRGaWVsZE5hbWUgPSAoc291cmNlQ29uZmlndXJhdGlvbjogSW5mcmFTb3VyY2VDb25maWd1cmF0aW9uLCBub2RlVHlwZTogc3RyaW5nKSA9PiB7XG4gIHN3aXRjaCAobm9kZVR5cGUpIHtcbiAgICBjYXNlICdob3N0JzpcbiAgICAgIHJldHVybiBzb3VyY2VDb25maWd1cmF0aW9uLmZpZWxkcy5ob3N0O1xuICAgIGNhc2UgJ2NvbnRhaW5lcic6XG4gICAgICByZXR1cm4gc291cmNlQ29uZmlndXJhdGlvbi5maWVsZHMuY29udGFpbmVyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc291cmNlQ29uZmlndXJhdGlvbi5maWVsZHMucG9kO1xuICB9XG59O1xuIl19