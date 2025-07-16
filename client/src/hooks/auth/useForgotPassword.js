import { useState } from "react";
import useForm from "./useForm";
import { AuthService } from "../../services/authService";
import {
    validateEmail,
    ERROR_MESSAGES,
} from "../../utils/validation/validationForm";

const useForgotPassword = () => {
    const [serverError, setServerError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validate = ({ email }) => {
        const errors = {};

        if (!email) {
            errors.email = ERROR_MESSAGES.fillAllFields;
        } else if (!validateEmail(email)) {
            errors.email = ERROR_MESSAGES.invalidEmail;
        }

        return errors;
    };

    const onSubmit = async ({ email }) => {
        setIsLoading(true);
        setServerError("");
        try {
            const response = await AuthService.requestPasswordReset(email);

            setMessage(
                response.data.message || "Check your email for the reset link"
            );
        } catch (error) {
            const resData = error.response?.data;

            if (resData?.errors?.length) {
                const detail = resData.errors.map((e) => e.msg).join("\n");
                setServerError(`${resData.message}:\n${detail}`);
            } else {
                setServerError(
                    resData?.message || "Failed to send reset email"
                );
            }
            setMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        initialValues: { email: "" },
        validate,
        onSubmit,
    });

    return {
        email: values.email,
        errors,
        serverError,
        message,
        isLoading,
        handleEmailChange: handleChange("email"),
        handleSubmit,
    };
};

export default useForgotPassword;
