"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("../../../../common/constants");
class ElasticsearchTokensAdapter {
    constructor(database) {
        this.database = database;
    }
    async deleteEnrollmentToken(user, enrollmentToken) {
        const params = {
            id: `enrollment_token:${enrollmentToken}`,
            index: constants_1.INDEX_NAMES.BEATS,
            type: '_doc',
        };
        await this.database.delete(user, params);
    }
    async getEnrollmentToken(user, tokenString) {
        const params = {
            id: `enrollment_token:${tokenString}`,
            ignore: [404],
            index: constants_1.INDEX_NAMES.BEATS,
            type: '_doc',
        };
        const response = await this.database.get(user, params);
        const tokenDetails = lodash_1.get(response, '_source.enrollment_token', {
            expires_on: '0',
            token: null,
        });
        // Elasticsearch might return fast if the token is not found. OR it might return fast
        // if the token *is* found. Either way, an attacker could using a timing attack to figure
        // out whether a token is valid or not. So we introduce a random delay in returning from
        // this function to obscure the actual time it took for Elasticsearch to find the token.
        const randomDelayInMs = 25 + Math.round(Math.random() * 200); // between 25 and 225 ms
        return new Promise(resolve => setTimeout(() => resolve(tokenDetails), randomDelayInMs));
    }
    async insertTokens(user, tokens) {
        const body = lodash_1.flatten(tokens.map(token => [
            { index: { _id: `enrollment_token:${token.token}` } },
            {
                enrollment_token: token,
                type: 'enrollment_token',
            },
        ]));
        const result = await this.database.bulk(user, {
            body,
            index: constants_1.INDEX_NAMES.BEATS,
            refresh: 'wait_for',
            type: '_doc',
        });
        if (result.errors) {
            throw new Error(result.items[0].result);
        }
        return tokens;
    }
}
exports.ElasticsearchTokensAdapter = ElasticsearchTokensAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL2FkYXB0ZXJzL3Rva2Vucy9lbGFzdGljc2VhcmNoX3Rva2Vuc19hZGFwdGVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9saWIvYWRhcHRlcnMvdG9rZW5zL2VsYXN0aWNzZWFyY2hfdG9rZW5zX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsbUNBQXNDO0FBQ3RDLDREQUEyRDtBQUszRCxNQUFhLDBCQUEwQjtJQUNyQyxZQUE2QixRQUF5QjtRQUF6QixhQUFRLEdBQVIsUUFBUSxDQUFpQjtJQUFHLENBQUM7SUFFbkQsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQW1CLEVBQUUsZUFBdUI7UUFDN0UsTUFBTSxNQUFNLEdBQUc7WUFDYixFQUFFLEVBQUUsb0JBQW9CLGVBQWUsRUFBRTtZQUN6QyxLQUFLLEVBQUUsdUJBQVcsQ0FBQyxLQUFLO1lBQ3hCLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQztRQUVGLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSxLQUFLLENBQUMsa0JBQWtCLENBQzdCLElBQW1CLEVBQ25CLFdBQW1CO1FBRW5CLE1BQU0sTUFBTSxHQUFHO1lBQ2IsRUFBRSxFQUFFLG9CQUFvQixXQUFXLEVBQUU7WUFDckMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2IsS0FBSyxFQUFFLHVCQUFXLENBQUMsS0FBSztZQUN4QixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2RCxNQUFNLFlBQVksR0FBRyxZQUFHLENBQXNCLFFBQVEsRUFBRSwwQkFBMEIsRUFBRTtZQUNsRixVQUFVLEVBQUUsR0FBRztZQUNmLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBRUgscUZBQXFGO1FBQ3JGLHlGQUF5RjtRQUN6Rix3RkFBd0Y7UUFDeEYsd0ZBQXdGO1FBQ3hGLE1BQU0sZUFBZSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtRQUN0RixPQUFPLElBQUksT0FBTyxDQUFzQixPQUFPLENBQUMsRUFBRSxDQUNoRCxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUN6RCxDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBbUIsRUFBRSxNQUE2QjtRQUMxRSxNQUFNLElBQUksR0FBRyxnQkFBTyxDQUNsQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbEIsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ3JEO2dCQUNFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLElBQUksRUFBRSxrQkFBa0I7YUFDekI7U0FDRixDQUFDLENBQ0gsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzVDLElBQUk7WUFDSixLQUFLLEVBQUUsdUJBQVcsQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRjtBQWpFRCxnRUFpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBmbGF0dGVuLCBnZXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgSU5ERVhfTkFNRVMgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IERhdGFiYXNlQWRhcHRlciB9IGZyb20gJy4uL2RhdGFiYXNlL2FkYXB0ZXJfdHlwZXMnO1xuaW1wb3J0IHsgRnJhbWV3b3JrVXNlciB9IGZyb20gJy4uL2ZyYW1ld29yay9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IENNVG9rZW5zQWRhcHRlciwgVG9rZW5FbnJvbGxtZW50RGF0YSB9IGZyb20gJy4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBFbGFzdGljc2VhcmNoVG9rZW5zQWRhcHRlciBpbXBsZW1lbnRzIENNVG9rZW5zQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZGF0YWJhc2U6IERhdGFiYXNlQWRhcHRlcikge31cblxuICBwdWJsaWMgYXN5bmMgZGVsZXRlRW5yb2xsbWVudFRva2VuKHVzZXI6IEZyYW1ld29ya1VzZXIsIGVucm9sbG1lbnRUb2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgaWQ6IGBlbnJvbGxtZW50X3Rva2VuOiR7ZW5yb2xsbWVudFRva2VufWAsXG4gICAgICBpbmRleDogSU5ERVhfTkFNRVMuQkVBVFMsXG4gICAgICB0eXBlOiAnX2RvYycsXG4gICAgfTtcblxuICAgIGF3YWl0IHRoaXMuZGF0YWJhc2UuZGVsZXRlKHVzZXIsIHBhcmFtcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0RW5yb2xsbWVudFRva2VuKFxuICAgIHVzZXI6IEZyYW1ld29ya1VzZXIsXG4gICAgdG9rZW5TdHJpbmc6IHN0cmluZ1xuICApOiBQcm9taXNlPFRva2VuRW5yb2xsbWVudERhdGE+IHtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBpZDogYGVucm9sbG1lbnRfdG9rZW46JHt0b2tlblN0cmluZ31gLFxuICAgICAgaWdub3JlOiBbNDA0XSxcbiAgICAgIGluZGV4OiBJTkRFWF9OQU1FUy5CRUFUUyxcbiAgICAgIHR5cGU6ICdfZG9jJyxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmRhdGFiYXNlLmdldCh1c2VyLCBwYXJhbXMpO1xuXG4gICAgY29uc3QgdG9rZW5EZXRhaWxzID0gZ2V0PFRva2VuRW5yb2xsbWVudERhdGE+KHJlc3BvbnNlLCAnX3NvdXJjZS5lbnJvbGxtZW50X3Rva2VuJywge1xuICAgICAgZXhwaXJlc19vbjogJzAnLFxuICAgICAgdG9rZW46IG51bGwsXG4gICAgfSk7XG5cbiAgICAvLyBFbGFzdGljc2VhcmNoIG1pZ2h0IHJldHVybiBmYXN0IGlmIHRoZSB0b2tlbiBpcyBub3QgZm91bmQuIE9SIGl0IG1pZ2h0IHJldHVybiBmYXN0XG4gICAgLy8gaWYgdGhlIHRva2VuICppcyogZm91bmQuIEVpdGhlciB3YXksIGFuIGF0dGFja2VyIGNvdWxkIHVzaW5nIGEgdGltaW5nIGF0dGFjayB0byBmaWd1cmVcbiAgICAvLyBvdXQgd2hldGhlciBhIHRva2VuIGlzIHZhbGlkIG9yIG5vdC4gU28gd2UgaW50cm9kdWNlIGEgcmFuZG9tIGRlbGF5IGluIHJldHVybmluZyBmcm9tXG4gICAgLy8gdGhpcyBmdW5jdGlvbiB0byBvYnNjdXJlIHRoZSBhY3R1YWwgdGltZSBpdCB0b29rIGZvciBFbGFzdGljc2VhcmNoIHRvIGZpbmQgdGhlIHRva2VuLlxuICAgIGNvbnN0IHJhbmRvbURlbGF5SW5NcyA9IDI1ICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMjAwKTsgLy8gYmV0d2VlbiAyNSBhbmQgMjI1IG1zXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFRva2VuRW5yb2xsbWVudERhdGE+KHJlc29sdmUgPT5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh0b2tlbkRldGFpbHMpLCByYW5kb21EZWxheUluTXMpXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbnNlcnRUb2tlbnModXNlcjogRnJhbWV3b3JrVXNlciwgdG9rZW5zOiBUb2tlbkVucm9sbG1lbnREYXRhW10pIHtcbiAgICBjb25zdCBib2R5ID0gZmxhdHRlbihcbiAgICAgIHRva2Vucy5tYXAodG9rZW4gPT4gW1xuICAgICAgICB7IGluZGV4OiB7IF9pZDogYGVucm9sbG1lbnRfdG9rZW46JHt0b2tlbi50b2tlbn1gIH0gfSxcbiAgICAgICAge1xuICAgICAgICAgIGVucm9sbG1lbnRfdG9rZW46IHRva2VuLFxuICAgICAgICAgIHR5cGU6ICdlbnJvbGxtZW50X3Rva2VuJyxcbiAgICAgICAgfSxcbiAgICAgIF0pXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZGF0YWJhc2UuYnVsayh1c2VyLCB7XG4gICAgICBib2R5LFxuICAgICAgaW5kZXg6IElOREVYX05BTUVTLkJFQVRTLFxuICAgICAgcmVmcmVzaDogJ3dhaXRfZm9yJyxcbiAgICAgIHR5cGU6ICdfZG9jJyxcbiAgICB9KTtcblxuICAgIGlmIChyZXN1bHQuZXJyb3JzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0Lml0ZW1zWzBdLnJlc3VsdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxufVxuIl19