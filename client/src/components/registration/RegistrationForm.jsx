import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/auth/useAuth";
import { useForm } from "@/hooks/auth/useForm";
import { useTermsAgreement } from "@/hooks/auth/useTermsAgreement";

import { Loader } from "../ui/loaders/Loader";
import { Terms } from "../terms/Terms";

import { validateRegistrationForm } from "@/utils/validation/validateFormFields";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const { registerUser, authError, clearError } = useAuth();

  const { setSuccessMessage, errors, handleChange, handleSubmit, message, values, isLoading } =
    useForm({
      initialValues: { email: "", password: "", confirmPassword: "" },
      validate: validateRegistrationForm,
    });

  const {
    showTerms,
    setShowTerms,
    setPendingCredentials,
    hasAcceptedTerms,
    acceptTerms,
    declineTerms,
  } = useTermsAgreement();

  const { t } = useTranslation();

  const handleRegistration = async ({ email, password }) => {
    const action = await registerUser({ email, password });

    if (action.meta.requestStatus === "fulfilled") {
      setSuccessMessage(`Activation link was sent to ${email}💌`);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    }

    return action;
  };

  const handleFormSubmit = (values) => {
    if (hasAcceptedTerms) {
      handleRegistration(values);
    } else {
      setPendingCredentials(values);
      setShowTerms(true);
    }
  };

  const handleAccept = () => acceptTerms(handleRegistration);

  const allErrors = [
    errors.fillAllFields,
    errors.email,
    errors.password,
    errors.confirmPassword,
    authError,
  ].filter(Boolean);

  const handleFieldChange = (event) => {
    return handleChange(event);
  };

  return (
    <>
      <Terms isOpen={showTerms} onAccept={handleAccept} onDecline={declineTerms} />

      {isLoading && <Loader />}

      <div className={styles.contentForm}>
        <h2 className={styles.formTitle}>{t("auth.registration.title")}</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} aria-label="registration form" noValidate>
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
              placeholder={t("shared.emailPlaceholder")}
              className={`${styles.formInput} ${
                errors.email || errors.fillAllFields ? styles.errorInput : ""
              }`}
              aria-invalid={!!(errors.email || errors.fillAllFields)}
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
              placeholder={t("shared.passwordPlaceholder")}
              className={`${styles.formInput} ${
                errors.password || errors.fillAllFields ? styles.errorInput : ""
              }`}
              aria-invalid={!!(errors.password || errors.fillAllFields)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              {t("auth.registration.confirmLabel")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleFieldChange}
              placeholder={t("auth.registration.confirmPlaceholder")}
              className={`${styles.formInput} ${
                errors.confirmPassword || errors.fillAllFields ? styles.errorInput : ""
              }`}
              aria-invalid={!!(errors.confirmPassword || errors.fillAllFields)}
              autoComplete="new-password"
            />
          </div>

          {allErrors.length > 0 && (
            <div className={styles.error} role="alert">
              <p>{allErrors.map((err) => t(err)).join(", ")}</p>
            </div>
          )}

          {message && (
            <div className={styles.success} role="alert">
              <p>{message}</p>
            </div>
          )}

          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? t("auth.registration.loading") : t("auth.registration.submit")}
            </button>
          </div>
        </form>

        <p className={styles.registerLink}>
          {t("auth.registration.haveAccount")}{" "}
          <Link to="/login" className={styles.link} onClick={clearError}>
            {t("auth.registration.loginLink")}
          </Link>
        </p>
      </div>
    </>
  );
};

export { RegistrationForm };
