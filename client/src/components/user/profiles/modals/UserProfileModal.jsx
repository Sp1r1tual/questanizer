import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserProfile } from "../../../../store/user/userProfileThunks";
import { EditProfileForm } from "../EditProfileForm";
import { getAvatarUrl } from "../../../../utils/user/getAvatarUrl";
import { formatDate } from "../../../../utils/date/formatDate";
import { Loader } from "../../../ui/loaders/Loader";

import styles from "./UserProfileModal.module.css";

const UserProfileModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.profile);
    const isLoading = useSelector((state) => state.user.isLoading);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    if (isLoading || !user) {
        return <Loader visible={true} />;
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

    return (
        <div
            className={styles.overlay}
            onClick={isEditing ? undefined : onClose}
        >
            <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close profile modal"
                >
                    ×
                </button>

                {isEditing ? (
                    <EditProfileForm
                        onCancel={handleCancel}
                        onSave={handleSave}
                    />
                ) : (
                    <>
                        <div className={styles.profileHeader}>
                            <img
                                src={getAvatarUrl(photoUrl)}
                                alt={`${name || "User"}'s avatar`}
                                className={styles.avatar}
                            />
                            <h2 className={styles.name}>
                                {name || "Username not set"}
                            </h2>
                        </div>

                        <div className={styles.profileInfo}>
                            <div className={styles.infoItem}>
                                <strong className={styles.infoLabel}>
                                    Level:
                                </strong>
                                <span className={styles.infoValue}>
                                    {level}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong className={styles.infoLabel}>
                                    Health:
                                </strong>
                                <span className={styles.infoValue}>
                                    {health}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong className={styles.infoLabel}>
                                    Joined:
                                </strong>
                                <span className={styles.infoValue}>
                                    {formattedDate}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong className={styles.infoLabel}>
                                    Bio:
                                </strong>
                                <span className={styles.infoValue}>
                                    {bio || "No description provided"}
                                </span>
                            </div>
                        </div>

                        <button
                            className={styles.editBtn}
                            onClick={() => setIsEditing(true)}
                            aria-label="Edit profile"
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export { UserProfileModal };
