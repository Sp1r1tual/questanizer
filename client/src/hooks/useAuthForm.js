import { useState } from "react";

const useAuthForm = ({ onSubmit, onClose }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [hasTypedUsername, setHasTypedUsername] = useState(false);
    const [hasTypedPassword, setHasTypedPassword] = useState(false);

    const validateUsername = (value) => value.length >= 6 && value.length <= 20;
    const validatePassword = (value) =>
        value.length >= 8 && value.length <= 20 && /[A-Z]/.test(value);

    const handleUsernameChange = (event) => {
        const value = event.target.value;

        setUsername(value);

        if (!hasTypedUsername && value) setHasTypedUsername(true);
        setUsernameError(hasTypedUsername && !validateUsername(value));

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

        const isUsernameValid = validateUsername(username);
        const isPasswordValid = validatePassword(password);

        if (!username || !password) {
            setError("Please enter both username and password.");
            setUsernameError(!username);
            setPasswordError(!password);
            return;
        }

        if (!isUsernameValid) {
            setError("Username must be between 6 and 20 characters.");
            setUsernameError(true);
            return;
        }

        if (!isPasswordValid) {
            setError(
                "Password must be between 8 and 20 english characters and contain at least one uppercase letter."
            );
            setPasswordError(true);
            return;
        }

        setError("");
        setUsernameError(false);
        setPasswordError(false);
        onSubmit({ username, password });
    };

    const handleCancel = () => {
        setUsername("");
        setPassword("");
        setError("");
        setUsernameError(false);
        setPasswordError(false);
        setHasTypedUsername(false);
        setHasTypedPassword(false);
        onClose();
    };

    return {
        username,
        password,
        usernameError,
        passwordError,
        error,
        handleUsernameChange,
        handlePasswordChange,
        handleSubmit,
        handleCancel,
    };
};

export default useAuthForm;
