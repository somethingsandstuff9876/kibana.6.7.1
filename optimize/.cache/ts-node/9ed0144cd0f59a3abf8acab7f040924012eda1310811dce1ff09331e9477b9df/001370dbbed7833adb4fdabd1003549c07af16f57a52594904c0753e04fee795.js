"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Joi = tslib_1.__importStar(require("joi"));
const security_1 = require("../../../common/constants/security");
const error_wrappers_1 = require("../../utils/error_wrappers");
exports.createListTagsRoute = (libs) => ({
    method: 'GET',
    path: '/api/beats/tags',
    requiredRoles: ['beats_admin'],
    licenseRequired: security_1.REQUIRED_LICENSES,
    validate: {
        headers: Joi.object({
            'kbn-beats-enrollment-token': Joi.string().required(),
        }).options({
            allowUnknown: true,
        }),
        query: Joi.object({
            ESQuery: Joi.string(),
        }),
    },
    handler: async (request) => {
        let tags;
        try {
            tags = await libs.tags.getAll(request.user, request.query && request.query.ESQuery ? JSON.parse(request.query.ESQuery) : undefined);
        }
        catch (err) {
            return error_wrappers_1.wrapEsError(err);
        }
        return tags;
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvdGFncy9saXN0LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9yZXN0X2FwaS90YWdzL2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILGlEQUEyQjtBQUMzQixpRUFBdUU7QUFHdkUsK0RBQXlEO0FBRTVDLFFBQUEsbUJBQW1CLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFELE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixhQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDOUIsZUFBZSxFQUFFLDRCQUFpQjtJQUNsQyxRQUFRLEVBQUU7UUFDUixPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNsQiw0QkFBNEIsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1NBQ3RELENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDVCxZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDO1FBQ0YsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUU7U0FDdEIsQ0FBQztLQUNIO0lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFZLEVBQUUsRUFBRTtRQUM5QixJQUFJLElBQWUsQ0FBQztRQUNwQixJQUFJO1lBQ0YsSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQzNCLE9BQU8sQ0FBQyxJQUFJLEVBQ1osT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQ3ZGLENBQUM7U0FDSDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyw0QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMvc2VjdXJpdHknO1xuaW1wb3J0IHsgQmVhdFRhZyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9kb21haW5fdHlwZXMnO1xuaW1wb3J0IHsgQ01TZXJ2ZXJMaWJzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IHdyYXBFc0Vycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvZXJyb3Jfd3JhcHBlcnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGlzdFRhZ3NSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ0dFVCcsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL3RhZ3MnLFxuICByZXF1aXJlZFJvbGVzOiBbJ2JlYXRzX2FkbWluJ10sXG4gIGxpY2Vuc2VSZXF1aXJlZDogUkVRVUlSRURfTElDRU5TRVMsXG4gIHZhbGlkYXRlOiB7XG4gICAgaGVhZGVyczogSm9pLm9iamVjdCh7XG4gICAgICAna2JuLWJlYXRzLWVucm9sbG1lbnQtdG9rZW4nOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICB9KS5vcHRpb25zKHtcbiAgICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbiAgICB9KSxcbiAgICBxdWVyeTogSm9pLm9iamVjdCh7XG4gICAgICBFU1F1ZXJ5OiBKb2kuc3RyaW5nKCksXG4gICAgfSksXG4gIH0sXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBhbnkpID0+IHtcbiAgICBsZXQgdGFnczogQmVhdFRhZ1tdO1xuICAgIHRyeSB7XG4gICAgICB0YWdzID0gYXdhaXQgbGlicy50YWdzLmdldEFsbChcbiAgICAgICAgcmVxdWVzdC51c2VyLFxuICAgICAgICByZXF1ZXN0LnF1ZXJ5ICYmIHJlcXVlc3QucXVlcnkuRVNRdWVyeSA/IEpTT04ucGFyc2UocmVxdWVzdC5xdWVyeS5FU1F1ZXJ5KSA6IHVuZGVmaW5lZFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB3cmFwRXNFcnJvcihlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB0YWdzO1xuICB9LFxufSk7XG4iXX0=