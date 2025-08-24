import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Loader } from "@/components/ui/loaders/Loader";
import { ChangeLanguageBtn } from "@/components/ui/buttons/ChangeLangBtn";

import { requestForgotPassword } from "@/store/auth/authThunks";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

import styles from "./ForgotPasswordView.module.css";

const ForgotPasswordView = () => {
  const dispatch = useDispatch();

  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  const { isLoading, error } = useSelector((state) => state.auth);

  const { t } = useTranslation();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmitForm = async ({ email }) => {
    const action = await dispatch(requestForgotPassword(email));
    if (requestForgotPassword.fulfilled.match(action)) {
      setCooldown(60);
      setSuccess(true);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.forgotPassword}>
        <div className={styles.languageBtnWrapper}>
          <ChangeLanguageBtn />
        </div>
        <div className={styles.contentForm}>
          <h2 className={styles.formTitle}>{t("auth.forgotPassword.title")}</h2>
          <ForgotPasswordForm
            onSubmitForm={onSubmitForm}
            isLoading={isLoading}
            cooldown={cooldown}
            success={success}
            error={error}
            t={t}
            setSuccess={setSuccess}
          />
        </div>
      </div>
    </>
  );
};

export { ForgotPasswordView };
