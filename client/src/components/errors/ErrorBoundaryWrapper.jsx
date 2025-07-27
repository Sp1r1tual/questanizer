import { ErrorBoundary } from "react-error-boundary";

import styles from "./ErrorBoundaryWrapper.module.css";

const ErrorBoundaryWrapper = ({ children }) => {
    const fallbackRender = ({ error, resetErrorBoundary }) => {
        return (
            <div role="alert" className={styles.errorAlert}>
                <p className={styles.errorText}>Something went wrong:</p>
                <pre className={styles.errorMessage}>{error.message}</pre>
                <button
                    onClick={resetErrorBoundary}
                    className={styles.retryButton}
                >
                    Try again
                </button>
            </div>
        );
    };

    return (
        <ErrorBoundary
            fallbackRender={fallbackRender}
            onReset={() => {
                console.log("Reset triggered");
            }}
            onError={(error) => {
                console.error("Boundary error:", error);
            }}
        >
            {children}
        </ErrorBoundary>
    );
};

export { ErrorBoundaryWrapper };
