import useAuthForm from "../../hooks/auth/useAuthForm";
import useAuth from "../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";

import styles from "./AuthForm.module.css";

const AuthForm = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = (credentials) => {
        signIn(credentials);
        navigate("/", { replace: true });
    };

    const {
        username,
        password,
        usernameError,
        passwordError,
        error,
        handleUsernameChange,
        handlePasswordChange,
        handleSubmit,
    } = useAuthForm({ onSubmit });

    return (
        <div className={styles.contentForm}>
            <h2 className={styles.formTitle}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.formLabel}>
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter username"
                        className={`${styles.formInput} ${
                            usernameError ? styles.errorInput : ""
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
                <a href="/register" className={styles.link}>
                    Register here
                </a>
            </p>
        </div>
    );
};

export default AuthForm;
