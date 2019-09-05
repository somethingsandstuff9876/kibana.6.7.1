"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns object that defines behavior of the spaces related features based
 * on the license information extracted from the xPackInfo.
 * @param {XPackInfo} xPackInfo XPackInfo instance to extract license information from.
 * @returns {LicenseCheckResult}
 */
function checkLicense(xPackInfo) {
    if (!xPackInfo.isAvailable()) {
        return {
            showSpaces: false,
        };
    }
    const isAnyXpackLicense = xPackInfo.license.isOneOf([
        'basic',
        'standard',
        'gold',
        'platinum',
        'trial',
    ]);
    if (!isAnyXpackLicense) {
        return {
            showSpaces: false,
        };
    }
    return {
        showSpaces: true,
    };
}
exports.checkLicense = checkLicense;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvY2hlY2tfbGljZW5zZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvY2hlY2tfbGljZW5zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFNSDs7Ozs7R0FLRztBQUNILFNBQWdCLFlBQVksQ0FBQyxTQUFjO0lBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDNUIsT0FBTztZQUNMLFVBQVUsRUFBRSxLQUFLO1NBQ2xCLENBQUM7S0FDSDtJQUVELE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDbEQsT0FBTztRQUNQLFVBQVU7UUFDVixNQUFNO1FBQ04sVUFBVTtRQUNWLE9BQU87S0FDUixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUFDdEIsT0FBTztZQUNMLFVBQVUsRUFBRSxLQUFLO1NBQ2xCLENBQUM7S0FDSDtJQUVELE9BQU87UUFDTCxVQUFVLEVBQUUsSUFBSTtLQUNqQixDQUFDO0FBQ0osQ0FBQztBQXhCRCxvQ0F3QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIExpY2Vuc2VDaGVja1Jlc3VsdCB7XG4gIHNob3dTcGFjZXM6IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmV0dXJucyBvYmplY3QgdGhhdCBkZWZpbmVzIGJlaGF2aW9yIG9mIHRoZSBzcGFjZXMgcmVsYXRlZCBmZWF0dXJlcyBiYXNlZFxuICogb24gdGhlIGxpY2Vuc2UgaW5mb3JtYXRpb24gZXh0cmFjdGVkIGZyb20gdGhlIHhQYWNrSW5mby5cbiAqIEBwYXJhbSB7WFBhY2tJbmZvfSB4UGFja0luZm8gWFBhY2tJbmZvIGluc3RhbmNlIHRvIGV4dHJhY3QgbGljZW5zZSBpbmZvcm1hdGlvbiBmcm9tLlxuICogQHJldHVybnMge0xpY2Vuc2VDaGVja1Jlc3VsdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTGljZW5zZSh4UGFja0luZm86IGFueSk6IExpY2Vuc2VDaGVja1Jlc3VsdCB7XG4gIGlmICgheFBhY2tJbmZvLmlzQXZhaWxhYmxlKCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2hvd1NwYWNlczogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGlzQW55WHBhY2tMaWNlbnNlID0geFBhY2tJbmZvLmxpY2Vuc2UuaXNPbmVPZihbXG4gICAgJ2Jhc2ljJyxcbiAgICAnc3RhbmRhcmQnLFxuICAgICdnb2xkJyxcbiAgICAncGxhdGludW0nLFxuICAgICd0cmlhbCcsXG4gIF0pO1xuXG4gIGlmICghaXNBbnlYcGFja0xpY2Vuc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2hvd1NwYWNlczogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2hvd1NwYWNlczogdHJ1ZSxcbiAgfTtcbn1cbiJdfQ==