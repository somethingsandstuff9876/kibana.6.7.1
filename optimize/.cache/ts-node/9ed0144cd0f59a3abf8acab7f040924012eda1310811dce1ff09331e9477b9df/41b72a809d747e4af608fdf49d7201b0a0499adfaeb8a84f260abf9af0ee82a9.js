"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatMongodbRules = [
    {
        // pre-ECS
        when: {
            exists: ['mongodb.log.message'],
        },
        format: [
            {
                constant: '[MongoDB][',
            },
            {
                field: 'mongodb.log.component',
            },
            {
                constant: '] ',
            },
            {
                field: 'mongodb.log.message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X21vbmdvZGIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvZG9tYWlucy9sb2dfZW50cmllc19kb21haW4vYnVpbHRpbl9ydWxlcy9maWxlYmVhdF9tb25nb2RiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVVLFFBQUEsb0JBQW9CLEdBQUc7SUFDbEM7UUFDRSxVQUFVO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMscUJBQXFCLENBQUM7U0FDaEM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsWUFBWTthQUN2QjtZQUNEO2dCQUNFLEtBQUssRUFBRSx1QkFBdUI7YUFDL0I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHFCQUFxQjthQUM3QjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNvbnN0IGZpbGViZWF0TW9uZ29kYlJ1bGVzID0gW1xuICB7XG4gICAgLy8gcHJlLUVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydtb25nb2RiLmxvZy5tZXNzYWdlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbTW9uZ29EQl1bJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbW9uZ29kYi5sb2cuY29tcG9uZW50JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdtb25nb2RiLmxvZy5tZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iXX0=