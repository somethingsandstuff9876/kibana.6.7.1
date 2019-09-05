"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const joi_1 = tslib_1.__importDefault(require("joi"));
const lodash_1 = require("lodash");
const security_1 = require("../../../common/constants/security");
const types_1 = require("../../lib/types");
const error_wrappers_1 = require("../../utils/error_wrappers");
// TODO: write to Kibana audit log file https://github.com/elastic/kibana/issues/26024
exports.createBeatEnrollmentRoute = (libs) => ({
    method: 'POST',
    path: '/api/beats/agent/{beatId}',
    licenseRequired: security_1.REQUIRED_LICENSES,
    config: {
        auth: false,
        validate: {
            headers: joi_1.default.object({
                'kbn-beats-enrollment-token': joi_1.default.string().required(),
            }).options({
                allowUnknown: true,
            }),
            payload: joi_1.default.object({
                host_name: joi_1.default.string().required(),
                name: joi_1.default.string().required(),
                type: joi_1.default.string().required(),
                version: joi_1.default.string().required(),
            }).required(),
        },
    },
    handler: async (request, h) => {
        const { beatId } = request.params;
        const enrollmentToken = request.headers['kbn-beats-enrollment-token'];
        try {
            const { status, accessToken } = await libs.beats.enrollBeat(enrollmentToken, beatId, request.info.remoteAddress, lodash_1.omit(request.payload, 'enrollment_token'));
            switch (status) {
                case types_1.BeatEnrollmentStatus.ExpiredEnrollmentToken:
                    return h
                        .response({
                        message: types_1.BeatEnrollmentStatus.ExpiredEnrollmentToken,
                    })
                        .code(400);
                case types_1.BeatEnrollmentStatus.InvalidEnrollmentToken:
                    return h
                        .response({
                        message: types_1.BeatEnrollmentStatus.InvalidEnrollmentToken,
                    })
                        .code(400);
                case types_1.BeatEnrollmentStatus.Success:
                default:
                    return h.response({ access_token: accessToken }).code(201);
            }
        }
        catch (err) {
            // FIXME move this to kibana route thing in adapter
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvZW5yb2xsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9yZXN0X2FwaS9iZWF0cy9lbnJvbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7R0FJRztBQUNILHNEQUFzQjtBQUN0QixtQ0FBOEI7QUFDOUIsaUVBQXVFO0FBRXZFLDJDQUFxRTtBQUNyRSwrREFBeUQ7QUFFekQsc0ZBQXNGO0FBQ3pFLFFBQUEseUJBQXlCLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sRUFBRSxNQUFNO0lBQ2QsSUFBSSxFQUFFLDJCQUEyQjtJQUNqQyxlQUFlLEVBQUUsNEJBQWlCO0lBQ2xDLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxLQUFLO1FBQ1gsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLDRCQUE0QixFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDdEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDVCxZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDO1lBQ0YsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLFNBQVMsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxJQUFJLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtnQkFDN0IsSUFBSSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQzdCLE9BQU8sRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2FBQ2pDLENBQUMsQ0FBQyxRQUFRLEVBQUU7U0FDZDtLQUNGO0lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUF5QixFQUFFLENBQU0sRUFBRSxFQUFFO1FBQ25ELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUV0RSxJQUFJO1lBQ0YsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUN6RCxlQUFlLEVBQ2YsTUFBTSxFQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUMxQixhQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxDQUMxQyxDQUFDO1lBRUYsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyw0QkFBb0IsQ0FBQyxzQkFBc0I7b0JBQzlDLE9BQU8sQ0FBQzt5QkFDTCxRQUFRLENBQUM7d0JBQ1IsT0FBTyxFQUFFLDRCQUFvQixDQUFDLHNCQUFzQjtxQkFDckQsQ0FBQzt5QkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsS0FBSyw0QkFBb0IsQ0FBQyxzQkFBc0I7b0JBQzlDLE9BQU8sQ0FBQzt5QkFDTCxRQUFRLENBQUM7d0JBQ1IsT0FBTyxFQUFFLDRCQUFvQixDQUFDLHNCQUFzQjtxQkFDckQsQ0FBQzt5QkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsS0FBSyw0QkFBb0IsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDO29CQUNFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM5RDtTQUNGO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixtREFBbUQ7WUFDbkQsT0FBTyw0QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBvbWl0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFJFUVVJUkVEX0xJQ0VOU0VTIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2NvbnN0YW50cy9zZWN1cml0eSc7XG5pbXBvcnQgeyBGcmFtZXdvcmtSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IEJlYXRFbnJvbGxtZW50U3RhdHVzLCBDTVNlcnZlckxpYnMgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgd3JhcEVzRXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9lcnJvcl93cmFwcGVycyc7XG5cbi8vIFRPRE86IHdyaXRlIHRvIEtpYmFuYSBhdWRpdCBsb2cgZmlsZSBodHRwczovL2dpdGh1Yi5jb20vZWxhc3RpYy9raWJhbmEvaXNzdWVzLzI2MDI0XG5leHBvcnQgY29uc3QgY3JlYXRlQmVhdEVucm9sbG1lbnRSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ1BPU1QnLFxuICBwYXRoOiAnL2FwaS9iZWF0cy9hZ2VudC97YmVhdElkfScsXG4gIGxpY2Vuc2VSZXF1aXJlZDogUkVRVUlSRURfTElDRU5TRVMsXG4gIGNvbmZpZzoge1xuICAgIGF1dGg6IGZhbHNlLFxuICAgIHZhbGlkYXRlOiB7XG4gICAgICBoZWFkZXJzOiBKb2kub2JqZWN0KHtcbiAgICAgICAgJ2tibi1iZWF0cy1lbnJvbGxtZW50LXRva2VuJzogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICB9KS5vcHRpb25zKHtcbiAgICAgICAgYWxsb3dVbmtub3duOiB0cnVlLFxuICAgICAgfSksXG4gICAgICBwYXlsb2FkOiBKb2kub2JqZWN0KHtcbiAgICAgICAgaG9zdF9uYW1lOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgICAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgIHR5cGU6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICAgICAgICB2ZXJzaW9uOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgIH0pLnJlcXVpcmVkKCksXG4gICAgfSxcbiAgfSxcbiAgaGFuZGxlcjogYXN5bmMgKHJlcXVlc3Q6IEZyYW1ld29ya1JlcXVlc3QsIGg6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgYmVhdElkIH0gPSByZXF1ZXN0LnBhcmFtcztcbiAgICBjb25zdCBlbnJvbGxtZW50VG9rZW4gPSByZXF1ZXN0LmhlYWRlcnNbJ2tibi1iZWF0cy1lbnJvbGxtZW50LXRva2VuJ107XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzdGF0dXMsIGFjY2Vzc1Rva2VuIH0gPSBhd2FpdCBsaWJzLmJlYXRzLmVucm9sbEJlYXQoXG4gICAgICAgIGVucm9sbG1lbnRUb2tlbixcbiAgICAgICAgYmVhdElkLFxuICAgICAgICByZXF1ZXN0LmluZm8ucmVtb3RlQWRkcmVzcyxcbiAgICAgICAgb21pdChyZXF1ZXN0LnBheWxvYWQsICdlbnJvbGxtZW50X3Rva2VuJylcbiAgICAgICk7XG5cbiAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgQmVhdEVucm9sbG1lbnRTdGF0dXMuRXhwaXJlZEVucm9sbG1lbnRUb2tlbjpcbiAgICAgICAgICByZXR1cm4gaFxuICAgICAgICAgICAgLnJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogQmVhdEVucm9sbG1lbnRTdGF0dXMuRXhwaXJlZEVucm9sbG1lbnRUb2tlbixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY29kZSg0MDApO1xuICAgICAgICBjYXNlIEJlYXRFbnJvbGxtZW50U3RhdHVzLkludmFsaWRFbnJvbGxtZW50VG9rZW46XG4gICAgICAgICAgcmV0dXJuIGhcbiAgICAgICAgICAgIC5yZXNwb25zZSh7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IEJlYXRFbnJvbGxtZW50U3RhdHVzLkludmFsaWRFbnJvbGxtZW50VG9rZW4sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvZGUoNDAwKTtcbiAgICAgICAgY2FzZSBCZWF0RW5yb2xsbWVudFN0YXR1cy5TdWNjZXNzOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBoLnJlc3BvbnNlKHsgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbiB9KS5jb2RlKDIwMSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBGSVhNRSBtb3ZlIHRoaXMgdG8ga2liYW5hIHJvdXRlIHRoaW5nIGluIGFkYXB0ZXJcbiAgICAgIHJldHVybiB3cmFwRXNFcnJvcihlcnIpO1xuICAgIH1cbiAgfSxcbn0pO1xuIl19