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
class BinderBase {
    constructor() {
        this.disposal = [];
    }
    on(emitter, ...args) {
        const on = emitter.on || emitter.addListener;
        const off = emitter.off || emitter.removeListener;
        on.apply(emitter, args);
        this.disposal.push(() => off.apply(emitter, args));
    }
    destroy() {
        const destroyers = this.disposal;
        this.disposal = [];
        destroyers.forEach(fn => fn());
    }
}
exports.BinderBase = BinderBase;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3V0aWxzL2JpbmRlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3V0aWxzL2JpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQVNILE1BQWEsVUFBVTtJQUF2QjtRQUNVLGFBQVEsR0FBc0IsRUFBRSxDQUFDO0lBZTNDLENBQUM7SUFiUSxFQUFFLENBQUMsT0FBZ0IsRUFBRSxHQUFHLElBQVc7UUFDeEMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzdDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUVsRCxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxPQUFPO1FBQ1osTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFoQkQsZ0NBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRW1pdHRlciB7XG4gIG9uOiAoYXJnczogYW55W10pID0+IHZvaWQ7XG4gIG9mZjogKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuICBhZGRMaXN0ZW5lcjogRW1pdHRlclsnb24nXTtcbiAgcmVtb3ZlTGlzdGVuZXI6IEVtaXR0ZXJbJ29mZiddO1xufVxuXG5leHBvcnQgY2xhc3MgQmluZGVyQmFzZSB7XG4gIHByaXZhdGUgZGlzcG9zYWw6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbiAgcHVibGljIG9uKGVtaXR0ZXI6IEVtaXR0ZXIsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgY29uc3Qgb24gPSBlbWl0dGVyLm9uIHx8IGVtaXR0ZXIuYWRkTGlzdGVuZXI7XG4gICAgY29uc3Qgb2ZmID0gZW1pdHRlci5vZmYgfHwgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcjtcblxuICAgIG9uLmFwcGx5KGVtaXR0ZXIsIGFyZ3MpO1xuICAgIHRoaXMuZGlzcG9zYWwucHVzaCgoKSA9PiBvZmYuYXBwbHkoZW1pdHRlciwgYXJncykpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKSB7XG4gICAgY29uc3QgZGVzdHJveWVycyA9IHRoaXMuZGlzcG9zYWw7XG4gICAgdGhpcy5kaXNwb3NhbCA9IFtdO1xuICAgIGRlc3Ryb3llcnMuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgfVxufVxuIl19