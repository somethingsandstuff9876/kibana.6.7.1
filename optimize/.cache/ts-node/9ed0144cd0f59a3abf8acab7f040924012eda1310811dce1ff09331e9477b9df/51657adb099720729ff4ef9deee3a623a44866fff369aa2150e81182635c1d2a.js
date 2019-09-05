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
const url_1 = require("url");
/**
 *  Takes a URL and a function that takes the meaningful parts
 *  of the URL as a key-value object, modifies some or all of
 *  the parts, and returns the modified parts formatted again
 *  as a url.
 *
 *  Url Parts sent:
 *    - protocol
 *    - slashes (does the url have the //)
 *    - auth
 *    - hostname (just the name of the host, no port or auth information)
 *    - port
 *    - pathname (the path after the hostname, no query or hash, starts
 *        with a slash if there was a path)
 *    - query (always an object, even when no query on original url)
 *    - hash
 *
 *  Why?
 *    - The default url library in node produces several conflicting
 *      properties on the "parsed" output. Modifying any of these might
 *      lead to the modifications being ignored (depending on which
 *      property was modified)
 *    - It's not always clear whether to use path/pathname, host/hostname,
 *      so this tries to add helpful constraints
 *
 *  @param url The string url to parse.
 *  @param urlModifier A function that will modify the parsed url, or return a new one.
 *  @returns The modified and reformatted url
 */
