import { useTranslation } from "react-i18next";

import styles from "./MarketHeader.module.css";

const MarketHeader = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className={styles.header}>{t("market.marketHeader")}</h2>
    </>
  );
};

export { MarketHeader };
