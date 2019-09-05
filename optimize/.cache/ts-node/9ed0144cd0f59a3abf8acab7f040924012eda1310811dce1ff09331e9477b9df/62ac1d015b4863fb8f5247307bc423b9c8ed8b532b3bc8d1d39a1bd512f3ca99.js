"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
const configuration_blocks_1 = require("../../common/constants/configuration_blocks");
class ConfigurationBlocksLib {
    constructor(adapter, tags) {
        this.adapter = adapter;
        this.tags = tags;
    }
    async getForTags(user, tagIds, page = 0, size = 10) {
        if ((page + 1) * size > 10000) {
            throw new Error('System error, too many results. To get all results, request page: -1');
        }
        const result = await this.adapter.getForTags(user, tagIds, page, size);
        return { ...result, error: null };
    }
    async delete(user, ids) {
        return await this.adapter.delete(user, ids);
    }
    async save(user, block) {
        const tags = await this.tags.getWithIds(user, [block.tag]);
        const tag = tags[0];
        if (!tag) {
            return {
                error: 'Invalid tag, tag not found',
            };
        }
        if (!tag.hasConfigurationBlocksTypes) {
            tag.hasConfigurationBlocksTypes = [];
        }
        if (!block.id &&
            configuration_blocks_1.UNIQUENESS_ENFORCING_TYPES.includes(block.type) &&
            tag.hasConfigurationBlocksTypes.some((type) => configuration_blocks_1.UNIQUENESS_ENFORCING_TYPES.includes(type))) {
            return {
                error: 'Block is of type that already exists on this tag, and only one config of this type can exist at a time on a beat. Config not saved',
            };
        }
        if (configuration_blocks_1.UNIQUENESS_ENFORCING_TYPES.includes(block.type)) {
            tag.hasConfigurationBlocksTypes.push(block.type);
            await this.tags.upsertTag(user, tag);
        }
        const ids = await this.adapter.create(user, [block]);
        return {
            success: true,
            blockID: ids[0],
        };
    }
}
exports.ConfigurationBlocksLib = ConfigurationBlocksLib;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL2NvbmZpZ3VyYXRpb25fYmxvY2tzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9iZWF0c19tYW5hZ2VtZW50L3NlcnZlci9saWIvY29uZmlndXJhdGlvbl9ibG9ja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsc0ZBQXlGO0FBTXpGLE1BQWEsc0JBQXNCO0lBQ2pDLFlBQ21CLE9BQWtDLEVBQ2xDLElBQWtCO1FBRGxCLFlBQU8sR0FBUCxPQUFPLENBQTJCO1FBQ2xDLFNBQUksR0FBSixJQUFJLENBQWM7SUFDbEMsQ0FBQztJQUVHLEtBQUssQ0FBQyxVQUFVLENBQ3JCLElBQW1CLEVBQ25CLE1BQWdCLEVBQ2hCLE9BQWUsQ0FBQyxFQUNoQixPQUFlLEVBQUU7UUFFakIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztTQUN6RjtRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFdkUsT0FBTyxFQUFFLEdBQUcsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFtQixFQUFFLEdBQWE7UUFDcEQsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFtQixFQUFFLEtBQXlCO1FBQzlELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixPQUFPO2dCQUNMLEtBQUssRUFBRSw0QkFBNEI7YUFDcEMsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRTtZQUNwQyxHQUFHLENBQUMsMkJBQTJCLEdBQUcsRUFBRSxDQUFDO1NBQ3RDO1FBRUQsSUFDRSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ1QsaURBQTBCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDL0MsR0FBRyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFLENBQ3BELGlEQUEwQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FDMUMsRUFDRDtZQUNBLE9BQU87Z0JBQ0wsS0FBSyxFQUNILG9JQUFvSTthQUN2SSxDQUFDO1NBQ0g7UUFFRCxJQUFJLGlEQUEwQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkQsR0FBRyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDdEM7UUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDaEIsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQS9ERCx3REErREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgVU5JUVVFTkVTU19FTkZPUkNJTkdfVFlQRVMgfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzL2NvbmZpZ3VyYXRpb25fYmxvY2tzJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25CbG9jayB9IGZyb20gJy4uLy4uL2NvbW1vbi9kb21haW5fdHlwZXMnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbkJsb2NrQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcnMvY29uZmlndXJhdGlvbl9ibG9ja3MvYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBGcmFtZXdvcmtVc2VyIH0gZnJvbSAnLi9hZGFwdGVycy9mcmFtZXdvcmsvYWRhcHRlcl90eXBlcyc7XG5pbXBvcnQgeyBDTVRhZ3NEb21haW4gfSBmcm9tICcuL3RhZ3MnO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkJsb2Nrc0xpYiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYWRhcHRlcjogQ29uZmlndXJhdGlvbkJsb2NrQWRhcHRlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRhZ3M6IENNVGFnc0RvbWFpblxuICApIHt9XG5cbiAgcHVibGljIGFzeW5jIGdldEZvclRhZ3MoXG4gICAgdXNlcjogRnJhbWV3b3JrVXNlcixcbiAgICB0YWdJZHM6IHN0cmluZ1tdLFxuICAgIHBhZ2U6IG51bWJlciA9IDAsXG4gICAgc2l6ZTogbnVtYmVyID0gMTBcbiAgKSB7XG4gICAgaWYgKChwYWdlICsgMSkgKiBzaXplID4gMTAwMDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3lzdGVtIGVycm9yLCB0b28gbWFueSByZXN1bHRzLiBUbyBnZXQgYWxsIHJlc3VsdHMsIHJlcXVlc3QgcGFnZTogLTEnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmFkYXB0ZXIuZ2V0Rm9yVGFncyh1c2VyLCB0YWdJZHMsIHBhZ2UsIHNpemUpO1xuXG4gICAgcmV0dXJuIHsgLi4ucmVzdWx0LCBlcnJvcjogbnVsbCB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlbGV0ZSh1c2VyOiBGcmFtZXdvcmtVc2VyLCBpZHM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYWRhcHRlci5kZWxldGUodXNlciwgaWRzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzYXZlKHVzZXI6IEZyYW1ld29ya1VzZXIsIGJsb2NrOiBDb25maWd1cmF0aW9uQmxvY2spIHtcbiAgICBjb25zdCB0YWdzID0gYXdhaXQgdGhpcy50YWdzLmdldFdpdGhJZHModXNlciwgW2Jsb2NrLnRhZ10pO1xuICAgIGNvbnN0IHRhZyA9IHRhZ3NbMF07XG5cbiAgICBpZiAoIXRhZykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3I6ICdJbnZhbGlkIHRhZywgdGFnIG5vdCBmb3VuZCcsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghdGFnLmhhc0NvbmZpZ3VyYXRpb25CbG9ja3NUeXBlcykge1xuICAgICAgdGFnLmhhc0NvbmZpZ3VyYXRpb25CbG9ja3NUeXBlcyA9IFtdO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFibG9jay5pZCAmJlxuICAgICAgVU5JUVVFTkVTU19FTkZPUkNJTkdfVFlQRVMuaW5jbHVkZXMoYmxvY2sudHlwZSkgJiZcbiAgICAgIHRhZy5oYXNDb25maWd1cmF0aW9uQmxvY2tzVHlwZXMuc29tZSgodHlwZTogc3RyaW5nKSA9PlxuICAgICAgICBVTklRVUVORVNTX0VORk9SQ0lOR19UWVBFUy5pbmNsdWRlcyh0eXBlKVxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3I6XG4gICAgICAgICAgJ0Jsb2NrIGlzIG9mIHR5cGUgdGhhdCBhbHJlYWR5IGV4aXN0cyBvbiB0aGlzIHRhZywgYW5kIG9ubHkgb25lIGNvbmZpZyBvZiB0aGlzIHR5cGUgY2FuIGV4aXN0IGF0IGEgdGltZSBvbiBhIGJlYXQuIENvbmZpZyBub3Qgc2F2ZWQnLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoVU5JUVVFTkVTU19FTkZPUkNJTkdfVFlQRVMuaW5jbHVkZXMoYmxvY2sudHlwZSkpIHtcbiAgICAgIHRhZy5oYXNDb25maWd1cmF0aW9uQmxvY2tzVHlwZXMucHVzaChibG9jay50eXBlKTtcbiAgICAgIGF3YWl0IHRoaXMudGFncy51cHNlcnRUYWcodXNlciwgdGFnKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZHMgPSBhd2FpdCB0aGlzLmFkYXB0ZXIuY3JlYXRlKHVzZXIsIFtibG9ja10pO1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgYmxvY2tJRDogaWRzWzBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==