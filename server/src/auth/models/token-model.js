import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    refreshToken: { type: String, required: true },
});

const TokenModel = model("Token", TokenSchema);

export { TokenModel };
