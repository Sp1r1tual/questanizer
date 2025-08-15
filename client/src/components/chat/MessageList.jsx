import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Message } from "./Message";

import styles from "./MessageList.module.css";

const MessageList = ({ messages, currentUserId, onRemoveMessage }) => {
    const bottomRef = useRef(null);

    const { t } = useTranslation();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.messageListWrapper}>
            {messages.length === 0 ? (
                <p>{t("chat.noMessages")}</p>
            ) : (
                <>
                    {messages.map((msg) => {
                        const isMine =
                            String(msg.from) === String(currentUserId);

                        return (
                            <Message
                                key={msg.id}
                                message={msg}
                                isMine={isMine}
                                currentUserId={currentUserId}
                                onRemove={() => onRemoveMessage(msg.id)}
                            />
                        );
                    })}
                    <div ref={bottomRef} />
                </>
            )}
        </div>
    );
};

export { MessageList };
