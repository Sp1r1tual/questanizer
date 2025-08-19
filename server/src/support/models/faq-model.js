import { Schema, model } from "mongoose";

const localizedStringSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    uk: { type: String, required: true, trim: true },
    pl: { type: String, required: true, trim: true },
    es: { type: String, required: true, trim: true },
    de: { type: String, required: true, trim: true },
    jp: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const faqSchema = new Schema(
  {
    answerId: { type: Number, required: true, unique: true },
    question: { type: localizedStringSchema, required: true },
    answer: { type: localizedStringSchema, required: true },
  },
  { timestamps: true },
);

const FaqModel = model("FAQ", faqSchema);

export { FaqModel };
