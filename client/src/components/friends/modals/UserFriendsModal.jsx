import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserFriends } from "@/hooks/user/useUserFriends";

import { Loader } from "../../ui/loaders/Loader";
import { PublicUserProfileContent } from "../PublicUserProfileContent";
import { FriendsSearch } from "../FriendsSearch";
import { FriendsList } from "../FriendsList";
import { ChatModal } from "../../chat/modals/ChatModal";

import styles from "./UserFriendsModal.module.css";

const UserFriendsModal = ({ onClose }) => {
    const [currentView, setCurrentView] = useState("friends");
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatUserId, setChatUserId] = useState(null);

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

    const handleOpenChat = (userId) => {
        setChatUserId(userId);
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setChatUserId(null);
    };

    if (isLoading) return <Loader visible={true} />;

    return (
        <div className={styles.overlay}>
            <ChatModal
                isOpen={isChatOpen}
                onClose={handleCloseChat}
                userId={chatUserId}
            />
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
                        onOpenChat={handleOpenChat}
                    />
                )}
            </div>
        </div>
    );
};

export { UserFriendsModal };
