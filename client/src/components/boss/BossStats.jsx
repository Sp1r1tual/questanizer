import { useSelector } from "react-redux";

import styles from "./BossStats.module.css";

const BossStats = () => {
    const boss = useSelector((state) => state.bossBattle);

    if (!boss.bossId) return null;

    return (
        <div className={styles.bossStats}>
            <h3 className={styles.bossName}>{boss.bossName}</h3>
            <div className={styles.statsContainer}>
                <div className={styles.statBlock}>
                    <span className={styles.statText}>
                        💚 Health: {boss.healthPoints}/{boss.maxHealth}
                    </span>
                    <progress
                        className={`${styles.progressBar} ${styles.health}`}
                        max={boss.maxHealth}
                        value={boss.healthPoints}
                    ></progress>
                </div>

                <div className={styles.statBlock}>
                    <span className={styles.statText}>
                        🔥 Rage: {boss.rage}/{boss.bossRageBar}
                    </span>
                    <progress
                        className={`${styles.progressBar} ${styles.rage}`}
                        max={boss.bossRageBar}
                        value={boss.rage}
                    ></progress>
                </div>

                <div className={styles.statBlock}>
                    <span className={styles.statText}>
                        ⚔️ Power: {boss.bossPower}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BossStats;
