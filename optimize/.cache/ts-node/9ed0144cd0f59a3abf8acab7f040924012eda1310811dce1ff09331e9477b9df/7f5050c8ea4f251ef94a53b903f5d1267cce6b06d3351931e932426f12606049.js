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
// TODO: write to Kibana audit log file (include who did the verification as well) https://github.com/elastic/kibana/issues/26024
exports.createBeatUpdateRoute = (libs) => ({
    method: 'PUT',
    path: '/api/beats/agent/{beatId}',
    licenseRequired: security_1.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin'],
    config: {
        validate: {
            headers: joi_1.default.object({
                'kbn-beats-access-token': joi_1.default.string(),
            }).options({
                allowUnknown: true,
            }),
            params: joi_1.default.object({
                beatId: joi_1.default.string(),
            }),
            payload: joi_1.default.object({
                active: joi_1.default.bool(),
                ephemeral_id: joi_1.default.string(),
                host_name: joi_1.default.string(),
                local_configuration_yml: joi_1.default.string(),
                metadata: joi_1.default.object(),
                name: joi_1.default.string(),
                type: joi_1.default.string(),
                version: joi_1.default.string(),
            }),
        },
    },
    handler: async (request, h) => {
        const { beatId } = request.params;
        const accessToken = request.headers['kbn-beats-access-token'];
        const remoteAddress = request.info.remoteAddress;
        const userOrToken = accessToken || request.user;
        if (request.user.kind === 'unauthenticated' && request.payload.active !== undefined) {
            return h
                .response({ message: 'access-token is not a valid auth type to change beat status' })
                .code(401);
        }
        try {
            const status = await libs.beats.update(userOrToken, beatId, {
                ...request.payload,
                host_ip: remoteAddress,
            });
            switch (status) {
                case 'beat-not-found':
                    return h.response({ message: 'Beat not found', success: false }).code(404);
                case 'invalid-access-token':
                    return h.response({ message: 'Invalid access token', success: false }).code(401);
            }
            return h.response({ success: true }).code(204);
        }
        catch (err) {
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvdXBkYXRlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9yZXN0X2FwaS9iZWF0cy91cGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHNEQUFzQjtBQUN0QixpRUFBdUU7QUFHdkUsK0RBQXlEO0FBRXpELGlJQUFpSTtBQUNwSCxRQUFBLHFCQUFxQixHQUFHLENBQUMsSUFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RCxNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSwyQkFBMkI7SUFDakMsZUFBZSxFQUFFLDRCQUFpQjtJQUNsQyxhQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDOUIsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLHdCQUF3QixFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7YUFDdkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDVCxZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDO1lBQ0YsTUFBTSxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pCLE1BQU0sRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2FBQ3JCLENBQUM7WUFDRixPQUFPLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztnQkFDbEIsTUFBTSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xCLFlBQVksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2dCQUMxQixTQUFTLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsdUJBQXVCLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtnQkFDckMsUUFBUSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3RCLElBQUksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2dCQUNsQixJQUFJLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtnQkFDbEIsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7YUFDdEIsQ0FBQztTQUNIO0tBQ0Y7SUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQXlCLEVBQUUsQ0FBTSxFQUFFLEVBQUU7UUFDbkQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDbEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzlELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ2pELE1BQU0sV0FBVyxHQUFHLFdBQVcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRWhELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQWlCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ25GLE9BQU8sQ0FBQztpQkFDTCxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsNkRBQTZELEVBQUUsQ0FBQztpQkFDcEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7UUFFRCxJQUFJO1lBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFO2dCQUMxRCxHQUFHLE9BQU8sQ0FBQyxPQUFPO2dCQUNsQixPQUFPLEVBQUUsYUFBYTthQUN2QixDQUFDLENBQUM7WUFFSCxRQUFRLE1BQU0sRUFBRTtnQkFDZCxLQUFLLGdCQUFnQjtvQkFDbkIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0UsS0FBSyxzQkFBc0I7b0JBQ3pCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEY7WUFFRCxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sNEJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMvc2VjdXJpdHknO1xuaW1wb3J0IHsgRnJhbWV3b3JrUmVxdWVzdCB9IGZyb20gJy4uLy4uL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsvYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBDTVNlcnZlckxpYnMgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgd3JhcEVzRXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9lcnJvcl93cmFwcGVycyc7XG5cbi8vIFRPRE86IHdyaXRlIHRvIEtpYmFuYSBhdWRpdCBsb2cgZmlsZSAoaW5jbHVkZSB3aG8gZGlkIHRoZSB2ZXJpZmljYXRpb24gYXMgd2VsbCkgaHR0cHM6Ly9naXRodWIuY29tL2VsYXN0aWMva2liYW5hL2lzc3Vlcy8yNjAyNFxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJlYXRVcGRhdGVSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ1BVVCcsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL2FnZW50L3tiZWF0SWR9JyxcbiAgbGljZW5zZVJlcXVpcmVkOiBSRVFVSVJFRF9MSUNFTlNFUyxcbiAgcmVxdWlyZWRSb2xlczogWydiZWF0c19hZG1pbiddLFxuICBjb25maWc6IHtcbiAgICB2YWxpZGF0ZToge1xuICAgICAgaGVhZGVyczogSm9pLm9iamVjdCh7XG4gICAgICAgICdrYm4tYmVhdHMtYWNjZXNzLXRva2VuJzogSm9pLnN0cmluZygpLFxuICAgICAgfSkub3B0aW9ucyh7XG4gICAgICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICAgcGFyYW1zOiBKb2kub2JqZWN0KHtcbiAgICAgICAgYmVhdElkOiBKb2kuc3RyaW5nKCksXG4gICAgICB9KSxcbiAgICAgIHBheWxvYWQ6IEpvaS5vYmplY3Qoe1xuICAgICAgICBhY3RpdmU6IEpvaS5ib29sKCksXG4gICAgICAgIGVwaGVtZXJhbF9pZDogSm9pLnN0cmluZygpLFxuICAgICAgICBob3N0X25hbWU6IEpvaS5zdHJpbmcoKSxcbiAgICAgICAgbG9jYWxfY29uZmlndXJhdGlvbl95bWw6IEpvaS5zdHJpbmcoKSxcbiAgICAgICAgbWV0YWRhdGE6IEpvaS5vYmplY3QoKSxcbiAgICAgICAgbmFtZTogSm9pLnN0cmluZygpLFxuICAgICAgICB0eXBlOiBKb2kuc3RyaW5nKCksXG4gICAgICAgIHZlcnNpb246IEpvaS5zdHJpbmcoKSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0sXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBGcmFtZXdvcmtSZXF1ZXN0LCBoOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IGJlYXRJZCB9ID0gcmVxdWVzdC5wYXJhbXM7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXF1ZXN0LmhlYWRlcnNbJ2tibi1iZWF0cy1hY2Nlc3MtdG9rZW4nXTtcbiAgICBjb25zdCByZW1vdGVBZGRyZXNzID0gcmVxdWVzdC5pbmZvLnJlbW90ZUFkZHJlc3M7XG4gICAgY29uc3QgdXNlck9yVG9rZW4gPSBhY2Nlc3NUb2tlbiB8fCByZXF1ZXN0LnVzZXI7XG5cbiAgICBpZiAocmVxdWVzdC51c2VyLmtpbmQgPT09ICd1bmF1dGhlbnRpY2F0ZWQnICYmIHJlcXVlc3QucGF5bG9hZC5hY3RpdmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhcbiAgICAgICAgLnJlc3BvbnNlKHsgbWVzc2FnZTogJ2FjY2Vzcy10b2tlbiBpcyBub3QgYSB2YWxpZCBhdXRoIHR5cGUgdG8gY2hhbmdlIGJlYXQgc3RhdHVzJyB9KVxuICAgICAgICAuY29kZSg0MDEpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBsaWJzLmJlYXRzLnVwZGF0ZSh1c2VyT3JUb2tlbiwgYmVhdElkLCB7XG4gICAgICAgIC4uLnJlcXVlc3QucGF5bG9hZCxcbiAgICAgICAgaG9zdF9pcDogcmVtb3RlQWRkcmVzcyxcbiAgICAgIH0pO1xuXG4gICAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgICBjYXNlICdiZWF0LW5vdC1mb3VuZCc6XG4gICAgICAgICAgcmV0dXJuIGgucmVzcG9uc2UoeyBtZXNzYWdlOiAnQmVhdCBub3QgZm91bmQnLCBzdWNjZXNzOiBmYWxzZSB9KS5jb2RlKDQwNCk7XG4gICAgICAgIGNhc2UgJ2ludmFsaWQtYWNjZXNzLXRva2VuJzpcbiAgICAgICAgICByZXR1cm4gaC5yZXNwb25zZSh7IG1lc3NhZ2U6ICdJbnZhbGlkIGFjY2VzcyB0b2tlbicsIHN1Y2Nlc3M6IGZhbHNlIH0pLmNvZGUoNDAxKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGgucmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pLmNvZGUoMjA0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB3cmFwRXNFcnJvcihlcnIpO1xuICAgIH1cbiAgfSxcbn0pO1xuIl19