import { useState } from "react";
import { useLoginForm } from "../../../../hooks/auth/useLoginForm";
import { useAuth } from "../../../../hooks/auth/useAuth";
import { useNavigate, Link } from "react-router-dom";

import { Loader } from "../../../../components/ui/Loader";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
    const { signIn, authError, clearError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (credentials) => {
        setIsLoading(true);
        try {
            const result = await signIn(credentials);

            if (result.meta.requestStatus === "fulfilled") {
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        email,
        password,
        errors,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
    } = useLoginForm({ onSubmit, clearServerError: clearError });

    const allErrors = [
        errors.fillAllFields,
        errors.email,
        errors.password,
        authError,
    ].filter(Boolean);

    return (
        <>
            <Loader visible={isLoading} />
            <div className={styles.contentForm}>
                <h2 className={styles.formTitle}>Login</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            className={`${styles.formInput} ${
                                errors.email || errors.fillAllFields
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
                            value={password}
                            onChange={handlePasswordChange}
                            className={`${styles.formInput} ${
                                errors.password || errors.fillAllFields
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
                            disabled={isLoading}
                        >
                            Login
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
