import useForgotPassword from "../../../hooks/auth/useForgotPassword";

import Loader from "../../../components/ui/Loader";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const {
        email,
        message,
        error,
        isLoading,
        handleEmailChange,
        handleSubmit,
    } = useForgotPassword();

    return (
        <div className={styles.forgotPassword}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Forgot your password?</h2>
                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                    noValidate
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Send reset link
                    </button>
                    {message && <p className={styles.success}>{message}</p>}
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
            <Loader visible={isLoading} />
        </div>
    );
};

export default ForgotPassword;
