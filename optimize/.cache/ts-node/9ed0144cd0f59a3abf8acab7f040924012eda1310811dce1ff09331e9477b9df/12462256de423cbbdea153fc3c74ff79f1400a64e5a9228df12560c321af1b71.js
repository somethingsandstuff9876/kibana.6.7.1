"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const joi_1 = tslib_1.__importDefault(require("joi"));
const error_wrappers_1 = require("../../utils/error_wrappers");
exports.beatEventsRoute = (libs) => ({
    method: 'POST',
    path: '/api/beats/{beatId}/events',
    config: {
        validate: {
            headers: joi_1.default.object({
                'kbn-beats-access-token': joi_1.default.string().required(),
            }).options({ allowUnknown: true }),
        },
        auth: false,
    },
    handler: async (request, h) => {
        const beatId = request.params.beatId;
        const events = request.payload;
        const accessToken = request.headers['kbn-beats-access-token'];
        try {
            const beat = await libs.beats.getById(libs.framework.internalUser, beatId);
            if (beat === null) {
                return h.response({ message: `Beat "${beatId}" not found` }).code(400);
            }
            const isAccessTokenValid = beat.access_token === accessToken;
            if (!isAccessTokenValid) {
                return h.response({ message: 'Invalid access token' }).code(401);
            }
            const results = await libs.beatEvents.log(libs.framework.internalUser, beat.id, events);
            return {
                response: results,
            };
        }
        catch (err) {
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvZXZlbnRzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9yZXN0X2FwaS9iZWF0cy9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7R0FJRztBQUNILHNEQUFzQjtBQUV0QiwrREFBeUQ7QUFFNUMsUUFBQSxlQUFlLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sRUFBRSxNQUFNO0lBQ2QsSUFBSSxFQUFFLDRCQUE0QjtJQUNsQyxNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztnQkFDbEIsd0JBQXdCLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTthQUNsRCxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxFQUFFLEtBQUs7S0FDWjtJQUNELE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBWSxFQUFFLENBQU0sRUFBRSxFQUFFO1FBQ3RDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBRTlELElBQUk7WUFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDakIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsTUFBTSxhQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4RTtZQUVELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFlBQVksS0FBSyxXQUFXLENBQUM7WUFDN0QsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUN2QixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsRTtZQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV4RixPQUFPO2dCQUNMLFFBQVEsRUFBRSxPQUFPO2FBQ2xCLENBQUM7U0FDSDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyw0QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBDTVNlcnZlckxpYnMgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgd3JhcEVzRXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9lcnJvcl93cmFwcGVycyc7XG5cbmV4cG9ydCBjb25zdCBiZWF0RXZlbnRzUm91dGUgPSAobGliczogQ01TZXJ2ZXJMaWJzKSA9PiAoe1xuICBtZXRob2Q6ICdQT1NUJyxcbiAgcGF0aDogJy9hcGkvYmVhdHMve2JlYXRJZH0vZXZlbnRzJyxcbiAgY29uZmlnOiB7XG4gICAgdmFsaWRhdGU6IHtcbiAgICAgIGhlYWRlcnM6IEpvaS5vYmplY3Qoe1xuICAgICAgICAna2JuLWJlYXRzLWFjY2Vzcy10b2tlbic6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICAgICAgfSkub3B0aW9ucyh7IGFsbG93VW5rbm93bjogdHJ1ZSB9KSxcbiAgICB9LFxuICAgIGF1dGg6IGZhbHNlLFxuICB9LFxuICBoYW5kbGVyOiBhc3luYyAocmVxdWVzdDogYW55LCBoOiBhbnkpID0+IHtcbiAgICBjb25zdCBiZWF0SWQgPSByZXF1ZXN0LnBhcmFtcy5iZWF0SWQ7XG4gICAgY29uc3QgZXZlbnRzID0gcmVxdWVzdC5wYXlsb2FkO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxdWVzdC5oZWFkZXJzWydrYm4tYmVhdHMtYWNjZXNzLXRva2VuJ107XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgYmVhdCA9IGF3YWl0IGxpYnMuYmVhdHMuZ2V0QnlJZChsaWJzLmZyYW1ld29yay5pbnRlcm5hbFVzZXIsIGJlYXRJZCk7XG4gICAgICBpZiAoYmVhdCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gaC5yZXNwb25zZSh7IG1lc3NhZ2U6IGBCZWF0IFwiJHtiZWF0SWR9XCIgbm90IGZvdW5kYCB9KS5jb2RlKDQwMCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzQWNjZXNzVG9rZW5WYWxpZCA9IGJlYXQuYWNjZXNzX3Rva2VuID09PSBhY2Nlc3NUb2tlbjtcbiAgICAgIGlmICghaXNBY2Nlc3NUb2tlblZhbGlkKSB7XG4gICAgICAgIHJldHVybiBoLnJlc3BvbnNlKHsgbWVzc2FnZTogJ0ludmFsaWQgYWNjZXNzIHRva2VuJyB9KS5jb2RlKDQwMSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBsaWJzLmJlYXRFdmVudHMubG9nKGxpYnMuZnJhbWV3b3JrLmludGVybmFsVXNlciwgYmVhdC5pZCwgZXZlbnRzKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzcG9uc2U6IHJlc3VsdHMsXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHdyYXBFc0Vycm9yKGVycik7XG4gICAgfVxuICB9LFxufSk7XG4iXX0=