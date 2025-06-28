import { useState } from "react";

const useForm = ({ initialValues, validate, onSubmit, clearServerError }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const clearFieldError = (field) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
        clearServerError?.();
    };

    const handleChange = (field) => (event) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }));
        clearFieldError(field);
    };

    const validateAll = () => {
        const validationErrors = validate(values);

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateAll()) {
            onSubmit(values);
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    };
};

export default useForm;
