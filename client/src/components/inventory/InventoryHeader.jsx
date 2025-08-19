import { useTranslation } from "react-i18next";

import styles from "./InventoryHeader.module.css";

const InventoryHeader = () => {
  const { t } = useTranslation();

  return <h2 className={styles.title}>{t("inventory.inventoryHeader")}</h2>;
};

export { InventoryHeader };
