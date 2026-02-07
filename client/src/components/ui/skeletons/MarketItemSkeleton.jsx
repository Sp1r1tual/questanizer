import styles from "./MarketItemSkeleton.module.css";

const MarketItemSkeleton = ({ showAmount = true }) => {
  return (
    <div className={styles.card}>
      <div className={styles.skeletonTitle} />

      <div className={styles.imageContainer}>
        <div className={styles.skeletonImage} />
      </div>

      <div className={styles.skeletonPrice} />

      {showAmount && <div className={styles.skeletonAmount} />}
    </div>
  );
};

export { MarketItemSkeleton };
