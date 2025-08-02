import { Schema, model } from "mongoose";

const marketItemSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        isActive: { type: Boolean, default: true },
        effect: { type: Map, of: Number, default: {} },
        itemImg: { type: String, default: null },
    },
    { timestamps: true }
);

const MarketItemModel = model("MarketItem", marketItemSchema);

export { MarketItemModel };
