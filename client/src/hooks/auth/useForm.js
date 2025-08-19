import { useState } from "react";
import { useSelector } from "react-redux";

const useForm = ({ initialValues, validate }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const isLoading = useSelector((state) => state.auth.isLoading);

  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setValues((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== field && key !== "fillAllFields"),
      );
    });
  };

  const validateAll = () => {
    const validationErrors = validate ? validate(values) : {};

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (onSubmit) => (event) => {
    event.preventDefault();

    if (!validateAll()) {
      return;
    }

    setMessage("");

    const result = onSubmit(values);

    return result;
  };

  const setSuccessMessage = (msg) => {
    setMessage(msg);
  };

  const clearMessages = () => {
    setMessage("");
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
    message,
    handleChange,
    handleSubmit,
    getFieldProps,
    setSuccessMessage,
    clearMessages,
    resetForm,
    validateAll,
    setMessage,
  };
};

export { useForm };
