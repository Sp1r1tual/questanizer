import { useState } from "react";
import { useUserFriends } from "../../../hooks/user/useUserFriends";

import { PublicUserProfileContent } from "./PublicUserProfileContent";
import { FriendsSearch } from "./FriendsSearch";
import { FriendsList } from "./FriendsList";
import { Loader } from "../../ui/loaders/Loader";

import styles from "./UserFriendsModal.module.css";

const UserFriendsModal = ({ onClose }) => {
    const [currentView, setCurrentView] = useState("friends");
    const [selectedUserId, setSelectedUserId] = useState(null);

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
                        <h2 className={styles.modalTitle}>Friends</h2>

                        <FriendsSearch
                            currentUser={currentUser}
                            getFriendStatus={getFriendStatus}
                            onAdd={handleAddFriend}
                            onAccept={handleAcceptRequest}
                            onRemove={handleRemoveFriendOrCancel}
                            onShowProfile={handleShowProfile}
                        />

                        <FriendsList
                            type="friend"
                            items={friends}
                            title="Friends"
                            onRemove={handleRemoveFriendOrCancel}
                            onShowProfile={handleShowProfile}
                        />

                        <FriendsList
                            type="request"
                            items={requests}
                            title="Friend Requests"
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
