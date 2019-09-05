"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatOsqueryRules = [
    {
        // pre-ECS
        when: {
            exists: ['osquery.result.name'],
        },
        format: [
            {
                constant: '[Osquery][',
            },
            {
                field: 'osquery.result.action',
            },
            {
                constant: '] ',
            },
            {
                field: 'osquery.result.host_identifier',
            },
            {
                constant: ' ',
            },
            {
                field: 'osquery.result.columns',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X29zcXVlcnkudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvZG9tYWlucy9sb2dfZW50cmllc19kb21haW4vYnVpbHRpbl9ydWxlcy9maWxlYmVhdF9vc3F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVVLFFBQUEsb0JBQW9CLEdBQUc7SUFDbEM7UUFDRSxVQUFVO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMscUJBQXFCLENBQUM7U0FDaEM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsWUFBWTthQUN2QjtZQUNEO2dCQUNFLEtBQUssRUFBRSx1QkFBdUI7YUFDL0I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGdDQUFnQzthQUN4QztZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsd0JBQXdCO2FBQ2hDO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZmlsZWJlYXRPc3F1ZXJ5UnVsZXMgPSBbXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ29zcXVlcnkucmVzdWx0Lm5hbWUnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tPc3F1ZXJ5XVsnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdvc3F1ZXJ5LnJlc3VsdC5hY3Rpb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ29zcXVlcnkucmVzdWx0Lmhvc3RfaWRlbnRpZmllcicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdvc3F1ZXJ5LnJlc3VsdC5jb2x1bW5zJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iXX0=