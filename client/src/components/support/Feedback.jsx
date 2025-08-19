import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CONTACTS } from "../../data/contacts";

import styles from "./Feedback.module.css";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("bug");

  const { t } = useTranslation();

  const handleSend = () => {
    if (!message.trim()) return;

    let subject = "";
    switch (type) {
      case "bug":
        subject = "Bug Report";
        break;
      case "help":
        subject = "Request for Help";
        break;
      case "idea":
        subject = "Idea Suggestion";
        break;
      default:
        subject = "Feedback";
    }

    const body = encodeURIComponent(message);
    const email = CONTACTS.email;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <div className={styles.feedbackWrapper}>
      <h2 className={styles.feedbackTitle}>{t("support.feedback")}</h2>

      <div className={styles.feedbackOptions}>
        <label className={styles.feedbackOption}>
          <input
            type="radio"
            className={styles.feedbackRadio}
            name="feedbackType"
            value="bug"
            checked={type === "bug"}
            onChange={() => setType("bug")}
          />
          {t("support.bugReport")}
        </label>

        <label className={styles.feedbackOption}>
          <input
            type="radio"
            className={styles.feedbackRadio}
            name="feedbackType"
            value="help"
            checked={type === "help"}
            onChange={() => setType("help")}
          />
          {t("support.getSupport")}
        </label>

        <label className={styles.feedbackOption}>
          <input
            type="radio"
            className={styles.feedbackRadio}
            name="feedbackType"
            value="idea"
            checked={type === "idea"}
            onChange={() => setType("idea")}
          />
          {t("support.suggestIdea")}
        </label>
      </div>

      <textarea
        className={styles.feedbackTextarea}
        placeholder={t("support.writeHere")}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button className={styles.feedbackButton} onClick={handleSend}>
        {t("support.send")}
      </button>
    </div>
  );
};

export { Feedback };
