import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useAvatar } from "@/hooks/ui/useAvatar";

import { Loader } from "../ui/loaders/Loader";

import { fetchPublicUserProfile } from "@/store/user/publicUserProfileThunks";

import { formatDate } from "@/utils/date/formatDate";

import backArrow from "@/assets/back-arrow-svgrepo-com.png";
import defaultAvatar from "@/assets/avatar-people-user-svgrepo-com.png";

import styles from "./PublicUserProfileModalContent.module.css";

const PublicUserProfileContent = ({ userId, onBack, onOpenChat }) => {
  const dispatch = useDispatch();
  const publicProfile = useSelector((state) => state.publicUser.profile);

  const { avatarSrc, handleError } = useAvatar(publicProfile?.photoUrl, defaultAvatar);

  const { t } = useTranslation();

  useEffect(() => {
    if (userId) {
      dispatch(fetchPublicUserProfile(userId));
    }
  }, [dispatch, userId]);

  if (!publicProfile) {
    return <Loader />;
  }

  const { username, level, health, registrationDate, bio } = publicProfile;
  const formattedDate = formatDate(registrationDate);

  return (
    <>
      <button className={styles.backBtn} onClick={onBack} aria-label="Back to friends list">
        <img src={backArrow} alt="Back" className={styles.backIcon} />
      </button>

      <div className={styles.profileHeader}>
        <img src={avatarSrc} alt="avatar" className={styles.avatar} onError={handleError} />
        <h2 className={styles.name}>{username || t("profile.noUsername")}</h2>
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.infoItem}>
          <strong className={styles.infoLabel}>{t("shared.level")}:</strong>
          <span className={styles.infoValue}>{level ?? "N/A"}</span>
        </div>
        <div className={styles.infoItem}>
          <strong className={styles.infoLabel}>{t("shared.health")}:</strong>
          <span className={styles.infoValue}>{health ?? "N/A"}</span>
        </div>
        <div className={styles.infoItem}>
          <strong className={styles.infoLabel}>{t("shared.joined")}:</strong>
          <span className={styles.infoValue}>{formattedDate}</span>
        </div>
        <div className={styles.infoItem}>
          <strong className={styles.infoLabel}>{t("shared.bio")}:</strong>
          <span className={styles.infoValue}>{bio || t("shared.noBio")}</span>
        </div>

        <button
          type="button"
          className={styles.chatBtn}
          aria-label={t("friends.sendMessage")}
          onClick={() => onOpenChat(userId)}
        >
          {t("friends.sendMessage")}
        </button>
      </div>
    </>
  );
};

export { PublicUserProfileContent };
