"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const getopts_1 = tslib_1.__importDefault(require("getopts"));
function getFlags(argv) {
    const { verbose, quiet, silent, debug, help, _, ...others } = getopts_1.default(argv, {
        alias: {
            v: 'verbose',
        },
        default: {
            verbose: false,
            quiet: false,
            silent: false,
            debug: false,
            help: false,
        },
    });
    return {
        verbose,
        quiet,
        silent,
        debug,
        help,
        _,
        ...others,
    };
}
exports.getFlags = getFlags;
function getHelp(options) {
    return `
  node ${path_1.relative(process.cwd(), process.argv[1])}

  ${options.helpDescription || 'Runs a dev task'}

  Options:
    --verbose, -v      Log verbosely
    --debug            Log debug messages (less than verbose)
    --quiet            Only log errors
    --silent           Don't log anything
    --help             Show this message

`;
}
exports.getHelp = getHelp;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2Rldi9ydW4vZmxhZ3MudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9kZXYvcnVuL2ZsYWdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7OztBQUVILCtCQUFnQztBQUVoQyw4REFBOEI7QUFlOUIsU0FBZ0IsUUFBUSxDQUFDLElBQWM7SUFDckMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLEVBQUU7UUFDMUUsS0FBSyxFQUFFO1lBQ0wsQ0FBQyxFQUFFLFNBQVM7U0FDYjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsS0FBSztZQUNiLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLEtBQUs7U0FDWjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU87UUFDTCxPQUFPO1FBQ1AsS0FBSztRQUNMLE1BQU07UUFDTixLQUFLO1FBQ0wsSUFBSTtRQUNKLENBQUM7UUFDRCxHQUFHLE1BQU07S0FDVixDQUFDO0FBQ0osQ0FBQztBQXZCRCw0QkF1QkM7QUFFRCxTQUFnQixPQUFPLENBQUMsT0FBZ0I7SUFDdEMsT0FBTztTQUNBLGVBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFN0MsT0FBTyxDQUFDLGVBQWUsSUFBSSxpQkFBaUI7Ozs7Ozs7OztDQVMvQyxDQUFDO0FBQ0YsQ0FBQztBQWRELDBCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHJlbGF0aXZlIH0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCBnZXRvcHRzIGZyb20gJ2dldG9wdHMnO1xuXG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9ydW4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZsYWdzIHtcbiAgdmVyYm9zZTogYm9vbGVhbjtcbiAgcXVpZXQ6IGJvb2xlYW47XG4gIHNpbGVudDogYm9vbGVhbjtcbiAgZGVidWc6IGJvb2xlYW47XG4gIGhlbHA6IGJvb2xlYW47XG4gIF86IHN0cmluZ1tdO1xuXG4gIFtrZXk6IHN0cmluZ106IHVuZGVmaW5lZCB8IGJvb2xlYW4gfCBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZsYWdzKGFyZ3Y6IHN0cmluZ1tdKTogRmxhZ3Mge1xuICBjb25zdCB7IHZlcmJvc2UsIHF1aWV0LCBzaWxlbnQsIGRlYnVnLCBoZWxwLCBfLCAuLi5vdGhlcnMgfSA9IGdldG9wdHMoYXJndiwge1xuICAgIGFsaWFzOiB7XG4gICAgICB2OiAndmVyYm9zZScsXG4gICAgfSxcbiAgICBkZWZhdWx0OiB7XG4gICAgICB2ZXJib3NlOiBmYWxzZSxcbiAgICAgIHF1aWV0OiBmYWxzZSxcbiAgICAgIHNpbGVudDogZmFsc2UsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICBoZWxwOiBmYWxzZSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHZlcmJvc2UsXG4gICAgcXVpZXQsXG4gICAgc2lsZW50LFxuICAgIGRlYnVnLFxuICAgIGhlbHAsXG4gICAgXyxcbiAgICAuLi5vdGhlcnMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIZWxwKG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgcmV0dXJuIGBcbiAgbm9kZSAke3JlbGF0aXZlKHByb2Nlc3MuY3dkKCksIHByb2Nlc3MuYXJndlsxXSl9XG5cbiAgJHtvcHRpb25zLmhlbHBEZXNjcmlwdGlvbiB8fCAnUnVucyBhIGRldiB0YXNrJ31cblxuICBPcHRpb25zOlxuICAgIC0tdmVyYm9zZSwgLXYgICAgICBMb2cgdmVyYm9zZWx5XG4gICAgLS1kZWJ1ZyAgICAgICAgICAgIExvZyBkZWJ1ZyBtZXNzYWdlcyAobGVzcyB0aGFuIHZlcmJvc2UpXG4gICAgLS1xdWlldCAgICAgICAgICAgIE9ubHkgbG9nIGVycm9yc1xuICAgIC0tc2lsZW50ICAgICAgICAgICBEb24ndCBsb2cgYW55dGhpbmdcbiAgICAtLWhlbHAgICAgICAgICAgICAgU2hvdyB0aGlzIG1lc3NhZ2VcblxuYDtcbn1cbiJdfQ==