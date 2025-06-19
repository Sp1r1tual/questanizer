import { useBoss } from "../../../../hooks/boss/useBoss";

import styles from "./BossBattleStartBtn.module.css";

const BossBattleStartBtn = () => {
    const { initBoss } = useBoss();

    return (
        <button className={styles.startBtn} onClick={() => initBoss()}>
            Start a boss fight
        </button>
    );
};

export default BossBattleStartBtn;
