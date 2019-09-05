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
exports.createListAgentsRoute = (libs) => ({
    method: 'GET',
    path: '/api/beats/agents/{listByAndValue*}',
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
        const listByAndValueParts = request.params.listByAndValue
            ? request.params.listByAndValue.split('/')
            : [];
        let listBy = null;
        let listByValue = null;
        if (listByAndValueParts.length === 2) {
            listBy = listByAndValueParts[0];
            listByValue = listByAndValueParts[1];
        }
        try {
            let beats;
            switch (listBy) {
                case 'tag':
                    beats = await libs.beats.getAllWithTag(request.user, listByValue || '');
                    break;
                default:
                    beats = await libs.beats.getAll(request.user, request.query && request.query.ESQuery ? JSON.parse(request.query.ESQuery) : undefined);
                    break;
            }
            return { beats };
        }
        catch (err) {
            // FIXME move this to kibana route thing in adapter
            return error_wrappers_1.wrapEsError(err);
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvbGlzdC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsaURBQTJCO0FBQzNCLGlFQUF1RTtBQUl2RSwrREFBeUQ7QUFFNUMsUUFBQSxxQkFBcUIsR0FBRyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUQsTUFBTSxFQUFFLEtBQUs7SUFDYixJQUFJLEVBQUUscUNBQXFDO0lBQzNDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM5QixlQUFlLEVBQUUsNEJBQWlCO0lBRWxDLFFBQVEsRUFBRTtRQUNSLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2xCLDRCQUE0QixFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7U0FDdEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNULFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQUM7UUFDRixLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRTtTQUN0QixDQUFDO0tBQ0g7SUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUMzQyxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYztZQUN2RCxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUMxQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1AsSUFBSSxNQUFNLEdBQWlCLElBQUksQ0FBQztRQUNoQyxJQUFJLFdBQVcsR0FBa0IsSUFBSSxDQUFDO1FBRXRDLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQyxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsV0FBVyxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsSUFBSTtZQUNGLElBQUksS0FBZSxDQUFDO1lBRXBCLFFBQVEsTUFBTSxFQUFFO2dCQUNkLEtBQUssS0FBSztvQkFDUixLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDeEUsTUFBTTtnQkFFUjtvQkFDRSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FDN0IsT0FBTyxDQUFDLElBQUksRUFDWixPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDdkYsQ0FBQztvQkFFRixNQUFNO2FBQ1Q7WUFFRCxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7U0FDbEI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLG1EQUFtRDtZQUNuRCxPQUFPLDRCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMvc2VjdXJpdHknO1xuaW1wb3J0IHsgQ01CZWF0IH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2RvbWFpbl90eXBlcyc7XG5pbXBvcnQgeyBGcmFtZXdvcmtSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IENNU2VydmVyTGlicyB9IGZyb20gJy4uLy4uL2xpYi90eXBlcyc7XG5pbXBvcnQgeyB3cmFwRXNFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL2Vycm9yX3dyYXBwZXJzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxpc3RBZ2VudHNSb3V0ZSA9IChsaWJzOiBDTVNlcnZlckxpYnMpID0+ICh7XG4gIG1ldGhvZDogJ0dFVCcsXG4gIHBhdGg6ICcvYXBpL2JlYXRzL2FnZW50cy97bGlzdEJ5QW5kVmFsdWUqfScsXG4gIHJlcXVpcmVkUm9sZXM6IFsnYmVhdHNfYWRtaW4nXSxcbiAgbGljZW5zZVJlcXVpcmVkOiBSRVFVSVJFRF9MSUNFTlNFUyxcblxuICB2YWxpZGF0ZToge1xuICAgIGhlYWRlcnM6IEpvaS5vYmplY3Qoe1xuICAgICAgJ2tibi1iZWF0cy1lbnJvbGxtZW50LXRva2VuJzogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgfSkub3B0aW9ucyh7XG4gICAgICBhbGxvd1Vua25vd246IHRydWUsXG4gICAgfSksXG4gICAgcXVlcnk6IEpvaS5vYmplY3Qoe1xuICAgICAgRVNRdWVyeTogSm9pLnN0cmluZygpLFxuICAgIH0pLFxuICB9LFxuICBoYW5kbGVyOiBhc3luYyAocmVxdWVzdDogRnJhbWV3b3JrUmVxdWVzdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RCeUFuZFZhbHVlUGFydHMgPSByZXF1ZXN0LnBhcmFtcy5saXN0QnlBbmRWYWx1ZVxuICAgICAgPyByZXF1ZXN0LnBhcmFtcy5saXN0QnlBbmRWYWx1ZS5zcGxpdCgnLycpXG4gICAgICA6IFtdO1xuICAgIGxldCBsaXN0Qnk6ICd0YWcnIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGxpc3RCeVZhbHVlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChsaXN0QnlBbmRWYWx1ZVBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgbGlzdEJ5ID0gbGlzdEJ5QW5kVmFsdWVQYXJ0c1swXTtcbiAgICAgIGxpc3RCeVZhbHVlID0gbGlzdEJ5QW5kVmFsdWVQYXJ0c1sxXTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgbGV0IGJlYXRzOiBDTUJlYXRbXTtcblxuICAgICAgc3dpdGNoIChsaXN0QnkpIHtcbiAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICBiZWF0cyA9IGF3YWl0IGxpYnMuYmVhdHMuZ2V0QWxsV2l0aFRhZyhyZXF1ZXN0LnVzZXIsIGxpc3RCeVZhbHVlIHx8ICcnKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJlYXRzID0gYXdhaXQgbGlicy5iZWF0cy5nZXRBbGwoXG4gICAgICAgICAgICByZXF1ZXN0LnVzZXIsXG4gICAgICAgICAgICByZXF1ZXN0LnF1ZXJ5ICYmIHJlcXVlc3QucXVlcnkuRVNRdWVyeSA/IEpTT04ucGFyc2UocmVxdWVzdC5xdWVyeS5FU1F1ZXJ5KSA6IHVuZGVmaW5lZFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgYmVhdHMgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIEZJWE1FIG1vdmUgdGhpcyB0byBraWJhbmEgcm91dGUgdGhpbmcgaW4gYWRhcHRlclxuICAgICAgcmV0dXJuIHdyYXBFc0Vycm9yKGVycik7XG4gICAgfVxuICB9LFxufSk7XG4iXX0=