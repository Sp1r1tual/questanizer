import { $api } from "../http";

class MarketService {
    static async getMarket() {
        return $api.get("/market");
    }

    static async getCart() {
        return $api.get("/cart");
    }

    static async addToCart({ itemId, quantity }) {
        return $api.patch("/cart/add", {
            itemId,
            quantity,
        });
    }

    static async checkoutCart() {
        return $api.post("/cart/checkout");
    }

    static async removeFromCart({ itemId, quantity }) {
        return $api.patch(`/cart/remove/${itemId}`, { quantity });
    }
}

export { MarketService };
