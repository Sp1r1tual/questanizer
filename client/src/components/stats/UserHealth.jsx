import styles from "./UserHealth.module.css";

const UserHealth = ({ health, maxHealth }) => {
    const healthPercent = Math.round((health / maxHealth) * 100);

    return (
        <div className={styles.container}>
            <div className={styles.icon}>❤️</div>
            <div className={styles.info}>
                <div className={styles.text}>
                    HP: {health}/{maxHealth}
                </div>
                <div className={styles.bar}>
                    <div
                        className={styles.fill}
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserHealth;
