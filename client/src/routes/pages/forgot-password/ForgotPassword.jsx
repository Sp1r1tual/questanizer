import { useForgotPassword } from "../../../hooks/auth/useForgotPassword";

import { Loader } from "../../../components/ui/Loader";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const {
        email,
        message,
        errors,
        serverError,
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
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className={styles.input}
                        autoComplete="email"
                    />
                    <button type="submit" className={styles.button}>
                        Send reset link
                    </button>
                    {message && <p className={styles.success}>{message}</p>}
                    {errors.email && (
                        <p className={styles.error}>{errors.email}</p>
                    )}
                    {serverError && (
                        <p className={styles.error}>{serverError}</p>
                    )}
                </form>
            </div>
            <Loader visible={isLoading} />
        </div>
    );
};

export { ForgotPassword };
