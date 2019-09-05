export interface PackageInfo {
    version: string;
    branch: string;
    buildNum: number;
    buildSha: string;
}
export interface EnvironmentMode {
    name: 'development' | 'production';
    dev: boolean;
    prod: boolean;
}
export declare class Env {
    readonly homeDir: string;
    /**
     * Information about Kibana package (version, build number etc.).
     */
    readonly packageInfo: Readonly<PackageInfo>;
    /**
     * Mode Kibana currently run in (development or production).
     */
    readonly mode: Readonly<EnvironmentMode>;
}
//# sourceMappingURL=env.d.ts.map