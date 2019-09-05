"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("../../../../constants");
function getUsageCollector(server) {
    const { taskManager } = server;
    return {
        type: constants_1.VIS_USAGE_TYPE,
        fetch: async () => {
            let docs;
            try {
                ({ docs } = await taskManager.fetch({
                    query: { bool: { filter: { term: { _id: `${constants_1.PLUGIN_ID}-${constants_1.VIS_TELEMETRY_TASK}` } } } },
                }));
            }
            catch (err) {
                const errMessage = err && err.message ? err.message : err.toString();
                /*
                 * The usage service WILL to try to fetch from this collector before the task manager has been initialized, because the task manager
                 * has to wait for all plugins to initialize first.
                 * It's fine to ignore it as next time around it will be initialized (or it will throw a different type of error)
                 */
                if (errMessage.includes('NotInitialized')) {
                    docs = {};
                }
                else {
                    throw err;
                }
            }
            // get the accumulated state from the recurring task
            return lodash_1.get(docs, '[0].state.stats');
        },
    };
}
exports.getUsageCollector = getUsageCollector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvb3NzX3RlbGVtZXRyeS9zZXJ2ZXIvbGliL2NvbGxlY3RvcnMvdmlzdWFsaXphdGlvbnMvZ2V0X3VzYWdlX2NvbGxlY3Rvci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvb3NzX3RlbGVtZXRyeS9zZXJ2ZXIvbGliL2NvbGxlY3RvcnMvdmlzdWFsaXphdGlvbnMvZ2V0X3VzYWdlX2NvbGxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCxtQ0FBNkI7QUFFN0IscURBQXNGO0FBRXRGLFNBQWdCLGlCQUFpQixDQUFDLE1BQWtCO0lBQ2xELE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFDL0IsT0FBTztRQUNMLElBQUksRUFBRSwwQkFBYztRQUNwQixLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEIsSUFBSSxJQUFJLENBQUM7WUFDVCxJQUFJO2dCQUNGLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUM7b0JBQ2xDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLHFCQUFTLElBQUksOEJBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtpQkFDckYsQ0FBQyxDQUFDLENBQUM7YUFDTDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE1BQU0sVUFBVSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JFOzs7O21CQUlHO2dCQUNILElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO29CQUN6QyxJQUFJLEdBQUcsRUFBRSxDQUFDO2lCQUNYO3FCQUFNO29CQUNMLE1BQU0sR0FBRyxDQUFDO2lCQUNYO2FBQ0Y7WUFFRCxvREFBb0Q7WUFDcEQsT0FBTyxZQUFHLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDdEMsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBNUJELDhDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGdldCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBIYXBpU2VydmVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vJztcbmltcG9ydCB7IFBMVUdJTl9JRCwgVklTX1RFTEVNRVRSWV9UQVNLLCBWSVNfVVNBR0VfVFlQRSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2FnZUNvbGxlY3RvcihzZXJ2ZXI6IEhhcGlTZXJ2ZXIpIHtcbiAgY29uc3QgeyB0YXNrTWFuYWdlciB9ID0gc2VydmVyO1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFZJU19VU0FHRV9UWVBFLFxuICAgIGZldGNoOiBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgZG9jcztcbiAgICAgIHRyeSB7XG4gICAgICAgICh7IGRvY3MgfSA9IGF3YWl0IHRhc2tNYW5hZ2VyLmZldGNoKHtcbiAgICAgICAgICBxdWVyeTogeyBib29sOiB7IGZpbHRlcjogeyB0ZXJtOiB7IF9pZDogYCR7UExVR0lOX0lEfS0ke1ZJU19URUxFTUVUUllfVEFTS31gIH0gfSB9IH0sXG4gICAgICAgIH0pKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBlcnJNZXNzYWdlID0gZXJyICYmIGVyci5tZXNzYWdlID8gZXJyLm1lc3NhZ2UgOiBlcnIudG9TdHJpbmcoKTtcbiAgICAgICAgLypcbiAgICAgICAgICogVGhlIHVzYWdlIHNlcnZpY2UgV0lMTCB0byB0cnkgdG8gZmV0Y2ggZnJvbSB0aGlzIGNvbGxlY3RvciBiZWZvcmUgdGhlIHRhc2sgbWFuYWdlciBoYXMgYmVlbiBpbml0aWFsaXplZCwgYmVjYXVzZSB0aGUgdGFzayBtYW5hZ2VyXG4gICAgICAgICAqIGhhcyB0byB3YWl0IGZvciBhbGwgcGx1Z2lucyB0byBpbml0aWFsaXplIGZpcnN0LlxuICAgICAgICAgKiBJdCdzIGZpbmUgdG8gaWdub3JlIGl0IGFzIG5leHQgdGltZSBhcm91bmQgaXQgd2lsbCBiZSBpbml0aWFsaXplZCAob3IgaXQgd2lsbCB0aHJvdyBhIGRpZmZlcmVudCB0eXBlIG9mIGVycm9yKVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGVyck1lc3NhZ2UuaW5jbHVkZXMoJ05vdEluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICBkb2NzID0ge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGdldCB0aGUgYWNjdW11bGF0ZWQgc3RhdGUgZnJvbSB0aGUgcmVjdXJyaW5nIHRhc2tcbiAgICAgIHJldHVybiBnZXQoZG9jcywgJ1swXS5zdGF0ZS5zdGF0cycpO1xuICAgIH0sXG4gIH07XG59XG4iXX0=