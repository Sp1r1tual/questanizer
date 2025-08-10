import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { fetchMarket } from "../../store/market/marketThunks";
import { MarketItem } from "./MarketItem";
import { DotsLoader } from "../ui/loaders/DotsLoader";

import styles from "./MarketList.module.css";

const MarketList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { marketItems, isLoading, error } = useSelector(
        (state) => state.market
    );

    useEffect(() => {
        if (!marketItems || marketItems.length === 0) {
            dispatch(fetchMarket());
        }
    }, [dispatch, marketItems]);

    if (isLoading) {
        return <DotsLoader />;
    }

    if (error) {
        return (
            <div className={styles.error}>
                {t("errors.somethingWentWrong")}: {error}
            </div>
        );
    }

    if (!marketItems.length) {
        return <div className={styles.empty}>{t("shared.noItems")}</div>;
    }

    return (
        <div className={styles.grid}>
            {marketItems.map((item) => (
                <MarketItem key={item._id} item={item} />
            ))}
        </div>
    );
};

export { MarketList };
