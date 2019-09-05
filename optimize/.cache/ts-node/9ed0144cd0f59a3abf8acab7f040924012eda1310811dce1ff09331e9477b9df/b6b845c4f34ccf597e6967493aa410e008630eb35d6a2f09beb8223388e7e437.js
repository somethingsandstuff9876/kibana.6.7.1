"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const path_1 = require("path");
const constants_1 = require("./common/constants");
const server_1 = require("./server");
exports.uptime = (kibana) => new kibana.Plugin({
    configPrefix: 'xpack.uptime',
    id: constants_1.PLUGIN.ID,
    require: ['kibana', 'elasticsearch', 'xpack_main'],
    publicDir: path_1.resolve(__dirname, 'public'),
    uiExports: {
        app: {
            description: i18n_1.i18n.translate('xpack.uptime.pluginDescription', {
                defaultMessage: 'Uptime monitoring',
                description: 'The description text that will be shown to users in Kibana',
            }),
            icon: 'plugins/uptime/icons/heartbeat_white.svg',
            euiIconType: 'uptimeApp',
            title: i18n_1.i18n.translate('xpack.uptime.uptimeFeatureCatalogueTitle', {
                defaultMessage: 'Uptime',
            }),
            main: 'plugins/uptime/app',
            order: 8900,
            url: '/app/uptime#/',
        },
        home: ['plugins/uptime/register_feature'],
    },
    init(server) {
        server_1.initServerWithKibana(server);
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL2luZGV4LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cHRpbWUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsb0NBQWlDO0FBRWpDLCtCQUErQjtBQUMvQixrREFBNEM7QUFDNUMscUNBQWdEO0FBRW5DLFFBQUEsTUFBTSxHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FDcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLFlBQVksRUFBRSxjQUFjO0lBQzVCLEVBQUUsRUFBRSxrQkFBTSxDQUFDLEVBQUU7SUFDYixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQztJQUNsRCxTQUFTLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7SUFDdkMsU0FBUyxFQUFFO1FBQ1QsR0FBRyxFQUFFO1lBQ0gsV0FBVyxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQzVELGNBQWMsRUFBRSxtQkFBbUI7Z0JBQ25DLFdBQVcsRUFBRSw0REFBNEQ7YUFDMUUsQ0FBQztZQUNGLElBQUksRUFBRSwwQ0FBMEM7WUFDaEQsV0FBVyxFQUFFLFdBQVc7WUFDeEIsS0FBSyxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsMENBQTBDLEVBQUU7Z0JBQ2hFLGNBQWMsRUFBRSxRQUFRO2FBQ3pCLENBQUM7WUFDRixJQUFJLEVBQUUsb0JBQW9CO1lBQzFCLEtBQUssRUFBRSxJQUFJO1lBQ1gsR0FBRyxFQUFFLGVBQWU7U0FDckI7UUFDRCxJQUFJLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztLQUMxQztJQUNELElBQUksQ0FBQyxNQUFjO1FBQ2pCLDZCQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBpMThuIH0gZnJvbSAnQGtibi9pMThuJztcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgUExVR0lOIH0gZnJvbSAnLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IGluaXRTZXJ2ZXJXaXRoS2liYW5hIH0gZnJvbSAnLi9zZXJ2ZXInO1xuXG5leHBvcnQgY29uc3QgdXB0aW1lID0gKGtpYmFuYTogYW55KSA9PlxuICBuZXcga2liYW5hLlBsdWdpbih7XG4gICAgY29uZmlnUHJlZml4OiAneHBhY2sudXB0aW1lJyxcbiAgICBpZDogUExVR0lOLklELFxuICAgIHJlcXVpcmU6IFsna2liYW5hJywgJ2VsYXN0aWNzZWFyY2gnLCAneHBhY2tfbWFpbiddLFxuICAgIHB1YmxpY0RpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKSxcbiAgICB1aUV4cG9ydHM6IHtcbiAgICAgIGFwcDoge1xuICAgICAgICBkZXNjcmlwdGlvbjogaTE4bi50cmFuc2xhdGUoJ3hwYWNrLnVwdGltZS5wbHVnaW5EZXNjcmlwdGlvbicsIHtcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ1VwdGltZSBtb25pdG9yaW5nJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBkZXNjcmlwdGlvbiB0ZXh0IHRoYXQgd2lsbCBiZSBzaG93biB0byB1c2VycyBpbiBLaWJhbmEnLFxuICAgICAgICB9KSxcbiAgICAgICAgaWNvbjogJ3BsdWdpbnMvdXB0aW1lL2ljb25zL2hlYXJ0YmVhdF93aGl0ZS5zdmcnLFxuICAgICAgICBldWlJY29uVHlwZTogJ3VwdGltZUFwcCcsXG4gICAgICAgIHRpdGxlOiBpMThuLnRyYW5zbGF0ZSgneHBhY2sudXB0aW1lLnVwdGltZUZlYXR1cmVDYXRhbG9ndWVUaXRsZScsIHtcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ1VwdGltZScsXG4gICAgICAgIH0pLFxuICAgICAgICBtYWluOiAncGx1Z2lucy91cHRpbWUvYXBwJyxcbiAgICAgICAgb3JkZXI6IDg5MDAsXG4gICAgICAgIHVybDogJy9hcHAvdXB0aW1lIy8nLFxuICAgICAgfSxcbiAgICAgIGhvbWU6IFsncGx1Z2lucy91cHRpbWUvcmVnaXN0ZXJfZmVhdHVyZSddLFxuICAgIH0sXG4gICAgaW5pdChzZXJ2ZXI6IFNlcnZlcikge1xuICAgICAgaW5pdFNlcnZlcldpdGhLaWJhbmEoc2VydmVyKTtcbiAgICB9LFxuICB9KTtcbiJdfQ==