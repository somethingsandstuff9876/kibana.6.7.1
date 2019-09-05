import { Type } from '@kbn/config-schema';
import { Observable } from 'rxjs';
import { ConfigWithSchema, EnvironmentMode } from '../config';
import { LoggerFactory } from '../logging';
export interface PluginInitializerContext {
    env: {
        mode: EnvironmentMode;
    };
    logger: LoggerFactory;
    config: {
        create: <Schema extends Type<any>, Config>(ConfigClass: ConfigWithSchema<Schema, Config>) => Observable<Config>;
        createIfExists: <Schema extends Type<any>, Config>(ConfigClass: ConfigWithSchema<Schema, Config>) => Observable<Config | undefined>;
    };
}
export interface PluginStartContext {
}
//# sourceMappingURL=plugin_context.d.ts.map