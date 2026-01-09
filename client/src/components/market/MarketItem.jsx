import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { MarketItemSkeleton } from "../ui/skeletons/MarketItemSkeleton";

import { openItemModal } from "@/store/market/marketSlice";

import goldSvg from "@/assets/coin-svgrepo-com.svg";

import styles from "./MarketItem.module.css";

const MarketItem = ({ item, isLoading }) => {
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    setLoaded(false);
  }, [item?.itemImg]);

  const handleViewDetails = () => {
    if (!isLoading) {
      dispatch(openItemModal(item));
    }
  };

  if (isLoading) {
    return <MarketItemSkeleton showAmount={false} />;
  }

  return (
    <div className={styles.card} onClick={handleViewDetails}>
      <h3 className={styles.title}>{item.name}</h3>

      {!loaded && <div className={styles.skeletonImage} />}

      <img
        src={item.itemImg}
        alt={item.name}
        className={`${styles.img} ${loaded ? styles.visible : styles.hidden}`}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      <p className={styles.price}>
        {t("market.price")}: {item.price}
        <img src={goldSvg} alt="gold" className={styles.goldIcon} />
      </p>
    </div>
  );
};

export { MarketItem };
