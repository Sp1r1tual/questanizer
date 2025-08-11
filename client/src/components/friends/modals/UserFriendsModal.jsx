import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserFriends } from "@/hooks/user/useUserFriends";

import { Loader } from "../../ui/loaders/Loader";
import { PublicUserProfileContent } from "../PublicUserProfileContent";
import { FriendsSearch } from "../FriendsSearch";
import { FriendsList } from "../FriendsList";

import styles from "./UserFriendsModal.module.css";

const UserFriendsModal = ({ onClose }) => {
    const [currentView, setCurrentView] = useState("friends");
    const [selectedUserId, setSelectedUserId] = useState(null);

    const { t } = useTranslation();

    const {
        isLoading,
        currentUser,
        friends,
        requests,
        getFriendStatus,
        handleAddFriend,
        handleAcceptRequest,
        handleRemoveFriendOrCancel,
    } = useUserFriends();

    const handleShowProfile = (userId) => {
        setSelectedUserId(userId);
        setCurrentView("profile");
    };

    const handleBackToFriends = () => {
        setCurrentView("friends");
        setSelectedUserId(null);
    };

    if (isLoading) return <Loader visible={true} />;

    return (
        <div className={styles.overlay}>
            <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>

                {currentView === "friends" ? (
                    <>
                        <h2 className={styles.modalTitle}>
                            {" "}
                            {t("friends.friendsTitle")}
                        </h2>

                        <FriendsSearch
                            currentUser={currentUser}
                            getFriendStatus={getFriendStatus}
                            onAdd={handleAddFriend}
                            onAccept={handleAcceptRequest}
                            onRemove={handleRemoveFriendOrCancel}
                            onShowProfile={handleShowProfile}
                        />

                        <FriendsList
                            items={friends}
                            onRemove={handleRemoveFriendOrCancel}
                            onShowProfile={handleShowProfile}
                        />

                        <FriendsList
                            items={requests}
                            onAccept={handleAcceptRequest}
                            onRemove={handleRemoveFriendOrCancel}
                            onShowProfile={handleShowProfile}
                        />
                    </>
                ) : (
                    <PublicUserProfileContent
                        userId={selectedUserId}
                        onBack={handleBackToFriends}
                    />
                )}
            </div>
        </div>
    );
};

export { UserFriendsModal };
