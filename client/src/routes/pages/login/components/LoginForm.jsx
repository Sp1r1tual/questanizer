import useAuthForm from "../../../../hooks/auth/useLoginForm";
import useAuth from "../../../../hooks/auth/useAuth";
import { useNavigate, Link } from "react-router-dom";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = (credentials) => {
        signIn(credentials);
        navigate("/", { replace: true });
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

    return (
        <div className={styles.contentForm}>
            <h2 className={styles.formTitle}>Login</h2>
            <form onSubmit={handleSubmit} aria-label="login form">
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
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.buttons}>
                    <button type="submit" className={styles.submitButton}>
                        Login
                    </button>
                </div>
            </form>
            <p className={styles.registerLink}>
                Don't have an account?{" "}
                <Link to="/registration" className={styles.link}>
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;
