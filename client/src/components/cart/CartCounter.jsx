import { useSelector } from "react-redux";

import styles from "./CartCounter.module.css";

const CartCounter = () => {
  const { cart } = useSelector((state) => state.market);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={styles.counter}>
      <span className={styles.count}>{totalItems > 99 ? "99+" : totalItems}</span>
    </div>
  );
};

export { CartCounter };
