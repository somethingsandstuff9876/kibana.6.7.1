"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const commonActionField = [{ constant: '[AuditD][' }, { field: 'event.action' }, { constant: ']' }];
const commonOutcomeField = [{ constant: ' ' }, { field: 'event.outcome' }];
exports.filebeatAuditdRules = [
    {
        // ECS format with outcome
        when: {
            exists: ['ecs.version', 'event.action', 'event.outcome', 'auditd.log'],
        },
        format: [
            ...commonActionField,
            ...commonOutcomeField,
            ...helpers_1.labelField('user', 'user'),
            ...helpers_1.labelField('process', 'process'),
            { constant: ' ' },
            { field: 'auditd.log' },
            { constant: ' ' },
            { field: 'message' },
        ],
    },
    {
        // ECS format without outcome
        when: {
            exists: ['ecs.version', 'event.action', 'auditd.log'],
        },
        format: [
            ...commonActionField,
            ...helpers_1.labelField('user', 'user'),
            ...helpers_1.labelField('process', 'process'),
            { constant: ' ' },
            { field: 'auditd.log' },
            { constant: ' ' },
            { field: 'message' },
        ],
    },
    {
        // pre-ECS IPSEC_EVENT Rule
        when: {
            exists: ['auditd.log.record_type', 'auditd.log.src', 'auditd.log.dst', 'auditd.log.op'],
            values: {
                'auditd.log.record_type': 'MAC_IPSEC_EVENT',
            },
        },
        format: [
            { constant: '[AuditD][' },
            { field: 'auditd.log.record_type' },
            { constant: '] src:' },
            { field: 'auditd.log.src' },
            { constant: ' dst:' },
            { field: 'auditd.log.dst' },
            { constant: ' op:' },
            { field: 'auditd.log.op' },
        ],
    },
    {
        // pre-ECS SYSCALL Rule
        when: {
            exists: [
                'auditd.log.record_type',
                'auditd.log.exe',
                'auditd.log.gid',
                'auditd.log.uid',
                'auditd.log.tty',
                'auditd.log.pid',
                'auditd.log.ppid',
            ],
            values: {
                'auditd.log.record_type': 'SYSCALL',
            },
        },
        format: [
            { constant: '[AuditD][' },
            { field: 'auditd.log.record_type' },
            { constant: '] exe:' },
            { field: 'auditd.log.exe' },
            { constant: ' gid:' },
            { field: 'auditd.log.gid' },
            { constant: ' uid:' },
            { field: 'auditd.log.uid' },
            { constant: ' tty:' },
            { field: 'auditd.log.tty' },
            { constant: ' pid:' },
            { field: 'auditd.log.pid' },
            { constant: ' ppid:' },
            { field: 'auditd.log.ppid' },
        ],
    },
    {
        // pre-ECS Events with `msg` Rule
        when: {
            exists: ['auditd.log.record_type', 'auditd.log.msg'],
        },
        format: [
            { constant: '[AuditD][' },
            { field: 'auditd.log.record_type' },
            { constant: '] ' },
            { field: 'auditd.log.msg' },
        ],
    },
    {
        // pre-ECS Events with `msg` Rule
        when: {
            exists: ['auditd.log.record_type'],
        },
        format: [
            { constant: '[AuditD][' },
            { field: 'auditd.log.record_type' },
            { constant: '] Event without message.' },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2F1ZGl0ZC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2F1ZGl0ZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1Q0FBdUM7QUFFdkMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDcEcsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7QUFFOUQsUUFBQSxtQkFBbUIsR0FBRztJQUNqQztRQUNFLDBCQUEwQjtRQUMxQixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUM7U0FDdkU7UUFDRCxNQUFNLEVBQUU7WUFDTixHQUFHLGlCQUFpQjtZQUNwQixHQUFHLGtCQUFrQjtZQUNyQixHQUFHLG9CQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUM3QixHQUFHLG9CQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztZQUNuQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDakIsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3ZCLEVBQUUsUUFBUSxFQUFFLEdB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UUFDRCxNQUFNLEVBQUU7WUFDTixFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7WUFDekIsRUFBRSxLQUFLLEVBQUUsd0JBQXdCLEVBQUU7WUFDbkMsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUU7U0FDekM7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBsYWJlbEZpZWxkIH0gZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgY29tbW9uQWN0aW9uRmllbGQgPSBbeyBjb25zdGFudDogJ1tBdWRpdERdWycgfSwgeyBmaWVsZDogJ2V2ZW50LmFjdGlvbicgfSwgeyBjb25zdGFudDogJ10nIH1dO1xuY29uc3QgY29tbW9uT3V0Y29tZUZpZWxkID0gW3sgY29uc3RhbnQ6ICcgJyB9LCB7IGZpZWxkOiAnZXZlbnQub3V0Y29tZScgfV07XG5cbmV4cG9ydCBjb25zdCBmaWxlYmVhdEF1ZGl0ZFJ1bGVzID0gW1xuICB7XG4gICAgLy8gRUNTIGZvcm1hdCB3aXRoIG91dGNvbWVcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnZWNzLnZlcnNpb24nLCAnZXZlbnQuYWN0aW9uJywgJ2V2ZW50Lm91dGNvbWUnLCAnYXVkaXRkLmxvZyddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICAuLi5jb21tb25BY3Rpb25GaWVsZCxcbiAgICAgIC4uLmNvbW1vbk91dGNvbWVGaWVsZCxcbiAgICAgIC4uLmxhYmVsRmllbGQoJ3VzZXInLCAndXNlcicpLFxuICAgICAgLi4ubGFiZWxGaWVsZCgncHJvY2VzcycsICdwcm9jZXNzJyksXG4gICAgICB7IGNvbnN0YW50OiAnICcgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nJyB9LFxuICAgICAgeyBjb25zdGFudDogJyAnIH0sXG4gICAgICB7IGZpZWxkOiAnbWVzc2FnZScgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgLy8gRUNTIGZvcm1hdCB3aXRob3V0IG91dGNvbWVcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnZWNzLnZlcnNpb24nLCAnZXZlbnQuYWN0aW9uJywgJ2F1ZGl0ZC5sb2cnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAgLi4uY29tbW9uQWN0aW9uRmllbGQsXG4gICAgICAuLi5sYWJlbEZpZWxkKCd1c2VyJywgJ3VzZXInKSxcbiAgICAgIC4uLmxhYmVsRmllbGQoJ3Byb2Nlc3MnLCAncHJvY2VzcycpLFxuICAgICAgeyBjb25zdGFudDogJyAnIH0sXG4gICAgICB7IGZpZWxkOiAnYXVkaXRkLmxvZycgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgJyB9LFxuICAgICAgeyBmaWVsZDogJ21lc3NhZ2UnIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIHByZS1FQ1MgSVBTRUNfRVZFTlQgUnVsZVxuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydhdWRpdGQubG9nLnJlY29yZF90eXBlJywgJ2F1ZGl0ZC5sb2cuc3JjJywgJ2F1ZGl0ZC5sb2cuZHN0JywgJ2F1ZGl0ZC5sb2cub3AnXSxcbiAgICAgIHZhbHVlczoge1xuICAgICAgICAnYXVkaXRkLmxvZy5yZWNvcmRfdHlwZSc6ICdNQUNfSVBTRUNfRVZFTlQnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAgeyBjb25zdGFudDogJ1tBdWRpdERdWycgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLnJlY29yZF90eXBlJyB9LFxuICAgICAgeyBjb25zdGFudDogJ10gc3JjOicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLnNyYycgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgZHN0OicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLmRzdCcgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgb3A6JyB9LFxuICAgICAgeyBmaWVsZDogJ2F1ZGl0ZC5sb2cub3AnIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIHByZS1FQ1MgU1lTQ0FMTCBSdWxlXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbXG4gICAgICAgICdhdWRpdGQubG9nLnJlY29yZF90eXBlJyxcbiAgICAgICAgJ2F1ZGl0ZC5sb2cuZXhlJyxcbiAgICAgICAgJ2F1ZGl0ZC5sb2cuZ2lkJyxcbiAgICAgICAgJ2F1ZGl0ZC5sb2cudWlkJyxcbiAgICAgICAgJ2F1ZGl0ZC5sb2cudHR5JyxcbiAgICAgICAgJ2F1ZGl0ZC5sb2cucGlkJyxcbiAgICAgICAgJ2F1ZGl0ZC5sb2cucHBpZCcsXG4gICAgICBdLFxuICAgICAgdmFsdWVzOiB7XG4gICAgICAgICdhdWRpdGQubG9nLnJlY29yZF90eXBlJzogJ1NZU0NBTEwnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAgeyBjb25zdGFudDogJ1tBdWRpdERdWycgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLnJlY29yZF90eXBlJyB9LFxuICAgICAgeyBjb25zdGFudDogJ10gZXhlOicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLmV4ZScgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgZ2lkOicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLmdpZCcgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgdWlkOicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLnVpZCcgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgdHR5OicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLnR0eScgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgcGlkOicgfSxcbiAgICAgIHsgZmllbGQ6ICdhdWRpdGQubG9nLnBpZCcgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICcgcHBpZDonIH0sXG4gICAgICB7IGZpZWxkOiAnYXVkaXRkLmxvZy5wcGlkJyB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBwcmUtRUNTIEV2ZW50cyB3aXRoIGBtc2dgIFJ1bGVcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnYXVkaXRkLmxvZy5yZWNvcmRfdHlwZScsICdhdWRpdGQubG9nLm1zZyddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7IGNvbnN0YW50OiAnW0F1ZGl0RF1bJyB9LFxuICAgICAgeyBmaWVsZDogJ2F1ZGl0ZC5sb2cucmVjb3JkX3R5cGUnIH0sXG4gICAgICB7IGNvbnN0YW50OiAnXSAnIH0sXG4gICAgICB7IGZpZWxkOiAnYXVkaXRkLmxvZy5tc2cnIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIHByZS1FQ1MgRXZlbnRzIHdpdGggYG1zZ2AgUnVsZVxuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydhdWRpdGQubG9nLnJlY29yZF90eXBlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHsgY29uc3RhbnQ6ICdbQXVkaXREXVsnIH0sXG4gICAgICB7IGZpZWxkOiAnYXVkaXRkLmxvZy5yZWNvcmRfdHlwZScgfSxcbiAgICAgIHsgY29uc3RhbnQ6ICddIEV2ZW50IHdpdGhvdXQgbWVzc2FnZS4nIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iXX0=