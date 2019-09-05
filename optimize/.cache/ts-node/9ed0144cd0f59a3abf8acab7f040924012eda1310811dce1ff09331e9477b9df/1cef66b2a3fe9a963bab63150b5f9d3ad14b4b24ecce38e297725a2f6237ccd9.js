"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const infra_server_1 = require("./infra_server");
const kibana_1 = require("./lib/compose/kibana");
const usage_collector_1 = require("./usage/usage_collector");
exports.initServerWithKibana = (kbnServer) => {
    const libs = kibana_1.compose(kbnServer);
    infra_server_1.initInfraServer(libs);
    // Register a function with server to manage the collection of usage stats
    kbnServer.usage.collectorSet.register(usage_collector_1.UsageCollector.getUsageCollector(kbnServer));
};
exports.getConfigSchema = (Joi) => {
    const InfraDefaultSourceConfigSchema = Joi.object({
        metricAlias: Joi.string(),
        logAlias: Joi.string(),
        fields: Joi.object({
            container: Joi.string(),
            host: Joi.string(),
            message: Joi.array()
                .items(Joi.string())
                .single(),
            pod: Joi.string(),
            tiebreaker: Joi.string(),
            timestamp: Joi.string(),
        }),
    });
    const InfraRootConfigSchema = Joi.object({
        enabled: Joi.boolean().default(true),
        query: Joi.object({
            partitionSize: Joi.number(),
            partitionFactor: Joi.number(),
        }).default(),
        sources: Joi.object()
            .keys({
            default: InfraDefaultSourceConfigSchema,
        })
            .default(),
    }).default();
    return InfraRootConfigSchema;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2tpYmFuYS5pbmRleC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2tpYmFuYS5pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFJSCxpREFBaUQ7QUFDakQsaURBQStDO0FBQy9DLDZEQUF5RDtBQU01QyxRQUFBLG9CQUFvQixHQUFHLENBQUMsU0FBb0IsRUFBRSxFQUFFO0lBQzNELE1BQU0sSUFBSSxHQUFHLGdCQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsOEJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV0QiwwRUFBMEU7SUFDMUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGdDQUFjLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNyRixDQUFDLENBQUM7QUFFVyxRQUFBLGVBQWUsR0FBRyxDQUFDLEdBQXdCLEVBQUUsRUFBRTtJQUMxRCxNQUFNLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEQsV0FBVyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDekIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDakIsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUU7WUFDbEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUU7aUJBQ2pCLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ25CLE1BQU0sRUFBRTtZQUNYLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2pCLFVBQVUsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ3hCLFNBQVMsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFO1NBQ3hCLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxNQUFNLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDdkMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3BDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2hCLGFBQWEsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQzNCLGVBQWUsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFO1NBQzlCLENBQUMsQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRTthQUNsQixJQUFJLENBQUM7WUFDSixPQUFPLEVBQUUsOEJBQThCO1NBQ3hDLENBQUM7YUFDRCxPQUFPLEVBQUU7S0FDYixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFYixPQUFPLHFCQUFxQixDQUFDO0FBQy9CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IEpvaU5hbWVzcGFjZSBmcm9tICdqb2knO1xuaW1wb3J0IHsgaW5pdEluZnJhU2VydmVyIH0gZnJvbSAnLi9pbmZyYV9zZXJ2ZXInO1xuaW1wb3J0IHsgY29tcG9zZSB9IGZyb20gJy4vbGliL2NvbXBvc2Uva2liYW5hJztcbmltcG9ydCB7IFVzYWdlQ29sbGVjdG9yIH0gZnJvbSAnLi91c2FnZS91c2FnZV9jb2xsZWN0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIEtiblNlcnZlciBleHRlbmRzIFNlcnZlciB7XG4gIHVzYWdlOiBhbnk7XG59XG5cbmV4cG9ydCBjb25zdCBpbml0U2VydmVyV2l0aEtpYmFuYSA9IChrYm5TZXJ2ZXI6IEtiblNlcnZlcikgPT4ge1xuICBjb25zdCBsaWJzID0gY29tcG9zZShrYm5TZXJ2ZXIpO1xuICBpbml0SW5mcmFTZXJ2ZXIobGlicyk7XG5cbiAgLy8gUmVnaXN0ZXIgYSBmdW5jdGlvbiB3aXRoIHNlcnZlciB0byBtYW5hZ2UgdGhlIGNvbGxlY3Rpb24gb2YgdXNhZ2Ugc3RhdHNcbiAga2JuU2VydmVyLnVzYWdlLmNvbGxlY3RvclNldC5yZWdpc3RlcihVc2FnZUNvbGxlY3Rvci5nZXRVc2FnZUNvbGxlY3RvcihrYm5TZXJ2ZXIpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb25maWdTY2hlbWEgPSAoSm9pOiB0eXBlb2YgSm9pTmFtZXNwYWNlKSA9PiB7XG4gIGNvbnN0IEluZnJhRGVmYXVsdFNvdXJjZUNvbmZpZ1NjaGVtYSA9IEpvaS5vYmplY3Qoe1xuICAgIG1ldHJpY0FsaWFzOiBKb2kuc3RyaW5nKCksXG4gICAgbG9nQWxpYXM6IEpvaS5zdHJpbmcoKSxcbiAgICBmaWVsZHM6IEpvaS5vYmplY3Qoe1xuICAgICAgY29udGFpbmVyOiBKb2kuc3RyaW5nKCksXG4gICAgICBob3N0OiBKb2kuc3RyaW5nKCksXG4gICAgICBtZXNzYWdlOiBKb2kuYXJyYXkoKVxuICAgICAgICAuaXRlbXMoSm9pLnN0cmluZygpKVxuICAgICAgICAuc2luZ2xlKCksXG4gICAgICBwb2Q6IEpvaS5zdHJpbmcoKSxcbiAgICAgIHRpZWJyZWFrZXI6IEpvaS5zdHJpbmcoKSxcbiAgICAgIHRpbWVzdGFtcDogSm9pLnN0cmluZygpLFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCBJbmZyYVJvb3RDb25maWdTY2hlbWEgPSBKb2kub2JqZWN0KHtcbiAgICBlbmFibGVkOiBKb2kuYm9vbGVhbigpLmRlZmF1bHQodHJ1ZSksXG4gICAgcXVlcnk6IEpvaS5vYmplY3Qoe1xuICAgICAgcGFydGl0aW9uU2l6ZTogSm9pLm51bWJlcigpLFxuICAgICAgcGFydGl0aW9uRmFjdG9yOiBKb2kubnVtYmVyKCksXG4gICAgfSkuZGVmYXVsdCgpLFxuICAgIHNvdXJjZXM6IEpvaS5vYmplY3QoKVxuICAgICAgLmtleXMoe1xuICAgICAgICBkZWZhdWx0OiBJbmZyYURlZmF1bHRTb3VyY2VDb25maWdTY2hlbWEsXG4gICAgICB9KVxuICAgICAgLmRlZmF1bHQoKSxcbiAgfSkuZGVmYXVsdCgpO1xuXG4gIHJldHVybiBJbmZyYVJvb3RDb25maWdTY2hlbWE7XG59O1xuIl19