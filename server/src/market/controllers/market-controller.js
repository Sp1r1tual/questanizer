import { marketService } from "../services/market-service.js";

const getAllMarkets = async (req, res, next) => {
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
        const { equipmentId, quantity } = req.body;
        const cart = await marketService.addToCart(
            req.user.id,
            equipmentId,
            quantity
        );

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const equipmentId = req.params.equipmentId;

        const cart = await marketService.removeFromCart(userId, equipmentId);
        return res.status(200).json(cart);
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

export { getAllMarkets, getUserCart, addToCart, removeFromCart, checkoutCart };
