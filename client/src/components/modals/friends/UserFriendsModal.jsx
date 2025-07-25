import useUserFriends from "../../../hooks/user/useUserFriends";

import FriendsSearch from "./FriendsSearch";
import FriendsList from "./FriendsList";
import Loader from "../../ui/Loader";

import styles from "./UserFriendsModal.module.css";

const UserFriendsModal = ({ onClose }) => {
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

    if (isLoading) return <Loader visible={true} />;

    return (
        <div className={styles.overlay}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>

                <h2 className={styles.modalTitle}>Friends</h2>

                <FriendsSearch
                    currentUser={currentUser}
                    getFriendStatus={getFriendStatus}
                    onAdd={handleAddFriend}
                    onAccept={handleAcceptRequest}
                    onRemove={handleRemoveFriendOrCancel}
                />

                <FriendsList
                    type="friend"
                    items={friends}
                    title="Friends"
                    onRemove={handleRemoveFriendOrCancel}
                />

                <FriendsList
                    type="request"
                    items={requests}
                    title="Friend Requests"
                    onAccept={handleAcceptRequest}
                    onRemove={handleRemoveFriendOrCancel}
                />
            </div>
        </div>
    );
};

export default UserFriendsModal;
