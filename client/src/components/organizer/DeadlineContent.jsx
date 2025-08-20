import { useTranslation } from "react-i18next";

import { useRef } from "react";

import styles from "./DeadlineContent.module.css";

const DeadlineContent = ({
  deadline,
  isDateInvalid,
  onDateChange,
  onAddWithDeadline,
  onAddWithoutDeadline,
  onClose,
}) => {
  const dateInputRef = useRef(null);

  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const handleFocusClick = () => {
    const input = dateInputRef.current;

    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
    input.focus();
  };

  return (
    <>
      <div onClick={handleFocusClick}>
        <input
          id="deadline-date-input"
          ref={dateInputRef}
          type="date"
          value={deadline || ""}
          onChange={onDateChange}
          className={`${styles.dateInput} ${isDateInvalid ? styles.invalidInput : ""}`}
          placeholder="dd/mm/yyyy"
        />
      </div>
      {isDateInvalid && deadline && (
        <p className={styles.error}>
          {t("organizer.organizerModal.uncorrectDateInput", { currentYear })}
        </p>
      )}
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.addWithDeadlineBtn} onClick={onAddWithDeadline}>
          {t("organizer.organizerModal.addWithDeadline")}
        </button>
        <button
          type="button"
          className={styles.addWithoutDeadlineBtn}
          onClick={onAddWithoutDeadline}
        >
          {t("organizer.organizerModal.addWithoutDeadline")}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          {t("shared.cancel")}
        </button>
      </div>
    </>
  );
};

export { DeadlineContent };
