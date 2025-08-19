import { userInventoryService } from "../services/user-inventory-service.js";

const getUserInventory = async (req, res, next) => {
  try {
    const inventory = await userInventoryService.getInventory(req.user.id);

    return res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const useUserInventoryItem = async (req, res, next) => {
  try {
    const result = await userInventoryService.useItem(req.user.id, req.params.itemId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { getUserInventory, useUserInventoryItem };
