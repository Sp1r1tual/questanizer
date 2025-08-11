import { useTranslation } from "react-i18next";

import { FriendItem } from "./FriendItem";

import styles from "./FriendsList.module.css";

const FriendsList = ({ items, onAccept, onRemove, onShowProfile }) => {
    const { t } = useTranslation();

    const isRequestList = !!onAccept;
    const keys = isRequestList
        ? {
              title: "requestsSectionTitle",
              noItems: "friendsRequests",
              type: "request",
          }
        : { title: "friendsSectionTitle", noItems: "friends", type: "friend" };

    return (
        <div>
            <h3 className={styles.friendsListTitle}>
                {t(`friends.sectionTitle.${keys.title}`)}
            </h3>
            {items.length > 0 ? (
                <div className={styles.friendsList}>
                    {items.map((item) => (
                        <FriendItem
                            key={item.id}
                            friend={item.user}
                            relationId={item.id}
                            friendStatus={
                                isRequestList ? item.status : "friend"
                            }
                            onAccept={
                                onAccept
                                    ? () => onAccept(item.user.id)
                                    : undefined
                            }
                            onRemove={() => onRemove(item.id, keys.type)}
                            onShowProfile={() => onShowProfile(item.user.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className={styles.noFriends}>
                    {t("friends.noAviable", {
                        type: t(`friends.sectionTitle.${keys.noItems}`),
                    })}
                </p>
            )}
        </div>
    );
};

export { FriendsList };
