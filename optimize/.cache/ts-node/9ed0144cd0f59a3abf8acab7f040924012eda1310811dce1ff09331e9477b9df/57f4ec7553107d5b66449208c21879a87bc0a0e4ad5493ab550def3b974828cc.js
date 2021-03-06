"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
class TaskManagerLogger {
    constructor(log) {
        this.write = log;
    }
    error(msg) {
        this.log('error', msg);
    }
    warning(msg) {
        this.log('warning', msg);
    }
    debug(msg) {
        this.log('debug', msg);
    }
    info(msg) {
        this.log('info', msg);
    }
    log(type, msg) {
        this.write([type, 'task_manager'], msg);
    }
}
exports.TaskManagerLogger = TaskManagerLogger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdGFza19tYW5hZ2VyL2xpYi9sb2dnZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3Rhc2tfbWFuYWdlci9saWIvbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQWFILE1BQWEsaUJBQWlCO0lBRzVCLFlBQVksR0FBVTtRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQVc7UUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxHQUFXO1FBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBVztRQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQVc7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsR0FBVztRQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQTFCRCw4Q0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgdHlwZSBMb2dGbiA9IChwcmVmaXg6IHN0cmluZ1tdLCBtc2c6IHN0cmluZykgPT4gdm9pZDtcblxudHlwZSBTaW1wbGVMb2dGbiA9IChtc2c6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xuICBlcnJvcjogU2ltcGxlTG9nRm47XG4gIHdhcm5pbmc6IFNpbXBsZUxvZ0ZuO1xuICBkZWJ1ZzogU2ltcGxlTG9nRm47XG4gIGluZm86IFNpbXBsZUxvZ0ZuO1xufVxuXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXJMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXIge1xuICBwcml2YXRlIHdyaXRlOiBMb2dGbjtcblxuICBjb25zdHJ1Y3Rvcihsb2c6IExvZ0ZuKSB7XG4gICAgdGhpcy53cml0ZSA9IGxvZztcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihtc2c6IHN0cmluZykge1xuICAgIHRoaXMubG9nKCdlcnJvcicsIG1zZyk7XG4gIH1cblxuICBwdWJsaWMgd2FybmluZyhtc2c6IHN0cmluZykge1xuICAgIHRoaXMubG9nKCd3YXJuaW5nJywgbXNnKTtcbiAgfVxuXG4gIHB1YmxpYyBkZWJ1Zyhtc2c6IHN0cmluZykge1xuICAgIHRoaXMubG9nKCdkZWJ1ZycsIG1zZyk7XG4gIH1cblxuICBwdWJsaWMgaW5mbyhtc2c6IHN0cmluZykge1xuICAgIHRoaXMubG9nKCdpbmZvJywgbXNnKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nKHR5cGU6IHN0cmluZywgbXNnOiBzdHJpbmcpIHtcbiAgICB0aGlzLndyaXRlKFt0eXBlLCAndGFza19tYW5hZ2VyJ10sIG1zZyk7XG4gIH1cbn1cbiJdfQ==