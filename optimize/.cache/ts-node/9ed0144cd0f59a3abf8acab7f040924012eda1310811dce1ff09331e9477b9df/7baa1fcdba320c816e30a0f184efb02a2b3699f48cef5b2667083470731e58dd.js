"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const error_wrappers_1 = require("../../utils/error_wrappers");
exports.createGetBeatRoute = (libs) => ({
    method: 'GET',
    path: '/api/beats/agent/{beatId}/{token?}',
    requiredRoles: ['beats_admin'],
    handler: async (request, h) => {
        const beatId = request.params.beatId;
        let beat;
        if (beatId === 'unknown') {
            try {
                beat = await libs.beats.getByEnrollmentToken(request.user, request.params.token);
                if (beat === null) {
                    return h.response().code(200);
                }
            }
            catch (err) {
                return error_wrappers_1.wrapEsError(err);
            }
        }
        else {
            try {
                beat = await libs.beats.getById(request.user, beatId);
                if (beat === null) {
                    return h.response({ message: 'Beat not found' }).code(404);
                }
            }
            catch (err) {
                return error_wrappers_1.wrapEsError(err);
            }
        }
        delete beat.access_token;
        return beat;
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvZ2V0LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9yZXN0X2FwaS9iZWF0cy9nZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBSUgsK0RBQXlEO0FBRTVDLFFBQUEsa0JBQWtCLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLG9DQUFvQztJQUMxQyxhQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDOUIsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFZLEVBQUUsQ0FBTSxFQUFFLEVBQUU7UUFDdEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFckMsSUFBSSxJQUFtQixDQUFDO1FBQ3hCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUN4QixJQUFJO2dCQUNGLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqRixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7b0JBQ2pCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDL0I7YUFDRjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sNEJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtTQUNGO2FBQU07WUFDTCxJQUFJO2dCQUNGLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3RELElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDakIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzVEO2FBQ0Y7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixPQUFPLDRCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDekI7U0FDRjtRQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztRQUV6QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDTUJlYXQgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vZG9tYWluX3R5cGVzJztcbmltcG9ydCB7IENNU2VydmVyTGlicyB9IGZyb20gJy4uLy4uL2xpYi90eXBlcyc7XG5pbXBvcnQgeyB3cmFwRXNFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL2Vycm9yX3dyYXBwZXJzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUdldEJlYXRSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ0dFVCcsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL2FnZW50L3tiZWF0SWR9L3t0b2tlbj99JyxcbiAgcmVxdWlyZWRSb2xlczogWydiZWF0c19hZG1pbiddLFxuICBoYW5kbGVyOiBhc3luYyAocmVxdWVzdDogYW55LCBoOiBhbnkpID0+IHtcbiAgICBjb25zdCBiZWF0SWQgPSByZXF1ZXN0LnBhcmFtcy5iZWF0SWQ7XG5cbiAgICBsZXQgYmVhdDogQ01CZWF0IHwgbnVsbDtcbiAgICBpZiAoYmVhdElkID09PSAndW5rbm93bicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJlYXQgPSBhd2FpdCBsaWJzLmJlYXRzLmdldEJ5RW5yb2xsbWVudFRva2VuKHJlcXVlc3QudXNlciwgcmVxdWVzdC5wYXJhbXMudG9rZW4pO1xuICAgICAgICBpZiAoYmVhdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBoLnJlc3BvbnNlKCkuY29kZSgyMDApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHdyYXBFc0Vycm9yKGVycik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJlYXQgPSBhd2FpdCBsaWJzLmJlYXRzLmdldEJ5SWQocmVxdWVzdC51c2VyLCBiZWF0SWQpO1xuICAgICAgICBpZiAoYmVhdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBoLnJlc3BvbnNlKHsgbWVzc2FnZTogJ0JlYXQgbm90IGZvdW5kJyB9KS5jb2RlKDQwNCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gd3JhcEVzRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGUgYmVhdC5hY2Nlc3NfdG9rZW47XG5cbiAgICByZXR1cm4gYmVhdDtcbiAgfSxcbn0pO1xuIl19