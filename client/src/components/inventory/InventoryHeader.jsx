import { useTranslation } from "react-i18next";

import chestImage from "@/assets/chest.jpeg";

import styles from "./InventoryHeader.module.css";

const InventoryHeader = () => {
  const { t } = useTranslation();

  return (
    <>
      <img src={chestImage} alt="market-banner" className={styles.img} />
      <h2 className={styles.title}>{t("inventory.inventoryHeader")}</h2>
    </>
  );
};

export { InventoryHeader };
