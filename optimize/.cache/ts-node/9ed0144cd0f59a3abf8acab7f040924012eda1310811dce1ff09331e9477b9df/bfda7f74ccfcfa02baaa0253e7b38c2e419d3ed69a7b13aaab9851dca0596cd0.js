"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const security_1 = require("../../../common/constants/security");
const error_wrappers_1 = require("../../utils/error_wrappers");
// TODO: write to Kibana audit log file https://github.com/elastic/kibana/issues/26024
exports.createTagAssignmentsRoute = (libs) => ({
    method: 'POST',
    path: '/api/beats/agents_tags/assignments',
    licenseRequired: security_1.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin'],
    config: {
        validate: {
            payload: joi_1.default.object({
                assignments: joi_1.default.array().items(joi_1.default.object({
                    beatId: joi_1.default.string().required(),
                    tag: joi_1.default.string().required(),
                })),
            }).required(),
        },
    },
    handler: async (request) => {
        const { assignments } = request.payload;
        try {
            const response = await libs.beats.assignTagsToBeats(request.user, assignments);
            return response;
        }
        catch (err) {
            // TODO move this to kibana route thing in adapter
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvdGFnX2Fzc2lnbm1lbnQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvc2VydmVyL3Jlc3RfYXBpL2JlYXRzL3RhZ19hc3NpZ25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzREFBc0I7QUFDdEIsaUVBQXVFO0FBSXZFLCtEQUF5RDtBQUV6RCxzRkFBc0Y7QUFDekUsUUFBQSx5QkFBeUIsR0FBRyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEUsTUFBTSxFQUFFLE1BQU07SUFDZCxJQUFJLEVBQUUsb0NBQW9DO0lBQzFDLGVBQWUsRUFBRSw0QkFBaUI7SUFDbEMsYUFBYSxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQzlCLE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNsQixXQUFXLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FDNUIsYUFBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxNQUFNLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtvQkFDL0IsR0FBRyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7aUJBQzdCLENBQUMsQ0FDSDthQUNGLENBQUMsQ0FBQyxRQUFRLEVBQUU7U0FDZDtLQUNGO0lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDM0MsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUEwQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBRS9FLElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMvRSxPQUFPLFFBQVEsQ0FBQztTQUNqQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osa0RBQWtEO1lBQ2xELE9BQU8sNEJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMvc2VjdXJpdHknO1xuaW1wb3J0IHsgQmVhdHNUYWdBc3NpZ25tZW50IH0gZnJvbSAnLi4vLi4vLi4vcHVibGljL2xpYi9hZGFwdGVycy9iZWF0cy9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IEZyYW1ld29ya1JlcXVlc3QgfSBmcm9tICcuLi8uLi9saWIvYWRhcHRlcnMvZnJhbWV3b3JrL2FkYXB0ZXJfdHlwZXMnO1xuaW1wb3J0IHsgQ01TZXJ2ZXJMaWJzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IHdyYXBFc0Vycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvZXJyb3Jfd3JhcHBlcnMnO1xuXG4vLyBUT0RPOiB3cml0ZSB0byBLaWJhbmEgYXVkaXQgbG9nIGZpbGUgaHR0cHM6Ly9naXRodWIuY29tL2VsYXN0aWMva2liYW5hL2lzc3Vlcy8yNjAyNFxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRhZ0Fzc2lnbm1lbnRzUm91dGUgPSAobGliczogQ01TZXJ2ZXJMaWJzKSA9PiAoe1xuICBtZXRob2Q6ICdQT1NUJyxcbiAgcGF0aDogJy9hcGkvYmVhdHMvYWdlbnRzX3RhZ3MvYXNzaWdubWVudHMnLFxuICBsaWNlbnNlUmVxdWlyZWQ6IFJFUVVJUkVEX0xJQ0VOU0VTLFxuICByZXF1aXJlZFJvbGVzOiBbJ2JlYXRzX2FkbWluJ10sXG4gIGNvbmZpZzoge1xuICAgIHZhbGlkYXRlOiB7XG4gICAgICBwYXlsb2FkOiBKb2kub2JqZWN0KHtcbiAgICAgICAgYXNzaWdubWVudHM6IEpvaS5hcnJheSgpLml0ZW1zKFxuICAgICAgICAgIEpvaS5vYmplY3Qoe1xuICAgICAgICAgICAgYmVhdElkOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgICAgICAgIHRhZzogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgIH0pLnJlcXVpcmVkKCksXG4gICAgfSxcbiAgfSxcbiAgaGFuZGxlcjogYXN5bmMgKHJlcXVlc3Q6IEZyYW1ld29ya1JlcXVlc3QpID0+IHtcbiAgICBjb25zdCB7IGFzc2lnbm1lbnRzIH06IHsgYXNzaWdubWVudHM6IEJlYXRzVGFnQXNzaWdubWVudFtdIH0gPSByZXF1ZXN0LnBheWxvYWQ7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBsaWJzLmJlYXRzLmFzc2lnblRhZ3NUb0JlYXRzKHJlcXVlc3QudXNlciwgYXNzaWdubWVudHMpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gVE9ETyBtb3ZlIHRoaXMgdG8ga2liYW5hIHJvdXRlIHRoaW5nIGluIGFkYXB0ZXJcbiAgICAgIHJldHVybiB3cmFwRXNFcnJvcihlcnIpO1xuICAgIH1cbiAgfSxcbn0pO1xuIl19