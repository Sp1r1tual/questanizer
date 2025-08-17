import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ErrorBoundaryWrapper } from "./components/errors/ErrorBoundaryWrapper";

import "react-toastify/dist/ReactToastify.css";
import styles from "./App.module.css";

const App = () => {
    return (
        <>
            <ErrorBoundaryWrapper>
                <Outlet />
            </ErrorBoundaryWrapper>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                className={styles.toastContainer}
            />
        </>
    );
};

export { App };
