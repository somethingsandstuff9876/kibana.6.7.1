"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const types_1 = require("../../../graphql/types");
const check_valid_node_1 = require("./lib/check_valid_node");
const models_1 = require("./models");
class KibanaMetricsAdapter {
    constructor(framework) {
        this.framework = framework;
    }
    async getMetrics(req, options) {
        const fields = {
            [types_1.InfraNodeType.host]: options.sourceConfiguration.fields.host,
            [types_1.InfraNodeType.container]: options.sourceConfiguration.fields.container,
            [types_1.InfraNodeType.pod]: options.sourceConfiguration.fields.pod,
        };
        const indexPattern = `${options.sourceConfiguration.metricAlias},${options.sourceConfiguration.logAlias}`;
        const timeField = options.sourceConfiguration.fields.timestamp;
        const interval = options.timerange.interval;
        const nodeField = fields[options.nodeType];
        const timerange = {
            min: options.timerange.from,
            max: options.timerange.to,
        };
        const search = (searchOptions) => this.framework.callWithRequest(req, 'search', searchOptions);
        const validNode = await check_valid_node_1.checkValidNode(search, indexPattern, nodeField, options.nodeId);
        if (!validNode) {
            throw new Error(i18n_1.i18n.translate('xpack.infra.kibanaMetrics.nodeDoesNotExistErrorMessage', {
                defaultMessage: '{nodeId} does not exist.',
                values: {
                    nodeId: options.nodeId,
                },
            }));
        }
        const requests = options.metrics.map(metricId => {
            const model = models_1.metricModels[metricId](timeField, indexPattern, interval);
            const filters = [{ match: { [nodeField]: options.nodeId } }];
            return this.framework.makeTSVBRequest(req, model, timerange, filters);
        });
        return Promise.all(requests)
            .then(results => {
            return results.map(result => {
                const metricIds = Object.keys(result).filter(k => k !== 'type');
                return metricIds.map((id) => {
                    const infraMetricId = types_1.InfraMetric[id];
                    if (!infraMetricId) {
                        throw new Error(i18n_1.i18n.translate('xpack.infra.kibanaMetrics.invalidInfraMetricErrorMessage', {
                            defaultMessage: '{id} is not a valid InfraMetric',
                            values: {
                                id,
                            },
                        }));
                    }
                    const panel = result[infraMetricId];
                    return {
                        id: infraMetricId,
                        series: panel.series.map(series => {
                            return {
                                id: series.id,
                                data: series.data.map(point => ({ timestamp: point[0], value: point[1] })),
                            };
                        }),
                    };
                });
            });
        })
            .then(result => lodash_1.flatten(result));
    }
}
exports.KibanaMetricsAdapter = KibanaMetricsAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL2tpYmFuYV9tZXRyaWNzX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9raWJhbmFfbWV0cmljc19hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILG9DQUFpQztBQUNqQyxtQ0FBaUM7QUFFakMsa0RBQXFGO0FBR3JGLDZEQUF3RDtBQUN4RCxxQ0FBd0M7QUFFeEMsTUFBYSxvQkFBb0I7SUFHL0IsWUFBWSxTQUF1QztRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRU0sS0FBSyxDQUFDLFVBQVUsQ0FDckIsR0FBMEIsRUFDMUIsT0FBbUM7UUFFbkMsTUFBTSxNQUFNLEdBQUc7WUFDYixDQUFDLHFCQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQzdELENBQUMscUJBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDdkUsQ0FBQyxxQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRztTQUM1RCxDQUFDO1FBQ0YsTUFBTSxZQUFZLEdBQUcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxJQUM3RCxPQUFPLENBQUMsbUJBQW1CLENBQUMsUUFDOUIsRUFBRSxDQUFDO1FBQ0gsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFD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LENBQUM7NkJBQzNFLENBQUM7d0JBQ0osQ0FBQyxDQUFDO3FCQUNILENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Y7QUE5RUQsb0RBOEVDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgaTE4biB9IGZyb20gJ0BrYm4vaTE4bic7XG5pbXBvcnQgeyBmbGF0dGVuIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgSW5mcmFNZXRyaWMsIEluZnJhTWV0cmljRGF0YSwgSW5mcmFOb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2dyYXBocWwvdHlwZXMnO1xuaW1wb3J0IHsgSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlciwgSW5mcmFGcmFtZXdvcmtSZXF1ZXN0IH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcbmltcG9ydCB7IEluZnJhTWV0cmljc0FkYXB0ZXIsIEluZnJhTWV0cmljc1JlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IGNoZWNrVmFsaWROb2RlIH0gZnJvbSAnLi9saWIvY2hlY2tfdmFsaWRfbm9kZSc7XG5pbXBvcnQgeyBtZXRyaWNNb2RlbHMgfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBLaWJhbmFNZXRyaWNzQWRhcHRlciBpbXBsZW1lbnRzIEluZnJhTWV0cmljc0FkYXB0ZXIge1xuICBwcml2YXRlIGZyYW1ld29yazogSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcjtcblxuICBjb25zdHJ1Y3RvcihmcmFtZXdvcms6IEluZnJhQmFja2VuZEZyYW1ld29ya0FkYXB0ZXIpIHtcbiAgICB0aGlzLmZyYW1ld29yayA9IGZyYW1ld29yaztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRNZXRyaWNzKFxuICAgIHJlcTogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxuICAgIG9wdGlvbnM6IEluZnJhTWV0cmljc1JlcXVlc3RPcHRpb25zXG4gICk6IFByb21pc2U8SW5mcmFNZXRyaWNEYXRhW10+IHtcbiAgICBjb25zdCBmaWVsZHMgPSB7XG4gICAgICBbSW5mcmFOb2RlVHlwZS5ob3N0XTogb3B0aW9ucy5zb3VyY2VDb25maWd1cmF0aW9uLmZpZWxkcy5ob3N0LFxuICAgICAgW0luZnJhTm9kZVR5cGUuY29udGFpbmVyXTogb3B0aW9ucy5zb3VyY2VDb25maWd1cmF0aW9uLmZpZWxkcy5jb250YWluZXIsXG4gICAgICBbSW5mcmFOb2RlVHlwZS5wb2RdOiBvcHRpb25zLnNvdXJjZUNvbmZpZ3VyYXRpb24uZmllbGRzLnBvZCxcbiAgICB9O1xuICAgIGNvbnN0IGluZGV4UGF0dGVybiA9IGAke29wdGlvbnMuc291cmNlQ29uZmlndXJhdGlvbi5tZXRyaWNBbGlhc30sJHtcbiAgICAgIG9wdGlvbnMuc291cmNlQ29uZmlndXJhdGlvbi5sb2dBbGlhc1xuICAgIH1gO1xuICAgIGNvbnN0IHRpbWVGaWVsZCA9IG9wdGlvbnMuc291cmNlQ29uZmlndXJhdGlvbi5maWVsZHMudGltZXN0YW1wO1xuICAgIGNvbnN0IGludGVydmFsID0gb3B0aW9ucy50aW1lcmFuZ2UuaW50ZXJ2YWw7XG4gICAgY29uc3Qgbm9kZUZpZWxkID0gZmllbGRzW29wdGlvbnMubm9kZVR5cGVdO1xuICAgIGNvbnN0IHRpbWVyYW5nZSA9IHtcbiAgICAgIG1pbjogb3B0aW9ucy50aW1lcmFuZ2UuZnJvbSxcbiAgICAgIG1heDogb3B0aW9ucy50aW1lcmFuZ2UudG8sXG4gICAgfTtcblxuICAgIGNvbnN0IHNlYXJjaCA9IDxBZ2dyZWdhdGlvbj4oc2VhcmNoT3B0aW9uczogb2JqZWN0KSA9PlxuICAgICAgdGhpcy5mcmFtZXdvcmsuY2FsbFdpdGhSZXF1ZXN0PHt9LCBBZ2dyZWdhdGlvbj4ocmVxLCAnc2VhcmNoJywgc2VhcmNoT3B0aW9ucyk7XG5cbiAgICBjb25zdCB2YWxpZE5vZGUgPSBhd2FpdCBjaGVja1ZhbGlkTm9kZShzZWFyY2gsIGluZGV4UGF0dGVybiwgbm9kZUZpZWxkLCBvcHRpb25zLm5vZGVJZCk7XG4gICAgaWYgKCF2YWxpZE5vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgaTE4bi50cmFuc2xhdGUoJ3hwYWNrLmluZnJhLmtpYmFuYU1ldHJpY3Mubm9kZURvZXNOb3RFeGlzdEVycm9yTWVzc2FnZScsIHtcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ3tub2RlSWR9IGRvZXMgbm90IGV4aXN0LicsXG4gICAgICAgICAgdmFsdWVzOiB7XG4gICAgICAgICAgICBub2RlSWQ6IG9wdGlvbnMubm9kZUlkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3RzID0gb3B0aW9ucy5tZXRyaWNzLm1hcChtZXRyaWNJZCA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IG1ldHJpY01vZGVsc1ttZXRyaWNJZF0odGltZUZpZWxkLCBpbmRleFBhdHRlcm4sIGludGVydmFsKTtcbiAgICAgIGNvbnN0IGZpbHRlcnMgPSBbeyBtYXRjaDogeyBbbm9kZUZpZWxkXTogb3B0aW9ucy5ub2RlSWQgfSB9XTtcbiAgICAgIHJldHVybiB0aGlzLmZyYW1ld29yay5tYWtlVFNWQlJlcXVlc3QocmVxLCBtb2RlbCwgdGltZXJhbmdlLCBmaWx0ZXJzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVxdWVzdHMpXG4gICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHMubWFwKHJlc3VsdCA9PiB7XG4gICAgICAgICAgY29uc3QgbWV0cmljSWRzID0gT2JqZWN0LmtleXMocmVzdWx0KS5maWx0ZXIoayA9PiBrICE9PSAndHlwZScpO1xuICAgICAgICAgIHJldHVybiBtZXRyaWNJZHMubWFwKChpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmZyYU1ldHJpY0lkOiBJbmZyYU1ldHJpYyA9IChJbmZyYU1ldHJpYyBhcyBhbnkpW2lkXTtcbiAgICAgICAgICAgIGlmICghaW5mcmFNZXRyaWNJZCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgaTE4bi50cmFuc2xhdGUoJ3hwYWNrLmluZnJhLmtpYmFuYU1ldHJpY3MuaW52YWxpZEluZnJhTWV0cmljRXJyb3JNZXNzYWdlJywge1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdE1lc3NhZ2U6ICd7aWR9IGlzIG5vdCBhIHZhbGlkIEluZnJhTWV0cmljJyxcbiAgICAgICAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhbmVsID0gcmVzdWx0W2luZnJhTWV0cmljSWRdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6IGluZnJhTWV0cmljSWQsXG4gICAgICAgICAgICAgIHNlcmllczogcGFuZWwuc2VyaWVzLm1hcChzZXJpZXMgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBpZDogc2VyaWVzLmlkLFxuICAgICAgICAgICAgICAgICAgZGF0YTogc2VyaWVzLmRhdGEubWFwKHBvaW50ID0+ICh7IHRpbWVzdGFtcDogcG9pbnRbMF0sIHZhbHVlOiBwb2ludFsxXSB9KSksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXN1bHQgPT4gZmxhdHRlbihyZXN1bHQpKTtcbiAgfVxufVxuIl19