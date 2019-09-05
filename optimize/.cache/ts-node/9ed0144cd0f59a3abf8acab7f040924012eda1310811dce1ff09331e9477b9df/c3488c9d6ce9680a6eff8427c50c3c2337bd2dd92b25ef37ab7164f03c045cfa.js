"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const lodash_1 = require("lodash");
const constants_1 = require("../../../common/constants");
const error_wrappers_1 = require("../../utils/error_wrappers");
// TODO: write to Kibana audit log file
exports.createSetTagRoute = (libs) => ({
    method: 'PUT',
    path: '/api/beats/tag/{tagId}',
    licenseRequired: constants_1.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin'],
    config: {
        validate: {
            params: joi_1.default.object({
                tagId: joi_1.default.string(),
            }),
            payload: joi_1.default.object({
                color: joi_1.default.string(),
                name: joi_1.default.string(),
            }),
        },
    },
    handler: async (request) => {
        const defaultConfig = {
            id: request.params.tagId,
            name: request.params.tagId,
            color: '#DD0A73',
            hasConfigurationBlocksTypes: [],
        };
        const config = { ...defaultConfig, ...lodash_1.get(request, 'payload', {}) };
        try {
            const id = await libs.tags.upsertTag(request.user, config);
            return { success: true, id };
        }
        catch (err) {
            // TODO move this to kibana route thing in adapter
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvdGFncy9zZXQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvc2VydmVyL3Jlc3RfYXBpL3RhZ3Mvc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzREFBc0I7QUFDdEIsbUNBQTZCO0FBQzdCLHlEQUE4RDtBQUc5RCwrREFBeUQ7QUFFekQsdUNBQXVDO0FBQzFCLFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLHdCQUF3QjtJQUM5QixlQUFlLEVBQUUsNkJBQWlCO0lBQ2xDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM5QixNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUU7WUFDUixNQUFNLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztnQkFDakIsS0FBSyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7YUFDcEIsQ0FBQztZQUNGLE9BQU8sRUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNsQixLQUFLLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsSUFBSSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7YUFDbkIsQ0FBQztTQUNIO0tBQ0Y7SUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUMzQyxNQUFNLGFBQWEsR0FBRztZQUNwQixFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDMUIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsMkJBQTJCLEVBQUUsRUFBRTtTQUNoQyxDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLGFBQWEsRUFBRSxHQUFHLFlBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFFcEUsSUFBSTtZQUNGLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUUzRCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztTQUM5QjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osa0RBQWtEO1lBQ2xELE9BQU8sNEJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBnZXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUkVRVUlSRURfTElDRU5TRVMgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IEZyYW1ld29ya1JlcXVlc3QgfSBmcm9tICcuLi8uLi9saWIvYWRhcHRlcnMvZnJhbWV3b3JrL2FkYXB0ZXJfdHlwZXMnO1xuaW1wb3J0IHsgQ01TZXJ2ZXJMaWJzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IHdyYXBFc0Vycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvZXJyb3Jfd3JhcHBlcnMnO1xuXG4vLyBUT0RPOiB3cml0ZSB0byBLaWJhbmEgYXVkaXQgbG9nIGZpbGVcbmV4cG9ydCBjb25zdCBjcmVhdGVTZXRUYWdSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ1BVVCcsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL3RhZy97dGFnSWR9JyxcbiAgbGljZW5zZVJlcXVpcmVkOiBSRVFVSVJFRF9MSUNFTlNFUyxcbiAgcmVxdWlyZWRSb2xlczogWydiZWF0c19hZG1pbiddLFxuICBjb25maWc6IHtcbiAgICB2YWxpZGF0ZToge1xuICAgICAgcGFyYW1zOiBKb2kub2JqZWN0KHtcbiAgICAgICAgdGFnSWQ6IEpvaS5zdHJpbmcoKSxcbiAgICAgIH0pLFxuICAgICAgcGF5bG9hZDogSm9pLm9iamVjdCh7XG4gICAgICAgIGNvbG9yOiBKb2kuc3RyaW5nKCksXG4gICAgICAgIG5hbWU6IEpvaS5zdHJpbmcoKSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0sXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBGcmFtZXdvcmtSZXF1ZXN0KSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGlkOiByZXF1ZXN0LnBhcmFtcy50YWdJZCxcbiAgICAgIG5hbWU6IHJlcXVlc3QucGFyYW1zLnRhZ0lkLFxuICAgICAgY29sb3I6ICcjREQwQTczJyxcbiAgICAgIGhhc0NvbmZpZ3VyYXRpb25CbG9ja3NUeXBlczogW10sXG4gICAgfTtcbiAgICBjb25zdCBjb25maWcgPSB7IC4uLmRlZmF1bHRDb25maWcsIC4uLmdldChyZXF1ZXN0LCAncGF5bG9hZCcsIHt9KSB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGlkID0gYXdhaXQgbGlicy50YWdzLnVwc2VydFRhZyhyZXF1ZXN0LnVzZXIsIGNvbmZpZyk7XG5cbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGlkIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUT0RPIG1vdmUgdGhpcyB0byBraWJhbmEgcm91dGUgdGhpbmcgaW4gYWRhcHRlclxuICAgICAgcmV0dXJuIHdyYXBFc0Vycm9yKGVycik7XG4gICAgfVxuICB9LFxufSk7XG4iXX0=