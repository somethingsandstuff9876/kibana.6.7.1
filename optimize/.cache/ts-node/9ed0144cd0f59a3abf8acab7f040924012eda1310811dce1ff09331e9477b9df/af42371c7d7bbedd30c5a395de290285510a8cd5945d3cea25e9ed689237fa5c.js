"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = require("lodash");
const supportedLicenses = ['standard', 'gold', 'platinum', 'trial'];
class UMAuthDomain {
    constructor(adapter, libs) {
        this.adapter = adapter;
        this.adapter = adapter;
    }
    requestIsValid(request) {
        const license = this.adapter.getLicenseType();
        if (license === null) {
            throw boom_1.default.badRequest('Missing license information');
        }
        if (!supportedLicenses.some(licenseType => licenseType === license)) {
            throw boom_1.default.forbidden('License not supported');
        }
        if (this.adapter.licenseIsActive() === false) {
            throw boom_1.default.forbidden('License not active');
        }
        return this.checkRequest(request);
    }
    checkRequest(request) {
        const authenticated = lodash_1.get(request, 'auth.isAuthenticated', null);
        if (authenticated === null) {
            throw boom_1.default.forbidden('Missing authentication');
        }
        return authenticated;
    }
}
exports.UMAuthDomain = UMAuthDomain;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvZG9tYWlucy9hdXRoLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cHRpbWUvc2VydmVyL2xpYi9kb21haW5zL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUN4QixtQ0FBNkI7QUFHN0IsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRXBFLE1BQWEsWUFBWTtJQUN2QixZQUE2QixPQUFzQixFQUFFLElBQVE7UUFBaEMsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRU0sY0FBYyxDQUFDLE9BQVk7UUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM5QyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDcEIsTUFBTSxjQUFJLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDdEQ7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLE9BQU8sQ0FBQyxFQUFFO1lBQ25FLE1BQU0sY0FBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQy9DO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLEtBQUssRUFBRTtZQUM1QyxNQUFNLGNBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUM1QztRQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU8sWUFBWSxDQUFDLE9BQVk7UUFDL0IsTUFBTSxhQUFhLEdBQUcsWUFBRyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRSxJQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7WUFDMUIsTUFBTSxjQUFJLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUEzQkQsb0NBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgeyBnZXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgVU1BdXRoQWRhcHRlciB9IGZyb20gJy4uL2FkYXB0ZXJzL2F1dGgvYWRhcHRlcl90eXBlcyc7XG5cbmNvbnN0IHN1cHBvcnRlZExpY2Vuc2VzID0gWydzdGFuZGFyZCcsICdnb2xkJywgJ3BsYXRpbnVtJywgJ3RyaWFsJ107XG5cbmV4cG9ydCBjbGFzcyBVTUF1dGhEb21haW4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFkYXB0ZXI6IFVNQXV0aEFkYXB0ZXIsIGxpYnM6IHt9KSB7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHB1YmxpYyByZXF1ZXN0SXNWYWxpZChyZXF1ZXN0OiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBsaWNlbnNlID0gdGhpcy5hZGFwdGVyLmdldExpY2Vuc2VUeXBlKCk7XG4gICAgaWYgKGxpY2Vuc2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IEJvb20uYmFkUmVxdWVzdCgnTWlzc2luZyBsaWNlbnNlIGluZm9ybWF0aW9uJyk7XG4gICAgfVxuICAgIGlmICghc3VwcG9ydGVkTGljZW5zZXMuc29tZShsaWNlbnNlVHlwZSA9PiBsaWNlbnNlVHlwZSA9PT0gbGljZW5zZSkpIHtcbiAgICAgIHRocm93IEJvb20uZm9yYmlkZGVuKCdMaWNlbnNlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYWRhcHRlci5saWNlbnNlSXNBY3RpdmUoKSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IEJvb20uZm9yYmlkZGVuKCdMaWNlbnNlIG5vdCBhY3RpdmUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jaGVja1JlcXVlc3QocmVxdWVzdCk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrUmVxdWVzdChyZXF1ZXN0OiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBhdXRoZW50aWNhdGVkID0gZ2V0KHJlcXVlc3QsICdhdXRoLmlzQXV0aGVudGljYXRlZCcsIG51bGwpO1xuICAgIGlmIChhdXRoZW50aWNhdGVkID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBCb29tLmZvcmJpZGRlbignTWlzc2luZyBhdXRoZW50aWNhdGlvbicpO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aGVudGljYXRlZDtcbiAgfVxufVxuIl19