"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.infraSourceConfigurationSavedObjectType = 'infrastructure-ui-source';
exports.infraSourceConfigurationSavedObjectMappings = {
    [exports.infraSourceConfigurationSavedObjectType]: {
        properties: {
            name: {
                type: 'text',
            },
            description: {
                type: 'text',
            },
            metricAlias: {
                type: 'keyword',
            },
            logAlias: {
                type: 'keyword',
            },
            fields: {
                properties: {
                    container: {
                        type: 'keyword',
                    },
                    host: {
                        type: 'keyword',
                    },
                    pod: {
                        type: 'keyword',
                    },
                    tiebreaker: {
                        type: 'keyword',
                    },
                    timestamp: {
                        type: 'keyword',
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9zb3VyY2VzL3NhdmVkX29iamVjdF9tYXBwaW5ncy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9zb3VyY2VzL3NhdmVkX29iamVjdF9tYXBwaW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFLVSxRQUFBLHVDQUF1QyxHQUFHLDBCQUEwQixDQUFDO0FBRXJFLFFBQUEsMkNBQTJDLEdBRXBEO0lBQ0YsQ0FBQywrQ0FBdUMsQ0FBQyxFQUFFO1FBQ3pDLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLFNBQVM7YUFDaEI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDaEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sVUFBVSxFQUFFO29CQUNWLFNBQVMsRUFBRTt3QkFDVCxJQUFJLEVBQUUsU0FBUztxQkFDaEI7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLElBQUksRUFBRSxTQUFTO3FCQUNoQjtvQkFDRCxHQUFHLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLFNBQVM7cUJBQ2hCO29CQUNELFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsU0FBUztxQkFDaEI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULElBQUksRUFBRSxTQUFTO3FCQUNoQjtpQkFDRjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBFbGFzdGljc2VhcmNoTWFwcGluZ09mIH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZWRfZWxhc3RpY3NlYXJjaF9tYXBwaW5ncyc7XG5pbXBvcnQgeyBJbmZyYVNhdmVkU291cmNlQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaW5mcmFTb3VyY2VDb25maWd1cmF0aW9uU2F2ZWRPYmplY3RUeXBlID0gJ2luZnJhc3RydWN0dXJlLXVpLXNvdXJjZSc7XG5cbmV4cG9ydCBjb25zdCBpbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb25TYXZlZE9iamVjdE1hcHBpbmdzOiB7XG4gIFtpbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb25TYXZlZE9iamVjdFR5cGVdOiBFbGFzdGljc2VhcmNoTWFwcGluZ09mPEluZnJhU2F2ZWRTb3VyY2VDb25maWd1cmF0aW9uPjtcbn0gPSB7XG4gIFtpbmZyYVNvdXJjZUNvbmZpZ3VyYXRpb25TYXZlZE9iamVjdFR5cGVdOiB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB9LFxuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgfSxcbiAgICAgIG1ldHJpY0FsaWFzOiB7XG4gICAgICAgIHR5cGU6ICdrZXl3b3JkJyxcbiAgICAgIH0sXG4gICAgICBsb2dBbGlhczoge1xuICAgICAgICB0eXBlOiAna2V5d29yZCcsXG4gICAgICB9LFxuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb250YWluZXI6IHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXl3b3JkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhvc3Q6IHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXl3b3JkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvZDoge1xuICAgICAgICAgICAgdHlwZTogJ2tleXdvcmQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGllYnJlYWtlcjoge1xuICAgICAgICAgICAgdHlwZTogJ2tleXdvcmQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGltZXN0YW1wOiB7XG4gICAgICAgICAgICB0eXBlOiAna2V5d29yZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iXX0=