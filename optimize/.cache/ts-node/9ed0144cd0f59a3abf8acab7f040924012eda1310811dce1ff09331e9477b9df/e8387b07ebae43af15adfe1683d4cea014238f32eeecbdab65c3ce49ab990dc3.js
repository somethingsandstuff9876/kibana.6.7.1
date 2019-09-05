"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const path_1 = tslib_1.__importDefault(require("path"));
const constants_1 = require("../constants");
const layout_1 = require("./layout");
class PrintLayout extends layout_1.Layout {
    constructor(server) {
        super(constants_1.LayoutTypes.PRINT);
        this.selectors = {
            screenshot: '[data-shared-item]',
            renderComplete: '[data-shared-item]',
            itemsCountAttribute: 'data-shared-items-count',
            timefilterFromAttribute: 'data-shared-timefilter-from',
            timefilterToAttribute: 'data-shared-timefilter-to',
            toastHeader: '[data-test-subj="euiToastHeader"]',
        };
        this.groupCount = 2;
        this.captureConfig = server.config().get('xpack.reporting.capture');
    }
    getCssOverridesPath() {
        return path_1.default.join(__dirname, 'print.css');
    }
    getBrowserViewport() {
        return this.captureConfig.viewport;
    }
    getBrowserZoom() {
        return this.captureConfig.zoom;
    }
    getViewport(itemsCount) {
        return {
            zoom: this.captureConfig.zoom,
            width: this.captureConfig.viewport.width,
            height: this.captureConfig.viewport.height * itemsCount,
        };
    }
    async positionElements(browser) {
        const elementSize = {
            width: this.captureConfig.viewport.width / this.captureConfig.zoom,
            height: this.captureConfig.viewport.height / this.captureConfig.zoom,
        };
        const evalOptions = {
            fn: (selector, height, width) => {
                const visualizations = document.querySelectorAll(selector);
                const visualizationsLength = visualizations.length;
                for (let i = 0; i < visualizationsLength; i++) {
                    const visualization = visualizations[i];
                    const style = visualization.style;
                    style.position = 'fixed';
                    style.top = `${height * i}px`;
                    style.left = '0';
                    style.width = `${width}px`;
                    style.height = `${height}px`;
                    style.zIndex = '1';
                    style.backgroundColor = 'inherit';
                }
            },
            args: [this.selectors.screenshot, elementSize.height, elementSize.width],
        };
        await browser.evaluate(evalOptions);
    }
    getPdfImageSize() {
        return {
            width: 500,
        };
    }
    getPdfPageOrientation() {
        return 'portrait';
    }
    getPdfPageSize() {
        return 'A4';
    }
}
exports.PrintLayout = PrintLayout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL2V4cG9ydF90eXBlcy9jb21tb24vbGF5b3V0cy9wcmludF9sYXlvdXQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3JlcG9ydGluZy9leHBvcnRfdHlwZXMvY29tbW9uL2xheW91dHMvcHJpbnRfbGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCx3REFBd0I7QUFFeEIsNENBQTJDO0FBQzNDLHFDQUFrQztBQU9sQyxNQUFhLFdBQVksU0FBUSxlQUFNO0lBY3JDLFlBQVksTUFBaUI7UUFDM0IsS0FBSyxDQUFDLHVCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFkWCxjQUFTLEdBQUc7WUFDMUIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxjQUFjLEVBQUUsb0JBQW9CO1lBQ3BDLG1CQUFtQixFQUFFLHlCQUF5QjtZQUM5Qyx1QkFBdUIsRUFBRSw2QkFBNkI7WUFDdEQscUJBQXFCLEVBQUUsMkJBQTJCO1lBQ2xELFdBQVcsRUFBRSxtQ0FBbUM7U0FDakQsQ0FBQztRQUVjLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFNN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVNLG1CQUFtQjtRQUN4QixPQUFPLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSxrQkFBa0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxXQUFXLENBQUMsVUFBa0I7UUFDbkMsT0FBTztZQUNMLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUk7WUFDN0IsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUs7WUFDeEMsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxVQUFVO1NBQ3hELENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQXNCO1FBQ2xELE1BQU0sV0FBVyxHQUFTO1lBQ3hCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJO1lBQ2xFLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJO1NBQ3JFLENBQUM7UUFDRixNQUFNLFdBQVcsR0FBb0I7WUFDbkMsRUFBRSxFQUFFLENBQUMsUUFBZ0IsRUFBRSxNQUFjLEVBQUUsS0FBYSxFQUFFLEVBQUU7Z0JBQ3RELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQTRCLENBQUM7Z0JBQ3RGLE1BQU0sb0JBQW9CLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztnQkFFbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLG9CQUFvQixFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3QyxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7b0JBQ2xDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO29CQUN6QixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUM5QixLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztvQkFDakIsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLEtBQUssSUFBSSxDQUFDO29CQUMzQixLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO29CQUNuQixLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztpQkFDbkM7WUFDSCxDQUFDO1lBQ0QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDO1NBQ3pFLENBQUM7UUFFRixNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLGVBQWU7UUFDcEIsT0FBTztZQUNMLEtBQUssRUFBRSxHQUFHO1NBQ1gsQ0FBQztJQUNKLENBQUM7SUFFTSxxQkFBcUI7UUFDMUIsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVNLGNBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFoRkQsa0NBZ0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRXZhbHVhdGVPcHRpb25zLCBLYm5TZXJ2ZXIsIFNpemUgfSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBMYXlvdXRUeXBlcyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgeyBDYXB0dXJlQ29uZmlnIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBCcm93c2VyQ2xpZW50IHtcbiAgZXZhbHVhdGU6IChldmFsdWF0ZU9wdGlvbnM6IEV2YWx1YXRlT3B0aW9ucykgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFByaW50TGF5b3V0IGV4dGVuZHMgTGF5b3V0IHtcbiAgcHVibGljIHJlYWRvbmx5IHNlbGVjdG9ycyA9IHtcbiAgICBzY3JlZW5zaG90OiAnW2RhdGEtc2hhcmVkLWl0ZW1dJyxcbiAgICByZW5kZXJDb21wbGV0ZTogJ1tkYXRhLXNoYXJlZC1pdGVtXScsXG4gICAgaXRlbXNDb3VudEF0dHJpYnV0ZTogJ2RhdGEtc2hhcmVkLWl0ZW1zLWNvdW50JyxcbiAgICB0aW1lZmlsdGVyRnJvbUF0dHJpYnV0ZTogJ2RhdGEtc2hhcmVkLXRpbWVmaWx0ZXItZnJvbScsXG4gICAgdGltZWZpbHRlclRvQXR0cmlidXRlOiAnZGF0YS1zaGFyZWQtdGltZWZpbHRlci10bycsXG4gICAgdG9hc3RIZWFkZXI6ICdbZGF0YS10ZXN0LXN1Ymo9XCJldWlUb2FzdEhlYWRlclwiXScsXG4gIH07XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyb3VwQ291bnQgPSAyO1xuXG4gIHByaXZhdGUgY2FwdHVyZUNvbmZpZzogQ2FwdHVyZUNvbmZpZztcblxuICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IEtiblNlcnZlcikge1xuICAgIHN1cGVyKExheW91dFR5cGVzLlBSSU5UKTtcbiAgICB0aGlzLmNhcHR1cmVDb25maWcgPSBzZXJ2ZXIuY29uZmlnKCkuZ2V0KCd4cGFjay5yZXBvcnRpbmcuY2FwdHVyZScpO1xuICB9XG5cbiAgcHVibGljIGdldENzc092ZXJyaWRlc1BhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbihfX2Rpcm5hbWUsICdwcmludC5jc3MnKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRCcm93c2VyVmlld3BvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwdHVyZUNvbmZpZy52aWV3cG9ydDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRCcm93c2VyWm9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXB0dXJlQ29uZmlnLnpvb207XG4gIH1cblxuICBwdWJsaWMgZ2V0Vmlld3BvcnQoaXRlbXNDb3VudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHpvb206IHRoaXMuY2FwdHVyZUNvbmZpZy56b29tLFxuICAgICAgd2lkdGg6IHRoaXMuY2FwdHVyZUNvbmZpZy52aWV3cG9ydC53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5jYXB0dXJlQ29uZmlnLnZpZXdwb3J0LmhlaWdodCAqIGl0ZW1zQ291bnQsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwb3NpdGlvbkVsZW1lbnRzKGJyb3dzZXI6IEJyb3dzZXJDbGllbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBlbGVtZW50U2l6ZTogU2l6ZSA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLmNhcHR1cmVDb25maWcudmlld3BvcnQud2lkdGggLyB0aGlzLmNhcHR1cmVDb25maWcuem9vbSxcbiAgICAgIGhlaWdodDogdGhpcy5jYXB0dXJlQ29uZmlnLnZpZXdwb3J0LmhlaWdodCAvIHRoaXMuY2FwdHVyZUNvbmZpZy56b29tLFxuICAgIH07XG4gICAgY29uc3QgZXZhbE9wdGlvbnM6IEV2YWx1YXRlT3B0aW9ucyA9IHtcbiAgICAgIGZuOiAoc2VsZWN0b3I6IHN0cmluZywgaGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3QgdmlzdWFsaXphdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PjtcbiAgICAgICAgY29uc3QgdmlzdWFsaXphdGlvbnNMZW5ndGggPSB2aXN1YWxpemF0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXN1YWxpemF0aW9uc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgdmlzdWFsaXphdGlvbiA9IHZpc3VhbGl6YXRpb25zW2ldO1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0gdmlzdWFsaXphdGlvbi5zdHlsZTtcbiAgICAgICAgICBzdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgc3R5bGUudG9wID0gYCR7aGVpZ2h0ICogaX1weGA7XG4gICAgICAgICAgc3R5bGUubGVmdCA9ICcwJztcbiAgICAgICAgICBzdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgICBzdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICAgIHN0eWxlLnpJbmRleCA9ICcxJztcbiAgICAgICAgICBzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnaW5oZXJpdCc7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhcmdzOiBbdGhpcy5zZWxlY3RvcnMuc2NyZWVuc2hvdCwgZWxlbWVudFNpemUuaGVpZ2h0LCBlbGVtZW50U2l6ZS53aWR0aF0sXG4gICAgfTtcblxuICAgIGF3YWl0IGJyb3dzZXIuZXZhbHVhdGUoZXZhbE9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdldFBkZkltYWdlU2l6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IDUwMCxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldFBkZlBhZ2VPcmllbnRhdGlvbigpIHtcbiAgICByZXR1cm4gJ3BvcnRyYWl0JztcbiAgfVxuXG4gIHB1YmxpYyBnZXRQZGZQYWdlU2l6ZSgpIHtcbiAgICByZXR1cm4gJ0E0JztcbiAgfVxufVxuIl19