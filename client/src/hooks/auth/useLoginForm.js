import { useState } from "react";

const useLoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validatePassword = (value) =>
        value.length >= 8 && value.length <= 32 && /[A-Z]/.test(value);

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setEmailError(!validateEmail(value));
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        setPasswordError(!validatePassword(value));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            setEmailError(!isEmailValid);
            setPasswordError(!isPasswordValid);
            setError("Please enter valid email and password.");
            return;
        }

        setError("");
        setEmailError(false);
        setPasswordError(false);
        onSubmit({ email, password });
    };

    return {
        email,
        password,
        emailError,
        passwordError,
        error,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
    };
};

export default useLoginForm;
