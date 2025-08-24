import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Loader } from "@/components/ui/loaders/Loader";
import { ChangeLanguageBtn } from "@/components/ui/buttons/ChangeLangBtn";
import { BackgroundLayout } from "../../../layouts/BackgroundLayout";

import { requestResetPassword } from "@/store/auth/authThunks";
import { ResetPasswordForm } from "./ResetPasswordForm";

import styles from "./ResetPasswordView.module.css";

const ResetPasswordView = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { token } = useParams();

  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  const onResetPassword = async ({ password }) => {
    const action = await dispatch(requestResetPassword({ token, password }));

    if (requestResetPassword.fulfilled.match(action)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <BackgroundLayout>
        <div className={styles.resetPassword}>
          <div className={styles.languageBtnWrapper}>
            <ChangeLanguageBtn />
          </div>
          <div className={styles.container}>
            <h2 className={styles.heading}>{t("auth.resetPassword.title")}</h2>
            <ResetPasswordForm
              onSubmitForm={onResetPassword}
              isLoading={isLoading}
              success={success}
              error={error}
              t={t}
            />
          </div>
        </div>
      </BackgroundLayout>
    </>
  );
};

export { ResetPasswordView };
