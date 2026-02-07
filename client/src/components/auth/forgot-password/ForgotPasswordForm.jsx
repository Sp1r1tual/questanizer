import { Link } from "react-router-dom";

import { useForm } from "@/hooks/auth/useForm";

import { FormErrors } from "../../ui/forms/FormErrors";
import { FormSuccess } from "../../ui/forms/FormSuccess";
import { SubmitBtn } from "../../ui/buttons/SubmitBtn";

import { validateForgotPasswordForm } from "@/utils/validation/validateFormFields";

import styles from "./ForgotPasswordForm.module.css";

const ForgotPasswordForm = ({
  onSubmitForm,
  isLoading,
  cooldown,
  success,
  error,
  t,
  setSuccess,
}) => {
  const { values, errors, handleChange, handleSubmit, clearMessages } = useForm({
    initialValues: {
      email: "",
    },
    validate: validateForgotPasswordForm,
  });

  const handleFormSubmit = (formValues) => {
    setSuccess(false);
    clearMessages();
    return onSubmitForm(formValues);
  };

  const allErrors = [...Object.values(errors).filter(Boolean), error].filter(Boolean);

  const handleFieldChange = (event) => {
    handleChange(event);

    if (success) setSuccess(false);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
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

        <div
          className={`${styles.formMessagesWrapper} ${
            allErrors.length || success ? styles.active : ""
          }`}
        >
          <FormErrors errors={allErrors} t={t} />
          <FormSuccess message={success ? "auth.forgotPassword.success" : ""} t={t} />
        </div>

        <div className={styles.buttons}>
          <SubmitBtn
            isLoading={isLoading}
            loadingText={t("shared.saving")}
            cooldown={cooldown}
            cooldownTemplate={`${t("auth.forgotPassword.resendIn")} {seconds}${t("shared.seconds")}`}
          >
            {t("auth.forgotPassword.sendLink")}
          </SubmitBtn>
        </div>
      </form>

      <p className={styles.registerLink}>
        <Link to="/login" className={styles.link}>
          {t("shared.back")}
        </Link>
      </p>
    </>
  );
};

export { ForgotPasswordForm };
