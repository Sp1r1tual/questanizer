import { useTranslation } from "react-i18next";

import { useChat } from "@/hooks/chat/useChat";

import { DotsLoader } from "../../ui/loaders/DotsLoader";
import { MessageList } from "../MessageList";

import { isSocketConnected } from "@/sockets/chatSocket";

import styles from "./ChatModal.module.css";

const ChatModal = ({ isOpen, onClose, userId }) => {
  const {
    text,
    setText,
    isLoading,
    error,
    currentChatUserId,
    currentChatUserName,
    currentUserId,
    messages,
    handleSend,
    handleRemoveMessage,
  } = useChat(userId, isOpen);

  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>
            {t("chat.chatWith")} {currentChatUserName || currentChatUserId}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <DotsLoader />
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>
                {t("errors.error")} {t(error)}
              </p>
              <a href="/" className={styles.retryButton}>
                {t("errors.returnHome")}
              </a>
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentUserId={String(currentUserId)}
              onRemoveMessage={handleRemoveMessage}
            />
          )}
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.inputField}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("chat.writeMessage")}
              disabled={!isSocketConnected()}
            />
            <button
              onClick={handleSend}
              className={styles.sendButton}
              disabled={!text.trim() || !isSocketConnected()}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChatModal };
