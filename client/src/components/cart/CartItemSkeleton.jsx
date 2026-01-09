import styles from "./CartItemSkeleton.module.css";

const CartItemSkeleton = () => {
  return (
    <div className={styles.cartItem}>
      <div className={styles.skeletonImage} />

      <div className={styles.itemInfo}>
        <div className={`${styles.skeletonText} ${styles.skeletonName}`} />
        <div className={`${styles.skeletonText} ${styles.skeletonPrice}`} />
      </div>

      <div className={styles.itemControls}>
        <div className={styles.itemActions}>
          <div className={styles.quantityControls}>
            <div className={`${styles.skeletonButton} ${styles.skeletonQuantityBtn}`} />
            <div className={`${styles.skeletonButton} ${styles.skeletonQuantityInput}`} />
            <div className={`${styles.skeletonButton} ${styles.skeletonQuantityBtn}`} />
          </div>
          <div className={`${styles.skeletonButton} ${styles.skeletonRemoveBtn}`} />
        </div>
      </div>
    </div>
  );
};

export { CartItemSkeleton };
