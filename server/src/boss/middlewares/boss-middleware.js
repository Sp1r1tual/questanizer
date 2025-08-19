import { BossModel } from "../models/boss-model.js";

const bossMiddleware = async (req, res, next) => {
  try {
    req.boss = await BossModel.findOne({ user: req.user.id });
    next();
  } catch (error) {
    next(error);
  }
};

export { bossMiddleware };
