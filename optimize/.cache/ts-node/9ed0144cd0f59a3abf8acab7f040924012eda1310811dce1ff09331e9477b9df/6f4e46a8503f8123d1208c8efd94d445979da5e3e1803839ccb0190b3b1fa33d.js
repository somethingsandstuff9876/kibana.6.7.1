"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const filebeat_apache2_1 = require("./filebeat_apache2");
const filebeat_auditd_1 = require("./filebeat_auditd");
const filebeat_haproxy_1 = require("./filebeat_haproxy");
const filebeat_icinga_1 = require("./filebeat_icinga");
const filebeat_iis_1 = require("./filebeat_iis");
const filebeat_logstash_1 = require("./filebeat_logstash");
const filebeat_mongodb_1 = require("./filebeat_mongodb");
const filebeat_mysql_1 = require("./filebeat_mysql");
const filebeat_nginx_1 = require("./filebeat_nginx");
const filebeat_osquery_1 = require("./filebeat_osquery");
const filebeat_redis_1 = require("./filebeat_redis");
const filebeat_system_1 = require("./filebeat_system");
const filebeat_traefik_1 = require("./filebeat_traefik");
const generic_1 = require("./generic");
const generic_webserver_1 = require("./generic_webserver");
exports.getBuiltinRules = (genericMessageFields) => [
    ...filebeat_apache2_1.filebeatApache2Rules,
    ...filebeat_nginx_1.filebeatNginxRules,
    ...filebeat_redis_1.filebeatRedisRules,
    ...filebeat_system_1.filebeatSystemRules,
    ...filebeat_mysql_1.filebeatMySQLRules,
    ...filebeat_auditd_1.filebeatAuditdRules,
    ...filebeat_haproxy_1.filebeatHaproxyRules,
    ...filebeat_icinga_1.filebeatIcingaRules,
    ...filebeat_iis_1.filebeatIisRules,
    ...filebeat_logstash_1.filebeatLogstashRules,
    ...filebeat_mongodb_1.filebeatMongodbRules,
    ...filebeat_osquery_1.filebeatOsqueryRules,
    ...filebeat_traefik_1.filebeatTraefikRules,
    ...generic_webserver_1.genericWebserverRules,
    ...generic_1.getGenericRules(genericMessageFields),
    {
        when: {
            exists: ['source'],
        },
        format: [
            {
                constant: 'failed to format message from ',
            },
            {
                field: 'source',
            },
        ],
    },
    {
        when: {
            exists: [],
        },
        format: [
            {
                constant: 'failed to find message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2luZGV4LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2RvbWFpbnMvbG9nX2VudHJpZXNfZG9tYWluL2J1aWx0aW5fcnVsZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgseURBQTBEO0FBQzFELHVEQUF3RDtBQUN4RCx5REFBMEQ7QUFDMUQsdURBQXdEO0FBQ3hELGlEQUFrRDtBQUNsRCwyREFBNEQ7QUFDNUQseURBQTBEO0FBQzFELHFEQUFzRDtBQUN0RCxxREFBc0Q7QUFDdEQseURBQTBEO0FBQzFELHFEQUFzRDtBQUN0RCx1REFBd0Q7QUFDeEQseURBQTBEO0FBRTFELHVDQUE0QztBQUM1QywyREFBNEQ7QUFFL0MsUUFBQSxlQUFlLEdBQUcsQ0FBQyxvQkFBOEIsRUFBRSxFQUFFLENBQUM7SUFDakUsR0FBRyx1Q0FBb0I7SUFDdkIsR0FBRyxtQ0FBa0I7SUFDckIsR0FBRyxtQ0FBa0I7SUFDckIsR0FBRyxxQ0FBbUI7SUFDdEIsR0FBRyxtQ0FBa0I7SUFDckIsR0FBRyxxQ0FBbUI7SUFDdEIsR0FBRyx1Q0FBb0I7SUFDdkIsR0FBRyxxQ0FBbUI7SUFDdEIsR0FBRywrQkFBZ0I7SUFDbkIsR0FBRyx5Q0FBcUI7SUFDeEIsR0FBRyx1Q0FBb0I7SUFDdkIsR0FBRyx1Q0FBb0I7SUFDdkIsR0FBRyx1Q0FBb0I7SUFDdkIsR0FBRyx5Q0FBcUI7SUFDeEIsR0FBRyx5QkFBZSxDQUFDLG9CQUFvQixDQUFDO0lBQ3hDO1FBQ0UsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQ25CO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLGdDQUFnQzthQUMzQztZQUNEO2dCQUNFLEtBQUssRUFBRSxRQUFRO2FBQ2hCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLEVBQUU7U0FDWDtRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSx3QkFBd0I7YUFDbkM7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGZpbGViZWF0QXBhY2hlMlJ1bGVzIH0gZnJvbSAnLi9maWxlYmVhdF9hcGFjaGUyJztcbmltcG9ydCB7IGZpbGViZWF0QXVkaXRkUnVsZXMgfSBmcm9tICcuL2ZpbGViZWF0X2F1ZGl0ZCc7XG5pbXBvcnQgeyBmaWxlYmVhdEhhcHJveHlSdWxlcyB9IGZyb20gJy4vZmlsZWJlYXRfaGFwcm94eSc7XG5pbXBvcnQgeyBmaWxlYmVhdEljaW5nYVJ1bGVzIH0gZnJvbSAnLi9maWxlYmVhdF9pY2luZ2EnO1xuaW1wb3J0IHsgZmlsZWJlYXRJaXNSdWxlcyB9IGZyb20gJy4vZmlsZWJlYXRfaWlzJztcbmltcG9ydCB7IGZpbGViZWF0TG9nc3Rhc2hSdWxlcyB9IGZyb20gJy4vZmlsZWJlYXRfbG9nc3Rhc2gnO1xuaW1wb3J0IHsgZmlsZWJlYXRNb25nb2RiUnVsZXMgfSBmcm9tICcuL2ZpbGViZWF0X21vbmdvZGInO1xuaW1wb3J0IHsgZmlsZWJlYXRNeVNRTFJ1bGVzIH0gZnJvbSAnLi9maWxlYmVhdF9teXNxbCc7XG5pbXBvcnQgeyBmaWxlYmVhdE5naW54UnVsZXMgfSBmcm9tICcuL2ZpbGViZWF0X25naW54JztcbmltcG9ydCB7IGZpbGViZWF0T3NxdWVyeVJ1bGVzIH0gZnJvbSAnLi9maWxlYmVhdF9vc3F1ZXJ5JztcbmltcG9ydCB7IGZpbGViZWF0UmVkaXNSdWxlcyB9IGZyb20gJy4vZmlsZWJlYXRfcmVkaXMnO1xuaW1wb3J0IHsgZmlsZWJlYXRTeXN0ZW1SdWxlcyB9IGZyb20gJy4vZmlsZWJlYXRfc3lzdGVtJztcbmltcG9ydCB7IGZpbGViZWF0VHJhZWZpa1J1bGVzIH0gZnJvbSAnLi9maWxlYmVhdF90cmFlZmlrJztcblxuaW1wb3J0IHsgZ2V0R2VuZXJpY1J1bGVzIH0gZnJvbSAnLi9nZW5lcmljJztcbmltcG9ydCB7IGdlbmVyaWNXZWJzZXJ2ZXJSdWxlcyB9IGZyb20gJy4vZ2VuZXJpY193ZWJzZXJ2ZXInO1xuXG5leHBvcnQgY29uc3QgZ2V0QnVpbHRpblJ1bGVzID0gKGdlbmVyaWNNZXNzYWdlRmllbGRzOiBzdHJpbmdbXSkgPT4gW1xuICAuLi5maWxlYmVhdEFwYWNoZTJSdWxlcyxcbiAgLi4uZmlsZWJlYXROZ2lueFJ1bGVzLFxuICAuLi5maWxlYmVhdFJlZGlzUnVsZXMsXG4gIC4uLmZpbGViZWF0U3lzdGVtUnVsZXMsXG4gIC4uLmZpbGViZWF0TXlTUUxSdWxlcyxcbiAgLi4uZmlsZWJlYXRBdWRpdGRSdWxlcyxcbiAgLi4uZmlsZWJlYXRIYXByb3h5UnVsZXMsXG4gIC4uLmZpbGViZWF0SWNpbmdhUnVsZXMsXG4gIC4uLmZpbGViZWF0SWlzUnVsZXMsXG4gIC4uLmZpbGViZWF0TG9nc3Rhc2hSdWxlcyxcbiAgLi4uZmlsZWJlYXRNb25nb2RiUnVsZXMsXG4gIC4uLmZpbGViZWF0T3NxdWVyeVJ1bGVzLFxuICAuLi5maWxlYmVhdFRyYWVmaWtSdWxlcyxcbiAgLi4uZ2VuZXJpY1dlYnNlcnZlclJ1bGVzLFxuICAuLi5nZXRHZW5lcmljUnVsZXMoZ2VuZXJpY01lc3NhZ2VGaWVsZHMpLFxuICB7XG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ3NvdXJjZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnZmFpbGVkIHRvIGZvcm1hdCBtZXNzYWdlIGZyb20gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc291cmNlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogW10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdmYWlsZWQgdG8gZmluZCBtZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iXX0=