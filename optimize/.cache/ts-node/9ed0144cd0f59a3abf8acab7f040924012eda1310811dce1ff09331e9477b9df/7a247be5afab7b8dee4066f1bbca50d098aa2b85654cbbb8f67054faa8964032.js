"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const RANDOM_TOKEN_1 = 'b48c4bda384a40cb91c6eb9b8849e77f';
const RANDOM_TOKEN_2 = '80a3819e3cd64f4399f1d4886be7a08b';
class CMTokensDomain {
    constructor(adapter, libs) {
        this.adapter = adapter;
        this.framework = libs.framework;
    }
    async getEnrollmentToken(enrollmentToken) {
        const fullToken = await this.adapter.getEnrollmentToken(this.framework.internalUser, enrollmentToken);
        if (!fullToken) {
            return {
                token: null,
                expired: true,
                expires_on: null,
            };
        }
        const { verified, expired } = this.verifyToken(enrollmentToken, fullToken.token || '', false);
        if (!verified) {
            return {
                expired,
                token: null,
                expires_on: null,
            };
        }
        return { ...fullToken, expired };
    }
    async deleteEnrollmentToken(enrollmentToken) {
        return await this.adapter.deleteEnrollmentToken(this.framework.internalUser, enrollmentToken);
    }
    verifyToken(recivedToken, token2, decode = true) {
        let tokenDecoded = true;
        let expired = false;
        if (decode) {
            const enrollmentTokenSecret = this.framework.getSetting('encryptionKey');
            try {
                jsonwebtoken_1.verify(recivedToken, enrollmentTokenSecret);
                tokenDecoded = true;
            }
            catch (err) {
                if (err.name === 'TokenExpiredError') {
                    expired = true;
                }
                tokenDecoded = false;
            }
        }
        if (typeof recivedToken !== 'string' ||
            typeof token2 !== 'string' ||
            recivedToken.length !== token2.length) {
            // This prevents a more subtle timing attack where we know already the tokens aren't going to
            // match but still we don't return fast. Instead we compare two pre-generated random tokens using
            // the same comparison algorithm that we would use to compare two equal-length tokens.
            return {
                expired,
                verified: crypto_1.timingSafeEqual(Buffer.from(RANDOM_TOKEN_1, 'utf8'), Buffer.from(RANDOM_TOKEN_2, 'utf8')) && tokenDecoded,
            };
        }
        return {
            expired,
            verified: crypto_1.timingSafeEqual(Buffer.from(recivedToken, 'utf8'), Buffer.from(token2, 'utf8')) &&
                tokenDecoded,
        };
    }
    generateAccessToken() {
        const enrollmentTokenSecret = this.framework.getSetting('encryptionKey');
        const tokenData = {
            created: moment_1.default().toJSON(),
            randomHash: crypto_1.randomBytes(26).toString(),
        };
        return jsonwebtoken_1.sign(tokenData, enrollmentTokenSecret);
    }
    async createEnrollmentTokens(user, numTokens = 1) {
        const tokens = [];
        const enrollmentTokensTtlInSeconds = this.framework.getSetting('enrollmentTokensTtlInSeconds');
        const enrollmentTokenExpiration = moment_1.default()
            .add(enrollmentTokensTtlInSeconds, 'seconds')
            .toJSON();
        const enrollmentTokenSecret = this.framework.getSetting('encryptionKey');
        while (tokens.length < numTokens) {
            const tokenData = {
                created: moment_1.default().toJSON(),
                expires: enrollmentTokenExpiration,
                randomHash: crypto_1.randomBytes(26).toString(),
            };
            tokens.push({
                expires_on: enrollmentTokenExpiration,
                token: jsonwebtoken_1.sign(tokenData, enrollmentTokenSecret),
            });
        }
        await Promise.all(lodash_1.chunk(tokens, 100).map(tokenChunk => this.adapter.insertTokens(user, tokenChunk)));
        return tokens.map(token => token.token);
    }
}
exports.CMTokensDomain = CMTokensDomain;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL3Rva2Vucy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL3Rva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsbUNBQXNEO0FBQ3RELCtDQUF3RTtBQUN4RSxtQ0FBK0I7QUFDL0IsNERBQTRCO0FBSzVCLE1BQU0sY0FBYyxHQUFHLGtDQUFrQyxDQUFDO0FBQzFELE1BQU0sY0FBYyxHQUFHLGtDQUFrQyxDQUFDO0FBRTFELE1BQWEsY0FBYztJQUl6QixZQUFZLE9BQXdCLEVBQUUsSUFBOEM7UUFDbEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsZUFBdUI7UUFDckQsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFDM0IsZUFBZSxDQUNoQixDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQztTQUNIO1FBRUQsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU5RixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsT0FBTztnQkFDTCxPQUFPO2dCQUNQLEtBQUssRUFBRSxJQUFJO2dCQUNYLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUM7U0FDSDtRQUVELE9BQU8sRUFBRSxHQUFHLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU0sS0FBSyxDQUFDLHFCQUFxQixDQUFDLGVBQXVCO1FBQ3hELE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFFTSxXQUFXLENBQUMsWUFBb0IsRUFBRSxNQUFjLEVBQUUsTUFBTSxHQUFHLElBQUk7UUFDcEUsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFekUsSUFBSTtnQkFDRixxQkFBVyxDQUFDLFlBQVksRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNqRCxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLG1CQUFtQixFQUFFO29CQUNwQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNoQjtnQkFDRCxZQUFZLEdBQUcsS0FBSyxDQUFDO2FBQ3RCO1NBQ0Y7UUFFRCxJQUNFLE9BQU8sWUFBWSxLQUFLLFFBQVE7WUFDaEMsT0FBTyxNQUFNLEtBQUssUUFBUTtZQUMxQixZQUFZLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQ3JDO1lBQ0EsNkZBQTZGO1lBQzdGLGlHQUFpRztZQUNqRyxzRkFBc0Y7WUFDdEYsT0FBTztnQkFDTCxPQUFPO2dCQUNQLFFBQVEsRUFDTix3QkFBZSxDQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxFQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FDcEMsSUFBSSxZQUFZO2FBQ3BCLENBQUM7U0FDSDtRQUVELE9BQU87WUFDTCxPQUFPO1lBQ1AsUUFBUSxFQUNOLHdCQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9FLFlBQVk7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVNLG1CQUFtQjtRQUN4QixNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXpFLE1BQU0sU0FBUyxHQUFHO1lBQ2hCLE9BQU8sRUFBRSxnQkFBTSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQzFCLFVBQVUsRUFBRSxvQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtTQUN2QyxDQUFDO1FBRUYsT0FBTyxtQkFBUyxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxLQUFLLENBQUMsc0JBQXNCLENBQ2pDLElBQW1CLEVBQ25CLFlBQW9CLENBQUM7UUFFckIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUUvRixNQUFNLHlCQUF5QixHQUFHLGdCQUFNLEVBQUU7YUFDdkMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLFNBQVMsQ0FBQzthQUM1QyxNQUFNLEVBQUUsQ0FBQztRQUNaLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFekUsT0FBTyxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtZQUNoQyxNQUFNLFNBQVMsR0FBRztnQkFDaEIsT0FBTyxFQUFFLGdCQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLFVBQVUsRUFBRSxvQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTthQUN2QyxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDVixVQUFVLEVBQUUseUJBQXlCO2dCQUNyQyxLQUFLLEVBQUUsbUJBQVMsQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUM7YUFDbkQsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsY0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FDbEYsQ0FBQztRQUVGLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUE3SEQsd0NBNkhDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7IHJhbmRvbUJ5dGVzLCB0aW1pbmdTYWZlRXF1YWwgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgc2lnbiBhcyBzaWduVG9rZW4sIHZlcmlmeSBhcyB2ZXJpZnlUb2tlbiB9IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgeyBjaHVuayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBGcmFtZXdvcmtVc2VyIH0gZnJvbSAnLi9hZGFwdGVycy9mcmFtZXdvcmsvYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBDTVRva2Vuc0FkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXJzL3Rva2Vucy9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IENNU2VydmVyTGlicyB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBSQU5ET01fVE9LRU5fMSA9ICdiNDhjNGJkYTM4NGE0MGNiOTFjNmViOWI4ODQ5ZTc3Zic7XG5jb25zdCBSQU5ET01fVE9LRU5fMiA9ICc4MGEzODE5ZTNjZDY0ZjQzOTlmMWQ0ODg2YmU3YTA4Yic7XG5cbmV4cG9ydCBjbGFzcyBDTVRva2Vuc0RvbWFpbiB7XG4gIHByaXZhdGUgYWRhcHRlcjogQ01Ub2tlbnNBZGFwdGVyO1xuICBwcml2YXRlIGZyYW1ld29yazogQ01TZXJ2ZXJMaWJzWydmcmFtZXdvcmsnXTtcblxuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBDTVRva2Vuc0FkYXB0ZXIsIGxpYnM6IHsgZnJhbWV3b3JrOiBDTVNlcnZlckxpYnNbJ2ZyYW1ld29yayddIH0pIHtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICAgIHRoaXMuZnJhbWV3b3JrID0gbGlicy5mcmFtZXdvcms7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0RW5yb2xsbWVudFRva2VuKGVucm9sbG1lbnRUb2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgZnVsbFRva2VuID0gYXdhaXQgdGhpcy5hZGFwdGVyLmdldEVucm9sbG1lbnRUb2tlbihcbiAgICAgIHRoaXMuZnJhbWV3b3JrLmludGVybmFsVXNlcixcbiAgICAgIGVucm9sbG1lbnRUb2tlblxuICAgICk7XG4gICAgaWYgKCFmdWxsVG9rZW4pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuOiBudWxsLFxuICAgICAgICBleHBpcmVkOiB0cnVlLFxuICAgICAgICBleHBpcmVzX29uOiBudWxsLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHZlcmlmaWVkLCBleHBpcmVkIH0gPSB0aGlzLnZlcmlmeVRva2VuKGVucm9sbG1lbnRUb2tlbiwgZnVsbFRva2VuLnRva2VuIHx8ICcnLCBmYWxzZSk7XG5cbiAgICBpZiAoIXZlcmlmaWVkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBleHBpcmVkLFxuICAgICAgICB0b2tlbjogbnVsbCxcbiAgICAgICAgZXhwaXJlc19vbjogbnVsbCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgLi4uZnVsbFRva2VuLCBleHBpcmVkIH07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGVsZXRlRW5yb2xsbWVudFRva2VuKGVucm9sbG1lbnRUb2tlbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYWRhcHRlci5kZWxldGVFbnJvbGxtZW50VG9rZW4odGhpcy5mcmFtZXdvcmsuaW50ZXJuYWxVc2VyLCBlbnJvbGxtZW50VG9rZW4pO1xuICB9XG5cbiAgcHVibGljIHZlcmlmeVRva2VuKHJlY2l2ZWRUb2tlbjogc3RyaW5nLCB0b2tlbjI6IHN0cmluZywgZGVjb2RlID0gdHJ1ZSkge1xuICAgIGxldCB0b2tlbkRlY29kZWQgPSB0cnVlO1xuICAgIGxldCBleHBpcmVkID0gZmFsc2U7XG5cbiAgICBpZiAoZGVjb2RlKSB7XG4gICAgICBjb25zdCBlbnJvbGxtZW50VG9rZW5TZWNyZXQgPSB0aGlzLmZyYW1ld29yay5nZXRTZXR0aW5nKCdlbmNyeXB0aW9uS2V5Jyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZlcmlmeVRva2VuKHJlY2l2ZWRUb2tlbiwgZW5yb2xsbWVudFRva2VuU2VjcmV0KTtcbiAgICAgICAgdG9rZW5EZWNvZGVkID0gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyLm5hbWUgPT09ICdUb2tlbkV4cGlyZWRFcnJvcicpIHtcbiAgICAgICAgICBleHBpcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbkRlY29kZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2YgcmVjaXZlZFRva2VuICE9PSAnc3RyaW5nJyB8fFxuICAgICAgdHlwZW9mIHRva2VuMiAhPT0gJ3N0cmluZycgfHxcbiAgICAgIHJlY2l2ZWRUb2tlbi5sZW5ndGggIT09IHRva2VuMi5sZW5ndGhcbiAgICApIHtcbiAgICAgIC8vIFRoaXMgcHJldmVudHMgYSBtb3JlIHN1YnRsZSB0aW1pbmcgYXR0YWNrIHdoZXJlIHdlIGtub3cgYWxyZWFkeSB0aGUgdG9rZW5zIGFyZW4ndCBnb2luZyB0b1xuICAgICAgLy8gbWF0Y2ggYnV0IHN0aWxsIHdlIGRvbid0IHJldHVybiBmYXN0LiBJbnN0ZWFkIHdlIGNvbXBhcmUgdHdvIHByZS1nZW5lcmF0ZWQgcmFuZG9tIHRva2VucyB1c2luZ1xuICAgICAgLy8gdGhlIHNhbWUgY29tcGFyaXNvbiBhbGdvcml0aG0gdGhhdCB3ZSB3b3VsZCB1c2UgdG8gY29tcGFyZSB0d28gZXF1YWwtbGVuZ3RoIHRva2Vucy5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGV4cGlyZWQsXG4gICAgICAgIHZlcmlmaWVkOlxuICAgICAgICAgIHRpbWluZ1NhZmVFcXVhbChcbiAgICAgICAgICAgIEJ1ZmZlci5mcm9tKFJBTkRPTV9UT0tFTl8xLCAndXRmOCcpLFxuICAgICAgICAgICAgQnVmZmVyLmZyb20oUkFORE9NX1RPS0VOXzIsICd1dGY4JylcbiAgICAgICAgICApICYmIHRva2VuRGVjb2RlZCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGlyZWQsXG4gICAgICB2ZXJpZmllZDpcbiAgICAgICAgdGltaW5nU2FmZUVxdWFsKEJ1ZmZlci5mcm9tKHJlY2l2ZWRUb2tlbiwgJ3V0ZjgnKSwgQnVmZmVyLmZyb20odG9rZW4yLCAndXRmOCcpKSAmJlxuICAgICAgICB0b2tlbkRlY29kZWQsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZW5lcmF0ZUFjY2Vzc1Rva2VuKCkge1xuICAgIGNvbnN0IGVucm9sbG1lbnRUb2tlblNlY3JldCA9IHRoaXMuZnJhbWV3b3JrLmdldFNldHRpbmcoJ2VuY3J5cHRpb25LZXknKTtcblxuICAgIGNvbnN0IHRva2VuRGF0YSA9IHtcbiAgICAgIGNyZWF0ZWQ6IG1vbWVudCgpLnRvSlNPTigpLFxuICAgICAgcmFuZG9tSGFzaDogcmFuZG9tQnl0ZXMoMjYpLnRvU3RyaW5nKCksXG4gICAgfTtcblxuICAgIHJldHVybiBzaWduVG9rZW4odG9rZW5EYXRhLCBlbnJvbGxtZW50VG9rZW5TZWNyZXQpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNyZWF0ZUVucm9sbG1lbnRUb2tlbnMoXG4gICAgdXNlcjogRnJhbWV3b3JrVXNlcixcbiAgICBudW1Ub2tlbnM6IG51bWJlciA9IDFcbiAgKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IHRva2VucyA9IFtdO1xuICAgIGNvbnN0IGVucm9sbG1lbnRUb2tlbnNUdGxJblNlY29uZHMgPSB0aGlzLmZyYW1ld29yay5nZXRTZXR0aW5nKCdlbnJvbGxtZW50VG9rZW5zVHRsSW5TZWNvbmRzJyk7XG5cbiAgICBjb25zdCBlbnJvbGxtZW50VG9rZW5FeHBpcmF0aW9uID0gbW9tZW50KClcbiAgICAgIC5hZGQoZW5yb2xsbWVudFRva2Vuc1R0bEluU2Vjb25kcywgJ3NlY29uZHMnKVxuICAgICAgLnRvSlNPTigpO1xuICAgIGNvbnN0IGVucm9sbG1lbnRUb2tlblNlY3JldCA9IHRoaXMuZnJhbWV3b3JrLmdldFNldHRpbmcoJ2VuY3J5cHRpb25LZXknKTtcblxuICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoIDwgbnVtVG9rZW5zKSB7XG4gICAgICBjb25zdCB0b2tlbkRhdGEgPSB7XG4gICAgICAgIGNyZWF0ZWQ6IG1vbWVudCgpLnRvSlNPTigpLFxuICAgICAgICBleHBpcmVzOiBlbnJvbGxtZW50VG9rZW5FeHBpcmF0aW9uLFxuICAgICAgICByYW5kb21IYXNoOiByYW5kb21CeXRlcygyNikudG9TdHJpbmcoKSxcbiAgICAgIH07XG5cbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgZXhwaXJlc19vbjogZW5yb2xsbWVudFRva2VuRXhwaXJhdGlvbixcbiAgICAgICAgdG9rZW46IHNpZ25Ub2tlbih0b2tlbkRhdGEsIGVucm9sbG1lbnRUb2tlblNlY3JldCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGNodW5rKHRva2VucywgMTAwKS5tYXAodG9rZW5DaHVuayA9PiB0aGlzLmFkYXB0ZXIuaW5zZXJ0VG9rZW5zKHVzZXIsIHRva2VuQ2h1bmspKVxuICAgICk7XG5cbiAgICByZXR1cm4gdG9rZW5zLm1hcCh0b2tlbiA9PiB0b2tlbi50b2tlbik7XG4gIH1cbn1cbiJdfQ==