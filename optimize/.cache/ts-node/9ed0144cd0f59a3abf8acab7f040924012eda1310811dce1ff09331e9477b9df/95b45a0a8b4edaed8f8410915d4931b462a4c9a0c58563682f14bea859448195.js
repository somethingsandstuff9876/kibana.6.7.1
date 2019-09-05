"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.createGetAllRoute = (libs) => ({
    method: 'GET',
    path: '/api/uptime/pings',
    options: {
        validate: {
            query: joi_1.default.object({
                dateRangeStart: joi_1.default.number().required(),
                dateRangeEnd: joi_1.default.number().required(),
                monitorId: joi_1.default.string(),
                size: joi_1.default.number(),
                sort: joi_1.default.string(),
                status: joi_1.default.string(),
            }),
        },
    },
    handler: async (request) => {
        const { size, sort, dateRangeStart, dateRangeEnd, monitorId, status } = request.query;
        return await libs.pings.getAll(request, dateRangeStart, dateRangeEnd, monitorId, status, sort, size);
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9yZXN0X2FwaS9waW5ncy9nZXRfYWxsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cHRpbWUvc2VydmVyL3Jlc3RfYXBpL3BpbmdzL2dldF9hbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHNEQUFzQjtBQUlULFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixPQUFPLEVBQUU7UUFDUCxRQUFRLEVBQUU7WUFDUixLQUFLLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztnQkFDaEIsY0FBYyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZDLFlBQVksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2dCQUNyQyxTQUFTLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsSUFBSSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2dCQUNsQixNQUFNLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTthQUNyQixDQUFDO1NBQ0g7S0FDRjtJQUNELE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBWSxFQUF3QixFQUFFO1FBQ3BELE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdEYsT0FBTyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUM1QixPQUFPLEVBQ1AsY0FBYyxFQUNkLFlBQVksRUFDWixTQUFTLEVBQ1QsTUFBTSxFQUNOLElBQUksRUFDSixJQUFJLENBQ0wsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBQaW5nUmVzdWx0cyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9ncmFwaHFsL3R5cGVzJztcbmltcG9ydCB7IFVNU2VydmVyTGlicyB9IGZyb20gJy4uLy4uL2xpYi9saWInO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlR2V0QWxsUm91dGUgPSAobGliczogVU1TZXJ2ZXJMaWJzKSA9PiAoe1xuICBtZXRob2Q6ICdHRVQnLFxuICBwYXRoOiAnL2FwaS91cHRpbWUvcGluZ3MnLFxuICBvcHRpb25zOiB7XG4gICAgdmFsaWRhdGU6IHtcbiAgICAgIHF1ZXJ5OiBKb2kub2JqZWN0KHtcbiAgICAgICAgZGF0ZVJhbmdlU3RhcnQ6IEpvaS5udW1iZXIoKS5yZXF1aXJlZCgpLFxuICAgICAgICBkYXRlUmFuZ2VFbmQ6IEpvaS5udW1iZXIoKS5yZXF1aXJlZCgpLFxuICAgICAgICBtb25pdG9ySWQ6IEpvaS5zdHJpbmcoKSxcbiAgICAgICAgc2l6ZTogSm9pLm51bWJlcigpLFxuICAgICAgICBzb3J0OiBKb2kuc3RyaW5nKCksXG4gICAgICAgIHN0YXR1czogSm9pLnN0cmluZygpLFxuICAgICAgfSksXG4gICAgfSxcbiAgfSxcbiAgaGFuZGxlcjogYXN5bmMgKHJlcXVlc3Q6IGFueSk6IFByb21pc2U8UGluZ1Jlc3VsdHM+ID0+IHtcbiAgICBjb25zdCB7IHNpemUsIHNvcnQsIGRhdGVSYW5nZVN0YXJ0LCBkYXRlUmFuZ2VFbmQsIG1vbml0b3JJZCwgc3RhdHVzIH0gPSByZXF1ZXN0LnF1ZXJ5O1xuICAgIHJldHVybiBhd2FpdCBsaWJzLnBpbmdzLmdldEFsbChcbiAgICAgIHJlcXVlc3QsXG4gICAgICBkYXRlUmFuZ2VTdGFydCxcbiAgICAgIGRhdGVSYW5nZUVuZCxcbiAgICAgIG1vbml0b3JJZCxcbiAgICAgIHN0YXR1cyxcbiAgICAgIHNvcnQsXG4gICAgICBzaXplXG4gICAgKTtcbiAgfSxcbn0pO1xuIl19