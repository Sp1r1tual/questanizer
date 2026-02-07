import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loader } from "@/components/ui/loaders/Loader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

import welcomeBg from "@/assets/login-background.png";
import taskBg from "@/assets/main-background.png";
import bossBg from "@/assets/boss-fight-background.png";
import marketBg from "@/assets/market-background.png";
import inventoryBg from "@/assets/inventory-background.png";
import supportBg from "@/assets/support-background.png";

import styles from "./AuthenticatedLayout.module.css";

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

const AuthenticatedLayout = () => {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const currentBg = backgrounds[location.pathname] || taskBg;

  return (
    <div className={styles.page}>
      <div className={styles.backgroundWrapper}>
        {Object.values(allBackgrounds).map((bg) => (
          <div
            key={bg}
            className={`${styles.bg} ${bg === currentBg ? styles.active : ""}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>

      <Navbar />

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export { AuthenticatedLayout };
