import { useTranslation } from "react-i18next";

import { DotsLoader } from "../ui/loaders/DotsLoader";

import styles from "./CartItemList.module.css";

const CartItemList = ({
    cart,
    onIncrease,
    onDecrease,
    onRemove,
    onChangeQuantity,
    isLoading,
}) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <DotsLoader />;
    }

    return (
        <div className={styles.cartItems}>
            {cart.map((item) => (
                <div key={item._id} className={styles.cartItem}>
                    {item.item.itemImg && (
                        <img
                            src={item.item.itemImg}
                            alt={item.item.name || "Item"}
                            className={styles.itemImage}
                        />
                    )}

                    <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>{item.item.name}</h3>
                        <div className={styles.itemPrice}>
                            {item.item.price} 🪙
                        </div>
                    </div>

                    <div className={styles.itemControls}>
                        <div className={styles.itemActions}>
                            <div className={styles.quantityControls}>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() =>
                                        onDecrease(item.item._id, item.quantity)
                                    }
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    className={styles.quantityInput}
                                    value={item.quantity}
                                    onChange={(event) =>
                                        onChangeQuantity(
                                            item.item._id,
                                            event.target.value
                                        )
                                    }
                                />
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => onIncrease(item.item._id)}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className={styles.removeBtn}
                                onClick={() => onRemove(item.item._id)}
                            >
                                {t("shared.remove")}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export { CartItemList };
