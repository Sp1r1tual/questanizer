import styles from "./BossStats.module.css";

const BossStats = () => {
    return (
        <div className={styles.bossStats}>
            <h3 className={styles.bossName}>Назва боса</h3>

            <div className={styles.statsRow}>
                <div className={styles.statBlock}>
                    <span className={styles.statText}>💚Health: 75/100</span>
                    <progress
                        className={`${styles.progressBar} ${styles.health}`}
                        max="100"
                        value={75}
                    ></progress>
                </div>

                <div className={styles.statBlock}>
                    <span className={styles.statText}>⚡Power: 50/100</span>
                    <progress
                        className={`${styles.progressBar} ${styles.power}`}
                        max="100"
                        value={50}
                    ></progress>
                </div>

                <div className={styles.statBlock}>
                    <span className={styles.statText}>🔥Rage: 100/100</span>
                    <progress
                        className={`${styles.progressBar} ${styles.rage}`}
                        max="100"
                        value={100}
                    ></progress>
                </div>
            </div>
        </div>
    );
};

export default BossStats;
