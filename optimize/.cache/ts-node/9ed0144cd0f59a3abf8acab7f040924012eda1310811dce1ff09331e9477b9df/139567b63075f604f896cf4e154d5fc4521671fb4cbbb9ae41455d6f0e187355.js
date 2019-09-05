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
class PriorityCollection {
    constructor() {
        this.array = [];
    }
    add(priority, value) {
        const foundIndex = this.array.findIndex(current => {
            if (priority === current.priority) {
                throw new Error('Already have entry with this priority');
            }
            return priority < current.priority;
        });
        const spliceIndex = foundIndex === -1 ? this.array.length : foundIndex;
        this.array.splice(spliceIndex, 0, { priority, value });
    }
    toPrioritizedArray() {
        return this.array.map(entry => entry.value);
    }
}
exports.PriorityCollection = PriorityCollection;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL3NlcnZpY2UvbGliL3ByaW9yaXR5X2NvbGxlY3Rpb24udHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9zZXJ2ZXIvc2F2ZWRfb2JqZWN0cy9zZXJ2aWNlL2xpYi9wcmlvcml0eV9jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBT0gsTUFBYSxrQkFBa0I7SUFBL0I7UUFDbUIsVUFBSyxHQUFzQyxFQUFFLENBQUM7SUFrQmpFLENBQUM7SUFoQlEsR0FBRyxDQUFDLFFBQWdCLEVBQUUsS0FBUTtRQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNoRCxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7YUFDMUQ7WUFFRCxPQUFPLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sa0JBQWtCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNGO0FBbkJELGdEQW1CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbnRlcmZhY2UgUHJpb3JpdHlDb2xsZWN0aW9uRW50cnk8VD4ge1xuICBwcmlvcml0eTogbnVtYmVyO1xuICB2YWx1ZTogVDtcbn1cblxuZXhwb3J0IGNsYXNzIFByaW9yaXR5Q29sbGVjdGlvbjxUPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXJyYXk6IEFycmF5PFByaW9yaXR5Q29sbGVjdGlvbkVudHJ5PFQ+PiA9IFtdO1xuXG4gIHB1YmxpYyBhZGQocHJpb3JpdHk6IG51bWJlciwgdmFsdWU6IFQpIHtcbiAgICBjb25zdCBmb3VuZEluZGV4ID0gdGhpcy5hcnJheS5maW5kSW5kZXgoY3VycmVudCA9PiB7XG4gICAgICBpZiAocHJpb3JpdHkgPT09IGN1cnJlbnQucHJpb3JpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbHJlYWR5IGhhdmUgZW50cnkgd2l0aCB0aGlzIHByaW9yaXR5Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmlvcml0eSA8IGN1cnJlbnQucHJpb3JpdHk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzcGxpY2VJbmRleCA9IGZvdW5kSW5kZXggPT09IC0xID8gdGhpcy5hcnJheS5sZW5ndGggOiBmb3VuZEluZGV4O1xuICAgIHRoaXMuYXJyYXkuc3BsaWNlKHNwbGljZUluZGV4LCAwLCB7IHByaW9yaXR5LCB2YWx1ZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1ByaW9yaXRpemVkQXJyYXkoKTogVFtdIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheS5tYXAoZW50cnkgPT4gZW50cnkudmFsdWUpO1xuICB9XG59XG4iXX0=