import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
});

const TokenModel = model("Token", TokenSchema);

export default TokenModel;
