import { useDispatch } from "react-redux";

import { openInventoryItemModal } from "../../store/user/inventorySlice";

import styles from "./InventoryItem.module.css";

const InventoryItem = ({ item }) => {
    const dispatch = useDispatch();

    const handleViewDetails = () => {
        dispatch(openInventoryItemModal(item));
    };

    return (
        <div className={styles.card} onClick={handleViewDetails}>
            <img
                className={styles.image}
                src={`/${item.item.itemImg}`}
                alt={item.item.name}
            />
            <h3 className={styles.title}>{item.item.name}</h3>
            <p className={styles.quantity}>Quantity: {item.quantity}</p>
        </div>
    );
};

export { InventoryItem };
