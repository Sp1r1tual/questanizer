import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../../../hooks/auth/useAuth";
import useRegistrationForm from "../../../../hooks/auth/useRegistrationForm";

import Loader from "../../../../components/ui/Loader";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
    const { registerUser, authError, clearError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }) => {
        try {
            setIsLoading(true);
            const action = await registerUser({ email, password });

            if (action.meta.requestStatus === "fulfilled") {
                alert(`Activation link was sent to ${email}💌`);
                navigate("/login", { replace: true });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        email,
        password,
        confirmPassword,
        error: localError,
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    } = useRegistrationForm({ onSubmit });

    const displayError = localError || authError;

    return (
        <>
            <Loader visible={isLoading} />
            <div className={styles.contentForm}>
                <h2 className={styles.formTitle}>Register</h2>
                <form
                    onSubmit={handleSubmit}
                    aria-label="registration form"
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
                            placeholder="Enter your email"
                            className={`${styles.formInput} ${
                                localError &&
                                localError.toLowerCase().includes("email")
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    localError &&
                                    localError.toLowerCase().includes("email")
                                )
                            }
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
                                localError &&
                                localError.toLowerCase().includes("password")
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    localError &&
                                    localError
                                        .toLowerCase()
                                        .includes("password")
                                )
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label
                            htmlFor="confirmPassword"
                            className={styles.formLabel}
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Repeat password"
                            className={`${styles.formInput} ${
                                localError &&
                                localError.toLowerCase().includes("match")
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    localError &&
                                    localError.toLowerCase().includes("match")
                                )
                            }
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
                            Register
                        </button>
                    </div>
                </form>

                <p className={styles.registerLink}>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className={styles.link}
                        onClick={() => clearError()}
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </>
    );
};

export default RegistrationForm;
