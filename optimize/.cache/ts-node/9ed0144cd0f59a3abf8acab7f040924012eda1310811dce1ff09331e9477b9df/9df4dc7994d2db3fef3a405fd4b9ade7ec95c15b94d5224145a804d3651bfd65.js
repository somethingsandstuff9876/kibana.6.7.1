"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const path_1 = require("path");
const mappings_json_1 = tslib_1.__importDefault(require("./mappings.json"));
const server_1 = require("./server");
function upgradeAssistant(kibana) {
    return new kibana.Plugin({
        id: 'upgrade_assistant',
        configPrefix: 'xpack.upgrade_assistant',
        require: ['elasticsearch'],
        uiExports: {
            managementSections: ['plugins/upgrade_assistant'],
            savedObjectSchemas: {
                'upgrade-assistant-reindex-operation': {
                    isNamespaceAgnostic: true,
                },
                'upgrade-assistant-telemetry': {
                    isNamespaceAgnostic: true,
                },
            },
            styleSheetPaths: path_1.resolve(__dirname, 'public/index.scss'),
            mappings: mappings_json_1.default,
        },
        publicDir: path_1.resolve(__dirname, 'public'),
        config() {
            return joi_1.default.object({
                enabled: joi_1.default.boolean().default(true),
            }).default();
        },
        init(server) {
            // Add server routes and initialize the plugin here
            server_1.initServer(server);
        },
    });
}
exports.upgradeAssistant = upgradeAssistant;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwZ3JhZGVfYXNzaXN0YW50L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU1BLHNEQUFzQjtBQUN0QiwrQkFBK0I7QUFDL0IsNEVBQXVDO0FBQ3ZDLHFDQUFzQztBQUV0QyxTQUFnQixnQkFBZ0IsQ0FBQyxNQUFXO0lBQzFDLE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLEVBQUUsRUFBRSxtQkFBbUI7UUFDdkIsWUFBWSxFQUFFLHlCQUF5QjtRQUN2QyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDMUIsU0FBUyxFQUFFO1lBQ1Qsa0JBQWtCLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztZQUNqRCxrQkFBa0IsRUFBRTtnQkFDbEIscUNBQXFDLEVBQUU7b0JBQ3JDLG1CQUFtQixFQUFFLElBQUk7aUJBQzFCO2dCQUNELDZCQUE2QixFQUFFO29CQUM3QixtQkFBbUIsRUFBRSxJQUFJO2lCQUMxQjthQUNGO1lBQ0QsZUFBZSxFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUM7WUFDeEQsUUFBUSxFQUFSLHVCQUFRO1NBQ1Q7UUFDRCxTQUFTLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFFdkMsTUFBTTtZQUNKLE9BQU8sYUFBRyxDQUFDLE1BQU0sQ0FBQztnQkFDaEIsT0FBTyxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2FBQ3JDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFFRCxJQUFJLENBQUMsTUFBYztZQUNqQixtREFBbUQ7WUFDbkQsbUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQS9CRCw0Q0ErQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaGFwaSc7XG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgbWFwcGluZ3MgZnJvbSAnLi9tYXBwaW5ncy5qc29uJztcbmltcG9ydCB7IGluaXRTZXJ2ZXIgfSBmcm9tICcuL3NlcnZlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlQXNzaXN0YW50KGtpYmFuYTogYW55KSB7XG4gIHJldHVybiBuZXcga2liYW5hLlBsdWdpbih7XG4gICAgaWQ6ICd1cGdyYWRlX2Fzc2lzdGFudCcsXG4gICAgY29uZmlnUHJlZml4OiAneHBhY2sudXBncmFkZV9hc3Npc3RhbnQnLFxuICAgIHJlcXVpcmU6IFsnZWxhc3RpY3NlYXJjaCddLFxuICAgIHVpRXhwb3J0czoge1xuICAgICAgbWFuYWdlbWVudFNlY3Rpb25zOiBbJ3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQnXSxcbiAgICAgIHNhdmVkT2JqZWN0U2NoZW1hczoge1xuICAgICAgICAndXBncmFkZS1hc3Npc3RhbnQtcmVpbmRleC1vcGVyYXRpb24nOiB7XG4gICAgICAgICAgaXNOYW1lc3BhY2VBZ25vc3RpYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZ3JhZGUtYXNzaXN0YW50LXRlbGVtZXRyeSc6IHtcbiAgICAgICAgICBpc05hbWVzcGFjZUFnbm9zdGljOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN0eWxlU2hlZXRQYXRoczogcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMvaW5kZXguc2NzcycpLFxuICAgICAgbWFwcGluZ3MsXG4gICAgfSxcbiAgICBwdWJsaWNEaXI6IHJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyksXG5cbiAgICBjb25maWcoKSB7XG4gICAgICByZXR1cm4gSm9pLm9iamVjdCh7XG4gICAgICAgIGVuYWJsZWQ6IEpvaS5ib29sZWFuKCkuZGVmYXVsdCh0cnVlKSxcbiAgICAgIH0pLmRlZmF1bHQoKTtcbiAgICB9LFxuXG4gICAgaW5pdChzZXJ2ZXI6IFNlcnZlcikge1xuICAgICAgLy8gQWRkIHNlcnZlciByb3V0ZXMgYW5kIGluaXRpYWxpemUgdGhlIHBsdWdpbiBoZXJlXG4gICAgICBpbml0U2VydmVyKHNlcnZlcik7XG4gICAgfSxcbiAgfSk7XG59XG4iXX0=