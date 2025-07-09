import { useDispatch } from "react-redux";

import { resetStats } from "../../store/stats/userStatsThunks";
import { resetBoss } from "../../store/boss/bossBattleSlice";

import styles from "./DefeatUserModal.module.css";

const DefeatUserModal = ({ onRestart }) => {
    const dispatch = useDispatch();

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
                <h2>Defeat</h2>
                <p>You have lost all your HP❤️. Can we start again?⚡</p>
                <button onClick={handleRestart} className={styles.button}>
                    Start a new epic adventure🧭
                </button>
            </div>
        </div>
    );
};

export default DefeatUserModal;
