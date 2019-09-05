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
// We use a zoom of two to bump up the resolution of the screenshot a bit.
const ZOOM = 2;
class PreserveLayout extends layout_1.Layout {
    constructor(size) {
        super(constants_1.LayoutTypes.PRESERVE_LAYOUT);
        this.selectors = {
            screenshot: '[data-shared-items-container]',
            renderComplete: '[data-shared-item]',
            itemsCountAttribute: 'data-shared-items-count',
            timefilterFromAttribute: 'data-shared-timefilter-from',
            timefilterToAttribute: 'data-shared-timefilter-to',
            toastHeader: '[data-test-subj="euiToastHeader"]',
        };
        this.groupCount = 1;
        this.height = size.height;
        this.width = size.width;
        this.scaledHeight = size.height * ZOOM;
        this.scaledWidth = size.width * ZOOM;
    }
    getCssOverridesPath() {
        return path_1.default.join(__dirname, 'preserve_layout.css');
    }
    getBrowserViewport() {
        return {
            height: this.scaledHeight,
            width: this.scaledWidth,
        };
    }
    getBrowserZoom() {
        return ZOOM;
    }
    getViewport() {
        return {
            height: this.scaledHeight,
            width: this.scaledWidth,
            zoom: ZOOM,
        };
    }
    getPdfImageSize() {
        return {
            height: this.height,
            width: this.width,
        };
    }
    getPdfPageOrientation() {
        return undefined;
    }
    getPdfPageSize(pageSizeParams) {
        return {
            height: this.height +
                pageSizeParams.pageMarginTop +
                pageSizeParams.pageMarginBottom +
                pageSizeParams.tableBorderWidth * 2 +
                pageSizeParams.headingHeight +
                pageSizeParams.subheadingHeight,
            width: this.width + pageSizeParams.pageMarginWidth * 2 + pageSizeParams.tableBorderWidth * 2,
        };
    }
}
exports.PreserveLayout = PreserveLayout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL2V4cG9ydF90eXBlcy9jb21tb24vbGF5b3V0cy9wcmVzZXJ2ZV9sYXlvdXQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3JlcG9ydGluZy9leHBvcnRfdHlwZXMvY29tbW9uL2xheW91dHMvcHJlc2VydmVfbGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCx3REFBd0I7QUFFeEIsNENBQTJDO0FBQzNDLHFDQUFrRDtBQUVsRCwwRUFBMEU7QUFDMUUsTUFBTSxJQUFJLEdBQVcsQ0FBQyxDQUFDO0FBRXZCLE1BQWEsY0FBZSxTQUFRLGVBQU07SUFnQnhDLFlBQVksSUFBVTtRQUNwQixLQUFLLENBQUMsdUJBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQWhCckIsY0FBUyxHQUFHO1lBQzFCLFVBQVUsRUFBRSwrQkFBK0I7WUFDM0MsY0FBYyxFQUFFLG9CQUFvQjtZQUNwQyxtQkFBbUIsRUFBRSx5QkFBeUI7WUFDOUMsdUJBQXVCLEVBQUUsNkJBQTZCO1lBQ3RELHFCQUFxQixFQUFFLDJCQUEyQjtZQUNsRCxXQUFXLEVBQUUsbUNBQW1DO1NBQ2pELENBQUM7UUFFYyxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBUTdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxtQkFBbUI7UUFDeEIsT0FBTyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxrQkFBa0I7UUFDdkIsT0FBTztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDeEIsQ0FBQztJQUNKLENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDdkIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDO0lBQ0osQ0FBQztJQUVNLGVBQWU7UUFDcEIsT0FBTztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFTSxxQkFBcUI7UUFDMUIsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxjQUE4QjtRQUNsRCxPQUFPO1lBQ0wsTUFBTSxFQUNKLElBQUksQ0FBQyxNQUFNO2dCQUNYLGNBQWMsQ0FBQyxhQUFhO2dCQUM1QixjQUFjLENBQUMsZ0JBQWdCO2dCQUMvQixjQUFjLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQztnQkFDbkMsY0FBYyxDQUFDLGFBQWE7Z0JBQzVCLGNBQWMsQ0FBQyxnQkFBZ0I7WUFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLGVBQWUsR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixHQUFHLENBQUM7U0FDN0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXRFRCx3Q0FzRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgTGF5b3V0VHlwZXMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgTGF5b3V0LCBQYWdlU2l6ZVBhcmFtcyB9IGZyb20gJy4vbGF5b3V0JztcblxuLy8gV2UgdXNlIGEgem9vbSBvZiB0d28gdG8gYnVtcCB1cCB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgc2NyZWVuc2hvdCBhIGJpdC5cbmNvbnN0IFpPT006IG51bWJlciA9IDI7XG5cbmV4cG9ydCBjbGFzcyBQcmVzZXJ2ZUxheW91dCBleHRlbmRzIExheW91dCB7XG4gIHB1YmxpYyByZWFkb25seSBzZWxlY3RvcnMgPSB7XG4gICAgc2NyZWVuc2hvdDogJ1tkYXRhLXNoYXJlZC1pdGVtcy1jb250YWluZXJdJyxcbiAgICByZW5kZXJDb21wbGV0ZTogJ1tkYXRhLXNoYXJlZC1pdGVtXScsXG4gICAgaXRlbXNDb3VudEF0dHJpYnV0ZTogJ2RhdGEtc2hhcmVkLWl0ZW1zLWNvdW50JyxcbiAgICB0aW1lZmlsdGVyRnJvbUF0dHJpYnV0ZTogJ2RhdGEtc2hhcmVkLXRpbWVmaWx0ZXItZnJvbScsXG4gICAgdGltZWZpbHRlclRvQXR0cmlidXRlOiAnZGF0YS1zaGFyZWQtdGltZWZpbHRlci10bycsXG4gICAgdG9hc3RIZWFkZXI6ICdbZGF0YS10ZXN0LXN1Ymo9XCJldWlUb2FzdEhlYWRlclwiXScsXG4gIH07XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyb3VwQ291bnQgPSAxO1xuICBwcml2YXRlIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IHdpZHRoOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NhbGVkSGVpZ2h0OiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NhbGVkV2lkdGg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihzaXplOiBTaXplKSB7XG4gICAgc3VwZXIoTGF5b3V0VHlwZXMuUFJFU0VSVkVfTEFZT1VUKTtcbiAgICB0aGlzLmhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSBzaXplLndpZHRoO1xuICAgIHRoaXMuc2NhbGVkSGVpZ2h0ID0gc2l6ZS5oZWlnaHQgKiBaT09NO1xuICAgIHRoaXMuc2NhbGVkV2lkdGggPSBzaXplLndpZHRoICogWk9PTTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDc3NPdmVycmlkZXNQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4oX19kaXJuYW1lLCAncHJlc2VydmVfbGF5b3V0LmNzcycpO1xuICB9XG5cbiAgcHVibGljIGdldEJyb3dzZXJWaWV3cG9ydCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiB0aGlzLnNjYWxlZEhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLnNjYWxlZFdpZHRoLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0QnJvd3Nlclpvb20oKSB7XG4gICAgcmV0dXJuIFpPT007XG4gIH1cblxuICBwdWJsaWMgZ2V0Vmlld3BvcnQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5zY2FsZWRIZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy5zY2FsZWRXaWR0aCxcbiAgICAgIHpvb206IFpPT00sXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRQZGZJbWFnZVNpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldFBkZlBhZ2VPcmllbnRhdGlvbigpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldFBkZlBhZ2VTaXplKHBhZ2VTaXplUGFyYW1zOiBQYWdlU2l6ZVBhcmFtcykge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6XG4gICAgICAgIHRoaXMuaGVpZ2h0ICtcbiAgICAgICAgcGFnZVNpemVQYXJhbXMucGFnZU1hcmdpblRvcCArXG4gICAgICAgIHBhZ2VTaXplUGFyYW1zLnBhZ2VNYXJnaW5Cb3R0b20gK1xuICAgICAgICBwYWdlU2l6ZVBhcmFtcy50YWJsZUJvcmRlcldpZHRoICogMiArXG4gICAgICAgIHBhZ2VTaXplUGFyYW1zLmhlYWRpbmdIZWlnaHQgK1xuICAgICAgICBwYWdlU2l6ZVBhcmFtcy5zdWJoZWFkaW5nSGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyBwYWdlU2l6ZVBhcmFtcy5wYWdlTWFyZ2luV2lkdGggKiAyICsgcGFnZVNpemVQYXJhbXMudGFibGVCb3JkZXJXaWR0aCAqIDIsXG4gICAgfTtcbiAgfVxufVxuIl19