import mongoose from "mongoose";
import { MarketItemModel } from "../models/market-item-model.js";
import { UserCartModel } from "../models/user-cart-model.js";
import { UserStatsModel } from "../../stats/models/user-stats-model.js";
import { UserInventoryModel } from "../../user/models/user-inventory-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

class MarketService {
    async getAllMarketItems() {
        return MarketItemModel.find({ isActive: true });
    }

    async getUserCart(userId) {
        return UserCartModel.findOne({ user: userId }).populate(
            "items.equipment"
        );
    }

    async addToCart(userId, equipmentId, quantity = 1) {
        const marketItem = await MarketItemModel.findOne({
            _id: equipmentId,
            isActive: true,
        });

        if (!marketItem) {
            throw ApiError.NotFound("Item is not available");
        }

        const now = new Date();

        const newCartItem = {
            equipment: equipmentId,
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
            (item) => item.equipment.toString() === equipmentId
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

    async removeFromCart(userId, equipmentId) {
        const cart = await UserCartModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: {
                        equipment: new mongoose.Types.ObjectId(equipmentId),
                    },
                },
            },
            { new: true }
        );

        return cart;
    }

    async checkoutCart(userId) {
        const cart = await UserCartModel.findOne({ user: userId }).populate({
            path: "items.equipment",
            model: "MarketItem",
            select: "price",
        });

        if (!cart || cart.items.length === 0) {
            throw ApiError.BadRequest("Cart is empty");
        }

        const userStats = await UserStatsModel.findOne({ user: userId });

        const totalPrice = cart.items.reduce((sum, item) => {
            const price = item.equipment?.price || 0;

            return sum + price * item.quantity;
        }, 0);

        if (userStats.gold < totalPrice) {
            throw ApiError.BadRequest("Not enough gold to complete purchase");
        }

        userStats.gold -= totalPrice;
        await userStats.save();

        let inventory = await UserInventoryModel.findOne({ user: userId });

        if (!inventory) {
            inventory = new UserInventoryModel({ user: userId, items: [] });
        }

        for (const entry of cart.items) {
            const index = inventory.items.findIndex(
                (i) => i.item.toString() === entry.equipment._id.toString()
            );

            if (index > -1) {
                inventory.items[index].quantity += entry.quantity;
            } else {
                inventory.items.push({
                    item: entry.equipment._id,
                    quantity: entry.quantity,
                });
            }
        }

        await inventory.save();

        cart.items = [];
        await cart.save();

        return {
            success: true,
            message: "Purchase completed",
            spentGold: totalPrice,
        };
    }
}

const marketService = new MarketService();

export { marketService };
