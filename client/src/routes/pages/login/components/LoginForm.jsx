import { useState } from "react";
import useAuthForm from "../../../../hooks/auth/useLoginForm";
import useAuth from "../../../../hooks/auth/useAuth";
import { useNavigate, Link } from "react-router-dom";

import Loader from "../../../../components/ui/Loader";

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
        emailError,
        passwordError,
        error,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
    } = useAuthForm({ onSubmit });

    const displayError = error || authError;

    return (
        <>
            <Loader visible={isLoading} />
            <div className={styles.contentForm}>
                <h2 className={styles.formTitle}>Login</h2>
                <form
                    onSubmit={handleSubmit}
                    aria-label="login form"
                    noValidate
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter email"
                            className={`${styles.formInput} ${
                                emailError ? styles.errorInput : ""
                            }`}
                            aria-invalid={emailError}
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
                            placeholder="Enter password"
                            className={`${styles.formInput} ${
                                passwordError ? styles.errorInput : ""
                            }`}
                            aria-invalid={passwordError}
                        />
                    </div>

                    {displayError && (
                        <p className={styles.error} role="alert">
                            {displayError}
                        </p>
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
                    Don't have an account?{" "}
                    <Link
                        to="/registration"
                        className={styles.link}
                        onClick={() => clearError()}
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </>
    );
};

export default LoginForm;
