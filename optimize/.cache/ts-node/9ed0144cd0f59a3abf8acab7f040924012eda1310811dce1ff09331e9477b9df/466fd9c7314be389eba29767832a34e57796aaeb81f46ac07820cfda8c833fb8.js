"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configBlockSchemas = [
    {
        id: 'filebeat.inputs',
        name: 'Filebeat Input',
        version: 6.7,
        allowOtherConfigs: true,
        configs: [
            {
                id: 'paths',
                ui: {
                    label: 'Paths',
                    labelId: 'filebeatInputConfig.paths.ui.label',
                    type: 'multi-input',
                    helpText: 'filebeatInputConfig.paths.ui.helpText',
                    helpTextId: 'filebeatInputConfig.paths.ui.helpText',
                    placeholder: `first/path/to/file.json                   second/path/to/otherfile.json`,
                },
                validation: 'isPaths',
                error: 'filebeatInputConfig.paths.error',
                errorId: 'filebeatInputConfig.paths.error',
                required: true,
            },
        ],
    },
    {
        id: 'filebeat.modules',
        name: 'Filebeat Modules',
        version: 6.7,
        allowOtherConfigs: true,
        configs: [
            {
                id: '_sub_type',
                ui: {
                    label: 'filebeatModuleConfig.module.ui.label',
                    labelId: 'filebeatModuleConfig.module.ui.label',
                    type: 'select',
                },
                options: [
                    {
                        value: 'apache2',
                        text: 'apache2',
                    },
                    {
                        value: 'auditd',
                        text: 'auditd',
                    },
                    {
                        value: 'elasticsearch',
                        text: 'elasticsearch',
                    },
                    {
                        value: 'haproxy',
                        text: 'haproxy',
                    },
                    {
                        value: 'icinga',
                        text: 'icinga',
                    },
                    {
                        value: 'iis',
                        text: 'iis',
                    },
                    {
                        value: 'kafka',
                        text: 'kafka',
                    },
                    {
                        value: 'kibana',
                        text: 'kibana',
                    },
                    {
                        value: 'logstash',
                        text: 'logstash',
                    },
                    {
                        value: 'mongodb',
                        text: 'mongodb',
                    },
                    {
                        value: 'mysql',
                        text: 'mysql',
                    },
                    {
                        value: 'nginx',
                        text: 'nginx',
                    },
                    {
                        value: 'osquery',
                        text: 'osquery',
                    },
                    {
                        value: 'postgresql',
                        text: 'postgresql',
                    },
                    {
                        value: 'redis',
                        text: 'redis',
                    },
                    {
                        value: 'system',
                        text: 'system',
                    },
                    {
                        value: 'traefik',
                        text: 'traefik',
                    },
                ],
                error: 'filebeatModuleConfig.module.error',
                errorId: 'filebeatModuleConfig.module.error',
                required: true,
            },
        ],
    },
    {
        id: 'metricbeat.modules',
        name: 'Metricbeat Modules',
        version: 6.7,
        allowOtherConfigs: true,
        configs: [
            {
                id: '_sub_type',
                ui: {
                    label: 'metricbeatModuleConfig.module.ui.label',
                    labelId: 'metricbeatModuleConfig.module.ui.label',
                    type: 'select',
                },
                options: [
                    {
                        value: 'aerospike',
                        text: 'aerospike',
                    },
                    {
                        value: 'apache',
                        text: 'apache',
                    },
                    {
                        value: 'ceph',
                        text: 'ceph',
                    },
                    {
                        value: 'couchbase',
                        text: 'couchbase',
                    },
                    {
                        value: 'docker',
                        text: 'docker',
                    },
                    {
                        value: 'dropwizard',
                        text: 'dropwizard',
                    },
                    {
                        value: 'elasticsearch',
                        text: 'elasticsearch',
                    },
                    {
                        value: 'envoyproxy',
                        text: 'envoyproxy',
                    },
                    {
                        value: 'etcd',
                        text: 'etcd',
                    },
                    {
                        value: 'golang',
                        text: 'golang',
                    },
                    {
                        value: 'graphite',
                        text: 'graphite',
                    },
                    {
                        value: 'haproxy',
                        text: 'haproxy',
                    },
                    {
                        value: 'http',
                        text: 'http',
                    },
                    {
                        value: 'jolokia',
                        text: 'jolokia',
                    },
                    {
                        value: 'kafka',
                        text: 'kafka',
                    },
                    {
                        value: 'kibana',
                        text: 'kibana',
                    },
                    {
                        value: 'kubernetes',
                        text: 'kubernetes',
                    },
                    {
                        value: 'kvm',
                        text: 'kvm',
                    },
                    {
                        value: 'logstash',
                        text: 'logstash',
                    },
                    {
                        value: 'memcached',
                        text: 'memcached',
                    },
                    {
                        value: 'mongodb',
                        text: 'mongodb',
                    },
                    {
                        value: 'munin',
                        text: 'munin',
                    },
                    {
                        value: 'mysql',
                        text: 'mysql',
                    },
                    {
                        value: 'nginx',
                        text: 'nginx',
                    },
                    {
                        value: 'php_fpm',
                        text: 'php_fpm',
                    },
                    {
                        value: 'postgresql',
                        text: 'postgresql',
                    },
                    {
                        value: 'prometheus',
                        text: 'prometheus',
                    },
                    {
                        value: 'rabbitmq',
                        text: 'rabbitmq',
                    },
                    {
                        value: 'redis',
                        text: 'redis',
                    },
                    {
                        value: 'system',
                        text: 'system',
                    },
                    {
                        value: 'traefik',
                        text: 'traefik',
                    },
                    {
                        value: 'uwsgi',
                        text: 'uwsgi',
                    },
                    {
                        value: 'vsphere',
                        text: 'vsphere',
                    },
                    {
                        value: 'windows',
                        text: 'windows',
                    },
                    {
                        value: 'zookeeper',
                        text: 'zookeeper',
                    },
                ],
                error: 'metricbeatModuleConfig.module.error',
                errorId: 'metricbeatModuleConfig.module.error',
                required: true,
            },
            {
                id: 'hosts',
                ui: {
                    label: 'metricbeatModuleConfig.hosts.ui.label',
                    labelId: 'metricbeatModuleConfig.hosts.ui.label',
                    type: 'multi-input',
                    helpText: 'metricbeatModuleConfig.hosts.ui.helpText',
                    helpTextId: 'metricbeatModuleConfig.hosts.ui.helpText',
                    placeholder: `somehost.local                                                             otherhost.local`,
                },
                validation: 'isHosts',
                error: 'metricbeatModuleConfig.hosts.error',
                errorId: 'metricbeatModuleConfig.hosts.error',
                required: false,
            },
            {
                id: 'period',
                ui: {
                    label: 'metricbeatModuleConfig.period.ui.label',
                    labelId: 'metricbeatModuleConfig.period.ui.label',
                    type: 'input',
                },
                defaultValue: '10s',
                validation: 'isPeriod',
                error: 'metricbeatModuleConfig.period.error',
                errorId: 'metricbeatModuleConfig.period.error',
                required: true,
            },
        ],
    },
    {
        id: 'output',
        name: 'Outputs',
        allowOtherConfigs: true,
        version: 6.7,
        configs: [
            {
                id: '_sub_type',
                ui: {
                    label: 'outputConfig.output.ui.label',
                    labelId: 'outputConfig.output.ui.label',
                    type: 'select',
                },
                options: [
                    {
                        value: 'elasticsearch',
                        text: 'Elasticsearch',
                    },
                    {
                        value: 'logstash',
                        text: 'Logstash',
                    },
                    {
                        value: 'kafka',
                        text: 'Kafka',
                    },
                    {
                        value: 'redis',
                        text: 'Redis',
                    },
                ],
                error: 'outputConfig.output.error',
                errorId: 'outputConfig.output.error',
                required: true,
            },
            {
                id: 'hosts',
                ui: {
                    label: 'outputConfig.hosts.ui.label',
                    labelId: 'outputConfig.hosts.ui.label',
                    type: 'multi-input',
                },
                validation: 'isHosts',
                error: 'outputConfig.hosts.error',
                errorId: 'outputConfig.hosts.error',
                parseValidResult: v => v.split('\n'),
            },
            {
                id: 'username',
                ui: {
                    label: 'outputConfig.username.ui.label',
                    labelId: 'outputConfig.username.ui.label',
                    type: 'input',
                },
                validation: 'isString',
                error: 'outputConfig.username.error',
                errorId: 'outputConfig.username.error',
            },
            {
                id: 'password',
                ui: {
                    label: 'outputConfig.password.ui.label',
                    labelId: 'outputConfig.password.ui.label',
                    type: 'password',
                },
                validation: 'isString',
                error: 'outputConfig.password.error',
                errorId: 'outputConfig.password.error',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9jb21tb24vY29uZmlnX3NjaGVtYXMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvY29tbW9uL2NvbmZpZ19zY2hlbWFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUWEsUUFBQSxrQkFBa0IsR0FBd0I7SUFDckQ7UUFDRSxFQUFFLEVBQUUsaUJBQWlCO1FBQ3JCLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsT0FBTyxFQUFFLEdBQUc7UUFDWixpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLEVBQUUsRUFBRSxPQUFPO2dCQUNYLEVBQUUsRUFBRTtvQkFDRixLQUFLLEVBQUUsT0FBTztvQkFDZCxPQUFPLEVBQUUsb0NBQW9DO29CQUM3QyxJQUFJLEVBQUUsYUFBYTtvQkFDbkIsUUFBUSxFQUFFLHVDQUF1QztvQkFDakQsVUFBVSxFQUFFLHVDQUF1QztvQkFDbkQsV0FBVyxFQUFFLHlFQUF5RTtpQkFDdkY7Z0JBQ0QsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLEtBQUssRUFBRSxpQ0FBaUM7Z0JBQ3hDLE9BQU8sRUFBRSxpQ0FBaUM7Z0JBQzFDLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsa0JBQWtCO1FBQ3RCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLEdBQUc7UUFDWixpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLEVBQUUsRUFBRSxXQUFXO2dCQUNmLEVBQUUsRUFBRTtvQkFDRixLQUFLLEVBQUUsc0NBQXNDO29CQUM3QyxPQUFPLEVBQUUsc0NBQXNDO29CQUMvQyxJQUFJLEVBQUUsUUFBUTtpQkFDZjtn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QUNyQixLQUFLLEVBQUUsMEJBQTBCO2dCQUNqQyxPQUFPLEVBQUUsMEJBQTBCO2dCQUNuQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ3JDO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLFVBQVU7Z0JBQ2QsRUFBRSxFQUFFO29CQUNGLEtBQUssRUFBRSxnQ0FBZ0M7b0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7b0JBQ3pDLElBQUksRUFBRSxPQUFPO2lCQUNkO2dCQUNELFVBQVUsRUFBRSxVQUFVO2dCQUN0QixLQUFLLEVBQUUsNkJBQTZCO2dCQUNwQyxPQUFPLEVBQUUsNkJBQTZCO2FBQ3ZDO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLFVBQVU7Z0JBQ2QsRUFBRSxFQUFFO29CQUNGLEtBQUssRUFBRSxnQ0FBZ0M7b0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7b0JBQ3pDLElBQUksRUFBRSxVQUFVO2lCQUNqQjtnQkFDRCxVQUFVLEVBQUUsVUFBVTtnQkFDdEIsS0FBSyxFQUFFLDZCQUE2QjtnQkFDcEMsT0FBTyxFQUFFLDZCQUE2QjthQUN2QztTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cbi8vIE5vdGU6IGltcG9ydGluZyB0aGlzIGlzIGEgdGVtcCB0aGluZy4gVGhpcyBmaWxlIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBKU09OIGZyb20gQmVhdHMvRVMgYXQgc29tZSBwb2ludFxuaW1wb3J0IHsgQ29uZmlnQmxvY2tTY2hlbWEgfSBmcm9tICcuL2RvbWFpbl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjb25maWdCbG9ja1NjaGVtYXM6IENvbmZpZ0Jsb2NrU2NoZW1hW10gPSBbXG4gIHtcbiAgICBpZDogJ2ZpbGViZWF0LmlucHV0cycsXG4gICAgbmFtZTogJ0ZpbGViZWF0IElucHV0JyxcbiAgICB2ZXJzaW9uOiA2LjcsXG4gICAgYWxsb3dPdGhlckNvbmZpZ3M6IHRydWUsXG4gICAgY29uZmlnczogW1xuICAgICAge1xuICAgICAgICBpZDogJ3BhdGhzJyxcbiAgICAgICAgdWk6IHtcbiAgICAgICAgICBsYWJlbDogJ1BhdGhzJyxcbiAgICAgICAgICBsYWJlbElkOiAnZmlsZWJlYXRJbnB1dENvbmZpZy5wYXRocy51aS5sYWJlbCcsXG4gICAgICAgICAgdHlwZTogJ211bHRpLWlucHV0JyxcbiAgICAgICAgICBoZWxwVGV4dDogJ2ZpbGViZWF0SW5wdXRDb25maWcucGF0aHMudWkuaGVscFRleHQnLFxuICAgICAgICAgIGhlbHBUZXh0SWQ6ICdmaWxlYmVhdElucHV0Q29uZmlnLnBhdGhzLnVpLmhlbHBUZXh0JyxcbiAgICAgICAgICBwbGFjZWhvbGRlcjogYGZpcnN0L3BhdGgvdG8vZmlsZS5qc29uICAgICAgICAgICAgICAgICAgIHNlY29uZC9wYXRoL3RvL290aGVyZmlsZS5qc29uYCxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGlvbjogJ2lzUGF0aHMnLFxuICAgICAgICBlcnJvcjogJ2ZpbGViZWF0SW5wdXRDb25maWcucGF0aHMuZXJyb3InLFxuICAgICAgICBlcnJvcklkOiAnZmlsZWJlYXRJbnB1dENvbmZpZy5wYXRocy5lcnJvcicsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdmaWxlYmVhdC5tb2R1bGVzJyxcbiAgICBuYW1lOiAnRmlsZWJlYXQgTW9kdWxlcycsXG4gICAgdmVyc2lvbjogNi43LFxuICAgIGFsbG93T3RoZXJDb25maWdzOiB0cnVlLFxuICAgIGNvbmZpZ3M6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdfc3ViX3R5cGUnLFxuICAgICAgICB1aToge1xuICAgICAgICAgIGxhYmVsOiAnZmlsZWJlYXRNb2R1bGVDb25maWcubW9kdWxlLnVpLmxhYmVsJyxcbiAgICAgICAgICBsYWJlbElkOiAnZmlsZWJlYXRNb2R1bGVDb25maWcubW9kdWxlLnVpLmxhYmVsJyxcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnYXBhY2hlMicsXG4gICAgICAgICAgICB0ZXh0OiAnYXBhY2hlMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2F1ZGl0ZCcsXG4gICAgICAgICAgICB0ZXh0OiAnYXVkaXRkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnZWxhc3RpY3NlYXJjaCcsXG4gICAgICAgICAgICB0ZXh0OiAnZWxhc3RpY3NlYXJjaCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2hhcHJveHknLFxuICAgICAgICAgICAgdGV4dDogJ2hhcHJveHknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdpY2luZ2EnLFxuICAgICAgICAgICAgdGV4dDogJ2ljaW5nYScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2lpcycsXG4gICAgICAgICAgICB0ZXh0OiAnaWlzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAna2Fma2EnLFxuICAgICAgICAgICAgdGV4dDogJ2thZmthJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAna2liYW5hJyxcbiAgICAgICAgICAgIHRleHQ6ICdraWJhbmEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdsb2dzdGFzaCcsXG4gICAgICAgICAgICB0ZXh0OiAnbG9nc3Rhc2gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdtb25nb2RiJyxcbiAgICAgICAgICAgIHRleHQ6ICdtb25nb2RiJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnbXlzcWwnLFxuICAgICAgICAgICAgdGV4dDogJ215c3FsJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnbmdpbngnLFxuICAgICAgICAgICAgdGV4dDogJ25naW54JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnb3NxdWVyeScsXG4gICAgICAgICAgICB0ZXh0OiAnb3NxdWVyeScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3Bvc3RncmVzcWwnLFxuICAgICAgICAgICAgdGV4dDogJ3Bvc3RncmVzcWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdyZWRpcycsXG4gICAgICAgICAgICB0ZXh0OiAncmVkaXMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgdGV4dDogJ3N5c3RlbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3RyYWVmaWsnLFxuICAgICAgICAgICAgdGV4dDogJ3RyYWVmaWsnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGVycm9yOiAnZmlsZWJlYXRNb2R1bGVDb25maWcubW9kdWxlLmVycm9yJyxcbiAgICAgICAgZXJyb3JJZDogJ2ZpbGViZWF0TW9kdWxlQ29uZmlnLm1vZHVsZS5lcnJvcicsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdtZXRyaWNiZWF0Lm1vZHVsZXMnLFxuICAgIG5hbWU6ICdNZXRyaWNiZWF0IE1vZHVsZXMnLFxuICAgIHZlcnNpb246IDYuNyxcbiAgICBhbGxvd090aGVyQ29uZmlnczogdHJ1ZSxcbiAgICBjb25maWdzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnX3N1Yl90eXBlJyxcbiAgICAgICAgdWk6IHtcbiAgICAgICAgICBsYWJlbDogJ21ldHJpY2JlYXRNb2R1bGVDb25maWcubW9kdWxlLnVpLmxhYmVsJyxcbiAgICAgICAgICBsYWJlbElkOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5tb2R1bGUudWkubGFiZWwnLFxuICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICB9LFxuICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdhZXJvc3Bpa2UnLFxuICAgICAgICAgICAgdGV4dDogJ2Flcm9zcGlrZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2FwYWNoZScsXG4gICAgICAgICAgICB0ZXh0OiAnYXBhY2hlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnY2VwaCcsXG4gICAgICAgICAgICB0ZXh0OiAnY2VwaCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2NvdWNoYmFzZScsXG4gICAgICAgICAgICB0ZXh0OiAnY291Y2hiYXNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnZG9ja2VyJyxcbiAgICAgICAgICAgIHRleHQ6ICdkb2NrZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdkcm9wd2l6YXJkJyxcbiAgICAgICAgICAgIHRleHQ6ICdkcm9wd2l6YXJkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnZWxhc3RpY3NlYXJjaCcsXG4gICAgICAgICAgICB0ZXh0OiAnZWxhc3RpY3NlYXJjaCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2Vudm95cHJveHknLFxuICAgICAgICAgICAgdGV4dDogJ2Vudm95cHJveHknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdldGNkJyxcbiAgICAgICAgICAgIHRleHQ6ICdldGNkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnZ29sYW5nJyxcbiAgICAgICAgICAgIHRleHQ6ICdnb2xhbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdncmFwaGl0ZScsXG4gICAgICAgICAgICB0ZXh0OiAnZ3JhcGhpdGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdoYXByb3h5JyxcbiAgICAgICAgICAgIHRleHQ6ICdoYXByb3h5JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnaHR0cCcsXG4gICAgICAgICAgICB0ZXh0OiAnaHR0cCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2pvbG9raWEnLFxuICAgICAgICAgICAgdGV4dDogJ2pvbG9raWEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdrYWZrYScsXG4gICAgICAgICAgICB0ZXh0OiAna2Fma2EnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdraWJhbmEnLFxuICAgICAgICAgICAgdGV4dDogJ2tpYmFuYScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2t1YmVybmV0ZXMnLFxuICAgICAgICAgICAgdGV4dDogJ2t1YmVybmV0ZXMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdrdm0nLFxuICAgICAgICAgICAgdGV4dDogJ2t2bScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2xvZ3N0YXNoJyxcbiAgICAgICAgICAgIHRleHQ6ICdsb2dzdGFzaCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ21lbWNhY2hlZCcsXG4gICAgICAgICAgICB0ZXh0OiAnbWVtY2FjaGVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnbW9uZ29kYicsXG4gICAgICAgICAgICB0ZXh0OiAnbW9uZ29kYicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ211bmluJyxcbiAgICAgICAgICAgIHRleHQ6ICdtdW5pbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ215c3FsJyxcbiAgICAgICAgICAgIHRleHQ6ICdteXNxbCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ25naW54JyxcbiAgICAgICAgICAgIHRleHQ6ICduZ2lueCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3BocF9mcG0nLFxuICAgICAgICAgICAgdGV4dDogJ3BocF9mcG0nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdwb3N0Z3Jlc3FsJyxcbiAgICAgICAgICAgIHRleHQ6ICdwb3N0Z3Jlc3FsJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAncHJvbWV0aGV1cycsXG4gICAgICAgICAgICB0ZXh0OiAncHJvbWV0aGV1cycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3JhYmJpdG1xJyxcbiAgICAgICAgICAgIHRleHQ6ICdyYWJiaXRtcScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3JlZGlzJyxcbiAgICAgICAgICAgIHRleHQ6ICdyZWRpcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3N5c3RlbScsXG4gICAgICAgICAgICB0ZXh0OiAnc3lzdGVtJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAndHJhZWZpaycsXG4gICAgICAgICAgICB0ZXh0OiAndHJhZWZpaycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3V3c2dpJyxcbiAgICAgICAgICAgIHRleHQ6ICd1d3NnaScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3ZzcGhlcmUnLFxuICAgICAgICAgICAgdGV4dDogJ3ZzcGhlcmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICd3aW5kb3dzJyxcbiAgICAgICAgICAgIHRleHQ6ICd3aW5kb3dzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnem9va2VlcGVyJyxcbiAgICAgICAgICAgIHRleHQ6ICd6b29rZWVwZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGVycm9yOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5tb2R1bGUuZXJyb3InLFxuICAgICAgICBlcnJvcklkOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5tb2R1bGUuZXJyb3InLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnaG9zdHMnLFxuICAgICAgICB1aToge1xuICAgICAgICAgIGxhYmVsOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5ob3N0cy51aS5sYWJlbCcsXG4gICAgICAgICAgbGFiZWxJZDogJ21ldHJpY2JlYXRNb2R1bGVDb25maWcuaG9zdHMudWkubGFiZWwnLFxuICAgICAgICAgIHR5cGU6ICdtdWx0aS1pbnB1dCcsXG4gICAgICAgICAgaGVscFRleHQ6ICdtZXRyaWNiZWF0TW9kdWxlQ29uZmlnLmhvc3RzLnVpLmhlbHBUZXh0JyxcbiAgICAgICAgICBoZWxwVGV4dElkOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5ob3N0cy51aS5oZWxwVGV4dCcsXG4gICAgICAgICAgcGxhY2Vob2xkZXI6IGBzb21laG9zdC5sb2NhbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcmhvc3QubG9jYWxgLFxuICAgICAgICB9LFxuICAgICAgICB2YWxpZGF0aW9uOiAnaXNIb3N0cycsXG4gICAgICAgIGVycm9yOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5ob3N0cy5lcnJvcicsXG4gICAgICAgIGVycm9ySWQ6ICdtZXRyaWNiZWF0TW9kdWxlQ29uZmlnLmhvc3RzLmVycm9yJyxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdwZXJpb2QnLFxuICAgICAgICB1aToge1xuICAgICAgICAgIGxhYmVsOiAnbWV0cmljYmVhdE1vZHVsZUNvbmZpZy5wZXJpb2QudWkubGFiZWwnLFxuICAgICAgICAgIGxhYmVsSWQ6ICdtZXRyaWNiZWF0TW9kdWxlQ29uZmlnLnBlcmlvZC51aS5sYWJlbCcsXG4gICAgICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiAnMTBzJyxcbiAgICAgICAgdmFsaWRhdGlvbjogJ2lzUGVyaW9kJyxcbiAgICAgICAgZXJyb3I6ICdtZXRyaWNiZWF0TW9kdWxlQ29uZmlnLnBlcmlvZC5lcnJvcicsXG4gICAgICAgIGVycm9ySWQ6ICdtZXRyaWNiZWF0TW9kdWxlQ29uZmlnLnBlcmlvZC5lcnJvcicsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdvdXRwdXQnLFxuICAgIG5hbWU6ICdPdXRwdXRzJyxcbiAgICBhbGxvd090aGVyQ29uZmlnczogdHJ1ZSxcbiAgICB2ZXJzaW9uOiA2LjcsXG4gICAgY29uZmlnczogW1xuICAgICAge1xuICAgICAgICBpZDogJ19zdWJfdHlwZScsXG4gICAgICAgIHVpOiB7XG4gICAgICAgICAgbGFiZWw6ICdvdXRwdXRDb25maWcub3V0cHV0LnVpLmxhYmVsJyxcbiAgICAgICAgICBsYWJlbElkOiAnb3V0cHV0Q29uZmlnLm91dHB1dC51aS5sYWJlbCcsXG4gICAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ2VsYXN0aWNzZWFyY2gnLFxuICAgICAgICAgICAgdGV4dDogJ0VsYXN0aWNzZWFyY2gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdsb2dzdGFzaCcsXG4gICAgICAgICAgICB0ZXh0OiAnTG9nc3Rhc2gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdrYWZrYScsXG4gICAgICAgICAgICB0ZXh0OiAnS2Fma2EnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdyZWRpcycsXG4gICAgICAgICAgICB0ZXh0OiAnUmVkaXMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGVycm9yOiAnb3V0cHV0Q29uZmlnLm91dHB1dC5lcnJvcicsXG4gICAgICAgIGVycm9ySWQ6ICdvdXRwdXRDb25maWcub3V0cHV0LmVycm9yJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2hvc3RzJyxcbiAgICAgICAgdWk6IHtcbiAgICAgICAgICBsYWJlbDogJ291dHB1dENvbmZpZy5ob3N0cy51aS5sYWJlbCcsXG4gICAgICAgICAgbGFiZWxJZDogJ291dHB1dENvbmZpZy5ob3N0cy51aS5sYWJlbCcsXG4gICAgICAgICAgdHlwZTogJ211bHRpLWlucHV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGlvbjogJ2lzSG9zdHMnLFxuICAgICAgICBlcnJvcjogJ291dHB1dENvbmZpZy5ob3N0cy5lcnJvcicsXG4gICAgICAgIGVycm9ySWQ6ICdvdXRwdXRDb25maWcuaG9zdHMuZXJyb3InLFxuICAgICAgICBwYXJzZVZhbGlkUmVzdWx0OiB2ID0+IHYuc3BsaXQoJ1xcbicpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICd1c2VybmFtZScsXG4gICAgICAgIHVpOiB7XG4gICAgICAgICAgbGFiZWw6ICdvdXRwdXRDb25maWcudXNlcm5hbWUudWkubGFiZWwnLFxuICAgICAgICAgIGxhYmVsSWQ6ICdvdXRwdXRDb25maWcudXNlcm5hbWUudWkubGFiZWwnLFxuICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIH0sXG4gICAgICAgIHZhbGlkYXRpb246ICdpc1N0cmluZycsXG4gICAgICAgIGVycm9yOiAnb3V0cHV0Q29uZmlnLnVzZXJuYW1lLmVycm9yJyxcbiAgICAgICAgZXJyb3JJZDogJ291dHB1dENvbmZpZy51c2VybmFtZS5lcnJvcicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ3Bhc3N3b3JkJyxcbiAgICAgICAgdWk6IHtcbiAgICAgICAgICBsYWJlbDogJ291dHB1dENvbmZpZy5wYXNzd29yZC51aS5sYWJlbCcsXG4gICAgICAgICAgbGFiZWxJZDogJ291dHB1dENvbmZpZy5wYXNzd29yZC51aS5sYWJlbCcsXG4gICAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGlvbjogJ2lzU3RyaW5nJyxcbiAgICAgICAgZXJyb3I6ICdvdXRwdXRDb25maWcucGFzc3dvcmQuZXJyb3InLFxuICAgICAgICBlcnJvcklkOiAnb3V0cHV0Q29uZmlnLnBhc3N3b3JkLmVycm9yJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iXX0=