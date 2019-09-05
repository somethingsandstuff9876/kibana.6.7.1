"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// The Annotation interface is based on annotation documents stored in the
// `.ml-annotations-6` index, accessed via the `.ml-annotations-[read|write]` aliases.
// Annotation document mapping:
// PUT .ml-annotations-6
// {
//   "mappings": {
//     "annotation": {
//       "properties": {
//         "annotation": {
//           "type": "text"
//         },
//         "create_time": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "create_username": {
//           "type": "keyword"
//         },
//         "timestamp": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "end_timestamp": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "job_id": {
//           "type": "keyword"
//         },
//         "modified_time": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "modified_username": {
//           "type": "keyword"
//         },
//         "type": {
//           "type": "keyword"
//         }
//       }
//     }
//   }
// }
// Alias
// POST /_aliases
// {
//     "actions" : [
//         { "add" : { "index" : ".ml-annotations-6", "alias" : ".ml-annotations-read" } },
//         { "add" : { "index" : ".ml-annotations-6", "alias" : ".ml-annotations-write" } }
//     ]
// }
const annotations_1 = require("../constants/annotations");
function isAnnotation(arg) {
    return (arg.timestamp !== undefined &&
        typeof arg.annotation === 'string' &&
        typeof arg.job_id === 'string' &&
        (arg.type === annotations_1.ANNOTATION_TYPE.ANNOTATION || arg.type === annotations_1.ANNOTATION_TYPE.COMMENT));
}
exports.isAnnotation = isAnnotation;
function isAnnotations(arg) {
    if (Array.isArray(arg) === false) {
        return false;
    }
    return arg.every((d) => isAnnotation(d));
}
exports.isAnnotations = isAnnotations;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvbWwvY29tbW9uL3R5cGVzL2Fubm90YXRpb25zLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9tbC9jb21tb24vdHlwZXMvYW5ub3RhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsMEVBQTBFO0FBQzFFLHNGQUFzRjtBQUV0RiwrQkFBK0I7QUFDL0Isd0JBQXdCO0FBQ3hCLElBQUk7QUFDSixrQkFBa0I7QUFDbEIsc0JBQXNCO0FBQ3RCLHdCQUF3QjtBQUN4QiwwQkFBMEI7QUFDMUIsMkJBQTJCO0FBQzNCLGFBQWE7QUFDYiwyQkFBMkI7QUFDM0IsNEJBQTRCO0FBQzVCLHFDQUFxQztBQUNyQyxhQUFhO0FBQ2IsK0JBQStCO0FBQy9CLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2IseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QixxQ0FBcUM7QUFDckMsYUFBYTtBQUNiLDZCQUE2QjtBQUM3Qiw0QkFBNEI7QUFDNUIscUNBQXFDO0FBQ3JDLGFBQWE7QUFDYixzQkFBc0I7QUFDdEIsOEJBQThCO0FBQzlCLGFBQWE7QUFDYiw2QkFBNkI7QUFDN0IsNEJBQTRCO0FBQzVCLHFDQUFxQztBQUNyQyxhQUFhO0FBQ2IsaUNBQWlDO0FBQ2pDLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2Isb0JBQW9CO0FBQ3BCLDhCQUE4QjtBQUM5QixZQUFZO0FBQ1osVUFBVTtBQUNWLFFBQVE7QUFDUixNQUFNO0FBQ04sSUFBSTtBQUVKLFFBQVE7QUFDUixpQkFBaUI7QUFDakIsSUFBSTtBQUNKLG9CQUFvQjtBQUNwQiwyRkFBMkY7QUFDM0YsMkZBQTJGO0FBQzNGLFFBQVE7QUFDUixJQUFJO0FBRUosMERBQTJEO0FBaUIzRCxTQUFnQixZQUFZLENBQUMsR0FBUTtJQUNuQyxPQUFPLENBQ0wsR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTO1FBQzNCLE9BQU8sR0FBRyxDQUFDLFVBQVUsS0FBSyxRQUFRO1FBQ2xDLE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxRQUFRO1FBQzlCLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyw2QkFBZSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLDZCQUFlLENBQUMsT0FBTyxDQUFDLENBQ2xGLENBQUM7QUFDSixDQUFDO0FBUEQsb0NBT0M7QUFJRCxTQUFnQixhQUFhLENBQUMsR0FBUTtJQUNwQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFO1FBQ2hDLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFhLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFMRCxzQ0FLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbi8vIFRoZSBBbm5vdGF0aW9uIGludGVyZmFjZSBpcyBiYXNlZCBvbiBhbm5vdGF0aW9uIGRvY3VtZW50cyBzdG9yZWQgaW4gdGhlXG4vLyBgLm1sLWFubm90YXRpb25zLTZgIGluZGV4LCBhY2Nlc3NlZCB2aWEgdGhlIGAubWwtYW5ub3RhdGlvbnMtW3JlYWR8d3JpdGVdYCBhbGlhc2VzLlxuXG4vLyBBbm5vdGF0aW9uIGRvY3VtZW50IG1hcHBpbmc6XG4vLyBQVVQgLm1sLWFubm90YXRpb25zLTZcbi8vIHtcbi8vICAgXCJtYXBwaW5nc1wiOiB7XG4vLyAgICAgXCJhbm5vdGF0aW9uXCI6IHtcbi8vICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4vLyAgICAgICAgIFwiYW5ub3RhdGlvblwiOiB7XG4vLyAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIFwiY3JlYXRlX3RpbWVcIjoge1xuLy8gICAgICAgICAgIFwidHlwZVwiOiBcImRhdGVcIixcbi8vICAgICAgICAgICBcImZvcm1hdFwiOiBcImVwb2NoX21pbGxpc1wiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIFwiY3JlYXRlX3VzZXJuYW1lXCI6IHtcbi8vICAgICAgICAgICBcInR5cGVcIjogXCJrZXl3b3JkXCJcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgXCJ0aW1lc3RhbXBcIjoge1xuLy8gICAgICAgICAgIFwidHlwZVwiOiBcImRhdGVcIixcbi8vICAgICAgICAgICBcImZvcm1hdFwiOiBcImVwb2NoX21pbGxpc1wiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIFwiZW5kX3RpbWVzdGFtcFwiOiB7XG4vLyAgICAgICAgICAgXCJ0eXBlXCI6IFwiZGF0ZVwiLFxuLy8gICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZXBvY2hfbWlsbGlzXCJcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgXCJqb2JfaWRcIjoge1xuLy8gICAgICAgICAgIFwidHlwZVwiOiBcImtleXdvcmRcIlxuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBcIm1vZGlmaWVkX3RpbWVcIjoge1xuLy8gICAgICAgICAgIFwidHlwZVwiOiBcImRhdGVcIixcbi8vICAgICAgICAgICBcImZvcm1hdFwiOiBcImVwb2NoX21pbGxpc1wiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIFwibW9kaWZpZWRfdXNlcm5hbWVcIjoge1xuLy8gICAgICAgICAgIFwidHlwZVwiOiBcImtleXdvcmRcIlxuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBcInR5cGVcIjoge1xuLy8gICAgICAgICAgIFwidHlwZVwiOiBcImtleXdvcmRcIlxuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbi8vIEFsaWFzXG4vLyBQT1NUIC9fYWxpYXNlc1xuLy8ge1xuLy8gICAgIFwiYWN0aW9uc1wiIDogW1xuLy8gICAgICAgICB7IFwiYWRkXCIgOiB7IFwiaW5kZXhcIiA6IFwiLm1sLWFubm90YXRpb25zLTZcIiwgXCJhbGlhc1wiIDogXCIubWwtYW5ub3RhdGlvbnMtcmVhZFwiIH0gfSxcbi8vICAgICAgICAgeyBcImFkZFwiIDogeyBcImluZGV4XCIgOiBcIi5tbC1hbm5vdGF0aW9ucy02XCIsIFwiYWxpYXNcIiA6IFwiLm1sLWFubm90YXRpb25zLXdyaXRlXCIgfSB9XG4vLyAgICAgXVxuLy8gfVxuXG5pbXBvcnQgeyBBTk5PVEFUSU9OX1RZUEUgfSBmcm9tICcuLi9jb25zdGFudHMvYW5ub3RhdGlvbnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFubm90YXRpb24ge1xuICBfaWQ/OiBzdHJpbmc7XG4gIGNyZWF0ZV90aW1lPzogbnVtYmVyO1xuICBjcmVhdGVfdXNlcm5hbWU/OiBzdHJpbmc7XG4gIG1vZGlmaWVkX3RpbWU/OiBudW1iZXI7XG4gIG1vZGlmaWVkX3VzZXJuYW1lPzogc3RyaW5nO1xuICBrZXk/OiBzdHJpbmc7XG5cbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIGVuZF90aW1lc3RhbXA/OiBudW1iZXI7XG4gIGFubm90YXRpb246IHN0cmluZztcbiAgam9iX2lkOiBzdHJpbmc7XG4gIHR5cGU6IEFOTk9UQVRJT05fVFlQRS5BTk5PVEFUSU9OIHwgQU5OT1RBVElPTl9UWVBFLkNPTU1FTlQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fubm90YXRpb24oYXJnOiBhbnkpOiBhcmcgaXMgQW5ub3RhdGlvbiB7XG4gIHJldHVybiAoXG4gICAgYXJnLnRpbWVzdGFtcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgdHlwZW9mIGFyZy5hbm5vdGF0aW9uID09PSAnc3RyaW5nJyAmJlxuICAgIHR5cGVvZiBhcmcuam9iX2lkID09PSAnc3RyaW5nJyAmJlxuICAgIChhcmcudHlwZSA9PT0gQU5OT1RBVElPTl9UWVBFLkFOTk9UQVRJT04gfHwgYXJnLnR5cGUgPT09IEFOTk9UQVRJT05fVFlQRS5DT01NRU5UKVxuICApO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFubm90YXRpb25zIGV4dGVuZHMgQXJyYXk8QW5ub3RhdGlvbj4ge31cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQW5ub3RhdGlvbnMoYXJnOiBhbnkpOiBhcmcgaXMgQW5ub3RhdGlvbnMge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcmcpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gYXJnLmV2ZXJ5KChkOiBBbm5vdGF0aW9uKSA9PiBpc0Fubm90YXRpb24oZCkpO1xufVxuIl19