"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const lodash_1 = require("lodash");
const security_1 = require("../../../common/constants/security");
// TODO: write to Kibana audit log file
const DEFAULT_NUM_TOKENS = 1;
exports.createTokensRoute = (libs) => ({
    method: 'POST',
    path: '/api/beats/enrollment_tokens',
    licenseRequired: security_1.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin'],
    config: {
        validate: {
            payload: joi_1.default.object({
                num_tokens: joi_1.default.number()
                    .optional()
                    .default(DEFAULT_NUM_TOKENS)
                    .min(1),
            }).allow(null),
        },
    },
    handler: async (request) => {
        const numTokens = lodash_1.get(request, 'payload.num_tokens', DEFAULT_NUM_TOKENS);
        try {
            const tokens = await libs.tokens.createEnrollmentTokens(request.user, numTokens);
            return { tokens };
        }
        catch (err) {
            libs.framework.log(err.message);
            return boom_1.default.internal();
        }
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvdG9rZW5zL2NyZWF0ZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvdG9rZW5zL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsd0RBQXdCO0FBQ3hCLHNEQUFzQjtBQUN0QixtQ0FBNkI7QUFDN0IsaUVBQXVFO0FBSXZFLHVDQUF1QztBQUN2QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFBLGlCQUFpQixHQUFHLENBQUMsSUFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RCxNQUFNLEVBQUUsTUFBTTtJQUNkLElBQUksRUFBRSw4QkFBOEI7SUFDcEMsZUFBZSxFQUFFLDRCQUFpQjtJQUNsQyxhQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDOUIsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLFVBQVUsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO3FCQUNyQixRQUFRLEVBQUU7cUJBQ1YsT0FBTyxDQUFDLGtCQUFrQixDQUFDO3FCQUMzQixHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ1YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FDZjtLQUNGO0lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDM0MsTUFBTSxTQUFTLEdBQUcsWUFBRyxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRXpFLElBQUk7WUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNqRixPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDbkI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoQyxPQUFPLGNBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQm9vbSBmcm9tICdib29tJztcbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IGdldCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBSRVFVSVJFRF9MSUNFTlNFUyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMvc2VjdXJpdHknO1xuaW1wb3J0IHsgRnJhbWV3b3JrUmVxdWVzdCB9IGZyb20gJy4uLy4uL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsvYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBDTVNlcnZlckxpYnMgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuXG4vLyBUT0RPOiB3cml0ZSB0byBLaWJhbmEgYXVkaXQgbG9nIGZpbGVcbmNvbnN0IERFRkFVTFRfTlVNX1RPS0VOUyA9IDE7XG5leHBvcnQgY29uc3QgY3JlYXRlVG9rZW5zUm91dGUgPSAobGliczogQ01TZXJ2ZXJMaWJzKSA9PiAoe1xuICBtZXRob2Q6ICdQT1NUJyxcbiAgcGF0aDogJy9hcGkvYmVhdHMvZW5yb2xsbWVudF90b2tlbnMnLFxuICBsaWNlbnNlUmVxdWlyZWQ6IFJFUVVJUkVEX0xJQ0VOU0VTLFxuICByZXF1aXJlZFJvbGVzOiBbJ2JlYXRzX2FkbWluJ10sXG4gIGNvbmZpZzoge1xuICAgIHZhbGlkYXRlOiB7XG4gICAgICBwYXlsb2FkOiBKb2kub2JqZWN0KHtcbiAgICAgICAgbnVtX3Rva2VuczogSm9pLm51bWJlcigpXG4gICAgICAgICAgLm9wdGlvbmFsKClcbiAgICAgICAgICAuZGVmYXVsdChERUZBVUxUX05VTV9UT0tFTlMpXG4gICAgICAgICAgLm1pbigxKSxcbiAgICAgIH0pLmFsbG93KG51bGwpLFxuICAgIH0sXG4gIH0sXG4gIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBGcmFtZXdvcmtSZXF1ZXN0KSA9PiB7XG4gICAgY29uc3QgbnVtVG9rZW5zID0gZ2V0KHJlcXVlc3QsICdwYXlsb2FkLm51bV90b2tlbnMnLCBERUZBVUxUX05VTV9UT0tFTlMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IGF3YWl0IGxpYnMudG9rZW5zLmNyZWF0ZUVucm9sbG1lbnRUb2tlbnMocmVxdWVzdC51c2VyLCBudW1Ub2tlbnMpO1xuICAgICAgcmV0dXJuIHsgdG9rZW5zIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsaWJzLmZyYW1ld29yay5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIEJvb20uaW50ZXJuYWwoKTtcbiAgICB9XG4gIH0sXG59KTtcbiJdfQ==