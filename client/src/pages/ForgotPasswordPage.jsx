import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useForm } from "@/hooks/auth/useForm";

import { Loader } from "@/components/ui/loaders/Loader";
import { ChangeLanguageBtn } from "@/components/ui/buttons/changeLanguageBtn";
import { BackgroundLayout } from "../layouts/BackgroundLayout";

import { requestForgotPassword } from "@/store/auth/authThunks";

import { validateForgotPasswordForm } from "@/utils/validation/validateFormFields";

import styles from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();

  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  const { isLoading, error } = useSelector((state) => state.auth);

  const { errors, handleChange, values, handleSubmit } = useForm({
    initialValues: { email: "" },
    validate: validateForgotPasswordForm,
  });

  const { t } = useTranslation();

  useEffect(() => {
    let timer;

    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleFieldChange = (event) => {
    setSuccess(false);
    return handleChange(event);
  };

  const onSubmitForm = async ({ email }) => {
    const action = await dispatch(requestForgotPassword(email));

    if (requestForgotPassword.fulfilled.match(action)) {
      setCooldown(60);
      setSuccess(true);
    }
  };

  const allErrors = [errors.fillAllFields, errors.email, error].filter(Boolean);

  return (
    <>
      {isLoading && <Loader />}
      <BackgroundLayout>
        <div className={styles.forgotPassword}>
          <div className={styles.languageBtnWrapper}>
            <ChangeLanguageBtn />
          </div>
          <div className={styles.contentForm}>
            <h2 className={styles.formTitle}>{t("auth.forgotPassword.title")}</h2>
            <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  {t("shared.emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleFieldChange}
                  placeholder={t("shared.emailLabel")}
                  className={`${styles.formInput} ${
                    errors.email || errors.fillAllFields ? styles.errorInput : ""
                  }`}
                  autoComplete="email"
                />
              </div>

              {allErrors.length > 0 && (
                <div className={styles.error} role="alert">
                  <p>{allErrors.map((err) => t(err)).join(", ")}</p>
                </div>
              )}

              {success && (
                <div className={styles.success} role="alert">
                  <p>{t("auth.forgotPassword.success")}</p>
                </div>
              )}

              <div className={styles.buttons}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || cooldown > 0}
                >
                  {isLoading
                    ? t("shared.saving")
                    : cooldown > 0
                      ? `${t("auth.forgotPassword.resendIn")} ${cooldown}${t("shared.seconds")}`
                      : t("auth.forgotPassword.sendLink")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </BackgroundLayout>
    </>
  );
};

export { ForgotPasswordPage };
