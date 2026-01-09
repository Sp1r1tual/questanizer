import { useTranslation } from "react-i18next";

import expSvg from "@/assets/star-rate-svgrepo-com.svg";

import styles from "./UserExperience.module.css";

const UserExperience = ({ experience, level }) => {
  const { t } = useTranslation();

  const expToNext = level * 100;
  const progressPercent = Math.round((experience / expToNext) * 100);

  return (
    <div className={styles.container}>
      <img src={expSvg} className={styles.icon} />
      <div className={styles.info}>
        <div className={styles.text}>
          {t("shared.level")} {level}, XP: {experience}/{expToNext}
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${progressPercent}%` }}
            data-testid="progress-bar-fill"
          />
        </div>
      </div>
    </div>
  );
};

export { UserExperience };
