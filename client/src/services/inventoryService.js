import { $api } from "@/http";

class InventoryService {
  static getInventory() {
    return $api.get("/inventory");
  }

  static applyInventoryItem({ itemId }) {
    return $api.patch(`/inventory/use/${itemId}`);
  }
}

export { InventoryService };
