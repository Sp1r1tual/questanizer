import useForm from "./useForm";

import {
    validateEmail,
    validatePassword,
    ERROR_MESSAGES,
} from "../../utils/validation/validationForm";

const useLoginForm = ({ onSubmit, clearServerError }) => {
    const validate = ({ email, password }) => {
        const errors = {};

        if (!email || !password) {
            errors.fillAllFields = ERROR_MESSAGES.fillAllFields;
            return errors;
        }

        if (!validateEmail(email)) {
            errors.email = ERROR_MESSAGES.invalidEmail;
        }

        if (!validatePassword(password)) {
            errors.password = ERROR_MESSAGES.invalidPassword;
        }

        return errors;
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        initialValues: { email: "", password: "" },
        validate,
        onSubmit,
        clearServerError,
    });

    return {
        email: values.email,
        password: values.password,
        errors,
        handleEmailChange: handleChange("email"),
        handlePasswordChange: handleChange("password"),
        handleSubmit,
    };
};

export default useLoginForm;
