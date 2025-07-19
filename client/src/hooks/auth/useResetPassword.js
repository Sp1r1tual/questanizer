import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "./useForm";

import {
    validatePassword,
    validateConfirmPassword,
    ERROR_MESSAGES,
} from "../../utils/validation/validationForm";
import { AuthService } from "../../services/authService";

const useResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [serverError, setServerError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const clearServerError = () => setServerError("");

    const validate = ({ password, confirmPassword }) => {
        const errors = {};

        if (!password || !confirmPassword) {
            errors.fillAllFields = ERROR_MESSAGES.fillAllFields;
        } else {
            if (!validatePassword(password)) {
                errors.password = ERROR_MESSAGES.invalidPassword;
            }

            if (!validateConfirmPassword(password, confirmPassword)) {
                errors.confirmPassword = ERROR_MESSAGES.passwordMismatch;
            }
        }

        return errors;
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

    const { values, errors, handleChange, handleSubmit } = useForm({
        initialValues: { password: "", confirmPassword: "" },
        validate,
        onSubmit,
        clearServerError,
    });

    return {
        password: values.password,
        confirmPassword: values.confirmPassword,
        errors,
        message,
        serverError,
        isLoading,
        handlePasswordChange: handleChange("password"),
        handleConfirmPasswordChange: handleChange("confirmPassword"),
        handleSubmit,
    };
};

export default useResetPassword;
