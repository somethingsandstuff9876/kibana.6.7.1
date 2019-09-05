"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const PathReporter_1 = require("io-ts/lib/PathReporter");
const domain_types_1 = require("../../common/domain_types");
class BeatEventsLib {
    // @ts-ignore
    constructor(adapter, beats) {
        this.adapter = adapter;
        this.beats = beats;
        this.log = async (user, beatId, events) => {
            return events.map((event, i) => {
                const assertData = domain_types_1.RuntimeBeatEvent.decode(event);
                if (assertData.isLeft()) {
                    if (events.length - 1 === i) {
                        this.beats
                            .update(user, beatId, {
                            status: {
                                ...events[events.length - 2],
                                timestamp: new Date(events[events.length - 2].timestamp),
                            },
                        })
                            .catch(e => {
                            // tslint:disable-next-line
                            console.error('Error inserting event into beats log.', e);
                        });
                    }
                    return {
                        success: false,
                        error: `Error parsing event ${i}, ${PathReporter_1.PathReporter.report(assertData)[0]}`,
                    };
                }
                if (events.length - 1 === i) {
                    this.beats
                        .update(user, beatId, {
                        status: {
                            ...events[events.length - 1],
                            timestamp: new Date(events[events.length - 1].timestamp),
                        },
                    })
                        .catch(e => {
                        // tslint:disable-next-line
                        console.error('Error inserting event into beats log.', e);
                    });
                }
                return { success: true };
            });
        };
    }
}
exports.BeatEventsLib = BeatEventsLib;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL2JlYXRfZXZlbnRzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9saWIvYmVhdF9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gseURBQXNEO0FBQ3RELDREQUF3RTtBQUt4RSxNQUFhLGFBQWE7SUFDeEIsYUFBYTtJQUNiLFlBQTZCLE9BQTBCLEVBQW1CLEtBQW9CO1FBQWpFLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQWU7UUFFdkYsUUFBRyxHQUFHLEtBQUssRUFDaEIsSUFBbUIsRUFDbkIsTUFBYyxFQUNkLE1BQW1CLEVBQ29DLEVBQUU7WUFDekQsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QixNQUFNLFVBQVUsR0FBRywrQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUN2QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDM0IsSUFBSSxDQUFDLEtBQUs7NkJBQ1AsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7NEJBQ3BCLE1BQU0sRUFBRTtnQ0FDTixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQ0FDNUIsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzs2QkFDekQ7eUJBQ0YsQ0FBQzs2QkFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ1QsMkJBQTJCOzRCQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxDQUFDLENBQUMsQ0FBQztxQkFDTjtvQkFDRCxPQUFPO3dCQUNMLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxLQUFLLDJCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3FCQUN6RSxDQUFDO2lCQUNIO2dCQUNELElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMzQixJQUFJLENBQUMsS0FBSzt5QkFDUCxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTt3QkFDcEIsTUFBTSxFQUFFOzRCQUNOLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUM1QixTQUFTLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO3lCQUN6RDtxQkFDRixDQUFDO3lCQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDVCwyQkFBMkI7d0JBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVELENBQUMsQ0FBQyxDQUFDO2lCQUNOO2dCQUNELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUEzQytGLENBQUM7Q0E0Q25HO0FBOUNELHNDQThDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5pbXBvcnQgeyBQYXRoUmVwb3J0ZXIgfSBmcm9tICdpby10cy9saWIvUGF0aFJlcG9ydGVyJztcbmltcG9ydCB7IEJlYXRFdmVudCwgUnVudGltZUJlYXRFdmVudCB9IGZyb20gJy4uLy4uL2NvbW1vbi9kb21haW5fdHlwZXMnO1xuaW1wb3J0IHsgQmVhdEV2ZW50c0FkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXJzL2V2ZW50cy9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IEZyYW1ld29ya1VzZXIgfSBmcm9tICcuL2FkYXB0ZXJzL2ZyYW1ld29yay9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7IENNQmVhdHNEb21haW4gfSBmcm9tICcuL2JlYXRzJztcblxuZXhwb3J0IGNsYXNzIEJlYXRFdmVudHNMaWIge1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYWRhcHRlcjogQmVhdEV2ZW50c0FkYXB0ZXIsIHByaXZhdGUgcmVhZG9ubHkgYmVhdHM6IENNQmVhdHNEb21haW4pIHt9XG5cbiAgcHVibGljIGxvZyA9IGFzeW5jIChcbiAgICB1c2VyOiBGcmFtZXdvcmtVc2VyLFxuICAgIGJlYXRJZDogc3RyaW5nLFxuICAgIGV2ZW50czogQmVhdEV2ZW50W11cbiAgKTogUHJvbWlzZTxBcnJheTx7IHN1Y2Nlc3M6IGJvb2xlYW47IHJlYXNvbj86IHN0cmluZyB9Pj4gPT4ge1xuICAgIHJldHVybiBldmVudHMubWFwKChldmVudCwgaSkgPT4ge1xuICAgICAgY29uc3QgYXNzZXJ0RGF0YSA9IFJ1bnRpbWVCZWF0RXZlbnQuZGVjb2RlKGV2ZW50KTtcbiAgICAgIGlmIChhc3NlcnREYXRhLmlzTGVmdCgpKSB7XG4gICAgICAgIGlmIChldmVudHMubGVuZ3RoIC0gMSA9PT0gaSkge1xuICAgICAgICAgIHRoaXMuYmVhdHNcbiAgICAgICAgICAgIC51cGRhdGUodXNlciwgYmVhdElkLCB7XG4gICAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgIC4uLmV2ZW50c1tldmVudHMubGVuZ3RoIC0gMl0sXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZShldmVudHNbZXZlbnRzLmxlbmd0aCAtIDJdLnRpbWVzdGFtcCksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5zZXJ0aW5nIGV2ZW50IGludG8gYmVhdHMgbG9nLicsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogYEVycm9yIHBhcnNpbmcgZXZlbnQgJHtpfSwgJHtQYXRoUmVwb3J0ZXIucmVwb3J0KGFzc2VydERhdGEpWzBdfWAsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnRzLmxlbmd0aCAtIDEgPT09IGkpIHtcbiAgICAgICAgdGhpcy5iZWF0c1xuICAgICAgICAgIC51cGRhdGUodXNlciwgYmVhdElkLCB7XG4gICAgICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICAgICAgLi4uZXZlbnRzW2V2ZW50cy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZShldmVudHNbZXZlbnRzLmxlbmd0aCAtIDFdLnRpbWVzdGFtcCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbnNlcnRpbmcgZXZlbnQgaW50byBiZWF0cyBsb2cuJywgZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgfSk7XG4gIH07XG59XG4iXX0=