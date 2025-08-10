import { useTranslation } from "react-i18next";

import settingsIcon from "../../../assets/settings-svgrepo-com.png";

import styles from "./SettingsBtn.module.css";

const SettingsBtn = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <button className={styles.settingsBtn} onClick={onClick}>
            <span className={styles.icon}>
                <img
                    className={styles.settingsImg}
                    src={settingsIcon}
                    alt="profile"
                />
            </span>
            <span className={styles.settingsText}>{t("buttons.settings")}</span>
        </button>
    );
};

export { SettingsBtn };
