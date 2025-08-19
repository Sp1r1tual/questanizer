import { useTranslation } from "react-i18next";

import { ChangeLanguageBtn } from "../ui/buttons/changeLanguageBtn";

import styles from "./SettingsList.module.css";

const SettingsList = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.settingsList}>
      <div className={styles.wrapper}>
        <p>{t("settings.language")}</p>
        <ChangeLanguageBtn />
      </div>
    </div>
  );
};

export { SettingsList };
