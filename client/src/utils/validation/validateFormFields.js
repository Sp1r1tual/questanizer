import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    errorMessages,
} from "./validateForm";

const checkRequiredFields = (values, requiredFields) => {
    const emptyFields = requiredFields.filter(
        (field) => !values[field]?.trim()
    );

    return emptyFields.length > 0
        ? { fillAllFields: errorMessages.fillAllFields }
        : {};
};

const validateLoginForm = (values) => {
    const requiredFieldsError = checkRequiredFields(values, [
        "email",
        "password",
    ]);

    if (Object.keys(requiredFieldsError).length > 0) {
        return requiredFieldsError;
    }

    const errors = {};

    if (!validateEmail(values.email)) {
        errors.email = errorMessages.invalidEmail;
    }

    if (!validatePassword(values.password)) {
        errors.password = errorMessages.invalidPassword;
    }

    return errors;
};

const validateRegistrationForm = (values) => {
    const requiredFieldsError = checkRequiredFields(values, [
        "email",
        "password",
        "confirmPassword",
    ]);

    if (Object.keys(requiredFieldsError).length > 0) {
        return requiredFieldsError;
    }

    const errors = {};

    if (!validateEmail(values.email)) {
        errors.email = errorMessages.invalidEmail;
    }

    if (!validatePassword(values.password)) {
        errors.password = errorMessages.invalidPassword;
    }

    if (!validateConfirmPassword(values.password, values.confirmPassword)) {
        errors.confirmPassword = errorMessages.passwordMismatch;
    }

    return errors;
};

const validateResetPasswordForm = (values) => {
    const requiredFieldsError = checkRequiredFields(values, [
        "password",
        "confirmPassword",
    ]);

    if (Object.keys(requiredFieldsError).length > 0) {
        return requiredFieldsError;
    }

    const errors = {};

    if (!validatePassword(values.password)) {
        errors.password = errorMessages.invalidPassword;
    }

    if (!validateConfirmPassword(values.password, values.confirmPassword)) {
        errors.confirmPassword = errorMessages.passwordMismatch;
    }

    return errors;
};

const validateForgotPasswordForm = (values) => {
    const requiredFieldsError = checkRequiredFields(values, ["email"]);

    if (Object.keys(requiredFieldsError).length > 0) {
        return { email: errorMessages.fillAllFields };
    }

    const errors = {};

    if (!validateEmail(values.email)) {
        errors.email = errorMessages.invalidEmail;
    }

    return errors;
};

export {
    validateLoginForm,
    validateRegistrationForm,
    validateResetPasswordForm,
    validateForgotPasswordForm,
};
