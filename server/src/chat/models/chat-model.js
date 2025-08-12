import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const MessageModel = model("Message", messageSchema);

export { MessageModel };
