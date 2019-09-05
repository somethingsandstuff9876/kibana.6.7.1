"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BUILTIN_GENERIC_MESSAGE_FIELDS = ['message', '@message'];
exports.getGenericRules = (genericMessageFields) => [
    ...Array.from(new Set([...genericMessageFields, ...BUILTIN_GENERIC_MESSAGE_FIELDS])).reduce((genericRules, fieldName) => [...genericRules, ...createGenericRulesForField(fieldName)], []),
    {
        when: {
            exists: ['event.dataset', 'log.original'],
        },
        format: [
            {
                constant: '[',
            },
            {
                field: 'event.dataset',
            },
            {
                constant: '] ',
            },
            {
                field: 'log.original',
            },
        ],
    },
    {
        when: {
            exists: ['log.original'],
        },
        format: [
            {
                field: 'log.original',
            },
        ],
    },
];
const createGenericRulesForField = (fieldName) => [
    {
        when: {
            exists: ['event.dataset', 'log.level', fieldName],
        },
        format: [
            {
                constant: '[',
            },
            {
                field: 'event.dataset',
            },
            {
                constant: '][',
            },
            {
                field: 'log.level',
            },
            {
                constant: '] ',
            },
            {
                field: fieldName,
            },
        ],
    },
    {
        when: {
            exists: ['log.level', fieldName],
        },
        format: [
            {
                constant: '[',
            },
            {
                field: 'log.level',
            },
            {
                constant: '] ',
            },
            {
                field: fieldName,
            },
        ],
    },
    {
        when: {
            exists: [fieldName],
        },
        format: [
            {
                field: fieldName,
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2dlbmVyaWMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvZG9tYWlucy9sb2dfZW50cmllc19kb21haW4vYnVpbHRpbl9ydWxlcy9nZW5lcmljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUlILE1BQU0sOEJBQThCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFbEQsUUFBQSxlQUFlLEdBQUcsQ0FBQyxvQkFBOEIsRUFBRSxFQUFFLENBQUM7SUFDakUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxvQkFBb0IsRUFBRSxHQUFHLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FFekYsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsWUFBWSxFQUFFLEdBQUcsMEJBQTBCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDL0Y7UUFDRSxJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDO1NBQzFDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxlQUFlO2FBQ3ZCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxjQUFjO2FBQ3RCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsY0FBYyxDQUFDO1NBQ3pCO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsS0FBSyxFQUFFLGNBQWM7YUFDdEI7U0FDRjtLQUNGO0NBQ0YsQ0FBQztBQUVGLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxTQUFpQixFQUFFLEVBQUUsQ0FBQztJQUN4RDtRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDO1NBQ2xEO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxlQUFlO2FBQ3ZCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxXQUFXO2FBQ25CO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxTQUFTO2FBQ2pCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQztTQUNqQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsV0FBVzthQUNuQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsU0FBUzthQUNqQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUNwQjtRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLEtBQUssRUFBRSxTQUFTO2FBQ2pCO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBMb2dNZXNzYWdlRm9ybWF0dGluZ1J1bGUgfSBmcm9tICcuLi9ydWxlX3R5cGVzJztcblxuY29uc3QgQlVJTFRJTl9HRU5FUklDX01FU1NBR0VfRklFTERTID0gWydtZXNzYWdlJywgJ0BtZXNzYWdlJ107XG5cbmV4cG9ydCBjb25zdCBnZXRHZW5lcmljUnVsZXMgPSAoZ2VuZXJpY01lc3NhZ2VGaWVsZHM6IHN0cmluZ1tdKSA9PiBbXG4gIC4uLkFycmF5LmZyb20obmV3IFNldChbLi4uZ2VuZXJpY01lc3NhZ2VGaWVsZHMsIC4uLkJVSUxUSU5fR0VORVJJQ19NRVNTQUdFX0ZJRUxEU10pKS5yZWR1Y2U8XG4gICAgTG9nTWVzc2FnZUZvcm1hdHRpbmdSdWxlW11cbiAgPigoZ2VuZXJpY1J1bGVzLCBmaWVsZE5hbWUpID0+IFsuLi5nZW5lcmljUnVsZXMsIC4uLmNyZWF0ZUdlbmVyaWNSdWxlc0ZvckZpZWxkKGZpZWxkTmFtZSldLCBbXSksXG4gIHtcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnZXZlbnQuZGF0YXNldCcsICdsb2cub3JpZ2luYWwnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1snLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdldmVudC5kYXRhc2V0JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdsb2cub3JpZ2luYWwnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2xvZy5vcmlnaW5hbCddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbG9nLm9yaWdpbmFsJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG5cbmNvbnN0IGNyZWF0ZUdlbmVyaWNSdWxlc0ZvckZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nKSA9PiBbXG4gIHtcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnZXZlbnQuZGF0YXNldCcsICdsb2cubGV2ZWwnLCBmaWVsZE5hbWVdLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2V2ZW50LmRhdGFzZXQnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2xvZy5sZXZlbCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiBmaWVsZE5hbWUsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnbG9nLmxldmVsJywgZmllbGROYW1lXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1snLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdsb2cubGV2ZWwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogZmllbGROYW1lLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbZmllbGROYW1lXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBmaWVsZDogZmllbGROYW1lLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXTtcbiJdfQ==