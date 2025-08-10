import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useForm } from "../../hooks/auth/useForm";
import { useTranslation } from "react-i18next";

import { validateRegistrationForm } from "../../utils/validation/validateFormFields";
import { Loader } from "../ui/loaders/Loader";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
    const { registerUser, authError, clearError } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const form = useForm({
        initialValues: { email: "", password: "", confirmPassword: "" },
        validate: validateRegistrationForm,
    });

    const handleRegistration = async ({ email, password }) => {
        const action = await registerUser({ email, password });

        if (action.meta.requestStatus === "fulfilled") {
            form.setSuccessMessage(`Activation link was sent to ${email}💌`);

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        }

        return action;
    };

    const allErrors = [
        form.errors.fillAllFields,
        form.errors.email,
        form.errors.password,
        form.errors.confirmPassword,
        authError,
    ].filter(Boolean);

    const handleFieldChange = (event) => {
        if (authError) {
            clearError();
        }

        return form.handleChange(event);
    };

    return (
        <>
            <Loader visible={form.isLoading} />
            <div className={styles.contentForm}>
                <h2 className={styles.formTitle}>
                    {t("auth.registration.title")}
                </h2>
                <form
                    onSubmit={form.handleSubmit(handleRegistration)}
                    aria-label="registration form"
                    noValidate
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            {t("shared.emailLabel")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.values.email}
                            onChange={handleFieldChange}
                            placeholder={t("shared.emailPlaceholder")}
                            className={`${styles.formInput} ${
                                form.errors.email || form.errors.fillAllFields
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    form.errors.email ||
                                    form.errors.fillAllFields
                                )
                            }
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
                            value={form.values.password}
                            onChange={handleFieldChange}
                            placeholder={t("shared.passwordPlaceholder")}
                            className={`${styles.formInput} ${
                                form.errors.password ||
                                form.errors.fillAllFields
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    form.errors.password ||
                                    form.errors.fillAllFields
                                )
                            }
                            autoComplete="new-password"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label
                            htmlFor="confirmPassword"
                            className={styles.formLabel}
                        >
                            {t("auth.registration.confirmLabel")}
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.values.confirmPassword}
                            onChange={handleFieldChange}
                            placeholder={t(
                                "auth.registration.confirmPlaceholder"
                            )}
                            className={`${styles.formInput} ${
                                form.errors.confirmPassword ||
                                form.errors.fillAllFields
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    form.errors.confirmPassword ||
                                    form.errors.fillAllFields
                                )
                            }
                            autoComplete="new-password"
                        />
                    </div>

                    {allErrors.length > 0 && (
                        <div className={styles.error} role="alert">
                            <p>{allErrors.map((err) => t(err)).join(", ")}</p>
                        </div>
                    )}

                    {form.message && (
                        <div className={styles.success} role="alert">
                            <p>{form.message}</p>
                        </div>
                    )}

                    <div className={styles.buttons}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={form.isLoading}
                        >
                            {form.isLoading
                                ? t("auth.registration.loading")
                                : t("auth.registration.submit")}
                        </button>
                    </div>
                </form>

                <p className={styles.registerLink}>
                    {t("auth.registration.haveAccount")}{" "}
                    <Link
                        to="/login"
                        className={styles.link}
                        onClick={clearError}
                    >
                        {t("auth.registration.loginLink")}
                    </Link>
                </p>
            </div>
        </>
    );
};

export { RegistrationForm };
