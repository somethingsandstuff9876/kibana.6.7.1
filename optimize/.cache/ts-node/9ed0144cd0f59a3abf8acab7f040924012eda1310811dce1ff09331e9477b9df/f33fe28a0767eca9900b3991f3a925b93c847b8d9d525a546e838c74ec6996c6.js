"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.sharedSchema = graphql_tag_1.default `
  "A representation of the log entry's position in the event stream"
  type InfraTimeKey {
    "The timestamp of the event that the log entry corresponds to"
    time: Float!
    "The tiebreaker that disambiguates events with the same timestamp"
    tiebreaker: Float!
  }

  input InfraTimeKeyInput {
    time: Float!
    tiebreaker: Float!
  }

  enum InfraIndexType {
    ANY
    LOGS
    METRICS
  }

  enum InfraNodeType {
    pod
    container
    host
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvY29tbW9uL2dyYXBocWwvc2hhcmVkL3NjaGVtYS5ncWwudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL2NvbW1vbi9ncmFwaHFsL3NoYXJlZC9zY2hlbWEuZ3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzRUFBOEI7QUFFakIsUUFBQSxZQUFZLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXlCOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBncWwgZnJvbSAnZ3JhcGhxbC10YWcnO1xuXG5leHBvcnQgY29uc3Qgc2hhcmVkU2NoZW1hID0gZ3FsYFxuICBcIkEgcmVwcmVzZW50YXRpb24gb2YgdGhlIGxvZyBlbnRyeSdzIHBvc2l0aW9uIGluIHRoZSBldmVudCBzdHJlYW1cIlxuICB0eXBlIEluZnJhVGltZUtleSB7XG4gICAgXCJUaGUgdGltZXN0YW1wIG9mIHRoZSBldmVudCB0aGF0IHRoZSBsb2cgZW50cnkgY29ycmVzcG9uZHMgdG9cIlxuICAgIHRpbWU6IEZsb2F0IVxuICAgIFwiVGhlIHRpZWJyZWFrZXIgdGhhdCBkaXNhbWJpZ3VhdGVzIGV2ZW50cyB3aXRoIHRoZSBzYW1lIHRpbWVzdGFtcFwiXG4gICAgdGllYnJlYWtlcjogRmxvYXQhXG4gIH1cblxuICBpbnB1dCBJbmZyYVRpbWVLZXlJbnB1dCB7XG4gICAgdGltZTogRmxvYXQhXG4gICAgdGllYnJlYWtlcjogRmxvYXQhXG4gIH1cblxuICBlbnVtIEluZnJhSW5kZXhUeXBlIHtcbiAgICBBTllcbiAgICBMT0dTXG4gICAgTUVUUklDU1xuICB9XG5cbiAgZW51bSBJbmZyYU5vZGVUeXBlIHtcbiAgICBwb2RcbiAgICBjb250YWluZXJcbiAgICBob3N0XG4gIH1cbmA7XG4iXX0=