import { useDispatch } from "react-redux";

import { resetStats } from "../../store/stats/userStatsSlice";
import { resetBoss } from "../../store/boss/bossBattleSlice";

import styles from "./DefeatUserModal.module.css";

const DefeatUserModal = ({ onRestart }) => {
    const dispatch = useDispatch();

    const handleRestart = () => {
        dispatch(resetStats());
        dispatch(resetBoss());
        onRestart();
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
