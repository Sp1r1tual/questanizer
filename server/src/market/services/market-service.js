import mongoose from "mongoose";
import { MarketItemModel } from "../models/market-item-model.js";
import { UserCartModel } from "../models/user-cart-model.js";
import { UserStatsModel } from "../../stats/models/user-stats-model.js";

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
            throw new Error("Item does not exist or is not available");
        }

        const cart = await UserCartModel.findOneAndUpdate(
            { user: userId },
            {
                $push: {
                    items: {
                        equipment: equipmentId,
                        quantity,
                        addedAt: new Date(),
                    },
                },
            },
            { upsert: true, new: true }
        );

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

        if (!cart) {
            throw new Error("Cart not found or item not in cart");
        }

        return cart;
    }

    async checkoutCart(userId) {
        const cart = await UserCartModel.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        const userStats = await UserStatsModel.findOne({ user: userId });

        if (!userStats) {
            throw new Error("User stats not found");
        }

        await cart.populate({
            path: "items.equipment",
            model: "MarketItem",
            select: "price",
        });

        const totalPrice = cart.items.reduce((sum, item) => {
            const price = item.equipment?.price || 0;

            return sum + price * item.quantity;
        }, 0);

        if (userStats.gold < totalPrice) {
            throw new Error("Not enough gold to complete purchase");
        }

        userStats.gold -= totalPrice;
        await userStats.save();

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
