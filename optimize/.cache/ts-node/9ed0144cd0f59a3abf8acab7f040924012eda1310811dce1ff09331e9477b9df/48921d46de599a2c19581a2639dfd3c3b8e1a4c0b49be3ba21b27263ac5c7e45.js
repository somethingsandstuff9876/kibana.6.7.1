"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const joi_1 = tslib_1.__importDefault(require("joi"));
const path_1 = require("path");
const constants_1 = require("./common/constants");
const plugin_1 = require("./common/constants/plugin");
const kibana_index_1 = require("./server/kibana.index");
const DEFAULT_ENROLLMENT_TOKENS_TTL_S = 10 * 60; // 10 minutes
exports.config = joi_1.default.object({
    enabled: joi_1.default.boolean().default(true),
    defaultUserRoles: joi_1.default.array()
        .items(joi_1.default.string())
        .default(['superuser']),
    encryptionKey: joi_1.default.string().default('xpack_beats_default_encryptionKey'),
    enrollmentTokensTtlInSeconds: joi_1.default.number()
        .integer()
        .min(1)
        .max(10 * 60 * 14) // No more then 2 weeks for security reasons
        .default(DEFAULT_ENROLLMENT_TOKENS_TTL_S),
}).default();
function beats(kibana) {
    return new kibana.Plugin({
        id: constants_1.PLUGIN.ID,
        require: ['kibana', 'elasticsearch', 'xpack_main'],
        publicDir: path_1.resolve(__dirname, 'public'),
        uiExports: {
            managementSections: ['plugins/beats_management'],
        },
        config: () => exports.config,
        configPrefix: plugin_1.CONFIG_PREFIX,
        init(server) {
            kibana_index_1.initServerWithKibana(server);
        },
    });
}
exports.beats = beats;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9pbmRleC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsc0RBQXNCO0FBQ3RCLCtCQUErQjtBQUMvQixrREFBNEM7QUFDNUMsc0RBQTBEO0FBQzFELHdEQUE2RDtBQUc3RCxNQUFNLCtCQUErQixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxhQUFhO0FBRWpELFFBQUEsTUFBTSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7SUFDL0IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3BDLGdCQUFnQixFQUFFLGFBQUcsQ0FBQyxLQUFLLEVBQUU7U0FDMUIsS0FBSyxDQUFDLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNuQixPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QixhQUFhLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQztJQUN4RSw0QkFBNEIsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO1NBQ3ZDLE9BQU8sRUFBRTtTQUNULEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDTixHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyw0Q0FBNEM7U0FDOUQsT0FBTyxDQUFDLCtCQUErQixDQUFDO0NBQzVDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUViLFNBQWdCLEtBQUssQ0FBQyxNQUFXO0lBQy9CLE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLEVBQUUsRUFBRSxrQkFBTSxDQUFDLEVBQUU7UUFDYixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQztRQUNsRCxTQUFTLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDdkMsU0FBUyxFQUFFO1lBQ1Qsa0JBQWtCLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztTQUNqRDtRQUNELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxjQUFNO1FBQ3BCLFlBQVksRUFBRSxzQkFBYTtRQUMzQixJQUFJLENBQUMsTUFBMEI7WUFDN0IsbUNBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFkRCxzQkFjQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBQTFVHSU4gfSBmcm9tICcuL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgQ09ORklHX1BSRUZJWCB9IGZyb20gJy4vY29tbW9uL2NvbnN0YW50cy9wbHVnaW4nO1xuaW1wb3J0IHsgaW5pdFNlcnZlcldpdGhLaWJhbmEgfSBmcm9tICcuL3NlcnZlci9raWJhbmEuaW5kZXgnO1xuaW1wb3J0IHsgS2liYW5hTGVnYWN5U2VydmVyIH0gZnJvbSAnLi9zZXJ2ZXIvbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9hZGFwdGVyX3R5cGVzJztcblxuY29uc3QgREVGQVVMVF9FTlJPTExNRU5UX1RPS0VOU19UVExfUyA9IDEwICogNjA7IC8vIDEwIG1pbnV0ZXNcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IEpvaS5vYmplY3Qoe1xuICBlbmFibGVkOiBKb2kuYm9vbGVhbigpLmRlZmF1bHQodHJ1ZSksXG4gIGRlZmF1bHRVc2VyUm9sZXM6IEpvaS5hcnJheSgpXG4gICAgLml0ZW1zKEpvaS5zdHJpbmcoKSlcbiAgICAuZGVmYXVsdChbJ3N1cGVydXNlciddKSxcbiAgZW5jcnlwdGlvbktleTogSm9pLnN0cmluZygpLmRlZmF1bHQoJ3hwYWNrX2JlYXRzX2RlZmF1bHRfZW5jcnlwdGlvbktleScpLFxuICBlbnJvbGxtZW50VG9rZW5zVHRsSW5TZWNvbmRzOiBKb2kubnVtYmVyKClcbiAgICAuaW50ZWdlcigpXG4gICAgLm1pbigxKVxuICAgIC5tYXgoMTAgKiA2MCAqIDE0KSAvLyBObyBtb3JlIHRoZW4gMiB3ZWVrcyBmb3Igc2VjdXJpdHkgcmVhc29uc1xuICAgIC5kZWZhdWx0KERFRkFVTFRfRU5ST0xMTUVOVF9UT0tFTlNfVFRMX1MpLFxufSkuZGVmYXVsdCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gYmVhdHMoa2liYW5hOiBhbnkpIHtcbiAgcmV0dXJuIG5ldyBraWJhbmEuUGx1Z2luKHtcbiAgICBpZDogUExVR0lOLklELFxuICAgIHJlcXVpcmU6IFsna2liYW5hJywgJ2VsYXN0aWNzZWFyY2gnLCAneHBhY2tfbWFpbiddLFxuICAgIHB1YmxpY0RpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKSxcbiAgICB1aUV4cG9ydHM6IHtcbiAgICAgIG1hbmFnZW1lbnRTZWN0aW9uczogWydwbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQnXSxcbiAgICB9LFxuICAgIGNvbmZpZzogKCkgPT4gY29uZmlnLFxuICAgIGNvbmZpZ1ByZWZpeDogQ09ORklHX1BSRUZJWCxcbiAgICBpbml0KHNlcnZlcjogS2liYW5hTGVnYWN5U2VydmVyKSB7XG4gICAgICBpbml0U2VydmVyV2l0aEtpYmFuYShzZXJ2ZXIpO1xuICAgIH0sXG4gIH0pO1xufVxuIl19