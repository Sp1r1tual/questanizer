import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { openInventoryItemModal } from "@/store/user/inventorySlice";
import { MarketItemSkeleton } from "../ui/skeletons/MarketItemSkeleton";

import styles from "./InventoryItem.module.css";

const InventoryItem = ({ item, isLoading }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleViewDetails = () => {
    if (!isLoading) {
      dispatch(openInventoryItemModal(item));
    }
  };

  if (isLoading) {
    return <MarketItemSkeleton />;
  }

  return (
    <div className={styles.card} onClick={handleViewDetails}>
      {!imageLoaded && <div className={styles.skeletonImage} />}

      <img
        className={`${styles.image} ${imageLoaded ? styles.visible : styles.hidden}`}
        src={`/${item.item.itemImg}`}
        alt={item.item.name}
        loading="eager"
        decoding="async"
        onLoad={() => setImageLoaded(true)}
      />

      <h3 className={styles.title}>{item.item.name}</h3>
      <p className={styles.quantity}>
        {t("shared.quantity")}: {item.quantity}
      </p>
    </div>
  );
};

export { InventoryItem };
