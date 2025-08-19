import { $api } from "@/http";

class MarketService {
  static async getMarket() {
    return await $api.get("/market");
  }

  static async getCart() {
    return await $api.get("/cart");
  }

  static async addToCart({ itemId, quantity }) {
    return await $api.patch("/cart/add", {
      itemId,
      quantity,
    });
  }

  static async checkoutCart() {
    return await $api.post("/cart/checkout");
  }

  static async syncCart(items) {
    return await $api.post("/cart/sync", { items });
  }
}

export { MarketService };
