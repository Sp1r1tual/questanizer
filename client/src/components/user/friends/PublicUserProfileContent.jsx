import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchPublicUserProfile } from "../../../store/user/publicUserProfileThunks";
import { formatDate } from "../../../utils/date/formatDate";
import { getAvatarUrl } from "../../../utils/user/getAvatarUrl";
import { Loader } from "../../ui/loaders/Loader";

import backArrow from "../../../assets/back-arrow-svgrepo-com.png";

import styles from "./PublicUserProfileModalContent.module.css";

const PublicUserProfileContent = ({ userId, onBack }) => {
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
        <>
            <button
                className={styles.backBtn}
                onClick={onBack}
                aria-label="Back to friends list"
            >
                <img src={backArrow} alt="Back" className={styles.backIcon} />
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
                    <span className={styles.infoValue}>{level ?? "N/A"}</span>
                </div>
                <div className={styles.infoItem}>
                    <strong className={styles.infoLabel}>Health:</strong>
                    <span className={styles.infoValue}>{health ?? "N/A"}</span>
                </div>
                <div className={styles.infoItem}>
                    <strong className={styles.infoLabel}>Joined:</strong>
                    <span className={styles.infoValue}>{formattedDate}</span>
                </div>
                <div className={styles.infoItem}>
                    <strong className={styles.infoLabel}>Bio:</strong>
                    <span className={styles.infoValue}>
                        {bio || "No description provided"}
                    </span>
                </div>

                <button
                    type="button"
                    className={styles.chatBtn}
                    aria-label="Send message"
                    onClick={() => alert("Chat will be available soon")}
                >
                    Send a message
                </button>
            </div>
        </>
    );
};

export { PublicUserProfileContent };
