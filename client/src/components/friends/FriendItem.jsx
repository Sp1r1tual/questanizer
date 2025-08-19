import { useTranslation } from "react-i18next";

import { getAvatarUrl } from "@/utils/user/getAvatarUrl";

import styles from "./FriendItem.module.css";

const FriendItem = ({ friend, friendStatus, onAdd, onRemove, onAccept, onShowProfile }) => {
  const { t } = useTranslation();

  if (!friend) return null;

  const handleRemove = () => {
    if (onRemove) onRemove(friend.id);
  };

  const handleAccept = () => {
    if (onAccept) onAccept(friend.id);
  };

  const handleAdd = () => {
    if (onAdd) onAdd(friend.id);
  };

  const handleProfileClick = () => {
    if (onShowProfile) onShowProfile(friend.id);
  };

  return (
    <div className={styles.friendItem}>
      <img
        src={getAvatarUrl(friend.photoUrl)}
        alt={`${friend.username || "User"}'s avatar`}
        className={styles.friendAvatar}
        onClick={handleProfileClick}
        onError={(error) => {
          error.currentTarget.onerror = null;
          error.currentTarget.src = "/default-avatar.png";
        }}
        style={{ cursor: "pointer" }}
      />

      <div className={styles.friendInfo} onClick={handleProfileClick} style={{ cursor: "pointer" }}>
        <div className={styles.friendName}>{friend.username || friend.email || "Unknown User"}</div>
      </div>

      <div className={styles.friendActions}>
        {friendStatus === "friend" && (
          <button className={styles.removeBtn} onClick={handleRemove}>
            {t("shared.remove")}
          </button>
        )}

        {friendStatus === "received" && (
          <>
            <button className={styles.acceptBtn} onClick={handleAccept}>
              {t("friends.accept")}
            </button>
            <button className={styles.removeBtn} onClick={handleRemove}>
              {t("friends.decline")}
            </button>
          </>
        )}

        {friendStatus === "sent" && (
          <button className={styles.cancelBtn} onClick={handleRemove}>
            {t("friends.cancelRequest")}
          </button>
        )}

        {friendStatus === "none" && (
          <button className={styles.addBtn} onClick={handleAdd}>
            {t("friends.add")}
          </button>
        )}
      </div>
    </div>
  );
};

export { FriendItem };
