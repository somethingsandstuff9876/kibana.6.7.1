"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PathReporter_1 = require("io-ts/lib/PathReporter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const joi_1 = tslib_1.__importDefault(require("joi"));
const constants_1 = require("../../../common/constants");
const domain_types_1 = require("../../../common/domain_types");
// TODO: write to Kibana audit log file
exports.upsertConfigurationRoute = (libs) => ({
    method: 'PUT',
    path: '/api/beats/configurations',
    licenseRequired: constants_1.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin'],
    config: {
        validate: {
            payload: joi_1.default.array().items(joi_1.default.object({}).unknown(true)),
        },
    },
    handler: async (request) => {
        const result = request.payload.map(async (block) => {
            const assertData = domain_types_1.createConfigurationBlockInterface().decode(block);
            if (assertData.isLeft()) {
                return {
                    error: `Error parsing block info, ${PathReporter_1.PathReporter.report(assertData)[0]}`,
                };
            }
            try {
                const { blockID, success, error } = await libs.configurationBlocks.save(request.user, block);
                if (error) {
                    return { success, error };
                }
                return { success, blockID };
            }
            catch (err) {
                return { success: false, error: err.msg };
            }
        });
        return Promise.all(result);
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvY29uZmlndXJhdGlvbnMvdXBzZXJ0LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9yZXN0X2FwaS9jb25maWd1cmF0aW9ucy91cHNlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHlEQUFzRDtBQUN0RDs7OztHQUlHO0FBQ0gsc0RBQXNCO0FBQ3RCLHlEQUE4RDtBQUM5RCwrREFHc0M7QUFJdEMsdUNBQXVDO0FBQzFCLFFBQUEsd0JBQXdCLEdBQUcsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLDJCQUEyQjtJQUNqQyxlQUFlLEVBQUUsNkJBQWlCO0lBQ2xDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM5QixNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6RDtLQUNGO0lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDM0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQXlCLEVBQUUsRUFBRTtZQUNyRSxNQUFNLFVBQVUsR0FBRyxnREFBaUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDdkIsT0FBTztvQkFDTCxLQUFLLEVBQUUsNkJBQTZCLDJCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUN6RSxDQUFDO2FBQ0g7WUFFRCxJQUFJO2dCQUNGLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FDckUsT0FBTyxDQUFDLElBQUksRUFDWixLQUFLLENBQ04sQ0FBQztnQkFDRixJQUFJLEtBQUssRUFBRTtvQkFDVCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO2lCQUMzQjtnQkFFRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQzdCO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBQYXRoUmVwb3J0ZXIgfSBmcm9tICdpby10cy9saWIvUGF0aFJlcG9ydGVyJztcbi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgQ29uZmlndXJhdGlvbkJsb2NrLFxuICBjcmVhdGVDb25maWd1cmF0aW9uQmxvY2tJbnRlcmZhY2UsXG59IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9kb21haW5fdHlwZXMnO1xuaW1wb3J0IHsgRnJhbWV3b3JrUmVxdWVzdCB9IGZyb20gJy4uLy4uL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsvYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBDTVNlcnZlckxpYnMgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuXG4vLyBUT0RPOiB3cml0ZSB0byBLaWJhbmEgYXVkaXQgbG9nIGZpbGVcbmV4cG9ydCBjb25zdCB1cHNlcnRDb25maWd1cmF0aW9uUm91dGUgPSAobGliczogQ01TZXJ2ZXJMaWJzKSA9PiAoe1xuICBtZXRob2Q6ICdQVVQnLFxuICBwYXRoOiAnL2FwaS9iZWF0cy9jb25maWd1cmF0aW9ucycsXG4gIGxpY2Vuc2VSZXF1aXJlZDogUkVRVUlSRURfTElDRU5TRVMsXG4gIHJlcXVpcmVkUm9sZXM6IFsnYmVhdHNfYWRtaW4nXSxcbiAgY29uZmlnOiB7XG4gICAgdmFsaWRhdGU6IHtcbiAgICAgIHBheWxvYWQ6IEpvaS5hcnJheSgpLml0ZW1zKEpvaS5vYmplY3Qoe30pLnVua25vd24odHJ1ZSkpLFxuICAgIH0sXG4gIH0sXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBGcmFtZXdvcmtSZXF1ZXN0KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gcmVxdWVzdC5wYXlsb2FkLm1hcChhc3luYyAoYmxvY2s6IENvbmZpZ3VyYXRpb25CbG9jaykgPT4ge1xuICAgICAgY29uc3QgYXNzZXJ0RGF0YSA9IGNyZWF0ZUNvbmZpZ3VyYXRpb25CbG9ja0ludGVyZmFjZSgpLmRlY29kZShibG9jayk7XG4gICAgICBpZiAoYXNzZXJ0RGF0YS5pc0xlZnQoKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiBgRXJyb3IgcGFyc2luZyBibG9jayBpbmZvLCAke1BhdGhSZXBvcnRlci5yZXBvcnQoYXNzZXJ0RGF0YSlbMF19YCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBibG9ja0lELCBzdWNjZXNzLCBlcnJvciB9ID0gYXdhaXQgbGlicy5jb25maWd1cmF0aW9uQmxvY2tzLnNhdmUoXG4gICAgICAgICAgcmVxdWVzdC51c2VyLFxuICAgICAgICAgIGJsb2NrXG4gICAgICAgICk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3MsIGVycm9yIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdWNjZXNzLCBibG9ja0lEIH07XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubXNnIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0KTtcbiAgfSxcbn0pO1xuIl19