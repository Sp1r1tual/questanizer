import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../../../hooks/auth/useAuth";
import useRegistrationForm from "../../../../hooks/auth/useRegistrationForm";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = ({ email, password }) => {
        signIn({ email, password });
        navigate("/", { replace: true });
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
    } = useRegistrationForm({ onSubmit });

    return (
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
                {error && <p className={styles.error}>{error}</p>}
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
    );
};

export default RegistrationForm;
