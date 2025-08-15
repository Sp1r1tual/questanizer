import { MarketItemModel } from "../models/market-item-model.js";
import { UserCartModel } from "../models/user-cart-model.js";
import { UserStatsModel } from "../../stats/models/user-stats-model.js";
import { UserInventoryModel } from "../../user/models/user-inventory-model.js";

import { ApiError } from "../../shared/exceptions/api-error.js";
import { marketNotifications } from "../../shared/helpers/messages/notification-factory.js";
import { localizeKeys } from "../../shared/utils/localization/localize-keys.js";
import {
    localizeNestedItems,
    localizeSimpleItems,
} from "../../shared/utils/localization/localize-items.js";

class MarketService {
    async localizeItemName(userId, itemKey) {
        return await localizeKeys(userId, `shared.items.${itemKey}`);
    }

    async getAllMarketItems(userId) {
        const items = await MarketItemModel.find({ isActive: true });

        const localizedItems = await localizeSimpleItems(userId, items);
        return localizedItems;
    }

    async getUserCart(userId) {
        let cart = await UserCartModel.findOne({ user: userId }).populate(
            "items.item"
        );

        if (!cart) {
            cart = new UserCartModel({ user: userId, items: [] });
            await cart.save();
        }

        const localizedItems = await localizeNestedItems(userId, cart.items);

        return {
            ...cart.toObject(),
            items: localizedItems,
        };
    }

    async addToCart(userId, itemId, quantity = 1) {
        const marketItem = await MarketItemModel.findOne({
            _id: itemId,
            isActive: true,
        });

        if (!marketItem) {
            throw ApiError.NotFound("Item is not available");
        }

        const now = new Date();

        const newCartItem = {
            item: itemId,
            quantity,
            addedAt: now,
        };

        let cart = await UserCartModel.findOne({ user: userId });

        if (!cart) {
            cart = new UserCartModel({
                user: userId,
                items: [newCartItem],
            });

            await cart.save();
            return cart;
        }

        const existingItem = cart.items.find(
            (item) => item.item.toString() === itemId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.addedAt = now;
        } else {
            cart.items.push(newCartItem);
        }

        await cart.save();
        return cart;
    }

    async removeFromCart(userId, itemId, quantity = null) {
        const cart = await UserCartModel.findOne({ user: userId });

        const itemIndex = cart.items.findIndex(
            (item) => item.item.toString() === itemId
        );

        if (itemIndex === -1) return cart;

        if (quantity === null || cart.items[itemIndex].quantity <= quantity) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity -= quantity;
        }

        await cart.save();
        return cart;
    }

    async checkoutCart(userId) {
        const cart = await UserCartModel.findOne({ user: userId }).populate({
            path: "items.item",
            model: "MarketItem",
            select: "price",
        });

        if (!cart || cart.items.length === 0) {
            throw ApiError.BadRequest("Cart is empty");
        }

        const userStats = await UserStatsModel.findOne({ user: userId });

        const totalPrice = cart.items.reduce((sum, item) => {
            const price = item.item?.price || 0;

            return sum + price * item.quantity;
        }, 0);

        if (userStats.gold < totalPrice) {
            return {
                success: false,
                messages: [await marketNotifications.notEnoughtGold(userId)],
            };
        }

        userStats.gold -= totalPrice;
        await userStats.save();

        let inventory = await UserInventoryModel.findOne({ user: userId });

        if (!inventory) {
            inventory = new UserInventoryModel({ user: userId, items: [] });
        }

        const totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        for (const entry of cart.items) {
            const index = inventory.items.findIndex(
                (i) => i.item.toString() === entry.item._id.toString()
            );

            if (index > -1) {
                inventory.items[index].quantity += entry.quantity;
            } else {
                inventory.items.push({
                    item: entry.item._id,
                    quantity: entry.quantity,
                });
            }
        }

        await inventory.save();

        cart.items = [];
        await cart.save();

        const messages = [
            await marketNotifications.checkout(userId, totalItems),
            await marketNotifications.spent(userId, totalPrice),
        ];

        return {
            success: true,
            messages,
            spentGold: totalPrice,
        };
    }
}

const marketService = new MarketService();

export { marketService };
