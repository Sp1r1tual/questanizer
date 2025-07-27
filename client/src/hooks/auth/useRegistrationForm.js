import { useForm } from "./useForm";

import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    ERROR_MESSAGES,
} from "../../utils/validation/validationForm";

const useRegistrationForm = ({ onSubmit, clearServerError }) => {
    const validate = ({ email, password, confirmPassword }) => {
        const errors = {};

        if (!email || !password || !confirmPassword) {
            errors.fillAllFields = ERROR_MESSAGES.fillAllFields;
        } else {
            if (!validateEmail(email)) {
                errors.email = ERROR_MESSAGES.invalidEmail;
            }

            if (!validatePassword(password)) {
                errors.password = ERROR_MESSAGES.invalidPassword;
            }

            if (
                validatePassword(password) &&
                !validateConfirmPassword(password, confirmPassword)
            ) {
                errors.confirmPassword = ERROR_MESSAGES.passwordMismatch;
            }
        }

        return errors;
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate,
        onSubmit,
        clearServerError,
    });

    return {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        errors,
        handleEmailChange: handleChange("email"),
        handlePasswordChange: handleChange("password"),
        handleConfirmPasswordChange: handleChange("confirmPassword"),
        handleSubmit,
    };
};

export { useRegistrationForm };
