import { $api } from "@/http";

class MarketService {
  static getMarket() {
    return $api.get("/market");
  }

  static getCart() {
    return $api.get("/cart");
  }

  static addToCart({ itemId, quantity }) {
    return $api.patch("/cart/add", {
      itemId,
      quantity,
    });
  }

  static checkoutCart() {
    return $api.post("/cart/checkout");
  }

  static syncCart(items) {
    return $api.post("/cart/sync", { items });
  }
}

export { MarketService };
