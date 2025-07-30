import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/auth/useForm";

import { validateResetPasswordForm } from "../../utils/validation/validateFormFields";
import { AuthService } from "../../services/authService";
import { Loader } from "../../components/ui/loaders/Loader";

import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { password: "", confirmPassword: "" },
        validate: validateResetPasswordForm,
    });

    const handleSubmit = async ({ password }) => {
        await AuthService.resetPassword(token, password);

        form.setMessage("Password has been reset. Redirecting to login...");
        form.setServerError("");

        setTimeout(() => navigate("/login"), 3000);
    };

    const allErrors = [
        form.errors.fillAllFields,
        form.errors.password,
        form.errors.confirmPassword,
        form.serverError,
    ].filter(Boolean);

    const handleFieldChange = (event) => {
        if (form.serverError) {
            form.setServerError("");
        }

        return form.handleChange(event);
    };

    return (
        <>
            <Loader visible={form.isLoading} />
            <div className={styles.resetPassword}>
                <div className={styles.container}>
                    <h2 className={styles.heading}>Reset Your Password</h2>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className={styles.form}
                        noValidate
                    >
                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.values.password}
                                onChange={handleFieldChange}
                                placeholder="New password"
                                className={`${styles.input} ${
                                    form.errors.password ||
                                    form.errors.fillAllFields
                                        ? styles.inputError
                                        : ""
                                }`}
                                aria-invalid={
                                    !!(
                                        form.errors.password ||
                                        form.errors.fillAllFields
                                    )
                                }
                                autoComplete="new-password"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label
                                htmlFor="confirmPassword"
                                className={styles.label}
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={form.values.confirmPassword}
                                onChange={handleFieldChange}
                                placeholder="Confirm password"
                                className={`${styles.input} ${
                                    form.errors.confirmPassword ||
                                    form.errors.fillAllFields
                                        ? styles.inputError
                                        : ""
                                }`}
                                aria-invalid={
                                    !!(
                                        form.errors.confirmPassword ||
                                        form.errors.fillAllFields
                                    )
                                }
                                autoComplete="new-password"
                            />
                        </div>

                        {allErrors.length > 0 && (
                            <div className={styles.error} role="alert">
                                <p>{allErrors.join(", ")}</p>
                            </div>
                        )}

                        {form.message && (
                            <div className={styles.success} role="alert">
                                <p>{form.message}</p>
                            </div>
                        )}

                        <div className={styles.buttons}>
                            <button
                                type="submit"
                                className={styles.button}
                                disabled={form.isLoading}
                            >
                                {form.isLoading
                                    ? "Processing..."
                                    : "Reset Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export { ResetPassword };
