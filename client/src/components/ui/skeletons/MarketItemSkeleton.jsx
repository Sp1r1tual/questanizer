import styles from "./MarketItemSkeleton.module.css";

const MarketItemSkeleton = ({ showAmount = true }) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.skeletonText} ${styles.skeletonTitle}`} />
      <div className={styles.skeletonImage} />

      <div className={styles.infoWrapper}>
        <div className={styles.skeletonPriceWrapper}>
          <div className={`${styles.skeletonText} ${styles.skeletonPrice}`} />
        </div>

        {showAmount && (
          <div className={styles.skeletonAmountWrapper}>
            <div className={`${styles.skeletonText} ${styles.skeletonAmount}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export { MarketItemSkeleton };
