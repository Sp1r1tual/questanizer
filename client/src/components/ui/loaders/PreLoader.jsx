import { useTranslation } from "react-i18next";

import preloaderImage from "@/assets/preloader.gif";

import styles from "./PreLoader.module.css";

const PreLoader = ({ fadeOut = false }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ""}`}>
      <div className={styles.content}>
        <img src={preloaderImage} alt={t("loading.alt")} className={styles.catGif} />
        <p className={styles.loadingText}>{t("preloader")}</p>
      </div>
    </div>
  );
};

export { PreLoader };
