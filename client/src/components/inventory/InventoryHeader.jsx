import { useState } from "react";
import { useTranslation } from "react-i18next";

import chestImage from "@/assets/chest.jpeg";

import styles from "./InventoryHeader.module.css";

const InventoryHeader = () => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div className={styles.imageWrapper}>
        {!loaded && <div className={styles.skeleton} />}
        <img
          src={chestImage}
          alt="inventory"
          className={`${styles.img} ${loaded ? styles.loaded : ""}`}
          loading="eager"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <h2 className={styles.title}>{t("inventory.inventoryHeader")}</h2>
    </>
  );
};

export { InventoryHeader };
