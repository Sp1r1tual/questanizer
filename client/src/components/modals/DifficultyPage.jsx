import styles from "./DifficultyPage.module.css";

const DifficultyPage = ({
    difficulty,
    onSelectDifficulty,
    onBack,
    onConfirm,
}) => {
    return (
        <div>
            <div className={styles.difficultyButtons}>
                {["easy", "medium", "hard", "critical"].map((level) => (
                    <button
                        key={level}
                        type="button"
                        className={`${styles.difficultyButton} ${
                            styles[level]
                        } ${difficulty === level ? styles.selected : ""}`}
                        onClick={() => onSelectDifficulty(level)}
                    >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                ))}
            </div>
            <div className={styles.actionButtons}>
                <button
                    type="button"
                    className={styles.backButtonCustom}
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className={styles.confirmButtonCustom}
                    onClick={onConfirm}
                    disabled={!difficulty}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default DifficultyPage;
