import { UserInventoryModel } from "../models/user-inventory-model.js";
import { MarketItemModel } from "../../market/models/market-item-model.js";
import { UserStatsModel } from "../../stats/models/user-stats-model.js";
import { handleItemEffects } from "../handlers/item-effect-handlers.js";
import { normalizeMessages } from "../../shared/utils/notifications/notifications.js";
import { inventoryNotifications } from "../../shared/helpers/messages/notification-factory.js";
import { localizeKeys } from "../../shared/utils/localization/localize-keys.js";
import { localizeNestedItems } from "../../shared/utils/localization/localize-items.js";

class UserInventoryService {
    async localizeItemName(userId, itemKey) {
        return await localizeKeys(userId, `shared.items.${itemKey}`);
    }

    async getInventory(userId) {
        const inventory = await UserInventoryModel.findOne({
            user: userId,
        }).populate("items.item");

        const localizedItems = await localizeNestedItems(
            userId,
            inventory.items
        );

        return {
            ...inventory.toObject(),
            items: localizedItems,
        };
    }

    async useItem(userId, itemId) {
        const inventory = await UserInventoryModel.findOne({ user: userId });

        const itemEntryIndex = inventory.items.findIndex(
            (entry) => entry.item.toString() === itemId
        );

        const item = await MarketItemModel.findById(itemId);

        const userStats = await UserStatsModel.findOne({ user: userId });

        if (item.type === "potion" && userStats.hp >= userStats.maxHp) {
            return {
                success: false,
                messages: [await inventoryNotifications.fullHp(userId)],
                currentHp: userStats.hp,
                effects: [],
            };
        }

        const effectResults = await handleItemEffects({
            userStats,
            effect: item.effect,
            userId,
        });
        const normalizedEffects = normalizeMessages(effectResults);

        inventory.items[itemEntryIndex].quantity -= 1;

        if (inventory.items[itemEntryIndex].quantity <= 0) {
            inventory.items.splice(itemEntryIndex, 1);
        }

        await userStats.save();
        await inventory.save();

        const localizedItemName = await this.localizeItemName(
            userId,
            item.name
        );

        return {
            success: true,
            messages: [
                await inventoryNotifications.useItem(userId, localizedItemName),
            ],
            currentHp: userStats.hp,
            effects: normalizedEffects,
        };
    }
}

const userInventoryService = new UserInventoryService();

export { userInventoryService };
