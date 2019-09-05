import { Type, TypeOptions } from './type';
export declare type Props = Record<string, Type<any>>;
export declare type TypeOf<RT extends Type<any>> = RT['type'];
export declare type ObjectResultType<P extends Props> = Readonly<{
    [K in keyof P]: TypeOf<P[K]>;
}>;
export declare class ObjectType<P extends Props = any> extends Type<ObjectResultType<P>> {
    constructor(props: P, options?: TypeOptions<{
        [K in keyof P]: TypeOf<P[K]>;
    }>);
    protected handleError(type: string, { reason, value }: Record<string, any>): any;
}
//# sourceMappingURL=object_type.d.ts.map