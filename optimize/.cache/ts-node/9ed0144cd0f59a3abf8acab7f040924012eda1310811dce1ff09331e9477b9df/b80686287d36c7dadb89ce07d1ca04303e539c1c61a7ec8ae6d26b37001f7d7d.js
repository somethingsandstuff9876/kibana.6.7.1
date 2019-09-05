"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const WAIT_FOR_DELAY_MS = 100;
class HeadlessChromiumDriver {
    constructor(page, { logger }) {
        this.page = page;
        this.logger = logger.clone(['headless-chromium-driver']);
    }
    async open(url, { conditionalHeaders, waitForSelector, }) {
        this.logger.debug(`opening url ${url}`);
        await this.page.setRequestInterception(true);
        this.page.on('request', (interceptedRequest) => {
            if (this._shouldUseCustomHeaders(conditionalHeaders.conditions, interceptedRequest.url())) {
                this.logger.debug(`Using custom headers for ${interceptedRequest.url()}`);
                interceptedRequest.continue({
                    headers: {
                        ...interceptedRequest.headers(),
                        ...conditionalHeaders.headers,
                    },
                });
            }
            else {
                this.logger.debug(`No custom headers for ${interceptedRequest.url()}`);
                interceptedRequest.continue();
            }
        });
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        await this.waitForSelector(waitForSelector);
    }
    async screenshot(elementPosition) {
        let clip;
        if (elementPosition) {
            const { boundingClientRect, scroll = { x: 0, y: 0 } } = elementPosition;
            clip = {
                x: boundingClientRect.left + scroll.x,
                y: boundingClientRect.top + scroll.y,
                height: boundingClientRect.height,
                width: boundingClientRect.width,
            };
        }
        const screenshot = await this.page.screenshot({
            clip,
        });
        return screenshot.toString('base64');
    }
    async evaluate({ fn, args = [] }) {
        const result = await this.page.evaluate(fn, ...args);
        return result;
    }
    async waitForSelector(selector, opts = {}) {
        const { silent = false } = opts;
        this.logger.debug(`waitForSelector ${selector}`);
        let resp;
        try {
            resp = await this.page.waitFor(selector);
        }
        catch (err) {
            if (!silent) {
                // Provide some troubleshooting info to see if we're on the login page,
                // "Kibana could not load correctly", etc
                this.logger.error(`waitForSelector ${selector} failed on ${this.page.url()}`);
                const pageText = await this.evaluate({
                    fn: () => document.querySelector('body').innerText,
                    args: [],
                });
                this.logger.debug(`Page plain text: ${pageText.replace(/\n/g, '\\n')}`); // replace newline with escaped for single log line
            }
            throw err;
        }
        this.logger.debug(`waitForSelector ${selector} resolved`);
        return resp;
    }
    async waitFor({ fn, args, toEqual }) {
        while (true) {
            const result = await this.evaluate({ fn, args });
            if (result === toEqual) {
                return;
            }
            await new Promise(r => setTimeout(r, WAIT_FOR_DELAY_MS));
        }
    }
    async setViewport({ width, height, zoom }) {
        this.logger.debug(`Setting viewport to width: ${width}, height: ${height}, zoom: ${zoom}`);
        await this.page.setViewport({
            width: Math.floor(width / zoom),
            height: Math.floor(height / zoom),
            deviceScaleFactor: zoom,
            isMobile: false,
        });
    }
    _shouldUseCustomHeaders(conditions, url) {
        const { hostname, protocol, port, pathname } = url_1.parse(url);
        if (pathname === undefined) {
            // There's a discrepancy between the NodeJS docs and the typescript types. NodeJS docs
            // just say 'string' and the typescript types say 'string | undefined'. We haven't hit a
            // situation where it's undefined but here's an explicit Error if we do.
            throw new Error(`pathname is undefined, don't know how to proceed`);
        }
        return (hostname === conditions.hostname &&
            protocol === `${conditions.protocol}:` &&
            this._shouldUseCustomHeadersForPort(conditions, port) &&
            pathname.startsWith(`${conditions.basePath}/`));
    }
    _shouldUseCustomHeadersForPort(conditions, port) {
        if (conditions.protocol === 'http' && conditions.port === 80) {
            return (port === undefined || port === null || port === '' || port === conditions.port.toString());
        }
        if (conditions.protocol === 'https' && conditions.port === 443) {
            return (port === undefined || port === null || port === '' || port === conditions.port.toString());
        }
        return port === conditions.port.toString();
    }
}
exports.HeadlessChromiumDriver = HeadlessChromiumDriver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL3NlcnZlci9icm93c2Vycy9jaHJvbWl1bS9kcml2ZXIvY2hyb21pdW1fZHJpdmVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9yZXBvcnRpbmcvc2VydmVyL2Jyb3dzZXJzL2Nocm9taXVtL2RyaXZlci9jaHJvbWl1bV9kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBR0gsNkJBQXdDO0FBb0J4QyxNQUFNLGlCQUFpQixHQUFXLEdBQUcsQ0FBQztBQUV0QyxNQUFhLHNCQUFzQjtJQUlqQyxZQUFZLElBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQXlCO1FBQzlELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FDZixHQUFXLEVBQ1gsRUFDRSxrQkFBa0IsRUFDbEIsZUFBZSxHQUNxRDtRQUV0RSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUF1QixFQUFFLEVBQUU7WUFDbEQsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUU7Z0JBQ3pGLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDRCQUE0QixrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztvQkFDMUIsT0FBTyxFQUFFO3dCQUNQLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxFQUFFO3dCQUMvQixHQUFHLGtCQUFrQixDQUFDLE9BQU87cUJBQzlCO2lCQUNGLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZFLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQy9CO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFDN0QsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWdDO1FBQ3RELElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSSxlQUFlLEVBQUU7WUFDbkIsTUFBTSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsZUFBZSxDQUFDO1lBQ3hFLElBQUksR0FBRztnQkFDTCxDQUFDLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsTUFBTTtnQkFDakMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLEtBQUs7YUFDaEMsQ0FBQztTQUNIO1FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM1QyxJQUFJO1NBQ0wsQ0FBQyxDQUFDO1FBRUgsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQW1CO1FBQ3RELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDckQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBZ0IsRUFBRSxPQUE0QixFQUFFO1FBQzNFLE1BQU0sRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRWpELElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSTtZQUNGLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzFDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLHVFQUF1RTtnQkFDdkUseUNBQXlDO2dCQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsUUFBUSxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ25DLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBRSxDQUFDLFNBQVM7b0JBQ25ELElBQUksRUFBRSxFQUFFO2lCQUNULENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbURBQW1EO2FBQzdIO1lBQ0QsTUFBTSxHQUFHLENBQUM7U0FDWDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixRQUFRLFdBQVcsQ0FBQyxDQUFDO1FBQzFELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPLENBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBaUQ7UUFDMUYsT0FBTyxJQUFJLEVBQUU7WUFDWCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLE1BQU0sS0FBSyxPQUFPLEVBQUU7Z0JBQ3RCLE9BQU87YUFDUjtZQUVELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztTQUMxRDtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQXVCO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDhCQUE4QixLQUFLLGFBQWEsTUFBTSxXQUFXLElBQUksRUFBRSxDQUFDLENBQUM7UUFFM0YsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUMxQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDakMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sdUJBQXVCLENBQUMsVUFBd0MsRUFBRSxHQUFXO1FBQ25GLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxXQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFN0QsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzFCLHNGQUFzRjtZQUN0Rix3RkFBd0Y7WUFDeEYsd0VBQXdFO1lBQ3hFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztTQUNyRTtRQUVELE9BQU8sQ0FDTCxRQUFRLEtBQUssVUFBVSxDQUFDLFFBQVE7WUFDaEMsUUFBUSxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsR0FBRztZQUN0QyxJQUFJLENBQUMsOEJBQThCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztZQUNyRCxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQy9DLENBQUM7SUFDSixDQUFDO0lBRU8sOEJBQThCLENBQ3BDLFVBQXdDLEVBQ3hDLElBQXdCO1FBRXhCLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxNQUFNLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDNUQsT0FBTyxDQUNMLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRSxJQUFJLElBQUksS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUMxRixDQUFDO1NBQ0g7UUFFRCxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQzlELE9BQU8sQ0FDTCxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FDMUYsQ0FBQztTQUNIO1FBRUQsT0FBTyxJQUFJLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0NBQ0Y7QUFoSkQsd0RBZ0pDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgQ2hyb21lIGZyb20gJ3B1cHBldGVlci1jb3JlJztcbmltcG9ydCB7IHBhcnNlIGFzIHBhcnNlVXJsIH0gZnJvbSAndXJsJztcbmltcG9ydCB7XG4gIENvbmRpdGlvbmFsSGVhZGVycyxcbiAgQ29uZGl0aW9uYWxIZWFkZXJzQ29uZGl0aW9ucyxcbiAgRWxlbWVudFBvc2l0aW9uLFxuICBFdmFsQXJncyxcbiAgRXZhbEZuLFxuICBFdmFsdWF0ZU9wdGlvbnMsXG4gIExvZ2dlcixcbiAgVmlld1pvb21XaWR0aEhlaWdodCxcbn0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENocm9taXVtRHJpdmVyT3B0aW9ucyB7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5pbnRlcmZhY2UgV2FpdEZvclNlbGVjdG9yT3B0cyB7XG4gIHNpbGVudD86IGJvb2xlYW47XG59XG5cbmNvbnN0IFdBSVRfRk9SX0RFTEFZX01TOiBudW1iZXIgPSAxMDA7XG5cbmV4cG9ydCBjbGFzcyBIZWFkbGVzc0Nocm9taXVtRHJpdmVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwYWdlOiBDaHJvbWUuUGFnZTtcbiAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXI6IExvZ2dlcjtcblxuICBjb25zdHJ1Y3RvcihwYWdlOiBDaHJvbWUuUGFnZSwgeyBsb2dnZXIgfTogQ2hyb21pdW1Ecml2ZXJPcHRpb25zKSB7XG4gICAgdGhpcy5wYWdlID0gcGFnZTtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlci5jbG9uZShbJ2hlYWRsZXNzLWNocm9taXVtLWRyaXZlciddKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBvcGVuKFxuICAgIHVybDogc3RyaW5nLFxuICAgIHtcbiAgICAgIGNvbmRpdGlvbmFsSGVhZGVycyxcbiAgICAgIHdhaXRGb3JTZWxlY3RvcixcbiAgICB9OiB7IGNvbmRpdGlvbmFsSGVhZGVyczogQ29uZGl0aW9uYWxIZWFkZXJzOyB3YWl0Rm9yU2VsZWN0b3I6IHN0cmluZyB9XG4gICkge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBvcGVuaW5nIHVybCAke3VybH1gKTtcbiAgICBhd2FpdCB0aGlzLnBhZ2Uuc2V0UmVxdWVzdEludGVyY2VwdGlvbih0cnVlKTtcbiAgICB0aGlzLnBhZ2Uub24oJ3JlcXVlc3QnLCAoaW50ZXJjZXB0ZWRSZXF1ZXN0OiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLl9zaG91bGRVc2VDdXN0b21IZWFkZXJzKGNvbmRpdGlvbmFsSGVhZGVycy5jb25kaXRpb25zLCBpbnRlcmNlcHRlZFJlcXVlc3QudXJsKCkpKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBVc2luZyBjdXN0b20gaGVhZGVycyBmb3IgJHtpbnRlcmNlcHRlZFJlcXVlc3QudXJsKCl9YCk7XG4gICAgICAgIGludGVyY2VwdGVkUmVxdWVzdC5jb250aW51ZSh7XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgLi4uaW50ZXJjZXB0ZWRSZXF1ZXN0LmhlYWRlcnMoKSxcbiAgICAgICAgICAgIC4uLmNvbmRpdGlvbmFsSGVhZGVycy5oZWFkZXJzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYE5vIGN1c3RvbSBoZWFkZXJzIGZvciAke2ludGVyY2VwdGVkUmVxdWVzdC51cmwoKX1gKTtcbiAgICAgICAgaW50ZXJjZXB0ZWRSZXF1ZXN0LmNvbnRpbnVlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhd2FpdCB0aGlzLnBhZ2UuZ290byh1cmwsIHsgd2FpdFVudGlsOiAnZG9tY29udGVudGxvYWRlZCcgfSk7XG4gICAgYXdhaXQgdGhpcy53YWl0Rm9yU2VsZWN0b3Iod2FpdEZvclNlbGVjdG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzY3JlZW5zaG90KGVsZW1lbnRQb3NpdGlvbjogRWxlbWVudFBvc2l0aW9uKSB7XG4gICAgbGV0IGNsaXA7XG4gICAgaWYgKGVsZW1lbnRQb3NpdGlvbikge1xuICAgICAgY29uc3QgeyBib3VuZGluZ0NsaWVudFJlY3QsIHNjcm9sbCA9IHsgeDogMCwgeTogMCB9IH0gPSBlbGVtZW50UG9zaXRpb247XG4gICAgICBjbGlwID0ge1xuICAgICAgICB4OiBib3VuZGluZ0NsaWVudFJlY3QubGVmdCArIHNjcm9sbC54LFxuICAgICAgICB5OiBib3VuZGluZ0NsaWVudFJlY3QudG9wICsgc2Nyb2xsLnksXG4gICAgICAgIGhlaWdodDogYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodCxcbiAgICAgICAgd2lkdGg6IGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3Qgc2NyZWVuc2hvdCA9IGF3YWl0IHRoaXMucGFnZS5zY3JlZW5zaG90KHtcbiAgICAgIGNsaXAsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2NyZWVuc2hvdC50b1N0cmluZygnYmFzZTY0Jyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZXZhbHVhdGUoeyBmbiwgYXJncyA9IFtdIH06IEV2YWx1YXRlT3B0aW9ucykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucGFnZS5ldmFsdWF0ZShmbiwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB3YWl0Rm9yU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZywgb3B0czogV2FpdEZvclNlbGVjdG9yT3B0cyA9IHt9KSB7XG4gICAgY29uc3QgeyBzaWxlbnQgPSBmYWxzZSB9ID0gb3B0cztcbiAgICB0aGlzLmxvZ2dlci5kZWJ1Zyhgd2FpdEZvclNlbGVjdG9yICR7c2VsZWN0b3J9YCk7XG5cbiAgICBsZXQgcmVzcDtcbiAgICB0cnkge1xuICAgICAgcmVzcCA9IGF3YWl0IHRoaXMucGFnZS53YWl0Rm9yKHNlbGVjdG9yKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIC8vIFByb3ZpZGUgc29tZSB0cm91Ymxlc2hvb3RpbmcgaW5mbyB0byBzZWUgaWYgd2UncmUgb24gdGhlIGxvZ2luIHBhZ2UsXG4gICAgICAgIC8vIFwiS2liYW5hIGNvdWxkIG5vdCBsb2FkIGNvcnJlY3RseVwiLCBldGNcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYHdhaXRGb3JTZWxlY3RvciAke3NlbGVjdG9yfSBmYWlsZWQgb24gJHt0aGlzLnBhZ2UudXJsKCl9YCk7XG4gICAgICAgIGNvbnN0IHBhZ2VUZXh0ID0gYXdhaXQgdGhpcy5ldmFsdWF0ZSh7XG4gICAgICAgICAgZm46ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSEuaW5uZXJUZXh0LFxuICAgICAgICAgIGFyZ3M6IFtdLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYFBhZ2UgcGxhaW4gdGV4dDogJHtwYWdlVGV4dC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyl9YCk7IC8vIHJlcGxhY2UgbmV3bGluZSB3aXRoIGVzY2FwZWQgZm9yIHNpbmdsZSBsb2cgbGluZVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKGB3YWl0Rm9yU2VsZWN0b3IgJHtzZWxlY3Rvcn0gcmVzb2x2ZWRgKTtcbiAgICByZXR1cm4gcmVzcDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB3YWl0Rm9yPFQ+KHsgZm4sIGFyZ3MsIHRvRXF1YWwgfTogeyBmbjogRXZhbEZuPFQ+OyBhcmdzOiBFdmFsQXJnczsgdG9FcXVhbDogVCB9KSB7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZXZhbHVhdGUoeyBmbiwgYXJncyB9KTtcbiAgICAgIGlmIChyZXN1bHQgPT09IHRvRXF1YWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgV0FJVF9GT1JfREVMQVlfTVMpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2V0Vmlld3BvcnQoeyB3aWR0aCwgaGVpZ2h0LCB6b29tIH06IFZpZXdab29tV2lkdGhIZWlnaHQpIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgU2V0dGluZyB2aWV3cG9ydCB0byB3aWR0aDogJHt3aWR0aH0sIGhlaWdodDogJHtoZWlnaHR9LCB6b29tOiAke3pvb219YCk7XG5cbiAgICBhd2FpdCB0aGlzLnBhZ2Uuc2V0Vmlld3BvcnQoe1xuICAgICAgd2lkdGg6IE1hdGguZmxvb3Iod2lkdGggLyB6b29tKSxcbiAgICAgIGhlaWdodDogTWF0aC5mbG9vcihoZWlnaHQgLyB6b29tKSxcbiAgICAgIGRldmljZVNjYWxlRmFjdG9yOiB6b29tLFxuICAgICAgaXNNb2JpbGU6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hvdWxkVXNlQ3VzdG9tSGVhZGVycyhjb25kaXRpb25zOiBDb25kaXRpb25hbEhlYWRlcnNDb25kaXRpb25zLCB1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHsgaG9zdG5hbWUsIHByb3RvY29sLCBwb3J0LCBwYXRobmFtZSB9ID0gcGFyc2VVcmwodXJsKTtcblxuICAgIGlmIChwYXRobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBUaGVyZSdzIGEgZGlzY3JlcGFuY3kgYmV0d2VlbiB0aGUgTm9kZUpTIGRvY3MgYW5kIHRoZSB0eXBlc2NyaXB0IHR5cGVzLiBOb2RlSlMgZG9jc1xuICAgICAgLy8ganVzdCBzYXkgJ3N0cmluZycgYW5kIHRoZSB0eXBlc2NyaXB0IHR5cGVzIHNheSAnc3RyaW5nIHwgdW5kZWZpbmVkJy4gV2UgaGF2ZW4ndCBoaXQgYVxuICAgICAgLy8gc2l0dWF0aW9uIHdoZXJlIGl0J3MgdW5kZWZpbmVkIGJ1dCBoZXJlJ3MgYW4gZXhwbGljaXQgRXJyb3IgaWYgd2UgZG8uXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHBhdGhuYW1lIGlzIHVuZGVmaW5lZCwgZG9uJ3Qga25vdyBob3cgdG8gcHJvY2VlZGApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBob3N0bmFtZSA9PT0gY29uZGl0aW9ucy5ob3N0bmFtZSAmJlxuICAgICAgcHJvdG9jb2wgPT09IGAke2NvbmRpdGlvbnMucHJvdG9jb2x9OmAgJiZcbiAgICAgIHRoaXMuX3Nob3VsZFVzZUN1c3RvbUhlYWRlcnNGb3JQb3J0KGNvbmRpdGlvbnMsIHBvcnQpICYmXG4gICAgICBwYXRobmFtZS5zdGFydHNXaXRoKGAke2NvbmRpdGlvbnMuYmFzZVBhdGh9L2ApXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3VsZFVzZUN1c3RvbUhlYWRlcnNGb3JQb3J0KFxuICAgIGNvbmRpdGlvbnM6IENvbmRpdGlvbmFsSGVhZGVyc0NvbmRpdGlvbnMsXG4gICAgcG9ydDogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICkge1xuICAgIGlmIChjb25kaXRpb25zLnByb3RvY29sID09PSAnaHR0cCcgJiYgY29uZGl0aW9ucy5wb3J0ID09PSA4MCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgcG9ydCA9PT0gdW5kZWZpbmVkIHx8IHBvcnQgPT09IG51bGwgfHwgcG9ydCA9PT0gJycgfHwgcG9ydCA9PT0gY29uZGl0aW9ucy5wb3J0LnRvU3RyaW5nKClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmRpdGlvbnMucHJvdG9jb2wgPT09ICdodHRwcycgJiYgY29uZGl0aW9ucy5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHBvcnQgPT09IHVuZGVmaW5lZCB8fCBwb3J0ID09PSBudWxsIHx8IHBvcnQgPT09ICcnIHx8IHBvcnQgPT09IGNvbmRpdGlvbnMucG9ydC50b1N0cmluZygpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBwb3J0ID09PSBjb25kaXRpb25zLnBvcnQudG9TdHJpbmcoKTtcbiAgfVxufVxuIl19