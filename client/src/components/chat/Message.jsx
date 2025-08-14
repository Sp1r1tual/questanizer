import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Message.module.css";

const Message = ({ message, isMine, currentUserId, onRemove }) => {
    const [hover, setHover] = useState(false);

    const { t } = useTranslation();

    const isRead = message.read && message.readBy.length > 0;
    const showReadStatus = isMine && message.to !== currentUserId;

    return (
        <div
            className={`${styles.messageWrapper} ${
                isMine ? styles.messageMine : styles.messageOther
            }`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div
                className={`${styles.messageContent} ${
                    isMine ? styles.mine : styles.other
                }`}
            >
                <p>{message.text}</p>

                <div className={styles.messageFooter}>
                    <span className={styles.timestamp}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            timeStyle: "short",
                        })}
                    </span>
                    {showReadStatus && (
                        <span
                            className={`${styles.readStatus} ${
                                isRead ? styles.read : styles.unread
                            }`}
                        >
                            {isRead ? "✓✓" : "✓"}
                        </span>
                    )}
                </div>

                {isMine && hover && (
                    <button
                        className={styles.removeBtn}
                        onClick={onRemove}
                        title={t("chat.deleteFromBoth")}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export { Message };
