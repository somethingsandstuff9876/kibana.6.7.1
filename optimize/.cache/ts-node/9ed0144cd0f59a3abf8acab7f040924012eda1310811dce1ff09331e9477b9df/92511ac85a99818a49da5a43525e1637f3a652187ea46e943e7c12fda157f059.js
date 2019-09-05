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
exports.createTagRemovalsRoute = (libs) => ({
    method: 'POST',
    path: '/api/beats/agents_tags/removals',
    licenseRequired: security_1.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin'],
    config: {
        validate: {
            payload: joi_1.default.object({
                removals: joi_1.default.array().items(joi_1.default.object({
                    beatId: joi_1.default.string().required(),
                    tag: joi_1.default.string().required(),
                })),
            }).required(),
        },
    },
    handler: async (request) => {
        const { removals } = request.payload;
        try {
            const response = await libs.beats.removeTagsFromBeats(request.user, removals);
            return response;
        }
        catch (err) {
            // TODO move this to kibana route thing in adapter
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvdGFnX3JlbW92YWwudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvc2VydmVyL3Jlc3RfYXBpL2JlYXRzL3RhZ19yZW1vdmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzREFBc0I7QUFDdEIsaUVBQXVFO0FBR3ZFLCtEQUF5RDtBQUV6RCxzRkFBc0Y7QUFDekUsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0QsTUFBTSxFQUFFLE1BQU07SUFDZCxJQUFJLEVBQUUsaUNBQWlDO0lBQ3ZDLGVBQWUsRUFBRSw0QkFBaUI7SUFDbEMsYUFBYSxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQzlCLE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNsQixRQUFRLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FDekIsYUFBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxNQUFNLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtvQkFDL0IsR0FBRyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7aUJBQzdCLENBQUMsQ0FDSDthQUNGLENBQUMsQ0FBQyxRQUFRLEVBQUU7U0FDZDtLQUNGO0lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDM0MsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFckMsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlFLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixrREFBa0Q7WUFDbEQsT0FBTyw0QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IFJFUVVJUkVEX0xJQ0VOU0VTIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2NvbnN0YW50cy9zZWN1cml0eSc7XG5pbXBvcnQgeyBGcmFtZXdvcmtSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IENNU2VydmVyTGlicyB9IGZyb20gJy4uLy4uL2xpYi90eXBlcyc7XG5pbXBvcnQgeyB3cmFwRXNFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL2Vycm9yX3dyYXBwZXJzJztcblxuLy8gVE9ETzogd3JpdGUgdG8gS2liYW5hIGF1ZGl0IGxvZyBmaWxlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGFzdGljL2tpYmFuYS9pc3N1ZXMvMjYwMjRcbmV4cG9ydCBjb25zdCBjcmVhdGVUYWdSZW1vdmFsc1JvdXRlID0gKGxpYnM6IENNU2VydmVyTGlicykgPT4gKHtcbiAgbWV0aG9kOiAnUE9TVCcsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL2FnZW50c190YWdzL3JlbW92YWxzJyxcbiAgbGljZW5zZVJlcXVpcmVkOiBSRVFVSVJFRF9MSUNFTlNFUyxcbiAgcmVxdWlyZWRSb2xlczogWydiZWF0c19hZG1pbiddLFxuICBjb25maWc6IHtcbiAgICB2YWxpZGF0ZToge1xuICAgICAgcGF5bG9hZDogSm9pLm9iamVjdCh7XG4gICAgICAgIHJlbW92YWxzOiBKb2kuYXJyYXkoKS5pdGVtcyhcbiAgICAgICAgICBKb2kub2JqZWN0KHtcbiAgICAgICAgICAgIGJlYXRJZDogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgICAgICB0YWc6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgICB9KS5yZXF1aXJlZCgpLFxuICAgIH0sXG4gIH0sXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBGcmFtZXdvcmtSZXF1ZXN0KSA9PiB7XG4gICAgY29uc3QgeyByZW1vdmFscyB9ID0gcmVxdWVzdC5wYXlsb2FkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbGlicy5iZWF0cy5yZW1vdmVUYWdzRnJvbUJlYXRzKHJlcXVlc3QudXNlciwgcmVtb3ZhbHMpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gVE9ETyBtb3ZlIHRoaXMgdG8ga2liYW5hIHJvdXRlIHRoaW5nIGluIGFkYXB0ZXJcbiAgICAgIHJldHVybiB3cmFwRXNFcnJvcihlcnIpO1xuICAgIH1cbiAgfSxcbn0pO1xuIl19