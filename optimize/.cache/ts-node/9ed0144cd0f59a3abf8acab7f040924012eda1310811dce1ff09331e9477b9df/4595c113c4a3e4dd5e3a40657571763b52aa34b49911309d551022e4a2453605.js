"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
// @ts-ignore
const get_client_shield_1 = require("../../../../server/lib/get_client_shield");
const constants_1 = require("../../common/constants");
async function createDefaultSpace(server) {
    const { callWithInternalUser: callCluster } = get_client_shield_1.getClient(server);
    const { getSavedObjectsRepository, SavedObjectsClient } = server.savedObjects;
    const savedObjectsRepository = getSavedObjectsRepository(callCluster);
    const defaultSpaceExists = await doesDefaultSpaceExist(SavedObjectsClient, savedObjectsRepository);
    if (defaultSpaceExists) {
        return;
    }
    const options = {
        id: constants_1.DEFAULT_SPACE_ID,
    };
    try {
        await savedObjectsRepository.create('space', {
            name: i18n_1.i18n.translate('xpack.spaces.defaultSpaceTitle', {
                defaultMessage: 'Default',
            }),
            description: i18n_1.i18n.translate('xpack.spaces.defaultSpaceDescription', {
                defaultMessage: 'This is your default space!',
            }),
            color: '#00bfb3',
            _reserved: true,
        }, options);
    }
    catch (error) {
        // Ignore conflict errors.
        // It is possible that another Kibana instance, or another invocation of this function
        // created the default space in the time it took this to complete.
        if (SavedObjectsClient.errors.isConflictError(error)) {
            return;
        }
        throw error;
    }
}
exports.createDefaultSpace = createDefaultSpace;
async function doesDefaultSpaceExist(SavedObjectsClient, savedObjectsRepository) {
    try {
        await savedObjectsRepository.get('space', constants_1.DEFAULT_SPACE_ID);
        return true;
    }
    catch (e) {
        if (SavedObjectsClient.errors.isNotFoundError(e)) {
            return false;
        }
        throw e;
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvY3JlYXRlX2RlZmF1bHRfc3BhY2UudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3NwYWNlcy9zZXJ2ZXIvbGliL2NyZWF0ZV9kZWZhdWx0X3NwYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILG9DQUFpQztBQUNqQyxhQUFhO0FBQ2IsZ0ZBQXFFO0FBQ3JFLHNEQUEwRDtBQUVuRCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsTUFBVztJQUNsRCxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLEdBQUcsNkJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVoRSxNQUFNLEVBQUUseUJBQXlCLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBRTlFLE1BQU0sc0JBQXNCLEdBQUcseUJBQXlCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFdEUsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLHFCQUFxQixDQUNwRCxrQkFBa0IsRUFDbEIsc0JBQXNCLENBQ3ZCLENBQUM7SUFFRixJQUFJLGtCQUFrQixFQUFFO1FBQ3RCLE9BQU87S0FDUjtJQUVELE1BQU0sT0FBTyxHQUFHO1FBQ2QsRUFBRSxFQUFFLDRCQUFnQjtLQUNyQixDQUFDO0lBRUYsSUFBSTtRQUNGLE1BQU0sc0JBQXNCLENBQUMsTUFBTSxDQUNqQyxPQUFPLEVBQ1A7WUFDRSxJQUFJLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBRTtnQkFDckQsY0FBYyxFQUFFLFNBQVM7YUFDMUIsQ0FBQztZQUNGLFdBQVcsRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxFQUFFO2dCQUNsRSxjQUFjLEVBQUUsNkJBQTZCO2FBQzlDLENBQUM7WUFDRixLQUFLLEVBQUUsU0FBUztZQUNoQixTQUFTLEVBQUUsSUFBSTtTQUNoQixFQUNELE9BQU8sQ0FDUixDQUFDO0tBQ0g7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLDBCQUEwQjtRQUMxQixzRkFBc0Y7UUFDdEYsa0VBQWtFO1FBQ2xFLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwRCxPQUFPO1NBQ1I7UUFDRCxNQUFNLEtBQUssQ0FBQztLQUNiO0FBQ0gsQ0FBQztBQTVDRCxnREE0Q0M7QUFFRCxLQUFLLFVBQVUscUJBQXFCLENBQUMsa0JBQXVCLEVBQUUsc0JBQTJCO0lBQ3ZGLElBQUk7UUFDRixNQUFNLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsNEJBQWdCLENBQUMsQ0FBQztRQUM1RCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEQsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgaTE4biB9IGZyb20gJ0BrYm4vaTE4bic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeyBnZXRDbGllbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvbGliL2dldF9jbGllbnRfc2hpZWxkJztcbmltcG9ydCB7IERFRkFVTFRfU1BBQ0VfSUQgfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRTcGFjZShzZXJ2ZXI6IGFueSkge1xuICBjb25zdCB7IGNhbGxXaXRoSW50ZXJuYWxVc2VyOiBjYWxsQ2x1c3RlciB9ID0gZ2V0Q2xpZW50KHNlcnZlcik7XG5cbiAgY29uc3QgeyBnZXRTYXZlZE9iamVjdHNSZXBvc2l0b3J5LCBTYXZlZE9iamVjdHNDbGllbnQgfSA9IHNlcnZlci5zYXZlZE9iamVjdHM7XG5cbiAgY29uc3Qgc2F2ZWRPYmplY3RzUmVwb3NpdG9yeSA9IGdldFNhdmVkT2JqZWN0c1JlcG9zaXRvcnkoY2FsbENsdXN0ZXIpO1xuXG4gIGNvbnN0IGRlZmF1bHRTcGFjZUV4aXN0cyA9IGF3YWl0IGRvZXNEZWZhdWx0U3BhY2VFeGlzdChcbiAgICBTYXZlZE9iamVjdHNDbGllbnQsXG4gICAgc2F2ZWRPYmplY3RzUmVwb3NpdG9yeVxuICApO1xuXG4gIGlmIChkZWZhdWx0U3BhY2VFeGlzdHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiBERUZBVUxUX1NQQUNFX0lELFxuICB9O1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgc2F2ZWRPYmplY3RzUmVwb3NpdG9yeS5jcmVhdGUoXG4gICAgICAnc3BhY2UnLFxuICAgICAge1xuICAgICAgICBuYW1lOiBpMThuLnRyYW5zbGF0ZSgneHBhY2suc3BhY2VzLmRlZmF1bHRTcGFjZVRpdGxlJywge1xuICAgICAgICAgIGRlZmF1bHRNZXNzYWdlOiAnRGVmYXVsdCcsXG4gICAgICAgIH0pLFxuICAgICAgICBkZXNjcmlwdGlvbjogaTE4bi50cmFuc2xhdGUoJ3hwYWNrLnNwYWNlcy5kZWZhdWx0U3BhY2VEZXNjcmlwdGlvbicsIHtcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZTogJ1RoaXMgaXMgeW91ciBkZWZhdWx0IHNwYWNlIScsXG4gICAgICAgIH0pLFxuICAgICAgICBjb2xvcjogJyMwMGJmYjMnLFxuICAgICAgICBfcmVzZXJ2ZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gSWdub3JlIGNvbmZsaWN0IGVycm9ycy5cbiAgICAvLyBJdCBpcyBwb3NzaWJsZSB0aGF0IGFub3RoZXIgS2liYW5hIGluc3RhbmNlLCBvciBhbm90aGVyIGludm9jYXRpb24gb2YgdGhpcyBmdW5jdGlvblxuICAgIC8vIGNyZWF0ZWQgdGhlIGRlZmF1bHQgc3BhY2UgaW4gdGhlIHRpbWUgaXQgdG9vayB0aGlzIHRvIGNvbXBsZXRlLlxuICAgIGlmIChTYXZlZE9iamVjdHNDbGllbnQuZXJyb3JzLmlzQ29uZmxpY3RFcnJvcihlcnJvcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZG9lc0RlZmF1bHRTcGFjZUV4aXN0KFNhdmVkT2JqZWN0c0NsaWVudDogYW55LCBzYXZlZE9iamVjdHNSZXBvc2l0b3J5OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBzYXZlZE9iamVjdHNSZXBvc2l0b3J5LmdldCgnc3BhY2UnLCBERUZBVUxUX1NQQUNFX0lEKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChTYXZlZE9iamVjdHNDbGllbnQuZXJyb3JzLmlzTm90Rm91bmRFcnJvcihlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aHJvdyBlO1xuICB9XG59XG4iXX0=