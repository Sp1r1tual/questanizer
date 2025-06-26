import { useState } from "react";

const useLoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [hasTypedEmail, setHasTypedEmail] = useState(false);
    const [hasTypedPassword, setHasTypedPassword] = useState(false);

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validatePassword = (value) =>
        value.length >= 8 && value.length <= 32 && /[A-Z]/.test(value);

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);

        if (!hasTypedEmail && value) setHasTypedEmail(true);
        setEmailError(hasTypedEmail && !validateEmail(value));

        if (value) setError("");
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);

        if (!hasTypedPassword && value) setHasTypedPassword(true);
        setPasswordError(hasTypedPassword && !validatePassword(value));

        if (value) setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!email || !password) {
            setError("Please enter both email and password.");
            setEmailError(!email);
            setPasswordError(!password);
            return;
        }

        if (!isEmailValid) {
            setError("Please enter a valid email address.");
            setEmailError(true);
            return;
        }

        if (!isPasswordValid) {
            setError(
                "Password must be 8–32 english characters and contain at least one uppercase letter."
            );
            setPasswordError(true);
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
