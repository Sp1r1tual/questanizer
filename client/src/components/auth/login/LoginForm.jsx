import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/auth/useAuth";
import { useForm } from "@/hooks/auth/useForm";

import { Loader } from "../../ui/loaders/Loader";
import { FormErrors } from "../../ui/forms/FormErrors";

import { validateLoginForm } from "@/utils/validation/validateFormFields";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const { signIn, authError, clearError } = useAuth();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { errors, handleChange, handleSubmit, values, isLoading } = useForm({
    initialValues: { email: "", password: "" },
    validate: validateLoginForm,
  });

  const handleLogin = async (credentials) => {
    const result = await signIn(credentials);

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/", { replace: true });
    }

    return result;
  };

  const allErrors = [errors.fillAllFields, errors.email, errors.password, authError].filter(
    Boolean,
  );

  const handleFieldChange = (event) => {
    if (authError) {
      clearError();
    }

    return handleChange(event);
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
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
            </button>
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
