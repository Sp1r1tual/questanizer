import { useSelector, useDispatch } from "react-redux";

import { closeInventoryItemModal } from "../../../store/user/inventorySlice";
import { applyInventoryItem } from "../../../store/user/inventoryThunks";

import styles from "./InventoryItemModal.module.css";

const InventoryItemModal = () => {
    const dispatch = useDispatch();
    const { selectedItem, isInventoryItemModalOpen } = useSelector(
        (state) => state.inventory
    );

    if (!isInventoryItemModalOpen || !selectedItem) return null;

    const handleUseItem = () => {
        dispatch(applyInventoryItem({ itemId: selectedItem.item._id }));
        dispatch(closeInventoryItemModal());
    };

    const handleClose = () => {
        dispatch(closeInventoryItemModal());
    };

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
            >
                <button className={styles.close} onClick={handleClose}>
                    ×
                </button>
                <h2 className={styles.title}>{selectedItem.item.name}</h2>
                <img
                    className={styles.image}
                    src={`/${selectedItem.item.itemImg}`}
                    alt={selectedItem.item.name}
                />
                <p className={styles.description}>
                    {selectedItem.item.description}
                </p>
                <div className={styles.price}>
                    Available: {selectedItem.quantity}
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnAdd} onClick={handleUseItem}>
                        Use
                    </button>
                    <button className={styles.btnClose} onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export { InventoryItemModal };
