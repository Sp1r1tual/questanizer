import { useTranslation } from "react-i18next";

import styles from "./BossBattleStartBtn.module.css";

const BossBattleStartBtn = ({ onClick }) => {
    const { t } = useTranslation();

    return (
        <button type="button" className={styles.startBtn} onClick={onClick}>
            {t("boss.initBossBtn")}
        </button>
    );
};

export { BossBattleStartBtn };
