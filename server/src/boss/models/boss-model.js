import { Schema, model } from "mongoose";

const bossSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bossId: { type: Number, default: null },
    bossName: { type: String, default: null },
    healthPoints: { type: Number, default: 0 },
    maxHealthPoints: { type: Number, default: 0 },
    bossPower: { type: Number, default: 0 },
    bossRewardExp: { type: Number, default: 0 },
    bossRageBar: { type: Number, default: 0 },
    rage: { type: Number, default: 0, min: 0 },
    bossImg: { type: String, default: null },
    alreadyRagedTaskIds: { type: [String], default: [] },
    currentBossIndex: { type: Number, default: 0 },
    spawnedAt: { type: Date, default: Date.now },
});

const BossModel = model("Boss", bossSchema);

export default BossModel;