function modifyUrl(url, urlModifier) {
    const parsed = url_1.parse(url, true);
    // Copy over the most specific version of each property. By default, the parsed url includes several
    // conflicting properties (like path and pathname + search, or search and query) and keeping track
    // of which property is actually used when they are formatted is harder than necessary.
    const meaningfulParts = {
        auth: parsed.auth,
        hash: parsed.hash,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        port: parsed.port,
        protocol: parsed.protocol,
        query: parsed.query || {},
        slashes: parsed.slashes,
    };
    // The urlModifier modifies the meaningfulParts object, or returns a new one.
    const modifiedParts = urlModifier(meaningfulParts) || meaningfulParts;
    // Format the modified/replaced meaningfulParts back into a url.
    return url_1.format({
        auth: modifiedParts.auth,
        hash: modifiedParts.hash,
        hostname: modifiedParts.hostname,
        pathname: modifiedParts.pathname,
        port: modifiedParts.port,
        protocol: modifiedParts.protocol,
        query: modifiedParts.query,
        slashes: modifiedParts.slashes,
    });
}
exports.modifyUrl = modifyUrl;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvdXRpbHMvdXJsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS91dGlscy91cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFHSCw2QkFBd0U7QUFheEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxTQUFnQixTQUFTLENBQ3ZCLEdBQVcsRUFDWCxXQUFzRjtJQUV0RixNQUFNLE1BQU0sR0FBRyxXQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBdUIsQ0FBQztJQUV6RCxvR0FBb0c7SUFDcEcsa0dBQWtHO0lBQ2xHLHVGQUF1RjtJQUN2RixNQUFNLGVBQWUsR0FBdUI7UUFDMUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1FBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtRQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7UUFDekIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1FBQ3pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtRQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7UUFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTtRQUN6QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87S0FDeEIsQ0FBQztJQUVGLDZFQUE2RTtJQUM3RSxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksZUFBZSxDQUFDO0lBRXRFLGdFQUFnRTtJQUNoRSxPQUFPLFlBQVMsQ0FBQztRQUNmLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSTtRQUN4QixJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUk7UUFDeEIsUUFBUSxFQUFFLGFBQWEsQ0FBQyxRQUFRO1FBQ2hDLFFBQVEsRUFBRSxhQUFhLENBQUMsUUFBUTtRQUNoQyxJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUk7UUFDeEIsUUFBUSxFQUFFLGFBQWEsQ0FBQyxRQUFRO1FBQ2hDLEtBQUssRUFBRSxhQUFhLENBQUMsS0FBSztRQUMxQixPQUFPLEVBQUUsYUFBYSxDQUFDLE9BQU87S0FDbEIsQ0FBQyxDQUFDO0FBQ2xCLENBQUM7QUFsQ0QsOEJBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBhcnNlZFVybFF1ZXJ5IH0gZnJvbSAncXVlcnlzdHJpbmcnO1xuaW1wb3J0IHsgZm9ybWF0IGFzIGZvcm1hdFVybCwgcGFyc2UgYXMgcGFyc2VVcmwsIFVybE9iamVjdCB9IGZyb20gJ3VybCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVVJMTWVhbmluZ2Z1bFBhcnRzIHtcbiAgYXV0aDogc3RyaW5nIHwgbnVsbDtcbiAgaGFzaDogc3RyaW5nIHwgbnVsbDtcbiAgaG9zdG5hbWU6IHN0cmluZyB8IG51bGw7XG4gIHBhdGhuYW1lOiBzdHJpbmcgfCBudWxsO1xuICBwcm90b2NvbDogc3RyaW5nIHwgbnVsbDtcbiAgc2xhc2hlczogYm9vbGVhbiB8IG51bGw7XG4gIHBvcnQ6IHN0cmluZyB8IG51bGw7XG4gIHF1ZXJ5OiBQYXJzZWRVcmxRdWVyeSB8IHt9O1xufVxuXG4vKipcbiAqICBUYWtlcyBhIFVSTCBhbmQgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBtZWFuaW5nZnVsIHBhcnRzXG4gKiAgb2YgdGhlIFVSTCBhcyBhIGtleS12YWx1ZSBvYmplY3QsIG1vZGlmaWVzIHNvbWUgb3IgYWxsIG9mXG4gKiAgdGhlIHBhcnRzLCBhbmQgcmV0dXJucyB0aGUgbW9kaWZpZWQgcGFydHMgZm9ybWF0dGVkIGFnYWluXG4gKiAgYXMgYSB1cmwuXG4gKlxuICogIFVybCBQYXJ0cyBzZW50OlxuICogICAgLSBwcm90b2NvbFxuICogICAgLSBzbGFzaGVzIChkb2VzIHRoZSB1cmwgaGF2ZSB0aGUgLy8pXG4gKiAgICAtIGF1dGhcbiAqICAgIC0gaG9zdG5hbWUgKGp1c3QgdGhlIG5hbWUgb2YgdGhlIGhvc3QsIG5vIHBvcnQgb3IgYXV0aCBpbmZvcm1hdGlvbilcbiAqICAgIC0gcG9ydFxuICogICAgLSBwYXRobmFtZSAodGhlIHBhdGggYWZ0ZXIgdGhlIGhvc3RuYW1lLCBubyBxdWVyeSBvciBoYXNoLCBzdGFydHNcbiAqICAgICAgICB3aXRoIGEgc2xhc2ggaWYgdGhlcmUgd2FzIGEgcGF0aClcbiAqICAgIC0gcXVlcnkgKGFsd2F5cyBhbiBvYmplY3QsIGV2ZW4gd2hlbiBubyBxdWVyeSBvbiBvcmlnaW5hbCB1cmwpXG4gKiAgICAtIGhhc2hcbiAqXG4gKiAgV2h5P1xuICogICAgLSBUaGUgZGVmYXVsdCB1cmwgbGlicmFyeSBpbiBub2RlIHByb2R1Y2VzIHNldmVyYWwgY29uZmxpY3RpbmdcbiAqICAgICAgcHJvcGVydGllcyBvbiB0aGUgXCJwYXJzZWRcIiBvdXRwdXQuIE1vZGlmeWluZyBhbnkgb2YgdGhlc2UgbWlnaHRcbiAqICAgICAgbGVhZCB0byB0aGUgbW9kaWZpY2F0aW9ucyBiZWluZyBpZ25vcmVkIChkZXBlbmRpbmcgb24gd2hpY2hcbiAqICAgICAgcHJvcGVydHkgd2FzIG1vZGlmaWVkKVxuICogICAgLSBJdCdzIG5vdCBhbHdheXMgY2xlYXIgd2hldGhlciB0byB1c2UgcGF0aC9wYXRobmFtZSwgaG9zdC9ob3N0bmFtZSxcbiAqICAgICAgc28gdGhpcyB0cmllcyB0byBhZGQgaGVscGZ1bCBjb25zdHJhaW50c1xuICpcbiAqICBAcGFyYW0gdXJsIFRoZSBzdHJpbmcgdXJsIHRvIHBhcnNlLlxuICogIEBwYXJhbSB1cmxNb2RpZmllciBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBtb2RpZnkgdGhlIHBhcnNlZCB1cmwsIG9yIHJldHVybiBhIG5ldyBvbmUuXG4gKiAgQHJldHVybnMgVGhlIG1vZGlmaWVkIGFuZCByZWZvcm1hdHRlZCB1cmxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vZGlmeVVybChcbiAgdXJsOiBzdHJpbmcsXG4gIHVybE1vZGlmaWVyOiAodXJsUGFydHM6IFVSTE1lYW5pbmdmdWxQYXJ0cykgPT4gUGFydGlhbDxVUkxNZWFuaW5nZnVsUGFydHM+IHwgdW5kZWZpbmVkXG4pIHtcbiAgY29uc3QgcGFyc2VkID0gcGFyc2VVcmwodXJsLCB0cnVlKSBhcyBVUkxNZWFuaW5nZnVsUGFydHM7XG5cbiAgLy8gQ29weSBvdmVyIHRoZSBtb3N0IHNwZWNpZmljIHZlcnNpb24gb2YgZWFjaCBwcm9wZXJ0eS4gQnkgZGVmYXVsdCwgdGhlIHBhcnNlZCB1cmwgaW5jbHVkZXMgc2V2ZXJhbFxuICAvLyBjb25mbGljdGluZyBwcm9wZXJ0aWVzIChsaWtlIHBhdGggYW5kIHBhdGhuYW1lICsgc2VhcmNoLCBvciBzZWFyY2ggYW5kIHF1ZXJ5KSBhbmQga2VlcGluZyB0cmFja1xuICAvLyBvZiB3aGljaCBwcm9wZXJ0eSBpcyBhY3R1YWxseSB1c2VkIHdoZW4gdGhleSBhcmUgZm9ybWF0dGVkIGlzIGhhcmRlciB0aGFuIG5lY2Vzc2FyeS5cbiAgY29uc3QgbWVhbmluZ2Z1bFBhcnRzOiBVUkxNZWFuaW5nZnVsUGFydHMgPSB7XG4gICAgYXV0aDogcGFyc2VkLmF1dGgsXG4gICAgaGFzaDogcGFyc2VkLmhhc2gsXG4gICAgaG9zdG5hbWU6IHBhcnNlZC5ob3N0bmFtZSxcbiAgICBwYXRobmFtZTogcGFyc2VkLnBhdGhuYW1lLFxuICAgIHBvcnQ6IHBhcnNlZC5wb3J0LFxuICAgIHByb3RvY29sOiBwYXJzZWQucHJvdG9jb2wsXG4gICAgcXVlcnk6IHBhcnNlZC5xdWVyeSB8fCB7fSxcbiAgICBzbGFzaGVzOiBwYXJzZWQuc2xhc2hlcyxcbiAgfTtcblxuICAvLyBUaGUgdXJsTW9kaWZpZXIgbW9kaWZpZXMgdGhlIG1lYW5pbmdmdWxQYXJ0cyBvYmplY3QsIG9yIHJldHVybnMgYSBuZXcgb25lLlxuICBjb25zdCBtb2RpZmllZFBhcnRzID0gdXJsTW9kaWZpZXIobWVhbmluZ2Z1bFBhcnRzKSB8fCBtZWFuaW5nZnVsUGFydHM7XG5cbiAgLy8gRm9ybWF0IHRoZSBtb2RpZmllZC9yZXBsYWNlZCBtZWFuaW5nZnVsUGFydHMgYmFjayBpbnRvIGEgdXJsLlxuICByZXR1cm4gZm9ybWF0VXJsKHtcbiAgICBhdXRoOiBtb2RpZmllZFBhcnRzLmF1dGgsXG4gICAgaGFzaDogbW9kaWZpZWRQYXJ0cy5oYXNoLFxuICAgIGhvc3RuYW1lOiBtb2RpZmllZFBhcnRzLmhvc3RuYW1lLFxuICAgIHBhdGhuYW1lOiBtb2RpZmllZFBhcnRzLnBhdGhuYW1lLFxuICAgIHBvcnQ6IG1vZGlmaWVkUGFydHMucG9ydCxcbiAgICBwcm90b2NvbDogbW9kaWZpZWRQYXJ0cy5wcm90b2NvbCxcbiAgICBxdWVyeTogbW9kaWZpZWRQYXJ0cy5xdWVyeSxcbiAgICBzbGFzaGVzOiBtb2RpZmllZFBhcnRzLnNsYXNoZXMsXG4gIH0gYXMgVXJsT2JqZWN0KTtcbn1cbiJdfQ==