import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import { useImagesLoaded } from "./hooks/ui/useImagesLoad";

import { PreLoader } from "./components/ui/loaders/PreLoader";
import { ErrorBoundaryWrapper } from "./components/errors/ErrorBoundaryWrapper";

import "react-toastify/dist/ReactToastify.css";
import styles from "./App.module.css";

const App = () => {
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const isCheckingAuth = useSelector((state) => state.auth.isCheckingAuth);

  const imagesLoaded = useImagesLoaded();

  const showPreloader = !imagesLoaded || isCheckingAuth;

  return (
    <>
      {showPreloader && <PreLoader fadeOut={isAuthChecked && imagesLoaded} />}
      <ErrorBoundaryWrapper>
        <Outlet />
      </ErrorBoundaryWrapper>
      <ToastContainer position="top-right" autoClose={5000} className={styles.toastContainer} />
    </>
  );
};

export { App };
