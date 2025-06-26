import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../../../hooks/auth/useAuth";
import useRegistrationForm from "../../../../hooks/auth/useRegistrationForm";

import LoaderModal from "../../../../components/ui/Loader";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
    const { registerUser, authError, resetError } = useAuth();
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
            console.log("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        email,
        password,
        confirmPassword,
        error,
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    } = useRegistrationForm({ onSubmit, resetError });

    return (
        <>
            <LoaderModal visible={isLoading} />
            <div className={styles.contentForm}>
                <h2 className={styles.formTitle}>Register</h2>
                <form onSubmit={handleSubmit} aria-label="registration form">
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
                            className={styles.formInput}
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
                            className={styles.formInput}
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
                            className={styles.formInput}
                        />
                    </div>
                    {(error || authError) && (
                        <p className={styles.error}>{authError || error}</p>
                    )}
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.submitButton}>
                            Register
                        </button>
                    </div>
                </form>

                <p className={styles.registerLink}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.link}>
                        Login here
                    </Link>
                </p>
            </div>
        </>
    );
};

export default RegistrationForm;
