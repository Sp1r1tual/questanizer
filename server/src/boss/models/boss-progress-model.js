import { Schema, model } from "mongoose";

const bossProgressSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        lastDefeatedBossId: { type: Number, default: 0 },
        currentAvailableBossId: { type: Number, default: 1 },
        totalBossesDefeated: { type: Number, default: 0 },
        totalExpFromBosses: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const BossProgressModel = model("UserBossProgress", bossProgressSchema);

export { BossProgressModel };
