import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ErrorBoundary } from "react-error-boundary";

import styles from "./ErrorBoundaryWrapper.module.css";

const ErrorBoundaryWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();

  const fallbackRender = ({ error, resetErrorBoundary }) => {
    return (
      <div className={styles.errorWrapper}>
        <div role="alert" className={styles.errorAlert}>
          <p className={styles.errorText}>{t("errors.somethingWentWrong")}:</p>
          <pre className={styles.errorMessage}>{error.message}</pre>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => {
                setResetKey((prev) => prev + 1);
                resetErrorBoundary();
              }}
              className={styles.retryButton}
            >
              {t("errors.tryAgain")}
            </button>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              {t("errors.goBack")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallbackRender={fallbackRender} resetKeys={[resetKey, location.pathname]}>
      {children}
    </ErrorBoundary>
  );
};

export { ErrorBoundaryWrapper };
