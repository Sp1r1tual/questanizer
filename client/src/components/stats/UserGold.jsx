import { useTranslation } from "react-i18next";

import styles from "./UserGold.module.css";

const UserGold = ({ gold }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.icon}>🪙</div>
            <div className={styles.info}>
                <div className={styles.text}>
                    {t("shared.gold")}: {gold}
                </div>
            </div>
        </div>
    );
};

export { UserGold };
