"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostNetworkTraffic = (timeField, indexPattern, interval) => ({
    id: 'hostNetworkTraffic',
    requires: ['system.network'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'tx',
            metrics: [
                {
                    field: 'system.network.out.bytes',
                    id: 'max-net-out',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-net-out',
                    id: 'deriv-max-net-out',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-net-out',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-net-out' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    function: 'sum',
                    id: 'seriesagg-sum',
                    type: adapter_types_1.InfraMetricModelMetricType.series_agg,
                },
            ],
            split_mode: 'terms',
            terms_field: 'system.network.name',
        },
        {
            id: 'rx',
            label: 'Inbound (RX)',
            metrics: [
                {
                    field: 'system.network.in.bytes',
                    id: 'max-net-in',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-net-in',
                    id: 'deriv-max-net-in',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-net-in',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-net-in' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    id: 'calc-invert-rate',
                    script: 'params.rate * -1',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'posonly-deriv-max-net-in',
                            id: 'var-rate',
                            name: 'rate',
                        },
                    ],
                },
                {
                    function: 'sum',
                    id: 'seriesagg-sum',
                    type: adapter_types_1.InfraMetricModelMetricType.series_agg,
                },
            ],
            split_mode: 'terms',
            terms_field: 'system.network.name',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfbmV0d29ya190cmFmZmljLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2hvc3QvaG9zdF9uZXR3b3JrX3RyYWZmaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsa0JBQWtCLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakcsRUFBRSxFQUFFLG9CQUFvQjtJQUN4QixRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUM1QixhQUFhLEVBQUUsWUFBWTtJQUMzQixRQUFRO0lBQ1IsVUFBVSxFQUFFLFNBQVM7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsTUFBTSxFQUFFO1FBQ047WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsMEJBQTBCO29CQUNqQyxFQUFFLEVBQUUsYUFBYTtvQkFDakIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEtBQUssRUFBRSxhQUFhO29CQUNwQixFQUFFLEVBQUUsbUJBQW1CO29CQUN2QixJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLDJCQUEyQjtvQkFDL0IsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFDO29CQUN6RSxNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDtnQkFDRDtvQkFDRSxRQUFRLEVBQUUsS0FBSztvQkFDZixFQUFFLEVBQUUsZUFBZTtvQkFDbkIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFVBQVU7aUJBQzVDO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsT0FBTztZQUNuQixXQUFXLEVBQUUscUJBQXFCO1NBQ25DO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLEtBQUssRUFBRSxjQUFjO1lBQ3JCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUseUJBQXlCO29CQUNoQyxFQUFFLEVBQUUsWUFBWTtvQkFDaEIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEtBQUssRUFBRSxZQUFZO29CQUNuQixFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLDBCQUEwQjtvQkFDOUIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxDQUFDO29CQUN4RSxNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsV0FBVztvQkFDNUMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLEtBQUssRUFBRSwwQkFBMEI7NEJBQ2pDLEVBQUUsRUFBRSxVQUFVOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLFFBQVEsRUFBRSxLQUFLO29CQUNmLEVBQUUsRUFBRSxlQUFlO29CQUNuQixJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtpQkFDNUM7YUFDRjtZQUNELFVBQVUsRUFBRSxPQUFPO1lBQ25CLFdBQVcsRUFBRSxxQkFBcUI7U0FDbkM7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaG9zdE5ldHdvcmtUcmFmZmljOiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnaG9zdE5ldHdvcmtUcmFmZmljJyxcbiAgcmVxdWlyZXM6IFsnc3lzdGVtLm5ldHdvcmsnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAndHgnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0ubmV0d29yay5vdXQuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LW5ldC1vdXQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbWF4LW5ldC1vdXQnLFxuICAgICAgICAgIGlkOiAnZGVyaXYtbWF4LW5ldC1vdXQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmRlcml2YXRpdmUsXG4gICAgICAgICAgdW5pdDogJzFzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncG9zb25seS1kZXJpdi1tYXgtbmV0LW91dCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbeyBpZDogJ3Zhci1yYXRlJywgbmFtZTogJ3JhdGUnLCBmaWVsZDogJ2Rlcml2LW1heC1uZXQtb3V0JyB9XSxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSA+IDAuMCA/IHBhcmFtcy5yYXRlIDogMC4wJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZ1bmN0aW9uOiAnc3VtJyxcbiAgICAgICAgICBpZDogJ3Nlcmllc2FnZy1zdW0nLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLnNlcmllc19hZ2csXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ3Rlcm1zJyxcbiAgICAgIHRlcm1zX2ZpZWxkOiAnc3lzdGVtLm5ldHdvcmsubmFtZScsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3J4JyxcbiAgICAgIGxhYmVsOiAnSW5ib3VuZCAoUlgpJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLm5ldHdvcmsuaW4uYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LW5ldC1pbicsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdtYXgtbmV0LWluJyxcbiAgICAgICAgICBpZDogJ2Rlcml2LW1heC1uZXQtaW4nLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmRlcml2YXRpdmUsXG4gICAgICAgICAgdW5pdDogJzFzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncG9zb25seS1kZXJpdi1tYXgtbmV0LWluJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFt7IGlkOiAndmFyLXJhdGUnLCBuYW1lOiAncmF0ZScsIGZpZWxkOiAnZGVyaXYtbWF4LW5ldC1pbicgfV0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgPiAwLjAgPyBwYXJhbXMucmF0ZSA6IDAuMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtaW52ZXJ0LXJhdGUnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5yYXRlICogLTEnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ3Bvc29ubHktZGVyaXYtbWF4LW5ldC1pbicsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXJhdGUnLFxuICAgICAgICAgICAgICBuYW1lOiAncmF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmdW5jdGlvbjogJ3N1bScsXG4gICAgICAgICAgaWQ6ICdzZXJpZXNhZ2ctc3VtJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5zZXJpZXNfYWdnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICd0ZXJtcycsXG4gICAgICB0ZXJtc19maWVsZDogJ3N5c3RlbS5uZXR3b3JrLm5hbWUnLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==