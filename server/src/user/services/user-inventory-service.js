import { UserInventoryModel } from "../models/user-inventory-model.js";
import { MarketItemModel } from "../../market/models/market-item-model.js";
import { UserStatsModel } from "../../stats/models/user-stats-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";
import { handleItemEffects } from "../handlers/item-effect-handlers.js";
import { normalizeMessages } from "../../shared/utils/notifications/notifications.js";
import {
    success,
    error,
} from "../../shared/utils/notifications/notifications.js";

class UserInventoryService {
    async getInventory(userId) {
        const inventory = await UserInventoryModel.findOne({
            user: userId,
        }).populate("items.item");

        if (!inventory) {
            throw ApiError.NotFound("Inventory not found");
        }

        return inventory;
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
                messages: [error("Cannot use potion: HP is already full")],
                currentHp: userStats.hp,
                effects: [],
            };
        }

        const effectResults = await handleItemEffects({
            userStats,
            effect: item.effect,
        });
        const normalizedEffects = normalizeMessages(effectResults);

        inventory.items[itemEntryIndex].quantity -= 1;

        if (inventory.items[itemEntryIndex].quantity <= 0) {
            inventory.items.splice(itemEntryIndex, 1);
        }

        await userStats.save();
        await inventory.save();

        return {
            success: true,
            messages: [success(`Used ${item.name}`)],
            currentHp: userStats.hp,
            effects: normalizedEffects,
        };
    }
}

const userInventoryService = new UserInventoryService();

export { userInventoryService };
