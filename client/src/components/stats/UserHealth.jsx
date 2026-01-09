import hpSvg from "@/assets/heart-loving-svgrepo-com.svg";

import styles from "./UserHealth.module.css";

const UserHealth = ({ health, maxHealth }) => {
  const healthPercent = Math.round((health / maxHealth) * 100);

  return (
    <div className={styles.container}>
      <img src={hpSvg} className={styles.icon} />
      <div className={styles.info}>
        <div className={styles.text}>
          HP: {health}/{maxHealth}
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${healthPercent}%` }}
            data-testid="health-bar-fill"
          />
        </div>
      </div>
    </div>
  );
};

export { UserHealth };
