import styles from "./BossStats.module.css";
import skeletonStyles from "./BossStatsSkeleton.module.css";

const BossStatsSkeleton = () => {
  return (
    <div className={styles.bossStats}>
      <div
        className={`${styles.bossName} ${skeletonStyles.skeleton} ${skeletonStyles.bossNameSkeleton}`}
      />

      <div className={styles.statsContainer}>
        <div className={styles.statBlock}>
          <div
            className={`${styles.statText} ${skeletonStyles.skeleton} ${skeletonStyles.statTextSkeleton}`}
          />
          <div className={`${styles.progressBar} ${skeletonStyles.skeleton}`} />
        </div>

        <div className={styles.statBlock}>
          <div
            className={`${styles.statText} ${skeletonStyles.skeleton} ${skeletonStyles.statTextSkeleton}`}
          />
          <div className={`${styles.progressBar} ${skeletonStyles.skeleton}`} />
        </div>

        <div className={styles.statBlock}>
          <div
            className={`${styles.statText} ${skeletonStyles.skeleton} ${skeletonStyles.statTextSkeleton}`}
          />
        </div>
      </div>
    </div>
  );
};

export { BossStatsSkeleton };
