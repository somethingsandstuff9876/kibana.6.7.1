"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
async function fetchLatestTime(search, indices, timeField) {
    const response = await search({
        allowNoIndices: true,
        body: {
            aggregations: {
                max_time: {
                    max: {
                        field: timeField,
                    },
                },
            },
            query: {
                match_all: {},
            },
            size: 0,
        },
        ignoreUnavailable: true,
        index: indices,
    });
    if (response.aggregations && response.aggregations.max_time) {
        return response.aggregations.max_time.value;
    }
    else {
        return 0;
    }
}
exports.fetchLatestTime = fetchLatestTime;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L2xhdGVzdF9sb2dfZW50cmllcy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L2xhdGVzdF9sb2dfZW50cmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFNSSxLQUFLLFVBQVUsZUFBZSxDQUNuQyxNQUU0RCxFQUM1RCxPQUFpQixFQUNqQixTQUFpQjtJQUVqQixNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBd0M7UUFDbkUsY0FBYyxFQUFFLElBQUk7UUFDcEIsSUFBSSxFQUFFO1lBQ0osWUFBWSxFQUFFO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixHQUFHLEVBQUU7d0JBQ0gsS0FBSyxFQUFFLFNBQVM7cUJBQ2pCO2lCQUNGO2FBQ0Y7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsU0FBUyxFQUFFLEVBQUU7YUFDZDtZQUNELElBQUksRUFBRSxDQUFDO1NBQ1I7UUFDRCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLEtBQUssRUFBRSxPQUFPO0tBQ2YsQ0FBQyxDQUFDO0lBRUgsSUFBSSxRQUFRLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO1FBQzNELE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0tBQzdDO1NBQU07UUFDTCxPQUFPLENBQUMsQ0FBQztLQUNWO0FBQ0gsQ0FBQztBQS9CRCwwQ0ErQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBTZWFyY2hQYXJhbXMgfSBmcm9tICdlbGFzdGljc2VhcmNoJztcblxuaW1wb3J0IHsgSW5mcmFEYXRhYmFzZVNlYXJjaFJlc3BvbnNlIH0gZnJvbSAnLi4vbGliL2FkYXB0ZXJzL2ZyYW1ld29yayc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaExhdGVzdFRpbWUoXG4gIHNlYXJjaDogPEhpdCwgQWdncmVnYXRpb25zPihcbiAgICBwYXJhbXM6IFNlYXJjaFBhcmFtc1xuICApID0+IFByb21pc2U8SW5mcmFEYXRhYmFzZVNlYXJjaFJlc3BvbnNlPEhpdCwgQWdncmVnYXRpb25zPj4sXG4gIGluZGljZXM6IHN0cmluZ1tdLFxuICB0aW1lRmllbGQ6IHN0cmluZ1xuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZWFyY2g8YW55LCB7IG1heF90aW1lPzogeyB2YWx1ZTogbnVtYmVyIH0gfT4oe1xuICAgIGFsbG93Tm9JbmRpY2VzOiB0cnVlLFxuICAgIGJvZHk6IHtcbiAgICAgIGFnZ3JlZ2F0aW9uczoge1xuICAgICAgICBtYXhfdGltZToge1xuICAgICAgICAgIG1heDoge1xuICAgICAgICAgICAgZmllbGQ6IHRpbWVGaWVsZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIG1hdGNoX2FsbDoge30sXG4gICAgICB9LFxuICAgICAgc2l6ZTogMCxcbiAgICB9LFxuICAgIGlnbm9yZVVuYXZhaWxhYmxlOiB0cnVlLFxuICAgIGluZGV4OiBpbmRpY2VzLFxuICB9KTtcblxuICBpZiAocmVzcG9uc2UuYWdncmVnYXRpb25zICYmIHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucy5tYXhfdGltZSkge1xuICAgIHJldHVybiByZXNwb25zZS5hZ2dyZWdhdGlvbnMubWF4X3RpbWUudmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiJdfQ==