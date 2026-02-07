import Skeleton from "react-loading-skeleton";

import styles from "./FriendItem.module.css";

const FriendItemSkeleton = () => {
  return (
    <div className={styles.friendItem}>
      <Skeleton circle width={48} height={48} className={styles.friendAvatar} />

      <div className={styles.friendInfo} style={{ width: "100%" }}>
        <Skeleton width="60%" height={16} />
      </div>

      <div className={styles.friendActions}>
        <Skeleton width={80} height={32} borderRadius={8} />
      </div>
    </div>
  );
};

export { FriendItemSkeleton };
