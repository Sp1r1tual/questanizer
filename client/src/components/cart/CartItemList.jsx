import { CartItem } from "./CartItem";

import styles from "./CartItemList.module.css";

const CartItemList = ({
  cart,
  localQuantities,
  onIncrease,
  onDecrease,
  onRemove,
  onChangeQuantity,
}) => {
  return (
    <div className={styles.cartItems}>
      {cart.map((cartItem) => {
        const currentQuantity = localQuantities[cartItem.item._id] ?? cartItem.quantity;

        return (
          <CartItem
            key={cartItem._id}
            item={{ ...cartItem, quantity: currentQuantity }}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
            onChangeQuantity={onChangeQuantity}
          />
        );
      })}
    </div>
  );
};

export { CartItemList };
