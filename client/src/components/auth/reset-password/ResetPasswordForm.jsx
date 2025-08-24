import { useForm } from "@/hooks/auth/useForm";

import { FormErrors } from "../../ui/forms/FormErrors";
import { FormSuccess } from "../../ui/forms/FormSuccess";
import { SubmitBtn } from "../../ui/buttons/SubmitBtn";

import { validateResetPasswordForm } from "@/utils/validation/validateFormFields";

import styles from "./ResetPasswordForm.module.css";

const ResetPasswordForm = ({ onSubmitForm, isLoading, success, error, t }) => {
  const { values, errors, handleChange, handleSubmit, clearMessages } = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: validateResetPasswordForm,
  });

  const handleFormSubmit = (formValues) => {
    clearMessages();
    return onSubmitForm(formValues);
  };

  const allErrors = [...Object.values(errors).filter(Boolean), error].filter(Boolean);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          {t("auth.resetPassword.newPassword")}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
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
          onChange={handleChange}
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

      {!success && (
        <div className={styles.buttons}>
          <SubmitBtn
            isLoading={isLoading}
            loadingText={t("shared.saving")}
            className={styles.button}
          >
            {t("auth.resetPassword.submit")}
          </SubmitBtn>
        </div>
      )}
    </form>
  );
};

export { ResetPasswordForm };
