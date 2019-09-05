'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.castProvider = castProvider;

var _get_type = require('../lib/get_type');

function castProvider(types) {
  return function cast(node, toTypeNames) {
    // If you don't give us anything to cast to, you'll get your input back
    if (!toTypeNames || toTypeNames.length === 0) return node;

    // No need to cast if node is already one of the valid types
    var fromTypeName = (0, _get_type.getType)(node);
    if (toTypeNames.includes(fromTypeName)) return node;

    var fromTypeDef = types[fromTypeName];

    for (var i = 0; i < toTypeNames.length; i++) {
      // First check if the current type can cast to this type
      if (fromTypeDef && fromTypeDef.castsTo(toTypeNames[i])) {
        return fromTypeDef.to(node, toTypeNames[i], types);
      }

      // If that isn't possible, check if this type can cast from the current type
      var toTypeDef = types[toTypeNames[i]];
      if (toTypeDef && toTypeDef.castsFrom(fromTypeName)) return toTypeDef.from(node, types);
    }

    throw new Error('Can not cast \'' + fromTypeName + '\' to any of \'' + toTypeNames.join(', ') + '\'');
  };
} /*
   * Licensed to Elasticsearch B.V. under one or more contributor
   * license agreements. See the NOTICE file distributed with
   * this work for additional information regarding copyright
   * ownership. Elasticsearch B.V. licenses this file to you under
   * the Apache License, Version 2.0 (the "License"); you may
   * not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing,
   * software distributed under the License is distributed on an
   * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
   * KIND, either express or implied.  See the License for the
   * specific language governing permissions and limitations
   * under the License.
   */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vaW50ZXJwcmV0ZXIvY2FzdC5qcyJdLCJuYW1lcyI6WyJjYXN0UHJvdmlkZXIiLCJ0eXBlcyIsImNhc3QiLCJub2RlIiwidG9UeXBlTmFtZXMiLCJsZW5ndGgiLCJmcm9tVHlwZU5hbWUiLCJpbmNsdWRlcyIsImZyb21UeXBlRGVmIiwiaSIsImNhc3RzVG8iLCJ0byIsInRvVHlwZURlZiIsImNhc3RzRnJvbSIsImZyb20iLCJFcnJvciIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7O1FBcUJnQkEsWSxHQUFBQSxZOztBQUZoQjs7QUFFTyxTQUFTQSxZQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUNsQyxTQUFPLFNBQVNDLElBQVQsQ0FBY0MsSUFBZCxFQUFvQkMsV0FBcEIsRUFBaUM7QUFDdEM7QUFDQSxRQUFJLENBQUNBLFdBQUQsSUFBZ0JBLFlBQVlDLE1BQVosS0FBdUIsQ0FBM0MsRUFBOEMsT0FBT0YsSUFBUDs7QUFFOUM7QUFDQSxRQUFNRyxlQUFlLHVCQUFRSCxJQUFSLENBQXJCO0FBQ0EsUUFBSUMsWUFBWUcsUUFBWixDQUFxQkQsWUFBckIsQ0FBSixFQUF3QyxPQUFPSCxJQUFQOztBQUV4QyxRQUFNSyxjQUFjUCxNQUFNSyxZQUFOLENBQXBCOztBQUVBLFNBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTCxZQUFZQyxNQUFoQyxFQUF3Q0ksR0FBeEMsRUFBNkM7QUFDM0M7QUFDQSxVQUFJRCxlQUFlQSxZQUFZRSxPQUFaLENBQW9CTixZQUFZSyxDQUFaLENBQXBCLENBQW5CLEVBQXdEO0FBQ3RELGVBQU9ELFlBQVlHLEVBQVosQ0FBZVIsSUFBZixFQUFxQkMsWUFBWUssQ0FBWixDQUFyQixFQUFxQ1IsS0FBckMsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsVUFBTVcsWUFBWVgsTUFBTUcsWUFBWUssQ0FBWixDQUFOLENBQWxCO0FBQ0EsVUFBSUcsYUFBYUEsVUFBVUMsU0FBVixDQUFvQlAsWUFBcEIsQ0FBakIsRUFBb0QsT0FBT00sVUFBVUUsSUFBVixDQUFlWCxJQUFmLEVBQXFCRixLQUFyQixDQUFQO0FBQ3JEOztBQUVELFVBQU0sSUFBSWMsS0FBSixxQkFBMkJULFlBQTNCLHVCQUF1REYsWUFBWVksSUFBWixDQUFpQixJQUFqQixDQUF2RCxRQUFOO0FBQ0QsR0F0QkQ7QUF1QkQsQyxDQTdDRCIsImZpbGUiOiJjYXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGdldFR5cGUgfSBmcm9tICcuLi9saWIvZ2V0X3R5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FzdFByb3ZpZGVyKHR5cGVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjYXN0KG5vZGUsIHRvVHlwZU5hbWVzKSB7XG4gICAgLy8gSWYgeW91IGRvbid0IGdpdmUgdXMgYW55dGhpbmcgdG8gY2FzdCB0bywgeW91J2xsIGdldCB5b3VyIGlucHV0IGJhY2tcbiAgICBpZiAoIXRvVHlwZU5hbWVzIHx8IHRvVHlwZU5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG5vZGU7XG5cbiAgICAvLyBObyBuZWVkIHRvIGNhc3QgaWYgbm9kZSBpcyBhbHJlYWR5IG9uZSBvZiB0aGUgdmFsaWQgdHlwZXNcbiAgICBjb25zdCBmcm9tVHlwZU5hbWUgPSBnZXRUeXBlKG5vZGUpO1xuICAgIGlmICh0b1R5cGVOYW1lcy5pbmNsdWRlcyhmcm9tVHlwZU5hbWUpKSByZXR1cm4gbm9kZTtcblxuICAgIGNvbnN0IGZyb21UeXBlRGVmID0gdHlwZXNbZnJvbVR5cGVOYW1lXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9UeXBlTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHRoZSBjdXJyZW50IHR5cGUgY2FuIGNhc3QgdG8gdGhpcyB0eXBlXG4gICAgICBpZiAoZnJvbVR5cGVEZWYgJiYgZnJvbVR5cGVEZWYuY2FzdHNUbyh0b1R5cGVOYW1lc1tpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZyb21UeXBlRGVmLnRvKG5vZGUsIHRvVHlwZU5hbWVzW2ldLCB0eXBlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoYXQgaXNuJ3QgcG9zc2libGUsIGNoZWNrIGlmIHRoaXMgdHlwZSBjYW4gY2FzdCBmcm9tIHRoZSBjdXJyZW50IHR5cGVcbiAgICAgIGNvbnN0IHRvVHlwZURlZiA9IHR5cGVzW3RvVHlwZU5hbWVzW2ldXTtcbiAgICAgIGlmICh0b1R5cGVEZWYgJiYgdG9UeXBlRGVmLmNhc3RzRnJvbShmcm9tVHlwZU5hbWUpKSByZXR1cm4gdG9UeXBlRGVmLmZyb20obm9kZSwgdHlwZXMpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgQ2FuIG5vdCBjYXN0ICcke2Zyb21UeXBlTmFtZX0nIHRvIGFueSBvZiAnJHt0b1R5cGVOYW1lcy5qb2luKCcsICcpfSdgKTtcbiAgfTtcbn1cbiJdfQ==