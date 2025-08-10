import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { resetStats } from "../../../store/stats/userStatsThunks";
import { resetBoss } from "../../../store/boss/bossBattleSlice";

import styles from "./DefeatUserModal.module.css";

const DefeatUserModal = ({ onRestart }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleRestart = async () => {
        try {
            await dispatch(resetStats()).unwrap();
            dispatch(resetBoss());
            onRestart();
        } catch (error) {
            console.error("Reset failed", error);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{t("defeat.title")}</h2>
                <p>{t("defeat.message")}</p>
                <button onClick={handleRestart} className={styles.button}>
                    {t("defeat.restartButton")}
                </button>
            </div>
        </div>
    );
};

export { DefeatUserModal };
