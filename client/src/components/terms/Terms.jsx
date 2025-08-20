import { useTranslation } from "react-i18next";

import { Modal } from "../ui/modals/Modal";

import styles from "./Terms.module.css";

const Terms = ({ isOpen, onAccept, onDecline }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onDecline} size="large" closeBtn={false}>
      <div className={styles.terms}>
        <h2 className={styles.title}>Terms & Conditions</h2>
        <div className={styles.content}>{t("termsAndConditions")}</div>
        <div className={styles.actions}>
          <button onClick={onDecline} className={styles.declineBtn}>
            {t("shared.refuse")}
          </button>
          <button onClick={onAccept} className={styles.acceptBtn}>
            {t("shared.agree")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export { Terms };
