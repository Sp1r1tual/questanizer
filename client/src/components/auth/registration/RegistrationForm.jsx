import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/auth/useAuth";
import { useForm } from "@/hooks/auth/useForm";
import { useTermsAgreement } from "@/hooks/auth/useTermsAgreement";

import { Loader } from "../../ui/loaders/Loader";
import { FormErrors } from "../../ui/forms/FormErrors";
import { SubmitBtn } from "../../ui/buttons/SubmitBtn";
import { Terms } from "../../terms/Terms";

import { validateRegistrationForm } from "@/utils/validation/validateFormFields";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const { registerUser, authError, clearError } = useAuth();

  const { t } = useTranslation();

  const {
    showTerms,
    setShowTerms,
    setPendingCredentials,
    hasAcceptedTerms,
    acceptTerms,
    declineTerms,
  } = useTermsAgreement();

  const {
    values,
    errors,
    isLoading,
    message,
    handleChange,
    handleSubmit,
    resetForm,
    setSuccessMessage,
    clearMessages,
  } = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateRegistrationForm,
  });

  const handleRegistration = async ({ email, password }) => {
    const action = await registerUser({ email, password });

    if (action.meta.requestStatus === "fulfilled") {
      resetForm();

      setSuccessMessage(`Activation link was sent to ${email}💌`);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    }

    return action;
  };

  const handleFormSubmit = (formValues) => {
    clearMessages();

    if (hasAcceptedTerms) {
      handleRegistration(formValues);
    } else {
      setPendingCredentials(formValues);
      setShowTerms(true);
    }
  };

  const handleAccept = () => acceptTerms(handleRegistration);

  const allErrors = [...Object.values(errors).filter(Boolean), authError].filter(Boolean);

  const handleFieldChange = (event) => {
    handleChange(event);

    if (authError) clearError();

    if (message) clearMessages();
  };

  return (
    <>
      <Terms isOpen={showTerms} onAccept={handleAccept} onDecline={declineTerms} />

      {isLoading && <Loader />}

      <div className={styles.contentForm}>
        <h2 className={styles.formTitle}>{t("auth.registration.title")}</h2>

        {message && <div className={styles.successMessage}>{message}</div>}

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

          <FormErrors errors={allErrors} t={t} />

          <div className={styles.buttons}>
            <SubmitBtn isLoading={isLoading} loadingText={t("auth.login.loading")}>
              {t("auth.login.submit")}
            </SubmitBtn>
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
