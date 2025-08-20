import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserFriends } from "@/hooks/user/useUserFriends";

import { Modal } from "../ui/modals/Modal";
import { Loader } from "../ui/loaders/Loader";
import { PublicUserProfileContent } from "./PublicUserProfileContent";
import { FriendsSearch } from "./FriendsSearch";
import { FriendsList } from "./FriendsList";
import { ChatView } from "../chat/ChatView";

import styles from "./UserFriendsView.module.css";

const UserFriendsView = ({ isOpen, onClose }) => {
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

  if (isLoading) return <Loader />;

  return (
    <>
      <ChatView isOpen={isChatOpen} onClose={handleCloseChat} userId={chatUserId} />

      <Modal isOpen={isOpen} onClose={onClose}>
        {currentView === "friends" ? (
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
      </Modal>
    </>
  );
};

export { UserFriendsView };
