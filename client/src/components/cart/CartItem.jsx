import { useTranslation } from "react-i18next";

import styles from "./CartItem.module.css";

const CartItem = ({ item, onIncrease, onDecrease, onRemove, onChangeQuantity }) => {
  const { t } = useTranslation();

  const quantity = item.quantity;

  const handleBlur = (event) => {
    let parsed = parseInt(event.target.value, 10);

    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (parsed > 100) parsed = 100;

    onChangeQuantity(item.item._id, parsed);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onDecrease(item.item._id);
    } else {
      onRemove(item.item._id);
    }
  };

  const handleIncrease = () => {
    onIncrease(item.item._id);
  };

  return (
    <div className={styles.cartItem}>
      {item.item.itemImg && (
        <img src={item.item.itemImg} alt={item.item.name || "Item"} className={styles.itemImage} />
      )}

      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{item.item.name}</h3>
        <div className={styles.itemPrice}>{item.item.price} 🪙</div>
      </div>

      <div className={styles.itemControls}>
        <div className={styles.itemActions}>
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityBtn}
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              −
            </button>

            <input
              type="number"
              className={styles.quantityInput}
              value={quantity}
              onChange={(event) => onChangeQuantity(item.item._id, event.target.value)}
              onBlur={handleBlur}
              min={1}
              max={100}
            />

            <button
              className={styles.quantityBtn}
              onClick={handleIncrease}
              disabled={quantity >= 100}
            >
              +
            </button>
          </div>

          <button className={styles.removeBtn} onClick={() => onRemove(item.item._id)}>
            {t("shared.remove")}
          </button>
        </div>
      </div>
    </div>
  );
};

export { CartItem };
