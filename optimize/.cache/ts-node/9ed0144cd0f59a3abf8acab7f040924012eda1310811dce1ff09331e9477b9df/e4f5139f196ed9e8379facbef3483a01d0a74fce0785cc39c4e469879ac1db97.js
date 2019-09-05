"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../common/constants");
async function getTrace(traceId, setup) {
    const { start, end, client, config } = setup;
    const params = {
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 1000,
            query: {
                bool: {
                    filter: [
                        { term: { [constants_1.TRACE_ID]: traceId } },
                        {
                            range: {
                                '@timestamp': {
                                    gte: start,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ]
                }
            }
        }
    };
    const resp = await client('search', params);
    return resp.hits.hits.map(hit => hit._source);
}
exports.getTrace = getTrace;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhY2VzL2dldF90cmFjZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhY2VzL2dldF90cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFHSCx5REFBcUQ7QUFPOUMsS0FBSyxVQUFVLFFBQVEsQ0FDNUIsT0FBZSxFQUNmLEtBQVk7SUFFWixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRTdDLE1BQU0sTUFBTSxHQUFpQjtRQUMzQixLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQztRQUMvQyxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUU7b0JBQ0osTUFBTSxFQUFFO3dCQUNOLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxvQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUU7d0JBQ2pDOzRCQUNFLEtBQUssRUFBRTtnQ0FDTCxZQUFZLEVBQUU7b0NBQ1osR0FBRyxFQUFFLEtBQUs7b0NBQ1YsR0FBRyxFQUFFLEdBQUc7b0NBQ1IsTUFBTSxFQUFFLGNBQWM7aUNBQ3ZCOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBcUIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUEvQkQsNEJBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgU2VhcmNoUGFyYW1zIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBUUkFDRV9JRCB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgU3BhbiB9IGZyb20gJy4uLy4uLy4uL3R5cGluZ3MvZXNfc2NoZW1hcy9TcGFuJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwaW5ncy9lc19zY2hlbWFzL1RyYW5zYWN0aW9uJztcbmltcG9ydCB7IFNldHVwIH0gZnJvbSAnLi4vaGVscGVycy9zZXR1cF9yZXF1ZXN0JztcblxuZXhwb3J0IHR5cGUgVHJhY2VBUElSZXNwb25zZSA9IEFycmF5PFRyYW5zYWN0aW9uIHwgU3Bhbj47XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRUcmFjZShcbiAgdHJhY2VJZDogc3RyaW5nLFxuICBzZXR1cDogU2V0dXBcbik6IFByb21pc2U8VHJhY2VBUElSZXNwb25zZT4ge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQsIGNsaWVudCwgY29uZmlnIH0gPSBzZXR1cDtcblxuICBjb25zdCBwYXJhbXM6IFNlYXJjaFBhcmFtcyA9IHtcbiAgICBpbmRleDogY29uZmlnLmdldCgnYXBtX29zcy50cmFuc2FjdGlvbkluZGljZXMnKSxcbiAgICBib2R5OiB7XG4gICAgICBzaXplOiAxMDAwLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAgeyB0ZXJtOiB7IFtUUkFDRV9JRF06IHRyYWNlSWQgfSB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgICAgICAgICAgZ3RlOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgIGx0ZTogZW5kLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZXNwID0gYXdhaXQgY2xpZW50PFNwYW4gfCBUcmFuc2FjdGlvbj4oJ3NlYXJjaCcsIHBhcmFtcyk7XG4gIHJldHVybiByZXNwLmhpdHMuaGl0cy5tYXAoaGl0ID0+IGhpdC5fc291cmNlKTtcbn1cbiJdfQ==