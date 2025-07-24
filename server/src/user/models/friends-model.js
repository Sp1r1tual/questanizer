import { Schema, model } from "mongoose";

const friendsSchema = new Schema(
    {
        requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
        recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
    },
    { timestamps: true }
);

friendsSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const FriendsModel = model("Friends", friendsSchema);

export default FriendsModel;
