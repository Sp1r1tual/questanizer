import { useLocation } from "react-router-dom";

import welcomeBg from "@/assets/login-background.png";
import taskBg from "@/assets/main-background.png";
import bossBg from "@/assets/boss-fight-background.png";
import marketBg from "@/assets/market-background.png";
import inventoryBg from "@/assets/inventory-background.png";
import supportBg from "@/assets/support-background.png";

import styles from "./BackgroundLayout.module.css";

const backgrounds = {
  "/": taskBg,
  "/boss": bossBg,
  "/market": marketBg,
  "/inventory": inventoryBg,
  "/faq": supportBg,
};

const allBackgrounds = {
  welcome: welcomeBg,
  task: taskBg,
  boss: bossBg,
  market: marketBg,
  inventory: inventoryBg,
  support: supportBg,
};

const BackgroundLayout = ({ children }) => {
  const location = useLocation();

  const currentBg = backgrounds[location.pathname] || welcomeBg;

  return (
    <div className={styles.bgWrapper}>
      {Object.values(allBackgrounds).map((bg) => (
        <div
          key={bg}
          className={`${styles.bg} ${bg === currentBg ? styles.active : ""}`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export { BackgroundLayout };
