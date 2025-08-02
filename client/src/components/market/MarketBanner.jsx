import { MarketGreeting } from "../market/MarketGreeting";

import marketBannerDesktopImg from "../../assets/market-banner-desktop.jpeg";
import marketBannerMobileImg from "../../assets/market-banner-mobile.png";

import styles from "./MarketBanner.module.css";

const MarketBanner = () => {
    return (
        <div className={styles.bannerWrapper}>
            <MarketGreeting />
            <picture>
                <source
                    srcSet={marketBannerMobileImg}
                    media="(max-width: 768px)"
                />
                <img
                    src={marketBannerDesktopImg}
                    alt="market-banner"
                    className={styles.img}
                />
            </picture>
        </div>
    );
};

export { MarketBanner };
