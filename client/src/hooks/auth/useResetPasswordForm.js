import useForm from "./useForm";

import {
    validatePassword,
    validateConfirmPassword,
    ERROR_MESSAGES,
} from "../../utils/validation/validationForm";

const useResetPassword = ({ onSubmit, clearServerError }) => {
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
        handlePasswordChange: handleChange("password"),
        handleConfirmPasswordChange: handleChange("confirmPassword"),
        handleSubmit,
    };
};

export default useResetPassword;
