import useResetPassword from "../../../hooks/auth/useResetPasswordForm";

import Loader from "../../../components/ui/Loader";

import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
    const {
        password,
        confirmPassword,
        errors,
        message,
        serverError,
        isLoading,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    } = useResetPassword();

    const allErrors = [
        errors.fillAllFields,
        errors.password,
        errors.confirmPassword,
        serverError,
    ].filter(Boolean);

    return (
        <div className={styles.resetPassword}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Reset Your Password</h2>
                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                    noValidate
                >
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={`${styles.input} ${
                            errors.password || errors.fillAllFields
                                ? styles.inputError
                                : ""
                        }`}
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className={`${styles.input} ${
                            errors.confirmPassword || errors.fillAllFields
                                ? styles.inputError
                                : ""
                        }`}
                        autoComplete="new-password"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? "Processing..." : "Reset password"}
                    </button>
                    {allErrors.length > 0 && (
                        <div className={styles.error}>
                            <p>{allErrors.join(", ")}</p>
                        </div>
                    )}
                    {message && (
                        <div className={styles.success}>
                            <p>{message}</p>
                        </div>
                    )}
                </form>
            </div>
            <Loader visible={isLoading} />
        </div>
    );
};

export default ResetPassword;
