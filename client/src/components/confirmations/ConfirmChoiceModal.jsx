import { useTranslation } from "react-i18next";

import styles from "./ConfirmChoiceModal.module.css";

const ConfirmChoiceModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      data-testid="backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 id="confirm-modal-title" className={styles.title}>
            {title}
          </h3>
        </div>
        <div className={styles.body}>
          <p id="confirm-modal-desc" className={styles.message}>
            {message}
          </p>
        </div>
        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.confirmBtn}`} onClick={onConfirm}>
            {t("shared.yes")}
          </button>
          <button className={`${styles.button} ${styles.cancelBtn}`} onClick={onClose}>
            {t("shared.no")}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmChoiceModal };
