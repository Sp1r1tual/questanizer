import { useState } from "react";

const useForm = ({ initialValues, validate, onSubmit }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (event) => {
        const value = event.target.value;

        setValues((prev) => ({ ...prev, [field]: value }));

        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const validateAll = () => {
        const validationErrors = validate(values);

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateAll()) {
            await onSubmit(values);
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        setErrors,
    };
};

export default useForm;
