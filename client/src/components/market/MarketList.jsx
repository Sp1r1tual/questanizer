import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchMarket } from "../../store/market/marketThunks";
import { MarketItem } from "./MarketItem";
import { DotsLoader } from "../ui/loaders/DotsLoader";

import styles from "./MarketList.module.css";

const MarketList = () => {
    const dispatch = useDispatch();
    const { marketItems, isLoading, error } = useSelector(
        (state) => state.market
    );

    useEffect(() => {
        dispatch(fetchMarket());
    }, [dispatch]);

    if (isLoading) {
        return <DotsLoader />;
    }

    if (error) {
        return <div className={styles.error}>Upload error: {error}</div>;
    }

    if (!marketItems.length) {
        return <div className={styles.empty}>No items available</div>;
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
