"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_types_1 = require("../browsers/browser_types");
exports.validateBrowser = async (browserFactory, log) => {
    if (browserFactory.type === browser_types_1.CHROMIUM) {
        return browserFactory
            .test({
            viewport: {
                width: 800,
                height: 600,
            },
        }, log)
            .then((browser) => {
            if (browser && browser.close) {
                browser.close();
            }
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL3NlcnZlci9saWIvdmFsaWRhdGVfYnJvd3Nlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL3NlcnZlci9saWIvdmFsaWRhdGVfYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLDZEQUFxRDtBQUV4QyxRQUFBLGVBQWUsR0FBRyxLQUFLLEVBQUUsY0FBbUIsRUFBRSxHQUE2QixFQUFFLEVBQUU7SUFDMUYsSUFBSSxjQUFjLENBQUMsSUFBSSxLQUFLLHdCQUFRLEVBQUU7UUFDcEMsT0FBTyxjQUFjO2FBQ2xCLElBQUksQ0FDSDtZQUNFLFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUsR0FBRztnQkFDVixNQUFNLEVBQUUsR0FBRzthQUNaO1NBQ0YsRUFDRCxHQUFHLENBQ0o7YUFDQSxJQUFJLENBQUMsQ0FBQyxPQUFpQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDNUIsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDTjtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5pbXBvcnQgKiBhcyBwdXBwZXRlZXIgZnJvbSAncHVwcGV0ZWVyLWNvcmUnO1xuaW1wb3J0IHsgQ0hST01JVU0gfSBmcm9tICcuLi9icm93c2Vycy9icm93c2VyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQnJvd3NlciA9IGFzeW5jIChicm93c2VyRmFjdG9yeTogYW55LCBsb2c6IChtZXNzYWdlOiBzdHJpbmcpID0+IGFueSkgPT4ge1xuICBpZiAoYnJvd3NlckZhY3RvcnkudHlwZSA9PT0gQ0hST01JVU0pIHtcbiAgICByZXR1cm4gYnJvd3NlckZhY3RvcnlcbiAgICAgIC50ZXN0KFxuICAgICAgICB7XG4gICAgICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBsb2dcbiAgICAgIClcbiAgICAgIC50aGVuKChicm93c2VyOiBwdXBwZXRlZXIuQnJvd3NlciB8IG51bGwpID0+IHtcbiAgICAgICAgaWYgKGJyb3dzZXIgJiYgYnJvd3Nlci5jbG9zZSkge1xuICAgICAgICAgIGJyb3dzZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn07XG4iXX0=