import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { DotsLoader } from "../ui/loaders/DotsLoader";
import { InventoryItem } from "./InventoryItem";

import { fetchInventory } from "@/store/user/inventoryThunks";

import styles from "./InventoryList.module.css";

const InventoryList = () => {
  const dispatch = useDispatch();

  const { inventoryItems, isLoading, hasLoaded, error } = useSelector((state) => state.inventory);

  const { t } = useTranslation();

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchInventory());
    }
  }, [dispatch, hasLoaded]);

  if (isLoading) {
    return <DotsLoader />;
  }

  if (error) {
    return (
      <div className={styles.noItems}>
        {t("errors.uploadError")}: {error}
      </div>
    );
  }

  if (!inventoryItems.items?.length) {
    return <div className={styles.noItems}>{t("shared.noItems")}</div>;
  }

  return (
    <div className={styles.grid}>
      {inventoryItems.items.map((item) => (
        <InventoryItem key={item._id} item={item} />
      ))}
    </div>
  );
};

export { InventoryList };
