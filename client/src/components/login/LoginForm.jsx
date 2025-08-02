import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useForm } from "../../hooks/auth/useForm";

import { validateLoginForm } from "../../utils/validation/validateFormFields";
import { Loader } from "../../components/ui/loaders/Loader";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
    const { signIn, authError, clearError } = useAuth();
    const navigate = useNavigate();

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
                <h2 className={styles.formTitle}>Login</h2>
                <form onSubmit={form.handleSubmit(handleLogin)} noValidate>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
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
                            placeholder="Enter email"
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Password
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
                            placeholder="Enter password"
                            autoComplete="current-password"
                        />
                    </div>

                    {allErrors.length > 0 && (
                        <div className={styles.error} role="alert">
                            <p>{allErrors.join(", ")}</p>
                        </div>
                    )}

                    <div className={styles.buttons}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={form.isLoading}
                        >
                            {form.isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className={styles.registerLink}>
                    Forgot your password?{" "}
                    <Link
                        to="/forgot-password"
                        className={styles.link}
                        onClick={clearError}
                    >
                        Recover it here
                    </Link>
                </p>

                <p className={styles.registerLink}>
                    Don't have an account?{" "}
                    <Link
                        to="/registration"
                        className={styles.link}
                        onClick={clearError}
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </>
    );
};

export { LoginForm };
