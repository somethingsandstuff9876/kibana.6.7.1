"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
// @ts-ignore
const audit_logger_1 = require("../../server/lib/audit_logger");
// @ts-ignore
const watch_status_and_license_to_initialize_1 = require("../../server/lib/watch_status_and_license_to_initialize");
const user_profile_registry_1 = require("../xpack_main/server/lib/user_profile_registry");
const mappings_json_1 = tslib_1.__importDefault(require("./mappings.json"));
const audit_logger_2 = require("./server/lib/audit_logger");
const check_license_1 = require("./server/lib/check_license");
const create_default_space_1 = require("./server/lib/create_default_space");
const create_spaces_service_1 = require("./server/lib/create_spaces_service");
const errors_1 = require("./server/lib/errors");
const get_active_space_1 = require("./server/lib/get_active_space");
const get_space_selector_url_1 = require("./server/lib/get_space_selector_url");
const get_spaces_usage_collector_1 = require("./server/lib/get_spaces_usage_collector");
const saved_objects_client_wrapper_factory_1 = require("./server/lib/saved_objects_client/saved_objects_client_wrapper_factory");
const space_request_interceptors_1 = require("./server/lib/space_request_interceptors");
const spaces_client_1 = require("./server/lib/spaces_client");
const spaces_tutorial_context_factory_1 = require("./server/lib/spaces_tutorial_context_factory");
const public_1 = require("./server/routes/api/public");
const v1_1 = require("./server/routes/api/v1");
exports.spaces = (kibana) => new kibana.Plugin({
    id: 'spaces',
    configPrefix: 'xpack.spaces',
    publicDir: path_1.resolve(__dirname, 'public'),
    require: ['kibana', 'elasticsearch', 'xpack_main'],
    config(Joi) {
        return Joi.object({
            enabled: Joi.boolean().default(true),
            maxSpaces: Joi.number().default(1000),
        }).default();
    },
    uiExports: {
        chromeNavControls: ['plugins/spaces/views/nav_control'],
        styleSheetPaths: path_1.resolve(__dirname, 'public/index.scss'),
        managementSections: ['plugins/spaces/views/management'],
        apps: [
            {
                id: 'space_selector',
                title: 'Spaces',
                main: 'plugins/spaces/views/space_selector',
                url: 'space_selector',
                hidden: true,
            },
        ],
        hacks: [],
        mappings: mappings_json_1.default,
        savedObjectSchemas: {
            space: {
                isNamespaceAgnostic: true,
            },
        },
        home: ['plugins/spaces/register_feature'],
        injectDefaultVars(server) {
            return {
                spaces: [],
                activeSpace: null,
                spaceSelectorURL: get_space_selector_url_1.getSpaceSelectorUrl(server.config()),
            };
        },
        async replaceInjectedVars(vars, request, server) {
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            try {
                vars.activeSpace = {
                    valid: true,
                    space: await get_active_space_1.getActiveSpace(spacesClient, request.getBasePath(), server.config().get('server.basePath')),
                };
            }
            catch (e) {
                vars.activeSpace = {
                    valid: false,
                    error: errors_1.wrapError(e).output.payload,
                };
            }
            return vars;
        },
    },
    async init(server) {
        const thisPlugin = this;
        const xpackMainPlugin = server.plugins.xpack_main;
        watch_status_and_license_to_initialize_1.watchStatusAndLicenseToInitialize(xpackMainPlugin, thisPlugin, async () => {
            await create_default_space_1.createDefaultSpace(server);
        });
        // Register a function that is called whenever the xpack info changes,
        // to re-compute the license check results for this plugin
        xpackMainPlugin.info
            .feature(thisPlugin.id)
            .registerLicenseCheckResultsGenerator(check_license_1.checkLicense);
        const spacesService = create_spaces_service_1.createSpacesService(server);
        server.expose('getSpaceId', (request) => spacesService.getSpaceId(request));
        const config = server.config();
        const spacesAuditLogger = new audit_logger_2.SpacesAuditLogger(config, new audit_logger_1.AuditLogger(server, 'spaces'));
        server.expose('spacesClient', {
            getScopedClient: (request) => {
                const adminCluster = server.plugins.elasticsearch.getCluster('admin');
                const { callWithRequest, callWithInternalUser } = adminCluster;
                const callCluster = (...args) => callWithRequest(request, ...args);
                const { savedObjects } = server;
                const internalRepository = savedObjects.getSavedObjectsRepository(callWithInternalUser);
                const callWithRequestRepository = savedObjects.getSavedObjectsRepository(callCluster);
                const authorization = server.plugins.security
                    ? server.plugins.security.authorization
                    : null;
                return new spaces_client_1.SpacesClient(spacesAuditLogger, authorization, callWithRequestRepository, server.config(), internalRepository, request);
            },
        });
        const { addScopedSavedObjectsClientWrapperFactory, types, } = server.savedObjects;
        addScopedSavedObjectsClientWrapperFactory(Number.MAX_VALUE, saved_objects_client_wrapper_factory_1.spacesSavedObjectsClientWrapperFactory(spacesService, types));
        server.addScopedTutorialContextFactory(spaces_tutorial_context_factory_1.createSpacesTutorialContextFactory(spacesService));
        v1_1.initPrivateApis(server);
        public_1.initPublicSpacesApi(server);
        space_request_interceptors_1.initSpacesRequestInterceptors(server);
        user_profile_registry_1.registerUserProfileCapabilityFactory(async (request) => {
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            let manageSecurity = false;
            if (server.plugins.security) {
                const { showLinks = false } = xpackMainPlugin.info.feature('security').getLicenseCheckResults() || {};
                manageSecurity = showLinks;
            }
            return {
                manageSpaces: await spacesClient.canEnumerateSpaces(),
                manageSecurity,
            };
        });
        // Register a function with server to manage the collection of usage stats
        server.usage.collectorSet.register(get_spaces_usage_collector_1.getSpacesUsageCollector(server));
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL2luZGV4LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9zcGFjZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILCtCQUErQjtBQUcvQixhQUFhO0FBQ2IsZ0VBQTREO0FBQzVELGFBQWE7QUFDYixvSEFBNEc7QUFDNUcsMEZBQXNHO0FBQ3RHLDRFQUF1QztBQUN2Qyw0REFBOEQ7QUFDOUQsOERBQTBEO0FBQzFELDRFQUF1RTtBQUN2RSw4RUFBeUU7QUFDekUsZ0RBQWdEO0FBQ2hELG9FQUErRDtBQUMvRCxnRkFBMEU7QUFDMUUsd0ZBQWtGO0FBQ2xGLGlJQUFnSTtBQUNoSSx3RkFBd0Y7QUFDeEYsOERBQTBEO0FBQzFELGtHQUFrRztBQUNsRyx1REFBaUU7QUFDakUsK0NBQXlEO0FBRTVDLFFBQUEsTUFBTSxHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FDcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLEVBQUUsRUFBRSxRQUFRO0lBQ1osWUFBWSxFQUFFLGNBQWM7SUFDNUIsU0FBUyxFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0lBQ3ZDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDO0lBRWxELE1BQU0sQ0FBQyxHQUFRO1FBQ2IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNwQyxTQUFTLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FDdEMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2YsQ0FBQztJ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TSxDQUFDLENBQUM7UUFFNUIsMERBQTZCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEMsNERBQW9DLENBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFFO1lBQ25ELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakYsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBRTNCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLEdBQ3pCLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHNCQUFzQixFQUFFLElBQUksRUFBRSxDQUFDO2dCQUMxRSxjQUFjLEdBQUcsU0FBUyxDQUFDO2FBQzVCO1lBRUQsT0FBTztnQkFDTCxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3JELGNBQWM7YUFDZixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCwwRUFBMEU7UUFDMUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG9EQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgU2F2ZWRPYmplY3RzU2VydmljZSB9IGZyb20gJ3NyYy9zZXJ2ZXIvc2F2ZWRfb2JqZWN0cyc7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeyBBdWRpdExvZ2dlciB9IGZyb20gJy4uLy4uL3NlcnZlci9saWIvYXVkaXRfbG9nZ2VyJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCB7IHdhdGNoU3RhdHVzQW5kTGljZW5zZVRvSW5pdGlhbGl6ZSB9IGZyb20gJy4uLy4uL3NlcnZlci9saWIvd2F0Y2hfc3RhdHVzX2FuZF9saWNlbnNlX3RvX2luaXRpYWxpemUnO1xuaW1wb3J0IHsgcmVnaXN0ZXJVc2VyUHJvZmlsZUNhcGFiaWxpdHlGYWN0b3J5IH0gZnJvbSAnLi4veHBhY2tfbWFpbi9zZXJ2ZXIvbGliL3VzZXJfcHJvZmlsZV9yZWdpc3RyeSc7XG5pbXBvcnQgbWFwcGluZ3MgZnJvbSAnLi9tYXBwaW5ncy5qc29uJztcbmltcG9ydCB7IFNwYWNlc0F1ZGl0TG9nZ2VyIH0gZnJvbSAnLi9zZXJ2ZXIvbGliL2F1ZGl0X2xvZ2dlcic7XG5pbXBvcnQgeyBjaGVja0xpY2Vuc2UgfSBmcm9tICcuL3NlcnZlci9saWIvY2hlY2tfbGljZW5zZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0U3BhY2UgfSBmcm9tICcuL3NlcnZlci9saWIvY3JlYXRlX2RlZmF1bHRfc3BhY2UnO1xuaW1wb3J0IHsgY3JlYXRlU3BhY2VzU2VydmljZSB9IGZyb20gJy4vc2VydmVyL2xpYi9jcmVhdGVfc3BhY2VzX3NlcnZpY2UnO1xuaW1wb3J0IHsgd3JhcEVycm9yIH0gZnJvbSAnLi9zZXJ2ZXIvbGliL2Vycm9ycyc7XG5pbXBvcnQgeyBnZXRBY3RpdmVTcGFjZSB9IGZyb20gJy4vc2VydmVyL2xpYi9nZXRfYWN0aXZlX3NwYWNlJztcbmltcG9ydCB7IGdldFNwYWNlU2VsZWN0b3JVcmwgfSBmcm9tICcuL3NlcnZlci9saWIvZ2V0X3NwYWNlX3NlbGVjdG9yX3VybCc7XG5pbXBvcnQgeyBnZXRTcGFjZXNVc2FnZUNvbGxlY3RvciB9IGZyb20gJy4vc2VydmVyL2xpYi9nZXRfc3BhY2VzX3VzYWdlX2NvbGxlY3Rvcic7XG5pbXBvcnQgeyBzcGFjZXNTYXZlZE9iamVjdHNDbGllbnRXcmFwcGVyRmFjdG9yeSB9IGZyb20gJy4vc2VydmVyL2xpYi9zYXZlZF9vYmplY3RzX2NsaWVudC9zYXZlZF9vYmplY3RzX2NsaWVudF93cmFwcGVyX2ZhY3RvcnknO1xuaW1wb3J0IHsgaW5pdFNwYWNlc1JlcXVlc3RJbnRlcmNlcHRvcnMgfSBmcm9tICcuL3NlcnZlci9saWIvc3BhY2VfcmVxdWVzdF9pbnRlcmNlcHRvcnMnO1xuaW1wb3J0IHsgU3BhY2VzQ2xpZW50IH0gZnJvbSAnLi9zZXJ2ZXIvbGliL3NwYWNlc19jbGllbnQnO1xuaW1wb3J0IHsgY3JlYXRlU3BhY2VzVHV0b3JpYWxDb250ZXh0RmFjdG9yeSB9IGZyb20gJy4vc2VydmVyL2xpYi9zcGFjZXNfdHV0b3JpYWxfY29udGV4dF9mYWN0b3J5JztcbmltcG9ydCB7IGluaXRQdWJsaWNTcGFjZXNBcGkgfSBmcm9tICcuL3NlcnZlci9yb3V0ZXMvYXBpL3B1YmxpYyc7XG5pbXBvcnQgeyBpbml0UHJpdmF0ZUFwaXMgfSBmcm9tICcuL3NlcnZlci9yb3V0ZXMvYXBpL3YxJztcblxuZXhwb3J0IGNvbnN0IHNwYWNlcyA9IChraWJhbmE6IGFueSkgPT5cbiAgbmV3IGtpYmFuYS5QbHVnaW4oe1xuICAgIGlkOiAnc3BhY2VzJyxcbiAgICBjb25maWdQcmVmaXg6ICd4cGFjay5zcGFjZXMnLFxuICAgIHB1YmxpY0RpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKSxcbiAgICByZXF1aXJlOiBbJ2tpYmFuYScsICdlbGFzdGljc2VhcmNoJywgJ3hwYWNrX21haW4nXSxcblxuICAgIGNvbmZpZyhKb2k6IGFueSkge1xuICAgICAgcmV0dXJuIEpvaS5vYmplY3Qoe1xuICAgICAgICBlbmFibGVkOiBKb2kuYm9vbGVhbigpLmRlZmF1bHQodHJ1ZSksXG4gICAgICAgIG1heFNwYWNlczogSm9pLm51bWJlcigpLmRlZmF1bHQoMTAwMCksXG4gICAgICB9KS5kZWZhdWx0KCk7XG4gICAgfSxcblxuICAgIHVpRXhwb3J0czoge1xuICAgICAgY2hyb21lTmF2Q29udHJvbHM6IFsncGx1Z2lucy9zcGFjZXMvdmlld3MvbmF2X2NvbnRyb2wnXSxcbiAgICAgIHN0eWxlU2hlZXRQYXRoczogcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMvaW5kZXguc2NzcycpLFxuICAgICAgbWFuYWdlbWVudFNlY3Rpb25zOiBbJ3BsdWdpbnMvc3BhY2VzL3ZpZXdzL21hbmFnZW1lbnQnXSxcbiAgICAgIGFwcHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnc3BhY2Vfc2VsZWN0b3InLFxuICAgICAgICAgIHRpdGxlOiAnU3BhY2VzJyxcbiAgICAgICAgICBtYWluOiAncGx1Z2lucy9zcGFjZXMvdmlld3Mvc3BhY2Vfc2VsZWN0b3InLFxuICAgICAgICAgIHVybDogJ3NwYWNlX3NlbGVjdG9yJyxcbiAgICAgICAgICBoaWRkZW46IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgaGFja3M6IFtdLFxuICAgICAgbWFwcGluZ3MsXG4gICAgICBzYXZlZE9iamVjdFNjaGVtYXM6IHtcbiAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICBpc05hbWVzcGFjZUFnbm9zdGljOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGhvbWU6IFsncGx1Z2lucy9zcGFjZXMvcmVnaXN0ZXJfZmVhdHVyZSddLFxuICAgICAgaW5qZWN0RGVmYXVsdFZhcnMoc2VydmVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZXM6IFtdLFxuICAgICAgICAgIGFjdGl2ZVNwYWNlOiBudWxsLFxuICAgICAgICAgIHNwYWNlU2VsZWN0b3JVUkw6IGdldFNwYWNlU2VsZWN0b3JVcmwoc2VydmVyLmNvbmZpZygpKSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBhc3luYyByZXBsYWNlSW5qZWN0ZWRWYXJzKHZhcnM6IGFueSwgcmVxdWVzdDogYW55LCBzZXJ2ZXI6IGFueSkge1xuICAgICAgICBjb25zdCBzcGFjZXNDbGllbnQgPSBzZXJ2ZXIucGx1Z2lucy5zcGFjZXMuc3BhY2VzQ2xpZW50LmdldFNjb3BlZENsaWVudChyZXF1ZXN0KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXJzLmFjdGl2ZVNwYWNlID0ge1xuICAgICAgICAgICAgdmFsaWQ6IHRydWUsXG4gICAgICAgICAgICBzcGFjZTogYXdhaXQgZ2V0QWN0aXZlU3BhY2UoXG4gICAgICAgICAgICAgIHNwYWNlc0NsaWVudCxcbiAgICAgICAgICAgICAgcmVxdWVzdC5nZXRCYXNlUGF0aCgpLFxuICAgICAgICAgICAgICBzZXJ2ZXIuY29uZmlnKCkuZ2V0KCdzZXJ2ZXIuYmFzZVBhdGgnKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdmFycy5hY3RpdmVTcGFjZSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiB3cmFwRXJyb3IoZSkub3V0cHV0LnBheWxvYWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFycztcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGluaXQoc2VydmVyOiBhbnkpIHtcbiAgICAgIGNvbnN0IHRoaXNQbHVnaW4gPSB0aGlzO1xuICAgICAgY29uc3QgeHBhY2tNYWluUGx1Z2luID0gc2VydmVyLnBsdWdpbnMueHBhY2tfbWFpbjtcblxuICAgICAgd2F0Y2hTdGF0dXNBbmRMaWNlbnNlVG9Jbml0aWFsaXplKHhwYWNrTWFpblBsdWdpbiwgdGhpc1BsdWdpbiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBjcmVhdGVEZWZhdWx0U3BhY2Uoc2VydmVyKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZWdpc3RlciBhIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSB4cGFjayBpbmZvIGNoYW5nZXMsXG4gICAgICAvLyB0byByZS1jb21wdXRlIHRoZSBsaWNlbnNlIGNoZWNrIHJlc3VsdHMgZm9yIHRoaXMgcGx1Z2luXG4gICAgICB4cGFja01haW5QbHVnaW4uaW5mb1xuICAgICAgICAuZmVhdHVyZSh0aGlzUGx1Z2luLmlkKVxuICAgICAgICAucmVnaXN0ZXJMaWNlbnNlQ2hlY2tSZXN1bHRzR2VuZXJhdG9yKGNoZWNrTGljZW5zZSk7XG5cbiAgICAgIGNvbnN0IHNwYWNlc1NlcnZpY2UgPSBjcmVhdGVTcGFjZXNTZXJ2aWNlKHNlcnZlcik7XG4gICAgICBzZXJ2ZXIuZXhwb3NlKCdnZXRTcGFjZUlkJywgKHJlcXVlc3Q6IGFueSkgPT4gc3BhY2VzU2VydmljZS5nZXRTcGFjZUlkKHJlcXVlc3QpKTtcblxuICAgICAgY29uc3QgY29uZmlnID0gc2VydmVyLmNvbmZpZygpO1xuXG4gICAgICBjb25zdCBzcGFjZXNBdWRpdExvZ2dlciA9IG5ldyBTcGFjZXNBdWRpdExvZ2dlcihjb25maWcsIG5ldyBBdWRpdExvZ2dlcihzZXJ2ZXIsICdzcGFjZXMnKSk7XG5cbiAgICAgIHNlcnZlci5leHBvc2UoJ3NwYWNlc0NsaWVudCcsIHtcbiAgICAgICAgZ2V0U2NvcGVkQ2xpZW50OiAocmVxdWVzdDogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3QgYWRtaW5DbHVzdGVyID0gc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKCdhZG1pbicpO1xuICAgICAgICAgIGNvbnN0IHsgY2FsbFdpdGhSZXF1ZXN0LCBjYWxsV2l0aEludGVybmFsVXNlciB9ID0gYWRtaW5DbHVzdGVyO1xuICAgICAgICAgIGNvbnN0IGNhbGxDbHVzdGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiBjYWxsV2l0aFJlcXVlc3QocmVxdWVzdCwgLi4uYXJncyk7XG4gICAgICAgICAgY29uc3QgeyBzYXZlZE9iamVjdHMgfSA9IHNlcnZlcjtcbiAgICAgICAgICBjb25zdCBpbnRlcm5hbFJlcG9zaXRvcnkgPSBzYXZlZE9iamVjdHMuZ2V0U2F2ZWRPYmplY3RzUmVwb3NpdG9yeShjYWxsV2l0aEludGVybmFsVXNlcik7XG4gICAgICAgICAgY29uc3QgY2FsbFdpdGhSZXF1ZXN0UmVwb3NpdG9yeSA9IHNhdmVkT2JqZWN0cy5nZXRTYXZlZE9iamVjdHNSZXBvc2l0b3J5KGNhbGxDbHVzdGVyKTtcbiAgICAgICAgICBjb25zdCBhdXRob3JpemF0aW9uID0gc2VydmVyLnBsdWdpbnMuc2VjdXJpdHlcbiAgICAgICAgICAgID8gc2VydmVyLnBsdWdpbnMuc2VjdXJpdHkuYXV0aG9yaXphdGlvblxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgIHJldHVybiBuZXcgU3BhY2VzQ2xpZW50KFxuICAgICAgICAgICAgc3BhY2VzQXVkaXRMb2dnZXIsXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uLFxuICAgICAgICAgICAgY2FsbFdpdGhSZXF1ZXN0UmVwb3NpdG9yeSxcbiAgICAgICAgICAgIHNlcnZlci5jb25maWcoKSxcbiAgICAgICAgICAgIGludGVybmFsUmVwb3NpdG9yeSxcbiAgICAgICAgICAgIHJlcXVlc3RcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYWRkU2NvcGVkU2F2ZWRPYmplY3RzQ2xpZW50V3JhcHBlckZhY3RvcnksXG4gICAgICAgIHR5cGVzLFxuICAgICAgfSA9IHNlcnZlci5zYXZlZE9iamVjdHMgYXMgU2F2ZWRPYmplY3RzU2VydmljZTtcbiAgICAgIGFkZFNjb3BlZFNhdmVkT2JqZWN0c0NsaWVudFdyYXBwZXJGYWN0b3J5KFxuICAgICAgICBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgICAgICBzcGFjZXNTYXZlZE9iamVjdHNDbGllbnRXcmFwcGVyRmFjdG9yeShzcGFjZXNTZXJ2aWNlLCB0eXBlcylcbiAgICAgICk7XG5cbiAgICAgIHNlcnZlci5hZGRTY29wZWRUdXRvcmlhbENvbnRleHRGYWN0b3J5KGNyZWF0ZVNwYWNlc1R1dG9yaWFsQ29udGV4dEZhY3Rvcnkoc3BhY2VzU2VydmljZSkpO1xuXG4gICAgICBpbml0UHJpdmF0ZUFwaXMoc2VydmVyKTtcbiAgICAgIGluaXRQdWJsaWNTcGFjZXNBcGkoc2VydmVyKTtcblxuICAgICAgaW5pdFNwYWNlc1JlcXVlc3RJbnRlcmNlcHRvcnMoc2VydmVyKTtcblxuICAgICAgcmVnaXN0ZXJVc2VyUHJvZmlsZUNhcGFiaWxpdHlGYWN0b3J5KGFzeW5jIHJlcXVlc3QgPT4ge1xuICAgICAgICBjb25zdCBzcGFjZXNDbGllbnQgPSBzZXJ2ZXIucGx1Z2lucy5zcGFjZXMuc3BhY2VzQ2xpZW50LmdldFNjb3BlZENsaWVudChyZXF1ZXN0KTtcblxuICAgICAgICBsZXQgbWFuYWdlU2VjdXJpdHkgPSBmYWxzZTtcblxuICAgICAgICBpZiAoc2VydmVyLnBsdWdpbnMuc2VjdXJpdHkpIHtcbiAgICAgICAgICBjb25zdCB7IHNob3dMaW5rcyA9IGZhbHNlIH0gPVxuICAgICAgICAgICAgeHBhY2tNYWluUGx1Z2luLmluZm8uZmVhdHVyZSgnc2VjdXJpdHknKS5nZXRMaWNlbnNlQ2hlY2tSZXN1bHRzKCkgfHwge307XG4gICAgICAgICAgbWFuYWdlU2VjdXJpdHkgPSBzaG93TGlua3M7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG1hbmFnZVNwYWNlczogYXdhaXQgc3BhY2VzQ2xpZW50LmNhbkVudW1lcmF0ZVNwYWNlcygpLFxuICAgICAgICAgIG1hbmFnZVNlY3VyaXR5LFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlZ2lzdGVyIGEgZnVuY3Rpb24gd2l0aCBzZXJ2ZXIgdG8gbWFuYWdlIHRoZSBjb2xsZWN0aW9uIG9mIHVzYWdlIHN0YXRzXG4gICAgICBzZXJ2ZXIudXNhZ2UuY29sbGVjdG9yU2V0LnJlZ2lzdGVyKGdldFNwYWNlc1VzYWdlQ29sbGVjdG9yKHNlcnZlcikpO1xuICAgIH0sXG4gIH0pO1xuIl19