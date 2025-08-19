import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import styles from "./BossStats.module.css";

const BossStats = () => {
  const boss = useSelector((state) => state.bossBattle);

  const { t } = useTranslation();

  if (!boss.bossId) return null;

  return (
    <div className={styles.bossStats}>
      <h3 className={styles.bossName}>{boss.bossName}</h3>
      <div className={styles.statsContainer}>
        <div className={styles.statBlock}>
          <span className={styles.statText}>
            💚 {t("shared.health")}: {boss.healthPoints}/{boss.maxHealthPoints}
          </span>
          <progress
            className={`${styles.progressBar} ${styles.health}`}
            max={boss.maxHealthPoints}
            value={boss.healthPoints}
            aria-label="Health"
          />
        </div>

        <div className={styles.statBlock}>
          <span className={styles.statText}>
            🔥 {t("boss.rage")}: {boss.rage}/{boss.bossRageBar}
          </span>
          <progress
            className={`${styles.progressBar} ${styles.rage}`}
            max={boss.bossRageBar}
            value={boss.rage}
            aria-label="Rage"
          />
        </div>

        <div className={styles.statBlock}>
          <span className={styles.statText}>
            ⚔️ {t("boss.power")}: {boss.bossPower}
          </span>
        </div>
      </div>
    </div>
  );
};

export { BossStats };
