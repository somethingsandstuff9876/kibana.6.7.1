"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("x-pack/plugins/apm/common/constants");
const transaction_groups_1 = require("../../transaction_groups");
async function getTopTransactions({ setup, transactionType, serviceName }) {
    const { start, end } = setup;
    const filter = [
        { term: { [constants_1.SERVICE_NAME]: serviceName } },
        { term: { [constants_1.PROCESSOR_EVENT]: 'transaction' } },
        {
            range: {
                '@timestamp': { gte: start, lte: end, format: 'epoch_millis' }
            }
        }
    ];
    if (transactionType) {
        filter.push({
            term: { [constants_1.TRANSACTION_TYPE]: transactionType }
        });
    }
    const bodyQuery = {
        bool: {
            filter
        }
    };
    return transaction_groups_1.getTransactionGroups(setup, bodyQuery);
}
exports.getTopTransactions = getTopTransactions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2dldF90b3BfdHJhbnNhY3Rpb25zL2luZGV4LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9hcG0vc2VydmVyL2xpYi90cmFuc2FjdGlvbnMvZ2V0X3RvcF90cmFuc2FjdGlvbnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBR0gsbUVBSTZDO0FBRzdDLGlFQUFnRTtBQVd6RCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsRUFDdkMsS0FBSyxFQUNMLGVBQWUsRUFDZixXQUFXLEVBQ0Y7SUFDVCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUM3QixNQUFNLE1BQU0sR0FBZTtRQUN6QixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsd0JBQVksQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3pDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQywyQkFBZSxDQUFDLEVBQUUsYUFBYSxFQUFFLEVBQUU7UUFDOUM7WUFDRSxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7YUFDL0Q7U0FDRjtLQUNGLENBQUM7SUFFRixJQUFJLGVBQWUsRUFBRTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ1YsSUFBSSxFQUFFLEVBQUUsQ0FBQyw0QkFBZ0IsQ0FBQyxFQUFFLGVBQWUsRUFBRTtTQUM5QyxDQUFDLENBQUM7S0FDSjtJQUVELE1BQU0sU0FBUyxHQUFHO1FBQ2hCLElBQUksRUFBRTtZQUNKLE1BQU07U0FDUDtLQUNGLENBQUM7SUFFRixPQUFPLHlDQUFvQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBN0JELGdEQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEVTRmlsdGVyIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQge1xuICBQUk9DRVNTT1JfRVZFTlQsXG4gIFNFUlZJQ0VfTkFNRSxcbiAgVFJBTlNBQ1RJT05fVFlQRVxufSBmcm9tICd4LXBhY2svcGx1Z2lucy9hcG0vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBTZXR1cCB9IGZyb20gJ3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5cbmltcG9ydCB7IGdldFRyYW5zYWN0aW9uR3JvdXBzIH0gZnJvbSAnLi4vLi4vdHJhbnNhY3Rpb25fZ3JvdXBzJztcbmltcG9ydCB7IElUcmFuc2FjdGlvbkdyb3VwIH0gZnJvbSAnLi4vLi4vdHJhbnNhY3Rpb25fZ3JvdXBzL3RyYW5zZm9ybSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuICBzZXR1cDogU2V0dXA7XG4gIHRyYW5zYWN0aW9uVHlwZT86IHN0cmluZztcbiAgc2VydmljZU5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgVHJhbnNhY3Rpb25MaXN0QVBJUmVzcG9uc2UgPSBJVHJhbnNhY3Rpb25Hcm91cFtdO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VG9wVHJhbnNhY3Rpb25zKHtcbiAgc2V0dXAsXG4gIHRyYW5zYWN0aW9uVHlwZSxcbiAgc2VydmljZU5hbWVcbn06IElPcHRpb25zKSB7XG4gIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gc2V0dXA7XG4gIGNvbnN0IGZpbHRlcjogRVNGaWx0ZXJbXSA9IFtcbiAgICB7IHRlcm06IHsgW1NFUlZJQ0VfTkFNRV06IHNlcnZpY2VOYW1lIH0gfSxcbiAgICB7IHRlcm06IHsgW1BST0NFU1NPUl9FVkVOVF06ICd0cmFuc2FjdGlvbicgfSB9LFxuICAgIHtcbiAgICAgIHJhbmdlOiB7XG4gICAgICAgICdAdGltZXN0YW1wJzogeyBndGU6IHN0YXJ0LCBsdGU6IGVuZCwgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJyB9XG4gICAgICB9XG4gICAgfVxuICBdO1xuXG4gIGlmICh0cmFuc2FjdGlvblR5cGUpIHtcbiAgICBmaWx0ZXIucHVzaCh7XG4gICAgICB0ZXJtOiB7IFtUUkFOU0FDVElPTl9UWVBFXTogdHJhbnNhY3Rpb25UeXBlIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGJvZHlRdWVyeSA9IHtcbiAgICBib29sOiB7XG4gICAgICBmaWx0ZXJcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGdldFRyYW5zYWN0aW9uR3JvdXBzKHNldHVwLCBib2R5UXVlcnkpO1xufVxuIl19