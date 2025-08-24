import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useForm } from "@/hooks/auth/useForm";
import { useAuth } from "@/hooks/auth/useAuth";

import { Loader } from "../../ui/loaders/Loader";
import { FormErrors } from "../../ui/forms/FormErrors";
import { SubmitBtn } from "../../ui/buttons/SubmitBtn";

import { validateLoginForm } from "@/utils/validation/validateFormFields";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const { signIn, authError, clearError } = useAuth();

  const { t } = useTranslation();

  const {
    values,
    errors,
    isLoading,
    message,
    handleChange,
    handleSubmit,
    setMessage,
    clearMessages,
  } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLoginForm,
  });

  const handleLogin = async (data) => {
    clearMessages();

    const result = await signIn(data);

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/", { replace: true });
    } else {
      if (result.error?.message) {
        setMessage(result.error.message);
      }
    }

    return result;
  };

  const allErrors = [...Object.values(errors).filter(Boolean), authError].filter(Boolean);

  const handleFieldChange = (event) => {
    handleChange(event);

    if (authError) clearError();

    if (message) clearMessages();
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.contentForm}>
        <h2 className={styles.formTitle}>{t("auth.login.title")}</h2>

        <form onSubmit={handleSubmit(handleLogin)} noValidate>
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
              className={`${styles.formInput} ${
                errors.email || errors.fillAllFields ? styles.errorInput : ""
              }`}
              placeholder={t("shared.emailPlaceholder")}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              {t("shared.passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleFieldChange}
              className={`${styles.formInput} ${
                errors.password || errors.fillAllFields ? styles.errorInput : ""
              }`}
              placeholder={t("shared.passwordPlaceholder")}
              autoComplete="current-password"
            />
          </div>

          <FormErrors errors={allErrors} t={t} />

          <div className={styles.buttons}>
            <SubmitBtn isLoading={isLoading} loadingText={t("auth.login.loading")}>
              {t("auth.login.submit")}
            </SubmitBtn>
          </div>
        </form>

        <p className={styles.registerLink}>
          {t("auth.login.forgotQuestion")}{" "}
          <Link to="/forgot-password" className={styles.link} onClick={clearError}>
            {t("auth.login.forgotLink")}
          </Link>
        </p>

        <p className={styles.registerLink}>
          {t("auth.login.noAccount")}{" "}
          <Link to="/registration" className={styles.link} onClick={clearError}>
            {t("auth.login.registerLink")}
          </Link>
        </p>
      </div>
    </>
  );
};

export { LoginForm };
