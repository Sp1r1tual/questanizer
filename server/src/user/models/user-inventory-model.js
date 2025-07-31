import { Schema, model } from "mongoose";

const userInventorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: "MarketItem",
                required: true,
            },
            quantity: { type: Number, default: 1 },
        },
        { timestamps: true },
    ],
});

const UserInventoryModel = model("Inventory", userInventorySchema);

export { UserInventoryModel };
