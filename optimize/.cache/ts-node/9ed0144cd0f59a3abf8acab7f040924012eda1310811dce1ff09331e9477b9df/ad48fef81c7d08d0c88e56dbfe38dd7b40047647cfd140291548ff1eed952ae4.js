"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const task_runner_1 = require("./visualizations/task_runner");
function registerTasks(server) {
    const { taskManager } = server;
    taskManager.registerTaskDefinitions({
        [constants_1.VIS_TELEMETRY_TASK]: {
            title: 'X-Pack telemetry calculator for Visualizations',
            type: constants_1.VIS_TELEMETRY_TASK,
            numWorkers: constants_1.VIS_TELEMETRY_TASK_NUM_WORKERS,
            createTaskRunner({ taskInstance, kbnServer }) {
                return {
                    run: task_runner_1.visualizationsTaskRunner(taskInstance, kbnServer),
                };
            },
        },
    });
}
exports.registerTasks = registerTasks;
function scheduleTasks(server) {
    const { taskManager } = server;
    const { kbnServer } = server.plugins.xpack_main.status.plugin;
    kbnServer.afterPluginsInit(async () => {
        try {
            await taskManager.schedule({
                id: `${constants_1.PLUGIN_ID}-${constants_1.VIS_TELEMETRY_TASK}`,
                taskType: constants_1.VIS_TELEMETRY_TASK,
                state: { stats: {}, runs: 0 },
            });
        }
        catch (e) {
            server.log(['warning', 'telemetry'], `Error scheduling task, received ${e.message}`);
        }
    });
}
exports.scheduleTasks = scheduleTasks;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvb3NzX3RlbGVtZXRyeS9zZXJ2ZXIvbGliL3Rhc2tzL2luZGV4LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9vc3NfdGVsZW1ldHJ5L3NlcnZlci9saWIvdGFza3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBR0gsa0RBQW1HO0FBQ25HLDhEQUF3RTtBQUV4RSxTQUFnQixhQUFhLENBQUMsTUFBa0I7SUFDOUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUUvQixXQUFXLENBQUMsdUJBQXVCLENBQUM7UUFDbEMsQ0FBQyw4QkFBa0IsQ0FBQyxFQUFFO1lBQ3BCLEtBQUssRUFBRSxnREFBZ0Q7WUFDdkQsSUFBSSxFQUFFLDhCQUFrQjtZQUN4QixVQUFVLEVBQUUsMENBQThCO1lBQzFDLGdCQUFnQixDQUFDLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBeUM7Z0JBQ2pGLE9BQU87b0JBQ0wsR0FBRyxFQUFFLHNDQUF3QixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUM7aUJBQ3ZELENBQUM7WUFDSixDQUFDO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBZkQsc0NBZUM7QUFFRCxTQUFnQixhQUFhLENBQUMsTUFBa0I7SUFDOUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUMvQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUU5RCxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEMsSUFBSTtZQUNGLE1BQU0sV0FBVyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsRUFBRSxFQUFFLEdBQUcscUJBQVMsSUFBSSw4QkFBa0IsRUFBRTtnQkFDeEMsUUFBUSxFQUFFLDhCQUFrQjtnQkFDNUIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO2FBQzlCLENBQUMsQ0FBQztTQUNKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxFQUFFLG1DQUFtQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN0RjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWZELHNDQWVDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSGFwaVNlcnZlciB9IGZyb20gJy4uLy4uLy4uLyc7XG5pbXBvcnQgeyBQTFVHSU5fSUQsIFZJU19URUxFTUVUUllfVEFTSywgVklTX1RFTEVNRVRSWV9UQVNLX05VTV9XT1JLRVJTIH0gZnJvbSAnLi4vLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IHZpc3VhbGl6YXRpb25zVGFza1J1bm5lciB9IGZyb20gJy4vdmlzdWFsaXphdGlvbnMvdGFza19ydW5uZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJUYXNrcyhzZXJ2ZXI6IEhhcGlTZXJ2ZXIpIHtcbiAgY29uc3QgeyB0YXNrTWFuYWdlciB9ID0gc2VydmVyO1xuXG4gIHRhc2tNYW5hZ2VyLnJlZ2lzdGVyVGFza0RlZmluaXRpb25zKHtcbiAgICBbVklTX1RFTEVNRVRSWV9UQVNLXToge1xuICAgICAgdGl0bGU6ICdYLVBhY2sgdGVsZW1ldHJ5IGNhbGN1bGF0b3IgZm9yIFZpc3VhbGl6YXRpb25zJyxcbiAgICAgIHR5cGU6IFZJU19URUxFTUVUUllfVEFTSyxcbiAgICAgIG51bVdvcmtlcnM6IFZJU19URUxFTUVUUllfVEFTS19OVU1fV09SS0VSUywgLy8gYnkgZGVmYXVsdCBpdCdzIDEwMCUgdGhlaXIgd29ya2Vyc1xuICAgICAgY3JlYXRlVGFza1J1bm5lcih7IHRhc2tJbnN0YW5jZSwga2JuU2VydmVyIH06IHsga2JuU2VydmVyOiBhbnk7IHRhc2tJbnN0YW5jZTogYW55IH0pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBydW46IHZpc3VhbGl6YXRpb25zVGFza1J1bm5lcih0YXNrSW5zdGFuY2UsIGtiblNlcnZlciksXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVUYXNrcyhzZXJ2ZXI6IEhhcGlTZXJ2ZXIpIHtcbiAgY29uc3QgeyB0YXNrTWFuYWdlciB9ID0gc2VydmVyO1xuICBjb25zdCB7IGtiblNlcnZlciB9ID0gc2VydmVyLnBsdWdpbnMueHBhY2tfbWFpbi5zdGF0dXMucGx1Z2luO1xuXG4gIGtiblNlcnZlci5hZnRlclBsdWdpbnNJbml0KGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGFza01hbmFnZXIuc2NoZWR1bGUoe1xuICAgICAgICBpZDogYCR7UExVR0lOX0lEfS0ke1ZJU19URUxFTUVUUllfVEFTS31gLFxuICAgICAgICB0YXNrVHlwZTogVklTX1RFTEVNRVRSWV9UQVNLLFxuICAgICAgICBzdGF0ZTogeyBzdGF0czoge30sIHJ1bnM6IDAgfSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNlcnZlci5sb2coWyd3YXJuaW5nJywgJ3RlbGVtZXRyeSddLCBgRXJyb3Igc2NoZWR1bGluZyB0YXNrLCByZWNlaXZlZCAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gIH0pO1xufVxuIl19