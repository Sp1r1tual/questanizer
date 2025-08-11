import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/auth/useAuth";
import { useForm } from "@/hooks/auth/useForm";

import { Loader } from "../ui/loaders/Loader";

import { validateLoginForm } from "@/utils/validation/validateFormFields";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
    const { signIn, authError, clearError } = useAuth();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const form = useForm({
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

    const allErrors = [
        form.errors.fillAllFields,
        form.errors.email,
        form.errors.password,
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
                <h2 className={styles.formTitle}>{t("auth.login.title")}</h2>
                <form onSubmit={form.handleSubmit(handleLogin)} noValidate>
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
                            className={`${styles.formInput} ${
                                form.errors.email || form.errors.fillAllFields
                                    ? styles.errorInput
                                    : ""
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
                            value={form.values.password}
                            onChange={handleFieldChange}
                            className={`${styles.formInput} ${
                                form.errors.password ||
                                form.errors.fillAllFields
                                    ? styles.errorInput
                                    : ""
                            }`}
                            placeholder={t("shared.passwordPlaceholder")}
                            autoComplete="current-password"
                        />
                    </div>

                    {allErrors.length > 0 && (
                        <div className={styles.error} role="alert">
                            <p>{allErrors.map((err) => t(err)).join(", ")}</p>
                        </div>
                    )}

                    <div className={styles.buttons}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={form.isLoading}
                        >
                            {form.isLoading
                                ? t("auth.login.loading")
                                : t("auth.login.submit")}
                        </button>
                    </div>
                </form>

                <p className={styles.registerLink}>
                    {t("auth.login.forgotQuestion")}{" "}
                    <Link
                        to="/forgot-password"
                        className={styles.link}
                        onClick={clearError}
                    >
                        {t("auth.login.forgotLink")}
                    </Link>
                </p>

                <p className={styles.registerLink}>
                    {t("auth.login.noAccount")}{" "}
                    <Link
                        to="/registration"
                        className={styles.link}
                        onClick={clearError}
                    >
                        {t("auth.login.registerLink")}
                    </Link>
                </p>
            </div>
        </>
    );
};

export { LoginForm };
