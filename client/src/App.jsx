import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

import { ErrorBoundaryWrapper } from "./components/errors/ErrorBoundaryWrapper";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import styles from "./App.module.css";

const App = () => {
  return (
    <SkeletonTheme baseColor="#d9c2a8" highlightColor="#F5EFE9">
      <ErrorBoundaryWrapper>
        <Outlet />
      </ErrorBoundaryWrapper>
      <ToastContainer position="top-right" autoClose={5000} className={styles.toastContainer} />
    </SkeletonTheme>
  );
};

export { App };
