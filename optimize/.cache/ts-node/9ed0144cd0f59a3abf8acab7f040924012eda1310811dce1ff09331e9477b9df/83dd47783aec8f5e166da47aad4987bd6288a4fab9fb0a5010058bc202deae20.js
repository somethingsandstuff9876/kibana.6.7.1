"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SpacesAuditLogger {
    constructor(config, auditLogger) {
        this.enabled =
            config.get('xpack.security.enabled') && config.get('xpack.security.audit.enabled');
        this.auditLogger = auditLogger;
    }
    spacesAuthorizationFailure(username, action, spaceIds) {
        if (!this.enabled) {
            return;
        }
        this.auditLogger.log('spaces_authorization_failure', `${username} unauthorized to ${action}${spaceIds ? ' ' + spaceIds.join(',') : ''} spaces`, {
            username,
            action,
            spaceIds,
        });
    }
    spacesAuthorizationSuccess(username, action, spaceIds) {
        if (!this.enabled) {
            return;
        }
        this.auditLogger.log('spaces_authorization_success', `${username} authorized to ${action}${spaceIds ? ' ' + spaceIds.join(',') : ''} spaces`, {
            username,
            action,
            spaceIds,
        });
    }
}
exports.SpacesAuditLogger = SpacesAuditLogger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvYXVkaXRfbG9nZ2VyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9zcGFjZXMvc2VydmVyL2xpYi9hdWRpdF9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsTUFBYSxpQkFBaUI7SUFJNUIsWUFBWSxNQUFXLEVBQUUsV0FBZ0I7UUFDdkMsSUFBSSxDQUFDLE9BQU87WUFDVixNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFDTSwwQkFBMEIsQ0FBQyxRQUFnQixFQUFFLE1BQWMsRUFBRSxRQUFtQjtRQUNyRixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDbEIsOEJBQThCLEVBQzlCLEdBQUcsUUFBUSxvQkFBb0IsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUN6RjtZQUNFLFFBQVE7WUFDUixNQUFNO1lBQ04sUUFBUTtTQUNULENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTSwwQkFBMEIsQ0FBQyxRQUFnQixFQUFFLE1BQWMsRUFBRSxRQUFtQjtRQUNyRixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDbEIsOEJBQThCLEVBQzlCLEdBQUcsUUFBUSxrQkFBa0IsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUN2RjtZQUNFLFFBQVE7WUFDUixNQUFNO1lBQ04sUUFBUTtTQUNULENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXhDRCw4Q0F3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY2xhc3MgU3BhY2VzQXVkaXRMb2dnZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IGVuYWJsZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgYXVkaXRMb2dnZXI6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IGFueSwgYXVkaXRMb2dnZXI6IGFueSkge1xuICAgIHRoaXMuZW5hYmxlZCA9XG4gICAgICBjb25maWcuZ2V0KCd4cGFjay5zZWN1cml0eS5lbmFibGVkJykgJiYgY29uZmlnLmdldCgneHBhY2suc2VjdXJpdHkuYXVkaXQuZW5hYmxlZCcpO1xuICAgIHRoaXMuYXVkaXRMb2dnZXIgPSBhdWRpdExvZ2dlcjtcbiAgfVxuICBwdWJsaWMgc3BhY2VzQXV0aG9yaXphdGlvbkZhaWx1cmUodXNlcm5hbWU6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIHNwYWNlSWRzPzogc3RyaW5nW10pIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYXVkaXRMb2dnZXIubG9nKFxuICAgICAgJ3NwYWNlc19hdXRob3JpemF0aW9uX2ZhaWx1cmUnLFxuICAgICAgYCR7dXNlcm5hbWV9IHVuYXV0aG9yaXplZCB0byAke2FjdGlvbn0ke3NwYWNlSWRzID8gJyAnICsgc3BhY2VJZHMuam9pbignLCcpIDogJyd9IHNwYWNlc2AsXG4gICAgICB7XG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBhY3Rpb24sXG4gICAgICAgIHNwYWNlSWRzLFxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgc3BhY2VzQXV0aG9yaXphdGlvblN1Y2Nlc3ModXNlcm5hbWU6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIHNwYWNlSWRzPzogc3RyaW5nW10pIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYXVkaXRMb2dnZXIubG9nKFxuICAgICAgJ3NwYWNlc19hdXRob3JpemF0aW9uX3N1Y2Nlc3MnLFxuICAgICAgYCR7dXNlcm5hbWV9IGF1dGhvcml6ZWQgdG8gJHthY3Rpb259JHtzcGFjZUlkcyA/ICcgJyArIHNwYWNlSWRzLmpvaW4oJywnKSA6ICcnfSBzcGFjZXNgLFxuICAgICAge1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgYWN0aW9uLFxuICAgICAgICBzcGFjZUlkcyxcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=