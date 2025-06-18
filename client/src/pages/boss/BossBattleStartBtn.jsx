import { useBossBattle } from "../../hooks/useBossBattle";

import styles from "./BossBattleStartBtn.module.css";

const BossBattleStartBtn = () => {
    const { initBoss } = useBossBattle();

    return (
        <button className={styles.startBtn} onClick={() => initBoss(1)}>
            Start a boss fight
        </button>
    );
};

export default BossBattleStartBtn;
