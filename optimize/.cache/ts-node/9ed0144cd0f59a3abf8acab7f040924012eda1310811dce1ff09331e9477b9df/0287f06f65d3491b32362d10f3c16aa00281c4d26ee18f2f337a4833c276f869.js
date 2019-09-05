"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const adapter_types_1 = require("../../adapter_types");
const constants_1 = require("../../constants");
const nodeTypeToField = (options) => {
    const { fields } = options.nodeOptions.sourceConfiguration;
    switch (options.nodeType) {
        case adapter_types_1.InfraNodeType.pod:
            return fields.pod;
        case adapter_types_1.InfraNodeType.container:
            return fields.container;
        default:
            return fields.host;
    }
};
exports.nodesProcessor = (options) => {
    const { fields } = options.nodeOptions.sourceConfiguration;
    return (doc) => {
        const result = lodash_1.cloneDeep(doc);
        const field = nodeTypeToField(options);
        lodash_1.set(result, 'aggs.waffle.aggs.nodes.terms', {
            field,
            include: {
                num_partitions: options.numberOfPartitions,
                partition: options.partitionId,
            },
            order: { _key: 'asc' },
            size: constants_1.NODE_REQUEST_PARTITION_SIZE * constants_1.NODE_REQUEST_PARTITION_FACTOR,
        });
        lodash_1.set(result, 'aggs.waffle.aggs.nodes.aggs', {
            nodeDetails: {
                top_hits: {
                    size: 1,
                    _source: { includes: [constants_1.NAME_FIELDS[options.nodeType]] },
                    sort: [{ [fields.timestamp]: { order: 'desc' } }],
                },
            },
        });
        return result;
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9wcm9jZXNzb3JzL2NvbW1vbi9ub2Rlc19wcm9jZXNzb3IudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbm9kZXMvcHJvY2Vzc29ycy9jb21tb24vbm9kZXNfcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILG1DQUF3QztBQUV4Qyx1REFBb0c7QUFDcEcsK0NBSXlCO0FBRXpCLE1BQU0sZUFBZSxHQUFHLENBQUMsT0FBb0MsRUFBVSxFQUFFO0lBQ3ZFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO0lBQzNELFFBQVEsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUN4QixLQUFLLDZCQUFhLENBQUMsR0FBRztZQUNwQixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDcEIsS0FBSyw2QkFBYSxDQUFDLFNBQVM7WUFDMUIsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQzFCO1lBQ0UsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxjQUFjLEdBQUcsQ0FBQyxPQUFvQyxFQUFFLEVBQUU7SUFDckUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUM7SUFDM0QsT0FBTyxDQUFDLEdBQXNCLEVBQUUsRUFBRTtRQUNoQyxNQUFNLE1BQU0sR0FBRyxrQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QyxZQUFHLENBQUMsTUFBTSxFQUFFLDhCQUE4QixFQUFFO1lBQzFDLEtBQUs7WUFDTCxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0I7Z0JBQzFDLFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVzthQUMvQjtZQUNELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDdEIsSUFBSSxFQUFFLHVDQUEyQixHQUFHLHlDQUE2QjtTQUNsRSxDQUFDLENBQUM7UUFFSCxZQUFHLENBQUMsTUFBTSxFQUFFLDZCQUE2QixFQUFFO1lBQ3pDLFdBQVcsRUFBRTtnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLENBQUM7b0JBQ1AsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsdUJBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO2lCQUNsRDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgY2xvbmVEZWVwLCBzZXQgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBJbmZyYUVTU2VhcmNoQm9keSwgSW5mcmFOb2RlVHlwZSwgSW5mcmFQcm9jZXNvclJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQge1xuICBOQU1FX0ZJRUxEUyxcbiAgTk9ERV9SRVFVRVNUX1BBUlRJVElPTl9GQUNUT1IsXG4gIE5PREVfUkVRVUVTVF9QQVJUSVRJT05fU0laRSxcbn0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcblxuY29uc3Qgbm9kZVR5cGVUb0ZpZWxkID0gKG9wdGlvbnM6IEluZnJhUHJvY2Vzb3JSZXF1ZXN0T3B0aW9ucyk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHsgZmllbGRzIH0gPSBvcHRpb25zLm5vZGVPcHRpb25zLnNvdXJjZUNvbmZpZ3VyYXRpb247XG4gIHN3aXRjaCAob3B0aW9ucy5ub2RlVHlwZSkge1xuICAgIGNhc2UgSW5mcmFOb2RlVHlwZS5wb2Q6XG4gICAgICByZXR1cm4gZmllbGRzLnBvZDtcbiAgICBjYXNlIEluZnJhTm9kZVR5cGUuY29udGFpbmVyOlxuICAgICAgcmV0dXJuIGZpZWxkcy5jb250YWluZXI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmaWVsZHMuaG9zdDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IG5vZGVzUHJvY2Vzc29yID0gKG9wdGlvbnM6IEluZnJhUHJvY2Vzb3JSZXF1ZXN0T3B0aW9ucykgPT4ge1xuICBjb25zdCB7IGZpZWxkcyB9ID0gb3B0aW9ucy5ub2RlT3B0aW9ucy5zb3VyY2VDb25maWd1cmF0aW9uO1xuICByZXR1cm4gKGRvYzogSW5mcmFFU1NlYXJjaEJvZHkpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAoZG9jKTtcbiAgICBjb25zdCBmaWVsZCA9IG5vZGVUeXBlVG9GaWVsZChvcHRpb25zKTtcblxuICAgIHNldChyZXN1bHQsICdhZ2dzLndhZmZsZS5hZ2dzLm5vZGVzLnRlcm1zJywge1xuICAgICAgZmllbGQsXG4gICAgICBpbmNsdWRlOiB7XG4gICAgICAgIG51bV9wYXJ0aXRpb25zOiBvcHRpb25zLm51bWJlck9mUGFydGl0aW9ucyxcbiAgICAgICAgcGFydGl0aW9uOiBvcHRpb25zLnBhcnRpdGlvbklkLFxuICAgICAgfSxcbiAgICAgIG9yZGVyOiB7IF9rZXk6ICdhc2MnIH0sXG4gICAgICBzaXplOiBOT0RFX1JFUVVFU1RfUEFSVElUSU9OX1NJWkUgKiBOT0RFX1JFUVVFU1RfUEFSVElUSU9OX0ZBQ1RPUixcbiAgICB9KTtcblxuICAgIHNldChyZXN1bHQsICdhZ2dzLndhZmZsZS5hZ2dzLm5vZGVzLmFnZ3MnLCB7XG4gICAgICBub2RlRGV0YWlsczoge1xuICAgICAgICB0b3BfaGl0czoge1xuICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgX3NvdXJjZTogeyBpbmNsdWRlczogW05BTUVfRklFTERTW29wdGlvbnMubm9kZVR5cGVdXSB9LFxuICAgICAgICAgIHNvcnQ6IFt7IFtmaWVsZHMudGltZXN0YW1wXTogeyBvcmRlcjogJ2Rlc2MnIH0gfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuIl19