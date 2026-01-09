import { useState } from "react";

import { MarketGreeting } from "../market/MarketGreeting";

import marketBannerDesktopImg from "@/assets/market-banner-desktop.jpeg";
import marketBannerMobileImg from "@/assets/market-banner-mobile.png";

import styles from "./MarketBanner.module.css";

const MarketBanner = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.bannerWrapper}>
      <MarketGreeting />
      <picture>
        {!loaded && <div className={styles.skeleton} />}

        <source srcSet={marketBannerMobileImg} media="(max-width: 768px)" />
        <img
          src={marketBannerDesktopImg}
          alt="market-banner"
          className={styles.img}
          loading="eager"
          onLoad={() => setLoaded(true)}
        />
      </picture>
    </div>
  );
};

export { MarketBanner };
