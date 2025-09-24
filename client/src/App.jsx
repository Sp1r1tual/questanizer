import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { useImagesLoaded } from "./hooks/ui/useImagesLoad";

import { PreLoader } from "./components/ui/loaders/PreLoader";
import { ErrorBoundaryWrapper } from "./components/errors/ErrorBoundaryWrapper";

import { checkAuth } from "./store/auth/authThunks";

import "react-toastify/dist/ReactToastify.css";
import styles from "./App.module.css";

const App = () => {
  const dispatch = useDispatch();
  const isBootstrapping = useSelector((state) => state.auth.isBootstrapping);
  const imagesLoaded = useImagesLoaded();

  useEffect(() => {
    if (isBootstrapping) {
      dispatch(checkAuth());
    }
  }, [dispatch, isBootstrapping]);

  const showPreloader = isBootstrapping || !imagesLoaded;

  return (
    <>
      {showPreloader && <PreLoader fadeOut={!isBootstrapping && imagesLoaded} />}
      <ErrorBoundaryWrapper>
        <Outlet />
      </ErrorBoundaryWrapper>
      <ToastContainer position="top-right" autoClose={5000} className={styles.toastContainer} />
    </>
  );
};

export { App };
