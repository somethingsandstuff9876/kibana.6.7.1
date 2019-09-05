import { Duration } from '../duration';
import { SchemaTypeError } from '../errors';
import { Type } from './type';
export interface DurationOptions {
    validate?: (value: Duration) => string | void;
    defaultValue?: Duration | string | number;
}
export declare class DurationType extends Type<Duration> {
    constructor(options?: DurationOptions);
    protected handleError(type: string, { message, value }: Record<string, any>, path: string[]): string | SchemaTypeError | undefined;
}
//# sourceMappingURL=duration_type.d.ts.map