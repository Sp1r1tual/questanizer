import styles from "./UserGold.module.css";

const UserGold = ({ gold }) => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>🪙</div>
            <div className={styles.info}>
                <div className={styles.text}>Gold: {gold}</div>
            </div>
        </div>
    );
};

export { UserGold };
