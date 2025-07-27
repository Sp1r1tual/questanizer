import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchPublicUserProfile } from "../../../store/user/publicUserProfileThunks";
import { formatDate } from "../../../utils/date/formatDate";
import { getAvatarUrl } from "../../../utils/user/getAvatarUrl";
import { Loader } from "../../ui/loaders/Loader";

import styles from "./UserProfileModal.module.css";

const PublicUserProfileModal = ({ userId, onClose }) => {
    const dispatch = useDispatch();
    const publicProfile = useSelector((state) => state.publicUser.profile);
    const isLoading = useSelector((state) => state.publicUser.isLoading);

    useEffect(() => {
        if (userId) {
            dispatch(fetchPublicUserProfile(userId));
        }
    }, [dispatch, userId]);

    if (!publicProfile || isLoading) {
        return <Loader visible={true} />;
    }

    const { username, level, health, registrationDate, bio, photoUrl } =
        publicProfile;
    const formattedDate = formatDate(registrationDate);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close profile modal"
                >
                    ×
                </button>

                <div className={styles.profileHeader}>
                    <img
                        src={getAvatarUrl(photoUrl)}
                        alt={`${username || "Username not set"}'s avatar`}
                        className={styles.avatar}
                        onError={() =>
                            console.error(
                                "Image failed to load:",
                                getAvatarUrl(photoUrl)
                            )
                        }
                    />
                    <h2 className={styles.name}>
                        {username || "Username not set"}
                    </h2>
                </div>

                <div className={styles.profileInfo}>
                    <div className={styles.infoItem}>
                        <strong className={styles.infoLabel}>Level:</strong>
                        <span className={styles.infoValue}>
                            {level ?? "N/A"}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <strong className={styles.infoLabel}>Health:</strong>
                        <span className={styles.infoValue}>
                            {health ?? "N/A"}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <strong className={styles.infoLabel}>Joined:</strong>
                        <span className={styles.infoValue}>
                            {formattedDate}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <strong className={styles.infoLabel}>Bio:</strong>
                        <span className={styles.infoValue}>
                            {bio || "No description provided"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { PublicUserProfileModal };
