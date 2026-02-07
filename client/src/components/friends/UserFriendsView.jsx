import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserFriends } from "@/hooks/user/useUserFriends";

import { Modal } from "../ui/modals/Modal";
import { PublicUserProfileContent } from "./PublicUserProfileContent";
import { FriendsSearch } from "./FriendsSearch";
import { FriendsList } from "./FriendsList";
import { ChatView } from "../chat/ChatView";

import styles from "./UserFriendsView.module.css";

const UserFriendsView = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState("friends");
  const [selectedUserId, setSelectedUserId] = useState(null);

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
    setCurrentView("chat");
  };

  const handleCloseChat = () => {
    setChatUserId(null);
    setCurrentView("profile");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {currentView === "friends" && (
        <>
          <h2 className={styles.modalTitle}>{t("friends.friendsTitle")}</h2>

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
            isLoading={isLoading}
          />

          <FriendsList
            items={requests}
            onAccept={handleAcceptRequest}
            onRemove={handleRemoveFriendOrCancel}
            onShowProfile={handleShowProfile}
            isLoading={isLoading}
          />
        </>
      )}

      {currentView === "profile" && selectedUserId && (
        <PublicUserProfileContent
          userId={selectedUserId}
          onBack={handleBackToFriends}
          onOpenChat={() => handleOpenChat(selectedUserId)}
        />
      )}

      {currentView === "chat" && chatUserId && (
        <ChatView isOpen onClose={handleCloseChat} userId={chatUserId} />
      )}
    </Modal>
  );
};

export { UserFriendsView };
