import { marketService } from "../services/market-service.js";

const getMarketItems = async (req, res, next) => {
  try {
    const items = await marketService.getAllMarketItems(req.user.id);

    return res.json(items);
  } catch (error) {
    next(error);
  }
};

const getUserCart = async (req, res, next) => {
  try {
    const cart = await marketService.getUserCart(req.user.id);

    return res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await marketService.addToCart(req.user.id, itemId, quantity);

    return res.json(cart);
  } catch (error) {
    next(error);
  }
};

const syncCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    const cart = await marketService.syncCart(req.user.id, items);

    return res.json(cart);
  } catch (error) {
    next(error);
  }
};

const checkoutCart = async (req, res, next) => {
  try {
    const result = await marketService.checkoutCart(req.user.id);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { getMarketItems, getUserCart, addToCart, syncCart, checkoutCart };
