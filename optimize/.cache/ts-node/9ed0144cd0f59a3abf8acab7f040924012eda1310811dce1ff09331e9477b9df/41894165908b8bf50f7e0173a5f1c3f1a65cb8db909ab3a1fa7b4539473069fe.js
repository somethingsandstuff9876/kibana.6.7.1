"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const annotations_1 = require("../../../common/constants/annotations");
const index_patterns_1 = require("../../../common/constants/index_patterns");
const annotations_2 = require("../../../common/types/annotations");
function annotationProvider(callWithRequest) {
    async function indexAnnotation(annotation, username) {
        if (annotations_2.isAnnotation(annotation) === false) {
            // No need to translate, this will not be exposed in the UI.
            return Promise.reject(new Error('invalid annotation format'));
        }
        if (annotation.create_time === undefined) {
            annotation.create_time = new Date().getTime();
            annotation.create_username = username;
        }
        annotation.modified_time = new Date().getTime();
        annotation.modified_username = username;
        const params = {
            index: index_patterns_1.ML_ANNOTATIONS_INDEX_ALIAS_WRITE,
            type: annotations_1.ANNOTATION_DOC_TYPE,
            body: annotation,
            refresh: 'wait_for',
        };
        if (typeof annotation._id !== 'undefined') {
            params.id = annotation._id;
            delete params.body._id;
            delete params.body.key;
        }
        return await callWithRequest('index', params);
    }
    async function getAnnotations({ jobIds, earliestMs, latestMs, maxAnnotations, }) {
        const obj = {
            success: true,
            annotations: {},
        };
        const boolCriteria = [];
        // Build the criteria to use in the bool filter part of the request.
        // Adds criteria for the time range plus any specified job IDs.
        // The nested must_not time range filter queries make sure that we fetch:
        // - annotations with start and end within the time range
        // - annotations that either start or end within the time range
        // - annotations that start before and end after the given time range
        // - but skip annotation that are completely outside the time range
        //   (the ones that start and end before or after the time range)
        if (earliestMs !== null && latestMs !== null) {
            boolCriteria.push({
                bool: {
                    must_not: [
                        {
                            bool: {
                                filter: [
                                    {
                                        range: {
                                            timestamp: {
                                                lte: earliestMs,
                                                format: 'epoch_millis',
                                            },
                                        },
                                    },
                                    {
                                        range: {
                                            end_timestamp: {
                                                lte: earliestMs,
                                                format: 'epoch_millis',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            bool: {
                                filter: [
                                    {
                                        range: {
                                            timestamp: {
                                                gte: latestMs,
                                                format: 'epoch_millis',
                                            },
                                        },
                                    },
                                    {
                                        range: {
                                            end_timestamp: {
                                                gte: latestMs,
                                                format: 'epoch_millis',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            });
        }
        boolCriteria.push({
            exists: { field: 'annotation' },
        });
        if (jobIds && jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
            let jobIdFilterStr = '';
            lodash_1.default.each(jobIds, (jobId, i) => {
                jobIdFilterStr += `${i > 0 ? ' OR ' : ''}job_id:${jobId}`;
            });
            boolCriteria.push({
                query_string: {
                    analyze_wildcard: false,
                    query: jobIdFilterStr,
                },
            });
        }
        const params = {
            index: index_patterns_1.ML_ANNOTATIONS_INDEX_ALIAS_READ,
            size: maxAnnotations,
            body: {
                query: {
                    bool: {
                        filter: [
                            {
                                query_string: {
                                    query: `type:${annotations_1.ANNOTATION_TYPE.ANNOTATION}`,
                                    analyze_wildcard: false,
                                },
                            },
                            {
                                bool: {
                                    must: boolCriteria,
                                },
                            },
                        ],
                    },
                },
            },
        };
        try {
            const resp = await callWithRequest('search', params);
            if (resp.error !== undefined && resp.message !== undefined) {
                // No need to translate, this will not be exposed in the UI.
                throw new Error(`Annotations couldn't be retrieved from Elasticsearch.`);
            }
            const docs = lodash_1.default.get(resp, ['hits', 'hits'], []).map((d) => {
                // get the original source document and the document id, we need it
                // to identify the annotation when editing/deleting it.
                return { ...d._source, _id: d._id };
            });
            if (annotations_2.isAnnotations(docs) === false) {
                // No need to translate, this will not be exposed in the UI.
                throw new Error(`Annotations didn't pass integrity check.`);
            }
            docs.forEach((doc) => {
                const jobId = doc.job_id;
                if (typeof obj.annotations[jobId] === 'undefined') {
                    obj.annotations[jobId] = [];
                }
                obj.annotations[jobId].push(doc);
            });
            return obj;
        }
        catch (error) {
            throw boom_1.default.badRequest(error);
        }
    }
    async function deleteAnnotation(id) {
        const param = {
            index: index_patterns_1.ML_ANNOTATIONS_INDEX_ALIAS_WRITE,
            type: annotations_1.ANNOTATION_DOC_TYPE,
            id,
            refresh: 'wait_for',
        };
        return await callWithRequest('delete', param);
    }
    return {
        getAnnotations,
        indexAnnotation,
        deleteAnnotation,
    };
}
exports.annotationProvider = annotationProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvbWwvc2VydmVyL21vZGVscy9hbm5vdGF0aW9uX3NlcnZpY2UvYW5ub3RhdGlvbi50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvbWwvc2VydmVyL21vZGVscy9hbm5vdGF0aW9uX3NlcnZpY2UvYW5ub3RhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsd0RBQXdCO0FBQ3hCLDREQUF1QjtBQUV2Qix1RUFBNkY7QUFDN0YsNkVBR2tEO0FBRWxELG1FQUsyQztBQW1EM0MsU0FBZ0Isa0JBQWtCLENBQUMsZUFBb0M7SUFDckUsS0FBSyxVQUFVLGVBQWUsQ0FBQyxVQUFzQixFQUFFLFFBQWdCO1FBQ3JFLElBQUksMEJBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDdEMsNERBQTREO1lBQzVELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFJLFVBQVUsQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ3hDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QyxVQUFVLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztTQUN2QztRQUVELFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoRCxVQUFVLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO1FBRXhDLE1BQU0sTUFBTSxHQUFnQjtZQUMxQixLQUFLLEVBQUUsaURBQWdDO1lBQ3ZDLElBQUksRUFBRSxpQ0FBbUI7WUFDekIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLFVBQVU7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ekIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssV0FBVyxFQUFFO29CQUNqRCxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFDN0I7Z0JBQ0QsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRUQsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEVBQVU7UUFDeEMsTUFBTSxLQUFLLEdBQWlCO1lBQzFCLEtBQUssRUFBRSxpREFBZ0M7WUFDdkMsSUFBSSxFQUFFLGlDQUFtQjtZQUN6QixFQUFFO1lBQ0YsT0FBTyxFQUFFLFVBQVU7U0FDcEIsQ0FBQztRQUVGLE9BQU8sTUFBTSxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxPQUFPO1FBQ0wsY0FBYztRQUNkLGVBQWU7UUFDZixnQkFBZ0I7S0FDakIsQ0FBQztBQUNKLENBQUM7QUFuTUQsZ0RBbU1DIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBBTk5PVEFUSU9OX0RPQ19UWVBFLCBBTk5PVEFUSU9OX1RZUEUgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vY29uc3RhbnRzL2Fubm90YXRpb25zJztcbmltcG9ydCB7XG4gIE1MX0FOTk9UQVRJT05TX0lOREVYX0FMSUFTX1JFQUQsXG4gIE1MX0FOTk9UQVRJT05TX0lOREVYX0FMSUFTX1dSSVRFLFxufSBmcm9tICcuLi8uLi8uLi9jb21tb24vY29uc3RhbnRzL2luZGV4X3BhdHRlcm5zJztcblxuaW1wb3J0IHtcbiAgQW5ub3RhdGlvbixcbiAgQW5ub3RhdGlvbnMsXG4gIGlzQW5ub3RhdGlvbixcbiAgaXNBbm5vdGF0aW9ucyxcbn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL3R5cGVzL2Fubm90YXRpb25zJztcblxuLy8gVE9ETyBBbGwgb2YgdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UvdHlwZSBkZWZpbml0aW9ucyBzaG91bGRcbi8vIGV2ZW50dWFsbHkgYmUgcmVwbGFjZWQgYnkgdGhlIHByb3BlciB1cHN0cmVhbSBkZWZpbml0aW9uc1xuaW50ZXJmYWNlIEVzUmVzdWx0IHtcbiAgX3NvdXJjZTogb2JqZWN0O1xuICBfaWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRleEFubm90YXRpb25BcmdzIHtcbiAgam9iSWRzOiBzdHJpbmdbXTtcbiAgZWFybGllc3RNczogbnVtYmVyO1xuICBsYXRlc3RNczogbnVtYmVyO1xuICBtYXhBbm5vdGF0aW9uczogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFBhcmFtcyB7XG4gIGluZGV4OiBzdHJpbmc7XG4gIHNpemU6IG51bWJlcjtcbiAgYm9keTogb2JqZWN0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJlc3BvbnNlIHtcbiAgc3VjY2VzczogdHJ1ZTtcbiAgYW5ub3RhdGlvbnM6IHtcbiAgICBba2V5OiBzdHJpbmddOiBBbm5vdGF0aW9ucztcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRleFBhcmFtcyB7XG4gIGluZGV4OiBzdHJpbmc7XG4gIHR5cGU6IHN0cmluZztcbiAgYm9keTogQW5ub3RhdGlvbjtcbiAgcmVmcmVzaD86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUGFyYW1zIHtcbiAgaW5kZXg6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICByZWZyZXNoPzogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xufVxuXG50eXBlIGFubm90YXRpb25Qcm92aWRlclBhcmFtcyA9IERlbGV0ZVBhcmFtcyB8IEdldFBhcmFtcyB8IEluZGV4UGFyYW1zO1xuXG5leHBvcnQgdHlwZSBjYWxsV2l0aFJlcXVlc3RUeXBlID0gKFxuICBhY3Rpb246IHN0cmluZyxcbiAgcGFyYW1zOiBhbm5vdGF0aW9uUHJvdmlkZXJQYXJhbXNcbikgPT4gUHJvbWlzZTxhbnk+O1xuXG5leHBvcnQgZnVuY3Rpb24gYW5ub3RhdGlvblByb3ZpZGVyKGNhbGxXaXRoUmVxdWVzdDogY2FsbFdpdGhSZXF1ZXN0VHlwZSkge1xuICBhc3luYyBmdW5jdGlvbiBpbmRleEFubm90YXRpb24oYW5ub3RhdGlvbjogQW5ub3RhdGlvbiwgdXNlcm5hbWU6IHN0cmluZykge1xuICAgIGlmIChpc0Fubm90YXRpb24oYW5ub3RhdGlvbikgPT09IGZhbHNlKSB7XG4gICAgICAvLyBObyBuZWVkIHRvIHRyYW5zbGF0ZSwgdGhpcyB3aWxsIG5vdCBiZSBleHBvc2VkIGluIHRoZSBVSS5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2ludmFsaWQgYW5ub3RhdGlvbiBmb3JtYXQnKSk7XG4gICAgfVxuXG4gICAgaWYgKGFubm90YXRpb24uY3JlYXRlX3RpbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYW5ub3RhdGlvbi5jcmVhdGVfdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgYW5ub3RhdGlvbi5jcmVhdGVfdXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICB9XG5cbiAgICBhbm5vdGF0aW9uLm1vZGlmaWVkX3RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBhbm5vdGF0aW9uLm1vZGlmaWVkX3VzZXJuYW1lID0gdXNlcm5hbWU7XG5cbiAgICBjb25zdCBwYXJhbXM6IEluZGV4UGFyYW1zID0ge1xuICAgICAgaW5kZXg6IE1MX0FOTk9UQVRJT05TX0lOREVYX0FMSUFTX1dSSVRFLFxuICAgICAgdHlwZTogQU5OT1RBVElPTl9ET0NfVFlQRSxcbiAgICAgIGJvZHk6IGFubm90YXRpb24sXG4gICAgICByZWZyZXNoOiAnd2FpdF9mb3InLFxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGFubm90YXRpb24uX2lkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcGFyYW1zLmlkID0gYW5ub3RhdGlvbi5faWQ7XG4gICAgICBkZWxldGUgcGFyYW1zLmJvZHkuX2lkO1xuICAgICAgZGVsZXRlIHBhcmFtcy5ib2R5LmtleTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgY2FsbFdpdGhSZXF1ZXN0KCdpbmRleCcsIHBhcmFtcyk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBnZXRBbm5vdGF0aW9ucyh7XG4gICAgam9iSWRzLFxuICAgIGVhcmxpZXN0TXMsXG4gICAgbGF0ZXN0TXMsXG4gICAgbWF4QW5ub3RhdGlvbnMsXG4gIH06IEluZGV4QW5ub3RhdGlvbkFyZ3MpIHtcbiAgICBjb25zdCBvYmo6IEdldFJlc3BvbnNlID0ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGFubm90YXRpb25zOiB7fSxcbiAgICB9O1xuXG4gICAgY29uc3QgYm9vbENyaXRlcmlhOiBvYmplY3RbXSA9IFtdO1xuXG4gICAgLy8gQnVpbGQgdGhlIGNyaXRlcmlhIHRvIHVzZSBpbiB0aGUgYm9vbCBmaWx0ZXIgcGFydCBvZiB0aGUgcmVxdWVzdC5cbiAgICAvLyBBZGRzIGNyaXRlcmlhIGZvciB0aGUgdGltZSByYW5nZSBwbHVzIGFueSBzcGVjaWZpZWQgam9iIElEcy5cbiAgICAvLyBUaGUgbmVzdGVkIG11c3Rfbm90IHRpbWUgcmFuZ2UgZmlsdGVyIHF1ZXJpZXMgbWFrZSBzdXJlIHRoYXQgd2UgZmV0Y2g6XG4gICAgLy8gLSBhbm5vdGF0aW9ucyB3aXRoIHN0YXJ0IGFuZCBlbmQgd2l0aGluIHRoZSB0aW1lIHJhbmdlXG4gICAgLy8gLSBhbm5vdGF0aW9ucyB0aGF0IGVpdGhlciBzdGFydCBvciBlbmQgd2l0aGluIHRoZSB0aW1lIHJhbmdlXG4gICAgLy8gLSBhbm5vdGF0aW9ucyB0aGF0IHN0YXJ0IGJlZm9yZSBhbmQgZW5kIGFmdGVyIHRoZSBnaXZlbiB0aW1lIHJhbmdlXG4gICAgLy8gLSBidXQgc2tpcCBhbm5vdGF0aW9uIHRoYXQgYXJlIGNvbXBsZXRlbHkgb3V0c2lkZSB0aGUgdGltZSByYW5nZVxuICAgIC8vICAgKHRoZSBvbmVzIHRoYXQgc3RhcnQgYW5kIGVuZCBiZWZvcmUgb3IgYWZ0ZXIgdGhlIHRpbWUgcmFuZ2UpXG4gICAgaWYgKGVhcmxpZXN0TXMgIT09IG51bGwgJiYgbGF0ZXN0TXMgIT09IG51bGwpIHtcbiAgICAgIGJvb2xDcml0ZXJpYS5wdXNoKHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIG11c3Rfbm90OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJvb2w6IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGx0ZTogZWFybGllc3RNcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogJ2Vwb2NoX21pbGxpcycsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgZW5kX3RpbWVzdGFtcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbHRlOiBlYXJsaWVzdE1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3RlOiBsYXRlc3RNcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogJ2Vwb2NoX21pbGxpcycsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgZW5kX3RpbWVzdGFtcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3RlOiBsYXRlc3RNcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogJ2Vwb2NoX21pbGxpcycsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGJvb2xDcml0ZXJpYS5wdXNoKHtcbiAgICAgIGV4aXN0czogeyBmaWVsZDogJ2Fubm90YXRpb24nIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoam9iSWRzICYmIGpvYklkcy5sZW5ndGggPiAwICYmICEoam9iSWRzLmxlbmd0aCA9PT0gMSAmJiBqb2JJZHNbMF0gPT09ICcqJykpIHtcbiAgICAgIGxldCBqb2JJZEZpbHRlclN0ciA9ICcnO1xuICAgICAgXy5lYWNoKGpvYklkcywgKGpvYklkLCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgam9iSWRGaWx0ZXJTdHIgKz0gYCR7aSEgPiAwID8gJyBPUiAnIDogJyd9am9iX2lkOiR7am9iSWR9YDtcbiAgICAgIH0pO1xuICAgICAgYm9vbENyaXRlcmlhLnB1c2goe1xuICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICBhbmFseXplX3dpbGRjYXJkOiBmYWxzZSxcbiAgICAgICAgICBxdWVyeTogam9iSWRGaWx0ZXJTdHIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbXM6IEdldFBhcmFtcyA9IHtcbiAgICAgIGluZGV4OiBNTF9BTk5PVEFUSU9OU19JTkRFWF9BTElBU19SRUFELFxuICAgICAgc2l6ZTogbWF4QW5ub3RhdGlvbnMsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgZmlsdGVyOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBgdHlwZToke0FOTk9UQVRJT05fVFlQRS5BTk5PVEFUSU9OfWAsXG4gICAgICAgICAgICAgICAgICBhbmFseXplX3dpbGRjYXJkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgICAgICAgbXVzdDogYm9vbENyaXRlcmlhLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGNhbGxXaXRoUmVxdWVzdCgnc2VhcmNoJywgcGFyYW1zKTtcblxuICAgICAgaWYgKHJlc3AuZXJyb3IgIT09IHVuZGVmaW5lZCAmJiByZXNwLm1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBObyBuZWVkIHRvIHRyYW5zbGF0ZSwgdGhpcyB3aWxsIG5vdCBiZSBleHBvc2VkIGluIHRoZSBVSS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbm5vdGF0aW9ucyBjb3VsZG4ndCBiZSByZXRyaWV2ZWQgZnJvbSBFbGFzdGljc2VhcmNoLmApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkb2NzOiBBbm5vdGF0aW9ucyA9IF8uZ2V0KHJlc3AsIFsnaGl0cycsICdoaXRzJ10sIFtdKS5tYXAoKGQ6IEVzUmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgb3JpZ2luYWwgc291cmNlIGRvY3VtZW50IGFuZCB0aGUgZG9jdW1lbnQgaWQsIHdlIG5lZWQgaXRcbiAgICAgICAgLy8gdG8gaWRlbnRpZnkgdGhlIGFubm90YXRpb24gd2hlbiBlZGl0aW5nL2RlbGV0aW5nIGl0LlxuICAgICAgICByZXR1cm4geyAuLi5kLl9zb3VyY2UsIF9pZDogZC5faWQgfSBhcyBBbm5vdGF0aW9uO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc0Fubm90YXRpb25zKGRvY3MpID09PSBmYWxzZSkge1xuICAgICAgICAvLyBObyBuZWVkIHRvIHRyYW5zbGF0ZSwgdGhpcyB3aWxsIG5vdCBiZSBleHBvc2VkIGluIHRoZSBVSS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbm5vdGF0aW9ucyBkaWRuJ3QgcGFzcyBpbnRlZ3JpdHkgY2hlY2suYCk7XG4gICAgICB9XG5cbiAgICAgIGRvY3MuZm9yRWFjaCgoZG9jOiBBbm5vdGF0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGpvYklkID0gZG9jLmpvYl9pZDtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmouYW5ub3RhdGlvbnNbam9iSWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIG9iai5hbm5vdGF0aW9uc1tqb2JJZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBvYmouYW5ub3RhdGlvbnNbam9iSWRdLnB1c2goZG9jKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBCb29tLmJhZFJlcXVlc3QoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUFubm90YXRpb24oaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBhcmFtOiBEZWxldGVQYXJhbXMgPSB7XG4gICAgICBpbmRleDogTUxfQU5OT1RBVElPTlNfSU5ERVhfQUxJQVNfV1JJVEUsXG4gICAgICB0eXBlOiBBTk5PVEFUSU9OX0RPQ19UWVBFLFxuICAgICAgaWQsXG4gICAgICByZWZyZXNoOiAnd2FpdF9mb3InLFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgY2FsbFdpdGhSZXF1ZXN0KCdkZWxldGUnLCBwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEFubm90YXRpb25zLFxuICAgIGluZGV4QW5ub3RhdGlvbixcbiAgICBkZWxldGVBbm5vdGF0aW9uLFxuICB9O1xufVxuIl19