import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useForm } from "../../hooks/auth/useForm";

import { validateRegistrationForm } from "../../utils/validation/validateFormFields";
import { Loader } from "../ui/loaders/Loader";

import styles from "./RegistrationForm.module.css";

const RegistrationForm = () => {
    const { registerUser, authError, clearError } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { email: "", password: "", confirmPassword: "" },
        validate: validateRegistrationForm,
    });

    const handleRegistration = async ({ email, password }) => {
        const action = await registerUser({ email, password });

        if (action.meta.requestStatus === "fulfilled") {
            form.setSuccessMessage(`Activation link was sent to ${email}💌`);

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        }

        return action;
    };

    const allErrors = [
        form.errors.fillAllFields,
        form.errors.email,
        form.errors.password,
        form.errors.confirmPassword,
        authError,
    ].filter(Boolean);

    const handleFieldChange = (event) => {
        if (authError) {
            clearError();
        }

        return form.handleChange(event);
    };

    return (
        <>
            <Loader visible={form.isLoading} />

            <div className={styles.contentForm}>
                <h2 className={styles.formTitle}>Register</h2>
                <form
                    onSubmit={form.handleSubmit(handleRegistration)}
                    aria-label="registration form"
                    noValidate
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.values.email}
                            onChange={handleFieldChange}
                            placeholder="Enter your email"
                            className={`${styles.formInput} ${
                                form.errors.email || form.errors.fillAllFields
                                    ? styles.errorInput
                                    : ""
                            }`}
                            aria-invalid={
                                !!(
                                    form.errors.email ||
                                    form.errors.fillAllFields
                                )
                            }
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.values.password}
                            onChange={handleFieldChange}
                            placeholder="Enter password"
                            className={`${styles.formInput} ${
                                form.errors.password ||
                                form.errors.fillAllFields
                                    ? styles.errorInput
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
                            className={styles.formLabel}
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.values.confirmPassword}
                            onChange={handleFieldChange}
                            placeholder="Repeat password"
                            className={`${styles.formInput} ${
                                form.errors.confirmPassword ||
                                form.errors.fillAllFields
                                    ? styles.errorInput
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
                            className={styles.submitButton}
                            disabled={form.isLoading}
                        >
                            {form.isLoading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>

                <p className={styles.registerLink}>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className={styles.link}
                        onClick={clearError}
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </>
    );
};

export { RegistrationForm };
