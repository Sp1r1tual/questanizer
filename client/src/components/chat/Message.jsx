import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Message.module.css";

const Message = ({ message, isMine, currentUserId, onRemove }) => {
  const removeBtnRef = useRef(null);
  const { t } = useTranslation();

  const isRead = message.read && message.readBy.length > 0;
  const showReadStatus = isMine && message.to !== currentUserId;

  const handleMouseEnter = () => {
    if (removeBtnRef.current) {
      removeBtnRef.current.style.opacity = "1";
      removeBtnRef.current.style.pointerEvents = "auto";
    }
  };

  const handleMouseLeave = () => {
    if (removeBtnRef.current) {
      removeBtnRef.current.style.opacity = "0";
      removeBtnRef.current.style.pointerEvents = "none";
    }
  };

  return (
    <div
      className={`${styles.messageWrapper} ${isMine ? styles.messageMine : styles.messageOther}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${styles.messageContent} ${isMine ? styles.mine : styles.other}`}>
        <p>{message.text}</p>

        <div className={styles.messageFooter}>
          <span className={styles.timestamp}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              timeStyle: "short",
            })}
          </span>

          {showReadStatus && (
            <span className={`${styles.readStatus} ${isRead ? styles.read : styles.unread}`}>
              {isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>

        {isMine && (
          <button
            ref={removeBtnRef}
            className={styles.removeBtn}
            onClick={onRemove}
            title={t("chat.deleteFromBoth")}
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export { Message };
