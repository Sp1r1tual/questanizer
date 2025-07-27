import { FriendItem } from "./FriendItem";

import styles from "./FriendsList.module.css";

const FriendsList = ({ title, items, type, onAccept, onRemove }) => {
    return (
        <div>
            <h3 className={styles.friendsListTitle}>{title}</h3>
            {items.length > 0 ? (
                <div className={styles.friendsList}>
                    {items.map((item) => (
                        <FriendItem
                            key={item.id}
                            friend={item.user}
                            friendStatus={
                                type === "friend" ? "friend" : item.status
                            }
                            onAccept={
                                onAccept
                                    ? () => onAccept(item.user.id)
                                    : undefined
                            }
                            onRemove={() => onRemove(item.id, type)}
                        />
                    ))}
                </div>
            ) : (
                <p className={styles.noFriends}>No {title.toLowerCase()}.</p>
            )}
        </div>
    );
};

export { FriendsList };
