/**
 * This file re-exports only those Kibana types that we'd like plugins to have access to.
 *
 * Generated types are referenced from the `types` field of the Kibana's `package.json`, so
 * that plugins can just reference Kibana root folder to access all required types.
 *
 * Here is an example of how plugin can use these types assuming it is located
 * in one of the known plugin locations (kibana/plugins/* or kibana-extra/*):
 *
 * ```ts
 * import { Logger, PluginInitializerContext, PluginStartContext } from '../../kibana';
 *
 * export interface SomePluginContract {
 *   setValue: (val: string) => void;
 * }
 *
 * class Plugin {
 *   private readonly log: Logger;
 *
 *   constructor(private readonly initializerContext: PluginInitializerContext) {
 *     this.log = initializerContext.logger.get();
 *   }
 *
 *   start(startContext: PluginStartContext, deps: Record<string, any>) {
 *    this.log.info('Hello from plugin!');
 *
 *    let value = 'Hello World!';
 *
 *    const router = startContext.http.createAndRegisterRouter('/some-path');
 *    router.get('/some-value', (req, res) => res.ok(value));
 *
 *    return { setValue: (val: string) => { value = val; } };
 *   }
 * }
 *
 * export plugin = (initializerContext: PluginInitializerContext) => new Plugin(initializerContext));
 * ```
 *
 * **NOTE:** If the code is not needed in plugins, we can add a `at_internal` JSDoc
 * annotation to that code. And since we've specified the `stripInternal` compiler
 * option TypeScript will not emit declarations for this code.
 */
export { Logger, LoggerFactory } from './core/server/logging';
export { PluginInitializerContext, PluginName, PluginStartContext } from './core/server/plugins';
//# sourceMappingURL=type_exports.d.ts.map