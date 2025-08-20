import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal } from "@/components/ui/modals/Modal";

import { closeInventoryItemModal } from "@/store/user/inventorySlice";

import { applyInventoryItem } from "@/store/user/inventoryThunks";

import styles from "./InventoryItemView.module.css";

const InventoryItemView = () => {
  const dispatch = useDispatch();

  const { selectedItem, isInventoryItemModalOpen } = useSelector((state) => state.inventory);

  const { t } = useTranslation();

  const handleUseItem = () => {
    dispatch(applyInventoryItem({ itemId: selectedItem.item._id }));
    dispatch(closeInventoryItemModal());
  };

  const handleClose = () => {
    dispatch(closeInventoryItemModal());
  };

  if (!selectedItem) return null;

  return (
    <Modal isOpen={isInventoryItemModalOpen} onClose={handleClose}>
      <h2 className={styles.title}>{selectedItem.item.name}</h2>
      <img
        className={styles.image}
        src={`/${selectedItem.item.itemImg}`}
        alt={selectedItem.item.name}
      />
      <p className={styles.description}>{selectedItem.item.description}</p>
      <div className={styles.price}>
        {t("shared.quantity")}: {selectedItem.quantity}
      </div>
      <div className={styles.actions}>
        <button className={styles.btnAdd} onClick={handleUseItem}>
          {t("inventory.use")}
        </button>
        <button className={styles.btnClose} onClick={handleClose}>
          {t("shared.close")}
        </button>
      </div>
    </Modal>
  );
};

export { InventoryItemView };
