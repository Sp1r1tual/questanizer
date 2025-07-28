import {
    useRouteError,
    isRouteErrorResponse,
    useNavigate,
} from "react-router-dom";

import styles from "./RouteErrorFallback.module.css";

const RouteErrorFallback = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let message;

    if (isRouteErrorResponse(error)) {
        message = `${error.status} ${error.statusText}`;
    } else if (error instanceof Error) {
        message = error.message;
    } else {
        message = "Unknown error";
    }

    return (
        <div className={styles.errorWrapper}>
            <div role="alert" className={styles.errorAlert}>
                <p className={styles.errorText}>Something went wrong:</p>
                <pre className={styles.errorMessage}>{message}</pre>

                <button
                    className={styles.retryButton}
                    onClick={() => navigate("/")}
                >
                    Return to home page
                </button>
            </div>
        </div>
    );
};

export { RouteErrorFallback };
