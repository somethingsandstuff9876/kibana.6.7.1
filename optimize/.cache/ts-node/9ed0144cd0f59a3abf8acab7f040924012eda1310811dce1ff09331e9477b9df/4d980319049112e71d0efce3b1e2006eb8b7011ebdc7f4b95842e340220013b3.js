"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = require("lodash");
const is_reserved_space_1 = require("../../common/is_reserved_space");
class SpacesClient {
    constructor(auditLogger, authorization, callWithRequestSavedObjectRepository, config, internalSavedObjectRepository, request) {
        this.auditLogger = auditLogger;
        this.authorization = authorization;
        this.callWithRequestSavedObjectRepository = callWithRequestSavedObjectRepository;
        this.config = config;
        this.internalSavedObjectRepository = internalSavedObjectRepository;
        this.request = request;
    }
    async canEnumerateSpaces() {
        if (this.useRbac()) {
            const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request);
            const { hasAllRequested } = await checkPrivileges.globally(this.authorization.actions.manageSpaces);
            return hasAllRequested;
        }
        // If not RBAC, then we are legacy, and all legacy users can enumerate all spaces
        return true;
    }
    async getAll() {
        if (this.useRbac()) {
            const { saved_objects } = await this.internalSavedObjectRepository.find({
                type: 'space',
                page: 1,
                perPage: this.config.get('xpack.spaces.maxSpaces'),
                sortField: 'name.keyword',
            });
            const spaces = saved_objects.map(this.transformSavedObjectToSpace);
            const spaceIds = spaces.map((space) => space.id);
            const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request);
            const { username, spacePrivileges } = await checkPrivileges.atSpaces(spaceIds, this.authorization.actions.login);
            const authorized = Object.keys(spacePrivileges).filter(spaceId => {
                return spacePrivileges[spaceId][this.authorization.actions.login];
            });
            if (authorized.length === 0) {
                this.auditLogger.spacesAuthorizationFailure(username, 'getAll');
                throw boom_1.default.forbidden();
            }
            this.auditLogger.spacesAuthorizationSuccess(username, 'getAll', authorized);
            return spaces.filter((space) => authorized.includes(space.id));
        }
        else {
            const { saved_objects } = await this.callWithRequestSavedObjectRepository.find({
                type: 'space',
                page: 1,
                perPage: this.config.get('xpack.spaces.maxSpaces'),
                sortField: 'name.keyword',
            });
            return saved_objects.map(this.transformSavedObjectToSpace);
        }
    }
    async get(id) {
        if (this.useRbac()) {
            await this.ensureAuthorizedAtSpace(id, this.authorization.actions.login, 'get', `Unauthorized to get ${id} space`);
        }
        const repository = this.useRbac()
            ? this.internalSavedObjectRepository
            : this.callWithRequestSavedObjectRepository;
        const savedObject = await repository.get('space', id);
        return this.transformSavedObjectToSpace(savedObject);
    }
    async create(space) {
        if (this.useRbac()) {
            await this.ensureAuthorizedGlobally(this.authorization.actions.manageSpaces, 'create', 'Unauthorized to create spaces');
        }
        const repository = this.useRbac()
            ? this.internalSavedObjectRepository
            : this.callWithRequestSavedObjectRepository;
        const { total } = await repository.find({
            type: 'space',
            page: 1,
            perPage: 0,
        });
        if (total >= this.config.get('xpack.spaces.maxSpaces')) {
            throw boom_1.default.badRequest('Unable to create Space, this exceeds the maximum number of spaces set by the xpack.spaces.maxSpaces setting');
        }
        const attributes = lodash_1.omit(space, ['id', '_reserved']);
        const id = space.id;
        const createdSavedObject = await repository.create('space', attributes, { id });
        return this.transformSavedObjectToSpace(createdSavedObject);
    }
    async update(id, space) {
        if (this.useRbac()) {
            await this.ensureAuthorizedGlobally(this.authorization.actions.manageSpaces, 'update', 'Unauthorized to update spaces');
        }
        const repository = this.useRbac()
            ? this.internalSavedObjectRepository
            : this.callWithRequestSavedObjectRepository;
        const attributes = lodash_1.omit(space, 'id', '_reserved');
        await repository.update('space', id, attributes);
        const updatedSavedObject = await repository.get('space', id);
        return this.transformSavedObjectToSpace(updatedSavedObject);
    }
    async delete(id) {
        if (this.useRbac()) {
            await this.ensureAuthorizedGlobally(this.authorization.actions.manageSpaces, 'delete', 'Unauthorized to delete spaces');
        }
        const repository = this.useRbac()
            ? this.internalSavedObjectRepository
            : this.callWithRequestSavedObjectRepository;
        const existingSavedObject = await repository.get('space', id);
        if (is_reserved_space_1.isReservedSpace(this.transformSavedObjectToSpace(existingSavedObject))) {
            throw boom_1.default.badRequest('This Space cannot be deleted because it is reserved.');
        }
        await repository.delete('space', id);
        await repository.deleteByNamespace(id);
    }
    useRbac() {
        return this.authorization && this.authorization.mode.useRbacForRequest(this.request);
    }
    async ensureAuthorizedGlobally(action, method, forbiddenMessage) {
        const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request);
        const { username, hasAllRequested } = await checkPrivileges.globally(action);
        if (hasAllRequested) {
            this.auditLogger.spacesAuthorizationSuccess(username, method);
            return;
        }
        else {
            this.auditLogger.spacesAuthorizationFailure(username, method);
            throw boom_1.default.forbidden(forbiddenMessage);
        }
    }
    async ensureAuthorizedAtSpace(spaceId, action, method, forbiddenMessage) {
        const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request);
        const { username, hasAllRequested } = await checkPrivileges.atSpace(spaceId, action);
        if (hasAllRequested) {
            this.auditLogger.spacesAuthorizationSuccess(username, method, [spaceId]);
            return;
        }
        else {
            this.auditLogger.spacesAuthorizationFailure(username, method, [spaceId]);
            throw boom_1.default.forbidden(forbiddenMessage);
        }
    }
    transformSavedObjectToSpace(savedObject) {
        return {
            id: savedObject.id,
            ...savedObject.attributes,
        };
    }
}
exports.SpacesClient = SpacesClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvc3BhY2VzX2NsaWVudC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvc3BhY2VzX2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsd0RBQXdCO0FBQ3hCLG1DQUE4QjtBQUM5QixzRUFBaUU7QUFJakUsTUFBYSxZQUFZO0lBQ3ZCLFlBQ21CLFdBQThCLEVBQzlCLGFBQWtCLEVBQ2xCLG9DQUF5QyxFQUN6QyxNQUFXLEVBQ1gsNkJBQWtDLEVBQ2xDLE9BQVk7UUFMWixnQkFBVyxHQUFYLFdBQVcsQ0FBbUI7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQUs7UUFDbEIseUNBQW9DLEdBQXBDLG9DQUFvQyxDQUFLO1FBQ3pDLFdBQU0sR0FBTixNQUFNLENBQUs7UUFDWCxrQ0FBNkIsR0FBN0IsNkJBQTZCLENBQUs7UUFDbEMsWUFBTyxHQUFQLE9BQU8sQ0FBSztJQUM1QixDQUFDO0lBRUcsS0FBSyxDQUFDLGtCQUFrQjtRQUM3QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNsQixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRixNQUFNLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxlQUFlLENBQUMsUUFBUSxDQUN4RCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQ3hDLENBQUM7WUFDRixPQUFPLGVBQWUsQ0FBQztTQUN4QjtRQUVELGlGQUFpRjtRQUNqRixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTTtRQUNqQixJQUFJLElBQUks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RSxRQUFRLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyRixJQUFJLGVBQWUsRUFBRTtZQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLE9BQU87U0FDUjthQUFNO1lBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN6RSxNQUFNLGNBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFTywyQkFBMkIsQ0FBQyxXQUFnQjtRQUNsRCxPQUFPO1lBQ0wsRUFBRSxFQUFFLFdBQVcsQ0FBQyxFQUFFO1lBQ2xCLEdBQUcsV0FBVyxDQUFDLFVBQVU7U0FDakIsQ0FBQztJQUNiLENBQUM7Q0FDRjtBQWhNRCxvQ0FnTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgeyBvbWl0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGlzUmVzZXJ2ZWRTcGFjZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9pc19yZXNlcnZlZF9zcGFjZSc7XG5pbXBvcnQgeyBTcGFjZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9tb2RlbC9zcGFjZSc7XG5pbXBvcnQgeyBTcGFjZXNBdWRpdExvZ2dlciB9IGZyb20gJy4vYXVkaXRfbG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIFNwYWNlc0NsaWVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXVkaXRMb2dnZXI6IFNwYWNlc0F1ZGl0TG9nZ2VyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aG9yaXphdGlvbjogYW55LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FsbFdpdGhSZXF1ZXN0U2F2ZWRPYmplY3RSZXBvc2l0b3J5OiBhbnksXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWc6IGFueSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGludGVybmFsU2F2ZWRPYmplY3RSZXBvc2l0b3J5OiBhbnksXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXF1ZXN0OiBhbnlcbiAgKSB7fVxuXG4gIHB1YmxpYyBhc3luYyBjYW5FbnVtZXJhdGVTcGFjZXMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKHRoaXMudXNlUmJhYygpKSB7XG4gICAgICBjb25zdCBjaGVja1ByaXZpbGVnZXMgPSB0aGlzLmF1dGhvcml6YXRpb24uY2hlY2tQcml2aWxlZ2VzV2l0aFJlcXVlc3QodGhpcy5yZXF1ZXN0KTtcbiAgICAgIGNvbnN0IHsgaGFzQWxsUmVxdWVzdGVkIH0gPSBhd2FpdCBjaGVja1ByaXZpbGVnZXMuZ2xvYmFsbHkoXG4gICAgICAgIHRoaXMuYXV0aG9yaXphdGlvbi5hY3Rpb25zLm1hbmFnZVNwYWNlc1xuICAgICAgKTtcbiAgICAgIHJldHVybiBoYXNBbGxSZXF1ZXN0ZWQ7XG4gICAgfVxuXG4gICAgLy8gSWYgbm90IFJCQUMsIHRoZW4gd2UgYXJlIGxlZ2FjeSwgYW5kIGFsbCBsZWdhY3kgdXNlcnMgY2FuIGVudW1lcmF0ZSBhbGwgc3BhY2VzXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0QWxsKCk6IFByb21pc2U8W1NwYWNlXT4ge1xuICAgIGlmICh0aGlzLnVzZVJiYWMoKSkge1xuICAgICAgY29uc3QgeyBzYXZlZF9vYmplY3RzIH0gPSBhd2FpdCB0aGlzLmludGVybmFsU2F2ZWRPYmplY3RSZXBvc2l0b3J5LmZpbmQoe1xuICAgICAgICB0eXBlOiAnc3BhY2UnLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICBwZXJQYWdlOiB0aGlzLmNvbmZpZy5nZXQoJ3hwYWNrLnNwYWNlcy5tYXhTcGFjZXMnKSxcbiAgICAgICAgc29ydEZpZWxkOiAnbmFtZS5rZXl3b3JkJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzcGFjZXMgPSBzYXZlZF9vYmplY3RzLm1hcCh0aGlzLnRyYW5zZm9ybVNhdmVkT2JqZWN0VG9TcGFjZSk7XG5cbiAgICAgIGNvbnN0IHNwYWNlSWRzID0gc3BhY2VzLm1hcCgoc3BhY2U6IFNwYWNlKSA9PiBzcGFjZS5pZCk7XG4gICAgICBjb25zdCBjaGVja1ByaXZpbGVnZXMgPSB0aGlzLmF1dGhvcml6YXRpb24uY2hlY2tQcml2aWxlZ2VzV2l0aFJlcXVlc3QodGhpcy5yZXF1ZXN0KTtcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHNwYWNlUHJpdmlsZWdlcyB9ID0gYXdhaXQgY2hlY2tQcml2aWxlZ2VzLmF0U3BhY2VzKFxuICAgICAgICBzcGFjZUlkcyxcbiAgICAgICAgdGhpcy5hdXRob3JpemF0aW9uLmFjdGlvbnMubG9naW5cbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGF1dGhvcml6ZWQgPSBPYmplY3Qua2V5cyhzcGFjZVByaXZpbGVnZXMpLmZpbHRlcihzcGFjZUlkID0+IHtcbiAgICAgICAgcmV0dXJuIHNwYWNlUHJpdmlsZWdlc1tzcGFjZUlkXVt0aGlzLmF1dGhvcml6YXRpb24uYWN0aW9ucy5sb2dpbl07XG4gICAgICB9KTtcblxuICAgICAgaWYgKGF1dGhvcml6ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuYXVkaXRMb2dnZXIuc3BhY2VzQXV0aG9yaXphdGlvbkZhaWx1cmUodXNlcm5hbWUsICdnZXRBbGwnKTtcbiAgICAgICAgdGhyb3cgQm9vbS5mb3JiaWRkZW4oKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hdWRpdExvZ2dlci5zcGFjZXNBdXRob3JpemF0aW9uU3VjY2Vzcyh1c2VybmFtZSwgJ2dldEFsbCcsIGF1dGhvcml6ZWQpO1xuICAgICAgcmV0dXJuIHNwYWNlcy5maWx0ZXIoKHNwYWNlOiBhbnkpID0+IGF1dGhvcml6ZWQuaW5jbHVkZXMoc3BhY2UuaWQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeyBzYXZlZF9vYmplY3RzIH0gPSBhd2FpdCB0aGlzLmNhbGxXaXRoUmVxdWVzdFNhdmVkT2JqZWN0UmVwb3NpdG9yeS5maW5kKHtcbiAgICAgICAgdHlwZTogJ3NwYWNlJyxcbiAgICAgICAgcGFnZTogMSxcbiAgICAgICAgcGVyUGFnZTogdGhpcy5jb25maWcuZ2V0KCd4cGFjay5zcGFjZXMubWF4U3BhY2VzJyksXG4gICAgICAgIHNvcnRGaWVsZDogJ25hbWUua2V5d29yZCcsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNhdmVkX29iamVjdHMubWFwKHRoaXMudHJhbnNmb3JtU2F2ZWRPYmplY3RUb1NwYWNlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KGlkOiBzdHJpbmcpOiBQcm9taXNlPFNwYWNlPiB7XG4gICAgaWYgKHRoaXMudXNlUmJhYygpKSB7XG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZUF1dGhvcml6ZWRBdFNwYWNlKFxuICAgICAgICBpZCxcbiAgICAgICAgdGhpcy5hdXRob3JpemF0aW9uLmFjdGlvbnMubG9naW4sXG4gICAgICAgICdnZXQnLFxuICAgICAgICBgVW5hdXRob3JpemVkIHRvIGdldCAke2lkfSBzcGFjZWBcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLnVzZVJiYWMoKVxuICAgICAgPyB0aGlzLmludGVybmFsU2F2ZWRPYmplY3RSZXBvc2l0b3J5XG4gICAgICA6IHRoaXMuY2FsbFdpdGhSZXF1ZXN0U2F2ZWRPYmplY3RSZXBvc2l0b3J5O1xuXG4gICAgY29uc3Qgc2F2ZWRPYmplY3QgPSBhd2FpdCByZXBvc2l0b3J5LmdldCgnc3BhY2UnLCBpZCk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU2F2ZWRPYmplY3RUb1NwYWNlKHNhdmVkT2JqZWN0KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjcmVhdGUoc3BhY2U6IFNwYWNlKSB7XG4gICAgaWYgKHRoaXMudXNlUmJhYygpKSB7XG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZUF1dGhvcml6ZWRHbG9iYWxseShcbiAgICAgICAgdGhpcy5hdXRob3JpemF0aW9uLmFjdGlvbnMubWFuYWdlU3BhY2VzLFxuICAgICAgICAnY3JlYXRlJyxcbiAgICAgICAgJ1VuYXV0aG9yaXplZCB0byBjcmVhdGUgc3BhY2VzJ1xuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgcmVwb3NpdG9yeSA9IHRoaXMudXNlUmJhYygpXG4gICAgICA/IHRoaXMuaW50ZXJuYWxTYXZlZE9iamVjdFJlcG9zaXRvcnlcbiAgICAgIDogdGhpcy5jYWxsV2l0aFJlcXVlc3RTYXZlZE9iamVjdFJlcG9zaXRvcnk7XG5cbiAgICBjb25zdCB7IHRvdGFsIH0gPSBhd2FpdCByZXBvc2l0b3J5LmZpbmQoe1xuICAgICAgdHlwZTogJ3NwYWNlJyxcbiAgICAgIHBhZ2U6IDEsXG4gICAgICBwZXJQYWdlOiAwLFxuICAgIH0pO1xuICAgIGlmICh0b3RhbCA+PSB0aGlzLmNvbmZpZy5nZXQoJ3hwYWNrLnNwYWNlcy5tYXhTcGFjZXMnKSkge1xuICAgICAgdGhyb3cgQm9vbS5iYWRSZXF1ZXN0KFxuICAgICAgICAnVW5hYmxlIHRvIGNyZWF0ZSBTcGFjZSwgdGhpcyBleGNlZWRzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBzcGFjZXMgc2V0IGJ5IHRoZSB4cGFjay5zcGFjZXMubWF4U3BhY2VzIHNldHRpbmcnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBvbWl0KHNwYWNlLCBbJ2lkJywgJ19yZXNlcnZlZCddKTtcbiAgICBjb25zdCBpZCA9IHNwYWNlLmlkO1xuICAgIGNvbnN0IGNyZWF0ZWRTYXZlZE9iamVjdCA9IGF3YWl0IHJlcG9zaXRvcnkuY3JlYXRlKCdzcGFjZScsIGF0dHJpYnV0ZXMsIHsgaWQgfSk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU2F2ZWRPYmplY3RUb1NwYWNlKGNyZWF0ZWRTYXZlZE9iamVjdCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdXBkYXRlKGlkOiBzdHJpbmcsIHNwYWNlOiBTcGFjZSkge1xuICAgIGlmICh0aGlzLnVzZVJiYWMoKSkge1xuICAgICAgYXdhaXQgdGhpcy5lbnN1cmVBdXRob3JpemVkR2xvYmFsbHkoXG4gICAgICAgIHRoaXMuYXV0aG9yaXphdGlvbi5hY3Rpb25zLm1hbmFnZVNwYWNlcyxcbiAgICAgICAgJ3VwZGF0ZScsXG4gICAgICAgICdVbmF1dGhvcml6ZWQgdG8gdXBkYXRlIHNwYWNlcydcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLnVzZVJiYWMoKVxuICAgICAgPyB0aGlzLmludGVybmFsU2F2ZWRPYmplY3RSZXBvc2l0b3J5XG4gICAgICA6IHRoaXMuY2FsbFdpdGhSZXF1ZXN0U2F2ZWRPYmplY3RSZXBvc2l0b3J5O1xuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG9taXQoc3BhY2UsICdpZCcsICdfcmVzZXJ2ZWQnKTtcbiAgICBhd2FpdCByZXBvc2l0b3J5LnVwZGF0ZSgnc3BhY2UnLCBpZCwgYXR0cmlidXRlcyk7XG4gICAgY29uc3QgdXBkYXRlZFNhdmVkT2JqZWN0ID0gYXdhaXQgcmVwb3NpdG9yeS5nZXQoJ3NwYWNlJywgaWQpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybVNhdmVkT2JqZWN0VG9TcGFjZSh1cGRhdGVkU2F2ZWRPYmplY3QpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlbGV0ZShpZDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMudXNlUmJhYygpKSB7XG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZUF1dGhvcml6ZWRHbG9iYWxseShcbiAgICAgICAgdGhpcy5hdXRob3JpemF0aW9uLmFjdGlvbnMubWFuYWdlU3BhY2VzLFxuICAgICAgICAnZGVsZXRlJyxcbiAgICAgICAgJ1VuYXV0aG9yaXplZCB0byBkZWxldGUgc3BhY2VzJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXBvc2l0b3J5ID0gdGhpcy51c2VSYmFjKClcbiAgICAgID8gdGhpcy5pbnRlcm5hbFNhdmVkT2JqZWN0UmVwb3NpdG9yeVxuICAgICAgOiB0aGlzLmNhbGxXaXRoUmVxdWVzdFNhdmVkT2JqZWN0UmVwb3NpdG9yeTtcblxuICAgIGNvbnN0IGV4aXN0aW5nU2F2ZWRPYmplY3QgPSBhd2FpdCByZXBvc2l0b3J5LmdldCgnc3BhY2UnLCBpZCk7XG4gICAgaWYgKGlzUmVzZXJ2ZWRTcGFjZSh0aGlzLnRyYW5zZm9ybVNhdmVkT2JqZWN0VG9TcGFjZShleGlzdGluZ1NhdmVkT2JqZWN0KSkpIHtcbiAgICAgIHRocm93IEJvb20uYmFkUmVxdWVzdCgnVGhpcyBTcGFjZSBjYW5ub3QgYmUgZGVsZXRlZCBiZWNhdXNlIGl0IGlzIHJlc2VydmVkLicpO1xuICAgIH1cblxuICAgIGF3YWl0IHJlcG9zaXRvcnkuZGVsZXRlKCdzcGFjZScsIGlkKTtcblxuICAgIGF3YWl0IHJlcG9zaXRvcnkuZGVsZXRlQnlOYW1lc3BhY2UoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSB1c2VSYmFjKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmF1dGhvcml6YXRpb24gJiYgdGhpcy5hdXRob3JpemF0aW9uLm1vZGUudXNlUmJhY0ZvclJlcXVlc3QodGhpcy5yZXF1ZXN0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZW5zdXJlQXV0aG9yaXplZEdsb2JhbGx5KGFjdGlvbjogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgZm9yYmlkZGVuTWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgY2hlY2tQcml2aWxlZ2VzID0gdGhpcy5hdXRob3JpemF0aW9uLmNoZWNrUHJpdmlsZWdlc1dpdGhSZXF1ZXN0KHRoaXMucmVxdWVzdCk7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgaGFzQWxsUmVxdWVzdGVkIH0gPSBhd2FpdCBjaGVja1ByaXZpbGVnZXMuZ2xvYmFsbHkoYWN0aW9uKTtcblxuICAgIGlmIChoYXNBbGxSZXF1ZXN0ZWQpIHtcbiAgICAgIHRoaXMuYXVkaXRMb2dnZXIuc3BhY2VzQXV0aG9yaXphdGlvblN1Y2Nlc3ModXNlcm5hbWUsIG1ldGhvZCk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXVkaXRMb2dnZXIuc3BhY2VzQXV0aG9yaXphdGlvbkZhaWx1cmUodXNlcm5hbWUsIG1ldGhvZCk7XG4gICAgICB0aHJvdyBCb29tLmZvcmJpZGRlbihmb3JiaWRkZW5NZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGVuc3VyZUF1dGhvcml6ZWRBdFNwYWNlKFxuICAgIHNwYWNlSWQ6IHN0cmluZyxcbiAgICBhY3Rpb246IHN0cmluZyxcbiAgICBtZXRob2Q6IHN0cmluZyxcbiAgICBmb3JiaWRkZW5NZXNzYWdlOiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgY2hlY2tQcml2aWxlZ2VzID0gdGhpcy5hdXRob3JpemF0aW9uLmNoZWNrUHJpdmlsZWdlc1dpdGhSZXF1ZXN0KHRoaXMucmVxdWVzdCk7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgaGFzQWxsUmVxdWVzdGVkIH0gPSBhd2FpdCBjaGVja1ByaXZpbGVnZXMuYXRTcGFjZShzcGFjZUlkLCBhY3Rpb24pO1xuXG4gICAgaWYgKGhhc0FsbFJlcXVlc3RlZCkge1xuICAgICAgdGhpcy5hdWRpdExvZ2dlci5zcGFjZXNBdXRob3JpemF0aW9uU3VjY2Vzcyh1c2VybmFtZSwgbWV0aG9kLCBbc3BhY2VJZF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmF1ZGl0TG9nZ2VyLnNwYWNlc0F1dGhvcml6YXRpb25GYWlsdXJlKHVzZXJuYW1lLCBtZXRob2QsIFtzcGFjZUlkXSk7XG4gICAgICB0aHJvdyBCb29tLmZvcmJpZGRlbihmb3JiaWRkZW5NZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zZm9ybVNhdmVkT2JqZWN0VG9TcGFjZShzYXZlZE9iamVjdDogYW55KTogU3BhY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogc2F2ZWRPYmplY3QuaWQsXG4gICAgICAuLi5zYXZlZE9iamVjdC5hdHRyaWJ1dGVzLFxuICAgIH0gYXMgU3BhY2U7XG4gIH1cbn1cbiJdfQ==