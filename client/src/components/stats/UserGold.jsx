import { useTranslation } from "react-i18next";

import goldSvg from "@/assets/coin-svgrepo-com.svg";

import styles from "./UserGold.module.css";

const UserGold = ({ gold }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={goldSvg} className={styles.icon} />
      <div className={styles.info}>
        <div className={styles.text}>
          {t("shared.gold")}: {gold}
        </div>
      </div>
    </div>
  );
};

export { UserGold };
