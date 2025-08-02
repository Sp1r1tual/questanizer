import { marketService } from "../services/market-service.js";

const getMarketItems = async (req, res, next) => {
    try {
        const items = await marketService.getAllMarketItems();

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
        const cart = await marketService.addToCart(
            req.user.id,
            itemId,
            quantity
        );

        return res.json(cart);
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cart = await marketService.removeFromCart(
            userId,
            itemId,
            quantity
        );

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

export { getMarketItems, getUserCart, addToCart, removeFromCart, checkoutCart };
