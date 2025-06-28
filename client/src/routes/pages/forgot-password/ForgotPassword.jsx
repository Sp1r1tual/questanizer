import { useState } from "react";

import { AuthService } from "../../../services/authService";
import Loader from "../../../components/ui/Loader";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await AuthService.requestPasswordReset(email);
            setMessage(
                response.data.message || "Check your email for the reset link"
            );
            setError("");
        } catch (error) {
            const resData = error.response?.data;

            if (resData && Array.isArray(resData.errors)) {
                const fieldErrors = resData.errors
                    .map((error) => error.msg)
                    .join("\n");
                setError(`${resData.message}:\n${fieldErrors}`);
            } else {
                setError(resData?.message || "Failed to send reset email");
            }

            setMessage("");
        } finally {
            setIsLoading(false);
        }
    };

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
                        onChange={(e) => setEmail(e.target.value)}
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
