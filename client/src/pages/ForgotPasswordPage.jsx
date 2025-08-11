import { useTranslation } from "react-i18next";

import { useForm } from "@/hooks/auth/useForm";

import { Loader } from "@/components/ui/loaders/Loader";
import { ChangeLanguageBtn } from "@/components/ui/buttons/changeLanguageBtn";

import { AuthService } from "@/services/authService";

import { validateForgotPasswordForm } from "@/utils/validation/validateFormFields";

import backgroundImg from "@/assets/login-background.png";

import styles from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
    const form = useForm({
        initialValues: { email: "" },
        validate: validateForgotPasswordForm,
    });

    const { t } = useTranslation();

    const handleSubmit = async ({ email }) => {
        const response = await AuthService.requestPasswordReset(email);

        form.setMessage(
            response.data.message || "Check your email for the reset link"
        );

        return response;
    };

    const allErrors = [
        form.errors.fillAllFields,
        form.errors.email,
        form.serverError,
    ].filter(Boolean);

    const handleFieldChange = (event) => {
        if (form.serverError) form.setServerError("");

        return form.handleChange(event);
    };

    return (
        <>
            <Loader visible={form.isLoading} />
            <div
                className={styles.forgotPasswordWrapper}
                style={{ backgroundImage: `url(${backgroundImg})` }}
            >
                <div className={styles.forgotPassword}>
                    <div className={styles.languageBtnWrapper}>
                        <ChangeLanguageBtn />
                    </div>
                    <div className={styles.contentForm}>
                        <h2 className={styles.formTitle}>
                            {t("auth.forgotPassword.title")}
                        </h2>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            noValidate
                        >
                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="email"
                                    className={styles.formLabel}
                                >
                                    {t("shared.emailLabel")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={form.values.email}
                                    name="email"
                                    onChange={handleFieldChange}
                                    placeholder={t("shared.emailLabel")}
                                    className={`${styles.formInput} ${
                                        form.errors.email ||
                                        form.errors.fillAllFields
                                            ? styles.errorInput
                                            : ""
                                    }`}
                                    autoComplete="email"
                                />
                            </div>

                            {allErrors.length > 0 && (
                                <div className={styles.error} role="alert">
                                    <p>
                                        {allErrors
                                            .map((err) => t(err))
                                            .join(", ")}
                                    </p>
                                </div>
                            )}

                            {form.message && (
                                <div className={styles.success} role="alert">
                                    <p>{t("auth.forgotPassword.success")}</p>
                                </div>
                            )}

                            <div className={styles.buttons}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={form.isLoading}
                                >
                                    {form.isLoading
                                        ? t("shared.saving")
                                        : t("auth.forgotPassword.sendLink")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export { ForgotPasswordPage };
