import { Schema, model } from "mongoose";

const userCartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            equipment: {
                type: Schema.Types.ObjectId,
                ref: "MarketItem",
                required: true,
            },
            quantity: { type: Number, default: 1 },
            addedAt: { type: Date, default: Date.now },
        },
    ],
});

const UserCartModel = model("Cart", userCartSchema);

export { UserCartModel };
