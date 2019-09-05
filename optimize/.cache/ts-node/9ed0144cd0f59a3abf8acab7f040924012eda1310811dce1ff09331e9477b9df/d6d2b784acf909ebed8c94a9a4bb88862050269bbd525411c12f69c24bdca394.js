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
exports.createGetBeatConfigurationRoute = (libs) => ({
    method: 'GET',
    path: '/api/beats/agent/{beatId}/configuration',
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
        const accessToken = request.headers['kbn-beats-access-token'];
        let beat;
        let configurationBlocks;
        try {
            beat = await libs.beats.getById(libs.framework.internalUser, beatId);
            if (beat === null) {
                return h.response({ message: `Beat "${beatId}" not found` }).code(404);
            }
            const isAccessTokenValid = beat.access_token === accessToken;
            if (!isAccessTokenValid) {
                return h.response({ message: 'Invalid access token' }).code(401);
            }
            await libs.beats.update(libs.framework.internalUser, beat.id, {
                last_checkin: new Date(),
            });
            if (beat.tags) {
                const result = await libs.configurationBlocks.getForTags(libs.framework.internalUser, beat.tags, -1);
                configurationBlocks = result.blocks;
            }
            else {
                configurationBlocks = [];
            }
        }
        catch (err) {
            return error_wrappers_1.wrapEsError(err);
        }
        return {
            configuration_blocks: configurationBlocks,
        };
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvY29uZmlndXJhdGlvbi50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvcmVzdF9hcGkvYmVhdHMvY29uZmlndXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsc0RBQXNCO0FBR3RCLCtEQUF5RDtBQUU1QyxRQUFBLCtCQUErQixHQUFHLENBQUMsSUFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0RSxNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSx5Q0FBeUM7SUFDL0MsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLHdCQUF3QixFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDbEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNuQztRQUNELElBQUksRUFBRSxLQUFLO0tBQ1o7SUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQVksRUFBRSxDQUFNLEVBQUUsRUFBRTtRQUN0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNyQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFOUQsSUFBSSxJQUFJLENBQUM7UUFDVCxJQUFJLG1CQUF5QyxDQUFDO1FBQzlDLElBQUk7WUFDRixJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLE1BQU0sYUFBYSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDeEU7WUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxZQUFZLEtBQUssV0FBVyxDQUFDO1lBQzdELElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDdkIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEU7WUFFRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQzVELFlBQVksRUFBRSxJQUFJLElBQUksRUFBRTthQUN6QixDQUFDLENBQUM7WUFFSCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFDM0IsSUFBSSxDQUFDLElBQUksRUFDVCxDQUFDLENBQUMsQ0FDSCxDQUFDO2dCQUVGLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDckM7aUJBQU07Z0JBQ0wsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO2FBQzFCO1NBQ0Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sNEJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtRQUVELE9BQU87WUFDTCxvQkFBb0IsRUFBRSxtQkFBbUI7U0FDMUMsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IEpvaSBmcm9tICdqb2knO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbkJsb2NrIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2RvbWFpbl90eXBlcyc7XG5pbXBvcnQgeyBDTVNlcnZlckxpYnMgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgd3JhcEVzRXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9lcnJvcl93cmFwcGVycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVHZXRCZWF0Q29uZmlndXJhdGlvblJvdXRlID0gKGxpYnM6IENNU2VydmVyTGlicykgPT4gKHtcbiAgbWV0aG9kOiAnR0VUJyxcbiAgcGF0aDogJy9hcGkvYmVhdHMvYWdlbnQve2JlYXRJZH0vY29uZmlndXJhdGlvbicsXG4gIGNvbmZpZzoge1xuICAgIHZhbGlkYXRlOiB7XG4gICAgICBoZWFkZXJzOiBKb2kub2JqZWN0KHtcbiAgICAgICAgJ2tibi1iZWF0cy1hY2Nlc3MtdG9rZW4nOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgIH0pLm9wdGlvbnMoeyBhbGxvd1Vua25vd246IHRydWUgfSksXG4gICAgfSxcbiAgICBhdXRoOiBmYWxzZSxcbiAgfSxcbiAgaGFuZGxlcjogYXN5bmMgKHJlcXVlc3Q6IGFueSwgaDogYW55KSA9PiB7XG4gICAgY29uc3QgYmVhdElkID0gcmVxdWVzdC5wYXJhbXMuYmVhdElkO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxdWVzdC5oZWFkZXJzWydrYm4tYmVhdHMtYWNjZXNzLXRva2VuJ107XG5cbiAgICBsZXQgYmVhdDtcbiAgICBsZXQgY29uZmlndXJhdGlvbkJsb2NrczogQ29uZmlndXJhdGlvbkJsb2NrW107XG4gICAgdHJ5IHtcbiAgICAgIGJlYXQgPSBhd2FpdCBsaWJzLmJlYXRzLmdldEJ5SWQobGlicy5mcmFtZXdvcmsuaW50ZXJuYWxVc2VyLCBiZWF0SWQpO1xuICAgICAgaWYgKGJlYXQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGgucmVzcG9uc2UoeyBtZXNzYWdlOiBgQmVhdCBcIiR7YmVhdElkfVwiIG5vdCBmb3VuZGAgfSkuY29kZSg0MDQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0FjY2Vzc1Rva2VuVmFsaWQgPSBiZWF0LmFjY2Vzc190b2tlbiA9PT0gYWNjZXNzVG9rZW47XG4gICAgICBpZiAoIWlzQWNjZXNzVG9rZW5WYWxpZCkge1xuICAgICAgICByZXR1cm4gaC5yZXNwb25zZSh7IG1lc3NhZ2U6ICdJbnZhbGlkIGFjY2VzcyB0b2tlbicgfSkuY29kZSg0MDEpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBsaWJzLmJlYXRzLnVwZGF0ZShsaWJzLmZyYW1ld29yay5pbnRlcm5hbFVzZXIsIGJlYXQuaWQsIHtcbiAgICAgICAgbGFzdF9jaGVja2luOiBuZXcgRGF0ZSgpLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChiZWF0LnRhZ3MpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbGlicy5jb25maWd1cmF0aW9uQmxvY2tzLmdldEZvclRhZ3MoXG4gICAgICAgICAgbGlicy5mcmFtZXdvcmsuaW50ZXJuYWxVc2VyLFxuICAgICAgICAgIGJlYXQudGFncyxcbiAgICAgICAgICAtMVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbmZpZ3VyYXRpb25CbG9ja3MgPSByZXN1bHQuYmxvY2tzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlndXJhdGlvbkJsb2NrcyA9IFtdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHdyYXBFc0Vycm9yKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb25fYmxvY2tzOiBjb25maWd1cmF0aW9uQmxvY2tzLFxuICAgIH07XG4gIH0sXG59KTtcbiJdfQ==