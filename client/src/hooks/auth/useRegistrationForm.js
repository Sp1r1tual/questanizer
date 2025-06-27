import { useState } from "react";

const ERROR_MESSAGES = {
    fillAllFields: "Please fill out all fields.",
    invalidEmail: "Invalid email format.",
    invalidPassword:
        "Password must be 8-32 characters and include an uppercase letter.",
    passwordMismatch: "Passwords do not match.",
};

const useRegistrationForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validatePassword = (value) =>
        value.length >= 8 && value.length <= 32 && /[A-Z]/.test(value);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError(ERROR_MESSAGES.fillAllFields);
            return;
        }

        if (!validateEmail(email)) {
            setError(ERROR_MESSAGES.invalidEmail);
            return;
        }

        if (!validatePassword(password)) {
            setError(ERROR_MESSAGES.invalidPassword);
            return;
        }

        if (password !== confirmPassword) {
            setError(ERROR_MESSAGES.passwordMismatch);
            return;
        }

        setError("");
        onSubmit({ email, password });
    };

    return {
        email,
        password,
        confirmPassword,
        error,
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    };
};

export default useRegistrationForm;
