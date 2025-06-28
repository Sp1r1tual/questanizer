const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePassword = (value) =>
    value.length >= 8 &&
    value.length <= 32 &&
    /[A-Z]/.test(value) &&
    /^[A-Za-z0-9!@#$%^&*()_+\-=]+$/.test(value);

const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};

const ERROR_MESSAGES = {
    fillAllFields: "Please fill out all fields.",
    invalidEmail: "Invalid email format.",
    invalidPassword:
        "Password must be 8-32 characters, include an uppercase letter, and be in Latin",
    passwordMismatch: "Passwords do not match.",
};

export {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    ERROR_MESSAGES,
};
