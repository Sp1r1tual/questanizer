import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./RouteErrorFallback.module.css";

const RouteErrorFallback = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <p className={styles.errorText}>{t("errors.somethingWentWrong")}:</p>
        <pre className={styles.errorMessage}>{message}</pre>

        <button className={styles.retryButton} onClick={() => navigate("/")}>
          {t("errors.returnHome")}
        </button>
      </div>
    </div>
  );
};

export { RouteErrorFallback };
