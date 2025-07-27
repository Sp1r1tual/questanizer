import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true },
        isActivated: { type: Boolean, default: false },
        activationLink: { type: String },
        username: {
            type: String,
            unique: true,
            sparse: true,
            minlength: 3,
            maxlength: 32,
            match: /^[a-zA-Z0-9_.-]*$/,
            lowercase: true,
            trim: true,
        },
        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },
        photoUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

UserSchema.index({ username: "text" });

const UserModel = model("User", UserSchema);

export { UserModel };
