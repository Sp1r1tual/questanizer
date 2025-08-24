import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal } from "../ui/modals/Modal";
import { Loader } from "../ui/loaders/Loader";
import { EditProfileForm } from "./EditProfileForm";

import { fetchUserProfile } from "@/store/user/userProfileThunks";

import { getAvatarUrl } from "@/utils/user/getAvatarUrl";
import { formatDate } from "@/utils/date/formatDate";

import styles from "./UserProfileView.module.css";

const UserProfileView = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const currentUserId = useSelector((state) => state.auth.user.id);
  const user = useSelector((state) => state.user.profile);
  const isLoading = useSelector((state) => state.user.isLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (isLoading || !user) {
    return <Loader />;
  }

  const { name, level, health, registrationDate, bio, photoUrl } = user;
  const formattedDate = formatDate(registrationDate);

  const handleSave = () => {
    setIsEditing(false);
    dispatch(fetchUserProfile());
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      {isEditing ? (
        <EditProfileForm onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <>
          <div className={styles.profileHeader}>
            <img
              src={getAvatarUrl(photoUrl)}
              alt={`${name || t("profile.noUsername")}`}
              className={styles.avatar}
            />
            <h2 className={styles.name}>{name || t("profile.noUsername")}</h2>
            <p
              className={styles.userId}
              onClick={handleCopy}
              data-copied={copied}
              data-tooltip-text={t("shared.copied")}
            >
              ID: {currentUserId}
            </p>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <strong className={styles.infoLabel}>{t("shared.level")}:</strong>
              <span className={styles.infoValue}>{level}</span>
            </div>
            <div className={styles.infoItem}>
              <strong className={styles.infoLabel}>{t("shared.health")}:</strong>
              <span className={styles.infoValue}>{health}</span>
            </div>
            <div className={styles.infoItem}>
              <strong className={styles.infoLabel}>{t("shared.joined")}:</strong>
              <span className={styles.infoValue}>{formattedDate}</span>
            </div>
            <div className={styles.infoItem}>
              <strong className={styles.infoLabel}>{t("shared.bio")}:</strong>
              <span className={styles.infoValue}>{bio || t("shared.noBio")}</span>
            </div>
          </div>

          <button
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
            aria-label={t("profile.editBtn")}
          >
            {t("profile.editBtn")}
          </button>
        </>
      )}
    </Modal>
  );
};

export { UserProfileView };
