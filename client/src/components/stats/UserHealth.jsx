import styles from "./UserHealth.module.css";

const UserHealth = ({ health, maxHealth }) => {
    return (
        <div className={styles.health}>
            <div className={styles.row}>
                <span className={styles.label}>
                    <span className={styles.icon}>❤️</span>
                    HP {health}/{maxHealth}
                </span>
                <progress
                    className={styles.progress}
                    value={health}
                    max={maxHealth ? maxHealth : undefined}
                />
            </div>
        </div>
    );
};

export default UserHealth;
