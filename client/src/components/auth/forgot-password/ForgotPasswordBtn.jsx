import { useTranslation } from "react-i18next";

import styles from "./ForgotPasswordBtn.module.css";

const ForgotPasswordBtn = ({ isLoading, cooldown, onClick }) => {
  const { t } = useTranslation();

  let buttonText = t("auth.forgotPassword.sendLink");

  if (isLoading) {
    return (buttonText = t("shared.saving"));
  }

  if (cooldown > 0) {
    return (buttonText = `${t("auth.forgotPassword.resendIn")} ${cooldown}${t("shared.seconds")}`);
  }

  return (
    <button
      type="submit"
      className={styles.submitButton}
      disabled={isLoading || cooldown > 0}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export { ForgotPasswordBtn };
