import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { closeItemModal } from "@/store/market/marketSlice";
import { addToCart } from "@/store/market/marketThunks";

import styles from "./MarketItemModal.module.css";

const MarketItemModal = () => {
    const dispatch = useDispatch();

    const { selectedItem } = useSelector((state) => state.market);
    const [quantity, setQuantity] = useState(1);

    const { t } = useTranslation();

    if (!selectedItem) return null;

    const handleClose = () => {
        dispatch(closeItemModal());
        setQuantity(1);
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ itemId: selectedItem._id, quantity }));
        handleClose();
    };

    const handleQuantityDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value);
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const totalPrice = selectedItem.price * quantity;

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
            >
                <button className={styles.close} onClick={handleClose}>
                    &times;
                </button>
                <h2 className={styles.title}>{selectedItem.name}</h2>
                <img
                    src={selectedItem.itemImg}
                    alt={selectedItem.name}
                    className={styles.image}
                />
                <p className={styles.description}>{selectedItem.description}</p>
                <p className={styles.price}>
                    {t("market.price")}: {totalPrice} 🪙
                </p>

                <div className={styles.quantitySection}>
                    <label className={styles.quantityLabel}>
                        {t("shared.quantity")}:
                    </label>
                    <div className={styles.quantityControls}>
                        <button
                            className={styles.quantityBtn}
                            onClick={handleQuantityDecrease}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className={styles.quantityInput}
                        />
                        <button
                            className={styles.quantityBtn}
                            onClick={handleQuantityIncrease}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.btnAdd} onClick={handleAddToCart}>
                        {t("market.addToCart")}
                    </button>
                    <button className={styles.btnClose} onClick={handleClose}>
                        {t("shared.close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { MarketItemModal };
