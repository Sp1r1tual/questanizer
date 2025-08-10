import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { openItemModal } from "../../store/market/marketSlice";

import styles from "./MarketItem.module.css";

const MarketItem = ({ item }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleViewDetails = () => {
        dispatch(openItemModal(item));
    };

    return (
        <div className={styles.card} onClick={handleViewDetails}>
            <h3 className={styles.title}>{item.name}</h3>
            <img src={item.itemImg} alt={item.name} className={styles.img} />
            <p className={styles.price}>
                {t("market.price")}: {item.price} 🪙
            </p>
        </div>
    );
};

export { MarketItem };
