import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useForm } from "@/hooks/auth/useForm";

import { Loader } from "@/components/ui/loaders/Loader";
import { ChangeLanguageBtn } from "@/components/ui/buttons/changeLanguageBtn";
import { FormErrors } from "../../ui/forms/FormErrors";
import { FormSuccess } from "../../ui/forms/FormSuccess";
import { BackgroundLayout } from "../../../layouts/BackgroundLayout";

import { requestResetPassword } from "@/store/auth/authThunks";
import { validateResetPasswordForm } from "@/utils/validation/validateFormFields";

import styles from "./ResetPasswordView.module.css";

const ResetPasswordView = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { token } = useParams();

  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  const { errors, handleChange, values, handleSubmit } = useForm({
    initialValues: { password: "", confirmPassword: "" },
    validate: validateResetPasswordForm,
  });

  const handleFieldChange = (event) => handleChange(event);

  const onResetPassword = async ({ password }) => {
    const action = await dispatch(requestResetPassword({ token, password }));

    if (requestResetPassword.fulfilled.match(action)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  const allErrors = [errors.fillAllFields, errors.password, errors.confirmPassword, error].filter(
    Boolean,
  );

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
            <form onSubmit={handleSubmit(onResetPassword)} className={styles.form} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  {t("auth.resetPassword.newPassword")}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleFieldChange}
                  placeholder={t("auth.resetPassword.newPassword")}
                  className={`${styles.input} ${
                    errors.password || errors.fillAllFields ? styles.inputError : ""
                  }`}
                  aria-invalid={!!(errors.password || errors.fillAllFields)}
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  {t("auth.resetPassword.confirmPassword")}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleFieldChange}
                  placeholder={t("auth.resetPassword.confirmPassword")}
                  className={`${styles.input} ${
                    errors.confirmPassword || errors.fillAllFields ? styles.inputError : ""
                  }`}
                  aria-invalid={!!(errors.confirmPassword || errors.fillAllFields)}
                  autoComplete="new-password"
                />
              </div>

              <FormErrors errors={allErrors} t={t} />
              <FormSuccess message={success ? "auth.resetPassword.success" : ""} t={t} />

              <div className={styles.buttons}>
                <button type="submit" className={styles.button} disabled={isLoading || success}>
                  {isLoading ? t("shared.saving") : t("auth.resetPassword.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </BackgroundLayout>
    </>
  );
};

export { ResetPasswordView };
