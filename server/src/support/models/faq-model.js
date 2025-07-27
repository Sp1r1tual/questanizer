import { Schema, model } from "mongoose";

const faqSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        answer: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const FaqModel = model("FAQ", faqSchema);

export default FaqModel;
