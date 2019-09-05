"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const path_1 = require("path");
const kibana_index_1 = require("./server/kibana.index");
const saved_objects_1 = require("./server/saved_objects");
const APP_ID = 'infra';
function infra(kibana) {
    return new kibana.Plugin({
        id: APP_ID,
        configPrefix: 'xpack.infra',
        publicDir: path_1.resolve(__dirname, 'public'),
        require: ['kibana', 'elasticsearch'],
        uiExports: {
            app: {
                description: i18n_1.i18n.translate('xpack.infra.infrastructureDescription', {
                    defaultMessage: 'Explore your infrastructure',
                }),
                icon: 'plugins/infra/images/infra_mono_white.svg',
                main: 'plugins/infra/app',
                title: i18n_1.i18n.translate('xpack.infra.infrastructureTitle', {
                    defaultMessage: 'Infrastructure',
                }),
                listed: false,
                url: `/app/${APP_ID}#/home`,
            },
            styleSheetPaths: path_1.resolve(__dirname, 'public/index.scss'),
            home: ['plugins/infra/register_feature'],
            links: [
                {
                    description: i18n_1.i18n.translate('xpack.infra.linkInfrastructureDescription', {
                        defaultMessage: 'Explore your infrastructure',
                    }),
                    icon: 'plugins/infra/images/infra_mono_white.svg',
                    euiIconType: 'infraApp',
                    id: 'infra:home',
                    order: 8000,
                    title: i18n_1.i18n.translate('xpack.infra.linkInfrastructureTitle', {
                        defaultMessage: 'Infrastructure',
                    }),
                    url: `/app/${APP_ID}#/home`,
                },
                {
                    description: i18n_1.i18n.translate('xpack.infra.linkLogsDescription', {
                        defaultMessage: 'Explore your logs',
                    }),
                    icon: 'plugins/infra/images/logging_mono_white.svg',
                    euiIconType: 'loggingApp',
                    id: 'infra:logs',
                    order: 8001,
                    title: i18n_1.i18n.translate('xpack.infra.linkLogsTitle', {
                        defaultMessage: 'Logs',
                    }),
                    url: `/app/${APP_ID}#/logs`,
                },
            ],
            mappings: saved_objects_1.savedObjectMappings,
        },
        config(Joi) {
            return kibana_index_1.getConfigSchema(Joi);
        },
        init(server) {
            kibana_index_1.initServerWithKibana(server);
        },
    });
}
exports.infra = infra;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILG9DQUFpQztBQUVqQywrQkFBK0I7QUFFL0Isd0RBQXlGO0FBQ3pGLDBEQUE2RDtBQUU3RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFFdkIsU0FBZ0IsS0FBSyxDQUFDLE1BQVc7SUFDL0IsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkIsRUFBRSxFQUFFLE1BQU07UUFDVixZQUFZLEVBQUUsYUFBYTtRQUMzQixTQUFTLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDdkMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQztRQUNwQyxTQUFTLEVBQUU7WUFDVCxHQUFHLEVBQUU7Z0JBQ0gsV0FBVyxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsdUNBQXVDLEVBQUU7b0JBQ25FLGNBQWMsRUFBRSw2QkFBNkI7aUJBQzlDLENBQUM7Z0JBQ0YsSUFBSSxFQUFFLDJDQUEyQztnQkFDakQsSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsS0FBSyxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsaUNBQWlDLEVBQUU7b0JBQ3ZELGNBQWMsRUFBRSxnQkFBZ0I7aUJBQ2pDLENBQUM7Z0JBQ0YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsR0FBRyxFQUFFLFFBQVEsTUFBTSxRQUFRO2FBQzVCO1lBQ0QsZUFBZSxFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUM7WUFDeEQsSUFBSSxFQUFFLENBQUMsZ0NBQWdDLENBQUM7WUFDeEMsS0FBSyxFQUFFO2dCQUNMO29CQUNFLFdBQVcsRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLDJDQUEyQyxFQUFFO3dCQUN2RSxjQUFjLEVBQUUsNkJBQTZCO3FCQUM5QyxDQUFDO29CQUNGLElBQUksRUFBRSwyQ0FBMkM7b0JBQ2pELFdBQVcsRUFBRSxVQUFVO29CQUN2QixFQUFFLEVBQUUsWUFBWTtvQkFDaEIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsS0FBSyxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMscUNBQXFDLEVBQUU7d0JBQzNELGNBQWMsRUFBRSxnQkFBZ0I7cUJBQ2pDLENBQUM7b0JBQ0YsR0FBRyxFQUFFLFFBQVEsTUFBTSxRQUFRO2lCQUM1QjtnQkFDRDtvQkFDRSxXQUFXLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsRUFBRTt3QkFDN0QsY0FBYyxFQUFFLG1CQUFtQjtxQkFDcEMsQ0FBQztvQkFDRixJQUFJLEVBQUUsNkNBQTZDO29CQUNuRCxXQUFXLEVBQUUsWUFBWTtvQkFDekIsRUFBRSxFQUFFLFlBQVk7b0JBQ2hCLEtBQUssRUFBRSxJQUFJO29CQUNYLEtBQUssRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLDJCQUEyQixFQUFFO3dCQUNqRCxjQUFjLEVBQUUsTUFBTTtxQkFDdkIsQ0FBQztvQkFDRixHQUFHLEVBQUUsUUFBUSxNQUFNLFFBQVE7aUJBQzVCO2FBQ0Y7WUFDRCxRQUFRLEVBQUUsbUNBQW1CO1NBQzlCO1FBQ0QsTUFBTSxDQUFDLEdBQXdCO1lBQzdCLE9BQU8sOEJBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQWlCO1lBQ3BCLG1DQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBMURELHNCQTBEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGkxOG4gfSBmcm9tICdAa2JuL2kxOG4nO1xuaW1wb3J0IEpvaU5hbWVzcGFjZSBmcm9tICdqb2knO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBnZXRDb25maWdTY2hlbWEsIGluaXRTZXJ2ZXJXaXRoS2liYW5hLCBLYm5TZXJ2ZXIgfSBmcm9tICcuL3NlcnZlci9raWJhbmEuaW5kZXgnO1xuaW1wb3J0IHsgc2F2ZWRPYmplY3RNYXBwaW5ncyB9IGZyb20gJy4vc2VydmVyL3NhdmVkX29iamVjdHMnO1xuXG5jb25zdCBBUFBfSUQgPSAnaW5mcmEnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5mcmEoa2liYW5hOiBhbnkpIHtcbiAgcmV0dXJuIG5ldyBraWJhbmEuUGx1Z2luKHtcbiAgICBpZDogQVBQX0lELFxuICAgIGNvbmZpZ1ByZWZpeDogJ3hwYWNrLmluZnJhJyxcbiAgICBwdWJsaWNEaXI6IHJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyksXG4gICAgcmVxdWlyZTogWydraWJhbmEnLCAnZWxhc3RpY3NlYXJjaCddLFxuICAgIHVpRXhwb3J0czoge1xuICAgICAgYXBwOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBpMThuLnRyYW5zbGF0ZSgneHBhY2suaW5mcmEuaW5mcmFzdHJ1Y3R1cmVEZXNjcmlwdGlvbicsIHtcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ0V4cGxvcmUgeW91ciBpbmZyYXN0cnVjdHVyZScsXG4gICAgICAgIH0pLFxuICAgICAgICBpY29uOiAncGx1Z2lucy9pbmZyYS9pbWFnZXMvaW5mcmFfbW9ub193aGl0ZS5zdmcnLFxuICAgICAgICBtYWluOiAncGx1Z2lucy9pbmZyYS9hcHAnLFxuICAgICAgICB0aXRsZTogaTE4bi50cmFuc2xhdGUoJ3hwYWNrLmluZnJhLmluZnJhc3RydWN0dXJlVGl0bGUnLCB7XG4gICAgICAgICAgZGVmYXVsdE1lc3NhZ2U6ICdJbmZyYXN0cnVjdHVyZScsXG4gICAgICAgIH0pLFxuICAgICAgICBsaXN0ZWQ6IGZhbHNlLFxuICAgICAgICB1cmw6IGAvYXBwLyR7QVBQX0lEfSMvaG9tZWAsXG4gICAgICB9LFxuICAgICAgc3R5bGVTaGVldFBhdGhzOiByZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYy9pbmRleC5zY3NzJyksXG4gICAgICBob21lOiBbJ3BsdWdpbnMvaW5mcmEvcmVnaXN0ZXJfZmVhdHVyZSddLFxuICAgICAgbGlua3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBpMThuLnRyYW5zbGF0ZSgneHBhY2suaW5mcmEubGlua0luZnJhc3RydWN0dXJlRGVzY3JpcHRpb24nLCB7XG4gICAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ0V4cGxvcmUgeW91ciBpbmZyYXN0cnVjdHVyZScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaWNvbjogJ3BsdWdpbnMvaW5mcmEvaW1hZ2VzL2luZnJhX21vbm9fd2hpdGUuc3ZnJyxcbiAgICAgICAgICBldWlJY29uVHlwZTogJ2luZnJhQXBwJyxcbiAgICAgICAgICBpZDogJ2luZnJhOmhvbWUnLFxuICAgICAgICAgIG9yZGVyOiA4MDAwLFxuICAgICAgICAgIHRpdGxlOiBpMThuLnRyYW5zbGF0ZSgneHBhY2suaW5mcmEubGlua0luZnJhc3RydWN0dXJlVGl0bGUnLCB7XG4gICAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ0luZnJhc3RydWN0dXJlJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB1cmw6IGAvYXBwLyR7QVBQX0lEfSMvaG9tZWAsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogaTE4bi50cmFuc2xhdGUoJ3hwYWNrLmluZnJhLmxpbmtMb2dzRGVzY3JpcHRpb24nLCB7XG4gICAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ0V4cGxvcmUgeW91ciBsb2dzJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBpY29uOiAncGx1Z2lucy9pbmZyYS9pbWFnZXMvbG9nZ2luZ19tb25vX3doaXRlLnN2ZycsXG4gICAgICAgICAgZXVpSWNvblR5cGU6ICdsb2dnaW5nQXBwJyxcbiAgICAgICAgICBpZDogJ2luZnJhOmxvZ3MnLFxuICAgICAgICAgIG9yZGVyOiA4MDAxLFxuICAgICAgICAgIHRpdGxlOiBpMThuLnRyYW5zbGF0ZSgneHBhY2suaW5mcmEubGlua0xvZ3NUaXRsZScsIHtcbiAgICAgICAgICAgIGRlZmF1bHRNZXNzYWdlOiAnTG9ncycsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgdXJsOiBgL2FwcC8ke0FQUF9JRH0jL2xvZ3NgLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIG1hcHBpbmdzOiBzYXZlZE9iamVjdE1hcHBpbmdzLFxuICAgIH0sXG4gICAgY29uZmlnKEpvaTogdHlwZW9mIEpvaU5hbWVzcGFjZSkge1xuICAgICAgcmV0dXJuIGdldENvbmZpZ1NjaGVtYShKb2kpO1xuICAgIH0sXG4gICAgaW5pdChzZXJ2ZXI6IEtiblNlcnZlcikge1xuICAgICAgaW5pdFNlcnZlcldpdGhLaWJhbmEoc2VydmVyKTtcbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==