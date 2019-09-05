"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const security_1 = require("../../../common/constants/security");
const error_wrappers_1 = require("../../utils/error_wrappers");
exports.createDeleteTagsWithIdsRoute = (libs) => ({
    method: 'DELETE',
    path: '/api/beats/tags/{tagIds}',
    requiredRoles: ['beats_admin'],
    licenseRequired: security_1.REQUIRED_LICENSES,
    handler: async (request) => {
        const tagIdString = request.params.tagIds;
        const tagIds = tagIdString.split(',').filter((id) => id.length > 0);
        let success;
        try {
            success = await libs.tags.delete(request.user, tagIds);
        }
        catch (err) {
            return error_wrappers_1.wrapEsError(err);
        }
        return { success };
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvdGFncy9kZWxldGUudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvc2VydmVyL3Jlc3RfYXBpL3RhZ3MvZGVsZXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILGlFQUF1RTtBQUV2RSwrREFBeUQ7QUFFNUMsUUFBQSw0QkFBNEIsR0FBRyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkUsTUFBTSxFQUFFLFFBQVE7SUFDaEIsSUFBSSxFQUFFLDBCQUEwQjtJQUNoQyxhQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDOUIsZUFBZSxFQUFFLDRCQUFpQjtJQUNsQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQVksRUFBRSxFQUFFO1FBQzlCLE1BQU0sV0FBVyxHQUFXLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xELE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTVFLElBQUksT0FBZ0IsQ0FBQztRQUNyQixJQUFJO1lBQ0YsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN4RDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyw0QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ3JCLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMvc2VjdXJpdHknO1xuaW1wb3J0IHsgQ01TZXJ2ZXJMaWJzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IHdyYXBFc0Vycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvZXJyb3Jfd3JhcHBlcnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRGVsZXRlVGFnc1dpdGhJZHNSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ0RFTEVURScsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL3RhZ3Mve3RhZ0lkc30nLFxuICByZXF1aXJlZFJvbGVzOiBbJ2JlYXRzX2FkbWluJ10sXG4gIGxpY2Vuc2VSZXF1aXJlZDogUkVRVUlSRURfTElDRU5TRVMsXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBhbnkpID0+IHtcbiAgICBjb25zdCB0YWdJZFN0cmluZzogc3RyaW5nID0gcmVxdWVzdC5wYXJhbXMudGFnSWRzO1xuICAgIGNvbnN0IHRhZ0lkcyA9IHRhZ0lkU3RyaW5nLnNwbGl0KCcsJykuZmlsdGVyKChpZDogc3RyaW5nKSA9PiBpZC5sZW5ndGggPiAwKTtcblxuICAgIGxldCBzdWNjZXNzOiBib29sZWFuO1xuICAgIHRyeSB7XG4gICAgICBzdWNjZXNzID0gYXdhaXQgbGlicy50YWdzLmRlbGV0ZShyZXF1ZXN0LnVzZXIsIHRhZ0lkcyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gd3JhcEVzRXJyb3IoZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBzdWNjZXNzIH07XG4gIH0sXG59KTtcbiJdfQ==