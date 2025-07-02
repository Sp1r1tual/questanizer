import { Schema, model } from "mongoose";

const ResetTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resetToken: {
        type: String,
        required: true,
        unique: true,
    },
});

const ResetTokenModel = model("ResetToken", ResetTokenSchema);

export default ResetTokenModel;
