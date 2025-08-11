import { $api } from "@/http";

class InventoryService {
    static async getInventory() {
        return $api.get("/inventory");
    }

    static async applyInventoryItem({ itemId }) {
        return $api.patch(`/inventory/use/${itemId}`);
    }
}

export { InventoryService };
