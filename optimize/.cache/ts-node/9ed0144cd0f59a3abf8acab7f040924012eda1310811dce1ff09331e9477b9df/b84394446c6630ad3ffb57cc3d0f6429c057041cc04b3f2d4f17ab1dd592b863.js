"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("io-ts"));
class DateFromStringType extends t.Type {
    constructor() {
        super('DateFromString', (u) => u instanceof Date, (u, c) => {
            const validation = t.string.validate(u, c);
            if (validation.isLeft()) {
                return validation;
            }
            else {
                const s = validation.value;
                const d = new Date(s);
                return isNaN(d.getTime()) ? t.failure(s, c) : t.success(d);
            }
        }, a => a.toISOString());
        // tslint:disable-next-line
        this._tag = 'DateFromISOStringType';
    }
}
exports.DateFromStringType = DateFromStringType;
exports.DateFromString = new DateFromStringType();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9jb21tb24vaW9fdHNfdHlwZXMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvY29tbW9uL2lvX3RzX3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxpREFBMkI7QUFFM0IsTUFBYSxrQkFBbUIsU0FBUSxDQUFDLENBQUMsSUFBMkI7SUFHbkU7UUFDRSxLQUFLLENBQ0gsZ0JBQWdCLEVBQ2hCLENBQUMsQ0FBQyxFQUFhLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxFQUNuQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNQLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDdkIsT0FBTyxVQUFpQixDQUFDO2FBQzFCO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUQ7UUFDSCxDQUFDLEVBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQ3JCLENBQUM7UUFqQkosMkJBQTJCO1FBQ1gsU0FBSSxHQUE0Qix1QkFBdUIsQ0FBQztJQWlCeEUsQ0FBQztDQUNGO0FBcEJELGdEQW9CQztBQUlZLFFBQUEsY0FBYyxHQUFtQixJQUFJLGtCQUFrQixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyB0IGZyb20gJ2lvLXRzJztcblxuZXhwb3J0IGNsYXNzIERhdGVGcm9tU3RyaW5nVHlwZSBleHRlbmRzIHQuVHlwZTxEYXRlLCBzdHJpbmcsIHQubWl4ZWQ+IHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIHB1YmxpYyByZWFkb25seSBfdGFnOiAnRGF0ZUZyb21JU09TdHJpbmdUeXBlJyA9ICdEYXRlRnJvbUlTT1N0cmluZ1R5cGUnO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcbiAgICAgICdEYXRlRnJvbVN0cmluZycsXG4gICAgICAodSk6IHUgaXMgRGF0ZSA9PiB1IGluc3RhbmNlb2YgRGF0ZSxcbiAgICAgICh1LCBjKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0LnN0cmluZy52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKHZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsaWRhdGlvbiBhcyBhbnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcyA9IHZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKHMpO1xuICAgICAgICAgIHJldHVybiBpc05hTihkLmdldFRpbWUoKSkgPyB0LmZhaWx1cmUocywgYykgOiB0LnN1Y2Nlc3MoZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhID0+IGEudG9JU09TdHJpbmcoKVxuICAgICk7XG4gIH1cbn1cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBEYXRlRnJvbVN0cmluZyBleHRlbmRzIERhdGVGcm9tU3RyaW5nVHlwZSB7fVxuXG5leHBvcnQgY29uc3QgRGF0ZUZyb21TdHJpbmc6IERhdGVGcm9tU3RyaW5nID0gbmV3IERhdGVGcm9tU3RyaW5nVHlwZSgpO1xuIl19