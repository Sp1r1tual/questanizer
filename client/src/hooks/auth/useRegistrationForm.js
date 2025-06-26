import { useState } from "react";

const useRegistrationForm = ({ onSubmit, resetError }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validatePassword = (value) =>
        value.length >= 8 && value.length <= 32 && /[A-Z]/.test(value);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setError("");
        resetError?.();
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setError("");
        resetError?.();
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setError("");
        resetError?.();
    };

    const handleSubmit = (event) => {
        resetError?.();
        event.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }

        if (!validatePassword(password)) {
            setError(
                "Password must be 8-32 characters and include an uppercase letter."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
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
