import { useForm } from "../../hooks/auth/useForm";

import { validateForgotPasswordForm } from "../../utils/validation/validateFormFields";
import { AuthService } from "../../services/authService";
import { Loader } from "../../components/ui/loaders/Loader";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const form = useForm({
        initialValues: { email: "" },
        validate: validateForgotPasswordForm,
    });

    const handleSubmit = async ({ email }) => {
        const response = await AuthService.requestPasswordReset(email);

        form.setMessage(
            response.data.message || "Check your email for the reset link"
        );

        return response;
    };

    const allErrors = [
        form.errors.fillAllFields,
        form.errors.email,
        form.serverError,
    ].filter(Boolean);

    const handleFieldChange = (field) => (event) => {
        if (form.serverError) {
            form.setServerError("");
        }

        return form.handleChange(field)(event);
    };

    return (
        <>
            <Loader visible={form.isLoading} />
            <div className={styles.forgotPassword}>
                <div className={styles.container}>
                    <h2 className={styles.heading}>Forgot your password?</h2>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        noValidate
                        className={styles.form}
                    >
                        <input
                            type="email"
                            id="email"
                            value={form.values.email}
                            onChange={handleFieldChange("email")}
                            placeholder="Enter your email"
                            className={styles.input}
                            aria-invalid={
                                !!(
                                    form.errors.email ||
                                    form.errors.fillAllFields
                                )
                            }
                            autoComplete="email"
                        />

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

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={form.isLoading}
                        >
                            {form.isLoading ? "Sending..." : "Send reset link"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export { ForgotPassword };
