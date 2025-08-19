import { useTranslation } from "react-i18next";

import { SettingsList } from "../SettingsList";

import styles from "./SettingsModal.module.css";

const SettingsModal = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>

        <h2>{t("settings.settingsHeader")}</h2>
        <SettingsList />
      </div>
    </div>
  );
};

export { SettingsModal };
