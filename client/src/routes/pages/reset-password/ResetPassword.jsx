import { useState } from "react";
import useResetPassword from "../../../hooks/auth/useResetPasswordForm";
import { useParams, useNavigate } from "react-router-dom";

import { AuthService } from "../../../services/authService";
import Loader from "../../../components/ui/Loader";

import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const clearServerError = () => {
        setServerError("");
    };

    const onSubmit = async ({ password }) => {
        setIsLoading(true);

        try {
            await AuthService.resetPassword(token, password);
            setMessage("Password has been reset. Redirecting to login...");
            setServerError("");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setServerError(
                error.response?.data?.message || "Failed to reset password."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const {
        password,
        confirmPassword,
        errors,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    } = useResetPassword({ onSubmit, clearServerError });

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
