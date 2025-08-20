import { useTranslation } from "react-i18next";

import styles from "./DifficultyContent.module.css";

const DifficultyContent = ({ difficulty, onSelectDifficulty, onBack, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div>
        <div className={styles.difficultyButtons}>
          <button
            type="button"
            className={`${styles.difficultyButton} ${styles.easy} ${
              difficulty === "easy" ? styles.selected : ""
            }`}
            onClick={() => onSelectDifficulty("easy")}
          >
            {t("shared.easy")}
          </button>

          <button
            type="button"
            className={`${styles.difficultyButton} ${styles.medium} ${
              difficulty === "medium" ? styles.selected : ""
            }`}
            onClick={() => onSelectDifficulty("medium")}
          >
            {t("shared.medium")}
          </button>

          <button
            type="button"
            className={`${styles.difficultyButton} ${styles.hard} ${
              difficulty === "hard" ? styles.selected : ""
            }`}
            onClick={() => onSelectDifficulty("hard")}
          >
            {t("shared.hard")}
          </button>

          <button
            type="button"
            className={`${styles.difficultyButton} ${styles.critical} ${
              difficulty === "critical" ? styles.selected : ""
            }`}
            onClick={() => onSelectDifficulty("critical")}
          >
            {t("shared.critical")}
          </button>
        </div>
      </div>
      <div className={styles.actionButtons}>
        <button type="button" className={styles.backButtonCustom} onClick={onBack}>
          {t("shared.back")}
        </button>
        <button
          type="button"
          className={styles.confirmButtonCustom}
          onClick={onConfirm}
          disabled={!difficulty}
        >
          {t("shared.confirm")}
        </button>
      </div>
    </div>
  );
};

export { DifficultyContent };
