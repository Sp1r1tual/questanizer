import { Schema, model } from "mongoose";

const userStatsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    hp: { type: Number, default: 100 },
    maxHp: { type: Number, default: 100 },
    xpToNextLevel: { type: Number, default: 100 },
    gold: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const UserStatsModel = model("UserStats", userStatsSchema);

export { UserStatsModel };
