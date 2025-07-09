import useForm from "./useForm";

import { ERROR_MESSAGES } from "../../utils/validation/validationForm";
import { AuthService } from "../../services/authService";

const useForgotPassword = () => {
    const validate = ({ email }) => {
        const errors = {};

        if (!email) {
            errors.fillAllFields = ERROR_MESSAGES.fillAllFields;
        }

        return errors;
    };

    const onSubmit = async (
        { email },
        { setErrors, setMessage, setLoading }
    ) => {
        setLoading(true);
        try {
            const response = await AuthService.requestPasswordReset(email);

            setMessage(
                response.data.message || "Check your email for the reset link"
            );
            setErrors({});
        } catch (error) {
            const resData = error.response?.data;

            if (resData && Array.isArray(resData.errors)) {
                const fieldErrors = resData.errors
                    .map((errors) => errors.msg)
                    .join("\n");

                setErrors({ server: `${resData.message}:\n${fieldErrors}` });
            } else {
                setErrors({
                    server: resData?.message || "Failed to send reset email",
                });
            }
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    const { values, errors, isLoading, message, handleChange, handleSubmit } =
        useForm({
            initialValues: { email: "" },
            validate,
            onSubmit,
        });

    return {
        email: values.email,
        errors,
        message,
        isLoading,
        handleEmailChange: handleChange("email"),
        handleSubmit,
    };
};

export default useForgotPassword;
