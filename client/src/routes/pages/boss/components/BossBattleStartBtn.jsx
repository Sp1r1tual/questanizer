import styles from "./BossBattleStartBtn.module.css";

const BossBattleStartBtn = ({ onClick }) => {
    return (
        <button type="button" className={styles.startBtn} onClick={onClick}>
            Start a boss fight
        </button>
    );
};

export { BossBattleStartBtn };
