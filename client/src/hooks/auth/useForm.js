import { useState } from "react";

const useForm = ({ initialValues, validate }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setValues((prev) => ({ ...prev, [field]: value }));

        setErrors((prev) => {
            const { [field]: _, fillAllFields, ...next } = prev;
            return next;
        });

        if (serverError) {
            setServerError("");
        }
    };

    const validateAll = () => {
        const validationErrors = validate ? validate(values) : {};

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = (onSubmit) => async (event) => {
        event.preventDefault();

        if (!validateAll()) {
            return;
        }

        setIsLoading(true);
        setServerError("");
        setMessage("");

        try {
            const result = await onSubmit(values);

            return result;
        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                    error.message ||
                    "An error occurred"
            );
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const setSuccessMessage = (msg) => {
        setMessage(msg);
        setServerError("");
    };

    const clearMessages = () => {
        setMessage("");
        setServerError("");
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        clearMessages();
    };

    const getFieldProps = (field) => ({
        value: values[field] || "",
        onChange: handleChange(field),
        error: errors[field] || errors.fillAllFields,
    });

    return {
        values,
        errors,
        isLoading,
        serverError,
        message,
        handleChange,
        handleSubmit,
        getFieldProps,
        setSuccessMessage,
        clearMessages,
        resetForm,
        validateAll,
        setServerError,
        setMessage,
        setIsLoading,
    };
};

export { useForm };
